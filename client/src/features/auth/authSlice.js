import { createSlice } from "@reduxjs/toolkit";

/**
 * লগইন অবস্থা।
 *
 * server এখনো নেই, তাই লগইন ফর্ম সাবমিট করলে স্ট্যাটিক একটা ইউজার বসে —
 * এতে লগইনের পরের হেডার ও মেম্বার সেন্টার দেখা ও মেলানো যায়। server
 * এলে এই slice এর ভিতরটাই API কলে বদলাবে, বাইরের কম্পোনেন্টগুলো নয়।
 *
 * মান দুটো মূল সাইটে rai182 অ্যাকাউন্টে যা দেখায় তাই: ব্যালেন্স ৳0.00,
 * VIP0।
 */
const STORAGE_KEY = "tbajee:user";

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persist = (user) => {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // প্রাইভেট মোডে সেভ না হলেও এই সেশনে লগইন থাকবে
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: readStored() },
  reducers: {
    login: (state, action) => {
      const username = action.payload?.username?.trim() || "rai182";
      state.user = {
        username,
        nickname: username,
        balance: 0,
        vipLevel: 0,
        currency: "৳",
        // সদস্য কেন্দ্রে "যোগদান করেছেন" দেখায় — server আসার আগ পর্যন্ত
        // আজকের তারিখই বসাই (মূল সাইটেও YYYY-MM-DD)
        joinedAt: new Date().toISOString().slice(0, 10),
        avatar: "/assets/mobile/avatar.png",
      };
      persist(state.user);
    },
    logout: (state) => {
      state.user = null;
      persist(null);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
