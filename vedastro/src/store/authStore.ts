/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { authService } from "../services/auth.service";

interface AuthUser {
  _id: string;
  id: string;
  name?: string;
  email?: string;
  phone: string;
  dob?: string;
  role?: string;
  profileCompleted: boolean;
}

interface AuthState {
  user: AuthUser | null;

  isAuthenticated: boolean;

  isExistingUser: boolean;

  isHydrated: boolean;

  setUser: (user: AuthUser) => void;

  setAuthenticated: (status: boolean, isExisting?: boolean) => void;

  hydrateStore: () => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  isAuthenticated: false,

  isExistingUser: true,

  isHydrated: false,

  hydrateStore: async () => {
    try {
      const user = await authService.getCurrentUser();

      console.log("CURRENT USER:", user);

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

      if (typeof window !== "undefined") {
        const protectedRoutes = [
          "/home",
          "/profile",
          "/shop",
          "/chat",
          "/call",
          "/admin",
        ];

        if (
          protectedRoutes.some((route) =>
            window.location.pathname.startsWith(route),
          )
        ) {
          window.location.replace("/");
        }
      }
    }
  },

  setUser: (user) => {
    set({
      user,

      isAuthenticated: true,

      isHydrated: true,
    });
  },

  setAuthenticated: (status, isExisting = true) => {
    set({
      isAuthenticated: status,

      isExistingUser: isExisting,
    });
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    });

    window.location.replace("/");
  },
}));
