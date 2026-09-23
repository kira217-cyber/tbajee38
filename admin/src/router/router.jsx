import { createBrowserRouter } from "react-router";

import RootLayout from "../RootLayout/RootLayout";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Admins from "../pages/Admins/Admins";
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
