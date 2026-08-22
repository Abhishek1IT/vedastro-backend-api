export type AstrologerExpertise =
  | "Love"
  | "Marriage"
  | "Career"
  | "Finance"
  | "Business"
  | "Education"
  | "Vastu"
  | "Numerology"
  | "Kundli";

export interface AstrologerPricing {
  chat?: number;
  call?: number;
  video?: number;
}

export interface Astrologer {
  fullName: string;
  _id: string;
  name: string;

  expertise: AstrologerExpertise[];

  profileImage?: string;
  isVerified: boolean;
  isOnline: boolean;
  isBusy?: boolean;

  experience: number;
  rating?: number;
  reviewCount?: number;
  consultationCount?: number;

  languages: string[];
  specializations: string[];

  pricing?: AstrologerPricing;

  responseTime?: number;
  bio?: string;

  conversationId?: string;
  lastMessage?: string;
  lastMessageAt?: string;

  role?: "ASTROLOGER" | "USER";
}

export type ConsultationMode = "chat" | "call" | "video";

export type AvailabilityFilter = "now" | "today" | "later";

export type ExperienceFilter = "1-5" | "5-10" | "10+";

export interface ConsultationFilters {
  consultationTypes: ConsultationMode[];
  availability: AvailabilityFilter[];
  experience: ExperienceFilter[];
  languages: string[];
  priceRange: [number, number];
  expertise: AstrologerExpertise[];
}

export type SortOption =
  | "recommended"
  | "rating"
  | "experience"
  | "price-low"
  | "price-high"
  | "consulted";

export const CATEGORIES = [
  "All",
  "Love & Relationship",
  "Marriage",
  "Career",
  "Finance",
  "Education",
  "Family",
  "Business",
  "Vastu",
  "Numerology",
  "Kundli",
] as const;

export const EXPERTISE_OPTIONS: AstrologerExpertise[] = [
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

export const LANGUAGE_OPTIONS = ["Hindi", "English", "Hinglish"] as const;

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
}[] = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
  {
    value: "experience",
    label: "Most Experienced",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "consulted",
    label: "Most Consulted",
  },
];
