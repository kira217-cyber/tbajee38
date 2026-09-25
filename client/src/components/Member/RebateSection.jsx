import React, { useState } from "react";

import { useIsDesktop } from "../../hook/useIsDesktop";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { REBATE_KINDS, useRebate } from "../../features/rebate/useRebate";
import { useAccountRecords } from "../../features/history/useRecords";
import { when } from "../../features/referral/useReferral";
import MemberShell, { EmptyState } from "./MemberShell";

/**
 * "ম্যানুয়াল রিবেট" — ডেস্কটপে মডালের ট্যাব, মোবাইলে `/member/rebate`
 * (মূল সাইটের `/m/member/manualRebate`)।
 *
 * শেষ দাবির পর থেকে খেলার ধরন অনুযায়ী কত রিবেট জমেছে (হার VIP স্তর
 * থেকে), নিচে "দাবি করুন"। "রিবেট ইতিহাস" = খাতার রিবেটের সারি।
 */

const pad = (n) => String(n).padStart(2, "0");
const day = (value) => {
  const d = value ? new Date(value) : new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** "২০২৬-০৯-২০ ~ ২০২৬-০৯-২৫" — একই দিন হলে একটাই */
const windowText = (data) => {
  if (!data) return day();
  const a = day(data.from);
  const b = day(data.to);
  return a === b ? a : `${a} ~ ${b}`;
};

const HISTORY_RANGES = ["today", "days7", "month"];

/** রিবেট ইতিহাস — ডেস্কটপ আর মোবাইল দুটোতেই (মাপ `u` দিয়ে) */
const History = ({ u }) => {
  const { t } = useLanguage();
  const rb = t.rebateFlow;
  const [range, setRange] = useState("days7");
  const { rows, totals, loading } = useAccountRecords({ range, type: "rebate" });

  return (
    <div>
      <div className="flex" style={{ gap: u(8, 14), padding: `${u(12, 20)} ${u(20, 24)}` }}>
        {HISTORY_RANGES.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className="cursor-pointer"
            style={{ height: u(30, 60), padding: `0 ${u(14, 26)}`, borderRadius: u(15, 30), fontSize: u(13, 26), border: `1px solid ${range === key ? "#e8474c" : "#ddd"}`, color: range === key ? "#e8474c" : "#666", background: "#fff" }}
          >
            {rb.days[key]}
          </button>
        ))}
      </div>
      <div className="grid" style={{ gridTemplateColumns: "1.3fr 1.4fr 1fr 1fr", background: "#f4f5f7", color: "#666", fontSize: u(13, 25), textAlign: "center" }}>
        {rb.historyCols.map((h) => (
          <div key={h} style={{ padding: `${u(10, 20)} ${u(4, 6)}` }}>{h}</div>
        ))}
      </div>
      {!loading && rows.length === 0 ? (
        <EmptyState />
      ) : (
        rows.map((row) => (
          <div key={row._id} className="grid" style={{ gridTemplateColumns: "1.3fr 1.4fr 1fr 1fr", borderBottom: "1px solid #f0f0f0", fontSize: u(12, 24), color: "#444", textAlign: "center" }}>
            <div style={{ padding: `${u(9, 18)} ${u(4, 6)}` }}>{when(row.createdAt)}</div>
            <div className="break-all" style={{ padding: `${u(9, 18)} ${u(4, 6)}` }}>{row.orderNo}</div>
            <div style={{ padding: `${u(9, 18)} ${u(4, 6)}`, color: "#16a34a" }}>+{Number(row.amount).toFixed(2)}</div>
            <div style={{ padding: `${u(9, 18)} ${u(4, 6)}` }}>{Number(row.balanceAfter).toFixed(2)}</div>
          </div>
        ))
      )}
      {rows.length > 0 ? (
        <div className="flex justify-between" style={{ padding: `${u(12, 24)} ${u(20, 40)}`, fontSize: u(13, 27), color: "#555" }}>
          <span>{rb.total}</span>
          <span>{Number(totals.amount || 0).toFixed(2)}</span>
        </div>
      ) : null}
    </div>
  );
};

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
const Desktop = () => {
  const { t } = useLanguage();
  const page = t.member.desk.rebate;
  const rb = t.rebateFlow;
  const [tab, setTab] = useState(0);
  const { data, loading, busy, load, claim, canClaim } = useRebate();
  const u = (desk) => `${desk}px`;

  const rows = [
    { key: "date", label: `${rb.date}:`, value: windowText(data) },
    ...REBATE_KINDS.map((k) => ({ key: k, label: `${rb.kinds[k]}:`, value: Number(data?.totals?.[k] || 0).toFixed(2), rate: data?.rates?.[k] })),
    { key: "total", label: `${rb.total}:`, value: Number(data?.totals?.total || 0).toFixed(2) },
  ];

  return (
    <div className="flex flex-col" style={{ width: 1110, height: 620, background: "#fff" }}>
      <div className="flex items-center" style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}>
        {page.tabs.map((item, index) => (
          <button key={item} type="button" onClick={() => setTab(index)} className="relative h-full cursor-pointer" style={{ padding: "0 18px", fontSize: 14, color: index === tab ? "#e8474c" : "#666" }}>
            {item}
            {index === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "70%", height: 2, background: "#e8474c" }} />}
          </button>
        ))}
      </div>

      {tab === 1 ? (
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
          <History u={u} />
        </div>
      ) : (
        <div style={{ flex: 1, padding: "18px 20px", overflowY: "auto" }}>
          {rows.map((row) => (
            <div key={row.key} className="flex items-center" style={{ marginBottom: 8, gap: 14 }}>
              <span style={{ width: 90, textAlign: "left", fontSize: 13, color: "#555" }}>{row.label}</span>
              <span className="flex items-center" style={{ width: row.key === "date" ? 240 : 188, height: 30, background: "#f5f5f5", border: "1px solid #eee", borderRadius: 4, padding: "0 10px", fontSize: 13, color: row.key === "total" && Number(row.value) > 0 ? "#e8474c" : "#666" }}>
                {row.value}
              </span>
              {row.rate !== undefined ? <span style={{ fontSize: 12, color: "#aaa" }}>{row.rate}%</span> : null}
            </div>
          ))}
          {data ? (
            <div style={{ marginTop: 14, fontSize: 12, color: "#999", lineHeight: 1.6 }}>
              {rb.level}: <b style={{ color: "#c8a15a" }}>{data.level?.name || "VIP0"}</b>
              <br />
              {rb.rateNote.replace("{d}", data.maxDays ?? 7)}
              {!data.enabled ? <div style={{ color: "#e8474c" }}>{rb.err.rebateOff}</div> : null}
            </div>
          ) : null}
        </div>
      )}

      {tab === 0 ? (
        <div className="flex items-center" style={{ height: 60, borderTop: "1px solid #eee", padding: "0 20px", gap: 12 }}>
          <button type="button" onClick={load} disabled={loading} className="cursor-pointer" style={{ height: 32, padding: "0 22px", borderRadius: 16, border: "1px solid #ddd", background: "#fff", color: "#555", fontSize: 13 }}>
            {loading ? "…" : rb.refresh}
          </button>
          <button
            type="button"
            onClick={claim}
            disabled={!canClaim || busy}
            className={canClaim ? "cursor-pointer" : ""}
            style={{ height: 32, padding: "0 22px", borderRadius: 16, background: canClaim ? "#e8474c" : "#e2e2e8", color: "#fff", fontSize: 13 }}
          >
            {rb.claim}
          </button>
          {data && !canClaim && data.totals?.total > 0 ? (
            <span style={{ fontSize: 12, color: "#999" }}>{rb.err.rebateTooLow.replace("{n}", data.minClaim)}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * মূল সাইটের `/m/member/manualRebate` — দুটো ট্যাব; রঙিন লেবেলের সারি
 * (বাঁয়ে রঙিন বাক্সে নাম, ডানে সাদা ঘরে কমলা মান, প্রান্তে রঙিন ফালি),
 * শেষে "দাবি" বোতাম আর নিচে লাল অস্বীকরণ বার।
 */
const ROWS = [
  { key: "date", color: "#fb7185", edge: "#fb923c" },
  { key: "slot", color: "#6366f1", edge: "#60a5fa" },
  { key: "fishing", color: "#c084fc", edge: "#a855f7" },
  { key: "live", color: "#14b8a6", edge: "#2dd4bf" },
  { key: "poker", color: "#f9a8d4", edge: "#ec4899" },
  { key: "sports", color: "#f87171", edge: "#fb923c" },
  { key: "total", color: "#6366f1", edge: "#60a5fa" },
];

const Mobile = () => {
  const { t } = useLanguage();
  const page = t.memberPage.pages.rebate;
  const rb = t.rebateFlow;
  const [tab, setTab] = useState(0);
  const { data, loading, busy, load, claim, canClaim } = useRebate();
  const u = (_desk, mob) => m(mob);

  const label = (key) => (key === "date" ? page.date : key === "total" ? page.total : rb.kinds[key]);
  const value = (key) => (key === "date" ? windowText(data) : Number(data?.totals?.[key] || 0).toFixed(2));

  return (
    <MemberShell title={page.title}>
      <div className="flex" style={{ background: "#fff", height: m(96) }}>
        {page.tabs.map((item, index) => (
          <button key={item} type="button" onClick={() => setTab(index)} className="relative flex-1 cursor-pointer" style={{ color: index === tab ? "#1e9bf0" : "#333", fontSize: m(30) }}>
            {item}
            {index === tab && <span className="absolute bottom-0 left-0" style={{ width: "100%", height: m(6), background: "#1e9bf0" }} />}
          </button>
        ))}
      </div>

      {tab === 1 ? (
        <div style={{ background: "#fff", minHeight: "60vh" }}>
          <History u={u} />
        </div>
      ) : (
        <div style={{ background: "#f5f5f9", padding: `${m(24)} ${m(30)} ${m(40)}` }}>
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-stretch" style={{ marginBottom: m(24), height: m(96) }}>
              <span className="grid place-items-center" style={{ width: m(230), borderRadius: m(12), background: row.color, color: "#fff", fontSize: m(30) }}>
                {label(row.key)}
              </span>
              <span className="flex flex-1 items-center justify-end" style={{ background: "#fff", color: "#f97316", fontSize: m(row.key === "date" ? 28 : 34), padding: `0 ${m(28)}` }}>
                {value(row.key)}
                {data?.rates?.[row.key] !== undefined ? <small style={{ color: "#bbb", fontSize: m(22), marginInlineStart: m(10) }}>{data.rates[row.key]}%</small> : null}
              </span>
              <span style={{ width: m(18), borderRadius: `0 ${m(12)} ${m(12)} 0`, background: row.edge }} />
            </div>
          ))}

          {data ? (
            <div style={{ fontSize: m(24), color: "#888", lineHeight: 1.5 }}>
              {rb.level}: <b style={{ color: "#c8a15a" }}>{data.level?.name || "VIP0"}</b> · {rb.rateNote.replace("{d}", data.maxDays ?? 7)}
              {data.totals?.total > 0 && !canClaim && data.enabled ? <div>{rb.err.rebateTooLow.replace("{n}", data.minClaim)}</div> : null}
              {!data.enabled ? <div style={{ color: "#e60012" }}>{rb.err.rebateOff}</div> : null}
            </div>
          ) : null}

          <div className="flex" style={{ gap: m(20), marginTop: m(40) }}>
            <button type="button" onClick={load} disabled={loading} className="cursor-pointer" style={{ width: m(220), height: m(100), borderRadius: m(12), background: "#fff", border: "1px solid #ddd", color: "#555", fontSize: m(32) }}>
              {rb.refresh}
            </button>
            <button
              type="button"
              onClick={claim}
              disabled={!canClaim || busy}
              className="flex-1"
              style={{ height: m(100), borderRadius: m(12), background: canClaim ? "#f5333f" : "#e2e2e8", color: "#fff", fontSize: m(34) }}
            >
              {page.claim}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center" style={{ background: "#fff5f5", borderTop: "1px solid #ffdcdc", color: "#e60012", fontSize: m(26), padding: `${m(20)} ${m(20)}`, gap: m(12) }}>
        <span className="grid place-items-center" style={{ width: m(34), height: m(34), borderRadius: "50%", background: "#f97316", color: "#fff", fontSize: m(24) }}>
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
