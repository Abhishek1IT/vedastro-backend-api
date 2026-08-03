export interface Astrologer {
  _id: string;        // Database Mongo Object ID mapping
  name: string;
  expertise: string[];
  rating: number;
  experience: number;
  ratePerMin: number;
  isOnline: boolean;
  avatarUrl?: string;
}