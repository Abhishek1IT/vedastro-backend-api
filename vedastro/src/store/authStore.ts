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

  // Astrologer
  experience?: number;
  skills?: string[];
  languages?: string[];
  consultationPrice?: number;

  isOnline?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  isLoginModalOpen: boolean;

  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  hydrateStore: () => Promise<void>;

  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  isLoginModalOpen: false,

  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("hasSession", "true");
      } else {
        localStorage.removeItem("hasSession");
      }
    }

    set({
      user,
      isAuthenticated: !!user,
    });
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
        "Logout API skipped:",
        error?.response?.data?.message || "Session already expired",
      );
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hasSession");
      }

      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });
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

    if (!hasSession) {
      set({
        user: null,
        isAuthenticated: false,
        isHydrated: true,
      });

      return;
    }

    try {
      const response = await api.get("/auth/me", {
        withCredentials: true,
      });

      const user = response.data?.data?.user ?? response.data?.data;

      set({
        user: user ?? null,
        isAuthenticated: !!user,
        isHydrated: true,
      });
    } catch (error: any) {
      console.error(
        "AUTH ME ERROR:",
        error?.response?.status,
        error?.response?.data,
      );

      localStorage.removeItem("hasSession");

      set({
        user: null,
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
