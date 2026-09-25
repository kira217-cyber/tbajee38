import React, { useState } from "react";
import { maskNumber } from "../../features/withdraw/useWithdrawFlow";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell, { EmptyState } from "./MemberShell";
import { BET_TABS, useBetRecords } from "../../features/history/useBetRecords";
import { rangeOf, shortDate } from "../../features/history/dateRange";
import {
  ACCOUNT_TABS,
  PL_TABS,
  useAccountRecords,
  useProfitLoss,
  useRequestRecords,
} from "../../features/history/useRecords";

/** "09/25 16:12:30" — রেকর্ডের সময় */
const fmtTime = (value) => {
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/** + জমা সবুজ, − কাটা লাল, চিহ্ন সহ */
const signed = (n, decimal = true) => `${Number(n) > 0 ? "+" : ""}${fmt(n, decimal)}`;

/** টাকার লেখা — ডেসিমাল টগল বন্ধ থাকলে পূর্ণসংখ্যা (মূল সাইটের মতো) */
const fmt = (value, decimal = true) => {
  const n = Number(value) || 0;
  return decimal
    ? n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(n).toLocaleString("en-US");
};

/** লাভ/ক্ষতির রঙ — লাভ সবুজ, ক্ষতি লাল */
const plColor = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#e8474c" : undefined);

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

/** "স্থিতি: সব ▾" — মূল সাইটের ফিল্টারের ড্রপডাউন */
const FilterSelect = ({ label, value, onChange, options }) => (
  <span className="flex items-center" style={{ gap: 8 }}>
    {label}:
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer"
      style={{ height: 30, minWidth: 100, padding: "0 8px", border: "1px solid #ddd", borderRadius: 4, color: "#333", background: "#fff", fontSize: 13, outline: "none" }}
    >
      {options.map(([key, text]) => (
        <option key={key} value={key}>
          {text}
        </option>
      ))}
    </select>
  </span>
);

const Desktop = ({ tab }) => {
  const { t } = useLanguage();
  const [range, setRange] = useState("today");
  const [gameTab, setGameTab] = useState(0);
  const [decimal, setDecimal] = useState(false);

  const { lang } = useLanguage();
  const config = t.member.desk[tab];
  const dr = t.deskRec;
  const isAccTab = tab === "accountRecord";
  // অ্যাকাউন্ট রেকর্ড — মূল সাইটের মতো তিন ট্যাব: লেনদেন / জমা / উত্তোলন রেকর্ড
  const tabs = isAccTab ? dr.tabs : config.tabs ?? [];
  const columns = isAccTab ? dr.columns[gameTab] : config.columns;
  const [accType, setAccType] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");

  // বেটিং রেকর্ড server থেকে; অন্য রেকর্ডগুলো নিজ নিজ ধাপে আসবে
  const isBet = tab === "betRecord";
  const bet = useBetRecords({ range, tab: BET_TABS[gameTab], enabled: isBet });

  const span = rangeOf(range);
  const from = shortDate(span.from);
  const to = shortDate(span.to);

  const isAcc = tab === "accountRecord";
  const isPL = tab === "profitLoss";
  const acc = useAccountRecords({ range, type: accType, enabled: isAcc && gameTab === 0 });
  const reqKind = isAcc && gameTab === 1 ? "deposit" : isAcc && gameTab === 2 ? "withdraw" : null;
  const requests = useRequestRecords({ kind: reqKind || "deposit", range, enabled: Boolean(reqKind) });
  const nameOf = (v) => (v && typeof v === "object" ? v[lang] || v.bn || v.en || "" : v || "");
  const reqRows = requests.rows.filter(
    (r) => (status === "all" || r.status === status) && (method === "all" || r.methodId?.toLowerCase() === method),
  );
  const methodOptions = [...new Set(requests.rows.map((r) => r.methodId?.toLowerCase()).filter(Boolean))];
  const statusText = (st) => (
    <span style={{ color: st === "approved" ? "#16a34a" : st === "rejected" ? "#e8474c" : "#f5a623" }}>{dr.status[st] || st}</span>
  );
  const shortId = (r) => String(r._id || "").slice(-10).toUpperCase();
  const pl = useProfitLoss({ range, tab: PL_TABS[gameTab], enabled: isPL });
  const typeLabel = (type) => t.records.types[type] || type;

  const betCells = (row) => [
    row.providerCode || "—",
    fmt(row.bet, decimal),
    fmt(row.validBet, decimal),
    fmt(row.win, decimal),
    <span key="pl" style={{ color: plColor(row.net) }}>{fmt(row.net, decimal)}</span>,
    (lang === "bn" && row.gameNameBn) || row.gameName || "—",
    row.count,
  ];

  /** যে রেকর্ডই হোক — সারি, মোট আর লোড হচ্ছে কিনা এক রূপে */
  const table = isBet
    ? {
        loading: bet.loading,
        rows: bet.rows.map((row) => ({ key: row.gameUId, cells: betCells(row) })),
        totals: [
          t.member.desk.total,
          fmt(bet.totals.bet, decimal),
          fmt(bet.totals.validBet, decimal),
          fmt(bet.totals.win, decimal),
          <span key="pl" style={{ color: plColor(bet.totals.net) }}>{fmt(bet.totals.net, decimal)}</span>,
          "",
          bet.totals.count,
        ],
      }
    : isAcc && gameTab === 0
      ? {
          loading: acc.loading,
          rows: acc.rows.map((row) => ({
            key: row.orderNo,
            cells: [
              typeLabel(row.type),
              fmtTime(row.createdAt),
              <span key="a" style={{ color: plColor(row.amount) }}>{signed(row.amount, decimal)}</span>,
              fmt(row.balanceAfter, decimal),
              row.orderNo,
              row.note || "—",
            ],
          })),
          totals: [t.member.desk.total, "", <span key="t" style={{ color: plColor(acc.totals.amount) }}>{signed(acc.totals.amount, decimal)}</span>, "", "", ""],
        }
      : isAcc && gameTab === 1
        ? {
            loading: requests.loading,
            rows: reqRows.map((r) => ({
              key: r._id,
              cells: [
                shortId(r),
                nameOf(r.display?.methodName) || r.methodId,
                fmt(r.amount, decimal),
                r.status === "approved" ? fmt(r.calc?.creditedAmount ?? r.amount, decimal) : "—",
                fmt(r.calc?.totalBonus, decimal),
                fmt(0, decimal),
                fmtTime(r.createdAt),
                r.approvedAt ? fmtTime(r.approvedAt) : "—",
                statusText(r.status),
                r.adminNote || "—",
              ],
            })),
            totals: [
              t.member.desk.total,
              "",
              fmt(reqRows.reduce((sum, r) => sum + Number(r.amount || 0), 0), decimal),
              fmt(reqRows.filter((r) => r.status === "approved").reduce((sum, r) => sum + Number(r.calc?.creditedAmount ?? r.amount ?? 0), 0), decimal),
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          }
        : isAcc
          ? {
              loading: requests.loading,
              rows: reqRows.map((r) => ({
                key: r._id,
                cells: [
                  shortId(r),
                  dr.eWallet,
                  fmt(r.amount, decimal),
                  `${nameOf(r.walletSnapshot?.methodName) || r.methodId} ${r.walletSnapshot?.walletNumber ? `· ${maskNumber(r.walletSnapshot.walletNumber)}` : ""}`,
                  fmtTime(r.createdAt),
                  statusText(r.status),
                  r.adminNote || "—",
                ],
              })),
              totals: [t.member.desk.total, "", fmt(reqRows.reduce((sum, r) => sum + Number(r.amount || 0), 0), decimal), "", "", "", ""],
            }
      : isPL
        ? {
            loading: pl.loading,
            rows: pl.rows.map((row) => ({
              key: row.date,
              cells: [
                row.date,
                fmt(row.deposit, decimal),
                fmt(row.withdraw, decimal),
                fmt(row.bet, decimal),
                fmt(row.win, decimal),
                fmt(row.rebate, decimal),
                fmt(row.promotion, decimal),
                <span key="p" style={{ color: plColor(row.profit) }}>{fmt(row.profit, decimal)}</span>,
              ],
            })),
            totals: [
              t.member.desk.total,
              fmt(pl.totals.deposit, decimal),
              fmt(pl.totals.withdraw, decimal),
              fmt(pl.totals.bet, decimal),
              fmt(pl.totals.win, decimal),
              fmt(pl.totals.rebate, decimal),
              fmt(pl.totals.promotion, decimal),
              <span key="p" style={{ color: plColor(pl.totals.profit) }}>{fmt(pl.totals.profit, decimal)}</span>,
            ],
          }
        : null;

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
            onClick={() => {
              setGameTab(index);
              setStatus("all");
              setMethod("all");
            }}
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
          {from} 00:00:00~{to} 23:59
        </span>

        {isAccTab && gameTab === 0 && (
          <FilterSelect label={dr.orderType} value={accType} onChange={setAccType} options={dr.typeKeys.map((k) => [k, dr.types[k]])} />
        )}
        {isAccTab && gameTab > 0 && (
          <FilterSelect label={dr.statusLabel} value={status} onChange={setStatus} options={["all", "pending", "approved", "rejected"].map((k) => [k, k === "all" ? t.promo.all : dr.status[k]])} />
        )}
        {isAccTab && gameTab === 1 && (
          <FilterSelect label={dr.methodLabel} value={method} onChange={setMethod} options={[["all", t.promo.all], ...methodOptions.map((k) => [k, k.toUpperCase()])]} />
        )}

        {config.vendorSelect && !isAccTab && (
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

      {/* সারিগুলো, নয়তো খালি অবস্থা */}
      {table && table.rows.length > 0 ? (
        <div className="flex-1 overflow-y-auto" style={{ background: "#fff" }}>
          {table.rows.map((row) => (
            <div
              key={row.key}
              className="flex items-center"
              style={{ height: 40, padding: "0 20px", borderBottom: "1px solid #f0f0f0", fontSize: 12, color: "#333" }}
            >
              {row.cells.map((cell, index) => (
                <span key={index} className="truncate" style={{ flex: 1, textAlign: "center", padding: "0 4px" }}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex flex-1 items-center justify-center"
          style={{ color: "#999", fontSize: 13, background: "#f5f5f5" }}
        >
          {table?.loading ? t.auth.wait : t.member.desk.noMatch}
        </div>
      )}

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
        {(table
          ? table.totals
          : columns.map((_, index) => (index === 0 ? t.member.desk.total : (config.zero ?? "0.00")))
        ).map((cell, index) => (
          <span key={`total-${index}`} style={{ flex: 1, textAlign: "center" }}>
            {cell}
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

const BLUE = "#1e9bf0";

/**
 * নীল রেখার বোতামের চেহারায় আসল `<select>` — মূল সাইটের "সব" / "প্রকার"
 * বোতাম চাপলে তালিকা খোলে; এখানে ব্রাউজারের নিজের তালিকা।
 */
const SelectChip = ({ value, onChange, options, children, filled = false, gray = false, style }) => (
  <span
    className="relative flex shrink-0 items-center"
    style={{
      height: m(62),
      padding: `0 ${m(26)}`,
      borderRadius: m(8),
      border: gray ? "none" : `1px solid ${BLUE}`,
      background: filled ? BLUE : gray ? "#e2e2e6" : "#fff",
      color: filled ? "#fff" : gray ? "#555" : BLUE,
      fontSize: m(28),
      gap: m(10),
      ...style,
    }}
  >
    {children}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 cursor-pointer opacity-0"
      aria-label={typeof children === "string" ? children : undefined}
    >
      {options.map(([key, text]) => (
        <option key={key} value={key}>
          {text}
        </option>
      ))}
    </select>
  </span>
);

const Chevron = () => (
  <svg viewBox="0 0 12 8" style={{ width: m(22), height: m(14) }} aria-hidden="true">
    <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const Mobile = ({ tab, titleKey, withGameTabs = false, withDays7 = false, pageTitle }) => {
  const { t, lang } = useLanguage();
  const [range, setRange] = useState("today");
  const [gameTab, setGameTab] = useState(GAME_TABS[0]);

  const isBet = tab === "betRecord";
  const bet = useBetRecords({ range, tab: gameTab, enabled: isBet });

  // মোবাইলে জমা/উত্তোলন রেকর্ড আলাদা পাতা — আবেদনের তালিকা, অবস্থাসহ
  const requestKind = titleKey === "depositRecord" ? "deposit" : titleKey === "withdrawRecord" ? "withdraw" : "";
  const isAcc = tab === "accountRecord" && !requestKind;
  const isPL = tab === "profitLoss";
  const [accType, setAccType] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [vendor, setVendor] = useState("all");
  const acc = useAccountRecords({ range, type: accType, enabled: isAcc });
  const rawRequests = useRequestRecords({ kind: requestKind, range, enabled: Boolean(requestKind) });
  const requests = {
    ...rawRequests,
    rows: rawRequests.rows.filter(
      (r) => (status === "all" || r.status === status) && (method === "all" || r.methodId?.toLowerCase() === method),
    ),
  };
  const methodOptions = [...new Set(rawRequests.rows.map((r) => r.methodId?.toLowerCase()).filter(Boolean))];
  const betRows = vendor === "all" ? bet.rows : bet.rows.filter((row) => row.providerCode === vendor);
  const vendorOptions = [...new Set(bet.rows.map((row) => row.providerCode).filter(Boolean))];
  const dr = t.deskRec;
  const pl = useProfitLoss({ range, enabled: isPL });

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

  const span = rangeOf(range);

  return (
    <MemberShell
      title={pageTitle ? t.memberPage.pages[pageTitle].title : t.memberPage.items[titleKey]}
      tabs={tabs}
      onTab={setGameTab}
    >
      {/* ফিল্টার — মূল সাইটের প্রতিটা পাতার নিজের চেহারা */}
      {requestKind ? (
        <>
          {/* আজ / গতকাল / 7 দিন — নীল দাগের ট্যাব */}
          <div className="flex" style={{ background: "#fff", height: m(96), borderBottom: "1px solid #eee" }}>
            {["today", "yesterday", "days7"].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className="relative flex-1 cursor-pointer"
                style={{ color: range === key ? BLUE : "#333", fontSize: m(30) }}
              >
                {key === "days7" ? t.memberPage.pages.days7 : t.member.ranges[key]}
                {range === key && <span className="absolute bottom-0 left-0" style={{ width: "100%", height: m(5), background: BLUE }} />}
              </button>
            ))}
          </div>
          <div className="flex items-center" style={{ background: "#f0f0f2", padding: `${m(20)} ${m(32)}`, gap: m(40) }}>
            <SelectChip value={status} onChange={setStatus} options={["all", "pending", "approved", "rejected"].map((k) => [k, k === "all" ? dr.types.all : dr.status[k]])}>
              {status === "all" ? dr.types.all : dr.status[status]}
            </SelectChip>
            {requestKind === "deposit" && (
              <SelectChip value={method} onChange={setMethod} options={[["all", dr.types.all], ...methodOptions.map((k) => [k, k.toUpperCase()])]}>
                {method === "all" ? t.memberPage.pages.recordType : method.toUpperCase()}
              </SelectChip>
            )}
            <span className="flex shrink-0 items-center" style={{ height: m(62), padding: `0 ${m(26)}`, borderRadius: m(8), border: `1px solid ${BLUE}`, background: "#fff", color: BLUE, fontSize: m(28), gap: m(12), marginLeft: requestKind === "deposit" ? "auto" : 0 }}>
              <Icon name="discount-calender" size={m(34)} />
              {shortDate(span.from)}- {shortDate(span.to)}
            </span>
          </div>
        </>
      ) : isAcc ? (
        <div className="flex items-center" style={{ background: "#f0f0f2", padding: `${m(14)} ${m(24)}`, gap: m(16) }}>
          <SelectChip gray value={accType} onChange={setAccType} options={dr.typeKeys.map((k) => [k, dr.types[k]])}>
            {dr.types[accType]}
            <Chevron />
          </SelectChip>
          <SelectChip filled value={range} onChange={setRange} options={keys.map((k) => [k, k === "days7" ? t.memberPage.pages.days7 : t.member.ranges[k]])}>
            <Icon name="achievement-done" size={m(32)} />
            {ranges.find((r) => r.key === range)?.label}
          </SelectChip>
          <span className="flex shrink-0 items-center" style={{ height: m(62), padding: `0 ${m(20)}`, borderRadius: m(8), background: "#e2e2e6", color: "#555", fontSize: m(28), gap: m(12) }}>
            <Icon name="discount-calender" size={m(34)} />
            {shortDate(span.from)}- {shortDate(span.to)}
          </span>
        </div>
      ) : isBet ? (
        <div className="flex items-center" style={{ background: "#fff", padding: `${m(16)} ${m(20)}`, gap: m(16), borderBottom: "1px solid #eee" }}>
          <SelectChip value={range} onChange={setRange} options={keys.map((k) => [k, k === "days7" ? t.memberPage.pages.days7 : t.member.ranges[k]])} style={{ padding: `0 ${m(18)}` }}>
            <Icon name="discount-calender" size={m(34)} />
            {shortDate(span.from)} 00:00:00- {shortDate(span.to)} 23:59:59
          </SelectChip>
          <SelectChip value={vendor} onChange={setVendor} options={[["all", dr.types.all], ...vendorOptions.map((k) => [k, k])]} style={{ padding: `0 ${m(18)}` }}>
            <Chevron />
            {vendor === "all" ? dr.types.all : vendor}
          </SelectChip>
        </div>
      ) : (
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
          {shortDate(span.from)}- {shortDate(span.to)}
        </span>
      </div>
      )}

      {!isBet ? (
        <MobileRows kind={requestKind || (isPL ? "pl" : isAcc ? "acc" : "")} acc={acc} requests={requests} pl={pl} />
      ) : betRows.length > 0 ? (
        <div style={{ padding: `${m(20)} ${m(24)} ${m(200)}`, background: "#f5f5f9" }}>
          {betRows.map((row) => (
            <div
              key={row.gameUId}
              style={{ background: "#fff", borderRadius: m(16), padding: m(24), marginBottom: m(16), fontSize: m(26), color: "#333" }}
            >
              <div className="flex items-center" style={{ gap: m(12), marginBottom: m(14) }}>
                <span className="min-w-0 flex-1 truncate" style={{ fontSize: m(30), fontWeight: 700 }}>
                  {(lang === "bn" && row.gameNameBn) || row.gameName || "—"}
                </span>
                <span style={{ color: "#1e9bf0", fontSize: m(24) }}>{row.providerCode}</span>
              </div>
              {[
                [t.member.desk.betRecord.columns[1], fmt(row.bet)],
                [t.member.desk.betRecord.columns[2], fmt(row.validBet)],
                [t.member.desk.betRecord.columns[3], fmt(row.win)],
                [t.member.desk.betRecord.columns[4], <span key="pl" style={{ color: plColor(row.net) }}>{fmt(row.net)}</span>],
                [t.member.desk.betRecord.columns[6], row.count],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between" style={{ padding: `${m(6)} 0`, color: "#666" }}>
                  <span>{label}</span>
                  <span style={{ color: "#333", fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* বেটিং রেকর্ডের নিচের ধূসর সারাংশ — মূল সাইটের মতো সবুজ সংখ্যা */}
      {isBet && (
        <div className="fixed bottom-0 left-0 grid w-full grid-cols-2" style={{ background: "#e8e8ea", padding: `${m(16)} ${m(60)}`, rowGap: m(4), zIndex: 5 }}>
          {[
            [t.member.desk.betRecord.columns[1], betRows.reduce((sum, r) => sum + Number(r.bet || 0), 0)],
            [t.member.desk.betRecord.columns[2], betRows.reduce((sum, r) => sum + Number(r.validBet || 0), 0)],
            [t.memberPage.pages.win, betRows.reduce((sum, r) => sum + Number(r.win || 0), 0)],
            [t.memberPage.pages.profitLoss, betRows.reduce((sum, r) => sum + Number(r.net || 0), 0)],
          ].map(([label, value]) => (
            <div key={label} style={{ fontSize: m(26), color: "#333", lineHeight: 1.25 }}>
              {label}
              <div style={{ color: "#6cc31b" }}>{fmt(value)}</div>
            </div>
          ))}
        </div>
      )}

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

/** মোবাইলের অ্যাকাউন্ট রেকর্ড / জমা-উত্তোলন রেকর্ড / লাভ-ক্ষতির কার্ড */
const MobileRows = ({ kind, acc, requests, pl }) => {
  const { t } = useLanguage();
  const r = t.records;

  const card = (key, head, lines, right) => (
    <div key={key} style={{ background: "#fff", borderRadius: m(16), padding: m(24), marginBottom: m(16), fontSize: m(26), color: "#333" }}>
      <div className="flex items-center" style={{ gap: m(12), marginBottom: m(10) }}>
        <span className="min-w-0 flex-1 truncate" style={{ fontSize: m(30), fontWeight: 700 }}>{head}</span>
        {right}
      </div>
      {lines.map(([label, value]) => (
        <div key={label} className="flex justify-between" style={{ padding: `${m(6)} 0`, color: "#666" }}>
          <span>{label}</span>
          <span style={{ color: "#333", fontWeight: 600, textAlign: "right" }}>{value}</span>
        </div>
      ))}
    </div>
  );

  const badge = (status) => {
    const color = status === "approved" ? "#16a34a" : status === "rejected" ? "#e8474c" : "#f59e0b";
    return (
      <span style={{ fontSize: m(22), color, border: `1px solid ${color}`, borderRadius: m(20), padding: `${m(4)} ${m(14)}` }}>
        {r.status[status] || status}
      </span>
    );
  };

  let list = [];
  let loading = false;

  if (kind === "acc") {
    loading = acc.loading;
    list = acc.rows.map((row) =>
      card(
        row.orderNo,
        r.types[row.type] || row.type,
        [
          [t.member.desk.accountRecord.columns[0], row.orderNo],
          [t.member.desk.accountRecord.columns[1], fmtTime(row.createdAt)],
          [r.balanceAfter, fmt(row.balanceAfter)],
          ...(row.note ? [[t.member.desk.accountRecord.columns[4], row.note]] : []),
        ],
        <span style={{ fontSize: m(30), fontWeight: 700, color: plColor(row.amount) }}>{signed(row.amount)}</span>,
      ),
    );
  } else if (kind === "deposit" || kind === "withdraw") {
    loading = requests.loading;
    list = requests.rows.map((row) =>
      card(
        row._id,
        `৳ ${fmt(row.amount)}`,
        [
          [t.member.desk.accountRecord.columns[1], fmtTime(row.createdAt)],
          ...(kind === "deposit"
            ? [
                [t.depositFlow.method, row.display?.methodName?.bn || row.methodId],
                ...(row.calc?.totalBonus > 0 ? [[r.bonus, `+৳ ${fmt(row.calc.totalBonus)}`]] : []),
                ...(row.fields?.trxId ? [["TrxID", row.fields.trxId]] : []),
              ]
            : [[t.depositFlow.method, `${row.walletSnapshot?.methodName?.bn || row.methodId} · 0${row.walletSnapshot?.walletNumber || ""}`]]),
          ...(row.status === "rejected" && row.adminNote ? [[r.reason, row.adminNote]] : []),
        ],
        badge(row.status),
      ),
    );
  } else if (kind === "pl") {
    loading = pl.loading;
    const cols = t.member.desk.profitLoss.columns;
    const rows = pl.rows.length ? [{ ...pl.totals, date: t.member.desk.total }, ...pl.rows] : [];
    list = rows.map((row) =>
      card(
        row.date,
        row.date,
        [
          [cols[1], fmt(row.deposit)],
          [cols[2], fmt(row.withdraw)],
          [cols[3], fmt(row.bet)],
          [cols[4], fmt(row.win)],
          [cols[5], fmt(row.rebate)],
          [cols[6], fmt(row.promotion)],
        ],
        <span style={{ fontSize: m(30), fontWeight: 700, color: plColor(row.profit) }}>{fmt(row.profit)}</span>,
      ),
    );
  }

  if (!list.length) {
    return loading ? <div style={{ padding: m(60), textAlign: "center", color: "#999", fontSize: m(26) }}>{t.auth.wait}</div> : <EmptyState />;
  }
  return <div style={{ padding: `${m(20)} ${m(24)} ${m(30)}`, background: "#f5f5f9" }}>{list}</div>;
};

const RecordSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default RecordSection;
