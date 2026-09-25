import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * হোমের কনটেন্ট — ব্যানার, নোটিশের চলমান লেখা, প্রমোশন, পপআপ।
 *
 * আগে সবই `client/src/data/siteData.js` এ স্থির ছিল; এখন admin থেকে
 * বদলানো যায়। মূল সাইটের মতোই ব্যানার ডেস্কটপ আর মোবাইলে আলাদা
 * (মোবাইলে ৭৫০ × ৩০০ এর "PHONE" ছবি)।
 *
 * `link` — সংখ্যা হলে প্রমোশনের `code` (প্রমোশন পাতার সেই কার্ড খোলে),
 * নইলে বাইরের URL।
 */
const LangText = new Schema(
  {
    bn: { type: String, default: "", trim: true },
    en: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const common = {
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
};

const bannerSchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    image: { type: String, required: true, trim: true },
    platform: { type: String, enum: ["desktop", "mobile"], default: "desktop" },
    link: { type: String, default: "", trim: true },
    ...common,
  },
  { timestamps: true },
);
bannerSchema.index({ platform: 1, isActive: 1, order: 1 });

const noticeSchema = new Schema(
  {
    text: { type: LangText, default: () => ({}) },
    ...common,
  },
  { timestamps: true },
);

const promotionSchema = new Schema(
  {
    /** পুরোনো লিংক (ব্যানারের `link`) এই কোড ধরে — মূল সাইটের আইডি */
    code: { type: String, default: "", trim: true },
    title: { type: LangText, default: () => ({}) },
    image: { type: String, default: "", trim: true },
    /** বিস্তারিতের লম্বা ছবিগুলো (মূল সাইটে লেখা নয়, ছবি) */
    bodyImages: { type: [String], default: [] },
    /** ঐচ্ছিক লেখা — ছবির নিচে */
    content: { type: LangText, default: () => ({}) },
    link: { type: String, default: "", trim: true },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    ...common,
  },
  { timestamps: true },
);
promotionSchema.index({ code: 1 }, { unique: true, partialFilterExpression: { code: { $gt: "" } } });

const popupSchema = new Schema(
  {
    title: { type: LangText, default: () => ({}) },
    image: { type: String, required: true, trim: true },
    // মূল সাইটে মোবাইলের পপআপও আলাদা ("POPUP PHONE" ছবি)
    platform: { type: String, enum: ["desktop", "mobile"], default: "desktop" },
    link: { type: String, default: "", trim: true },
    ...common,
  },
  { timestamps: true },
);

export const SiteBanner = mongoose.models.SiteBanner || mongoose.model("SiteBanner", bannerSchema);
export const SiteNotice = mongoose.models.SiteNotice || mongoose.model("SiteNotice", noticeSchema);
export const Promotion = mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);
export const SitePopup = mongoose.models.SitePopup || mongoose.model("SitePopup", popupSchema);
