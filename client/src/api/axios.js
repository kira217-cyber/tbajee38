import axios from "axios";

/**
 * TBAJEE38 server এর axios।
 *
 * `.env` এ `VITE_API_URL` না থাকলে লোকাল server (৫০০০) ধরে নেয়।
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

export default api;
