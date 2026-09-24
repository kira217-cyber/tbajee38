import express from "express";
import rateLimit from "express-rate-limit";

import GameLaunchSetting from "../models/GameLaunchSetting.js";
import { protectAdmin, requireMother, requireWrite } from "../middleware/protectAdmin.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { loadUsableKey, masterGet } from "../utils/masterApi.js";

/**
 * গেম চালু করা (Oracle launch)।
 *
 * এখন শুধু **ফ্রি ট্রায়াল**: user সিস্টেম নেই, তাই খেলোয়াড়ের কোনো
 * ব্যালেন্স নেই — গেম খোলে `amount: 0` দিয়ে। টাকা কাটা-জমার কিছু নেই,
 * তাই callback এখনো লাগে না। user সিস্টেম এলে এখানে লগইন করা খেলোয়াড়ের
 * রাউট আর `/api/callback` যোগ হবে।
 */
const router = express.Router();

const LAUNCH_TIMEOUT_MS = 30000;
const DEFAULT_LAUNCH_URL = "https://oraclegames.net/api/getgameurl";
const TRIAL_PREFIX = "tbt";

const text = (value) => String(value ?? "").trim();

const loadSetting = () =>
  GameLaunchSetting.findOne().sort({ createdAt: -1 }).select("+launchKey");

/** সার্ভিস একেক নামে লিংকটা ফেরত দেয়, তাই সবগুলোই দেখা হয় */
const extractLaunchUrl = (body) =>
  body?.launch_url ||
  body?.launchUrl ||
  body?.gameUrl ||
  body?.url ||
  body?.data?.launch_url ||
  body?.data?.launchUrl ||
  body?.data?.gameUrl ||
  body?.data?.url ||
  "";

const requestLaunchUrl = async ({ launchUrl, launchKey, payload }) => {
  const res = await fetch(launchUrl, {
    method: "POST",
    headers: { "x-oracle-key": launchKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(LAUNCH_TIMEOUT_MS),
  });
  const body = await res.json().catch(() => ({}));

  return { url: extractLaunchUrl(body), raw: body, status: res.status };
};

/**
 * ট্রায়ালের নাম — ব্রাউজার প্রতি একটা, ১০ অক্ষর (Oracle ছোট হাতের
 * অক্ষরের নাম চায়)। ব্রাউজার নিজের ৭ অক্ষর পাঠায়, সামনে `tbt` বসে —
 * তাই কোনো আসল খেলোয়াড়ের নামের সাথে কখনো মেলে না।
 */
const trialUsername = (guestId) => {
  const id = text(guestId).toLowerCase();
  return /^[a-z]{7}$/.test(id) ? `${TRIAL_PREFIX}${id}` : "";
};

// একই IP থেকে অল্প সময়ে অনেক গেম খোলা ঠেকাতে
const trialLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Too many games opened, try again shortly", code: "tooMany" },
});

/* =========================
   খেলোয়াড় — ফ্রি ট্রায়াল
   ========================= */

router.post("/trial", trialLimiter, async (req, res) => {
  try {
    const gameUId = text(req.body?.game_uid).slice(0, 64);
    const username = trialUsername(req.body?.guestId);

    if (!gameUId || !username) {
      return errorResponse(res, "game_uid and guestId are required", 400, "missingFields");
    }

    const setting = await loadSetting();
    if (!setting?.launchKey || !setting.isActive) {
      return errorResponse(res, "Game launch is not ready", 503, "gameNotReady");
    }

    // শুধু ক্যাটালগে থাকা ও চালু গেম — ব্রাউজার যেকোনো uid পাঠাতে পারে
    const { apiKey } = await loadUsableKey();
    if (!apiKey) return errorResponse(res, "Game catalog is not ready", 503, "gameNotReady");

    let game;
    try {
      game = (await masterGet(`/game/${encodeURIComponent(gameUId)}`, apiKey)).data;
    } catch {
      return errorResponse(res, "Game not found", 404, "gameNotFound");
    }

    const { url, raw } = await requestLaunchUrl({
      launchUrl: text(setting.launchUrl) || DEFAULT_LAUNCH_URL,
      launchKey: setting.launchKey,
      payload: { amount: "0", username, game_uid: gameUId },
    });

    if (!url) {
      // আসল কারণ লগে থাকুক, খেলোয়াড়ের পর্দায় নয়
      console.error("Trial launch failed:", raw);
      return errorResponse(res, "Could not start the game", 502, "gameLaunchFailed");
    }

    return successResponse(res, "Game ready", {
      launchUrl: url,
      trial: true,
      game: { gameUId, name: game?.nameBn || game?.name || "", nameEn: game?.name || "" },
    });
  } catch (error) {
    console.error("Trial launch error:", error.message);
    return errorResponse(res, "Could not start the game", 502, "gameLaunchFailed");
  }
});

/* =========================
   অ্যাডমিন — launch key
   ========================= */

const admin = express.Router();
admin.use(protectAdmin, requireMother);

admin.get("/setting", async (req, res) => {
  try {
    const setting = await loadSetting();
    return successResponse(res, setting ? "Loaded" : "Not configured", {
      setting: setting ? setting.toSafeJSON(setting.launchKey) : null,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

/**
 * কী বসানো বা বদলানো। কী না পাঠিয়ে শুধু ঠিকানা বা চালু/বন্ধ বদলানো
 * যায় — তখন আগের কী-ই থাকে।
 */
admin.put("/setting", requireWrite, async (req, res) => {
  try {
    const launchKey = text(req.body?.launchKey);
    const launchUrl = text(req.body?.launchUrl);

    let setting = await loadSetting();

    if (!setting) {
      if (!launchKey) return errorResponse(res, "Launch key is required", 400);
      setting = new GameLaunchSetting({ launchKey });
    } else if (launchKey) {
      setting.launchKey = launchKey;
      // কী বদলে গেলে আগের যাচাই আর প্রযোজ্য নয়
      setting.isVerified = false;
      setting.lastVerifiedAt = null;
      setting.lastVerifyError = "";
    }

    if (launchUrl) setting.launchUrl = launchUrl;
    if (req.body?.isActive !== undefined) setting.isActive = Boolean(req.body.isActive);

    await setting.save();

    return successResponse(res, "Saved", { setting: setting.toSafeJSON(setting.launchKey) });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

/**
 * সত্যিকারের একটা গেমের লিংক চেয়ে কী যাচাই। gameUId না দিলে ক্যাটালগের
 * প্রথম গেমটা নেওয়া হয়। লিংক খোলা হয় না, আর amount ০ — কারো কিছু যায় না।
 */
admin.post("/test", requireWrite, async (req, res) => {
  try {
    const setting = await loadSetting();
    if (!setting?.launchKey) return errorResponse(res, "Launch key is not set", 400);

    let gameUId = text(req.body?.gameUId);

    if (!gameUId) {
      const { apiKey } = await loadUsableKey();
      if (apiKey) {
        const data = (await masterGet("/game-data", apiKey)).data;
        const first = data?.categories?.flatMap((c) => c.games || []).find((g) => g.gameUId);
        gameUId = first?.gameUId || "";
      }
    }

    if (!gameUId) return errorResponse(res, "gameUId is required (catalog is empty)", 400);

    try {
      const { url, raw } = await requestLaunchUrl({
        launchUrl: text(setting.launchUrl) || DEFAULT_LAUNCH_URL,
        launchKey: setting.launchKey,
        payload: { amount: "0", username: `${TRIAL_PREFIX}keytest`, game_uid: gameUId },
      });

      if (!url) throw new Error(raw?.message || "No launch url received");

      setting.isVerified = true;
      setting.lastVerifiedAt = new Date();
      setting.lastVerifyError = "";
      await setting.save();

      return successResponse(res, "Launch key works", {
        setting: setting.toSafeJSON(setting.launchKey),
        gameUId,
      });
    } catch (error) {
      setting.isVerified = false;
      setting.lastVerifyError = error.message || "Test failed";
      await setting.save();

      return errorResponse(res, setting.lastVerifyError, 400, "gameLaunchFailed");
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.use("/admin", admin);

export default router;
