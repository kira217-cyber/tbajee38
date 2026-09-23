import React from "react";

import Icon from "../Icon/Icon";
import { useLanguage } from "../../Context/LanguageProvider";

/**
 * লগইনের পর প্রোফাইল আইকনে hover করলে যে ড্রপডাউনটা নামে।
 *
 * মূল সাইট থেকে মাপা:
 *   প্যানেল ৩০৪ চওড়া (ভিতরের আইটেম ২৬০ + দুপাশে ২২)
 *   অবতার বৃত্ত ৬৮.৭, সোনালি বর্ডার #F0C343; ভিতরে ছবি ৬২
 *   VIP ব্যাজ ৫৪.১ × ২১.৮, radius ৪, কমলা গ্রেডিয়েন্ট, fs ২০
 *   নাম fs ২০; "ID:…" fs ২০, পাশে কপি বোতাম
 *   পাঁচটা আইটেম ২৬০ × ৪৮, radius ১০, ধূসর-নীল গ্রেডিয়েন্ট,
 *     y ১৮৯.৭ থেকে ৫৮ ধাপে; আইকন ~২৩, লেখা fs ১৭
 */
const ITEMS = [
  { key: "myAccount", icon: "icon-avatar", member: "myAccount" },
  { key: "betRecord", icon: "bet-record", member: "betRecord" },
  { key: "inbox", icon: "mailcen", member: "inbox" },
  { key: "support", icon: "icon-cs" },
  { key: "logout", icon: "icon-logout" },
];

const ProfileMenu = ({ user, onMember, onSupport, onLogout }) => {
  const { t } = useLanguage();

  const label = {
    myAccount: t.member.myAccount,
    betRecord: t.member.betRecord,
    inbox: t.member.inbox,
    support: t.sidebar.support,
    logout: t.sidebar.signOut,
  };

  return (
    <div
      className="absolute"
      style={{
        top: "100%",
        right: 0,
        width: 304,
        padding: "22px",
        borderRadius: 12,
        background: "#2b3248",
        boxShadow: "0 10px 30px rgb(0 0 0 / 0.4)",
        zIndex: 30,
      }}
    >
      {/* অবতার ও VIP */}
      <div className="flex flex-col items-center">
        <span
          className="relative grid place-items-center"
          style={{
            width: 68.7,
            height: 68.7,
            borderRadius: "50%",
            background: "#f0c343",
          }}
        >
          <span
            className="grid place-items-center"
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: "#3a4159",
              overflow: "hidden",
              color: "#c9cedd",
            }}
          >
            <Icon name="member" size={44} />
          </span>
        </span>

        <span
          className="grid place-items-center"
          style={{
            marginTop: -6,
            width: 54.1,
            height: 21.8,
            borderRadius: 4,
            background: "linear-gradient(90deg,#e8a31d 87%,#dcb45a)",
            color: "#3a2a00",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          VIP{user?.vipLevel ?? 0}
        </span>

        <span style={{ marginTop: 8, fontSize: 20, color: "#fff" }}>
          {user?.username ?? "-"}
        </span>

        <span
          className="flex items-center"
          style={{ marginTop: 4, gap: 8, fontSize: 14, color: "#a9b0c5" }}
        >
          ID:{user?.id ?? "387991634"}
          <span className="cursor-pointer" style={{ fontSize: 13 }}>
            ⧉
          </span>
        </span>
      </div>

      {/* মেনু */}
      <div style={{ marginTop: 12 }}>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              if (item.key === "logout") onLogout?.();
              else if (item.key === "support") onSupport?.();
              else onMember?.(item.member);
            }}
            className="flex w-full cursor-pointer items-center"
            style={{
              width: 260,
              height: 48,
              marginTop: 10,
              borderRadius: 10,
              background: "linear-gradient(90deg,#484b5a,#424a5a)",
              padding: "0 24px",
              gap: 28,
              color: "#fff",
              fontSize: 17,
            }}
          >
            <Icon name={item.icon} size={23} />
            {label[item.key]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileMenu;
