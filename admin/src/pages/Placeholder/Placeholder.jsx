import React from "react";
import { PlugZap } from "lucide-react";

/**
 * যেসব পেজের API এখনো নেই তাদের জন্য।
 *
 * সাইডবারের প্রতিটা আইটেমেরই রুট আছে, যাতে পুরো নেভিগেশন এখনই ঘুরে
 * দেখা যায়। যেগুলোর ব্যাকএন্ড এখনো বানানো হয়নি সেগুলো এই পেজটাই
 * দেখায় — নাম আর "No API Included" বার্তা।
 *
 * API তৈরি হলে `router/router.jsx` এর `REAL_PAGES` এ ওই পাথটা যোগ
 * করলেই আসল পেজ বসে যাবে, এখানে কিছু বদলাতে হবে না।
 */
const Placeholder = ({ title, group }) => (
  <div>
    <div className="mb-6">
      {group && (
        <p className="text-[12px] font-semibold tracking-widest text-[var(--text-disabled)] uppercase">
          {group}
        </p>
      )}
      <h1 className="ad-title mt-1 text-[24px] sm:text-[28px]">{title}</h1>
    </div>

    <div className="ad-card flex flex-col items-center justify-center py-16 text-center">
      <span
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "var(--accent-soft)", color: "var(--gold)" }}
      >
        <PlugZap size={28} />
      </span>

      <p className="text-[18px] font-bold text-[var(--neutral100)]">No API Included</p>

      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[var(--text-muted)]">
        This page is ready in the panel, but its backend endpoints have not been
        built yet. Once the API is added it will replace this screen.
      </p>
    </div>
  </div>
);

export default Placeholder;
