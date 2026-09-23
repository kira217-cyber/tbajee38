import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import Icon from "../../components/Icon/Icon";
import { login } from "../../features/auth/authSlice";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { useHideBootLoader } from "../../hook/useHideBootLoader";

/**
 * মোবাইলের লগইন ও নিবন্ধন — মূল সাইটে এগুলো মডাল নয়, আলাদা **পেজ**
 * (`/m/login`, `/m/register`)। তাই এখানেও পেজ।
 *
 * মূল সাইট থেকে মাপা (৭৫০-ডিজাইন ইউনিটে, `m()` সেটাই rem এ বদলায়):
 *   `.login-bg` পুরো পর্দা, bg #010E22
 *   `.page-goback` ৬০ × ৬০, (৩০, ৪০) এ
 *   `.form_logo` (৩৫, ১২০) ৬৮০ × ১৫৮; লোগো ৪৪৬ × ১৫০ মাঝে
 *   `.form_wrap` (৩৫, ৩০৮) ৬৮০ চওড়া
 *   `.form_title` ৬৮০ × ৬৯, fs ৬০ fw ৭০০, রঙ #D6E2F4
 *   `.form-group` ৬৮০ × ১২০ — ইনপুট ৬৮০ × ৯০, radius ২৪,
 *     bg #010E22, border 1px #D6E2F4, fs ৩৩, padding-left ১০০
 *     (ইনপুটের নিচে ২০ উঁচু এররের জায়গা, দুই গ্রুপের মাঝে ৩০ ফাঁক)
 *   `.input-icon` ৪৪ চওড়া, বাঁ থেকে ৭০
 *   চেকবক্স সারি y ৬৬৭, উঁচু ৪৪ — বাক্স ৪০ × ৪০ radius ১২,
 *     bg #27416A border 1px #D6E2F4; লেবেল fs ৩৩ fw ৫০০
 *     "ভুলে গেছেন" ডানে, রঙ #FF6DB3
 *   সাবমিট (৩৫, ৭৬১) ৬৮০ × ১০০, radius ৫০, bg #BC43F4, fs ৪২ fw ৬০০
 *   `.form_links` y ৯১১, fs ৩২ সাদা; লিংক সবুজ #7BC242
 */

const ICONS = {
  user: "form-icon-name",
  pass: "form-icon-password",
  captcha: "form-icon-verify",
};

/**
 * একটা ফিল্ড = ইনপুট ৯০ + ফাঁক ১০ + এররের জায়গা ২০ = ১২০ উঁচু,
 * আর দুই ফিল্ডের মাঝে আরও ১০ (মূল সাইটে গ্রুপ দুটো y ৪০৭ ও ৫৩৭ এ)।
 *
 * ইনপুটটা `display: block` না দিলে সেটা inline-box হিসেবে বেসলাইনে বসে
 * আর প্যারেন্টের line-height এর কারণে ৫৫ ইউনিট নিচে নেমে যায় — তাতে
 * ভিতরের আইকনও জায়গা মতো পড়ে না।
 */
const MobileField = ({ kind, placeholder, type = "text", required, trailing }) => (
  <div style={{ height: m(120), marginBottom: m(10), position: "relative" }}>
    {required && (
      <span
        style={{
          position: "absolute",
          left: m(-20),
          top: m(28),
          color: "#ff4d4f",
          fontSize: m(30),
        }}
      >
        *
      </span>
    )}
    <span
      className="pointer-events-none absolute flex items-center justify-center"
      style={{ left: m(35), top: m(23), width: m(44), height: m(44), color: "#d6e2f4" }}
    >
      <Icon name={ICONS[kind]} size={m(44)} />
    </span>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        display: "block",
        width: "100%",
        height: m(90),
        background: "#010e22",
        border: "1px solid #d6e2f4",
        borderRadius: m(24),
        color: "#d6e2f4",
        fontSize: m(33),
        padding: `0 ${m(30)} 0 ${m(100)}`,
        outline: "none",
      }}
    />
    {trailing}
  </div>
);

const AuthPage = ({ mode = "login" }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = mode === "login";

  useHideBootLoader();

  return (
    <div style={{ minHeight: "100vh", background: "#010e22", position: "relative" }}>
      {/* ফিরে যাওয়ার তীর */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="back"
        className="absolute flex cursor-pointer items-center"
        style={{ left: m(30), top: m(40), width: m(60), height: m(60), color: "#fff" }}
      >
        <Icon name="icon-back" size={m(44)} />
      </button>

      {/* লোগো */}
      <div
        className="flex items-start justify-center"
        style={{ paddingTop: m(120), height: m(308) }}
      >
        <img
          src="/assets/mobile/logo.png"
          alt={t.brand}
          style={{ width: m(446), height: m(150), objectFit: "contain" }}
        />
      </div>

      {/* ফর্ম */}
      <div style={{ width: m(680), marginInline: "auto" }}>
        <div
          className="text-center"
          style={{ height: m(69), fontSize: m(60), fontWeight: 700, color: "#d6e2f4" }}
        >
          {isLogin ? t.auth.loginTab : t.auth.registerShort}
        </div>

        <div style={{ marginTop: m(30) }}>
          <MobileField kind="user" placeholder={t.auth.username} required={!isLogin} />
          <MobileField
            kind="pass"
            type="password"
            placeholder={t.auth.password}
            required={!isLogin}
          />

          {!isLogin && (
            <>
              <MobileField
                kind="pass"
                type="password"
                placeholder={t.auth.confirmPassword}
                required
              />
              <MobileField
                kind="captcha"
                placeholder={t.auth.captchaMobile}
                required
                trailing={
                  <span
                    className="absolute flex items-center justify-center"
                    style={{
                      right: m(20),
                      top: m(15),
                      width: m(150),
                      height: m(60),
                      borderRadius: m(8),
                      background: "#eef3ea",
                      color: "#333",
                      fontSize: m(36),
                      fontWeight: 700,
                      fontStyle: "italic",
                      letterSpacing: m(2),
                    }}
                  >
                    89821
                  </span>
                }
              />
            </>
          )}
        </div>

        {isLogin && (
          <div className="flex items-center" style={{ height: m(44), marginTop: m(10) }}>
            <label className="flex cursor-pointer items-center" style={{ gap: m(15) }}>
              <input
                type="checkbox"
                defaultChecked
                style={{
                  width: m(40),
                  height: m(40),
                  borderRadius: m(12),
                  accentColor: "#27416a",
                }}
              />
              <span style={{ fontSize: m(33), fontWeight: 500, color: "#d6e2f4" }}>
                {t.auth.remember}
              </span>
            </label>
            <span className="flex-1" />
            <span style={{ fontSize: m(33), fontWeight: 500, color: "#ff6db3" }}>
              {t.auth.forgotMobile}
            </span>
          </div>
        )}

        {/* সাবমিট — নিবন্ধনে পাশে রিসেট বোতাম থাকে */}
        <div className="flex items-center" style={{ marginTop: m(50), gap: m(30) }}>
          <button
            type="button"
            onClick={() => {
              // server নেই — স্ট্যাটিক ইউজার বসিয়ে হোমে ফিরি
              dispatch(login({}));
              navigate("/");
            }}
            className="cursor-pointer"
            style={{
              width: isLogin ? "100%" : m(425),
              height: m(100),
              borderRadius: m(50),
              background: "var(--accent-bright)",
              color: "#fff",
              fontSize: m(42),
              fontWeight: 600,
            }}
          >
            {isLogin ? t.auth.loginTab : t.auth.registerShort}
          </button>

          {!isLogin && (
            <button
              type="button"
              className="cursor-pointer"
              style={{
                width: m(225),
                height: m(100),
                borderRadius: m(50),
                background: "transparent",
                border: "1px solid var(--accent-bright)",
                color: "#d6e2f4",
                fontSize: m(42),
                fontWeight: 500,
              }}
            >
              {t.auth.reset}
            </button>
          )}
        </div>

        {isLogin && (
          <div
            className="flex justify-center"
            style={{ marginTop: m(50), fontSize: m(32), color: "#fff", gap: m(10) }}
          >
            <span>{t.auth.noAccountMobile}</span>
            <span
              className="cursor-pointer"
              style={{ color: "#7bc242", fontSize: m(30) }}
              onClick={() => navigate("/register")}
            >
              {t.auth.registerShort}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
