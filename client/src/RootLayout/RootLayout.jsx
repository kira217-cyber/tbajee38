import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Navber from "../components/Navber/Navber";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar";
import DownloadBar from "../components/DownloadBar/DownloadBar";
import AuthModal from "../components/AuthModal/AuthModal";
import MemberModal from "../components/MemberModal/MemberModal";
import NoticeModal from "../components/NoticeModal/NoticeModal";
import { SpriteLoader } from "../components/Icon/Icon";
import AppDownloadModal from "../components/AppDownloadModal/AppDownloadModal";
import { UIContext } from "../Context/uiContext";
import { MEMBER_LINKS } from "../components/Member/sections";

import { fetchGlobalClientData } from "../features/global/globalSlice";
import { selectGlobalLoaded, selectPopups } from "../features/global/globalSelectors";
import { logout } from "../features/auth/authSlice";
import { fetchGlobalGameData } from "../features/globalGame/globalGameSlice";
import { selectGlobalGameLoaded } from "../features/globalGame/globalGameSelectors";

import { useIsDesktop } from "../hook/useIsDesktop";
import { m } from "../hook/useUnits";
import { useHideBootLoader } from "../hook/useHideBootLoader";

/**
 * পুরো সাইটের কাঠামো — ফিক্সড হেডার, বাঁয়ে সাইডবার (মোবাইলে ড্রয়ার),
 * মাঝখানে ১০৮৫px কনটেন্ট কলাম, নিচে ফুটার ও মোবাইলের বটম নেভ।
 *
 * ওভারলে গুলো মূল সাইটের মতোই ভাগ করা:
 *   - অথ: ডেস্কটপে মডাল, মোবাইলে আলাদা পেজ (`/login`, `/register`)
 *   - মেম্বার সেন্টার: ডেস্কটপে মডাল (URL বদলায় না)
 *   - নোটিশ: সাইট খোলার পর একবার
 */
const RootLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ডেস্কটপে সাইডবার ডিফল্টে খোলা; হ্যামবার্গারে লুকানো-দেখানো যায়
  // (মূল সাইটে `.switch-icon` চাপলে `.side-wrapper` এর প্রস্থ ০ হয়ে
  //  যায় আর কনটেন্ট কলাম পুরো প্রস্থের মাঝে চলে আসে)
  const [deskSidebarOpen, setDeskSidebarOpen] = useState(true);
  const [authTab, setAuthTab] = useState(null);
  const [memberTab, setMemberTab] = useState(null);
  const [noticeClosed, setNoticeClosed] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  // মোবাইলে হেডারের উপরের অ্যাপ-ডাউনলোড বার; ক্রস চাপলে চলে যায়
  const [dlBarOpen, setDlBarOpen] = useState(true);

  const loaded = useSelector(selectGlobalLoaded);
  const gameLoaded = useSelector(selectGlobalGameLoaded);
  const popups = useSelector(selectPopups);

  useEffect(() => {
    if (!loaded) dispatch(fetchGlobalClientData());
  }, [dispatch, loaded]);

  useEffect(() => {
    if (!gameLoaded) dispatch(fetchGlobalGameData());
  }, [dispatch, gameLoaded]);

  useEffect(() => {
    if (isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  const toggleSidebar = useCallback(() => {
    if (isDesktop) setDeskSidebarOpen((v) => !v);
    else setSidebarOpen((v) => !v);
  }, [isDesktop]);

  // ডেস্কটপে মডাল, মোবাইলে পেজ — মূল সাইট ঠিক এভাবেই ভাগ করে
  const openAuth = useCallback(
    (tab = "login") => {
      if (isDesktop) setAuthTab(tab);
      else navigate(tab === "register" ? "/register" : "/login");
    },
    [isDesktop, navigate],
  );

  // একই জিনিস, দুই চেহারা — ডেস্কটপে মডাল খোলে, মোবাইলে সেই
  // ফিচারের নিজের পেজে যায় (মূল সাইটেও ঠিক তাই)
  const openMember = useCallback(
    (tab = "deposit") => {
      if (isDesktop) {
        setMemberTab(tab);
        return;
      }
      const to = MEMBER_LINKS[tab];
      navigate(to ?? "/member");
    },
    [isDesktop, navigate],
  );

  // সাইডবারের "গেম সেন্টার" এর ভিতরের আইটেম — হোমের সেই সেকশনে নিয়ে যায়
  const goToSection = useCallback(
    (key) => {
      navigate("/");
      // রাউট বদলের পর DOM বসতে এক টিক সময় দিই
      requestAnimationFrame(() => {
        const el = document.getElementById(`section-${key}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [navigate],
  );

  // গ্রাহক সেবা — মূল সাইটের টেলিগ্রাম চ্যানেল
  const openSupport = useCallback(() => {
    window.open("https://t.me/+NpaAP08VuVtiODc1", "_blank", "noopener");
  }, []);

  const ui = useMemo(
    () => ({
      openAuth,
      closeAuth: () => setAuthTab(null),
      authTab,
      openMember,
      closeMember: () => setMemberTab(null),
      memberTab,
    }),
    [openAuth, authTab, openMember, memberTab],
  );

  const showNotice = !noticeClosed && popups.length > 0;

  // মূল সাইটের মতো — সাইটের মূল ডেটা না আসা পর্যন্ত পুরো পর্দায় স্পিনার
  // মূল সাইটের মতো: সাইটের মূল কনটেন্ট (ব্যানার, নোটিশ) এলেই শেল দেখা
  // যায়; গেমের সেকশনগুলো তখন নিজের নিজের স্পিনার দেখায়।
  const booting = !loaded;

  useHideBootLoader(!booting);

  // বারটা খোলা থাকলে হেডার ও কনটেন্ট ততটা নিচে নামে
  const barOffset = !isDesktop && dlBarOpen ? m(125) : 0;

  return (
    <UIContext.Provider value={ui}>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <SpriteLoader />

        {!isDesktop && dlBarOpen && (
          <DownloadBar
            onClose={() => setDlBarOpen(false)}
            onDownload={() => setDownloadOpen(true)}
          />
        )}

        <Navber
          topOffset={barOffset}
          onToggleSidebar={toggleSidebar}
          onAuth={openAuth}
          onMember={openMember}
          onSupport={openSupport}
          onLogout={() => {
            dispatch(logout());
            navigate("/");
          }}
        />
        <Sidebar
          topOffset={barOffset}
          open={isDesktop ? deskSidebarOpen : sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onMember={openMember}
          onSection={goToSection}
          onDownload={() => setDownloadOpen(true)}
          onSupport={openSupport}
        />

        <div
          style={{
            paddingTop: barOffset
              ? `calc(var(--header-h) + ${barOffset})`
              : "var(--header-h)",
            marginInlineStart: isDesktop && deskSidebarOpen ? "var(--sidebar-w)" : 0,
            transition: "margin-inline-start .25s",
          }}
        >
          <main className="page-center">
            <Outlet />
          </main>
          <Footer />
        </div>

        <BottomNavbar />

        {authTab && (
          <AuthModal
            tab={authTab}
            onClose={() => setAuthTab(null)}
            onSwitch={(tab) => setAuthTab(tab)}
          />
        )}

        {memberTab && isDesktop && (
          <MemberModal
            tab={memberTab}
            onClose={() => setMemberTab(null)}
            onTab={(tab) => setMemberTab(tab)}
          />
        )}

        {showNotice && (
          <NoticeModal items={popups} onClose={() => setNoticeClosed(true)} />
        )}

        {downloadOpen && <AppDownloadModal onClose={() => setDownloadOpen(false)} />}

      </div>
    </UIContext.Provider>
  );
};

export default RootLayout;
