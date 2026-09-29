import React, { useState } from "react";

import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";
import { useHelp } from "../../features/help/useHelp";
import { pickLang, siteImage, useSiteSettings } from "../../site/siteSettings";
import HelpModal from "../Help/HelpModal";

/**
 * ফুটার।
 *
 * **মোবাইল** (`.home-footer`, ৭৫০-ডিজাইনে মাপা) — ডেস্কটপের চেয়ে পুরো
 * আলাদা, তাই আলাদা করে লেখা:
 *   মোট উচ্চতা ৭৮৬, ভিতরের কনটেন্ট ৭০০ চওড়া, বাঁয়ে ২৫
 *   লাইসেন্স সারি y ৩১ উঁচু ১৩৮ — বাঁয়ে "গেমিং লাইসেন্স" (৩৩৫ চওড়া),
 *     শিরোনাম fs ২০, পাশে ব্যাজ ২৮; নিচে curacao ৯০ × ৩০,
 *     তারপর `local_license_1` fs ১৮ রঙ #D9D9D9
 *     ডানে "দায়িত্বশীল গেমিং" (x ৩৯০) — আইকন ৪০ ও ৭০ × ৫০
 *   প্রোভাইডার ছবি y ১৯২, ৭০০ × ২৪৪
 *   "পেমেন্ট মেথড" y ৪৬৮ — ছবি ৩৭৪ × ৬০ (y ৫০৬)
 *   সার্টিফিকেশন ও সুরক্ষা y ৬০২, দুই কলাম ৩৫০
 *   কপিরাইট y ৭৬৩ fs ২০ রঙ #D9D9D9
 *
 * **ডেস্কটপ**: পুরো প্রস্থে bg #241A3E, উচ্চতা ৪০৮, padding-top ৩৫,
 *   ভিতরের কনটেন্ট সেই ১০৮৫ কলামে।
 */

/** ছবি — মোবাইলে মাপ ৭৫০-ডিজাইনের px (০ = নিজের অনুপাতে), লিংক থাকলে নতুন ট্যাবে */
const FooterImage = ({ item, style }) => {
  const el = (
    <img
      src={siteImage(item.image)}
      alt=""
      style={{ width: item.w ? m(item.w) : undefined, height: item.h ? m(item.h) : undefined, objectFit: "contain", display: "block", ...style }}
    />
  );
  return item.link ? (
    <a href={item.link} target="_blank" rel="noreferrer noopener">
      {el}
    </a>
  ) : (
    el
  );
};

/** ছবির সারি — `br` দেওয়া ছবি থেকে নতুন লাইন, লাইনের মাঝে `rowGap` */
const ImageRow = ({ items, gap, rowGap = 0, style }) => {
  const lines = [];
  items.forEach((item, i) => {
    if (i === 0 || item.br) lines.push([]);
    lines[lines.length - 1].push(item);
  });
  return (
    <div style={style}>
      {lines.map((line, li) => (
        <div key={li} className="flex flex-wrap items-end" style={{ gap, marginTop: li ? rowGap : 0 }}>
          {line.map((item, i) => (
            <FooterImage key={`${item.image}-${i}`} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
};

const MobileFooter = () => {
  const { lang } = useLanguage();
  const { footer: f } = useSiteSettings();
  const tx = (v) => pickLang(v, lang);
  const title = { fontSize: m(20), color: "var(--footer-heading, #fff)" };

  return (
    <footer style={{ paddingBottom: m(130) }}>
      <div style={{ width: m(700), marginInline: "auto", paddingTop: m(31) }}>
        {/* লাইসেন্স ও দায়িত্বশীল গেমিং */}
        <div className="flex" style={{ minHeight: m(138) }}>
          <div style={{ width: m(335) }}>
            <div className="flex items-center" style={{ height: m(28), gap: m(10) }}>
              <span style={title}>{tx(f.titles.license)}</span>
              <img
                src="/assets/mobile/title-icon.png"
                alt=""
                style={{ width: m(28), height: m(28) }}
              />
            </div>
            <ImageRow items={f.license} gap={m(10)} rowGap={m(10)} style={{ marginTop: m(10) }} />
            <div style={{ fontSize: m(18), color: "var(--footer-text, #d9d9d9)", marginTop: m(10) }}>
              {tx(f.licenseText)}
            </div>
          </div>

          <div style={{ width: m(335), marginInlineStart: m(30) }}>
            <div style={{ ...title, height: m(23) }}>{tx(f.titles.responsible)}</div>
            <ImageRow items={f.responsible} gap={m(24)} rowGap={m(10)} style={{ marginTop: m(10) }} />
          </div>
        </div>

        {/* গেম প্রোভাইডার */}
        <ImageRow items={f.providers} gap={m(10)} rowGap={m(10)} style={{ marginTop: m(23) }} />

        {/* পেমেন্ট মেথড */}
        <div style={{ marginTop: m(32) }}>
          <div style={title}>{tx(f.titles.payment)}</div>
          <ImageRow items={f.payment} gap={m(15)} rowGap={m(10)} style={{ marginTop: m(15) }} />
        </div>

        {/* সার্টিফিকেশন ও সুরক্ষা */}
        <div className="flex" style={{ marginTop: m(36) }}>
          <div style={{ width: m(350) }}>
            <div style={title}>{tx(f.titles.certification)}</div>
            <ImageRow items={f.certification} gap={m(25)} rowGap={m(17)} style={{ marginTop: m(8) }} />
          </div>

          <div style={{ width: m(350) }}>
            <div style={title}>{tx(f.titles.security)}</div>
            <ImageRow items={f.security} gap={m(16)} rowGap={m(10)} style={{ marginTop: m(9) }} />
          </div>
        </div>

        <div
          className="text-center"
          style={{ fontSize: m(20), color: "var(--footer-text, #d9d9d9)", marginTop: m(31) }}
        >
          {tx(f.copyright)}
        </div>
      </div>
    </footer>
  );
};

const DesktopFooter = () => {
  const { t, lang } = useLanguage();
  const { footer: f } = useSiteSettings();
  const tx = (v) => pickLang(v, lang);
  // admin "ডেস্কটপে দেখাও" দিলে সাহায্য কেন্দ্রের লেখা এখানে (মূল সাইটে কলামটা খালি)
  const { articles } = useHelp("desktop");
  const [helpAt, setHelpAt] = useState(null);
  const tv = (v) => (lang === "en" ? v?.en || v?.bn : v?.bn || v?.en) || "";

  const columns = [
    { title: tx(f.titles.help), items: articles.map((a, i) => ({ key: a.id, label: tv(a.title), onClick: () => setHelpAt(i) })) },
    {
      title: tx(f.titles.products),
      items: [
        t.gameCenter.RNG,
        t.gameCenter.FISH,
        t.gameCenter.LIVE,
        t.gameCenter.PVP,
        t.gameCenter.SPORTS,
      ],
    },
    {
      title: tx(f.titles.social),
      items: f.socials.map((s, i) => ({ key: `s${i}`, label: s.name, icon: s.icon, href: s.url })),
    },
  ];

  return (
    <footer style={{ background: "var(--footer-bg, var(--surface))", paddingTop: 35, paddingBottom: 40 }}>
      <div style={{ width: "var(--content-w)", marginInline: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {columns.map((column) => (
            <div key={column.title}>
              <div style={{ color: "var(--footer-heading, #fff)", fontSize: 17, marginBottom: 18 }}>{column.title}</div>
              <ul style={{ display: "grid", gap: 12 }}>
                {column.items.map((item) =>
                  typeof item === "string" ? (
                    <li key={item} style={{ color: "var(--text-dim)", fontSize: 16 }}>
                      {item}
                    </li>
                  ) : item.href !== undefined ? (
                    <li key={item.key}>
                      <a
                        href={item.href || undefined}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center hover:underline"
                        style={{ color: "var(--text-dim)", fontSize: 16, gap: 8 }}
                      >
                        {item.icon ? <img src={siteImage(item.icon)} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} /> : null}
                        {item.label}
                      </a>
                    </li>
                  ) : (
                    <li key={item.key}>
                      <button type="button" onClick={item.onClick} className="cursor-pointer text-left hover:underline" style={{ color: "var(--text-dim)", fontSize: 16 }}>
                        {item.label}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            paddingTop: 28,
            borderTop: "1px solid rgb(255 255 255 / 0.08)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 46,
          }}
        >
          {f.desktopProviders.map((provider, i) => {
            const logo = (
              <img
                key={`${provider.image}-${i}`}
                src={siteImage(provider.image)}
                alt={provider.name}
                style={{
                  height: 34,
                  objectFit: "contain",
                  filter: "grayscale(1) brightness(1.6)",
                  opacity: 0.75,
                }}
              />
            );
            return provider.link ? (
              <a key={`${provider.image}-${i}`} href={provider.link} target="_blank" rel="noreferrer noopener">
                {logo}
              </a>
            ) : (
              logo
            );
          })}
        </div>

        <div
          style={{ marginTop: 30, textAlign: "center", color: "var(--text-dim)", fontSize: 15 }}
        >
          {tx(f.copyright)}
        </div>
      </div>
      {helpAt !== null && <HelpModal articles={articles} start={helpAt} onClose={() => setHelpAt(null)} />}
    </footer>
  );
};

const Footer = () => (useIsDesktop() ? <DesktopFooter /> : <MobileFooter />);

export default Footer;
