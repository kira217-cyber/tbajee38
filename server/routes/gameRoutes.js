import express from "express";

import { successResponse, errorResponse } from "../utils/response.js";
import { getCached, setCached } from "../utils/gameCache.js";
import { loadUsableKey, masterGet } from "../utils/masterApi.js";

/**
 * ক্লায়েন্টের গেম — White-label master থেকে প্রক্সি করে।
 *
 * ব্রাউজার কখনো master বা API key দেখে না; এখানে কী বসিয়ে master এ
 * যায়, আর ৩০ সেকেন্ড ক্যাশ থাকে — একই আধা মিনিটে যতজনই হোম খুলুক,
 * master এ একবারই কল যায়।
 *
 * কী বসানো না থাকলে এরর নয় — `configured: false` যায়, আর ক্লায়েন্ট
 * তখন নিজের স্ট্যাটিক ডেটাই দেখায়। এতে কী বসার আগে-পরে সাইট একইভাবে চলে।
 */
const router = express.Router();

const notConfigured = (res, reason) =>
  successResponse(res, "Game API key is not ready", { configured: false, reason, data: null });

const text = (value) => String(value ?? "").trim();

const proxy = (cacheKeyOf, pathOf, paramsOf = () => ({})) => async (req, res) => {
  try {
    const { apiKey, reason } = await loadUsableKey();
    if (!apiKey) return notConfigured(res, reason);

    const cacheKey = `game:${cacheKeyOf(req)}`;
    const cached = getCached(cacheKey);
    if (cached) return successResponse(res, "Game data (cached)", { configured: true, cached: true, data: cached });

    const body = await masterGet(pathOf(req), apiKey, paramsOf(req));
    setCached(cacheKey, body.data);

    return successResponse(res, "Game data", { configured: true, cached: false, data: body.data });
  } catch (error) {
    const status = error.status === 404 ? 404 : 502;
    return errorResponse(res, error.message || "Master is not reachable", status);
  }
};

/** শেল — ক্যাটাগরি (দুই ডিজাইনের), প্রোভাইডার, হোমের প্রথম গেমগুলো */
router.get(
  "/game-data",
  proxy(
    () => "data",
    () => "/game-data",
  ),
);

/** একটা ক্যাটাগরির (বা প্রোভাইডারের) এক পাতা, অথবা খোঁজ */
const listParams = (req) => ({
  category: text(req.query.category).toLowerCase().slice(0, 40),
  provider: text(req.query.provider).toUpperCase().slice(0, 40),
  search: text(req.query.search).slice(0, 60),
  page: Math.max(Number(req.query.page) || 1, 1),
  limit: Math.min(Math.max(Number(req.query.limit) || 30, 1), 100),
});

router.get(
  "/game-list",
  proxy(
    (req) => `list:${JSON.stringify(listParams(req))}`,
    () => "/game-list",
    listParams,
  ),
);

/** একটা গেম — খেলার পেজের শিরোনাম / চালু আছে কিনা */
router.get(
  "/game/:gameUId",
  proxy(
    (req) => `one:${text(req.params.gameUId)}`,
    (req) => `/game/${encodeURIComponent(text(req.params.gameUId))}`,
  ),
);

export default router;
