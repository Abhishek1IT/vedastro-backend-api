import api from "../lib/axios";
import { API_ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../store/authStore";

export type LoginRole = "USER" | "ASTROLOGER" | "ADMIN";

export interface CompleteProfilePayload {
  name: string;
  email?: string;
  dob?: string;
}

export interface AuthUser {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  phone: string;
  dob?: string;
  role?: "USER" | "ASTROLOGER" | "ADMIN";
  profileCompleted: boolean;
}

export const authService = {
  // Send OTP
  async sendOtp(
    phone: string,
    role: LoginRole,
  ): Promise<{ success: boolean; message?: string }> {
    const response = await api.post(
      "/auth/send-otp",
      {
        phone,
        role,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  },

  // Verify OTP
  async verifyOtp(phone: string, otp: string, role: LoginRole) {
    const response = await api.post(
      "/auth/verify-otp",
      {
        phone,
        otp,
        role,
      },
      {
        withCredentials: true,
      },
    );

    const user = response.data?.data?.user;

    if (user) {
      localStorage.setItem("hasSession", "true");

      useAuthStore.getState().setUser(user);
    }

    return response.data;
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
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.AUTH.ME, {
      withCredentials: true,
    });

    return response.data?.data?.user ?? response.data?.data;
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
