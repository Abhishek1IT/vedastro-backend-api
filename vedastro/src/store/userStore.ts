/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import api from "../lib/axios";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  role: "user" | "astrologer" | "USER" | "ASTROLOGER";
  profileCompleted?: boolean;
  avatar?: string;
}

interface UserState {
  myProfile: UserProfile | null;

  loadingProfile: boolean;

  setProfile: (profile: UserProfile) => void;

  fetchMyProfile: () => Promise<UserProfile | null>;

  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  myProfile: null,

  loadingProfile: false,

  setProfile: (profile) =>
    set({
      myProfile: profile,
    }),

  fetchMyProfile: async () => {
    if (get().myProfile) {
      return get().myProfile;
    }

    set({
      loadingProfile: true,
    });

    try {
      const res = await api.get("/user/me");

      const profileData = res.data?.user || res.data?.data || res.data;

      set({
        myProfile: profileData,
        loadingProfile: false,
      });

      return profileData;
    } catch (err: any) {
      console.error("Failed to fetch user profile:", err);

      set({
        myProfile: null,
        loadingProfile: false,
      });

      return null;
    }
  },

  clearProfile: () => {
    set({
      myProfile: null,
      loadingProfile: false,
    });
  },
}));
