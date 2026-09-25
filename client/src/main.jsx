import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import "./index.css";

import { store } from "./app/store";
import { routes } from "./router/router";
import { LanguageProvider } from "./Context/LanguageProvider";
import { captureReferral } from "./utils/referralLink";

// আমন্ত্রণ লিংকে (?referralCode=) ঢুকলে কোডটা নিবন্ধন পর্যন্ত মনে রাখা
captureReferral();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* ভাষা রাউটারের বাইরে — লগইন পেজেও লাগে */}
      <LanguageProvider>
        <RouterProvider router={routes} />
      </LanguageProvider>
    </Provider>
  </StrictMode>,
);
