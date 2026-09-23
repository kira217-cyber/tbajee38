import React from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { selectUser } from "../../features/auth/authSelectors";
import { m } from "../../hook/useUnits";
import MemberShell from "./MemberShell";
import { useSelector } from "react-redux";

/**
 * "আমার অ্যাকাউন্ট" — ডেস্কটপে মডালের ট্যাব, মোবাইলে `/member/account`।
 *
 * দুটোই একই ফিচার, শুধু লেআউট আলাদা (মূল সাইটেও তাই):
 *   ডেস্কটপ — তিন কলাম: প্রোফাইল কার্ড, নিরাপত্তা স্কোর, করণীয়ের তালিকা
 *   মোবাইল — উপরে ব্যবহারকারীর নাম, তারপর ইনপুটের সারি, নিচে জমা বোতাম
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
/**
 * মেম্বার মডালের "আমার অ্যাকাউন্ট" ট্যাব।
 *
 * মূল সাইটের লেআউট (স্ক্রিনশট থেকে): তিন কলাম —
 *   বাঁয়ে প্রোফাইল কার্ড (অবতার, নাম, যোগদানের তারিখ, ব্যালেন্স,
 *     আজকের জমা/উত্তোলনের সারি, শেষ লগইন),
 *   মাঝে নিরাপত্তা স্কোরের বৃত্ত ও পরামর্শ,
 *   ডানে করণীয়ের তালিকা (ব্যক্তিগত তথ্য, লগইন পাসওয়ার্ড, ই-ওয়ালেট,
 *     লেনদেন পাসওয়ার্ড, লগআউট)।
 * পুরো প্যানেল হালকা থিমে, ঠিক মূল সাইটের মতো।
 */
const Desktop = ({ user }) => {
  const { t } = useLanguage();

  const rows = [
    { icon: "deposit", label: t.member.todayDeposit, value: "0" },
    { icon: "withdraw", label: t.member.todayWithdraw, value: "0" },
  ];

  const actions = [
    { key: "profile", icon: "icon-avatar", color: "#f5a623" },
    { key: "loginPassword", icon: "form-icon-password", color: "#35c1d6" },
    { key: "wallet", icon: "cashback", color: "#e34fb2" },
    { key: "payPassword", icon: "security-center", color: "#c8a15a" },
    { key: "logout", icon: "icon-logout", color: "#f04b4b" },
  ];

  return (
    <div className="flex" style={{ width: 1110, height: 620, background: "#f7f7f7", gap: 18, padding: 18 }}>
      {/* বাঁ — প্রোফাইল */}
      <div style={{ width: 340, background: "#fff", borderRadius: 8, padding: 20 }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#f0f0f0",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="icon-avatar" size={40} />
          </span>
          <div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: 10,
                  background: "#2b3248",
                  color: "var(--gold)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                VIP{user.vipLevel}
              </span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#333", marginTop: 4 }}>
              {user.username}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 26, fontWeight: 700, color: "#333", marginTop: 22 }}>
          {user.currency} {user.balance.toFixed(2)}
        </div>

        <div style={{ marginTop: 20, display: "grid", gap: 14 }}>
          {rows.map((row) => (
            <div key={row.label} className="flex items-center" style={{ gap: 12 }}>
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#f2f6ff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={row.icon} size={20} />
              </span>
              <span style={{ fontSize: 14, color: "#666", flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 14, color: "#333" }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* মাঝে — নিরাপত্তা স্কোর */}
      <div
        style={{
          width: 330,
          background: "linear-gradient(180deg,#f5455b,#f8778a)",
          borderRadius: 8,
          padding: 24,
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: "50%",
            background: "#fff",
            margin: "10px auto 0",
            display: "grid",
            placeItems: "center",
            color: "#f5455b",
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 700 }}>{t.member.securityLow}</div>
          <div style={{ fontSize: 13 }}>{t.member.securityLabel}</div>
        </div>
        <div style={{ marginTop: 22, fontSize: 15 }}>{t.member.securityScore}</div>
        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>{t.member.securityHint}</div>
      </div>

      {/* ডানে — করণীয় */}
      <div
        className="hide-scrollbar"
        style={{ flex: 1, background: "#fff", borderRadius: 8, padding: 18, overflowY: "auto" }}
      >
        {actions.map((action) => (
          <div key={action.key} className="flex" style={{ gap: 14, marginBottom: 22 }}>
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: action.color,
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name={action.icon} size={22} />
            </span>
            <div>
              <div style={{ fontSize: 15, color: "#333", fontWeight: 600 }}>
                {t.member.actions[action.key].title}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 4, lineHeight: "18px" }}>
                {t.member.actions[action.key].desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * "আমার অ্যাকাউন্ট" — মূল সাইটের `/m/myAccount/index`।
 *
 * গঠন (স্ক্রিনশট থেকে): উপরে "ব্যবহারকারীর নাম: rai182", তারপর ধূসর
 * ইনপুটের সারি (প্রত্যাহারকারীর নাম → লাল সতর্কবাণী → ডাকনাম → Google
 * → ইমেইল → ফোন), নিচে নীল শিরোনামে গোপনীয়তার নোট, শেষে লাল
 * "জমা দিন" বোতাম (গ্লো সহ)।
 */
const FIELDS = [
  { key: "payee", icon: "form-icon-id", warn: true },
  { key: "nickname", icon: "form-icon-name" },
  { key: "google", icon: "form-icon-name" },
  { key: "email", icon: "form-icon-email" },
  { key: "phone", icon: "form-icon-phone" },
];

const Mobile = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.memberPage.pages.account;

  return (
    <MemberShell title={page.title}>
      <div style={{ padding: `${m(30)} ${m(30)} ${m(60)}` }}>
        <div style={{ fontSize: m(34), color: "#222", marginBottom: m(24) }}>
          {page.usernameLabel}{" "}
          <span style={{ marginInlineStart: m(10) }}>{user?.username ?? "-"}</span>
        </div>

        {FIELDS.map((field) => (
          <React.Fragment key={field.key}>
            <div
              className="relative flex items-center"
              style={{
                height: m(100),
                marginBottom: m(22),
                borderRadius: m(12),
                background: "#f2f2f4",
                padding: `0 ${m(24)}`,
                gap: m(20),
              }}
            >
              <span style={{ color: "#b4b4bc", display: "grid", placeItems: "center" }}>
                <Icon name={field.icon} size={m(44)} />
              </span>
              <input
                placeholder={page[field.key]}
                style={{
                  flex: 1,
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: m(30),
                  color: "#333",
                }}
              />
            </div>

            {field.warn && (
              <div
                style={{
                  color: "#e60012",
                  fontSize: m(28),
                  fontWeight: 700,
                  lineHeight: 1.45,
                  marginBottom: m(26),
                }}
              >
                {page.payeeWarn}
              </div>
            )}
          </React.Fragment>
        ))}

        <div style={{ marginTop: m(16) }}>
          <div style={{ color: "#4a9df5", fontSize: m(32) }}>{page.privacyTitle}</div>
          <div
            style={{ color: "#888", fontSize: m(24), marginTop: m(10), lineHeight: 1.5 }}
          >
            {page.privacyDesc}
          </div>
        </div>

        <button
          type="button"
          className="w-full cursor-pointer"
          style={{
            marginTop: m(40),
            height: m(100),
            borderRadius: m(14),
            background: "#f5333f",
            color: "#fff",
            fontSize: m(34),
            boxShadow: `0 0 ${m(24)} rgb(245 51 63 / 0.45)`,
          }}
        >
          {page.submit}
        </button>
      </div>
    </MemberShell>
  );
};

const AccountSection = (props) => {
  const isDesktop = useIsDesktop();
  const user = useSelector(selectUser);
  const fallback = { username: "-", balance: 0, vipLevel: 0, currency: "৳" };

  return isDesktop ? <Desktop user={props.user ?? user ?? fallback} /> : <Mobile />;
};

export default AccountSection;
