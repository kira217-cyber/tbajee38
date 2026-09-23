import React, { useState } from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell, { EmptyState } from "./MemberShell";

/**
 * "রিবেট" — ডেস্কটপে মডালের ট্যাব, মোবাইলে `/member/rebate`।
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
const Desktop = () => {
  const { t } = useLanguage();
  const page = t.member.desk.rebate;
  const [tab, setTab] = useState(0);

  const rows = ["date", "RNG", "FISH", "LIVE", "PVP", "SPORTS", "total"];
  const today = new Date().toISOString().slice(0, 10);

  const label = (key) => {
    if (key === "date") return page.dateLabel;
    if (key === "total") return page.totalLabel;
    return `${t.gameCenter[key]}:`;
  };

  return (
    <div
      className="flex flex-col"
      style={{ width: 1110, height: 620, background: "#fff" }}
    >
      <div
        className="flex items-center"
        style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}
      >
        {page.tabs.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(index)}
            className="relative h-full cursor-pointer"
            style={{
              padding: "0 18px",
              fontSize: 14,
              color: index === tab ? "#e8474c" : "#666",
            }}
          >
            {item}
            {index === tab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: "70%", height: 2, background: "#e8474c" }}
              />
            )}
          </button>
        ))}
      </div>

      {tab === 1 ? (
        <div
          className="flex flex-1 items-center justify-center"
          style={{ color: "#999", fontSize: 13 }}
        >
          {t.member.desk.noMatch}
        </div>
      ) : (
        <div style={{ flex: 1, padding: "22px 20px" }}>
          {rows.map((key) => (
            <div
              key={key}
              className="flex items-center"
              style={{ marginBottom: 12, gap: 14 }}
            >
              <span
                style={{ width: 90, textAlign: "right", fontSize: 13, color: "#555" }}
              >
                {label(key)}
              </span>
              <span
                className="flex items-center"
                style={{
                  width: 188,
                  height: 30,
                  background: "#f5f5f5",
                  border: "1px solid #eee",
                  borderRadius: 4,
                  padding: "0 10px",
                  fontSize: 13,
                  color: "#666",
                }}
              >
                {key === "date" ? today : "0.00"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div
        className="flex items-center"
        style={{ height: 60, borderTop: "1px solid #eee", padding: "0 20px", gap: 12 }}
      >
        <button
          type="button"
          className="cursor-pointer"
          style={{
            height: 32,
            padding: "0 22px",
            borderRadius: 16,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#555",
            fontSize: 13,
          }}
        >
          {page.refresh}
        </button>
        <button
          type="button"
          disabled
          style={{
            height: 32,
            padding: "0 22px",
            borderRadius: 16,
            background: "#e2e2e8",
            color: "#fff",
            fontSize: 13,
          }}
        >
          {page.claim}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * "রিবেট" — মূল সাইটের `/m/member/manualRebate`।
 *
 * গঠন: দুটো ট্যাব (ম্যানুয়াল রিবেট / রিবেট ইতিহাস); নিচে রঙিন লেবেলের
 * সারি — বাঁয়ে রঙিন বাক্সে নাম, ডানে সাদা ঘরে মান (কমলা লেখা), আর
 * ডান প্রান্তে ছোট রঙিন ফালি। শেষে "দাবি" বোতাম (নিষ্ক্রিয় ধূসর) ও
 * নিচে লাল অস্বীকরণ বার।
 *
 * প্রতিটা সারির রঙ মূল সাইটের স্ক্রিনশট থেকে নেওয়া।
 */
const ROWS = [
  { key: "date", color: "#fb7185", edge: "#fb923c" },
  { key: "RNG", color: "#6366f1", edge: "#60a5fa" },
  { key: "FISH", color: "#c084fc", edge: "#a855f7" },
  { key: "LIVE", color: "#14b8a6", edge: "#2dd4bf" },
  { key: "PVP", color: "#f9a8d4", edge: "#ec4899" },
  { key: "SPORTS", color: "#f87171", edge: "#fb923c" },
  { key: "total", color: "#6366f1", edge: "#60a5fa" },
];

const Mobile = () => {
  const { t } = useLanguage();
  const page = t.memberPage.pages.rebate;
  const [tab, setTab] = useState(0);

  const label = (key) => {
    if (key === "date") return page.date;
    if (key === "total") return page.total;
    return t.gameCenter[key];
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <MemberShell title={page.title}>
      {/* দুটো ট্যাব */}
      <div className="flex" style={{ background: "#fff", height: m(96) }}>
        {page.tabs.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(index)}
            className="relative flex-1 cursor-pointer"
            style={{ color: index === tab ? "#1e9bf0" : "#333", fontSize: m(30) }}
          >
            {item}
            {index === tab && (
              <span
                className="absolute bottom-0 left-0"
                style={{ width: "100%", height: m(6), background: "#1e9bf0" }}
              />
            )}
          </button>
        ))}
      </div>

      {tab === 1 ? (
        <EmptyState />
      ) : (
        <div style={{ background: "#f5f5f9", padding: `${m(24)} ${m(30)} ${m(40)}` }}>
          {ROWS.map((row) => (
            <div
              key={row.key}
              className="flex items-stretch"
              style={{ marginBottom: m(24), height: m(96) }}
            >
              <span
                className="grid place-items-center"
                style={{
                  width: m(230),
                  borderRadius: m(12),
                  background: row.color,
                  color: "#fff",
                  fontSize: m(30),
                }}
              >
                {label(row.key)}
              </span>

              <span
                className="flex flex-1 items-center justify-end"
                style={{
                  background: "#fff",
                  color: "#f97316",
                  fontSize: m(34),
                  padding: `0 ${m(28)}`,
                }}
              >
                {row.key === "date" ? today : "0.00"}
              </span>

              <span
                style={{
                  width: m(18),
                  borderRadius: `0 ${m(12)} ${m(12)} 0`,
                  background: row.edge,
                }}
              />
            </div>
          ))}

          <button
            type="button"
            disabled
            className="w-full"
            style={{
              marginTop: m(40),
              height: m(100),
              borderRadius: m(12),
              background: "#e2e2e8",
              color: "#fff",
              fontSize: m(34),
            }}
          >
            {page.claim}
          </button>
        </div>
      )}

      {/* নিচের অস্বীকরণ বার */}
      <div
        className="flex items-center justify-center"
        style={{
          background: "#fff5f5",
          borderTop: "1px solid #ffdcdc",
          color: "#e60012",
          fontSize: m(26),
          padding: `${m(20)} ${m(20)}`,
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
    </MemberShell>
  );
};

const RebateSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default RebateSection;
