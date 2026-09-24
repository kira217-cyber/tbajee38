import { useCallback } from "react";
import { useNavigate } from "react-router";

import api from "../../api/axios";

/**
 * গেম খোলা — কার্ডে চাপলে খেলার পেজে (`/play/:gameUId`) নিয়ে যায়।
 *
 * এখন সব গেম **ফ্রি ট্রায়ালে** খোলে (০ ব্যালেন্স, লগইন লাগে না)।
 * স্ট্যাটিক ডেটার গেমের gameUId নেই — সেগুলো খোলে না।
 */
export const useOpenGame = () => {
  const navigate = useNavigate();

  return useCallback(
    (game) => {
      if (!game?.gameUId) return false;
      navigate(`/play/${encodeURIComponent(game.gameUId)}`, {
        state: { name: game.name, from: window.location.pathname + window.location.search },
      });
      return true;
    },
    [navigate],
  );
};

const GUEST_KEY = "tbajee:guest";

/**
 * ট্রায়ালের জন্য ব্রাউজারের নিজের ৭ অক্ষরের পরিচয় — server সামনে `tbt`
 * বসিয়ে Oracle এর ১০ অক্ষরের নাম বানায়। একই ব্রাউজারে সবসময় একই নাম,
 * তাই প্রতিবার নতুন অ্যাকাউন্ট তৈরি হয় না।
 */
export const getGuestId = () => {
  try {
    const saved = localStorage.getItem(GUEST_KEY);
    if (/^[a-z]{7}$/.test(saved || "")) return saved;
  } catch {
    /* প্রাইভেট মোডে localStorage না-ও থাকতে পারে */
  }

  const letters = "abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  const id = [...bytes].map((b) => letters[b % 26]).join("");

  try {
    localStorage.setItem(GUEST_KEY, id);
  } catch {
    /* না রাখতে পারলেও এবারের খেলা চলবে */
  }
  return id;
};

/** server এ ট্রায়াল চালু — `{ launchUrl, game }` অথবা `{ error: code }` */
export const launchTrial = async (gameUId) => {
  try {
    const res = await api.post("/api/play-game/trial", { game_uid: gameUId, guestId: getGuestId() });
    return res.data?.data || { error: "gameLaunchFailed" };
  } catch (error) {
    return { error: error?.response?.data?.code || "gameLaunchFailed" };
  }
};
