/**
 * TBAJEE38 — সাইটের সব লেখা, বাংলা ও ইংরেজি।
 *
 * দুই ভাষার শব্দই tbajee38.com থেকে সরাসরি তোলা — সাইটের সাইডবারে
 * ভাষা বদলে দুবার DOM এর লেখা তুলে মিলিয়ে নেওয়া, অনুবাদ করে নয়।
 * তাই "Withdrawal", "Promotion", "Lobby", "Blockchain" এর মতো শব্দগুলো
 * মূল সাইটে যা আছে ঠিক তাই।
 *
 * server আসার পর admin থেকে এগুলো বদলানো যাবে, তখন এই ফাইলটা fallback।
 */

import { memberPagesLocale } from "./memberLocale";
import { memberDeskLocale } from "./memberDeskLocale";

export const locale = {
  bn: {
    brand: "TBAJEE",
    brandDomain: "tbajee.vip",

    headerMenu: { games: "গেমস", promotions: "প্রমোশন", earn: "অর্থ উপার্জন" },
    login: "লগইন",
    register: "নিবন্ধন করুন",
    deposit: "ডিপোজিট",
    withdraw: "উত্তোলন",

    sidebar: {
      deposit: "ডিপোজিট",
      withdraw: "উত্তোলন",
      promo: "অফার",
      reward: "পুরস্কার কেন্দ্র",
      rebate: "রিবেট",
      gameCenter: "গেম সেন্টার",
      memberCenter: "সদস্য কেন্দ্র",
      language: "বাংলা",
      appDownload: "অ্যাপ ডাউনলোড",
      support: "গ্রাহক সেবা",
      signOut: "সাইন আউট",
    },

    gameCenter: {
      RNG: "স্লট",
      FISH: "ফিশিং",
      LIVE: "লাইভ",
      PVP: "পোকার",
      SPORTS: "স্পোর্টস",
    },

    memberCenter: {
      vip: "ভিআইপি বোনাস",
      betRecord: "বেটিং রেকর্ড",
      accountRecord: "অ্যাকাউন্ট রেকর্ড",
      myAccount: "আমার অ্যাকাউন্ট",
      deposit: "ডিপোজিট",
      profitLoss: "লাভ ও ক্ষতি",
      inbox: "অভ্যন্তরীণ বার্তা",
    },

    tabs: {
      HOME: "হোম",
      FAV: "আমার প্রিয়",
      RNG: "স্লট",
      LIVE: "লাইভ",
      PVP: "পোকার",
      SPORTS: "স্পোর্টস",
      MXWIN: "ক্র্যাশ গেমস",
    },

    // মোবাইলের ক্যাটাগরি সারি ডেস্কটপের চেয়ে আলাদা — ৯টা, আর
    // HOME এখানে "জনপ্রিয়" (ডেস্কটপে "হোম")। মূল সাইট থেকে তোলা।
    // ডিপোজিট ও উত্তোলন — ডেস্কটপে মডালের ট্যাব, মোবাইলে
    // `/m/voucherCenter` ও `/m/withdraw` পেজ। লেখাগুলো মূল সাইট থেকে।
    money: {
      depositTitle: "জমা দিন",
      withdrawTitle: "উত্তোলন",
      modeTitle: "আমানতের মোড",
      channelTitle: "পেমেন্ট চ্যানেল",
      amountTitle: "জমা পরিমাণ",
      trxWarning:
        "আপনাকে trxid পূরণ করতে হবে। আপনি যদি রিচার্জটি পূরণ না করেন তবে রিচার্জটি জমা হবে না",
      next: "পরবর্তী",
      wallet: "E wallet",
      bound: "আবদ্ধ E wallet",
      emptyWallet: "খালি ই-ওয়ালেট",
      withdrawTime: "উত্তোলন সময় ：24 ঘন্টা",
      dailyTimes: "দৈনিক উত্তোলন 99 (বার), অবশিষ্ট উত্তোলন 99 (বার)",
      mainWallet: "প্রধান ওয়ালেট",
      available: "উপলব্ধ পরিমাণ",
      refreshBalance: "আপনার ব্যালেন্স রিফ্রেশ করুন",
      withdrawAmount: "উত্তোলন পরিমান :",
      amount: "পরিমাণ",
      txPassword: "লেনদেন পাসওয়ার্ড",
      submit: "জমা দিন",
    },
    tabsMobile: {
      HOME: "জনপ্রিয়",
      FAV: "আমার প্রিয়",
      JL: "JILI",
      RNG: "স্লট",
      FISH: "ফিশিং",
      LIVE: "লাইভ",
      MXWIN: "ক্র্যাশ গেমস",
      PVP: "পোকার",
      SPORTS: "স্পোর্টস",
    },

    seeAll: "সব দেখুন",
    sections: {
      hot: "গরম খেলা",
      RNG: "স্লট",
      FISH: "ফিশিং",
      LIVE: "লাইভ",
      PVP: "পোকার",
      CRASH: "ক্র্যাশ গেমস",
    },

    bottomNav: {
      home: "হোম",
      promotions: "প্রমোশন",
      share: "শেয়ার",
      reward: "পুরস্কার কেন্দ্র",
      member: "সদস্য",
    },

    more: "More",
    noData: "কোন ডেটা নেই",
    playNow: "এখন খেলুন",
    freeTrial: "ফ্রি ট্রায়াল",

    auth: {
      loginTab: "লগইন",
      registerTab: "নিবন্ধন করুন",
      username: "ব্যবহারকারী নাম",
      password: "পাসওয়ার্ড",
      confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
      captcha: "ক্যাপচা",
      captchaMobile: "একটি ক্যাপচা প্রবেশ করুন",
      remember: "মনে রাখুন",
      forgot: "পাসওয়ার্ড ভুলে গিয়েছেন",
      forgotMobile: "পাসওয়ার্ড ভুলে গেছেন ?",
      terms:
        "I confirm that I am 18 years old and I have read the Terms and Services",
      noAccount: "এখনো কোন অ্যাকাউন্ট নেই?",
      noAccountMobile: "এখনও কোনও একাউন্ট নেই?",
      registerNow: "এখন নিবন্ধন করুন",
      registerShort: "নিবন্ধন",
      haveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে??",
      loginNow: "লগইন",
      reset: "রিসেট",
    },

    noticeTitle: "Notice",

    promo: { all: "সমস্ত", more: "আরও" },

    download: {
      desc: "আমরা নতুনত্ব ফ্রি বেট এবং বোনাস আপডেটের জন্য এটিকে আপনার হোম স্ক্রিনে যুক্ত করতে চাই।",
      continueBrowser: "ব্রাউজার ব্যবহার চালিয়ে যান",
      tag: "অধিক সুবিধা",
      webApp: "ওয়েব-অ্যাপ",
    },

    memberPage: {
      sectionTitle: "সদস্য সেন্টার",
      nickname: "ডাকনাম",
      signIn: "সাইন ইন",
      joined: "যোগদান করেছেন",
      depositBtn: "জমা দিন",
      withdrawBtn: "উত্তোলন",
      cardBtn: "আমার কার্ড",
      items: {
        reward: "পুরস্কার সেন্টার",
        betRecord: "বেটিং রেকর্ড",
        profitLoss: "লাভ এবং লস",
        depositRecord: "জমা রেকর্ড",
        withdrawRecord: "উত্তোলন রেকর্ড",
        accountRecord: "অ্যাকাউন্ট রেকর্ড",
        myAccount: "আমার অ্যাকাউন্ট",
        security: "সুরক্ষা কেন্দ্র",
        referral: "বন্ধুদের আমন্ত্রণ জানান",
        rebate: "রিবেট",
        mail: "মেইল",
        feedback: "পরামর্শ",
        appDownload: "অ্যাপ ডাউনলোড করুন",
        support: "কাস্টমার সার্ভিস",
        help: "সাহায্য কেন্দ্র",
        logout: "লগআউট",
      },
      pages: memberPagesLocale.bn,
      fields: {
        username: "ব্যবহারকারী নাম",
        nickname: "ডাকনাম",
        phone: "মোবাইল নম্বর",
        email: "ইমেইল",
        birthday: "জন্মতারিখ",
        loginPassword: "লগইন পাসওয়ার্ড",
        payPassword: "লেনদেন পাসওয়ার্ড",
        wallet: "ই-ওয়ালেট",
        notSet: "সেট করা নেই",
        change: "পরিবর্তন করুন",
      },
    },

    member: {
      title: "ব্যক্তিগত কেন্দ্র",
      // ডেস্কটপ মডালের ট্যাবগুলোর লেখা ও মোবাইল পেজের শেয়ার করা অংশ
      desk: memberDeskLocale.bn,
      pages: memberPagesLocale.bn,
      myAccount: "আমার অ্যাকাউন্ট",
      deposit: "ডিপোজিট",
      withdraw: "উত্তোলন",
      betRecord: "বেটিং রেকর্ড",
      accountRecord: "অ্যাকাউন্ট রেকর্ড",
      profitLoss: "লাভ ও ক্ষতি",
      reward: "পুরস্কার কেন্দ্র",
      referral: "বন্ধুদের আমন্ত্রণ করুন",
      inbox: "অভ্যন্তরীণ বার্তা",
      manualRebate: "ম্যানুয়াল রিবেট",
      depositInfo: "জমার তথ্য",
      depositRecord: "জমা রেকর্ড",
      depositWarning:
        "আপনাকে trxid পূরণ করতে হবে। আপনি যদি রিচার্জটি পূরণ না করেন তবে রিচার্জটি জমা হবে না",
      amountLabel: "জমার পরিমান:",
      amountPlaceholder: "জমার পরিমান",
      limit: "জমা সীমা:",
      submitDeposit: "জমার জন্য আবেদন করুন",
      withdrawInfo: "উত্তোলনের তথ্য",
      submitWithdraw: "উত্তোলনের জন্য আবেদন করুন",
      channel: "চ্যানেল",

      todayDeposit: "আজকের জমা",
      todayWithdraw: "আজকের উত্তোলন",
      securityLow: "নিম্ন",
      securityLabel: "নিরাপত্তা শতকরা",
      securityScore: "স্কোর হল ০ পয়েন্ট",
      securityHint: "আপনার অ্যাকাউন্ট নিরাপত্তা স্তর হল নিম্ন",
      noData: "কোনো তথ্য নেই",
      actions: {
        profile: {
          title: "ব্যক্তিগত তথ্য",
          desc: "আপনার অ্যাকাউন্ট নিরাপত্তা উন্নত করতে ব্যক্তিগত তথ্য পূরণ করুন।",
        },
        loginPassword: {
          title: "লগইন পাসওয়ার্ড",
          desc: "অক্ষর এবং সংখ্যার সমন্বয়ে প্রস্তাবিত পাসওয়ার্ড।",
        },
        wallet: { title: "ই-ওয়ালেট বাঁধুন", desc: "উত্তোলনের জন্য ই-ওয়ালেট বাঁধুন" },
        payPassword: {
          title: "লেনদেন পাসওয়ার্ড",
          desc: "আপনার পরিচয় যাচাই করতে লেনদেনের পাসওয়ার্ড ব্যবহার করতে হবে।",
        },
        logout: { title: "লগআউট", desc: "নিরাপদে লগআউট করুন" },
      },
      ranges: { today: "আজ", yesterday: "গতকাল", week: "এই সপ্তাহ", month: "এই মাস" },
      columns: {
        default: ["সময়", "বিবরণ", "পরিমাণ", "অবস্থা"],
        betRecord: ["সময়", "গেম", "বাজি", "লাভ/ক্ষতি"],
        accountRecord: ["সময়", "ধরন", "পরিমাণ", "অবস্থা"],
        profitLoss: ["তারিখ", "বাজি", "লাভ ও ক্ষতি", "রিবেট"],
        inbox: ["সময়", "শিরোনাম", "অবস্থা"],
        reward: ["সময়", "পুরস্কার", "পরিমাণ", "অবস্থা"],
        manualRebate: ["সময়", "ভেন্ডর", "রিবেট", "অবস্থা"],
        referral: ["সময়", "বন্ধু", "কমিশন"],
      },
    },

    footer: {
      help: "সাহায্য",
      products: "পণ্য",
      social: "সোশ্যাল মিডিয়া",
      license: "গেমিং লাইসেন্স",
      responsible: "দায়িত্বশীল গেমিং",
      payment: "পেমেন্ট মেথড",
      certification: "সার্টিফিকেশন",
      security: "সুরক্ষা",
      copyright: "Copyright © 2025 TBAJEE All rights reserved.",
    },
  },

  en: {
    brand: "TBAJEE",
    brandDomain: "tbajee.vip",

    headerMenu: { games: "GAMES", promotions: "PROMOTIONS", earn: "SHARE & EARN" },
    login: "Login",
    register: "Register",
    deposit: "Deposit",
    withdraw: "Withdrawal",

    sidebar: {
      deposit: "Deposit",
      withdraw: "Withdrawal",
      promo: "Promotion",
      reward: "Reward Center",
      rebate: "Rebate",
      gameCenter: "Game center",
      memberCenter: "Member Center",
      language: "English",
      appDownload: "App Download",
      support: "Customer Service",
      signOut: "Sign Out",
    },

    gameCenter: {
      RNG: "Slots",
      FISH: "Fish",
      LIVE: "Live",
      PVP: "Poker",
      SPORTS: "Sports",
    },

    memberCenter: {
      vip: "VIP BONUS",
      betRecord: "Betting Record",
      accountRecord: "Account Record",
      myAccount: "My Account",
      deposit: "Deposit",
      profitLoss: "Profit And Loss",
      inbox: "Internal Message",
    },

    tabs: {
      HOME: "Lobby",
      FAV: "Favorite",
      RNG: "Slots",
      LIVE: "Live",
      PVP: "Poker",
      SPORTS: "Sports",
      MXWIN: "Blockchain",
    },

    money: {
      depositTitle: "Deposit",
      withdrawTitle: "Withdrawal",
      modeTitle: "Deposit Method",
      channelTitle: "Payment Channel",
      amountTitle: "Deposit Amounts",
      trxWarning:
        "You must fill in the trxid. If you do not fill in the recharge, the recharge will not be credited",
      next: "Next",
      wallet: "E wallet",
      bound: "Bound E wallet",
      emptyWallet: "No E-Wallet linked yet",
      withdrawTime: "Withdrawal time： 24 hours",
      dailyTimes: "Daily withdrawal 99 (Times), Remaining withdrawal 99 (Times)",
      mainWallet: "Main Wallet",
      available: "Available Amount",
      refreshBalance: "Refresh Balance",
      withdrawAmount: "Withdrawal Amount:",
      amount: "Amount",
      txPassword: "Transaction Password",
      submit: "Submit",
    },
    tabsMobile: {
      HOME: "Popular",
      FAV: "My favorite",
      JL: "JILI",
      RNG: "Slots",
      FISH: "Fish",
      LIVE: "Live",
      MXWIN: "Blockchain",
      PVP: "Poker",
      SPORTS: "Sports",
    },

    seeAll: "See All",
    sections: {
      hot: "HOT GAMES",
      RNG: "SLOTS",
      FISH: "FISH",
      LIVE: "LIVE",
      PVP: "POKER",
      CRASH: "BLOCKCHAIN",
    },

    bottomNav: {
      home: "Home",
      promotions: "Promotion",
      share: "Share",
      reward: "Reward Center",
      member: "Member",
    },

    more: "More",
    noData: "No Data",
    playNow: "Play Now",
    freeTrial: "Free Trial",

    auth: {
      loginTab: "Login",
      registerTab: "Register",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm password",
      captcha: "Captcha",
      captchaMobile: "Enter a captcha",
      remember: "Remember",
      forgot: "Forgot Password",
      forgotMobile: "Forgot Password ?",
      terms:
        "I confirm that I am 18 years old and I have read the Terms and Services",
      noAccount: "No account yet?",
      noAccountMobile: "No account yet?",
      registerNow: "Register now",
      registerShort: "Register",
      haveAccount: "Already have an account?",
      loginNow: "Login",
      reset: "Reset",
    },

    noticeTitle: "Notice",

    promo: { all: "All", more: "More" },

    download: {
      desc: "We would like to add this to your home screen for free bet and bonus updates.",
      continueBrowser: "Continue using the browser",
      tag: "More benefits",
      webApp: "Web App",
    },

    memberPage: {
      sectionTitle: "Member Center",
      nickname: "Nickname",
      signIn: "Sign in",
      joined: "Registration date",
      depositBtn: "Deposit",
      withdrawBtn: "Withdrawal",
      cardBtn: "My Card",
      items: {
        reward: "Reward Center",
        betRecord: "Betting Record",
        profitLoss: "Profit and Loss",
        depositRecord: "Deposit Record",
        withdrawRecord: "Withdrawal Record",
        accountRecord: "Account Record",
        myAccount: "My Account",
        security: "Security Center",
        referral: "Invite Friends",
        rebate: "Rebate",
        mail: "Mail",
        feedback: "Feedback",
        appDownload: "Download App",
        support: "Customer Service",
        help: "Help Center",
        logout: "Logout",
      },
      pages: memberPagesLocale.en,
      fields: {
        username: "Username",
        nickname: "Nickname",
        phone: "Phone number",
        email: "Email",
        birthday: "Birthday",
        loginPassword: "Login password",
        payPassword: "Transaction password",
        wallet: "E-Wallet",
        notSet: "Not set",
        change: "Change",
      },
    },

    member: {
      title: "Personal Center",
      // ডেস্কটপ মডালের ট্যাবগুলোর লেখা ও মোবাইল পেজের শেয়ার করা অংশ
      desk: memberDeskLocale.en,
      pages: memberPagesLocale.en,
      myAccount: "My Account",
      deposit: "Deposit",
      withdraw: "Withdrawal",
      betRecord: "Betting Record",
      accountRecord: "Account Record",
      profitLoss: "Profit And Loss",
      reward: "Reward Center",
      referral: "Invite Friends",
      inbox: "Internal Message",
      manualRebate: "Manual Rebate",
      depositInfo: "Deposit Info",
      depositRecord: "Deposit Record",
      depositWarning:
        "You must fill in the trxid. If you do not fill it in, the recharge will not be credited",
      amountLabel: "Deposit amount:",
      amountPlaceholder: "Deposit amount",
      limit: "Deposit limit:",
      submitDeposit: "Apply for deposit",
      withdrawInfo: "Withdrawal Info",
      submitWithdraw: "Apply for withdrawal",
      channel: "Channel",

      todayDeposit: "Today's deposit",
      todayWithdraw: "Today's withdrawal",
      securityLow: "Low",
      securityLabel: "Security level",
      securityScore: "Score is 0 points",
      securityHint: "Your account security level is Low",
      noData: "No data",
      actions: {
        profile: {
          title: "Personal Info",
          desc: "Fill in your personal info to improve account security.",
        },
        loginPassword: {
          title: "Login Password",
          desc: "A password mixing letters and numbers is recommended.",
        },
        wallet: { title: "Bind E-Wallet", desc: "Bind an e-wallet for withdrawals" },
        payPassword: {
          title: "Transaction Password",
          desc: "The transaction password is used to verify your identity.",
        },
        logout: { title: "Logout", desc: "Log out safely" },
      },
      ranges: { today: "Today", yesterday: "Yesterday", week: "This week", month: "This month" },
      columns: {
        default: ["Time", "Detail", "Amount", "Status"],
        betRecord: ["Time", "Game", "Bet", "Profit/Loss"],
        accountRecord: ["Time", "Type", "Amount", "Status"],
        profitLoss: ["Date", "Bet", "Profit & Loss", "Rebate"],
        inbox: ["Time", "Title", "Status"],
        reward: ["Time", "Reward", "Amount", "Status"],
        manualRebate: ["Time", "Vendor", "Rebate", "Status"],
        referral: ["Time", "Friend", "Commission"],
      },
    },

    footer: {
      help: "Help",
      products: "Products",
      social: "Social media",
      license: "Gaming License",
      responsible: "Responsible Gaming",
      payment: "Payment Method",
      certification: "Certification",
      security: "Security",
      copyright: "Copyright © 2025 TBAJEE All rights reserved.",
    },
  },
};

/** সাইডবারের ভাষা তালিকা — মূল সাইটে এই দুটোই আছে */
export const LANGUAGES = [
  { code: "bn", name: "বাংলা", flag: "/assets/vendors/country_flag/BD.svg" },
  { code: "en", name: "English", flag: "/assets/vendors/country_flag/US.svg" },
];

export default locale;
