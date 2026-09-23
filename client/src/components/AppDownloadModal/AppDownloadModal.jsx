import React from "react";

import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";

/**
 * অ্যাপ ডাউনলোডের মডাল।
 *
 * মূল সাইটের মোবাইল `.bottom-modal.a2hs` থেকে মাপা (৭৫০-ডিজাইনে):
 *   নিচ থেকে ওঠা প্যানেল ৭৫০ × ৩৪৬, উপরের কোণ radius ১৫.৬
 *   আইকন ১২০ × ১২০ (x ৪৪), পাশে বর্ণনা ৪৯৩ চওড়া fs ৩০
 *   ক্লোজ ৫০ বৃত্ত bg #868686, উপরে-ডানে
 *   দুটো বোতাম ৩০০ × ৭৪ radius ১৪.৬ —
 *     "APP" bg #1678FF, "ওয়েব-অ্যাপ" সাদা বর্ডার
 *   APP বোতামের উপরে ছোট ট্যাগ ১২৬ × ৩০ bg #EA4E3D
 */
const AppDownloadModal = ({ onClose }) => {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();

  const panel = isDesktop
    ? { width: 520, borderRadius: 16, padding: 28 }
    : {
        width: "100%",
        borderRadius: `${m(15.6)} ${m(15.6)} 0 0`,
        padding: `${m(30)} ${m(30)} ${m(40)}`,
      };

  return (
    <div
      className="fixed inset-0 flex justify-center"
      style={{
        background: "rgb(0 0 0 / 0.6)",
        zIndex: 80,
        alignItems: isDesktop ? "center" : "flex-end",
      }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{ ...panel, background: "#fff", color: "#222" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="absolute grid cursor-pointer place-items-center"
          style={{
            top: isDesktop ? 16 : m(30),
            right: isDesktop ? 16 : m(20),
            width: isDesktop ? 34 : m(50),
            height: isDesktop ? 34 : m(50),
            borderRadius: "50%",
            background: "#868686",
            color: "#fff",
          }}
        >
          <Icon name="popup-close" size={isDesktop ? 16 : m(25)} />
        </button>

        <div className="flex items-center" style={{ gap: isDesktop ? 18 : m(18) }}>
          <img
            src="/assets/mobile/logo.png"
            alt={t.brand}
            style={{
              width: isDesktop ? 84 : m(120),
              height: isDesktop ? 84 : m(120),
              borderRadius: isDesktop ? 12 : m(8),
              objectFit: "contain",
              background: "#f3f3f3",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: isDesktop ? 16 : m(30),
              lineHeight: 1.45,
              color: "#222",
            }}
          >
            {t.download.desc}
          </div>
        </div>

        <div
          className="text-center"
          style={{
            marginTop: isDesktop ? 22 : m(28),
            fontSize: isDesktop ? 15 : m(32),
            color: "#1678ff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          {t.download.continueBrowser}
        </div>

        <div
          className="flex justify-center"
          style={{ marginTop: isDesktop ? 18 : m(26), gap: isDesktop ? 16 : m(20) }}
        >
          <span className="relative">
            <span
              className="absolute grid place-items-center"
              style={{
                top: isDesktop ? -12 : m(-24),
                left: "50%",
                transform: "translateX(-50%)",
                width: isDesktop ? 96 : m(126),
                height: isDesktop ? 22 : m(30),
                borderRadius: isDesktop ? 6 : m(6.5),
                background: "#ea4e3d",
                color: "#fff",
                fontSize: isDesktop ? 12 : m(16),
                whiteSpace: "nowrap",
              }}
            >
              {t.download.tag}
            </span>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center"
              style={{
                width: isDesktop ? 200 : m(300),
                height: isDesktop ? 50 : m(74),
                borderRadius: isDesktop ? 10 : m(14.6),
                background: "#1678ff",
                color: "#fff",
                fontSize: isDesktop ? 16 : m(24),
                gap: 8,
              }}
            >
              <Icon name="icon-android" size={isDesktop ? 20 : m(40)} />
              APP
            </button>
          </span>

          <button
            type="button"
            className="flex cursor-pointer items-center justify-center"
            style={{
              width: isDesktop ? 200 : m(300),
              height: isDesktop ? 50 : m(74),
              borderRadius: isDesktop ? 10 : m(14.6),
              background: "#fff",
              border: "1px solid #1678ff",
              color: "#1678ff",
              fontSize: isDesktop ? 16 : m(24),
              gap: 8,
            }}
          >
            <Icon name="icon-apple" size={isDesktop ? 20 : m(40)} />
            {t.download.webApp}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadModal;
