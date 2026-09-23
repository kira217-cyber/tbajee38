import React, { useState } from "react";
import Icon from "../Icon/Icon";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell from "./MemberShell";

/**
 * ডিপোজিট ও উত্তোলন — একই ফিচার, দুই লেআউট।
 *
 * ── ডেস্কটপ (মডালের ডান পাশ, px তে মাপা) ──
 *   বাঁয়ে পেমেন্ট মেথডের তালিকা ২৫৫ চওড়া (আইটেম ২০৫ × ৬৮),
 *   ডানে ফর্ম ৮৫৫ — শিরোনাম ৪৭, বডি ৫২৫, নিচে ৪৮ এর বোতাম সারি
 *
 * ── মোবাইল (`/m/voucherCenter`, `/m/withdraw`, ৭৫০-ডিজাইনে মাপা) ──
 *   হেডার ৭৫০ × ১০০ bg #180836, ডানে রেকর্ডের আইকন ৪৪
 *   **ডিপোজিট**: সাদা পাতা, padding `0 20 120`
 *     প্রতিটা খণ্ডের শিরোনাম ৭১০ × ৭০, fs ২৬ fw ৭০০ #333, বাঁয়ে ছোট বিন্দু
 *     মোড: ৪টা ঘর ১৭১.৫ × ১৮৩.৮ radius ১০, border 1px
 *       (সক্রিয় #EC2529, নইলে #E4E4E4); ভিতরে ছবি ৬৪ contain,
 *       নাম fs ২০ fw ৭০০
 *     সতর্কবাণী fs ২৮ রঙ #EC2529
 *     চ্যানেল: ঘর ২২৬.৭ × ১১৪ radius ১০, লেখা fs ২৪ fw ৭০০ মাঝে
 *     পরিমাণ: ঘর ১৩২ × ৭১ radius ১২, border `1px rgba(236,37,41,.2)`,
 *       fs ২৪ fw ৭০০ রঙ #565656; নিচে ইনপুট ৭১০ × ৭০ (বাঁয়ে ৳)
 *     নিচে ফিক্সড বোতাম বার ৭৫০ × ১১০, নিষ্ক্রিয় bg #CDCDCD, fs ৩২
 *   **উত্তোলন**: উপরে ট্যাব ৭৫০ × ৮৭ (আইকন ৬০ + "E wallet", নিচে লাল রেখা)
 *     `আবদ্ধ E wallet (0/2)` fs ৩২ #595959
 *     খালি কার্ডের ছবি ৬১০ × ৩৪০, তার উপরে লাল + বোতাম ৯১.৬
 *     তথ্যের সারি fs ২৪, রিফ্রেশ পিল ৪৬৫.৬ × ৭০ radius ২৬ bg #D7E7FE
 *     পরিমাণ ও পাসওয়ার্ডের ঘর ৬৬০ × ১০৫ radius ১০ border 1px #CCC
 *     শেষে জমা বোতাম ৬৬০ × ১০৫
 */

/* server আসার আগ পর্যন্ত মূল সাইটের তালিকাই স্ট্যাটিক — দুই লেআউটেই এক */
const METHODS = [
  { code: "NAGAD", label: "NAGAD" },
  { code: "BKASHSM", label: "Send Money Bkash" },
  { code: "BKASH", label: "Bkash" },
  { code: "NAGADSM", label: "Send Money Nagad" },
];

const CHANNELS = ["চ্যানেল ২ 10", "চ্যানেল ২ 6", "চ্যানেল ২ 18", "চ্যানেল ২ 4", "চ্যানেল ২ 9"];
const AMOUNTS = [100, 300, 500, 1000, 2000, 5000, 8000, 10000, 20000, 30000];
const RED = "#ec2529";

/** মোবাইলের খণ্ডের শিরোনাম — বাঁয়ে রঙিন বিন্দু */
const SectionTitle = ({ dot, children }) => (
  <div className="flex items-center" style={{ height: m(70), gap: m(14) }}>
    <span
      style={{ width: m(12), height: m(12), borderRadius: "50%", background: dot }}
    />
    <span style={{ fontSize: m(26), fontWeight: 700, color: "#333" }}>{children}</span>
  </div>
);

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
const Desktop = ({ mode }) => {
  const { t } = useLanguage();
  const [method, setMethod] = useState(METHODS[0].code);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [amount, setAmount] = useState(null);
  const isDeposit = mode === "deposit";

  return (
    <div className="flex" style={{ width: 1110, height: 620 }}>
      {/* পেমেন্ট মেথডের তালিকা */}
      <div
        className="hide-scrollbar"
        style={{ width: 255, height: 620, background: "#f7f7f7", padding: "22px 25px", overflowY: "auto" }}
      >
        {METHODS.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => setMethod(item.code)}
            className="flex w-full cursor-pointer items-center"
            style={{
              width: 205,
              height: 68,
              borderRadius: 6,
              background: "#fff",
              border: `1px solid ${item.code === method ? "#ff2f34" : "transparent"}`,
              marginBottom: 15,
              padding: "0 14px",
              gap: 12,
              color: "#666",
              fontSize: 14,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 6,
                background: "#f2f2f2",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                flexShrink: 0,
              }}
            >
              {item.label.slice(0, 2).toUpperCase()}
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ডানের ফর্ম */}
      <div style={{ width: 855, height: 620, background: "#fff" }}>
        <div className="flex items-center" style={{ height: 47, padding: "0 20px", gap: 10 }}>
          <span style={{ width: 4, height: 16, background: "#3fbf6e", borderRadius: 2 }} />
          <span style={{ fontSize: 15, color: "#333" }}>
            {isDeposit ? t.member.depositInfo : t.member.withdrawInfo}
          </span>
          <span className="flex-1" />
          <span
            className="flex cursor-pointer items-center"
            style={{
              height: 32,
              padding: "0 14px",
              borderRadius: 16,
              border: "1px solid #ff2f34",
              color: "#ff2f34",
              fontSize: 13,
              gap: 6,
            }}
          >
            <Icon name="deposit_record" size={16} />
            {t.member.depositRecord}
          </span>
        </div>

        <div className="hide-scrollbar" style={{ height: 525, padding: "0 20px", overflowY: "auto" }}>
          {isDeposit && (
            <div
              style={{
                border: "1px solid #ffb3b5",
                borderRadius: 4,
                background: "#fff6f6",
                color: "#ff2f34",
                fontSize: 13,
                padding: "10px 14px",
                marginBottom: 18,
              }}
            >
              {t.member.depositWarning}
            </div>
          )}

          <div className="flex flex-wrap" style={{ gap: 12, marginBottom: 22 }}>
            {CHANNELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                className="cursor-pointer"
                style={{
                  height: 40,
                  padding: "0 18px",
                  borderRadius: 4,
                  border: `1px solid ${item === channel ? "#ff2f34" : "#ddd"}`,
                  color: item === channel ? "#ff2f34" : "#666",
                  fontSize: 14,
                  background: "#fff",
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-start" style={{ gap: 14 }}>
            <span style={{ fontSize: 14, color: "#333", lineHeight: "34px", flexShrink: 0 }}>
              {t.member.amountLabel}
            </span>
            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className="cursor-pointer"
                  style={{
                    width: 66,
                    height: 34,
                    borderRadius: 4,
                    border: `1px solid ${value === amount ? "#ff2f34" : "#ddd"}`,
                    color: value === amount ? "#ff2f34" : "#666",
                    fontSize: 13,
                    background: "#fff",
                  }}
                >
                  {value.toLocaleString("en-US")}
                </button>
              ))}
            </div>
          </div>

          <input
            placeholder={t.member.amountPlaceholder}
            style={{
              width: 222,
              height: 34,
              marginTop: 16,
              marginInlineStart: 96,
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "0 10px",
              fontSize: 13,
              color: "#333",
              outline: "none",
              display: "block",
            }}
          />

          <div style={{ marginTop: 10, marginInlineStart: 96, fontSize: 13, color: "#ff2f34" }}>
            {t.member.limit} ৳ 100 - ৳ 30,000
          </div>
        </div>

        <div className="flex items-center" style={{ height: 48, padding: "0 20px" }}>
          <button
            type="button"
            className="tb-hover-fade cursor-pointer"
            style={{
              height: 36,
              padding: "0 20px",
              borderRadius: 18,
              background: "#ff2f34",
              color: "#fff",
              fontSize: 14,
            }}
          >
            {isDeposit ? t.member.submitDeposit : t.member.submitWithdraw}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল: ডিপোজিট ─────────────────── */
const MobileDeposit = () => {
  const { t } = useLanguage();
  const money = t.money;
  const [method, setMethod] = useState(METHODS[0].code);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [amount, setAmount] = useState("");

  return (
    <MemberShell title={money.depositTitle} headerIcon="deprecm3">
      <div style={{ padding: `0 ${m(20)} ${m(140)}`, background: "#fff" }}>
        {/* আমানতের মোড */}
        <SectionTitle dot="#f5a623">{money.modeTitle}</SectionTitle>
        <div className="flex" style={{ gap: m(5.9) }}>
          {METHODS.map((item) => {
            const active = item.code === method;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setMethod(item.code)}
                className="relative flex flex-1 cursor-pointer flex-col items-center"
                style={{
                  height: m(183.8),
                  padding: m(15),
                  borderRadius: m(10),
                  border: `${m(2)} solid ${active ? RED : "#e4e4e4"}`,
                  background: "#fff",
                }}
              >
                <span
                  className="grid w-full place-items-center"
                  style={{ height: m(70), borderRadius: m(10) }}
                >
                  <img
                    src={`/assets/mobile/bank/${item.code}.png`}
                    alt=""
                    style={{ width: m(64), height: m(64), objectFit: "contain" }}
                  />
                </span>
                <span
                  className="text-center"
                  style={{
                    marginTop: m(24),
                    fontSize: m(20),
                    fontWeight: 700,
                    color: active ? RED : "#333",
                    lineHeight: 1.15,
                  }}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    className="absolute grid place-items-center"
                    style={{
                      right: 0,
                      bottom: 0,
                      width: m(32),
                      height: m(32),
                      color: RED,
                    }}
                  >
                    <Icon name="achievement-done" size={m(28)} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: m(20),
            fontSize: m(28),
            color: RED,
            lineHeight: 1.5,
          }}
        >
          {money.trxWarning}
        </div>

        {/* পেমেন্ট চ্যানেল */}
        <SectionTitle dot="#2ec5b6">{money.channelTitle}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: m(10),
          }}
        >
          {CHANNELS.map((item) => {
            const active = item === channel;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                className="cursor-pointer"
                style={{
                  height: m(114),
                  borderRadius: m(10),
                  border: `${m(2)} solid ${active ? RED : "#e4e4e4"}`,
                  color: active ? RED : "#000",
                  fontSize: m(24),
                  fontWeight: 700,
                  background: "#fff",
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* জমা পরিমাণ */}
        <SectionTitle dot="#8e6fd8">{money.amountTitle}</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: m(12),
          }}
        >
          {AMOUNTS.map((value) => {
            const active = String(value) === amount;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(String(value))}
                className="cursor-pointer"
                style={{
                  height: m(71),
                  borderRadius: m(12),
                  border: `${m(2)} solid ${active ? RED : "rgb(236 37 41 / 0.2)"}`,
                  background: "#fff",
                  color: active ? RED : "#565656",
                  fontSize: m(24),
                  fontWeight: 700,
                }}
              >
                {value.toLocaleString("en-US")}
              </button>
            );
          })}
        </div>

        <div
          className="flex items-center"
          style={{
            marginTop: m(20),
            height: m(70),
            borderRadius: m(12),
            border: `${m(2)} solid #e4e4e4`,
          }}
        >
          <span
            style={{
              padding: `0 ${m(20)}`,
              fontSize: m(26),
              fontWeight: 700,
              color: "#1c1c1c",
            }}
          >
            ৳
          </span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="100 - 30,000"
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: m(28),
              color: "#333",
            }}
          />
        </div>
      </div>

      {/* নিচের ফিক্সড বোতাম বার */}
      <div
        className="fixed right-0 bottom-0 left-0 grid place-items-center"
        style={{
          height: m(110),
          background: amount ? RED : "#cdcdcd",
          color: "#fff",
          fontSize: m(32),
          zIndex: 5,
        }}
      >
        {money.next}
      </div>
    </MemberShell>
  );
};

/* ─────────────────── মোবাইল: উত্তোলন ─────────────────── */
const MobileWithdraw = () => {
  const { t } = useLanguage();
  const money = t.money;
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  const info = [
    { key: "time", text: money.withdrawTime, dim: true },
    { key: "times", text: money.dailyTimes, dim: true },
    { key: "main", text: `${money.mainWallet} : ৳ 0.00` },
    { key: "available", text: `${money.available} : ৳ 0.00` },
  ];

  return (
    <MemberShell title={money.withdrawTitle} headerIcon="withrec3">
      {/* E wallet ট্যাব */}
      <div
        className="flex items-center justify-center"
        style={{ height: m(87), background: "#fff", borderBottom: `${m(4)} solid ${RED}`, gap: m(20) }}
      >
        <span
          className="grid place-items-center"
          style={{ width: m(60), height: m(60), borderRadius: "50%", background: "#ff2d9b" }}
        >
          <Icon name="cashback" size={m(36)} />
        </span>
        <span style={{ fontSize: m(30), color: RED }}>{money.wallet}</span>
      </div>

      <div style={{ background: "#fff", padding: `${m(35)} ${m(40)} ${m(60)}` }}>
        <div style={{ fontSize: m(32), color: "#595959" }}>{money.bound} (0/2)</div>

        {/* খালি ই-ওয়ালেট */}
        <div className="relative" style={{ marginTop: m(40) }}>
          <div
            className="grid place-items-center"
            style={{
              height: m(340),
              borderRadius: m(10),
              background: "#fafafa",
              color: "#a9a9a9",
              fontSize: m(30),
            }}
          >
            {money.emptyWallet}
          </div>
          <button
            type="button"
            aria-label="add-wallet"
            className="absolute grid cursor-pointer place-items-center"
            style={{
              right: m(20),
              bottom: m(-45),
              width: m(91.6),
              height: m(91.6),
              borderRadius: "50%",
              border: `${m(4)} solid #fff`,
              background: "#fe0000",
              color: "#fff",
              fontSize: m(50),
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>

        {/* তথ্যের সারি */}
        <div style={{ marginTop: m(70) }}>
          {info.map((row) => (
            <div
              key={row.key}
              style={{
                fontSize: m(24),
                color: row.dim ? "#bababa" : "#333",
                lineHeight: m(34),
              }}
            >
              {row.text}
            </div>
          ))}
        </div>

        <div className="flex justify-center" style={{ marginTop: m(20) }}>
          <span
            className="flex items-center"
            style={{
              height: m(70),
              padding: `0 ${m(24)}`,
              borderRadius: m(26),
              background: "#d7e7fe",
              color: "#3b79f3",
              fontSize: m(28),
              gap: m(16),
            }}
          >
            <Icon name="refresh" size={m(50)} />
            {money.refreshBalance}
          </span>
        </div>

        {/* পরিমাণ ও পাসওয়ার্ড */}
        <div style={{ marginTop: m(40), fontSize: m(26), color: "#333" }}>
          {money.withdrawAmount}
        </div>

        {[
          { key: "amount", label: money.amount, value: amount, set: setAmount, ph: "100 ~ 25,000" },
          {
            key: "password",
            label: money.txPassword,
            value: password,
            set: setPassword,
            ph: money.txPassword,
            secret: true,
          },
        ].map((field) => (
          <div
            key={field.key}
            className="flex items-center"
            style={{
              marginTop: m(30),
              height: m(105),
              borderRadius: m(10),
              border: `${m(2)} solid #ccc`,
              padding: `0 ${m(20)}`,
            }}
          >
            <span
              style={{ width: m(230), fontSize: m(29), color: "#0a0a0a", lineHeight: 1.15 }}
            >
              {field.label}
            </span>
            <input
              value={field.value}
              onChange={(event) => field.set(event.target.value)}
              placeholder={field.ph}
              type={field.secret ? "password" : "text"}
              style={{
                flex: 1,
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: m(30),
                color: "#333",
              }}
            />
          </div>
        ))}

        <button
          type="button"
          className="w-full cursor-pointer"
          style={{
            marginTop: m(50),
            height: m(105),
            borderRadius: m(10),
            background: amount && password ? RED : "#dcdcdc",
            color: "#fff",
            fontSize: m(32),
          }}
        >
          {money.submit}
        </button>
      </div>
    </MemberShell>
  );
};

const MoneySection = ({ mode = "deposit" }) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) return <Desktop mode={mode} />;
  return mode === "deposit" ? <MobileDeposit /> : <MobileWithdraw />;
};

export default MoneySection;
