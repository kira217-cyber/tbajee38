import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

// সিক্রেট ছাড়া সার্ভার চালু হলে টোকেন যাচাই ভেঙে পড়ত — তাই
// শুরুতেই থামিয়ে দেওয়া হয়, চুপচাপ চলতে দেওয়ার চেয়ে ভালো
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET নেই বা খুব ছোট (কমপক্ষে ৩২ অক্ষর) — .env দেখুন");
  process.exit(1);
}

await connectDB();

const app = express();

// রিভার্স প্রক্সির পেছনে থাকলে আসল IP পেতে (rate limit এর জন্য দরকার)
app.set("trust proxy", 1);

app.use(helmet());

/**
 * CORS — সব অরিজিন allowed। API টোকেন-ভিত্তিক (কুকি নয়), তাই খোলা
 * CORS এ CSRF ঝুঁকি নেই; ফলে ক্লায়েন্ট (5173), অ্যাফিলিয়েট (5174) ও
 * অ্যাডমিন (5175) — তিন জায়গা থেকেই কল করা যায়।
 */
app.use(cors());

// বড় পে-লোড দিয়ে মেমরি ভরানো ঠেকাতে সীমা
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// আপলোড করা ছবি সরাসরি পরিবেশন — helmet এর crossOriginResourcePolicy
// ডিফল্টে same-origin, তাই অন্য পোর্টের অ্যাডমিন থেকে ছবি দেখা যেত না
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static("uploads"),
);

// পুরো API তে সাধারণ সীমা (লগইনে আলাদা কড়া সীমা আছে)
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/", (req, res) => {
  res.json({ success: true, message: "TBAJEE38 Server is running." });
});

app.get("/health", (req, res) => {
  res.json({ success: true, uptime: process.uptime() });
});

app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// শেষ ভরসার এরর হ্যান্ডলার — প্রোডাকশনে ভিতরের বার্তা বাইরে যায় না
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message);

  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";

  res.status(status).json({
    success: false,
    message: isProd && status === 500 ? "Internal server error" : err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TBAJEE38 Server running on port ${PORT}`);
});
