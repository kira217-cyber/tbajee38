import crypto from "node:crypto";
import express from "express";

import User from "../models/User.js";
import GameHistory from "../models/GameHistory.js";
import GameLaunchSetting from "../models/GameLaunchSetting.js";

import { applyTurnoverProgress } from "../utils/turnoverProgress.js";
import { peekGameInfo, resolveGameInfo } from "../utils/gameInfo.js";
import { num } from "../utils/money.js";

/**
 * গেমের callback — প্রতিটা বাজি আর তার ফলের খবর এখানে আসে (seamless
 * wallet: টাকা থাকে আমাদের server এ, গেম শুধু বলে কত কাটতে/দিতে হবে)।
 *
 * BetChokkor এর callback থেকে নেওয়া, তবে তিনটে ঝুঁকি এখানে বন্ধ:
 *
 *   ১. যাচাই — BetChokkor এ যে কেউ `/api/callback` এ `win_amount` পাঠিয়ে
 *      ব্যালেন্স বাড়াতে পারত (খেলোয়াড় নিজের গেমের নামও জানত)। এখানে
 *      URL এর ভিতরে গোপন টোকেন লাগে: `/api/callback/<token>` — টোকেনটা
 *      admin এর "Game Launch Key" পাতায় দেখা যায়, Oracle/White-label এ
 *      callback URL হিসেবে ওটাই বসাতে হয়। চাইলে `CALLBACK_ALLOWED_IPS`
 *      দিয়ে IP ও বেঁধে দেওয়া যায়।
 *
 *   ২. ব্যালেন্স — আগে পড়ে তারপর নতুন মান `$set` করলে একসাথে দুটো বাজির
 *      একটা হারিয়ে যেত। এখানে যাচাই আর বদল এক ধাপে (atomic)।
 *
 *   ৩. একই রাউন্ড দুবার — দুটো অনুরোধ একসাথে এলে দুটোই "নতুন" দেখে টাকা
 *      দুবার কাটত। এখানে `serialNumber` unique; দ্বিতীয়টা ধরা পড়লে তার
 *      টাকা ফেরত দিয়ে DUPLICATE।
 *
 * ভুল হলেও HTTP 200, ভিতরে `success: false` — মাস্টার এভাবেই পড়ে, আর
 * 500 দিলে সে একই রাউন্ড বারবার পাঠাতে থাকত।
 */
const router = express.Router();

/** callback এর টাকা দুই দশমিকে কাটা (গোল নয়) — মাস্টারের হিসাবের সাথে মেলে */
const cents = (value) => Math.trunc(num(value) * 100) / 100;
const text = (value) => String(value ?? "").trim();

const TRIAL_PREFIX = "tbt";

/**
 * মাস্টার নামের শেষে সাইটের পরিচয় জুড়ে দেয় (যেমন `…oraclegames`)।
 * আমাদের নাম সবসময় ঠিক ১০টা ছোট হাতের অক্ষর, তাই শুরুর ১০টাই নেওয়া —
 * কোন লেজ জুড়ল তা জানার দরকার নেই।
 */
const gameNameOf = (value) => {
  const name = text(value).toLowerCase();
  return /^[a-z]{10}/.test(name) ? name.slice(0, 10) : "";
};

/* =========================
   যাচাই
   ========================= */

const allowedIps = () =>
  text(process.env.CALLBACK_ALLOWED_IPS)
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);

const sameToken = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

let tokenCache = { value: "", at: 0 };

/** টোকেনটা ডেটাবেসে; প্রতি বাজিতে না পড়ে ৩০ সেকেন্ড মনে রাখা */
const currentToken = async () => {
  if (tokenCache.value && Date.now() - tokenCache.at < 30000) return tokenCache.value;
  const setting = await GameLaunchSetting.findOne().sort({ createdAt: -1 }).select("+callbackToken").lean();
  tokenCache = { value: text(setting?.callbackToken), at: Date.now() };
  return tokenCache.value;
};

/** admin নতুন টোকেন বানালে সাথে সাথে পুরোনোটা অচল */
export const forgetCallbackToken = () => {
  tokenCache = { value: "", at: 0 };
};

const verifyCaller = async (req, res, next) => {
  const ips = allowedIps();
  if (ips.length && !ips.includes(req.ip)) {
    console.warn("Callback rejected — IP not allowed:", req.ip);
    return res.status(200).json({ success: false, balance: 0, message: "FORBIDDEN" });
  }

  const expected = await currentToken();
  if (!expected || !sameToken(req.params.token || "", expected)) {
    console.warn("Callback rejected — bad token from", req.ip);
    return res.status(200).json({ success: false, balance: 0, message: "FORBIDDEN" });
  }

  return next();
};

/* =========================
   অ্যাফিলিয়েটের গেম কমিশন
   ========================= */

/**
 * রেফারকারী অ্যাফিলিয়েটের ভাগ — খেলোয়াড় হারলে হারের % তাঁর পাওনা
 * (gameLoss), জিতলে জেতার % তাঁর দেনা (gameWin); দুটো মিলিয়ে শেষ হিসাব
 * Bulk Adjustment এ। যোগটাও atomic, যাতে একসাথে অনেক খেলোয়াড়ের বাজিতে
 * কোনোটা হারিয়ে না যায়।
 */
const applyAffiliateCommission = async ({ referredBy, netAmount }) => {
  const none = { affiliateUser: null, amount: 0, type: "none" };
  if (!referredBy || netAmount === 0) return none;

  const affiliate = await User.findOne({
    _id: referredBy,
    role: "aff-user",
    isActive: true,
    affiliateStatus: "approved",
  })
    .select("gameLossCommission gameWinCommission")
    .lean();

  if (!affiliate) return none;

  const lost = netAmount < 0;
  const percent = num(lost ? affiliate.gameLossCommission : affiliate.gameWinCommission);
  if (percent <= 0) return none;

  const amount = cents((Math.abs(netAmount) * percent) / 100);
  if (amount <= 0) return none;

  const field = lost ? "gameLossCommissionBalance" : "gameWinCommissionBalance";

  await User.updateOne({ _id: affiliate._id }, [
    { $set: { [field]: { $round: [{ $add: [{ $ifNull: [`$${field}`, 0] }, amount] }, 2] } } },
  ]);

  return { affiliateUser: affiliate._id, amount, type: lost ? "game-loss" : "game-win" };
};

/* =========================
   callback
   ========================= */

const handleCallback = async (req, res) => {
  const reply = (body) => res.status(200).json(body);

  try {
    const {
      game_uid: gameUidRaw,
      game_round: gameRoundRaw,
      serial_number: serialRaw,
      bet_amount: betRaw,
      win_amount: winRaw,
      member_account: memberRaw,
      currency_code: currencyRaw,
      timestamp,
    } = req.body || {};

    if (!gameUidRaw || !gameRoundRaw || !serialRaw || betRaw === undefined || winRaw === undefined || !memberRaw) {
      return reply({ success: false, balance: 0, message: "Missing required fields" });
    }

    const gameUId = text(gameUidRaw);
    const gameRound = text(gameRoundRaw);
    const serialNumber = text(serialRaw);
    const memberAccount = text(memberRaw);
    const userGamePlayName = gameNameOf(memberRaw);

    const betAmount = cents(betRaw);
    const winAmount = cents(winRaw);

    if (betAmount < 0 || winAmount < 0) {
      return reply({ success: false, balance: 0, message: "Invalid amount" });
    }

    // ফ্রি ট্রায়ালের নাম — কোনো আসল অ্যাকাউন্টের টাকায় হাত নয়
    if (!userGamePlayName || userGamePlayName.startsWith(TRIAL_PREFIX)) {
      return reply({ success: false, balance: 0, message: "USER_NOT_FOUND" });
    }

    // আগেই এসেছে — আগের উত্তরটাই আবার
    const seen = await GameHistory.findOne({ serialNumber }).select("balanceAfter").lean();
    if (seen) return reply({ success: true, balance: seen.balanceAfter || 0, message: "DUPLICATE" });

    const delta = cents(winAmount - betAmount);

    /*
     * যাচাই + বদল এক ধাপে: ব্যালেন্স বাজির চেয়ে কম হলে কিছুই বদলায় না।
     * ফেরত আসে বদলের **আগের** ডকুমেন্ট — সেখান থেকেই balanceBefore।
     */
    const before = await User.findOneAndUpdate(
      { userGamePlayName, isActive: true, balance: { $gte: betAmount } },
      [
        {
          $set: {
            balance: { $round: [{ $add: ["$balance", delta] }, 2] },
            totalTurnover: { $round: [{ $add: [{ $ifNull: ["$totalTurnover", 0] }, betAmount] }, 2] },
          },
        },
      ],
      { returnDocument: "before", projection: "userId balance currency referredBy" },
    ).lean();

    if (!before) {
      const player = await User.findOne({ userGamePlayName, isActive: true }).select("balance").lean();
      if (!player) return reply({ success: false, balance: 0, message: "USER_NOT_FOUND" });
      return reply({ success: false, balance: cents(player.balance), message: "INSUFFICIENT_BALANCE" });
    }

    const balanceBefore = cents(before.balance);
    const balanceAfter = Math.round((balanceBefore + delta) * 100) / 100;
    const resultType = delta > 0 ? "win" : delta < 0 ? "loss" : "push";
    const info = peekGameInfo(gameUId);

    let history;
    try {
      history = await GameHistory.create({
        user: before._id,
        userId: before.userId,
        userGamePlayName,
        memberAccount,
        currency: text(currencyRaw) || before.currency || "BDT",
        gameUId,
        gameRound,
        serialNumber,
        gameName: info.name,
        gameNameBn: info.nameBn,
        gameCategory: info.category,
        providerCode: info.code,
        betAmount,
        winAmount,
        netAmount: delta,
        resultType,
        balanceBefore,
        balanceAfter,
        masterTimestamp: text(timestamp),
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;

      // একই রাউন্ড ঠিক একই মুহূর্তে দুবার — এইটার বদলটা ফিরিয়ে দেওয়া
      await User.updateOne({ _id: before._id }, [
        {
          $set: {
            balance: { $round: [{ $subtract: ["$balance", delta] }, 2] },
            totalTurnover: { $round: [{ $subtract: ["$totalTurnover", betAmount] }, 2] },
          },
        },
      ]);
      const first = await GameHistory.findOne({ serialNumber }).select("balanceAfter").lean();
      return reply({ success: true, balance: first?.balanceAfter || 0, message: "DUPLICATE" });
    }

    // টার্নওভার আর অ্যাফিলিয়েট কমিশন — উত্তরের আগে, যাতে উত্তোলনের
    // শর্ত সাথে সাথে ঠিক থাকে
    const turnoverApplied =
      betAmount > 0 ? await applyTurnoverProgress({ userId: before._id, gameUId, wagerAmount: betAmount }) : false;
    const commission = await applyAffiliateCommission({ referredBy: before.referredBy, netAmount: delta });

    await GameHistory.updateOne(
      { _id: history._id },
      {
        $set: {
          turnoverApplied,
          affiliateUser: commission.affiliateUser,
          affiliateCommissionAmount: commission.amount,
          affiliateCommissionType: commission.type,
        },
      },
    );

    reply({ success: true, balance: balanceAfter, message: "OK" });

    // VIP আর খেলোয়াড়ের রেফারেল কমিশন এখানে যোগ হবে (সেই ধাপে)।

    // গেমের নাম ক্যাশে ছিল না — উত্তর পাঠিয়ে তারপর এনে বসানো
    if (!info.name || !info.code || !info.category) {
      resolveGameInfo(gameUId)
        .then((found) => {
          const patch = {};
          if (!info.name && found.name) patch.gameName = found.name;
          if (!info.nameBn && found.nameBn) patch.gameNameBn = found.nameBn;
          if (!info.code && found.code) patch.providerCode = found.code;
          if (!info.category && found.category) patch.gameCategory = found.category;
          return Object.keys(patch).length ? GameHistory.updateOne({ _id: history._id }, { $set: patch }) : null;
        })
        .catch(() => {});
    }

    return undefined;
  } catch (error) {
    if (res.headersSent) return undefined;
    console.error("Callback error:", error.message);
    return reply({ success: false, balance: 0, message: "SERVER_ERROR" });
  }
};

router.post("/:token", verifyCaller, handleCallback);

// টোকেন ছাড়া — কখনো টাকা নড়ায় না, শুধু লগে দাগ রাখে (ভুল URL বসানো হয়েছে)
router.post("/", (req, res) => {
  console.warn("Callback without token from", req.ip, "— set the callback URL from admin › Game Launch Key");
  return res.status(200).json({ success: false, balance: 0, message: "FORBIDDEN" });
});

export default router;
