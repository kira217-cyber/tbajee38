import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Navber from "../components/Navber/Navber";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import BottomNavbar from "../components/BottomNavbar/BottomNavbar";
import DownloadBar from "../components/DownloadBar/DownloadBar";
import AuthModal from "../components/AuthModal/AuthModal";
import MemberModal from "../components/MemberModal/MemberModal";
import NoticeModal from "../components/NoticeModal/NoticeModal";
import HomeEvents from "../components/HomeEvents/HomeEvents";
import { SpriteLoader } from "../components/Icon/Icon";
import AppDownloadModal from "../components/AppDownloadModal/AppDownloadModal";
import { UIContext } from "../Context/uiContext";
import { MEMBER_LINKS } from "../components/Member/sections";

import { fetchGlobalClientData } from "../features/global/globalSlice";
import { selectGlobalLoaded, selectPopups } from "../features/global/globalSelectors";
import { refreshMe } from "../features/auth/authSlice";
import { useLogout } from "../features/auth/useLogout";
import { selectIsLoggedIn } from "../features/auth/authSelectors";
import { fetchGlobalGameData } from "../features/globalGame/globalGameSlice";
import { selectGlobalGameLoaded } from "../features/globalGame/globalGameSelectors";
import { fetchMaintenance } from "../features/maintenance/maintenanceSlice";
import { selectMaintenance } from "../features/maintenance/maintenanceSelectors";
import MaintenanceScreen from "../components/Maintenance/MaintenanceScreen";

import { useIsDesktop } from "../hook/useIsDesktop";
import { openSupport as openSupportLink } from "../data/contact";
import { m } from "../hook/useUnits";
import { referralInUrl } from "../utils/referralLink";
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
  const signOut = useLogout();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { pathname, search } = useLocation();
  // খেলার কেন্দ্র (/games/*) মূল সাইটে আলাদা চেহারার পেজ: ডেস্কটপে
  // সাইডবার নেই আর কলাম ১২৩৬ চওড়া; মোবাইলে নিজের হেডার, সাইটের
  // হেডার-ডাউনলোড বার-ফুটার নেই (নিচের নেভবার থাকে)
  const isGameCenter = pathname.startsWith("/games/");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ডেস্কটপে সাইডবার ডিফল্টে খোলা; হ্যামবার্গারে লুকানো-দেখানো যায়
  // (মূল সাইটে `.switch-icon` চাপলে `.side-wrapper` এর প্রস্থ ০ হয়ে
  //  যায় আর কনটেন্ট কলাম পুরো প্রস্থের মাঝে চলে আসে)
  const [deskSidebarOpen, setDeskSidebarOpen] = useState(true);
  const [authTab, setAuthTab] = useState(null);
  // লগইন/নিবন্ধন শেষে কোথায় যাবে (যেমন লগইন ছাড়া "এখন খেলুন" চাপলে সেই গেম)
  const [authAfter, setAuthAfter] = useState(null);
  const [memberTab, setMemberTab] = useState(null);
  const [noticeClosed, setNoticeClosed] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  // মোবাইলে হেডারের উপরের অ্যাপ-ডাউনলোড বার; ক্রস চাপলে চলে যায়
  const [dlBarOpen, setDlBarOpen] = useState(true);

  const loaded = useSelector(selectGlobalLoaded);
  const contentPlatform = useSelector((state) => state.global.platform);
  const gameLoaded = useSelector(selectGlobalGameLoaded);
  const popups = useSelector(selectPopups);
  const maintenance = useSelector(selectMaintenance);
  const loggedIn = useSelector(selectIsLoggedIn);

  // সাইট খুললে ব্যালেন্স/তথ্য server থেকে নতুন করে — রাখা তথ্য পুরোনো হতে পারে
  useEffect(() => {
    if (loggedIn) dispatch(refreshMe());
    // শুধু প্রথমবার; পরে রিফ্রেশ আইকন বা লগইনেই নতুন তথ্য আসে
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!maintenance.loaded) dispatch(fetchMaintenance());
  }, [dispatch, maintenance.loaded]);

  // ব্যানার/পপআপ ডেস্কটপ-মোবাইলে আলাদা — জানালার মাপ বদলালে আবার আনা
  useEffect(() => {
    const want = isDesktop ? "desktop" : "mobile";
    if (contentPlatform !== want) dispatch(fetchGlobalClientData(want));
  }, [dispatch, isDesktop, contentPlatform]);

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
    (tab = "login", { after } = {}) => {
      if (isDesktop) {
        setAuthAfter(after || null);
        setAuthTab(tab);
        return;
      }
      const page = { register: "/register", forgot: "/forget" }[tab] || "/login";
      // কাজ শেষে `after` এ, নইলে এই পাতাতেই ফেরা
      navigate(page, { state: { from: after || `${pathname}${search}` } });
    },
    [isDesktop, navigate, pathname, search],
  );

  /*
   * আমন্ত্রণ লিংকে (`?referralCode=…`) ঢুকলে সরাসরি নিবন্ধন — ডেস্কটপে
   * মডাল, মোবাইলে `/register` পাতা। কোডটা main.jsx সাইট খোলার সময়েই
   * sessionStorage এ রাখে, ফর্ম সেখান থেকে ভরে নেয়। লগইন করা থাকলে কিছু
   * নয়। URL থেকে কোডটা সরিয়ে দেওয়া হয়, যাতে রিফ্রেশে বারবার না খোলে।
   */
  const referralHandled = useRef(false);
  useEffect(() => {
    if (referralHandled.current) return;
    const code = referralInUrl();
    if (!code) return;
    referralHandled.current = true;
    const params = new URLSearchParams(search);
    params.delete("referralCode");
    params.delete("ref");
    const rest = params.toString();
    if (loggedIn) {
      navigate(`${pathname}${rest ? `?${rest}` : ""}`, { replace: true });
      return;
    }
    setNoticeClosed(true);
    if (isDesktop) {
      navigate(`${pathname}${rest ? `?${rest}` : ""}`, { replace: true });
      setAuthTab("register");
    } else {
      navigate("/register", { replace: true, state: { from: "/" } });
    }
  }, [search, pathname, loggedIn, isDesktop, navigate]);

  // একই জিনিস, দুই চেহারা — ডেস্কটপে মডাল খোলে, মোবাইলে সেই
  // ফিচারের নিজের পেজে যায় (মূল সাইটেও ঠিক তাই)
  const openMember = useCallback(
    (tab = "deposit") => {
      // সদস্যের সব কিছু লগইন চায় — না থাকলে আগে লগইন, তারপর সেই জিনিসটা
      if (!loggedIn) {
        openAuth("login", isDesktop ? {} : { after: MEMBER_LINKS[tab] ?? "/member" });
        return;
      }
      if (isDesktop) {
        setMemberTab(tab);
        return;
      }
      const to = MEMBER_LINKS[tab];
      navigate(to ?? "/member");
    },
    [isDesktop, navigate, loggedIn, openAuth],
  );

  // সাইডবারের "গেম সেন্টার" — মূল সাইটের মতো ডেস্কটপে হোমের সেই ক্যাটাগরি
  // ট্যাব খোলে (পাতা বদলায় না); মোবাইলে খেলার কেন্দ্র
  const goToSection = useCallback(
    (key) => {
      if (isDesktop) navigate(`/?tab=${encodeURIComponent(key)}`);
      else navigate(`/games/${encodeURIComponent(key)}`);
    },
    [navigate, isDesktop],
  );

  // গ্রাহক সেবা — মূল সাইটের টেলিগ্রাম চ্যানেল
  const openSupport = useCallback(() => openSupportLink(), []);

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
  // মেইনটেন্যান্স জানার আগে সাইট দেখালে এক ঝলক কনটেন্ট দেখা দিয়ে
  // তারপর বন্ধ হতো — তাই ওটাও বুট লোডারের অংশ
  const booting = !loaded || !maintenance.loaded;

  useHideBootLoader(!booting);

  // বারটা খোলা থাকলে হেডার ও কনটেন্ট ততটা নিচে নামে
  const barOffset = !isDesktop && dlBarOpen && !isGameCenter ? m(125) : 0;
  const ownHeader = isGameCenter && !isDesktop;

  // রক্ষণাবেক্ষণ চললে কনটেন্ট নয়, শুধু বার্তা
  if (maintenance.isOn) return <MaintenanceScreen setting={maintenance} />;

  const sidebarShown = isDesktop && deskSidebarOpen && !isGameCenter;

  return (
    <UIContext.Provider value={ui}>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <SpriteLoader />

        {!isDesktop && dlBarOpen && !isGameCenter && (
          <DownloadBar
            onClose={() => setDlBarOpen(false)}
            onDownload={() => setDownloadOpen(true)}
          />
        )}

        {!ownHeader && (
        <Navber
          topOffset={barOffset}
          onToggleSidebar={toggleSidebar}
          onAuth={openAuth}
          onMember={openMember}
          onSupport={openSupport}
          onLogout={() => signOut()}
        />
        )}
        <Sidebar
          topOffset={barOffset}
          open={isDesktop ? sidebarShown : sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onMember={openMember}
          onSection={goToSection}
          onDownload={() => setDownloadOpen(true)}
          onSupport={openSupport}
        />

        <div
          style={{
            paddingTop: ownHeader
              ? 0
              : barOffset
                ? `calc(var(--header-h) + ${barOffset})`
                : "var(--header-h)",
            marginInlineStart: sidebarShown ? "var(--sidebar-w)" : 0,
            transition: "margin-inline-start .25s",
          }}
        >
          {isGameCenter ? (
            <main>
              <Outlet />
            </main>
          ) : (
            <main className="page-center">
              <Outlet />
            </main>
          )}
          {!ownHeader && <Footer />}
        </div>

        <BottomNavbar />

        {authTab && (
          <AuthModal
            tab={authTab}
            onClose={() => setAuthTab(null)}
            onDone={() => {
              setAuthTab(null);
              if (authAfter) navigate(authAfter);
            }}
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

        {/* ভাসমান ইভেন্ট আইকন (admin এর "Home Events") — খেলার পাতায় নয় */}
        {!isGameCenter && <HomeEvents />}

      </div>
    </UIContext.Provider>
  );
};

export default RootLayout;
