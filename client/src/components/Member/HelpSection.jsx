import React from "react";
import { useLanguage } from "../../Context/LanguageProvider";
import MemberShell, { EmptyState } from "./MemberShell";

/**
 * সাহায্য কেন্দ্র — মূল সাইটে এটা **শুধু মোবাইলে** আছে,
 * ডেস্কটপ মডালে এর ট্যাব নেই।
 *
 * "সাহায্য কেন্দ্র" — মূল সাইটে এটা আলাদা হেল্প কনটেন্ট দেখায়, যেটা
 * `/wps/system/helpCenter` API থেকে আসে। আমাদের সার্ভার না থাকায়
 * আপাতত খালি অবস্থা; admin এলে এখানেই কনটেন্ট বসবে।
 */
const HelpSection = () => {
  const { t } = useLanguage();

  return (
    <MemberShell title={t.memberPage.pages.help.title}>
      <EmptyState />
    </MemberShell>
  );
};

export default HelpSection;
