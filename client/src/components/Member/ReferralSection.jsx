import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useIsDesktop } from "../../hook/useIsDesktop";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";
import { selectUser } from "../../features/auth/authSelectors";
import { tk, useReferral } from "../../features/referral/useReferral";
import MemberShell from "./MemberShell";
import { IncomePanel, InviteesPanel, MilestoneList, ProgramCard, RecordsPanel, Rules, ShareBox } from "./referral/ReferralParts";

/**
 * "বন্ধুদের আমন্ত্রণ জানান" — ডেস্কটপে মডালের ট্যাব, মোবাইলে
 * `/member/referral` (মূল সাইটের `/m/inviteFriends`)।
 *
 * পাঁচ ট্যাব, মূল সাইটের মতো:
 *   সারসংক্ষেপ — শেয়ার (QR + লিংক), আজ/গতকালের আয়, বন্ধুর সংখ্যা,
 *     "বাজি কমিশন" ব্যানার, কারা পেলেন, সাইটে কোন পুরস্কার কতজন পেলেন
 *   পুরস্কার — মোট যোগ্য বন্ধুর মাইলফলক, পৌঁছালে "দাবি করুন"
 *   আয় — আজ আর মোট, ধরন অনুযায়ী
 *   রেকর্ড — ধরন + তারিখ ধরে প্রতিটা পুরস্কার
 *   আমন্ত্রিতদের তালিকা — কে কবে এলেন, যোগ্য কিনা
 *
 * আমন্ত্রণ পুরস্কার আর জমা/বাজির কমিশন নিজে থেকেই ব্যালেন্সে যায়;
 * দাবি করতে হয় শুধু মাইলফলক।
 */

const REWARD_TYPES = ["invitation", "achievement", "deposit", "betting"];

const TILES = [
  { key: "today", bg: "linear-gradient(135deg,#7dd3fc,#38bdf8)", pick: (ov) => tk(ov.todayIncome) },
  { key: "yesterday", bg: "linear-gradient(135deg,#c4b5fd,#a78bfa)", pick: (ov) => tk(ov.yesterdayIncome) },
  { key: "members", bg: "linear-gradient(135deg,#a5b4fc,#818cf8)", pick: (ov) => ov.memberCount ?? 0 },
  { key: "qualified", bg: "linear-gradient(135deg,#7dd3fc,#38bdf8)", pick: (ov) => ov.qualifiedCount ?? 0 },
];

/** বন্ধ/অ্যাফিলিয়েট — লেখা দেখানো */
const Notice = ({ text, style }) => (
  <div className="flex flex-1 items-center justify-center text-center" style={{ color: "#999", ...style }}>
    {text}
  </div>
);

/* ─────────────────── ডেস্কটপ (মডালের ভিতরে) ─────────────────── */

/**
 * সারসংক্ষেপ — মূল সাইট থেকে মাপা দুই কলাম:
 *   বাঁয়ে (~৬২০): কালচে-বেগুনি কমিশন ব্যানার (দুপাশে স্লট মেশিন, মাঝে
 *     লোগো, ৳ ৭,৫০০.০০), গোলাপি-নীল কার্ডে "যারা পুরস্কার পেয়েছেন",
 *     তারপর "এখন পর্যন্ত প্রাপ্ত পুরস্কার" — চারটে কার্ড
 *   ডানে (~৪৩০): ২×২ পরিসংখ্যান টাইল, "এজেন্ট ৪ সুপার কমিশন", শেয়ার বাক্স
 */
const DeskOverview = ({ data }) => {
  const { t } = useLanguage();
  const page = t.member.desk.referral;
  const r = t.referralFlow;
  const ov = data.overview || {};
  const setting = data.setting || {};

  return (
    <div className="hide-scrollbar flex" style={{ flex: 1, overflowY: "auto", padding: 18, gap: 18 }}>
      <div style={{ width: 618, flexShrink: 0 }}>
        <div className="relative flex items-center overflow-hidden" style={{ height: 148, borderRadius: 10, background: "linear-gradient(90deg,#2a1050,#4c1d95)", padding: "0 26px", gap: 22 }}>
          <img src="/assets/referral/slot-side.png" alt="" style={{ position: "absolute", left: 0, top: 0, height: "100%", opacity: 0.55 }} />
          <img src="/assets/referral/slot-side.png" alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", opacity: 0.55, transform: "scaleX(-1)" }} />
          <span className="relative" style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginLeft: 40 }}>{page.commission}</span>
          <img src="/assets/referral/logo-coin.png" alt="" className="relative" style={{ width: 84, height: 84, objectFit: "contain" }} />
          <div className="relative">
            <div style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>{tk(setting.estimatePerInvitee)}</div>
            <div style={{ fontSize: 12, color: "#e9d5ff", marginTop: 6 }}>{page.commission}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, borderRadius: 10, background: "linear-gradient(135deg,#f3e8ff,#dbeafe)", padding: 18 }}>
          <div style={{ fontSize: 17, color: "#2b2e83", fontWeight: 700, marginBottom: 12 }}>{page.winnersTitle}</div>
          <div className="hide-scrollbar" style={{ maxHeight: 130, overflowY: "auto" }}>
            {(data.winners || []).length === 0 ? (
              <div style={{ fontSize: 13, color: "#888", padding: "8px 0" }}>{r.noWinners}</div>
            ) : (
              data.winners.map((w, i) => (
                <div key={i} className="flex items-center" style={{ height: 34, borderRadius: 17, background: "rgb(255 255 255 / 0.75)", padding: "0 18px", marginBottom: 8, fontSize: 13, color: "#444" }}>
                  <span style={{ flex: 1, textAlign: "center" }}>{w.user}</span>
                  <span style={{ flex: 1, textAlign: "center" }}>{page.received}</span>
                  <span style={{ flex: 1, textAlign: "center" }}>{tk(w.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 17, color: "#2b2e83", fontWeight: 700 }}>{page.rewardTitle}</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {REWARD_TYPES.map((key) => (
            <div key={key} className="flex items-center" style={{ background: "#f6f7fb", borderRadius: 8, padding: 10, gap: 8 }}>
              <img src={`/assets/referral/reward-${key}.png`} alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "#666" }}>{r.types[key]}</div>
                <div className="truncate" style={{ fontSize: 13, color: "#4c1d95", fontWeight: 700, marginTop: 3 }}>{tk(data.site?.[key]?.amount)}</div>
                <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>{r.claimedCount.replace("{n}", data.site?.[key]?.members ?? 0)}</div>
              </div>
            </div>
          ))}
        </div>

        <Rules setting={setting} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TILES.map((tile) => (
            <div key={tile.key} className="text-center" style={{ background: tile.bg, borderRadius: 10, padding: "18px 0", color: "#fff" }}>
              <div style={{ fontSize: 13 }}>{page.stats[tile.key]}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>{tile.pick(ov)}</div>
            </div>
          ))}
        </div>

        <AgentLink href={setting.agentLink} style={{ marginTop: 16, fontSize: 13 }} dot={16} />

        <div style={{ marginTop: 16 }}>
          <ShareBox code={data.referralCode} domain={setting.inviteDomain} title={page.shareTitle} />
        </div>
      </div>
    </div>
  );
};

/** "এজেন্ট ৪ সুপার কমিশন" — admin লিংক দিলে তবেই চাপা যায় */
const AgentLink = ({ href, style, dot }) => {
  const { t } = useLanguage();
  const body = (
    <>
      <span className="grid place-items-center" style={{ width: dot, height: dot, borderRadius: "50%", background: "#e8474c", color: "#fff", fontSize: dot * 0.6 }}>
        ›
      </span>
      {t.referralFlow.agentLink}
    </>
  );
  const common = { className: "flex items-center justify-center", style: { gap: 8, color: "#4c1d95", ...style } };
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
      {body}
    </a>
  ) : (
    <div {...common}>{body}</div>
  );
};

const Desktop = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.member.desk.referral;
  const r = t.referralFlow;
  const [tab, setTab] = useState(0);
  const ref = useReferral();
  const data = ref.data;
  const off = data && !data.setting?.isActive;

  let body;
  if (ref.error) body = <Notice text={ref.error} style={{ fontSize: 14 }} />;
  else if (!data) body = <Notice text={r.loading} style={{ fontSize: 13 }} />;
  else if (tab === 0) body = <DeskOverview data={data} />;
  else
    body = (
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
        {tab === 1 && (
          <>
            <ProgramCard setting={data.setting} />
            <MilestoneList milestones={data.milestones} busy={ref.busy} onClaim={ref.claim} />
          </>
        )}
        {tab === 2 && <IncomePanel data={data} />}
        {tab === 3 && <RecordsPanel />}
        {tab === 4 && <InviteesPanel vipName={`VIP${user?.vipLevel ?? 0}`} />}
      </div>
    );

  return (
    <div className="flex flex-col" style={{ width: 1110, height: 620, background: "#fff" }}>
      <div className="flex items-center" style={{ height: 52, borderBottom: "1px solid #eee", padding: "0 56px 0 20px" }}>
        {page.tabs.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(index)}
            className="relative h-full cursor-pointer"
            style={{ padding: "0 18px", fontSize: 14, color: index === tab ? "#e8474c" : "#666" }}
          >
            {label}
            {index === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "70%", height: 2, background: "#e8474c" }} />}
          </button>
        ))}
        {off ? <span style={{ marginLeft: "auto", fontSize: 12, color: "#e8474c" }}>{r.off}</span> : null}
      </div>
      {body}
    </div>
  );
};

/* ─────────────────── মোবাইল (আলাদা পেজ) ─────────────────── */

/**
 * মূল সাইটের `/m/inviteFriends` — উপরে পাঁচটা ট্যাব; সারসংক্ষেপে:
 *   ধূসর কার্ডে QR ("কোড সংরক্ষণ") + লিংকের সাদা পিল + সাতটা সোশ্যাল বোতাম
 *   চারটে গ্রেডিয়েন্ট টাইল, কালো "বাজি কমিশন" ব্যানার,
 *   "প্রাপ্ত পুরস্কার" — চারটে হালকা নীল কার্ড, "এজেন্ট ৪ সুপার কমিশন",
 *   শেষে কারা পুরস্কার পেলেন
 */
const MobOverview = ({ data }) => {
  const { t } = useLanguage();
  const page = t.memberPage.pages.referral;
  const desk = t.member.desk.referral;
  const r = t.referralFlow;
  const ov = data.overview || {};
  const setting = data.setting || {};

  return (
    <div style={{ background: "#fff", padding: `${m(24)} ${m(24)} ${m(60)}` }}>
      <ShareBox code={data.referralCode} domain={setting.inviteDomain} title={page.shareTitle} />

      <div style={{ marginTop: m(24), display: "grid", gridTemplateColumns: "1fr 1fr", gap: m(20) }}>
        {TILES.map((tile) => (
          <div key={tile.key} className="text-center" style={{ background: tile.bg, borderRadius: m(16), padding: `${m(26)} 0`, color: "#fff" }}>
            <div style={{ fontSize: m(26) }}>{page.stats[tile.key]}</div>
            <div style={{ fontSize: m(40), fontWeight: 700, marginTop: m(10) }}>{tile.pick(ov)}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center" style={{ marginTop: m(24), borderRadius: m(16), background: "linear-gradient(90deg,#1b0f35,#3b1f63)", padding: m(30), gap: m(26) }}>
        <img src="/assets/referral/logo-coin.png" alt="" style={{ width: m(150), height: m(150), objectFit: "contain", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: m(48), color: "#fbbf24", fontWeight: 700 }}>{tk(setting.estimatePerInvitee)}</div>
          <div style={{ fontSize: m(36), color: "#fff", fontWeight: 700, marginTop: m(12) }}>{page.commission}</div>
        </div>
      </div>

      <div className="text-center" style={{ fontSize: m(38), fontWeight: 700, color: "#222", margin: `${m(34)} 0 ${m(24)}` }}>{page.rewardTitle}</div>
      {REWARD_TYPES.map((key) => (
        <div key={key} className="flex items-center" style={{ background: "#eef2fb", borderRadius: m(16), padding: m(26), gap: m(24), marginBottom: m(20) }}>
          <img src={`/assets/referral/reward-${key}.png`} alt="" style={{ width: m(110), height: m(110), objectFit: "contain", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: m(30), color: "#333" }}>{r.types[key]}</div>
            <div style={{ fontSize: m(40), color: "#4c2a85", fontWeight: 700, marginTop: m(8) }}>{tk(data.site?.[key]?.amount)}</div>
            <div style={{ fontSize: m(24), color: "#888", marginTop: m(6) }}>{r.claimedCount.replace("{n}", data.site?.[key]?.members ?? 0)}</div>
          </div>
        </div>
      ))}

      <AgentLink href={setting.agentLink} style={{ margin: `${m(20)} 0`, fontSize: m(28) }} dot={16} />

      <div style={{ borderRadius: m(16), background: "linear-gradient(135deg,#f3e8ff,#dbeafe)", padding: m(26) }}>
        <div style={{ fontSize: m(32), color: "#2b2e83", fontWeight: 700, marginBottom: m(18) }}>{desk.winnersTitle}</div>
        {(data.winners || []).length === 0 ? (
          <div style={{ fontSize: m(26), color: "#888" }}>{r.noWinners}</div>
        ) : (
          data.winners.map((w, i) => (
            <div key={i} className="flex items-center" style={{ height: m(68), borderRadius: m(34), background: "rgb(255 255 255 / 0.8)", marginBottom: m(14), fontSize: m(26), color: "#444" }}>
              <span style={{ flex: 1, textAlign: "center" }}>{w.user}</span>
              <span style={{ flex: 1, textAlign: "center" }}>{desk.received}</span>
              <span style={{ flex: 1, textAlign: "center" }}>{tk(w.amount)}</span>
            </div>
          ))
        )}
      </div>

      <Rules setting={setting} />
    </div>
  );
};

const Mobile = () => {
  const { t } = useLanguage();
  const user = useSelector(selectUser);
  const page = t.memberPage.pages.referral;
  const r = t.referralFlow;
  const [tab, setTab] = useState(0);
  const ref = useReferral();
  const data = ref.data;

  let body;
  if (ref.error) body = <Notice text={ref.error} style={{ fontSize: m(30), padding: `${m(200)} ${m(40)}` }} />;
  else if (!data) body = <Notice text={r.loading} style={{ fontSize: m(28), padding: `${m(200)} 0` }} />;
  else if (tab === 0) body = <MobOverview data={data} />;
  else
    body = (
      <div style={{ background: "#fff", padding: `${m(24)} ${m(24)} ${m(60)}`, minHeight: "60vh" }}>
        {tab === 1 && (
          <>
            <ProgramCard setting={data.setting} />
            <MilestoneList milestones={data.milestones} busy={ref.busy} onClaim={ref.claim} />
          </>
        )}
        {tab === 2 && <IncomePanel data={data} />}
        {tab === 3 && <RecordsPanel />}
        {tab === 4 && <InviteesPanel vipName={`VIP${user?.vipLevel ?? 0}`} />}
      </div>
    );

  return (
    <MemberShell title={page.title}>
      <div className="hide-scrollbar flex overflow-x-auto" style={{ background: "#fff", height: m(110) }}>
        {page.tabs.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(index)}
            className="relative shrink-0 cursor-pointer"
            style={{ padding: `0 ${m(34)}`, color: index === tab ? "#1e9bf0" : "#333", fontSize: m(32) }}
          >
            {item}
            {index === tab && <span className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "80%", height: m(6), background: "#1e9bf0" }} />}
          </button>
        ))}
      </div>
      {data && !data.setting?.isActive ? (
        <div className="text-center" style={{ background: "#fff5f5", color: "#e60012", fontSize: m(26), padding: m(16) }}>{r.off}</div>
      ) : null}
      {body}
    </MemberShell>
  );
};

const ReferralSection = (props) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <Desktop {...props} /> : <Mobile {...props} />;
};

export default ReferralSection;
