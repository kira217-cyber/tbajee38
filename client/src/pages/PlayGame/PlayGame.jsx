import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { X } from "lucide-react";

import { Spinner } from "../../components/Loader/Loader";
import { useLanguage } from "../../Context/LanguageProvider";
import { useHideBootLoader } from "../../hook/useHideBootLoader";
import { launchTrial } from "../../features/game/useOpenGame";

/**
 * খেলার পেজ — `/play/:gameUId`, পুরো পর্দায় গেম (iframe)।
 *
 * এখন সবসময় **ফ্রি ট্রায়াল**: server ০ ব্যালেন্সে গেমের লিংক আনে, তাই
 * লগইন লাগে না আর টাকার কোনো লেনদেন নেই। উপরে ছোট বার — বাঁয়ে বন্ধ,
 * মাঝে গেমের নাম, ডানে "ফ্রি ট্রায়াল" চিহ্ন, যাতে খেলোয়াড় ভুল না বোঝেন।
 */
const BAR_H = 44;

const PlayGame = () => {
  const { gameUId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [state, setState] = useState({ status: "loading", url: "", name: location.state?.name || "" });

  useHideBootLoader(true);

  const start = useCallback(async () => {
    setState((prev) => ({ ...prev, status: "loading" }));
    const result = await launchTrial(gameUId);

    if (result.launchUrl) {
      const name = lang === "en" ? result.game?.nameEn : result.game?.name;
      setState({ status: "ready", url: result.launchUrl, name: name || location.state?.name || "" });
    } else {
      setState((prev) => ({ ...prev, status: result.error === "gameNotReady" ? "notReady" : "failed" }));
    }
  }, [gameUId, location.state, lang]);

  useEffect(() => {
    start();
  }, [start]);

  const close = () => {
    if (location.state?.from) navigate(location.state.from);
    else if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#000", zIndex: 1000, fontSize: 14 }}>
      <div
        className="flex shrink-0 items-center"
        style={{ height: BAR_H, padding: "0 8px", gap: 10, background: "#0F0238", color: "#fff" }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.games.close}
          className="flex shrink-0 cursor-pointer items-center justify-center"
          style={{ width: 32, height: 32, borderRadius: "50%", background: "rgb(255 255 255 / 0.1)" }}
        >
          <X size={18} />
        </button>

        <span className="min-w-0 flex-1 truncate" style={{ fontSize: 15, fontWeight: 600 }}>
          {state.name}
        </span>

        <span
          className="shrink-0"
          title={t.games.trialHint}
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            background: "#1678ff",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {t.games.trialBadge}
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        {state.status === "ready" && (
          <iframe
            key={state.url}
            src={state.url}
            title={state.name || "game"}
            allow="fullscreen; autoplay; encrypted-media"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        )}

        {state.status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ gap: 16 }}>
            <Spinner />
            <span style={{ color: "rgb(255 255 255 / 0.7)", fontSize: 14 }}>{t.games.starting}</span>
          </div>
        )}

        {(state.status === "failed" || state.status === "notReady") && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ padding: 20 }}>
            <div
              className="flex flex-col items-center text-center"
              style={{ maxWidth: 340, padding: "28px 24px", borderRadius: 16, background: "#241A3E", gap: 14 }}
            >
              <span style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{t.games.failed}</span>
              <span style={{ color: "rgb(255 255 255 / 0.65)", fontSize: 14 }}>
                {state.status === "notReady" ? t.games.notReady : t.games.trialHint}
              </span>
              <div className="flex" style={{ gap: 10, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={start}
                  className="cursor-pointer"
                  style={{ padding: "9px 18px", borderRadius: 8, background: "#BC43F4", color: "#fff", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}
                >
                  {t.games.retry}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="cursor-pointer"
                  style={{ padding: "9px 18px", borderRadius: 8, background: "rgb(255 255 255 / 0.1)", color: "#fff", fontSize: 14, whiteSpace: "nowrap" }}
                >
                  {t.games.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;
