import React, { useState } from "react";
import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import MemberShell from "./MemberShell";

/**
 * অভিযোগ / পরামর্শ — মূল সাইটে এটা **শুধু মোবাইলে** আছে,
 * ডেস্কটপ মডালে এর ট্যাব নেই।
 *
 * "অভিযোগ / পরামর্শ" — মূল সাইটের `/m/feedback`।
 *
 * গঠন: ধূসর ড্রপডাউন সারি (ডানে নীল বর্গে তীর), নিচে বড় ধূসর টেক্সট
 * এরিয়া (ডান-নিচে ০/৫০০ গোনা), তারপর ড্যাশ করা আপলোড বাক্স, তারপর
 * বাঁয়ে যাচাই কোডের ইনপুট ও ডানে ক্যাপচার ছবি, শেষে নিষ্ক্রিয় ধূসর
 * "জমা দিন" বোতাম।
 */
const MAX = 500;

const FeedbackSection = () => {
  const { t } = useLanguage();
  const page = t.memberPage.pages.feedback;
  const [text, setText] = useState("");

  return (
    <MemberShell title={page.title}>
      <div style={{ padding: `${m(30)} ${m(30)} ${m(60)}`, background: "#fff" }}>
        {/* সমস্যার ধরন */}
        <div className="flex" style={{ height: m(120), marginBottom: m(26) }}>
          <span
            className="flex flex-1 items-center"
            style={{
              background: "#f2f2f4",
              borderRadius: `${m(12)} 0 0 ${m(12)}`,
              padding: `0 ${m(26)}`,
              color: "#8b8b93",
              fontSize: m(28),
            }}
          >
            {page.type}
          </span>
          <span
            className="grid place-items-center"
            style={{
              width: m(140),
              background: "#2f80ed",
              borderRadius: `0 ${m(12)} ${m(12)} 0`,
              color: "#fff",
            }}
          >
            <Icon name="arrow-down" size={m(44)} />
          </span>
        </div>

        {/* বিষয়বস্তু */}
        <div
          className="relative"
          style={{
            background: "#f2f2f4",
            borderRadius: m(12),
            padding: m(26),
            marginBottom: m(26),
          }}
        >
          <div style={{ color: "#333", fontSize: m(30), fontWeight: 600 }}>
            {page.subject}
          </div>
          <textarea
            value={text}
            maxLength={MAX}
            onChange={(e) => setText(e.target.value)}
            placeholder={page.placeholder}
            style={{
              width: "100%",
              height: m(300),
              marginTop: m(16),
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: m(26),
              color: "#333",
            }}
          />
          <span
            className="absolute"
            style={{ right: m(26), bottom: m(20), color: "#8b8b93", fontSize: m(30) }}
          >
            ( {text.length} / {MAX} )
          </span>
        </div>

        {/* আপলোড */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            height: m(300),
            border: `${m(2)} dashed #cfcfd6`,
            borderRadius: m(12),
            color: "#b4b4bc",
            gap: m(20),
            marginBottom: m(26),
          }}
        >
          <span style={{ fontSize: m(90), lineHeight: 1 }}>🖼</span>
          <span style={{ fontSize: m(28) }}>{page.upload}</span>
        </div>

        {/* যাচাই কোড */}
        <div className="flex" style={{ gap: m(20), marginBottom: m(50) }}>
          <input
            placeholder={page.captcha}
            style={{
              flex: 1,
              height: m(110),
              background: "#f2f2f4",
              border: "none",
              outline: "none",
              borderRadius: m(12),
              padding: `0 ${m(26)}`,
              fontSize: m(28),
              color: "#333",
            }}
          />
          <span
            className="grid place-items-center"
            style={{
              width: m(310),
              height: m(110),
              borderRadius: m(12),
              background: "linear-gradient(90deg,#e8f0e4,#dfe7db)",
              color: "#333",
              fontSize: m(48),
              fontStyle: "italic",
              fontWeight: 700,
              letterSpacing: m(6),
            }}
          >
            39127
          </span>
        </div>

        <button
          type="button"
          disabled={!text.trim()}
          className="w-full"
          style={{
            height: m(110),
            borderRadius: m(12),
            background: text.trim() ? "#2f80ed" : "#e2e2e8",
            color: "#fff",
            fontSize: m(34),
          }}
        >
          {page.submit}
        </button>
      </div>
    </MemberShell>
  );
};

export default FeedbackSection;
