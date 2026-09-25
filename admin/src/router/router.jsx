import { createBrowserRouter } from "react-router";

import RootLayout from "../RootLayout/RootLayout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Admins from "../pages/Admins/Admins";
import GameApiKey from "../pages/GameApiKey/GameApiKey";
import GameLaunchKey from "../pages/GameLaunchKey/GameLaunchKey";
import Maintenance from "../pages/Maintenance/Maintenance";
import OtpSetting from "../pages/OtpSetting/OtpSetting";
import Users from "../pages/Users/Users";
import Affiliates from "../pages/Users/Affiliates";
import UserDetails from "../pages/Users/UserDetails";
import GameHistory from "../pages/GameHistory/GameHistory";
import DepositMethods from "../pages/DepositMethods/DepositMethods";
import DepositField from "../pages/DepositField/DepositField";
import DepositBonusTurnover from "../pages/DepositBonusTurnover/DepositBonusTurnover";
import ManualDeposit from "../pages/ManualDeposit/ManualDeposit";
import DepositRequests from "../pages/DepositRequests/DepositRequests";
import WithdrawMethods from "../pages/WithdrawMethods/WithdrawMethods";
import WithdrawRequests from "../pages/WithdrawRequests/WithdrawRequests";
import TurnoverHistory from "../pages/TurnoverHistory/TurnoverHistory";
import Placeholder from "../pages/Placeholder/Placeholder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import { navItems } from "../data/navigation";

/**
 * রুট টেবিল।
 *
 * সাইডবারের তালিকাটাই (`data/navigation.js`) রুটের **একমাত্র উৎস** —
 * প্রতিটা নেভ আইটেমের জন্য একটা রুট নিজে থেকেই তৈরি হয়, তাই মেনুতে
 * কিছু যোগ করলে রুট লিখতে ভুলে যাওয়ার সুযোগ নেই।
 *
 * যেসব পেজের API তৈরি — সেগুলো `REAL_PAGES` এ। বাকি সব
 * `<Placeholder />` দেখায় ("No API Included")। API হলে শুধু এখানে
 * এন্ট্রি যোগ করলেই হবে।
 */
const REAL_PAGES = {
  "/": <Dashboard />,
  "/admins": <Admins />,
  "/users": <Users />,
  "/affiliates": <Affiliates />,
  "/game-api-key": <GameApiKey />,
  "/game-history": <GameHistory />,
  "/deposit-methods": <DepositMethods />,
  "/deposit-field": <DepositField />,
  "/deposit-bonus-turnover": <DepositBonusTurnover />,
  "/manual-deposit": <ManualDeposit />,
  "/deposit-requests": <DepositRequests />,
  "/withdraw-methods": <WithdrawMethods />,
  "/withdraw-requests": <WithdrawRequests />,
  "/turnover-history": <TurnoverHistory />,
  "/game-launch-key": <GameLaunchKey />,
  "/maintenance": <Maintenance />,
  "/otp-setting": <OtpSetting />,
};

/** নেস্টেড তালিকাটা সমতল করে — গ্রুপের নামও সাথে রাখি */
const flatten = (items, group = "") =>
  items.flatMap((item) =>
    item.children?.length
      ? flatten(item.children, item.label)
      : [{ ...item, group }],
  );

const pages = flatten(navItems);

/** রুট এলিমেন্ট — দরকার হলে গার্ড দিয়ে মোড়া */
const elementFor = (item) => {
  const page = REAL_PAGES[item.path] || (
    <Placeholder title={item.label} group={item.group} />
  );

  if (item.motherOnly) {
    return <PrivateRoute motherOnly>{page}</PrivateRoute>;
  }

  if (item.perm) {
    return <PrivateRoute perm={item.perm}>{page}</PrivateRoute>;
  }

  return page;
};

export const routes = createBrowserRouter(
  [
    { path: "/login", element: <Login />, errorElement: <NotFoundPage /> },

    {
      path: "/",
      element: (
        <PrivateRoute>
          <RootLayout />
        </PrivateRoute>
      ),
      errorElement: <NotFoundPage />,
      children: [
        { index: true, element: elementFor(pages.find((p) => p.path === "/")) },

        // নিজের প্রোফাইল সাইডবারে নেই — হেডারের আইকন থেকে খোলে
        { path: "profile", element: <Profile /> },

        // একজনের বিস্তারিত — সাইডবারে নেই, তালিকার সারিতে চাপলে খোলে।
        // তালিকার পেজের একই পারমিশন (server ও একই নিয়মে আটকায়)
        {
          path: "users/:id",
          element: (
            <PrivateRoute perm="users">
              <UserDetails kind="users" />
            </PrivateRoute>
          ),
        },
        {
          path: "affiliates/:id",
          element: (
            <PrivateRoute perm="affiliates">
              <UserDetails kind="affiliates" />
            </PrivateRoute>
          ),
        },

        ...pages
          .filter((item) => item.path && item.path !== "/")
          .map((item) => ({
            path: item.path.replace(/^\//, ""),
            element: elementFor(item),
          })),

        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);

export default routes;
