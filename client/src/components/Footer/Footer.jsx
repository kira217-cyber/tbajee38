import React from "react";

import { useLanguage } from "../../Context/LanguageProvider";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { m } from "../../hook/useUnits";

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

/* সবগুলোই `public/assets/vendors/` এ আসলেই আছে এমন ফাইল —
   EVO/CQ9-COLOR/T1 নামে কিছু নামানো হয়নি, তাই ওগুলোর বদলে
   Evolution = EG4, আর CQ9 এর ধূসর সংস্করণটাই। */
const DESKTOP_PROVIDERS = [
  { code: "PG", src: "/assets/vendors/rng_list_vendor/PG-COLOR.png" },
  { code: "EVO", src: "/assets/vendors/live_list_vendor/EG4-COLOR.png" },
  { code: "PT", src: "/assets/vendors/live_list_vendor/PT-COLOR.png" },
  { code: "JDB", src: "/assets/vendors/rng_list_vendor/JDB-COLOR.png" },
  { code: "CQ9", src: "/assets/vendors/rng_list_vendor/CQ9-GRAY.png" },
  { code: "FC", src: "/assets/vendors/rng_list_vendor/FC-COLOR.png" },
  { code: "JILI", src: "/assets/vendors/rng_list_vendor/JL-COLOR.png" },
  { code: "BTG", src: "/assets/vendors/rng_list_vendor/BTG-COLOR.png" },
];

const MobileFooter = () => {
  const { t } = useLanguage();
  const title = { fontSize: m(20), color: "#fff" };

  return (
    <footer style={{ paddingBottom: m(130) }}>
      <div style={{ width: m(700), marginInline: "auto", paddingTop: m(31) }}>
        {/* লাইসেন্স ও দায়িত্বশীল গেমিং */}
        <div className="flex" style={{ height: m(138) }}>
          <div style={{ width: m(335) }}>
            <div className="flex items-center" style={{ height: m(28), gap: m(10) }}>
              <span style={title}>{t.footer.license}</span>
              <img
                src="/assets/mobile/title-icon.png"
                alt=""
                style={{ width: m(28), height: m(28) }}
              />
            </div>
            <img
              src="/assets/mobile/curacao.png"
              alt=""
              style={{ width: m(90), height: m(30), marginTop: m(10), objectFit: "contain" }}
            />
            <div style={{ fontSize: m(18), color: "#d9d9d9", marginTop: m(10) }}>
              local_license_1
            </div>
          </div>

          <div style={{ width: m(335), marginInlineStart: m(30) }}>
            <div style={{ ...title, height: m(23) }}>{t.footer.responsible}</div>
            <div className="flex items-end" style={{ marginTop: m(10), gap: m(24) }}>
              <img
                src="/assets/mobile/responsible-1.png"
                alt=""
                style={{ width: m(40), height: m(40), objectFit: "contain" }}
              />
              <img
                src="/assets/mobile/responsible-2.png"
                alt=""
                style={{ width: m(70), height: m(50), objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        {/* গেম প্রোভাইডার */}
        <img
          src="/assets/mobile/vendor-icon.png"
          alt=""
          style={{ width: m(700), marginTop: m(23), display: "block" }}
        />

        {/* পেমেন্ট মেথড */}
        <div style={{ marginTop: m(32) }}>
          <div style={title}>{t.footer.payment}</div>
          <img
            src="/assets/mobile/payment-channel.png"
            alt=""
            style={{ width: m(374), height: m(60), marginTop: m(15), objectFit: "contain" }}
          />
        </div>

        {/* সার্টিফিকেশন ও সুরক্ষা */}
        <div className="flex" style={{ marginTop: m(36) }}>
          <div style={{ width: m(350) }}>
            <div style={title}>{t.footer.certification}</div>
            <div className="flex items-end" style={{ marginTop: m(8), gap: m(25) }}>
              <img
                src="/assets/mobile/certificate-1.png"
                alt=""
                style={{ width: m(44), height: m(52), objectFit: "contain" }}
              />
              <img
                src="/assets/mobile/certificate-2.png"
                alt=""
                style={{ width: m(52), height: m(52), objectFit: "contain" }}
              />
            </div>
            <img
              src="/assets/mobile/certificate-3.png"
              alt=""
              style={{ width: m(121), height: m(31), marginTop: m(17), objectFit: "contain" }}
            />
          </div>

          <div style={{ width: m(350) }}>
            <div style={title}>{t.footer.security}</div>
            <div className="flex items-end" style={{ marginTop: m(9), gap: m(16) }}>
              <img
                src="/assets/mobile/security-1.png"
                alt=""
                style={{ width: m(41), height: m(42), objectFit: "contain" }}
              />
              <img
                src="/assets/mobile/security-2.png"
                alt=""
                style={{ width: m(37), height: m(51), objectFit: "contain" }}
              />
            </div>
          </div>
        </div>

        <div
          className="text-center"
          style={{ fontSize: m(20), color: "#d9d9d9", marginTop: m(31) }}
        >
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};

const DesktopFooter = () => {
  const { t } = useLanguage();

  const columns = [
    { title: t.footer.help, items: [] },
    {
      title: t.footer.products,
      items: [
        t.gameCenter.RNG,
        t.gameCenter.FISH,
        t.gameCenter.LIVE,
        t.gameCenter.PVP,
        t.gameCenter.SPORTS,
      ],
    },
    { title: t.footer.social, items: [] },
  ];

  return (
    <footer style={{ background: "var(--surface)", paddingTop: 35, paddingBottom: 40 }}>
      <div style={{ width: "var(--content-w)", marginInline: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}>
          {columns.map((column) => (
            <div key={column.title}>
              <div style={{ color: "#fff", fontSize: 17, marginBottom: 18 }}>{column.title}</div>
              <ul style={{ display: "grid", gap: 12 }}>
                {column.items.map((item) => (
                  <li key={item} style={{ color: "var(--text-dim)", fontSize: 16 }}>
                    {item}
                  </li>
                ))}
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
          {DESKTOP_PROVIDERS.map((provider) => (
            <img
              key={provider.code}
              src={provider.src}
              alt={provider.code}
              style={{
                height: 34,
                objectFit: "contain",
                filter: "grayscale(1) brightness(1.6)",
                opacity: 0.75,
              }}
            />
          ))}
        </div>

        <div
          style={{ marginTop: 30, textAlign: "center", color: "var(--text-dim)", fontSize: 15 }}
        >
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};

const Footer = () => (useIsDesktop() ? <DesktopFooter /> : <MobileFooter />);

export default Footer;
