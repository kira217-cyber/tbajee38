import { useHideBootLoader } from "../../hook/useHideBootLoader";
import React, { useState } from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { selectUser } from "../../features/auth/authSelectors";
import MemberShell, { EmptyState } from "./MemberShell";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

/**
 * "পুরস্কার কেন্দ্র" — ডেস্কটপে মডালের ট্যাব, মোবাইলে `/member/reward`।
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
/**
 * ডেস্কটপ মডালের "পুরস্কার কেন্দ্র" ট্যাব।
 *
 * মূল সাইট থেকে মাপা:
 *   বাঁয়ে ~২৯০px কার্ড — উপরে বেগুনি গ্রেডিয়েন্টে অবতার, নাম,
 *     "প্রাপ্ত হিসাব", ৳ ০.০০ ও রিফ্রেশ; নিচে সাদা অংশে দুটো কাজের সারি
 *     (টেমু টিকিট / সাইন-ইন কাজ) — প্রতিটার ডানে "দেখুন" বোতাম
 *   ডানে দুটো ট্যাব (প্রাপ্তি কেন্দ্র ৩ / টিকিটের রেকর্ড), নিচে তিনটে
 *     নম্বরওয়ালা সারি — বাঁয়ে বড় ধূসর সংখ্যা ও শিরোনাম, ডানে রঙিন
 *     কুপন কার্ড (বাকি N দিন, কাউন্টডাউন, শেষ তারিখ, সবুজ "দাবি করুন")
 */
const REWARDS = [
  {
    key: "daily",
    coupon: "linear-gradient(135deg,#fb5b6d,#e8334c)",
    row: "linear-gradient(90deg,#fdeef2,#fff)",
    days: 0,
    time: "10:21:04",
    end: "২০২৬-০৯-২২",
  },
  {
    key: "big",
    coupon: "linear-gradient(135deg,#fdc14b,#f59e0b)",
    row: "linear-gradient(90deg,#fdf6e6,#fff)",
    days: 6,
    time: "10:21:04",
    end: "২০২৬-০৯-২৮",
  },
  {
    key: "newbie",
    coupon: "linear-gradient(135deg,#4facfe,#00c6fb)",
    row: "linear-gradient(90deg,#eaf4fd,#fff)",
    days: 2,
    time: "10:53:29",
    end: "২০২৬-০৯-২৪",
    prize: "৳ 49.00",
  },
];

const Desktop = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.member.desk.reward;
  const [tab, setTab] = useState(0);

  return (
    <div className="flex" style={{ width: 1110, height: 620, background: "#f7f7f7" }}>
      {/* বাঁ কার্ড */}
      <div style={{ width: 290, padding: 18 }}>
        <div style={{ borderRadius: 10, overflow: "hidden", background: "#fff" }}>
          <div
            style={{
              background: "linear-gradient(160deg,#8b5cf6,#6d28d9)",
              padding: 18,
              color: "#fff",
            }}
          >
            <div className="flex items-center" style={{ gap: 12 }}>
              <span
                className="grid place-items-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgb(255 255 255 / 0.2)",
                }}
              >
                <Icon name="member" size={30} />
              </span>
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 6, fontSize: 16 }}>
                  {user?.username ?? "-"}
                  <span style={{ opacity: 0.8, fontSize: 12 }}>✎</span>
                </div>
                <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>
                  {page.usernameLabel} {user?.username ?? "-"}
                </div>
              </div>
              <span style={{ opacity: 0.9 }}>
                <Icon name="refresh" size={18} />
              </span>
            </div>

            <div className="text-center" style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{page.balanceLabel}</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>
                {user?.currency ?? "৳"} {(user?.balance ?? 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div style={{ padding: 14 }}>
            {page.tasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center"
                style={{ gap: 12, padding: "10px 0" }}
              >
                <span
                  className="grid shrink-0 place-items-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#fb923c,#f97316)",
                    fontSize: 20,
                  }}
                >
                  🎟
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#333" }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                    {task.desc}
                  </div>
                </div>
                <span
                  className="cursor-pointer"
                  style={{
                    padding: "5px 14px",
                    borderRadius: 14,
                    border: "1px solid #ddd",
                    fontSize: 12,
                    color: "#555",
                  }}
                >
                  {page.view}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ডান পাশ */}
      <div className="flex flex-1 flex-col" style={{ background: "#fff" }}>
        <div
          className="flex items-center"
          style={{ height: 46, padding: "0 56px 0 18px", gap: 10, borderBottom: "1px solid #eee" }}
        >
          {page.tabs.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(index)}
              className="flex cursor-pointer items-center"
              style={{
                height: 28,
                padding: "0 12px",
                borderRadius: 4,
                gap: 6,
                fontSize: 13,
                color: index === tab ? "#e8474c" : "#666",
                background: index === tab ? "#fdeef0" : "transparent",
              }}
            >
              {label}
              {index === 0 && (
                <span
                  className="grid place-items-center"
                  style={{
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: "#e8474c",
                    color: "#fff",
                    fontSize: 10,
                  }}
                >
                  3
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
          {tab === 0 ? (
            REWARDS.map((reward, index) => (
              <div
                key={reward.key}
                className="flex items-center"
                style={{
                  background: reward.row,
                  padding: "22px 24px",
                  gap: 20,
                  borderBottom: "1px solid #f4f4f4",
                }}
              >
                <span style={{ fontSize: 36, fontWeight: 700, color: "#3f3f46" }}>
                  {index + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, color: "#222" }}>
                    {page.items[reward.key]}
                  </div>
                  {reward.prize && (
                    <div style={{ fontSize: 12, color: "#777", marginTop: 8 }}>
                      {page.prizeLabel}
                      <br />
                      {reward.prize}
                    </div>
                  )}
                </div>

                {/* কুপন কার্ড */}
                <div className="flex" style={{ borderRadius: 6, overflow: "hidden" }}>
                  <div
                    style={{
                      width: 165,
                      background: reward.coupon,
                      color: "#fff",
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontSize: 10, opacity: 0.9 }}>{page.coupon}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, margin: "4px 0 10px" }}>
                      {page.items[`${reward.key}Coupon`]}
                    </div>
                    <div style={{ fontSize: 10, opacity: 0.9 }}>
                      {page.endLabel} {reward.end}
                    </div>
                  </div>

                  <div
                    className="flex flex-col items-center justify-center"
                    style={{ width: 92, background: "#fff", padding: "10px 8px", gap: 4 }}
                  >
                    <span style={{ fontSize: 10, color: "#888" }}>{page.remaining}</span>
                    <span style={{ fontSize: 11, color: "#333" }}>
                      <b style={{ fontSize: 20 }}>{reward.days}</b>
                      {page.days}
                    </span>
                    <span style={{ fontSize: 10, color: "#888" }}>{reward.time}</span>
                    <span
                      className="cursor-pointer"
                      style={{
                        marginTop: 4,
                        padding: "3px 10px",
                        borderRadius: 10,
                        background: "#22c55e",
                        color: "#fff",
                        fontSize: 11,
                      }}
                    >
                      {page.claim}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="flex h-full items-center justify-center"
              style={{ color: "#999", fontSize: 13 }}
            >
              {t.member.desk.noMatch}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * "পুরস্কার সেন্টার" — মূল সাইটের `/m/rewardCenter`।
 *
 * এই পেজটার হেডার বাকিগুলোর মতো গাঢ় নয়, তাই আলাদা করে লেখা:
 *   উপরে কমলা গ্রেডিয়েন্টের ব্যাকগ্রাউন্ডে বড় "REWARD" লেখা ঝাপসা করে
 *   বসানো; তার উপরে ধূসর-রূপালি প্রোফাইল কার্ড — ডান কোণে লাল
 *   "সাইন ইন" ফিতা, ভিতরে অবতার, নাম, ডাকনাম, ব্যালেন্স, VIP0 ও
 *   অগ্রগতির রেখা (0 / 2), ডানে "সুবিধা ›"
 *   নিচে চারটে রঙিন টাইল (দাবি করা / সাইন ইন / বন্ধুদের আমন্ত্রণ /
 *   টেমু টিকিট), প্রতিটায় সাদা বৃত্তে আইকন
 */
const TILES = [
  { key: "claim", bg: "linear-gradient(135deg,#34d399,#10b981)", icon: "🎁", badge: 3 },
  { key: "signIn", bg: "linear-gradient(135deg,#60a5fa,#3b82f6)", sprite: "discount-calender" },
  { key: "invite", bg: "linear-gradient(135deg,#fda4af,#fb7185)", icon: "👤", to: "/member/referral" },
  { key: "ticket", bg: "linear-gradient(135deg,#fb923c,#f97316)", sprite: "achievement-ticket" },
];

const Mobile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const page = t.memberPage.pages.reward;

  useHideBootLoader();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f9" }}>
      {/* কমলা হেডার */}
      <div
        className="relative"
        style={{
          background: "linear-gradient(160deg,#ff8a3d,#ff6b35)",
          paddingBottom: m(120),
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ height: m(100) }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="back"
            className="absolute flex cursor-pointer items-center"
            style={{ left: m(30), width: m(50), height: m(50), color: "#fff" }}
          >
            <Icon name="icon-back" size={m(40)} />
          </button>
          <span style={{ fontSize: m(34), color: "#fff" }}>{page.title}</span>
        </div>

        <span
          className="absolute"
          style={{
            top: m(110),
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: m(120),
            fontWeight: 800,
            color: "rgb(255 255 255 / 0.14)",
            letterSpacing: m(8),
            whiteSpace: "nowrap",
          }}
        >
          REWARD
        </span>

        {/* প্রোফাইল কার্ড */}
        <div
          className="relative"
          style={{
            margin: `${m(120)} ${m(30)} 0`,
            borderRadius: m(20),
            background: "linear-gradient(160deg,#e5e9f0,#f4f6fa)",
            padding: m(30),
            overflow: "hidden",
          }}
        >
          <div
            className="absolute flex items-center"
            style={{
              top: 0,
              right: 0,
              height: m(70),
              padding: `0 ${m(24)}`,
              background: "#e11d48",
              color: "#fff",
              fontSize: m(28),
              gap: m(12),
              borderBottomLeftRadius: m(20),
            }}
          >
            <Icon name="achievement-done" size={m(34)} />
            {page.signIn}
            <Icon name="common-arrow" size={m(26)} />
          </div>

          <div className="flex items-center" style={{ gap: m(26), marginTop: m(40) }}>
            <span
              className="grid shrink-0 place-items-center"
              style={{
                width: m(150),
                height: m(150),
                borderRadius: "50%",
                background: "#fff",
                border: `${m(4)} solid #d4a574`,
                color: "#9aa0ac",
              }}
            >
              <Icon name="member" size={m(90)} />
            </span>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: m(40), fontWeight: 700, color: "#222" }}>
                {user?.username ?? "-"}
              </div>
              <div style={{ fontSize: m(26), color: "#666", marginTop: m(6) }}>
                {page.nickname} {user?.username ?? "-"}
              </div>
              <div
                className="flex items-center"
                style={{ fontSize: m(40), fontWeight: 700, color: "#222", marginTop: m(8), gap: m(10) }}
              >
                {user?.currency ?? "৳"} {(user?.balance ?? 0).toFixed(2)}
                <Icon name="refresh" size={m(34)} />
              </div>
            </div>
          </div>

          <div className="flex items-center" style={{ marginTop: m(26), gap: m(12) }}>
            <span style={{ fontSize: m(30) }}>👑</span>
            <span style={{ fontSize: m(30), color: "#222" }}>VIP{user?.vipLevel ?? 0}</span>
            <span className="flex-1" />
            <span style={{ fontSize: m(28), color: "#555" }}>{page.benefit} ›</span>
          </div>

          <div className="flex items-center" style={{ marginTop: m(14), gap: m(16) }}>
            <span
              style={{
                flex: 1,
                height: m(14),
                borderRadius: m(7),
                background: "#c9ced8",
              }}
            />
            <span style={{ fontSize: m(26), color: "#555" }}>0 / 2</span>
          </div>
        </div>
      </div>

      {/* চারটে টাইল */}
      <div
        style={{
          margin: `${m(30)} ${m(30)} 0`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: m(24),
          paddingBottom: m(60),
        }}
      >
        {TILES.map((tile) => (
          <button
            key={tile.key}
            type="button"
            onClick={() => tile.to && navigate(tile.to)}
            className="relative flex cursor-pointer flex-col items-center justify-center"
            style={{
              height: m(280),
              borderRadius: m(20),
              background: tile.bg,
              color: "#fff",
              gap: m(20),
            }}
          >
            <span
              className="relative grid place-items-center"
              style={{
                width: m(130),
                height: m(130),
                borderRadius: "50%",
                background: "#fff",
                fontSize: m(64),
                color: "#3b82f6",
              }}
            >
              {tile.sprite ? (
                <Icon name={tile.sprite} size={m(70)} />
              ) : (
                tile.icon
              )}
              {tile.badge && (
                <span
                  className="absolute grid place-items-center"
                  style={{
                    top: m(-8),
                    right: m(-8),
                    minWidth: m(46),
                    height: m(46),
                    borderRadius: m(23),
                    background: "#ef4444",
                    fontSize: m(26),
                    fontWeight: 700,
                  }}
                >
                  {tile.badge}
                </span>
              )}
            </span>
            <span
              className="text-center"
              style={{ fontSize: m(30), lineHeight: 1.3, padding: `0 ${m(16)}` }}
            >
              {page.tiles[tile.key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const RewardSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default RewardSection;
