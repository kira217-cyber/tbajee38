import React, { useState } from "react";
import { useSelector } from "react-redux";

import Slider from "../../components/Slider/Slider";
import Notice from "../../components/Notice/Notice";
import Categories from "../../components/Categories/Categories";
import GameSection from "../../components/GameSection/GameSection";

import { selectBanners, selectNotices } from "../../features/global/globalSelectors";
import {
  selectGlobalGameLoading,
  selectSections,
  selectVendors,
  selectHotGames,
  selectGamesByType,
} from "../../features/globalGame/globalGameSelectors";
import { useIsDesktop } from "../../hook/useIsDesktop";
import { useLanguage } from "../../Context/LanguageProvider";
import { m } from "../../hook/useUnits";

/**
 * হোমপেজ।
 *
 * মূল সাইটের ভার্টিক্যাল ছন্দ (ডেস্কটপে মাপা):
 *   কলামের padding-top ২৫.৭
 *   ব্যানার y=৮৮.৭ h=৩৭০.৭ → নোটিশ বার y=৪৭৯.৪ h=৫০ (মাঝে gap ২০)
 *   ব্যানার ব্লকের নিচে margin-bottom ২২
 *   ক্যাটাগরি ট্যাব y=৫৫১.৪ h=১১৬.৬
 *   প্রথম সেকশন টাইটেল y=৭০২
 */
const Home = () => {
  const isDesktop = useIsDesktop();
  const { t } = useLanguage();
  const [tab, setTab] = useState("HOME");

  const banners = useSelector(selectBanners);
  const notices = useSelector(selectNotices);
  const sections = useSelector(selectSections);
  const vendors = useSelector(selectVendors);
  const hotGames = useSelector(selectHotGames);
  const gamesByType = useSelector(selectGamesByType);
  const gamesLoading = useSelector(selectGlobalGameLoading);

  const gamesFor = (section) =>
    section.key === "hot" ? hotGames : gamesByType[section.key] || [];

  return (
    <>
      {/* ── ব্যানার + নোটিশ ── */}
      <div
        className="flex flex-col"
        style={{
          gap: isDesktop ? 20 : 0,
          marginBottom: isDesktop ? "var(--banner-mb)" : 0,
        }}
      >
        <Slider banners={banners} />
        <Notice notices={notices} />
      </div>

      {/* ── ক্যাটাগরি ট্যাব ── */}
      <Categories active={tab} onChange={setTab} />

      {/* ── গেম সেকশন ── */}
      {sections.map((section) => (
        <GameSection
          key={section.key}
          // সেকশনের নাম ডেটায় বাংলায় বসানো; ভাষা বদলালে যেন বদলায়,
          // তাই locale থেকে নিয়ে overwrite করি
          section={{ ...section, title: t.sections[section.key] ?? section.title }}
          vendors={section.lane ? vendors[section.lane] || [] : []}
          games={gamesFor(section)}
          loading={gamesLoading}
        />
      ))}

      {/* ফুটারের ঠিক উপরে স্পোর্টস বেটিংয়ের ব্যানার —
          মূল সাইটে `.sports-container` ১০৮৫ × ৪৪২.২, ছবি ১০৮৩ চওড়া */}
      <div
        className="cursor-pointer"
        style={{
          width: "100%",
          marginTop: isDesktop ? 0 : m(10),
          paddingInline: isDesktop ? 0 : m(24),
        }}
      >
        <img
          src="/assets/site/sports-entrance.webp"
          alt="sports-entrance"
          loading="lazy"
          style={{
            width: "100%",
            display: "block",
            borderRadius: isDesktop ? 10 : m(16),
          }}
        />
      </div>
    </>
  );
};

export default Home;
