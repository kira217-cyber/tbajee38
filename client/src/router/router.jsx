import { createBrowserRouter } from "react-router";

import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import Promotions from "../pages/Promotions/Promotions";
import AuthPage from "../pages/Login/AuthPage";
import MemberCenter from "../pages/Member/MemberCenter";
import MemberRoute from "../pages/Member/MemberRoute";
import { MOBILE_ROUTES } from "../components/Member/sections";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

/**
 * মূল সাইটের রাউট ভাগ:
 *   `/` ও `/promotions` — হেডার/সাইডবার/ফুটার সহ (RootLayout)
 *   `/login`, `/register` — মোবাইলের আলাদা পেজ, হেডার-সাইডবার কিছুই নেই
 *   `/member` — মোবাইলের সদস্য কেন্দ্র
 *   `/member/*` — প্রতিটা ফিচারের নিজের পেজ; তালিকাটা
 *     `components/Member/sections.jsx` এ, ডেস্কটপ মডালও সেটাই পড়ে,
 *     তাই দুই দিকে আলাদা হয়ে যাওয়ার সুযোগ নেই
 */
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "promotions", element: <Promotions /> },
    ],
  },
  { path: "/login", element: <AuthPage mode="login" />, errorElement: <NotFoundPage /> },
  { path: "/register", element: <AuthPage mode="register" />, errorElement: <NotFoundPage /> },
  { path: "/member", element: <MemberCenter />, errorElement: <NotFoundPage /> },
  ...MOBILE_ROUTES.map((section) => ({
    path: `/member/${section.path}`,
    element: <MemberRoute sectionKey={section.key} />,
    errorElement: <NotFoundPage />,
  })),
]);

export default routes;
