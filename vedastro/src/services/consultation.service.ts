import api from "../lib/axios";

import { Astrologer, AstrologerExpertise } from "../types/consultation";

interface ApiAstrologer {
  _id?: string;
  id?: string;

  name?: string;
  fullName?: string;

  avatar?: string;
  profileImage?: string;
  profilePicture?: string;

  experience?: number | string;

  languages?: string[];
  language?: string;

  expertise?: string[] | string | null;
  skills?: string[];

  specializations?: string[];

  rating?: number | string;
  reviewCount?: number | string;

  consultationCount?: number | string;
  totalConsultations?: number | string;
  orders?: number | string;

  isOnline?: boolean;
  isBusy?: boolean;
  isVerified?: boolean;

  price?: number | string;
  consultationPrice?: number | string;
  rate?: number | string;

  chatPrice?: number | string;
  chatRate?: number | string;

  callPrice?: number | string;
  callRate?: number | string;

  videoPrice?: number | string;
  videoRate?: number | string;

  pricing?: {
    chat?: number | string;
    call?: number | string;
    video?: number | string;
  };

  responseTime?: number;
  bio?: string;

  role?: "ASTROLOGER" | "USER";

  conversationId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

const EXPERTISE_OPTIONS: AstrologerExpertise[] = [
  "Love",
  "Marriage",
  "Career",
  "Finance",
  "Business",
  "Education",
  "Vastu",
  "Numerology",
  "Kundli",
];

function normalizeExpertise(
  expertise: string[] | string | null | undefined,
  skills?: string[],
): AstrologerExpertise[] {
  let values: string[] = [];

  if (Array.isArray(expertise)) {
    values = expertise;
  } else if (typeof expertise === "string") {
    values = [expertise];
  } else if (Array.isArray(skills)) {
    values = skills;
  }

  return values.filter((value): value is AstrologerExpertise =>
    EXPERTISE_OPTIONS.includes(value as AstrologerExpertise),
  );
}

export const consultationService = {
  async getAstrologers(): Promise<Astrologer[]> {
    try {
      const response = await api.get("/user/astrologers");

      const result = response.data;

      const astrologers = result?.data?.data ?? result?.data ?? result ?? [];

      if (!Array.isArray(astrologers)) {
        return [];
      }

      return astrologers.map((astro: ApiAstrologer): Astrologer => {
        const name = astro.name ?? astro.fullName ?? "Astrologer";

        const basePrice = Number(
          astro.price ?? astro.consultationPrice ?? astro.rate ?? 0,
        );

        const expertise = normalizeExpertise(astro.expertise, astro.skills);

        return {
          ...astro,

          _id: String(astro._id ?? astro.id ?? ""),

          name,

          fullName: name,

          profileImage:
            astro.profileImage ?? astro.profilePicture ?? astro.avatar ?? "",

          experience: Number(astro.experience ?? 0),

          languages: Array.isArray(astro.languages)
            ? astro.languages
            : astro.language
              ? [astro.language]
              : [],

          expertise,

          specializations: Array.isArray(astro.specializations)
            ? astro.specializations
            : [],

          rating: Number(astro.rating ?? 0),

          reviewCount: Number(astro.reviewCount ?? 0),

          consultationCount: Number(
            astro.consultationCount ??
              astro.totalConsultations ??
              astro.orders ??
              0,
          ),

          isOnline: Boolean(astro.isOnline),

          isBusy: Boolean(astro.isBusy),

          isVerified: Boolean(astro.isVerified),

          responseTime: astro.responseTime,

          bio: astro.bio,

          conversationId: astro.conversationId,

          lastMessage: astro.lastMessage,

          lastMessageAt: astro.lastMessageAt,

          role: astro.role ?? "ASTROLOGER",

          pricing: {
            chat: Number(
              astro.pricing?.chat ??
                astro.chatPrice ??
                astro.chatRate ??
                basePrice,
            ),

            call: Number(
              astro.pricing?.call ??
                astro.callPrice ??
                astro.callRate ??
                basePrice,
            ),

            video: Number(
              astro.pricing?.video ??
                astro.videoPrice ??
                astro.videoRate ??
                basePrice,
            ),
          },
        };
      });
    } catch (error: unknown) {
      console.error("ASTROLOGERS API ERROR:", error);

      throw error;
    }
  },

  async getChatUsers(): Promise<Astrologer[]> {
    try {
      const response = await api.get("/user/chat-users");

      const result = response.data;

      const users = result?.data?.data ?? result?.data ?? result ?? [];

      if (!Array.isArray(users)) {
        console.error("Invalid chat users response:", result);

        return [];
      }

      return users.map((user: ApiAstrologer): Astrologer => {
        const name = user.name ?? user.fullName ?? "User";

        return {
          ...user,

          _id: String(user._id ?? user.id ?? ""),

          name,

          fullName: name,

          profileImage:
            user.profileImage ?? user.profilePicture ?? user.avatar ?? "",

          experience: Number(user.experience ?? 0),

          languages: Array.isArray(user.languages)
            ? user.languages
            : user.language
              ? [user.language]
              : [],

          expertise: normalizeExpertise(user.expertise, user.skills),

          specializations: Array.isArray(user.specializations)
            ? user.specializations
            : [],

          rating: Number(user.rating ?? 0),

          reviewCount: Number(user.reviewCount ?? 0),

          consultationCount: Number(
            user.consultationCount ??
              user.totalConsultations ??
              user.orders ??
              0,
          ),

          isOnline: Boolean(user.isOnline),

          isBusy: Boolean(user.isBusy),

          isVerified: Boolean(user.isVerified),

          responseTime: user.responseTime,

          bio: user.bio,

          conversationId: user.conversationId,

          lastMessage: user.lastMessage,

          lastMessageAt: user.lastMessageAt,

          role: "USER",

          pricing: {
            chat: 0,
            call: 0,
            video: 0,
          },
        };
      });
    } catch (error: unknown) {
      console.error("CHAT USERS ERROR:", error);

      throw error;
    }
  },
};
