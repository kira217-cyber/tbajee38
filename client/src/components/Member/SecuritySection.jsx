import React, { useState } from "react";
import { useNavigate } from "react-router";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { useLogout } from "../../features/auth/useLogout";
import MemberShell from "./MemberShell";
import { useProfile } from "../../features/profile/useProfile";
import { ProfileSheet } from "./ProfileForms";

/** "২০২৬-০৯-২৫ ১৫:০৮:০৬" এর মতো */
const fmtDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/**
 * সুরক্ষা কেন্দ্র — মূল সাইটে এটা **শুধু মোবাইলে** আছে,
 * ডেস্কটপ মডালে এর ট্যাব নেই।
 *
 * "সুরক্ষা কেন্দ্র" — মূল সাইটের `/m/securityCenter`।
 *
 * গঠন: উপরে সাদা কার্ডে বাঁয়ে ০% বৃত্ত, ডানে "নিরাপত্তা শতাংশ: নিম্ন",
 * পাঁচটা বিদ্যুৎ চিহ্ন (প্রথমটা হলুদ, বাকি ধূসর), শেষ লগইন IP ও সময়।
 * তারপর লাল সতর্কবাণী, তারপর সাদা কার্ডে পাঁচটা সারি — বাঁয়ে বড় আইকন,
 * শিরোনামের পাশে অবস্থার ব্যাজ (❗ লাল / ✅ সবুজ) ও পেন্সিল, নিচে বর্ণনা,
 * ডানে তীর।
 */
// অবস্থা server এর নিরাপত্তা স্কোর থেকে (`item` = কোন কাজটা হয়েছে কিনা)
const ROWS = [
  { key: "profile", icon: "member", item: "profile" },
  { key: "wallet", icon: "cashback", item: "wallet" },
  { key: "loginPassword", icon: "form-icon-password", item: "always" },
  { key: "payPassword", icon: "security-center", item: "payPassword" },
  { key: "verification", icon: "user_info", item: "verification" },
  { key: "logout", icon: "icon-logout" },
];

const SecuritySection = () => {
  const { t } = useLanguage();
  const signOut = useLogout();
  const navigate = useNavigate();
  const page = t.memberPage.pages.security;
  const p = t.profileFlow;
  const profile = useProfile();
  const [sheet, setSheet] = useState(null);

  const ov = profile.overview;
  const percent = ov?.security?.percent ?? 0;
  const level = ov?.security?.level || "low";
  const items = ov?.security?.items || {};
  const statusOf = (row) => (!row.item ? null : row.item === "always" || items[row.item] ? "ok" : "warn");

  const rowTitle = (key) => page.rows[key]?.title || (key === "verification" ? p.kycTitle : key);
  const rowDesc = (key) =>
    key === "verification" ? `${p.kycDesc} (${p.kycStatus[ov?.kycStatus || "none"]})` : page.rows[key]?.desc;

  const open = (key) => {
    if (key === "logout") return signOut();
    if (key === "profile") return navigate("/member/account");
    if (key === "wallet") return navigate("/member/withdraw");
    return setSheet(key);
  };

  return (
    <MemberShell title={page.title}>
      <div style={{ background: "#f5f5f9", padding: `${m(24)} ${m(24)} ${m(40)}` }}>
        {/* স্কোর কার্ড */}
        <div
          className="flex items-center"
          style={{
            background: "#fff",
            borderRadius: m(16),
            padding: m(30),
            gap: m(30),
          }}
        >
          <span
            className="grid shrink-0 place-items-center"
            style={{
              width: m(160),
              height: m(160),
              borderRadius: "50%",
              border: `${m(8)} solid #f0f0f4`,
              color: "#7b5cf0",
            }}
          >
            <span style={{ fontSize: m(56) }}>
              {percent}<span style={{ fontSize: m(24), color: "#8ab4f8" }}>%</span>
            </span>
          </span>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: m(32), color: "#222", fontWeight: 700 }}>
              {page.scoreLabel} {p.levels[level]}
            </div>
            <div className="flex" style={{ marginTop: m(12), gap: m(8) }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{ fontSize: m(34), opacity: i < Math.max(1, Math.round(percent / 20)) ? 1 : 0.25 }}
                >
                  ⚡
                </span>
              ))}
            </div>
            <div style={{ fontSize: m(24), color: "#666", marginTop: m(14) }}>
              {page.lastIp} <span style={{ color: "#333" }}>{ov?.user?.lastLoginIp || "—"}</span>
            </div>
            <div style={{ fontSize: m(24), color: "#666", marginTop: m(6) }}>
              {page.lastTime} <span style={{ color: "#333" }}>{fmtDateTime(ov?.user?.lastLoginAt)}</span>
            </div>
          </div>
        </div>

        <div
          className="text-center"
          style={{
            color: "#e60012",
            fontSize: m(30),
            lineHeight: 1.5,
            padding: `${m(30)} ${m(10)}`,
          }}
        >
          {level === "high" ? "" : page.warn}
        </div>

        {/* করণীয়ের সারি */}
        <div style={{ background: "#fff", borderRadius: m(16), overflow: "hidden" }}>
          {ROWS.map((row, index) => (
            <button
              key={row.key}
              type="button"
              onClick={() => open(row.key)}
              className="flex w-full cursor-pointer items-center text-left"
              style={{
                padding: `${m(26)} ${m(24)}`,
                gap: m(24),
                borderTop: index ? "1px solid #f2f2f6" : "none",
              }}
            >
              <span
                className="grid shrink-0 place-items-center"
                style={{ width: m(90), height: m(90), color: "#9b8cf5" }}
              >
                <Icon name={row.icon} size={m(72)} />
              </span>

              <span style={{ flex: 1 }}>
                <span className="flex items-center" style={{ gap: m(12) }}>
                  <span style={{ fontSize: m(32), color: "#222", fontWeight: 600 }}>
                    {rowTitle(row.key)}
                  </span>
                  {statusOf(row) && (
                    <span
                      className="grid place-items-center"
                      style={{
                        width: m(36),
                        height: m(36),
                        borderRadius: "50%",
                        background: statusOf(row) === "ok" ? "#22c55e" : "#e60012",
                        color: "#fff",
                        fontSize: m(24),
                        fontWeight: 700,
                      }}
                    >
                      {statusOf(row) === "ok" ? "✓" : "!"}
                    </span>
                  )}
                  {statusOf(row) && (
                    <span style={{ color: "#b9b9c2", fontSize: m(28) }}>✎</span>
                  )}
                </span>
                <span
                  className="block"
                  style={{ fontSize: m(24), color: "#999", marginTop: m(8), lineHeight: 1.4 }}
                >
                  {rowDesc(row.key)}
                </span>
              </span>

              {statusOf(row) && (
                <span style={{ color: "#c8c8d0" }}>
                  <Icon name="common-arrow" size={m(34)} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {sheet && <ProfileSheet which={sheet} profile={profile} onClose={() => setSheet(null)} />}
    </MemberShell>
  );
};

export default SecuritySection;
