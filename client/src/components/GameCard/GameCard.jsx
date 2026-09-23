import React from "react";

import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";
import { vendorLabel } from "../../data/vendorNames";

/**
 * একটা গেমের কার্ড — ডেস্কটপ ও মোবাইলে গঠন আলাদা, তাই দুটো আলাদা শাখা।
 *
 * **ডেস্কটপ** (মাপা): কার্ড ১৬৪.২ × ১৯৫.৮
 *   `.game-img` বর্গ, radius ১৬; ভিতরের `<img>` **object-fit: contain**
 *   `.game-info` ৩১.৭ উঁচু, padding-top ৯.৭; নাম ২২ উঁচু fs ১৭
 *   `.fav-btn` ৪৩.৮ বৃত্ত bg rgba(0,0,0,.37), উপরে-বাঁয়ে ৫,৫
 *   `.game-vassalage` ৪৯ × ৩৬ **নিচে-ডানে**, radius `32px 0 16px`
 *   hover: ছবি scale(1.1), overlay + "এখন খেলুন"/"ফ্রি ট্রায়াল"
 *
 * **মোবাইল** (৭৫০-ডিজাইনে মাপা): কার্ড ২১৭ × ২৮১ — বর্গ নয়, **লম্বা**
 *   `.game-background` ২১৭ × ২৪৫ (অনুপাত 217/245), radius ১৬,
 *     ছবি **object-fit: cover**
 *   `.game-fav` ৩২ × ২৯ উপরে-বাঁয়ে ৮,৮ (ডেস্কটপের বৃত্ত নয়)
 *   ব্যাজ ৭৩ × ৩৩ **উপরে-ডানে**, bg #BC43F4, fs ২০
 *   নাম y ২৫০ থেকে, উচ্চতা ৩১, fs ২৬
 */
const GameCard = ({ game }) => {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div className="relative cursor-pointer" style={{ width: "100%" }}>
        <div
          className="relative"
          style={{
            width: "100%",
            aspectRatio: "217 / 245",
            borderRadius: m(16),
            overflow: "hidden",
            background: "rgb(255 255 255 / 0.04)",
          }}
        >
          <img
            src={game.icon}
            alt={game.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {/* মোবাইলের হার্ট ডেস্কটপেরটা নয় — কালো বৃত্ত ছাড়া, শুধু
              সাদা আউটলাইন (`stroke: #fff`, width ৩.৬) */}
          <button
            type="button"
            aria-label="favourite"
            className="absolute"
            style={{ top: m(8), left: m(8), width: m(32), height: m(29) }}
          >
            <img
              src="/assets/mobile/icons/game-fav.svg"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </button>

        </div>

        {/* ব্যাজটা ছবির বাক্সের **বাইরে** — নইলে radius ১৬ এর কারণে
            উপরের-ডান কোণাটা কেটে যায় (মূল সাইটেও এটা ভাইপর্যায়ে) */}
        {game.vendor && (
          <span
            className="absolute flex items-center justify-center"
            style={{
              top: 0,
              right: 0,
              minWidth: m(73),
              height: m(33),
              padding: `${m(5)} ${m(22)}`,
              background: "var(--accent-bright)",
              // `.game-item-display-name` — TR ও BL কোণা ৫
              borderRadius: `0 ${m(5)} 0 ${m(5)}`,
              color: "#fff",
              fontSize: m(20),
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {vendorLabel(game.vendor)}
          </span>
        )}

        {/* `.game-item-name` — ডেস্কটপের মতো গ্রেডিয়েন্ট নয়, সাদা;
            ডানে ৩২.৫ জায়গা ছাড়া থাকে ("গরম" ব্যাজের জন্য) */}
        <div
          className="truncate"
          style={{
            height: m(31),
            marginTop: m(5),
            paddingInlineEnd: m(32.5),
            fontSize: m(26),
            color: "#fff",
          }}
        >
          {game.name}
        </div>
      </div>
    );
  }

  return (
    <div className="tb-game-card cursor-pointer" style={{ width: "var(--card-w)" }}>
      <div
        className="relative"
        style={{
          width: "var(--card-img)",
          aspectRatio: "1 / 1",
          borderRadius: "var(--card-radius)",
          overflow: "hidden",
          background: "rgb(255 255 255 / 0.04)",
        }}
      >
        <img
          className="tb-game-img"
          src={game.icon}
          alt={game.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            transition: "transform .5s",
          }}
        />

        {game.vendor && (
          <span
            className="absolute right-0 bottom-0 flex items-center justify-center"
            style={{
              minWidth: "var(--badge-w)",
              height: "var(--badge-h)",
              padding: "0 9px",
              background: "var(--accent-bright)",
              borderRadius: "var(--badge-radius)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {vendorLabel(game.vendor)}
          </span>
        )}

        <button
          type="button"
          aria-label="favourite"
          className="absolute flex cursor-pointer items-center justify-center"
          style={{
            top: 5,
            left: 5,
            width: 43.8,
            height: 43.8,
            borderRadius: "50%",
            background: "rgb(0 0 0 / 0.37)",
          }}
        >
          <Icon name="game-fav-default" size={22} />
        </button>

        <div
          className="tb-action-wrap absolute flex flex-col items-center justify-center"
          style={{
            inset: 0,
            background: "rgb(0 0 0 / 0.6)",
            borderRadius: "var(--card-radius)",
            gap: 15,
          }}
        >
          <span
            className="tb-action-btn flex items-center justify-center"
            style={{
              width: 130,
              height: 40,
              borderRadius: 7,
              background: "#da394f",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {t.playNow}
          </span>
          <span
            className="tb-action-btn flex items-center justify-center"
            style={{
              width: 130,
              height: 40,
              borderRadius: 7,
              background: "#1678ff",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            {t.freeTrial}
          </span>
        </div>
      </div>

      <div className="flex items-start" style={{ height: 31.7, paddingTop: 9.7 }}>
        <div
          className="truncate"
          style={{
            width: "100%",
            height: "var(--card-name-h)",
            fontSize: 17,
            fontWeight: 500,
            backgroundImage: "var(--name-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {game.name}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
