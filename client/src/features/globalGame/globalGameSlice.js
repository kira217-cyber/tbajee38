import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { sections, vendors } from "../../data/gameData";
import { hotGames, gamesByType } from "../../data/gameListData";

/**
 * গেমের ক্যাটালগ — হোমের সেকশন, ভেন্ডর ও গেমের তালিকা।
 *
 * এখন সবটাই `data/` থেকে স্ট্যাটিক; server হলে thunk এ API কল বসবে।
 */
export const fetchGlobalGameData = createAsyncThunk(
  "globalGame/fetchGlobalGameData",
  async () => ({ sections, vendors, hotGames, gamesByType }),
);

const initialState = {
  // সেকশনের তালিকাটা কনফিগ, ডেটা নয় — তাই শুরু থেকেই থাকে। এতে
  // মূল সাইটের মতো শিরোনাম-ট্যাব সাথে সাথে দেখা যায় আর ভিতরে
  // গেম আসা পর্যন্ত স্পিনার ঘোরে।
  sections,
  vendors: {},
  hotGames: [],
  gamesByType: {},
  loading: false,
  loaded: false,
};

const globalGameSlice = createSlice({
  name: "globalGame",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGlobalGameData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalGameData.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        Object.assign(state, action.payload);
      })
      .addCase(fetchGlobalGameData.rejected, (state) => {
        state.loading = false;
        state.loaded = true;
      });
  },
});

export default globalGameSlice.reducer;
