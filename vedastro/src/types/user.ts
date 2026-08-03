export type UserRole = "user" | "astrologer" | "admin";

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  walletBalance: number; 
}

export interface IBirthDetails {
  dob: string; // YYYY-MM-DD format
}

export interface IClientProfile extends IUserProfile {
  birthDetails?: IBirthDetails;
  activeConsultationId?: string;
}