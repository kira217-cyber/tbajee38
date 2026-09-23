import express from "express";

import { protectAdmin } from "../middleware/protectAdmin.js";
import { successResponse, errorResponse } from "../utils/response.js";
import Admin from "../models/Admin.js";

const router = express.Router();

/**
 * ড্যাশবোর্ডের সারসংক্ষেপ।
 *
 * এখন পর্যন্ত ডেটাবেসে শুধু `Admin` কালেকশনটাই আছে, তাই
 * **`totalAdmins` সংখ্যাটাই আসল** — বাকিগুলো ০। User, DepositRequest,
 * WithdrawRequest ইত্যাদি মডেল যোগ হলে এখানে শুধু কোয়েরিগুলো বসালেই
 * হবে; রেসপন্সের শেপ বদলাতে হবে না, তাই অ্যাডমিন প্যানেল অপরিবর্তিত
 * থাকবে।
 */
const emptyCards = {
  allUsers: 0,
  activeUsers: 0,
  allAffiliateUsers: 0,
  allDepositBalances: 0,
  pendingDepositRequest: 0,
  allWithdrawBalances: 0,
  pendingWithdrawRequest: 0,
  totalUserBalance: 0,
  totalAdmins: 0,
};

/** শেষ ৭ দিনের খালি চার্ট — লেবেলগুলো আসল তারিখ থেকেই */
const emptyChart = () => {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);

    days.push({
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      deposit: 0,
      withdraw: 0,
    });
  }

  return days;
};

router.get("/summary", protectAdmin, async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();

    return successResponse(res, "Dashboard summary loaded", {
      cards: { ...emptyCards, totalAdmins },
      chart: emptyChart(),
      // প্যানেল এটা দেখে "No API Included" ব্যাজ দেখাতে পারে
      pending: ["users", "deposits", "withdraws", "affiliates"],
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

router.get("/today", protectAdmin, async (req, res) => {
  try {
    const dateStr = String(req.query.date || "").trim();
    const base = dateStr ? new Date(dateStr) : new Date();

    if (Number.isNaN(base.getTime())) {
      return errorResponse(res, "Invalid date", 400);
    }

    const start = new Date(base);
    start.setHours(0, 0, 0, 0);

    return successResponse(res, "Day summary loaded", {
      date: start.toISOString().slice(0, 10),
      cards: {
        newUsers: 0,
        newAffiliates: 0,
        deposit: 0,
        withdraw: 0,
        depositCount: 0,
        withdrawCount: 0,
        pendingDeposit: 0,
        pendingWithdraw: 0,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
