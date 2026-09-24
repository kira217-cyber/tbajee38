import React, { useState } from "react";

import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";

/**
 * সাইট খুললেই যে "Notice" পপআপ আসে।
 *
 * মূল সাইট থেকে মাপা —
 * **ডেস্কটপ** (`.popup_modal_wrap`): ১১৪৭ × ৬৪৮; ক্লোজ ২২ × ২২ (১১০০, ২৫);
 *   `.popup-content` এর ব্যাকগ্রাউন্ডে ছবি, padding `30 24 30 17`;
 *   `.popup-main` ১১০৬ × ৫৮৮ — বাঁয়ে তালিকা ২৪০.৬ চওড়া,
 *   ডানে বিস্তারিত ৮৪৫.৪ চওড়া, padding `60 20 20`
 * **মোবাইল** (`.popup_content`): ৫৬২ × ১১৬০ (৭৫০-ডিজাইনে), bg #1B2132,
 *   radius ১২; ক্লোজ ১০০ × ১০০ উপরে-ডানে, bg rgba(255,255,255,.2);
 *   শিরোনাম (৩০, ৩০) fs ৩২ fw ৮০০; লেখা (৩০, ১০২) fs ২৬
 */
const NoticeModal = ({ items = [], onClose }) => {
  const { t, lang } = useLanguage();
  const titleOf = (item) => (lang === "en" && item?.titleEn) || item?.title;
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  const current = items[Math.min(active, items.length - 1)];

  if (!isDesktop) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "rgb(0 0 0 / 0.6)", zIndex: 70 }}
        onClick={onClose}
      >
        <div
          className="relative"
          style={{
            width: m(562),
            maxHeight: "82vh",
            background: "#1b2132",
            borderRadius: m(12),
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="absolute flex cursor-pointer items-center justify-center"
            style={{
              top: 0,
              right: 0,
              width: m(100),
              height: m(100),
              background: "rgb(255 255 255 / 0.2)",
              color: "#fff",
            }}
          >
            <Icon name="popup-close" size={m(40)} />
          </button>

          <div
            style={{
              padding: m(30),
              fontSize: m(32),
              fontWeight: 800,
              color: "#fff",
              width: m(442),
            }}
          >
            {titleOf(current)}
          </div>

          <div
            className="hide-scrollbar"
            style={{
              padding: `0 ${m(30)} ${m(30)}`,
              fontSize: m(26),
              color: "#fff",
              overflowY: "auto",
              maxHeight: "60vh",
            }}
          >
            {current.image && (
              <img src={current.image} alt="" style={{ width: "100%", display: "block" }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgb(0 0 0 / 0.6)", zIndex: 70 }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{ width: 1147, height: 648 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="tb-hover-fade absolute cursor-pointer"
          style={{ top: 25, right: 25, width: 22, height: 22, zIndex: 2, color: "#fff" }}
        >
          <Icon name="popup-close" size={22} />
        </button>

        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
            overflow: "hidden",
            background: "#1b2132",
            backgroundImage: "url(/assets/site/announce-bg.854443e2.png)",
            backgroundSize: "cover",
            padding: "30px 24px 30px 17px",
            display: "flex",
            gap: 37,
          }}
        >
          {/* বাঁয়ে নোটিশের তালিকা */}
          <div
            className="hide-scrollbar"
            style={{
              width: 240.6,
              height: 588,
              overflowY: "auto",
              background: "rgb(0 0 0 / 0.25)",
            }}
          >
            {items.map((item, i) => (
              <button
                key={item.id ?? i}
                type="button"
                onClick={() => setActive(i)}
                className="flex w-full cursor-pointer items-center text-left"
                style={{
                  padding: "14px 16px",
                  gap: 10,
                  color: i === active ? "#fff" : "#c5c9d6",
                  fontSize: 15,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === active ? "#4aa3ff" : "#5b6480",
                    flexShrink: 0,
                  }}
                />
                <span className="flex-1 truncate">{titleOf(item)}</span>
                <Icon name="common-arrow" size={14} />
              </button>
            ))}
          </div>

          {/* ডানে বিস্তারিত */}
          <div
            className="hide-scrollbar"
            style={{ width: 845.4, height: 588, padding: "60px 20px 20px", overflowY: "auto" }}
          >
            <div style={{ fontSize: 46, fontWeight: 700, color: "#fff", fontStyle: "italic" }}>
              {t.noticeTitle}
            </div>
            <div style={{ fontSize: 24, color: "#fff", marginTop: 18 }}>{titleOf(current)}</div>
            {current.image && (
              <img
                src={current.image}
                alt=""
                style={{ width: "100%", marginTop: 20, display: "block" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
