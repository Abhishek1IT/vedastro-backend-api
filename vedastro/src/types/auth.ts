export interface User {
  id: string;
  phone: string;
  name?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  dob?: string;
  profileCompleted?: boolean;
  isOnline?: boolean;
  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  birthPlace?: string | null;
  birthTime?: string | null;
  experience?: number;
  skills?: string[];
  languages?: string[];
  consultationPrice?: number;
  rating?: number;
  approvalStatus?: "NOT_REQUIRED" | "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: User;
  accessToken?: string;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}