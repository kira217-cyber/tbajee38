import { useSyncExternalStore } from "react";

import { API_URL } from "../api/axios";

/**
 * সাইটের পরিচয় (নাম, লোগো, favicon) আর ফুটার — admin এর "Site Identity"
 * ও "Footer Setting" থেকে (`/api/site-settings/client/public`)।
 *
 * React এর বাইরের ছোট একটা store: শুরুতেই আনা হয়, শেষবারেরটা
 * localStorage এ থাকে (পরের বার পুরোনো লোগো এক ঝলক দেখায় না), আর server
 * না পেলে নিচের ডিফল্ট — যা হুবহু এখনকার মূল সাইটের মতো। admin এর
 * প্রিভিউ iframe এ খসড়াও এখানে আসে (theme/liveTheme.js → "tb:preview-site")।
 */
const CACHE_KEY = "tbajee:site-settings";

const lang = (bn, en = bn) => ({ bn, en });
const img = (image, w, h, br = false) => ({ image, w, h, link: "", br });

export const DEFAULT_SETTINGS = {
  identify: {
    siteName: "TBAJEE",
    logo: "/assets/site/logo.c2ac3228.png",
    mobileLogo: "/assets/mobile/logo.png",
    favicon: "/favicon.png",
  },
  footer: {
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
    licenseText: lang("local_license_1"),
    copyright: lang("Copyright © 2025 TBAJEE All rights reserved."),
    license: [img("/assets/mobile/curacao.png", 90, 30)],
    responsible: [img("/assets/mobile/responsible-1.png", 40, 40), img("/assets/mobile/responsible-2.png", 70, 50)],
    providers: [img("/assets/mobile/vendor-icon.png", 700, 0)],
    payment: [img("/assets/mobile/payment-channel.png", 374, 60)],
    certification: [
      img("/assets/mobile/certificate-1.png", 44, 52),
      img("/assets/mobile/certificate-2.png", 52, 52),
      img("/assets/mobile/certificate-3.png", 121, 31, true),
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
  },
};

/** server এর ডেটা `base` এর উপর (সাধারণত ডিফল্ট) — যা নেই তা base থেকে */
const merge = (data, base = DEFAULT_SETTINGS) => {
  const identify = { ...base.identify };
  Object.keys(identify).forEach((k) => {
    // খালি = এখনকার মূল সাইটের ছবি/নাম
    if (typeof data?.identify?.[k] === "string") identify[k] = data.identify[k] || DEFAULT_SETTINGS.identify[k];
  });
  const f = data?.footer || {};
  const footer = { ...base.footer, titles: { ...base.footer.titles } };
  Object.keys(footer.titles).forEach((k) => {
    if (f.titles?.[k]) footer.titles[k] = f.titles[k];
  });
  ["licenseText", "copyright"].forEach((k) => {
    if (f[k]) footer[k] = f[k];
  });
  ["license", "responsible", "providers", "payment", "certification", "security", "desktopProviders", "socials"].forEach((k) => {
    // ছবি ছাড়া সারি (admin এ সদ্য যোগ করা) দেখানো হয় না
    if (Array.isArray(f[k])) footer[k] = f[k].filter((r) => r && (k === "socials" ? r.name || r.icon : r.image));
  });
  return { identify, footer };
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? merge(JSON.parse(raw)) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

let state = readCache();
let previewing = false;
const listeners = new Set();

/** server এ আপলোড করা ছবি হলে server এর ঠিকানা সামনে; ক্লায়েন্টের নিজের ছবি যেমন আছে */
export const siteImage = (url) => (url && url.startsWith("/uploads/") ? `${API_URL}${url}` : url || "");

const setFavicon = (href) => {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  if (link.getAttribute("href") !== href) link.setAttribute("href", href);
};

const set = (next) => {
  state = next;
  if (state.identify.siteName) document.title = state.identify.siteName;
  setFavicon(siteImage(state.identify.favicon));
  listeners.forEach((fn) => fn());
};

export const startSiteSettings = () => {
  set(state);
  // admin এর প্রিভিউ — খসড়া এলে সেভ করা ডেটা আর তার উপর বসে না
  window.addEventListener("tb:preview-site", (event) => {
    previewing = true;
    // শুধু যে অংশটা এসেছে (পরিচয় বা ফুটার) সেটাই বদলায়
    set(merge(event.detail, state));
  });
  fetch(`${API_URL}/api/site-settings/client/public`, { cache: "no-store" })
    .then((res) => res.json())
    .then((body) => {
      if (!body?.data) return;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(body.data));
      } catch {
        /* জায়গা না থাকলে শুধু এবারের জন্য */
      }
      if (!previewing) set(merge(body.data));
    })
    .catch(() => {});
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** `{ identify, footer }` — বদলালে কম্পোনেন্ট নতুন করে আঁকে */
export const useSiteSettings = () => useSyncExternalStore(subscribe, () => state);

/** ভাষা অনুযায়ী লেখা (বাংলা/ইংরেজি জোড়া) */
export const pickLang = (value, lang) => (lang === "en" ? value?.en || value?.bn : value?.bn || value?.en) || "";
