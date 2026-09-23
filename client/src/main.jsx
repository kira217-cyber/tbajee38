import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";

import "./index.css";

import { store } from "./app/store";
import { routes } from "./router/router";
import { LanguageProvider } from "./Context/LanguageProvider";

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
