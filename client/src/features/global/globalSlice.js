import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { banners, notices, promotions, popups } from "../../data/siteData";

/**
 * সাইটের কনটেন্ট — ব্যানার, নোটিশ, প্রমোশন।
 *
 * server আসার আগ পর্যন্ত thunk শুধু স্ট্যাটিক ডেটা ফিরিয়ে দেয়; পরে
 * এখানে API কল বসবে আর স্ট্যাটিকটা fallback হয়ে যাবে — ঠিক যেভাবে
 * BetChokkor এ করা আছে।
 */
export const fetchGlobalClientData = createAsyncThunk(
  "global/fetchGlobalClientData",
  async () => ({ banners, notices, promotions, popups }),
);

const initialState = {
  banners: [],
  notices: [],
  promotions: [],
  popups: [],
  loading: false,
  loaded: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalClientData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalClientData.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        Object.assign(state, action.payload);
      })
      .addCase(fetchGlobalClientData.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
      });
  },
});

export default globalSlice.reducer;
