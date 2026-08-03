/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { authService, CompleteProfilePayload } from "../services/auth.service";

import { useAuthStore } from "../store/authStore";

export const useRegister = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const registerUser = async (payload: CompleteProfilePayload) => {
    console.log("3. registerUser", payload);

    setLoading(true);

    setError("");

    try {
      const updatedUser = await authService.completeProfile(payload);

      console.log("4. API Success", updatedUser);

      setUser(updatedUser.user || updatedUser);

      const redirect = searchParams.get("redirect") || "/home";

      router.replace(redirect);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to complete profile.");
    } finally {
      setLoading(false);
    }
  };

  return {
    registerUser,
    loading,
    error,
  };
};
