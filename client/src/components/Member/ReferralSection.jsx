import React, { useState } from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { selectUser } from "../../features/auth/authSelectors";
import MemberShell, { EmptyState } from "./MemberShell";
import { useSelector } from "react-redux";

/**
 * "বন্ধুদের আমন্ত্রণ জানান" — ডেস্কটপে মডালের ট্যাব,
 * মোবাইলে `/member/referral`।
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
/**
 * ডেস্কটপ মডালের "বন্ধুদের আমন্ত্রণ করুন" ট্যাব।
 *
 * মূল সাইট থেকে মাপা — দুই কলাম:
 *   বাঁয়ে (~৬২০): কালচে-বেগুনি কমিশন ব্যানার (স্লট মেশিনের ছবি, লোগো,
 *     ৳ ৭,৫০০.০০), নিচে গোলাপি-নীল কার্ডে "যারা পুরস্কার পেয়েছেন" —
 *     তিনটে সারি (মাস্ক করা আইডি, "প্রাপ্ত", টাকা), তারপর
 *     "এখন পর্যন্ত প্রাপ্ত পুরস্কার" — চারটে কার্ড
 *   ডানে (~৪৩০): ২×২ পরিসংখ্যান টাইল, "এজেন্ট ৪ সুপার কমিশন" লিংক,
 *     আর শেয়ার বাক্স — QR + রেফারেল লিংক + সাতটা সোশ্যাল বোতাম
 */
const WINNERS = [
  { id: "01*******৬", amount: "৳ 309.00" },
  { id: "01*******7", amount: "৳ 309.00" },
  { id: "fo*******0", amount: "৳ 309.00" },
];

const REWARDS = [
  { key: "invite", icon: "⭐", amount: "412,499,196.00", claimed: "363912" },
  { key: "achieve", icon: "🎖", amount: "245,762,916.00", claimed: "172956" },
  { key: "deposit", icon: "💰", amount: "485,926,326.45", claimed: "562476" },
  { key: "bet", icon: "💵", amount: "830,573,555.33", claimed: "937848" },
];

const SOCIALS = [
  { key: "facebook", bg: "#1877f2", label: "f" },
  { key: "x", bg: "#000", label: "𝕏" },
  { key: "telegram", bg: "#29a9eb", label: "✈" },
  { key: "whatsapp", bg: "#25d366", label: "✆" },
  { key: "sms", bg: "#4caf50", label: "✉" },
  { key: "line", bg: "#06c755", label: "L" },
  { key: "threads", bg: "#000", label: "@" },
];

const TILES = [
  { key: "today", bg: "linear-gradient(135deg,#7dd3fc,#38bdf8)", money: true },
  { key: "yesterday", bg: "linear-gradient(135deg,#c4b5fd,#a78bfa)", money: true },
  { key: "members", bg: "linear-gradient(135deg,#a5b4fc,#818cf8)" },
  { key: "qualified", bg: "linear-gradient(135deg,#7dd3fc,#38bdf8)" },
];

const Desktop = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.member.desk.referral;
  const [tab, setTab] = useState(0);

  const link = `https://tbajee.vip/?referralCode=${user?.username ?? ""}`;

  return (
    <div
      className="flex flex-col"
      style={{ width: 1110, height: 620, background: "#fff" }}
    >
      {/* ট্যাব */}
      <div
        className="flex items-center"
        style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}
      >
        {page.tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(index)}
            className="relative h-full cursor-pointer"
            style={{
              padding: "0 18px",
              fontSize: 14,
              color: index === tab ? "#e8474c" : "#666",
            }}
          >
            {label}
            {index === tab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: "70%", height: 2, background: "#e8474c" }}
              />
            )}
          </button>
        ))}
      </div>

      {tab !== 0 ? (
        <div
          className="flex flex-1 items-center justify-center"
          style={{ color: "#999", fontSize: 13 }}
        >
          {t.member.desk.noMatch}
        </div>
      ) : (
        <div
          className="hide-scrollbar flex"
          style={{ flex: 1, overflowY: "auto", padding: 18, gap: 18 }}
        >
          {/* বাঁ কলাম */}
          <div style={{ width: 618 }}>
            <div
              className="flex items-center"
              style={{
                height: 148,
                borderRadius: 10,
                background: "linear-gradient(90deg,#2a1050,#4c1d95)",
                padding: "0 26px",
                gap: 22,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>
                {page.commission}
              </span>
              <img
                src="/assets/mobile/logo.png"
                alt=""
                style={{ width: 74, height: 74, objectFit: "contain", borderRadius: 12 }}
              />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>
                  ৳ 7,500.00
                </div>
                <div style={{ fontSize: 12, color: "#e9d5ff", marginTop: 6 }}>
                  {page.commission}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                borderRadius: 10,
                background: "linear-gradient(135deg,#f3e8ff,#dbeafe)",
                padding: 18,
              }}
            >
              <div style={{ fontSize: 15, color: "#333", marginBottom: 12 }}>
                {page.winnersTitle}
              </div>
              {WINNERS.map((winner) => (
                <div
                  key={winner.id}
                  className="flex items-center"
                  style={{
                    height: 34,
                    borderRadius: 17,
                    background: "rgb(255 255 255 / 0.75)",
                    padding: "0 18px",
                    marginBottom: 8,
                    fontSize: 13,
                    color: "#444",
                  }}
                >
                  <span style={{ flex: 1, textAlign: "center" }}>{winner.id}</span>
                  <span style={{ flex: 1, textAlign: "center" }}>{page.received}</span>
                  <span style={{ flex: 1, textAlign: "center" }}>{winner.amount}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, fontSize: 15, color: "#333" }}>
              {page.rewardTitle}
            </div>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
              }}
            >
              {REWARDS.map((reward) => (
                <div
                  key={reward.key}
                  className="flex items-center"
                  style={{
                    background: "#f6f7fb",
                    borderRadius: 8,
                    padding: 10,
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 26 }}>{reward.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#666" }}>
                      {page.rewards[reward.key]}
                    </div>
                    <div
                      className="truncate"
                      style={{ fontSize: 13, color: "#4c1d95", fontWeight: 700, marginTop: 3 }}
                    >
                      ৳ {reward.amount}
                    </div>
                    <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
                      {reward.claimed} {page.claimed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ডান কলাম */}
          <div style={{ flex: 1 }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              {TILES.map((tile) => (
                <div
                  key={tile.key}
                  className="text-center"
                  style={{
                    background: tile.bg,
                    borderRadius: 10,
                    padding: "18px 0",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: 13 }}>{page.stats[tile.key]}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>
                    {tile.money ? `${user?.currency ?? "৳"} 0.00` : "0"}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex items-center justify-center"
              style={{ marginTop: 16, gap: 8, fontSize: 13, color: "#4c1d95" }}
            >
              <span
                className="grid place-items-center"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#e8474c",
                  color: "#fff",
                  fontSize: 9,
                }}
              >
                ›
              </span>
              {page.agentLink}
            </div>

            <div
              style={{
                marginTop: 16,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                {page.shareTitle}
              </div>

              <div className="flex" style={{ gap: 12 }}>
                <div className="shrink-0">
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      backgroundImage: "repeating-conic-gradient(#111 0 25%, #fff 0 50%)",
                      backgroundSize: "7px 7px",
                    }}
                  />
                  <div
                    className="text-center"
                    style={{ background: "#4c2a85", color: "#fff", fontSize: 8, padding: "2px 0" }}
                  >
                    {page.saveCode}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="flex items-center"
                    style={{
                      height: 30,
                      borderRadius: 15,
                      border: "1px solid #eee",
                      padding: "0 4px 0 12px",
                      gap: 6,
                      overflow: "hidden",
                    }}
                  >
                    <span className="flex-1 truncate" style={{ fontSize: 11, color: "#444" }}>
                      {link}
                    </span>
                    <span
                      className="grid shrink-0 cursor-pointer place-items-center"
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#4c2a85",
                        color: "#fff",
                        fontSize: 11,
                      }}
                    >
                      ⧉
                    </span>
                  </div>

                  <div className="flex flex-wrap" style={{ marginTop: 10, gap: 6 }}>
                    {SOCIALS.map((social) => (
                      <span
                        key={social.key}
                        className="grid cursor-pointer place-items-center"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: social.bg,
                          color: "#fff",
                          fontSize: 13,
                        }}
                      >
                        {social.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * "বন্ধুদের আমন্ত্রণ জানান" — মূল সাইটের `/m/inviteFriends`।
 *
 * গঠন: উপরে পাঁচটা ট্যাব; "সংক্ষিপ্ত বর্ণনা" তে —
 *   ধূসর কার্ডে QR (নিচে "কোড সংরক্ষণ" বেগুনি ফালি) + রেফারেল লিংকের
 *     সাদা পিল (ডানে কপি বোতাম) + সাতটা সোশ্যাল বোতাম
 *   চারটে গ্রেডিয়েন্ট টাইল (আজকের আয় / গতকালের আয় / সূচিপত্রধারী /
 *     যোগ্য পরিচায়করা)
 *   কালো ব্যানারে "বাজি কমিশন" ও পরিমাণ
 *   "প্রাপ্ত পুরস্কার" — দুটো হালকা নীল কার্ড
 */
const SOCIALSMob = [
  { key: "facebook", bg: "#1877f2", label: "f" },
  { key: "x", bg: "#000000", label: "𝕏" },
  { key: "telegram", bg: "#29a9eb", label: "✈" },
  { key: "whatsapp", bg: "#25d366", label: "✆" },
  { key: "sms", bg: "#4caf50", label: "✉" },
  { key: "line", bg: "#06c755", label: "L" },
  { key: "threads", bg: "#000000", label: "@" },
];

const TILESMob = [
  { key: "today", bg: "linear-gradient(135deg,#4facfe,#00c6fb)", money: true },
  { key: "yesterday", bg: "linear-gradient(135deg,#a78bfa,#c4b5fd)", money: true },
  { key: "members", bg: "linear-gradient(135deg,#c4b5fd,#a78bfa)" },
  { key: "qualified", bg: "linear-gradient(135deg,#60a5fa,#38bdf8)" },
];

const Mobile = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.memberPage.pages.referral;
  const [tab, setTab] = useState(0);

  const link = `https://tbajee.vip/?referralCode=${user?.username ?? ""}`;

  return (
    <MemberShell title={page.title}>
      {/* ট্যাব */}
      <div
        className="hide-scrollbar flex overflow-x-auto"
        style={{ background: "#fff", height: m(110) }}
      >
        {page.tabs.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(index)}
            className="relative shrink-0 cursor-pointer"
            style={{
              padding: `0 ${m(34)}`,
              color: index === tab ? "#1e9bf0" : "#333",
              fontSize: m(32),
            }}
          >
            {item}
            {index === tab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{ width: "80%", height: m(6), background: "#1e9bf0" }}
              />
            )}
          </button>
        ))}
      </div>

      {tab !== 0 ? (
        <EmptyState />
      ) : (
        <div style={{ background: "#fff", padding: `${m(24)} ${m(24)} ${m(60)}` }}>
          {/* শেয়ার কার্ড */}
          <div style={{ background: "#f5f6fa", borderRadius: m(16), padding: m(26) }}>
            <div style={{ fontSize: m(28), fontWeight: 700, color: "#222" }}>
              {page.shareTitle}
            </div>

            <div className="flex" style={{ marginTop: m(22), gap: m(24) }}>
              {/* QR — স্ট্যাটিক প্লেসহোল্ডার, server এলে আসল কোড বসবে */}
              <div className="shrink-0">
                <div
                  style={{
                    width: m(280),
                    height: m(280),
                    background: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: m(240),
                      height: m(240),
                      backgroundImage:
                        "repeating-conic-gradient(#111 0 25%, #fff 0 50%)",
                      backgroundSize: `${m(30)} ${m(30)}`,
                    }}
                  />
                </div>
                <div
                  className="text-center"
                  style={{
                    background: "#4c2a85",
                    color: "#fff",
                    fontSize: m(20),
                    padding: `${m(8)} 0`,
                  }}
                >
                  {page.saveCode}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="flex items-center"
                  style={{
                    height: m(76),
                    background: "#fff",
                    borderRadius: m(38),
                    padding: `0 ${m(10)} 0 ${m(24)}`,
                    gap: m(12),
                    overflow: "hidden",
                  }}
                >
                  <span
                    className="flex-1 truncate"
                    style={{ fontSize: m(22), color: "#333" }}
                  >
                    {link}
                  </span>
                  <span
                    className="grid shrink-0 place-items-center"
                    style={{
                      width: m(56),
                      height: m(56),
                      borderRadius: "50%",
                      background: "#4c2a85",
                      color: "#fff",
                    }}
                  >
                    <span style={{ fontSize: m(26) }}>⧉</span>
                  </span>
                </div>

                <div className="flex flex-wrap" style={{ marginTop: m(22), gap: m(14) }}>
                  {SOCIALSMob.map((social) => (
                    <span
                      key={social.key}
                      className="grid place-items-center"
                      style={{
                        width: m(84),
                        height: m(84),
                        borderRadius: m(14),
                        background: social.bg,
                        color: "#fff",
                        fontSize: m(34),
                      }}
                    >
                      {social.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* চারটে টাইল */}
          <div
            style={{
              marginTop: m(24),
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: m(20),
            }}
          >
            {TILESMob.map((tile) => (
              <div
                key={tile.key}
                className="text-center"
                style={{
                  background: tile.bg,
                  borderRadius: m(16),
                  padding: `${m(26)} 0`,
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: m(26) }}>{page.stats[tile.key]}</div>
                <div style={{ fontSize: m(40), fontWeight: 700, marginTop: m(10) }}>
                  {tile.money ? `${user?.currency ?? "৳"} 0.00` : "0"}
                </div>
              </div>
            ))}
          </div>

          {/* কমিশন ব্যানার */}
          <div
            className="flex items-center"
            style={{
              marginTop: m(24),
              borderRadius: m(16),
              background: "linear-gradient(90deg,#1b0f35,#3b1f63)",
              padding: m(30),
              gap: m(26),
            }}
          >
            <img
              src="/assets/mobile/logo.png"
              alt=""
              style={{
                width: m(150),
                height: m(150),
                objectFit: "contain",
                borderRadius: m(16),
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: m(44), color: "#fff", fontWeight: 700 }}>
                {page.commission}
              </div>
              <div style={{ fontSize: m(48), color: "#fbbf24", fontWeight: 700, marginTop: m(16) }}>
                ৳ 7,500.00
              </div>
            </div>
          </div>

          {/* প্রাপ্ত পুরস্কার */}
          <div
            className="text-center"
            style={{ fontSize: m(38), fontWeight: 700, color: "#222", margin: `${m(34)} 0 ${m(24)}` }}
          >
            {page.rewardTitle}
          </div>

          {page.rewards.map((reward) => (
            <div
              key={reward.name}
              className="flex items-center"
              style={{
                background: "#eef2fb",
                borderRadius: m(16),
                padding: m(26),
                gap: m(24),
                marginBottom: m(20),
              }}
            >
              <span
                className="grid shrink-0 place-items-center"
                style={{ width: m(110), height: m(110), fontSize: m(62) }}
              >
                🏅
              </span>
              <div>
                <div style={{ fontSize: m(30), color: "#333" }}>{reward.name}</div>
                <div style={{ fontSize: m(40), color: "#4c2a85", fontWeight: 700, marginTop: m(8) }}>
                  ৳ {reward.amount}
                </div>
                <div style={{ fontSize: m(24), color: "#888", marginTop: m(6) }}>
                  {reward.claimed}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </MemberShell>
  );
};

const ReferralSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default ReferralSection;
