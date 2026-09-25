import express from "express";

import upload from "../config/multer.js";
import AffSiteIdentify from "../models/AffSiteIdentify.js";
import AffFooterSetting from "../models/AffFooterSetting.js";
import { protectAdmin, requireMother, requireWrite } from "../middleware/protectAdmin.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * অ্যাফিলিয়েট সাইটের পরিচয় (নাম, লোগো, favicon) আর ফুটার — `/api/site-settings`।
 * BetChokkor এর ক্লায়েন্ট অংশ এখানে নেই — TBAJEE38 এর ক্লায়েন্ট মূল সাইটের
 * নিজের লোগো/ফুটার ব্যবহার করে।
 */
const router = express.Router();
const text = (v, n = 300) => String(v ?? "").trim().slice(0, n);
const lang = (i = {}, n = 500) => ({ bn: text(i?.bn, n), en: text(i?.en, n) });
/** শুধু আমাদের আপলোড করা ছবি বা খালি — বাইরের/`javascript:` লিংক নয় */
const imagePath = (v) => {
  const s = text(v, 300);
  return !s || /^\/uploads\/[\w.\-]+$/.test(s) ? s : null;
};

router.get("/affiliate/public", async (req, res) => {
  try {
    const [identify, footer] = await Promise.all([AffSiteIdentify.current(), AffFooterSetting.current()]);
    return successResponse(res, "Affiliate settings", { identify, footer });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.post("/admin/upload", protectAdmin, requireMother, requireWrite, upload.single("image"), (req, res) => {
  if (!req.file) return errorResponse(res, "Choose an image", 400);
  return successResponse(res, "Uploaded", { url: `/uploads/${req.file.filename}` });
});

const makeCrud = (Model, key, set) => {
  router.get(`/admin/${key}`, protectAdmin, requireMother, async (req, res) => {
    try {
      return successResponse(res, "Loaded", { data: await Model.current() });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  });
  router.put(`/admin/${key}`, protectAdmin, requireMother, requireWrite, async (req, res) => {
    try {
      const doc = await Model.current();
      const problem = set(doc, req.body || {});
      if (problem) return errorResponse(res, problem, 400);
      await doc.save();
      return successResponse(res, "Saved", { data: doc });
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  });
};

const setImages = (doc, b, keys) => {
  for (const k of keys) {
    if (b[k] === undefined) continue;
    const v = imagePath(b[k]);
    if (v === null) return "Upload the image here instead of pasting a link";
    doc[k] = v;
  }
  return "";
};

makeCrud(AffSiteIdentify, "aff-identify", (doc, b) => {
  if (b.siteName !== undefined) doc.siteName = text(b.siteName, 80);
  return setImages(doc, b, ["logo", "brandLogo", "favicon"]);
});

makeCrud(AffFooterSetting, "aff-footer", (doc, b) => {
  if (b.description !== undefined) doc.description = lang(b.description);
  if (b.copyright !== undefined) doc.copyright = lang(b.copyright);
  if (b.ageNotice !== undefined) doc.ageNotice = lang(b.ageNotice);
  return setImages(doc, b, ["logo"]);
});

export default router;
