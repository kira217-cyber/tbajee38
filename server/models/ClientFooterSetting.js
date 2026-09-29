import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * ক্লায়েন্ট সাইটের ফুটার — সবসময় একটাই ডকুমেন্ট, সব অংশ admin থেকে।
 *
 * মোবাইলের ফুটারে ছবির সারি (লাইসেন্স, দায়িত্বশীল গেমিং, প্রোভাইডার,
 * পেমেন্ট, সার্টিফিকেশন, সুরক্ষা) আর ডেস্কটপে প্রোভাইডার লোগো ও সোশ্যাল
 * লিংক। প্রতিটা ছবির মাপ (`w`/`h`) মোবাইলে ৭৫০-ডিজাইনের px (০ = নিজের
 * অনুপাতে), `br` = এই ছবি নতুন লাইনে। ডিফল্ট = মূল সাইট থেকে মাপা এখনকার
 * ফুটার, ছবিগুলো ক্লায়েন্টের নিজের `/assets/…`।
 */
const lang = (bn, en = bn) => ({ bn, en });
const img = (image, w, h, extra = {}) => ({ image, w, h, link: "", br: false, ...extra });

export const FOOTER_DEFAULTS = {
  titles: {
    help: lang("সাহায্য", "Help"),
    products: lang("পণ্য", "Products"),
    social: lang("সোশ্যাল মিডিয়া", "Social media"),
    license: lang("গেমিং লাইসেন্স", "Gaming License"),
    responsible: lang("দায়িত্বশীল গেমিং", "Responsible Gaming"),
    payment: lang("পেমেন্ট মেথড", "Payment Method"),
    certification: lang("সার্টিফিকেশন", "Certification"),
    security: lang("সুরক্ষা", "Security"),
  },
  // মূল সাইটে লেখাটা আক্ষরিক অর্থেই এটা
  licenseText: lang("local_license_1"),
  copyright: lang("Copyright © 2025 TBAJEE All rights reserved."),
  license: [img("/assets/mobile/curacao.png", 90, 30)],
  responsible: [img("/assets/mobile/responsible-1.png", 40, 40), img("/assets/mobile/responsible-2.png", 70, 50)],
  providers: [img("/assets/mobile/vendor-icon.png", 700, 0)],
  payment: [img("/assets/mobile/payment-channel.png", 374, 60)],
  certification: [
    img("/assets/mobile/certificate-1.png", 44, 52),
    img("/assets/mobile/certificate-2.png", 52, 52),
    img("/assets/mobile/certificate-3.png", 121, 31, { br: true }),
  ],
  security: [img("/assets/mobile/security-1.png", 41, 42), img("/assets/mobile/security-2.png", 37, 51)],
  desktopProviders: [
    ["PG", "/assets/vendors/rng_list_vendor/PG-COLOR.png"],
    ["EVO", "/assets/vendors/live_list_vendor/EG4-COLOR.png"],
    ["PT", "/assets/vendors/live_list_vendor/PT-COLOR.png"],
    ["JDB", "/assets/vendors/rng_list_vendor/JDB-COLOR.png"],
    ["CQ9", "/assets/vendors/rng_list_vendor/CQ9-GRAY.png"],
    ["FC", "/assets/vendors/rng_list_vendor/FC-COLOR.png"],
    ["JILI", "/assets/vendors/rng_list_vendor/JL-COLOR.png"],
    ["BTG", "/assets/vendors/rng_list_vendor/BTG-COLOR.png"],
  ].map(([name, image]) => ({ name, image, link: "" })),
  socials: [],
};

/** ফুটারের যে অংশগুলো ছবির সারি */
export const FOOTER_IMAGE_ROWS = ["license", "responsible", "providers", "payment", "certification", "security"];
export const FOOTER_TITLES = Object.keys(FOOTER_DEFAULTS.titles);

const Lang = new Schema(
  { bn: { type: String, default: "", trim: true }, en: { type: String, default: "", trim: true } },
  { _id: false },
);
const Img = new Schema(
  {
    image: { type: String, default: "", trim: true },
    w: { type: Number, default: 0 },
    h: { type: Number, default: 0 },
    link: { type: String, default: "", trim: true },
    br: { type: Boolean, default: false },
  },
  { _id: false },
);
const Logo = new Schema(
  { name: { type: String, default: "", trim: true }, image: { type: String, default: "", trim: true }, link: { type: String, default: "", trim: true } },
  { _id: false },
);
const Social = new Schema(
  { name: { type: String, default: "", trim: true }, icon: { type: String, default: "", trim: true }, url: { type: String, default: "", trim: true } },
  { _id: false },
);

const clone = (v) => JSON.parse(JSON.stringify(v));

const clientFooterSettingSchema = new Schema(
  {
    titles: {
      type: new Schema(Object.fromEntries(FOOTER_TITLES.map((k) => [k, { type: Lang, default: () => clone(FOOTER_DEFAULTS.titles[k]) }])), { _id: false }),
      default: () => clone(FOOTER_DEFAULTS.titles),
    },
    licenseText: { type: Lang, default: () => clone(FOOTER_DEFAULTS.licenseText) },
    copyright: { type: Lang, default: () => clone(FOOTER_DEFAULTS.copyright) },
    ...Object.fromEntries(FOOTER_IMAGE_ROWS.map((k) => [k, { type: [Img], default: () => clone(FOOTER_DEFAULTS[k]) }])),
    desktopProviders: { type: [Logo], default: () => clone(FOOTER_DEFAULTS.desktopProviders) },
    socials: { type: [Social], default: () => [] },
  },
  { timestamps: true },
);

clientFooterSettingSchema.statics.current = async function current() {
  const existing = await this.findOne().sort({ createdAt: 1 });
  return existing || this.create({});
};

const ClientFooterSetting =
  mongoose.models.ClientFooterSetting || mongoose.model("ClientFooterSetting", clientFooterSettingSchema);

export default ClientFooterSetting;
