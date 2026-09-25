import axios from "axios";

import { readToken } from "../features/auth/tokenStore";

/**
 * TBAJEE38 server এর axios।
 *
 * `.env` এ `VITE_API_URL` না থাকলে লোকাল server (৫০০০) ধরে নেয়।
 * লগইন থাকলে প্রতিটা রিকোয়েস্টে টোকেন যায়; server 401 দিলে (টোকেনের
 * মেয়াদ শেষ) বা 403 accountDisabled দিলে (admin বন্ধ করেছেন) লগআউট — লগইন/নিবন্ধনের নিজের 401 বাদে,
 * সেগুলো "ভুল পাসওয়ার্ড" মাত্র।
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AUTH_PATHS = ["/api/user/login", "/api/user/register", "/api/user/forgot-password", "/api/user/otp"];

let onUnauthorized = null;

/** store তৈরির পর একবার বসে — axios নিজে Redux চেনে না */
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error?.config?.url || "";
    const sentToken = Boolean(error?.config?.headers?.Authorization);

    const status = error?.response?.status;
    const code = error?.response?.data?.code;

    // admin অ্যাকাউন্ট বন্ধ করলে 403 + accountDisabled — সেটাও লগআউট
    if (
      sentToken &&
      !AUTH_PATHS.some((p) => url.startsWith(p)) &&
      (status === 401 || (status === 403 && code === "accountDisabled"))
    ) {
      onUnauthorized?.(code);
    }

    return Promise.reject(error);
  },
);

export default api;
