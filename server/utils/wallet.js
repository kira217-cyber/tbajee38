import User from "../models/User.js";
import { money } from "./money.js";

/**
 * ব্যালেন্সে টাকা যোগ/বাদ — সবসময় এক ধাপে (atomic), দুই দশমিকে গোল।
 *
 * BetChokkor ব্যালেন্স আগে পড়ে তারপর `user.save()` করত; খেলোয়াড় তখন
 * খেলতে থাকলে callback এর বদলটা মুছে যেত (বা উল্টোটা)। এখানে ডেটাবেস
 * নিজেই যোগ করে, তাই একই মুহূর্তে যত বদলই আসুক কোনোটা হারায় না।
 */
const addField = (field, amount) => ({
  [field]: { $round: [{ $add: [{ $ifNull: [`$${field}`, 0] }, amount] }, 2] },
});

/**
 * খেলোয়াড়ের ব্যালেন্সে জমা। `deposit` দিলে মোট ডিপোজিটেও যোগ হয়
 * (বোনাস বাদে আসল জমাটুকু — রেফারেলের ধাপ এটা দেখে)।
 * ফেরত দেয় নতুন ডকুমেন্ট (না পেলে null)।
 */
export const creditUser = (userId, amount, { deposit = 0 } = {}) =>
  User.findOneAndUpdate(
    { _id: userId },
    [{ $set: { ...addField("balance", money(amount)), ...(deposit ? addField("totalDeposit", money(deposit)) : {}) } }],
    { returnDocument: "after" },
  );

/** ভুলে জমা হলে ফিরিয়ে নেওয়া (rollback) */
export const debitUser = (userId, amount, { deposit = 0 } = {}) =>
  creditUser(userId, -money(amount), { deposit: -money(deposit) });

/** অ্যাফিলিয়েটের কমিশনের ঘরে যোগ (`depositCommissionBalance` …) */
export const addCommission = (userId, field, amount) =>
  User.updateOne({ _id: userId }, [{ $set: addField(field, money(amount)) }]);
