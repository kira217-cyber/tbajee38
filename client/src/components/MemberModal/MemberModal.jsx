import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Icon from "../Icon/Icon";
import { MODAL_TABS, SECTION_BY_KEY } from "../Member/sections";
import { useLanguage } from "../../Context/LanguageProvider";
import { fetchInboxUnread, selectInboxUnread } from "../../features/inbox/inboxSlice";

/**
 * লগইনের পরের "ব্যক্তিগত কেন্দ্র" মডাল (ডেস্কটপ)।
 *
 * এটা শুধু **খোলস** — ভিতরের কনটেন্ট `components/Member/*Section.jsx`
 * থেকে আসে, যেগুলো মোবাইলের পেজেও একই কম্পোনেন্ট। মেনুর তালিকাও
 * `Member/sections.jsx` থেকেই, যাতে মোবাইল ও ডেস্কটপ কখনো আলাদা হয়ে
 * না যায়।
 *
 * মূল সাইট থেকে মাপা:
 *   মডাল ১২৯০ × ৬২০ — বাঁয়ে মেনু ১৮০, ডানে প্যানেল ১১১০
 *   মেনুর প্রতিটা আইটেম ১৮০ × ৫০ — আইকন ২৫ × ২৫ (x ১০),
 *     লেখা fs ১৫ (x ৩৮); সক্রিয়টার bg লালচে #E8474C
 *   ডান পাশ radius `0 10px 10px 0` — **হালকা থিম**, বাকি সাইটের উল্টো
 *   ক্লোজ বোতাম ৩১ × ৩১ বৃত্ত bg #2B3248, উপরে-ডানে (১২৪৯, ১০)
 */
const MemberModal = ({ tab = "deposit", onClose, onTab }) => {
  const { t } = useLanguage();
  const section = SECTION_BY_KEY[tab] ?? SECTION_BY_KEY.deposit;
  const dispatch = useDispatch();
  const inboxUnread = useSelector(selectInboxUnread);

  // মডাল খুললেই ইনবক্সের না-পড়া সংখ্যা — মেনুর ব্যাজের জন্য
  useEffect(() => {
    dispatch(fetchInboxUnread());
  }, [dispatch]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgb(0 0 0 / 0.6)", zIndex: 65 }}
      onClick={onClose}
    >
      <div
        className="relative flex"
        style={{ width: 1290, height: 620, borderRadius: 10 }}
        onClick={(event) => event.stopPropagation()}
      >
        {/* বাঁয়ে মেনু */}
        <div
          className="hide-scrollbar"
          style={{
            width: 180,
            height: 620,
            background: "#2b3248",
            borderRadius: "10px 0 0 10px",
            overflowY: "auto",
          }}
        >
          <div
            className="text-center"
            style={{ padding: "22px 10px", color: "#fff", fontSize: 20, fontWeight: 600 }}
          >
            {t.member.title}
          </div>

          {MODAL_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onTab?.(item.key)}
              className="flex w-full cursor-pointer items-center text-left"
              style={{
                width: 180,
                height: 50,
                padding: "0 10px",
                gap: 13,
                color: "#fff",
                fontSize: 15,
                background: item.key === tab ? "#e8474c" : "transparent",
              }}
            >
              <Icon name={item.icon} size={25} />
              <span>{t.member[item.key] ?? item.title(t)}</span>
              {item.key === "inbox" && inboxUnread > 0 && (
                <span className="grid place-items-center" style={{ minWidth: 18, height: 18, borderRadius: 9, padding: "0 5px", background: "#fe0404", fontSize: 11, marginLeft: "auto" }}>
                  {inboxUnread > 99 ? "99+" : inboxUnread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ডান পাশ — মোবাইলের পেজেও ঠিক এই কম্পোনেন্টটাই চলে */}
        <div style={{ borderRadius: "0 10px 10px 0", overflow: "hidden" }}>
          {section.render()}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          className="tb-hover-fade absolute flex cursor-pointer items-center justify-center"
          style={{
            top: 10,
            right: 10,
            width: 31,
            height: 31,
            borderRadius: "50%",
            background: "#2b3248",
            color: "#fff",
          }}
        >
          <Icon name="popup-close" size={16} />
        </button>
      </div>
    </div>
  );
};

export default MemberModal;
