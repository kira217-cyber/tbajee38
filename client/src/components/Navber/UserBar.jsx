import React, { useState } from "react";

import Icon from "../Icon/Icon";
import ProfileMenu from "./ProfileMenu";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";
import { useRefreshBalance } from "../../features/auth/useRefreshBalance";

/**
 * লগইনের পরে হেডারের ডান পাশ।
 *
 * মূল সাইট থেকে মাপা (`.header-right`, ১৯২০ viewport):
 *   ডিপোজিট বোতাম ১২২.২ × ৪৫, radius ২০, সোনালি gradient
 *   উত্তোলন বোতাম ১১১.৬ × ৪৫, radius ৮.৭, bg rgba(188,67,244,.28)
 *   অবতার ৪৯ × ৪৯ (VIP ব্যাজ সহ), তারপর ব্যালেন্স ১২৪.৫ × ৪০
 *   শেষে "সদস্য" বোতাম ৭৮.৮ × ৪৫, radius ২০, gradient, লেখা #AD00FF
 *   পুরোটা ডানে, ডান প্রান্ত থেকে ৩৫ ফাঁক
 */
const UserBar = ({ user, onDeposit, onWithdraw, onMember, onSupport, onLogout }) => {
  // মূল সাইটে অবতারে hover করলেই মেনুটা নামে (ক্লিক লাগে না)
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const { refresh, refreshing } = useRefreshBalance();

  const balance = `${user.currency} ${user.balance.toFixed(2)}`;

  /* ── মোবাইল (`.header-right`, ৭৫০-ডিজাইনে মাপা) ──
       `.user-balance` ২৬১.২ × ৮৪ (x ৩৩১.৯, y ১২.৫), bg #282F3C,
         radius ১৬, padding `0 15`, gap ৫ — ভিতরে:
         `.sum-balance` fs ২৫ fw ৮০০ রঙ #DADADA + রিফ্রেশ ৪০ × ৪০,
         `.deposit-btn` ৬০ × ৬০ (উপরে-বাঁয়ে ৩৫ উপহার আইকন),
         `.withdraw-btn` ৬০ × ৬০
       `.member-icon` ১৩১ × ৮৪ (x ৫৯৯), bg #282F3C, radius ১৮,
         padding `0 16 0 8` — অবতার ৬৮ বৃত্ত, নিচে VIP ব্যাজ
         ৫৮.৩ × ২৪.৫ (PNG ব্যাকগ্রাউন্ড, লেখা #543C00 fs ২৪ fw ৭০০),
         ডানে ২৩ × ১১ শেভরন */
  if (!isDesktop) {
    return (
      <div
        className="absolute flex items-center"
        style={{ right: m(20), top: m(12.5), height: m(84), gap: m(5.9) }}
      >
        <div
          className="tb-balance flex items-center"
          style={{
            height: m(84),
            paddingInline: m(15),
            borderRadius: m(16),
            background: "#282f3c",
            gap: m(5),
          }}
        >
          <button
            type="button"
            onClick={onMember}
            className="flex cursor-pointer items-center"
            style={{ height: m(40) }}
          >
            <span
              className="truncate"
              style={{ fontSize: m(25), fontWeight: 800, color: "#dadada" }}
            >
              {balance}
            </span>
            <span
              role="button"
              aria-label="refresh"
              onClick={refresh}
              className={`flex items-center justify-center${refreshing ? " tb-spin" : ""}`}
              style={{ width: m(40), height: m(40) }}
            >
              <img
                src="/assets/mobile/icons/refresh.svg"
                alt=""
                style={{ width: m(26), height: m(26) }}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={onDeposit}
            aria-label="deposit"
            className="relative flex cursor-pointer items-center justify-center"
            style={{ width: m(60), height: m(60) }}
          >
            <img
              src="/assets/mobile/icons/deposit.svg"
              alt=""
              style={{ width: m(60), height: m(60) }}
            />
            <img
              src="/assets/mobile/register-gift.svg"
              alt=""
              className="absolute"
              style={{ left: m(-15), top: m(-15), width: m(35), height: m(35) }}
            />
          </button>

          <button
            type="button"
            onClick={onWithdraw}
            aria-label="withdraw"
            className="flex cursor-pointer items-center justify-center"
            style={{ width: m(60), height: m(60) }}
          >
            <img
              src="/assets/mobile/icons/withdraw.svg"
              alt=""
              style={{ width: m(60), height: m(60) }}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onMember}
          className="tb-member relative flex cursor-pointer items-center"
          style={{
            height: m(84),
            padding: `0 ${m(16)} 0 ${m(8)}`,
            borderRadius: m(18),
            background: "#282f3c",
          }}
        >
          <span className="relative" style={{ width: m(68), height: m(68) }}>
            <img
              src={user.avatar || "/assets/mobile/avatar.png"}
              alt=""
              style={{
                width: m(68),
                height: m(68),
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                background: "var(--surface)",
              }}
            />
            <span
              className="absolute flex items-center justify-center"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                bottom: m(-8),
                width: m(58.3),
                height: m(24.5),
                backgroundImage: "url(/assets/mobile/vip-bg.png)",
                backgroundSize: "100% 100%",
                borderRadius: m(5),
                color: "#543c00",
                fontSize: m(24),
                fontWeight: 700,
              }}
            >
              VIP{user.vipLevel}
            </span>
          </span>

          <span
            className="flex items-center justify-center"
            style={{ width: m(23), marginInlineStart: m(2) }}
          >
            <img
              src="/assets/mobile/icons/chevron.svg"
              alt=""
              style={{ width: m(23), height: m(11) }}
            />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center" style={{ gap: 15, marginInlineEnd: 35 }}>
      <button
        type="button"
        onClick={onDeposit}
        className="tb-hover-fade flex cursor-pointer items-center justify-center"
        style={{
          width: 122.2,
          height: 45,
          borderRadius: 20,
          background: "linear-gradient(90deg,#FFD76E,#F0A020)",
          color: "#2b0b4b",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {t.deposit}
      </button>

      <button
        type="button"
        onClick={onWithdraw}
        className="tb-hover-fade flex cursor-pointer items-center justify-center"
        style={{
          width: 111.6,
          height: 45,
          borderRadius: 8.7,
          background: "var(--accent-soft)",
          border: "1px solid var(--accent)",
          color: "#fff",
          fontSize: 18,
        }}
      >
        {t.withdraw}
      </button>

      {/* অবতার + VIP ব্যাজ — hover এ প্রোফাইল মেনু */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: "var(--header-h)" }}
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
      <button
        type="button"
        onClick={onMember}
        className="relative flex cursor-pointer items-center justify-center"
        style={{ width: 49, height: 49 }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
            background: "var(--surface)",
          }}
        >
          <Icon name="icon-avatar" size={30} />
        </span>
        <span
          className="absolute"
          style={{
            bottom: -2,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0 5px",
            borderRadius: 6,
            background: "var(--gold)",
            color: "#2b0b4b",
            fontSize: 10,
            fontWeight: 700,
            lineHeight: "13px",
          }}
        >
          VIP{user.vipLevel}
        </span>
      </button>

        {menuOpen && (
          <ProfileMenu
            user={user}
            onMember={onMember}
            onSupport={onSupport}
            onLogout={onLogout}
          />
        )}
      </div>

      {/* ব্যালেন্স */}
      <div
        className="flex items-center"
        style={{ width: 124.5, height: 40, gap: 8, color: "var(--gold)", fontSize: 17 }}
      >
        <span className="truncate">{balance}</span>
        <span
          role="button"
          aria-label="refresh"
          onClick={refresh}
          className={`flex cursor-pointer${refreshing ? " tb-spin" : ""}`}
          style={{ opacity: 0.8 }}
        >
          <Icon name="refresh" size={16} />
        </span>
      </div>

      <button
        type="button"
        onClick={onMember}
        className="tb-hover-fade flex cursor-pointer items-center justify-center"
        style={{
          width: 78.8,
          height: 45,
          borderRadius: 20,
          background: "linear-gradient(270deg,#48E0C8,#9AF0A8)",
          color: "var(--accent)",
          fontSize: 16,
        }}
      >
        {t.bottomNav.member}
      </button>
    </div>
  );
};

export default UserBar;
