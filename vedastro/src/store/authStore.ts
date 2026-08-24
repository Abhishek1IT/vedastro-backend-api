/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import api from "../lib/axios";

export type UserRole = "USER" | "ASTROLOGER" | "ADMIN";

export type ApprovalStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface AuthUser {
  _id: string;
  id?: string;
  profileImage?: string;

  name?: string;
  email?: string;
  phone: string;
  dob?: string;

  role?: UserRole;

  gender?: "MALE" | "FEMALE" | "OTHER" | string;
  birthPlace?: string | null;
  birthTime?: string | null;

  profileCompleted?: boolean;

  approvalStatus?: ApprovalStatus;
  rejectionReason?: string | null;

  avatar?: string;

  experience?: number;
  skills?: string[];
  languages?: string[];
  consultationPrice?: number;

  isOnline?: boolean;
  totalOrders?: number;

  rating?: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  isLoginModalOpen: boolean;

  setUser: (user: AuthUser | null, accessToken?: string | null) => void;
  logout: () => Promise<void>;
  hydrateStore: () => Promise<void>;

  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,

  isLoginModalOpen: false,

  setUser: (user, newAccessToken?: string | null) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("hasSession", "true");
      } else {
        localStorage.removeItem("hasSession");
      }
    }
    
    set((state) => ({
      user,
      accessToken: newAccessToken !== undefined ? newAccessToken : state.accessToken,
      isAuthenticated: user ? true : false,
    }));
  },

  logout: async () => {
    try {
      await api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error: any) {
      console.warn(
        "Logout API error:",
        error?.response?.data?.message || error?.message,
      );
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hasSession");
      }

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },

  hydrateStore: async () => {
    if (get().isHydrated) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const hasSession = localStorage.getItem("hasSession");

    // No previous login
    if (!hasSession) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });

      return;
    }

    try {
      console.log("AUTH: Checking /auth/me");

      const response = await api.get("/auth/me", {
        withCredentials: true,
      });

      const user = response.data?.data?.user ?? response.data?.data;
      const accessToken = response.data?.data?.accessToken ?? null;

      if (!user) {
        throw new Error("User not found in /auth/me response");
      }

      console.log("AUTH: Session restored");

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });

      return;
    } catch (error: any) {
      console.warn(
        "AUTH ME FAILED:",
        error?.response?.status,
        error?.response?.data,
      );
    }

    try {
      console.log("AUTH: Trying refresh token");

      const refreshResponse = await api.post(
        "/auth/refresh-token",
        {},
        {
          withCredentials: true,
        },
      );

      console.log("AUTH: Refresh successful", refreshResponse.status);

      const response = await api.get("/auth/me", {
        withCredentials: true,
      });

      const user = response.data?.data?.user ?? response.data?.data;
      const accessToken = response.data?.data?.accessToken ?? null;

      if (!user) {
        throw new Error("User not found after refresh");
      }

      console.log("AUTH: Session restored after refresh");

      if (typeof window !== "undefined") {
        localStorage.setItem("hasSession", "true");
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });

      return;
    } catch (refreshError: any) {
      console.error(
        "AUTH REFRESH FAILED:",
        refreshError?.response?.status,
        refreshError?.response?.data,
      );

      if (typeof window !== "undefined") {
        localStorage.removeItem("hasSession");
      }

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },

  openLoginModal: () => {
    set({
      isLoginModalOpen: true,
    });
  },

  closeLoginModal: () => {
    set({
      isLoginModalOpen: false,
    });
  },
}));
