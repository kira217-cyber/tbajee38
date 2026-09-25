/**
 * পরিচয় যাচাই (KYC) এর শর্ত — admin চাইলে ডিপোজিট/উত্তোলনের আগে KYC লাগবে।
 *
 * KYC ধাপ এখনো তৈরি হয়নি, তাই আপাতত সবাই যেতে পারেন। KYC এলে এখানেই
 * `VerificationSetting` দেখে আটকানো হবে — যে রুটগুলো ডাকে, সেগুলো বদলাতে হবে না।
 *
 * @param {string} userId
 * @param {"deposit"|"withdraw"} action
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
// eslint-disable-next-line no-unused-vars
export const verificationGate = async (userId, action) => ({ ok: true });

export default verificationGate;
