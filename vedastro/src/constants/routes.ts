export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",

  HERO: {
    ROOT: "/"
  },

  HOME: {
    ROOT: "/home",
    DOWNLOAD_APP: "/home/download-app",
    FAQ: "/home/faq",
    HOROSCOPE_SECTION: "/home/horoscope-section",
    KUNDLI_SECTION: "/home/kundli-section",
    SERVICES: "/home/services",
    TESTIMONIALS: "/home/testimonials",
    LIVE_ASTROLOGERS: "/home/live-astrologers",
    TOP_ASTROLOGERS: "/home/top-astrologers",
    WHY_CHOOSE_US: "/home/why-choose-us",
  },

  CONSULTATIONS: {
    ROOT: "/consultations",
    ASTROLOGERS: "/consultations/astrologers",
    CHAT: "/consultations/chat",
    CALL: "/consultations/call",
  },

  HOROSCOPE: {
    ROOT: "/horoscope",
    DAILY: "/horoscope/daily",
    WEEKLY: "/horoscope/weekly",
    MONTHLY: "/horoscope/monthly",
    YEARLY: "/horoscope/yearly",
  },

  FREE_SERVICES: {
    ROOT: "/free-services",
    KUNDLI: "/free-services/kundli",
    MATCHING: "/free-services/matching",
    NUMEROLOGY: "/free-services/numerology",
    NAME_NUMEROLOGY: "/free-services/name-numerology",
  },

  PANCHANG: "/panchang",
  SHOP: "/shop",
} as const;