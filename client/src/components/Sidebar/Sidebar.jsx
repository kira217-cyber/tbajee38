import React, { useState } from "react";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import Icon from "../Icon/Icon";
import { logout } from "../../features/auth/authSlice";
import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";

/**
 * বাঁ পাশের সাইডবার।
 *
 * মূল সাইট থেকে মাপা (ডেস্কটপ):
 *   কলাম ২৪৭.৫px, bg #010928, padding 0 14.3px 48px 15.8px
 *   nav-wrapper প্রস্থ ২১৭.৪px; গ্রুপ ১ (৫ আইটেম) h৩১০ mb৪১,
 *   গ্রুপ ২ (গেম সেন্টার) h৬২, গ্রুপ ৩ (সদস্য কেন্দ্র) h৬২ mb৪০
 *   nav-item h৫২, margin-top ১০, radius ৮.৭, padding 0 20, gap 20
 *     active: bg rgba(188,67,244,.28) + 1px solid #AD00FF
 *   আইকন ৪০×৪০, label fs ১৮ fw ৬০০
 *
 * মোবাইলে এটা ড্রয়ার হয়ে বাঁ দিক থেকে ঢোকে।
 */

const Group = ({ children, mb = 0 }) => (
  <div className="flex flex-col" style={{ width: 217.4, marginBottom: mb }}>
    {children}
  </div>
);

const NavItem = ({ icon, label, active, trailing, onClick, iconSize = 40 }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex shrink-0 cursor-pointer items-center text-left"
    style={{
      height: 52,
      marginTop: 10,
      borderRadius: 8.7,
      padding: "0 20px",
      gap: 20,
      color: "#fff",
      fontSize: 17.3,
      fontWeight: 600,
      background: active ? "var(--accent-soft)" : "transparent",
      border: active ? "1px solid var(--accent)" : "1px solid transparent",
    }}
  >
    {typeof icon === "string" ? (
      <Icon name={icon} size={iconSize} />
    ) : (
      <span style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}>{icon}</span>
    )}
    <span style={{ fontSize: 18, fontWeight: 600, flex: 1 }}>{label}</span>
    {trailing}
  </button>
);

const Chevron = ({ open }) => (
  <span
    style={{
      transition: "transform .2s",
      transform: open ? "rotate(180deg)" : "none",
      display: "grid",
      placeItems: "center",
    }}
  >
    <Icon name="arrow-down" size={18} />
  </span>
);

const Sidebar = ({ topOffset = 0, open, onClose, onMember, onSection, onDownload, onSupport }) => {
  const { t, lang, setLang, languages } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDesktop = useIsDesktop();
  const [gameCenterOpen, setGameCenterOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const current = languages.find((item) => item.code === lang) ?? languages[0];

  // মূল সাইটে ডিপোজিট ও উত্তোলন সাইডবার থেকেই "ব্যক্তিগত কেন্দ্র" মডাল
  // খোলে, আলাদা পেজে যায় না
  const top = [
    { key: "deposit", icon: "deposit", label: t.sidebar.deposit, member: "deposit" },
    { key: "withdraw", icon: "withdraw", label: t.sidebar.withdraw, member: "withdraw" },
    { key: "promo", icon: "promo-2", label: t.sidebar.promo, to: "/promotions" },
    { key: "reward", icon: "reward", label: t.sidebar.reward, member: "reward" },
    { key: "rebate", icon: "cashback", label: t.sidebar.rebate, member: "manualRebate" },
  ];

  const gameCenter = [
    { key: "RNG", icon: "rng" },
    { key: "FISH", icon: "rng" },
    { key: "LIVE", icon: "live" },
    { key: "PVP", icon: "member" },
    { key: "SPORTS", icon: "sports" },
  ];

  const member = [
    { key: "vip", icon: "vip", label: t.memberCenter.vip },
    { key: "betRecord", icon: "bet-record", label: t.memberCenter.betRecord },
    { key: "accountRecord", icon: "icon-account", label: t.memberCenter.accountRecord },
    { key: "myAccount", icon: "icon-avatar", label: t.memberCenter.myAccount },
    { key: "deposit2", icon: "deposit_record", label: t.memberCenter.deposit },
    { key: "profitLoss", icon: "profit-loss", label: t.memberCenter.profitLoss },
    { key: "inbox", icon: "mailcen", label: t.memberCenter.inbox },
  ];

  return (
    <>
      {/* মোবাইলে ড্রয়ারের পিছনের আবরণ */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 md:hidden"
          style={{ background: "rgb(0 0 0 / 0.5)", zIndex: 18 }}
        />
      )}

      {/* দুই ভিউপোর্টেই হ্যামবার্গার দিয়ে খোলে-বন্ধ হয় (ডেস্কটপে ডিফল্টে
          খোলা)। transform টা inline style এ, কারণ Tailwind এর md: ক্লাস
          inline style কে হারাতে পারে না। */}
      <aside
        className="hide-scrollbar fixed bottom-0 left-0 overflow-y-auto transition-transform"
        style={{
          // ডাউনলোড বার খোলা থাকলে সাইডবারও ততটা নিচ থেকে
          top: topOffset ? `calc(var(--header-h) + ${topOffset})` : "var(--header-h)",
          width: "var(--sidebar-w)",
          maxWidth: isDesktop ? "none" : "80vw",
          background: "var(--bg)",
          padding: "0 14.3px 48px 15.8px",
          zIndex: 19,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <Group mb={41}>
          {top.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active
              onClick={() => {
                if (item.member) onMember?.(item.member);
                else if (item.to) navigate(item.to);
                onClose?.();
              }}
            />
          ))}
        </Group>

        <Group>
          <NavItem
            icon="game-center"
            label={t.sidebar.gameCenter}
            active
            trailing={<Chevron open={gameCenterOpen} />}
            onClick={() => setGameCenterOpen((v) => !v)}
          />
          {gameCenterOpen &&
            gameCenter.map((item) => (
              <NavItem
                key={item.key}
                icon={item.icon}
                label={t.gameCenter[item.key]}
                onClick={() => {
                  onSection?.(item.key);
                  onClose?.();
                }}
              />
            ))}
        </Group>

        <Group mb={40}>
          <NavItem
            icon="member"
            label={t.sidebar.memberCenter}
            active
            trailing={<Chevron open={memberOpen} />}
            onClick={() => setMemberOpen((v) => !v)}
          />
          {memberOpen &&
            member.map((item) => (
              <NavItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                onClick={() => {
                  onMember?.(item.key === "deposit2" ? "deposit" : item.key);
                  onClose?.();
                }}
              />
            ))}
        </Group>

        <Group mb={40}>
          {/* ভাষা — মূল সাইটের মতো ড্রপডাউন, বেছে নিলে পুরো সাইট বদলায় */}
          <NavItem
            icon={
              <img
                src={current.flag}
                alt=""
                // `.language-select img` — ৩৮ × ৩৮
                style={{ width: 38, height: 38, borderRadius: "50%" }}
              />
            }
            label={current.name}
            active
            trailing={<Chevron open={langOpen} />}
            onClick={() => setLangOpen((v) => !v)}
          />
          {langOpen &&
            languages
              .filter((item) => item.code !== lang)
              .map((item) => (
                <NavItem
                  key={item.code}
                  icon={
                    <img
                      src={item.flag}
                      alt=""
                      style={{ width: 38, height: 38, borderRadius: "50%" }}
                    />
                  }
                  label={item.name}
                  onClick={() => {
                    setLang(item.code);
                    setLangOpen(false);
                  }}
                />
              ))}

          <NavItem
            icon="icon-download"
            iconSize={36}
            label={t.sidebar.appDownload}
            active
            onClick={() => onDownload?.()}
          />
          <NavItem
            icon="icon-cs"
            iconSize={39}
            label={t.sidebar.support}
            active
            onClick={() => onSupport?.()}
          />
        </Group>

        <Group>
          <NavItem
            icon="icon-logout"
            label={t.sidebar.signOut}
            active
            onClick={() => {
              dispatch(logout());
              onClose?.();
              navigate("/");
            }}
          />
        </Group>
      </aside>
    </>
  );
};

export default Sidebar;
