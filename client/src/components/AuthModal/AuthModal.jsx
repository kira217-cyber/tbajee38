import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import Icon from "../Icon/Icon";
import { login } from "../../features/auth/authSlice";
import { useLanguage } from "../../Context/LanguageProvider";

/**
 * ডেস্কটপের লগইন / নিবন্ধন মডাল।
 *
 * মূল সাইট থেকে মাপা (১৯২০ viewport, `.popup_modal_wrap`):
 *   মডাল ৪৪৪ চওড়া — লগইনে ৫৭৫ উঁচু, নিবন্ধনে ৬৫৯; স্ক্রিনের মাঝে
 *   `.form-popup-bg` bg #181F2B, radius ২০, padding ৯৫ ৩৫ ৩০
 *   ক্লোজ বোতাম ২২ × ২২, উপরে-ডানে ২৫,২৫
 *   `.form-type` ৩৭৪ × ৩৮ — দুটো ট্যাব ১২০ × ৩৮, radius ১০,
 *     সক্রিয়টার bg #BC43F4; fs ১৮ fw ৬০০
 *   `.form_item` ৩৭৪ × ৬২  (ইনপুট ৪৭ + এররের জায়গা ১৫)
 *   ইনপুট ৩৭৪ × ৪৭, bg #212937, radius ১০, fs ১৪ fw ৬০০,
 *     padding `0 16px 0 63px`; বাঁ পাশে আইকন ২০ × ২০ (x+২৬), রঙ #A8A8A8
 *   মনে রাখুন সারি ৩৭৪ × ৫০ — চেকবক্স ৩০ × ৩০, "ভুলে গিয়েছেন" fs ১৭
 *     fw ৫০০ রঙ #BC43F4
 *   সাবমিট ৩৭৪ × ৫৮, radius ৭, bg #BC43F4, fs ১৮ fw ৭০০
 *   শর্তাবলির লেখা ৩৭৪ × ৩২, fs ১৪ সাদা
 *   `.form-tip` padding-top ১৯, fs ১৪; লিংকের রঙ #BC43F4
 *   এরর লেখা fs ১২ রঙ #F56C6C
 */

const FIELD_ICON = {
  user: "form-icon-name",
  pass: "form-icon-password",
  captcha: "form-icon-verify",
};

const Field = ({ kind, placeholder, type = "text", trailing, value, onChange }) => (
  <div style={{ height: 62 }}>
    <div className="relative" style={{ height: 47 }}>
      <span
        className="pointer-events-none absolute flex items-center"
        style={{ left: 26, top: 13.5, width: 20, height: 20, color: "#a8a8a8" }}
      >
        <Icon name={FIELD_ICON[kind]} size={20} />
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: 374,
          height: 47,
          background: "#212937",
          borderRadius: 10,
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          padding: "0 16px 0 63px",
          outline: "none",
          border: "none",
        }}
      />
      {trailing}
    </div>
  </div>
);

const AuthModal = ({ tab = "login", onClose, onSwitch }) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const isLogin = tab === "login";

  // Esc চাপলে বন্ধ — মূল সাইটের মতোই
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgb(0 0 0 / 0.6)", zIndex: 60 }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{ width: 444 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="tb-hover-fade absolute cursor-pointer"
          style={{ top: 25, right: 25, width: 22, height: 22, zIndex: 1, color: "#fff" }}
        >
          <Icon name="popup-close" size={22} />
        </button>

        <div
          style={{
            background: "#181f2b",
            borderRadius: 20,
            padding: "95px 35px 30px",
          }}
        >
          {/* ট্যাব */}
          <div className="flex" style={{ width: 374, height: 38 }}>
            {[
              { key: "login", label: t.auth.loginTab },
              { key: "register", label: t.auth.registerTab },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSwitch?.(item.key)}
                className="cursor-pointer"
                style={{
                  width: 120,
                  height: 38,
                  borderRadius: 10,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#fff",
                  background: item.key === tab ? "var(--accent-bright)" : "transparent",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ফর্ম */}
          <div style={{ width: 374, marginTop: 50 }}>
            <Field
              kind="user"
              placeholder={t.auth.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Field
              kind="pass"
              type="password"
              placeholder={t.auth.password}
              trailing={
                <span
                  className="absolute cursor-pointer"
                  style={{ right: 16, top: 13.5, color: "#a8a8a8" }}
                >
                  <Icon name="hide-eyes-default" size={20} />
                </span>
              }
            />

            {!isLogin && (
              <>
                <Field kind="pass" type="password" placeholder={t.auth.confirmPassword} />
                <Field
                  kind="captcha"
                  placeholder={t.auth.captcha}
                  trailing={
                    <span
                      className="absolute flex items-center justify-center"
                      style={{
                        right: 10,
                        top: 8.5,
                        width: 78,
                        height: 30,
                        borderRadius: 4,
                        background: "#f2f2f2",
                        color: "#333",
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 1,
                        fontStyle: "italic",
                      }}
                    >
                      18957
                    </span>
                  }
                />
              </>
            )}

            {isLogin && (
              <div className="flex items-center" style={{ height: 50 }}>
                <label
                  className="flex cursor-pointer items-center"
                  style={{ gap: 10, color: "var(--accent-bright)", fontSize: 17, fontWeight: 500 }}
                >
                  <input
                    type="checkbox"
                    style={{ width: 30, height: 30, accentColor: "var(--accent-bright)" }}
                  />
                  {t.auth.remember}
                </label>
                <span className="flex-1" />
                <span
                  className="cursor-pointer"
                  style={{ color: "var(--accent-bright)", fontSize: 17, fontWeight: 500 }}
                >
                  {t.auth.forgot}
                </span>
              </div>
            )}

            <div style={{ paddingTop: 20, paddingBottom: 20 }}>
              <button
                type="button"
                onClick={() => {
                  // server নেই — আপাতত স্ট্যাটিক ইউজার বসিয়ে লগইন অবস্থাটা দেখাই
                  dispatch(login({ username }));
                  onClose?.();
                }}
                className="tb-hover-fade cursor-pointer"
                style={{
                  width: 374,
                  height: 58,
                  borderRadius: 7,
                  background: "var(--accent-bright)",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {isLogin ? t.auth.loginTab : t.auth.registerTab}
              </button>
            </div>

            <div style={{ fontSize: 14, color: "#fff", lineHeight: "16px" }}>
              {t.auth.terms}
            </div>
          </div>

          {/* নিচের লিংক */}
          <div
            className="flex justify-center"
            style={{ width: 374, paddingTop: 19, fontSize: 14, color: "#fff", gap: 6 }}
          >
            <span>{isLogin ? t.auth.noAccount : t.auth.haveAccount}</span>
            <span
              className="cursor-pointer"
              style={{ color: "var(--accent-bright)" }}
              onClick={() => onSwitch?.(isLogin ? "register" : "login")}
            >
              {isLogin ? t.auth.registerNow : t.auth.loginNow}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
