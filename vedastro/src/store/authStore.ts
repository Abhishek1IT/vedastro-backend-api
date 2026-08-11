/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import api from "../lib/axios";

export interface AuthUser {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  phone: string;
  dob?: string;
  role?: "USER" | "ASTROLOGER" | "ADMIN";
  profileCompleted?: boolean;
  isOnline?: boolean;
}

interface AuthState {
  isExistingUser: any;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  hydrateStore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setUser: (user) => {
    if (user) {
      localStorage.setItem("hasSession", "true");
    } else {
      localStorage.removeItem("hasSession");
    }

    set({
      user,
      isAuthenticated: !!user,
    });
  },

  logout: () => {
    localStorage.removeItem("hasSession");

    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  hydrateStore: async () => {
    if (get().isHydrated) {
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
}));
