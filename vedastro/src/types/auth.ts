export interface User {
  id: string;
  phone: string;
  name?: string;
  role?: string;
  createdAt?: string;
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