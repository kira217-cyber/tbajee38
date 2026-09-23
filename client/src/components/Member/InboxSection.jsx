import React from "react";
import { useIsDesktop } from "../../hook/useIsDesktop";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell, { EmptyState } from "./MemberShell";

/**
 * "অভ্যন্তরীণ বার্তা" / মেইল — ডেস্কটপে মডালের ট্যাব,
 * মোবাইলে `/member/mail`।
 */

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */
const Desktop = () => {
  const { t } = useLanguage();
  const page = t.member.desk.inbox;

  return (
    <div
      className="flex flex-col"
      style={{ width: 1110, height: 620, background: "#fff" }}
    >
      <div
        className="flex items-center"
        style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}
      >
        <span
          className="relative h-full"
          style={{
            display: "grid",
            placeItems: "center",
            padding: "0 18px",
            fontSize: 14,
            color: "#e8474c",
          }}
        >
          {page.inbox}
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{ width: "70%", height: 2, background: "#e8474c" }}
          />
        </span>
      </div>

      <div className="flex" style={{ flex: 1 }}>
        {/* বাঁ — বার্তার তালিকা */}
        <div
          className="flex flex-col"
          style={{ width: 450, background: "#f5f5f5", borderRight: "1px solid #eee" }}
        >
          <div
            className="flex items-center"
            style={{
              height: 42,
              background: "#fff",
              padding: "0 14px",
              gap: 12,
              fontSize: 13,
              color: "#555",
            }}
          >
            <input type="checkbox" style={{ width: 14, height: 14 }} />
            {page.selectAll}
            <span className="flex-1" />
            <span className="cursor-pointer" style={{ color: "#999" }}>
              <Icon name="icon-edit" size={16} />
            </span>
            <span className="cursor-pointer" style={{ color: "#999" }}>
              <Icon name="mailcen" size={16} />
            </span>
            <span className="flex cursor-pointer items-center" style={{ gap: 6 }}>
              {page.sortBy}
              <Icon name="arrow-down" size={12} />
            </span>
          </div>

          <div className="flex-1" />

          <div
            className="flex items-center"
            style={{ height: 44, background: "#fff", padding: "0 14px" }}
          >
            <span className="cursor-pointer" style={{ color: "#999" }}>
              <Icon name="icon-edit" size={16} />
            </span>
          </div>
        </div>

        {/* ডান — বিস্তারিত */}
        <div className="flex-1" style={{ background: "#fff" }} />
      </div>
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */
/**
 * "মেইল" — মূল সাইটের `/m/webEmail`।
 *
 * গঠন: একটাই ট্যাব "ইনবক্স" (নীল, নিচে পুরো প্রস্থে নীল রেখা), তারপর
 * সাদা বডিতে ধূসর মন-খারাপ মুখ ও "কোন মেসেজ নেই" — এই পেজে রেকর্ডের
 * নীল ইলাস্ট্রেশনটা নয়, আলাদা খালি অবস্থা।
 */
const Mobile = () => {
  const { t } = useLanguage();
  const page = t.memberPage.pages.mail;

  return (
    <MemberShell title={page.title}>
      <div
        className="relative flex items-center justify-center"
        style={{ height: m(96), background: "#fff" }}
      >
        <span style={{ color: "#1e9bf0", fontSize: m(32) }}>{page.inbox}</span>
        <span
          className="absolute bottom-0 left-0"
          style={{ width: "100%", height: m(4), background: "#1e9bf0" }}
        />
      </div>

      <div
        className="flex flex-col items-center"
        style={{ padding: `${m(260)} 0`, gap: m(30), background: "#fff" }}
      >
        {/* ধূসর মন-খারাপ মুখ — মূল সাইটে এটাই খালি মেইলবক্সের চিহ্ন */}
        <svg
          viewBox="0 0 120 120"
          style={{ width: m(370), height: m(370), color: "#d8d8dc" }}
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" />
          <circle cx="43" cy="50" r="5" fill="currentColor" />
          <circle cx="77" cy="50" r="5" fill="currentColor" />
          <path
            d="M40 82c6-10 34-10 40 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ fontSize: m(34), color: "#b4b4bc" }}>{page.empty}</span>
      </div>
    </MemberShell>
  );
};

const InboxSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default InboxSection;
