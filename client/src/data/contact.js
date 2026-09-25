/**
 * গ্রাহক সেবার লিংক — মূল সাইটের টেলিগ্রাম চ্যানেল।
 *
 * এক জায়গায় রাখা, যাতে হেডার, মেইনটেন্যান্স আর পাসওয়ার্ড ফেরতের পর্দা
 * একই লিংক খোলে। admin এর Contact Links এলে এটা সেখান থেকে আসবে।
 */
export const SUPPORT_URL = "https://t.me/+NpaAP08VuVtiODc1";

export const openSupport = () => window.open(SUPPORT_URL, "_blank", "noopener");
