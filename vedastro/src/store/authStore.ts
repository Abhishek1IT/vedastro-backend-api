/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { authService, AuthUser } from "../services/auth.service";

interface AuthState {
  user: AuthUser | null;

  isAuthenticated: boolean;

  isHydrated: boolean;

  setUser: (user: AuthUser) => void;

  hydrateStore: () => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,

  isHydrated: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  hydrateStore: async () => {
    try {
      const user = await authService.getCurrentUser();

      set({
        user,

        isAuthenticated: true,

        isHydrated: true,
      });
    } catch (error) {
      set({
        user: null,

        isAuthenticated: false,

        isHydrated: true,
      });
    }
  },

  logout: () => {
    set({
      user: null,

      isAuthenticated: false,

      isHydrated: true,
    });
  },
}));
