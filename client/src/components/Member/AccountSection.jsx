import React, { useState } from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { selectUser } from "../../features/auth/authSelectors";
import { m } from "../../hook/useUnits";
import MemberShell from "./MemberShell";
import { useSelector } from "react-redux";
import { useUI } from "../../Context/uiContext";
import { useLogout } from "../../features/auth/useLogout";
import { useProfile } from "../../features/profile/useProfile";
import { ProfileSheet } from "./ProfileForms";
import { notify } from "../../utils/notify";

const pad = (n) => String(n).padStart(2, "0");
const fmtDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

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
  const p = t.profileFlow;
  const { openMember } = useUI();
  const signOut = useLogout();
  const profile = useProfile();
  const [sheet, setSheet] = useState(null);

  const ov = profile.overview;
  const items = ov?.security?.items || {};
  const percent = ov?.security?.percent ?? 0;
  const level = ov?.security?.level || "low";

  // মূল সাইটের মতো: "0 জমা দেওয়া অনুরোধ প্রস্তুতি চলছে" — অপেক্ষমাণ সংখ্যা
  const rows = [
    { icon: "deposit", label: p.pendingDeposit, value: String(ov?.pendingDeposits ?? 0) },
    { icon: "withdraw", label: p.pendingWithdraw, value: String(ov?.pendingWithdraws ?? 0) },
  ];

  const actions = [
    { key: "profile", icon: "icon-avatar", color: "#f5a623", done: items.profile },
    { key: "loginPassword", icon: "form-icon-password", color: "#35c1d6", done: true },
    { key: "wallet", icon: "cashback", color: "#e34fb2", done: items.wallet },
    { key: "payPassword", icon: "security-center", color: "#c8a15a", done: items.payPassword },
    { key: "phone", icon: "form-icon-phone", color: "#6c8cff", done: items.phone, title: p.phoneTitle, desc: p.phoneHint },
    { key: "verification", icon: "member", color: "#22b573", done: items.verification, title: p.kycTitle, desc: `${p.kycDesc} (${p.kycStatus[ov?.kycStatus || "none"]})` },
    { key: "logout", icon: "icon-logout", color: "#f04b4b" },
  ];

  const onAction = (key) => {
    if (key === "logout") return signOut();
    // ই-ওয়ালেট বাঁধা হয় উত্তোলনের ট্যাবে (মূল সাইটের মতো)
    if (key === "wallet") return openMember("withdraw");
    return setSheet(key);
  };

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

        <div style={{ fontSize: 13, color: "#999", marginTop: 12 }}>
          {p.joined} {user.joinedAt || "—"}
        </div>

        <div style={{ fontSize: 26, fontWeight: 700, color: "#333", marginTop: 16 }}>
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

        <div style={{ marginTop: 22, paddingTop: 14, borderTop: "1px solid #f0f0f0", fontSize: 13, color: "#888", lineHeight: "22px" }}>
          <div>
            {p.lastLoginTime} <span style={{ color: "#333" }}>{fmtDateTime(ov?.user?.lastLoginAt)}</span>
          </div>
          <div>
            {p.lastLoginIp} <span style={{ color: "#333" }}>{ov?.user?.lastLoginIp || "—"}</span>
          </div>
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
          <div style={{ fontSize: 30, fontWeight: 700 }}>{p.levels[level]}</div>
          <div style={{ fontSize: 13 }}>{t.member.securityLabel}</div>
        </div>
        <div style={{ marginTop: 22, fontSize: 15 }}>{p.scoreText.replace("{n}", percent)}</div>
        <div style={{ marginTop: 6, fontSize: 14, opacity: 0.9 }}>
          {p.levelText} {p.levels[level]}
        </div>
      </div>

      {/* ডানে — করণীয় */}
      <div
        className="hide-scrollbar"
        style={{ flex: 1, background: "#fff", borderRadius: 8, padding: 18, overflowY: "auto" }}
      >
        {actions.map((action) => (
          <div
            key={action.key}
            role="button"
            tabIndex={0}
            onClick={() => onAction(action.key)}
            className="tb-hover-fade flex cursor-pointer"
            style={{ gap: 14, marginBottom: 20 }}
          >
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
            <div className="flex-1">
              <div className="flex items-center" style={{ gap: 8, fontSize: 15, color: "#333", fontWeight: 600 }}>
                {action.title || t.member.actions[action.key]?.title}
                {action.done !== undefined && (
                  <span style={{ fontSize: 11, fontWeight: 500, color: action.done ? "#16a34a" : "#f04b4b", border: `1px solid ${action.done ? "#16a34a" : "#f04b4b"}`, borderRadius: 10, padding: "0 7px" }}>
                    {action.done ? p.done : p.todo}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: "#999", marginTop: 4, lineHeight: "18px" }}>
                {action.desc || t.member.actions[action.key]?.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {sheet && <ProfileSheet which={sheet} profile={profile} onClose={() => setSheet(null)} />}
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
/** মূল সাইটের ধূসর ইনপুটের সারি */
const Row = ({ icon, children, onClick }) => (
  <div
    className="relative flex items-center"
    onClick={onClick}
    style={{ height: m(100), marginBottom: m(22), borderRadius: m(12), background: "#f2f2f4", padding: `0 ${m(24)}`, gap: m(20), cursor: onClick ? "pointer" : "default" }}
  >
    <span style={{ color: "#b4b4bc", display: "grid", placeItems: "center" }}>
      <Icon name={icon} size={m(44)} />
    </span>
    {children}
  </div>
);

const inputStyle = (disabled) => ({
  flex: 1,
  minWidth: 0,
  height: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: m(30),
  color: disabled ? "#999" : "#333",
});


const Mobile = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser) || {};
  const page = t.memberPage.pages.account;
  const p = t.profileFlow;
  const profile = useProfile();
  const [sheet, setSheet] = useState(null);
  const [form, setForm] = useState({
    fullName: user.fullName || "",
    email: user.email || "",
    dateOfBirth: user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
  });
  const set = (key) => (e) => setForm((v) => ({ ...v, [key]: e.target.value }));

  const submit = async () => {
    const body = {};
    if (!user.fullName && form.fullName) body.fullName = form.fullName;
    if (!user.dateOfBirth && form.dateOfBirth) body.dateOfBirth = form.dateOfBirth;
    if (form.email !== (user.email || "")) body.email = form.email;
    if (!Object.keys(body).length) return notify.info(p.saved);
    await profile.saveInfo(body);
    return undefined;
  };

  return (
    <MemberShell title={page.title}>
      <div style={{ padding: `${m(30)} ${m(30)} ${m(60)}` }}>
        <div style={{ fontSize: m(34), color: "#222", marginBottom: m(24) }}>
          {page.usernameLabel} <span style={{ marginInlineStart: m(10) }}>{user.username ?? "-"}</span>
        </div>

        {/* প্রত্যাহারকারীর নাম = পুরো নাম, একবারই */}
        <Row icon="form-icon-id">
          <input value={form.fullName} onChange={set("fullName")} disabled={Boolean(user.fullName)} placeholder={page.payee} maxLength={60} style={inputStyle(Boolean(user.fullName))} />
        </Row>
        <div style={{ color: "#e60012", fontSize: m(28), fontWeight: 700, lineHeight: 1.45, marginBottom: m(26) }}>{page.payeeWarn}</div>

        <Row icon="form-icon-name">
          <input value={user.username || ""} disabled placeholder={page.nickname} style={inputStyle(true)} />
        </Row>
        <Row icon="form-icon-email">
          <input type="email" value={form.email} onChange={set("email")} placeholder={page.email} maxLength={80} style={inputStyle(false)} />
        </Row>
        {/* ফোন আলাদা শিটে — বদলাতে পাসওয়ার্ড/OTP লাগে */}
        <Row icon="form-icon-phone" onClick={() => setSheet("phone")}>
          <span style={{ ...inputStyle(!user.phone), display: "flex", alignItems: "center" }}>{user.phone ? `0${user.phone}` : page.phone}</span>
          <Icon name="common-arrow" size={m(30)} />
        </Row>
        <Row icon="discount-calender">
          <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} disabled={Boolean(user.dateOfBirth)} style={inputStyle(Boolean(user.dateOfBirth))} />
        </Row>

        <div style={{ marginTop: m(16) }}>
          <div style={{ color: "#4a9df5", fontSize: m(32) }}>{page.privacyTitle}</div>
          <div style={{ color: "#888", fontSize: m(24), marginTop: m(10), lineHeight: 1.5 }}>{page.privacyDesc}</div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={profile.busy}
          className="w-full cursor-pointer"
          style={{ marginTop: m(40), height: m(100), borderRadius: m(14), background: "#f5333f", color: "#fff", fontSize: m(34), boxShadow: `0 0 ${m(24)} rgb(245 51 63 / 0.45)` }}
        >
          {page.submit}
        </button>
      </div>

      {sheet && <ProfileSheet which={sheet} profile={profile} onClose={() => setSheet(null)} />}
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
