import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectPromotions } from "../../features/global/globalSelectors";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";

/**
 * প্রমোশন পেজ।
 *
 * মূল সাইট থেকে মাপা (ডেস্কটপ, `/promotions`):
 *   উপরে ক্যাটাগরির পিল — `.promo-menu-item` ১২৬ × ৪৮.৮, radius ১৪,
 *     bg ক্রিম, লেখা #1D212D
 *   কার্ড গ্রিড y ১৯৮.৮, প্রস্থ ১০৮৫, gap `৩০px ২০px` — ৩ কলাম
 *   কার্ড ৩৪৮ × ২১৭, radius ১৭; ছবি পুরো কার্ড জুড়ে
 *   নিচে ওভারলে বার `.active-item-info` y ১৭২ উঁচু ৪৫,
 *     bg rgba(53,27,108,.8)
 *   শিরোনাম x ১৪ fs ১৮ সাদা; "আরও" বোতাম ৭৮.৪ × ৩১.২ radius ২০
 *
 * মোবাইলে একই কার্ড, কিন্তু এক কলামে পুরো প্রস্থে।
 */
const Promotions = () => {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const promotions = useSelector(selectPromotions);
  const [category, setCategory] = useState("all");

  const categories = [{ key: "all", label: t.promo.all }];

  return (
    <div style={{ paddingBottom: isDesktop ? 0 : m(140) }}>
      {/* ক্যাটাগরির পিল */}
      <div
        className="hide-scrollbar flex overflow-x-auto"
        style={{
          paddingTop: isDesktop ? 38 : m(24),
          paddingInline: isDesktop ? 0 : m(24),
          gap: isDesktop ? 14 : m(16),
        }}
      >
        {categories.map((item) => {
          const active = item.key === category;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setCategory(item.key)}
              className="shrink-0 cursor-pointer"
              style={{
                height: isDesktop ? 48.8 : m(68),
                minWidth: isDesktop ? 126 : m(160),
                padding: isDesktop ? "0 15px" : `0 ${m(24)}`,
                borderRadius: isDesktop ? 14 : m(20),
                background: active ? "#f3e6cd" : "rgb(255 255 255 / 0.06)",
                color: active ? "#1d212d" : "#fff",
                fontSize: isDesktop ? 16 : m(24),
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* কার্ড গ্রিড */}
      <div
        style={{
          marginTop: isDesktop ? 48.8 : m(24),
          paddingInline: isDesktop ? 0 : m(24),
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr",
          gap: isDesktop ? "30px 20px" : m(24),
        }}
      >
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="relative cursor-pointer"
            style={{
              aspectRatio: "348 / 217",
              borderRadius: isDesktop ? 17 : m(20),
              overflow: "hidden",
              background: "var(--surface)",
            }}
          >
            {promo.image && (
              <img
                src={promo.image}
                alt={promo.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}

            <div
              className="absolute right-0 bottom-0 left-0 flex items-center"
              style={{
                height: isDesktop ? 45 : m(64),
                background: "rgb(53 27 108 / 0.8)",
                padding: isDesktop ? "0 9px 0 14px" : `0 ${m(14)} 0 ${m(20)}`,
                gap: isDesktop ? 10 : m(12),
              }}
            >
              <span
                className="flex-1 truncate"
                style={{ fontSize: isDesktop ? 18 : m(24), color: "#fff" }}
              >
                {promo.title}
              </span>
              <span
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: isDesktop ? 78.4 : m(110),
                  height: isDesktop ? 31.2 : m(44),
                  borderRadius: isDesktop ? 20 : m(30),
                  background: "#c0392f",
                  color: "#fff",
                  fontSize: isDesktop ? 16 : m(22),
                  fontWeight: 600,
                }}
              >
                {t.promo.more}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
