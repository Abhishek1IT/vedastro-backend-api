import api from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";

export interface CompleteProfilePayload {
  name: string;
  email: string;
  dob: string;
}

export interface AuthUser {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  phone: string;
  dob?: string;
  role?: string;
  profileCompleted: boolean;
}

export const authService = {
  // Send OTP
  async sendOtp(
    phone: string,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.post(
      "/auth/send-otp",
      { phone },
      {
        withCredentials: true,
      },
    );

    return response.data;
  },

  // Verify OTP
  async verifyOtp(phone: string, otp: string) {
    const response = await api.post(
      "/auth/verify-otp",
      {
        phone,
        otp,
      },
      {
        withCredentials: true,
      },
    );

    return response.data.data;
  },

  // Complete Profile
  async completeProfile(payload: CompleteProfilePayload): Promise<AuthUser> {
    const response = await api.put(
      API_ENDPOINTS.AUTH.COMPLETE_REGISTRATION,
      payload,
      {
        withCredentials: true,
      },
    );

    return response.data.data;
  },

  // Current User
  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get(API_ENDPOINTS.AUTH.ME, {
      withCredentials: true,
    });

    return response.data.data;
  },

  // Logout
  async logout() {
    const response = await api.post(
      API_ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  },
};
