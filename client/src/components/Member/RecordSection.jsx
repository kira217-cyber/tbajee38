import React, { useState } from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell, { EmptyState } from "./MemberShell";

/**
 * রেকর্ড দেখানোর ফিচার — বেটিং রেকর্ড, অ্যাকাউন্ট রেকর্ড,
 * লাভ ও ক্ষতি, জমা/উত্তোলন রেকর্ড।
 *
 *   ডেস্কটপ — মডালে চওড়া টেবিল + তারিখের ফিল্টার
 *   মোবাইল — আলাদা পেজ, চিপের ফিল্টার + খালি অবস্থার ছবি
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
/**
 * ডেস্কটপ মডালের রেকর্ড ট্যাব — বেটিং রেকর্ড, অ্যাকাউন্ট রেকর্ড,
 * লাভ ও ক্ষতি।
 *
 * মূল সাইট থেকে মাপা:
 *   উপরে গেমের ট্যাব সারি (সক্রিয়টা লাল #E8474C, নিচে লাল রেখা),
 *     বেটিং রেকর্ডে ডানে লাল পিল "বর্জিত টার্নওভার তালিকা"
 *   ফিল্টার সারি — রেডিও (আজ / গতকাল / ৭ দিন / ○), ক্যালেন্ডার সহ
 *     তারিখের বাক্স, কোথাও "বিক্রেতা: সব" ড্রপডাউন, লাল "অন্যান্য"
 *     বোতাম, আর গিয়ার আইকন
 *   টেবিলের শিরোনাম সারি ধূসর (#FAFAFA), নিচে খালি বার্তা মাঝখানে
 *   নিচে "মোট" সারি, আর একদম নিচে "ডেসিমাল পয়েন্ট" টগল
 */
const RANGES = ["today", "yesterday", "days7", "custom"];

const Desktop = ({ tab }) => {
  const { t } = useLanguage();
  const [range, setRange] = useState("today");
  const [gameTab, setGameTab] = useState(0);
  const [decimal, setDecimal] = useState(false);

  const config = t.member.desk[tab];
  const columns = config.columns;
  const tabs = config.tabs ?? [];

  const stamp = new Date().toISOString().slice(5, 10).replace("-", "/");

  return (
    <div
      className="flex flex-col"
      style={{ width: 1110, height: 620, background: "#fff" }}
    >
      {/* গেমের ট্যাব */}
      <div
        className="flex items-center"
        style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}
      >
        {tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setGameTab(index)}
            className="relative h-full cursor-pointer"
            style={{
              padding: "0 18px",
              fontSize: 14,
              color: index === gameTab ? "#e8474c" : "#666",
            }}
          >
            {label}
            {index === gameTab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: "70%", height: 2, background: "#e8474c" }}
              />
            )}
          </button>
        ))}

        <span className="flex-1" />

        {config.action && (
          <span
            className="flex cursor-pointer items-center justify-center"
            style={{
              height: 28,
              padding: "0 14px",
              borderRadius: 14,
              background: "#e8474c",
              color: "#fff",
              fontSize: 12,
            }}
          >
            {config.action}
          </span>
        )}
      </div>

      {/* ফিল্টার সারি */}
      <div
        className="flex items-center"
        style={{ height: 52, padding: "0 20px", gap: 14, fontSize: 13, color: "#666" }}
      >
        {RANGES.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center"
            style={{ gap: 6 }}
          >
            <input
              type="radio"
              checked={range === key}
              onChange={() => setRange(key)}
              style={{ accentColor: "#e8474c" }}
            />
            {key !== "custom" && (
              <span>{key === "days7" ? t.member.pages.days7 : t.member.ranges[key]}</span>
            )}
          </label>
        ))}

        <span
          className="flex items-center"
          style={{
            height: 30,
            padding: "0 10px",
            border: "1px solid #ddd",
            borderRadius: 4,
            gap: 8,
            color: "#333",
          }}
        >
          <Icon name="discount-calender" size={16} />
          {stamp} 00:00:00~{stamp} 23:59
        </span>

        {config.vendorSelect && (
          <span className="flex items-center" style={{ gap: 8 }}>
            {t.member.desk.vendorLabel}
            <span
              className="flex items-center"
              style={{
                height: 30,
                padding: "0 10px",
                border: "1px solid #ddd",
                borderRadius: 4,
                gap: 18,
                color: "#333",
              }}
            >
              {t.promo.all}
              <Icon name="arrow-down" size={12} />
            </span>
          </span>
        )}

        <button
          type="button"
          className="tb-hover-fade cursor-pointer"
          style={{
            height: 30,
            padding: "0 18px",
            borderRadius: 4,
            background: "#e8474c",
            color: "#fff",
            fontSize: 13,
          }}
        >
          {t.member.desk.other}
        </button>

        {config.gear && (
          <span
            className="grid cursor-pointer place-items-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              border: "1px solid #ddd",
              color: "#888",
            }}
          >
            <Icon name="security-center" size={16} />
          </span>
        )}
      </div>

      {/* টেবিলের শিরোনাম */}
      <div
        className="flex items-center"
        style={{
          height: 38,
          background: "#fafafa",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          padding: "0 20px",
          fontSize: 12,
          color: "#666",
        }}
      >
        {columns.map((column, index) => (
          <span key={`${column}-${index}`} style={{ flex: 1, textAlign: "center" }}>
            {column}
          </span>
        ))}
      </div>

      {/* খালি অবস্থা */}
      <div
        className="flex flex-1 items-center justify-center"
        style={{ color: "#999", fontSize: 13, background: "#f5f5f5" }}
      >
        {t.member.desk.noMatch}
      </div>

      {/* মোট সারি */}
      <div
        className="flex items-center"
        style={{
          height: 38,
          borderTop: "1px solid #eee",
          padding: "0 20px",
          fontSize: 12,
          color: "#666",
        }}
      >
        {columns.map((column, index) => (
          <span key={`${column}-${index}`} style={{ flex: 1, textAlign: "center" }}>
            {index === 0 ? t.member.desk.total : (config.zero ?? "0.00")}
          </span>
        ))}
      </div>

      {/* নিচের বার */}
      <div
        className="flex items-center justify-end"
        style={{ height: 40, padding: "0 20px", gap: 12, fontSize: 12, color: "#888" }}
      >
        {config.note && <span>{config.note}</span>}
        <span>{t.member.desk.decimal}</span>
        <button
          type="button"
          onClick={() => setDecimal((v) => !v)}
          className="relative cursor-pointer"
          style={{
            width: 38,
            height: 20,
            borderRadius: 10,
            background: decimal ? "#e8474c" : "#dcdce0",
            transition: "background .2s",
          }}
        >
          <span
            className="absolute"
            style={{
              top: 2,
              left: decimal ? 20 : 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#fff",
              transition: "left .2s",
            }}
          />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * রেকর্ড দেখানোর সাব-পেজ — বেটিং রেকর্ড, লাভ ও লস, জমা/উত্তোলন রেকর্ড,
 * অ্যাকাউন্ট রেকর্ড।
 *
 * মূল সাইট থেকে মাপা:
 *   ফিল্টার সারি — সক্রিয় চিপ ভরাট নীল (#1E9BF0) সাথে ✓, বাকিগুলো
 *     সাদা পটভূমিতে নীল বর্ডার ও নীল লেখা; শেষে ক্যালেন্ডার আইকন সহ
 *     তারিখের সীমা
 *   বেটিং রেকর্ডে উপরে গেমের ট্যাব সারি (স্লট/মাছ/লাইভ/পোকার/খেলাধুলা)
 *   "লাভ এবং লস" পেজের শিরোনাম আসলে "ব্যক্তিগত প্রতিবেদন", আর
 *     ফিল্টারে "7 দিন" ও আছে
 *   ডেটা না থাকলে নীল ইলাস্ট্রেশন + "কোন ডেটা নেই"; কিছু পেজের নিচে
 *     লাল অস্বীকরণ বার
 */
const GAME_TABS = ["RNG", "FISH", "LIVE", "PVP", "SPORTS"];

const Mobile = ({ titleKey, withGameTabs = false, withDays7 = false, pageTitle }) => {
  const { t } = useLanguage();
  const [range, setRange] = useState("today");

  const keys = withDays7
    ? ["today", "yesterday", "days7"]
    : ["today", "yesterday", "week", "month"];

  const ranges = keys.map((key) => ({
    key,
    label: key === "days7" ? t.memberPage.pages.days7 : t.member.ranges[key],
  }));

  const tabs = withGameTabs
    ? GAME_TABS.map((key) => ({ key, label: t.gameCenter[key] }))
    : undefined;

  const today = new Date();
  const stamp = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
    today.getDate(),
  ).padStart(2, "0")}`;

  return (
    <MemberShell
      title={pageTitle ? t.memberPage.pages[pageTitle].title : t.memberPage.items[titleKey]}
      tabs={tabs}
    >
      {/* ফিল্টার সারি */}
      <div
        className="hide-scrollbar flex overflow-x-auto items-center"
        style={{ background: "#fff", padding: `${m(20)} ${m(24)}`, gap: m(16) }}
      >
        {ranges.map((option) => {
          const active = option.key === range;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setRange(option.key)}
              className="flex shrink-0 cursor-pointer items-center"
              style={{
                height: m(76),
                padding: `0 ${m(26)}`,
                borderRadius: m(12),
                background: active ? "#1e9bf0" : "#fff",
                border: `1px solid ${active ? "#1e9bf0" : "#1e9bf0"}`,
                color: active ? "#fff" : "#1e9bf0",
                fontSize: m(28),
                gap: m(10),
              }}
            >
              {active && <Icon name="achievement-done" size={m(32)} />}
              {option.label}
            </button>
          );
        })}

        <span
          className="flex shrink-0 items-center"
          style={{
            height: m(76),
            padding: `0 ${m(24)}`,
            borderRadius: m(12),
            border: "1px solid #1e9bf0",
            color: "#1e9bf0",
            fontSize: m(28),
            gap: m(12),
          }}
        >
          <Icon name="discount-calender" size={m(34)} />
          {stamp}- {stamp}
        </span>
      </div>

      <EmptyState />

      {/* অস্বীকরণ বার — মূল সাইটে লাভ-লস ও রিবেটে থাকে */}
      {withDays7 && (
        <div
          className="flex items-center justify-center"
          style={{
            background: "#fff5f5",
            borderTop: "1px solid #ffdcdc",
            color: "#e60012",
            fontSize: m(26),
            padding: m(20),
            gap: m(12),
          }}
        >
          <span
            className="grid place-items-center"
            style={{
              width: m(34),
              height: m(34),
              borderRadius: "50%",
              background: "#f97316",
              color: "#fff",
              fontSize: m(24),
            }}
          >
            !
          </span>
          {t.memberPage.pages.note}
        </div>
      )}
    </MemberShell>
  );
};

const RecordSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default RecordSection;
