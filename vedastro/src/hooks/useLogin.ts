/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/home";

  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const formatPhone = (phone: string) => phone.replace(/\D/g, "").slice(-10);

  // SEND OTP
  const sendOtp = async (phone: string) => {
    if (!phone) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authService.sendOtp(formatPhone(phone));
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOtp = async (phone: string, otp: string) => {
    if (!phone || !otp) {
      setError("Phone number and OTP are required.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      // Backend cookie set karega
      await authService.verifyOtp(formatPhone(phone), otp);

      // Current logged-in user
      const userResponse = await authService.getCurrentUser();

      const currentUser =
        userResponse.user || userResponse.data || userResponse;

      setUser(currentUser);

      // ADMIN
      if (currentUser.role === "ADMIN") {
        router.replace("/admin");
        return currentUser;
      }

      // Profile incomplete
      if (!currentUser.profileCompleted) {
        router.replace(
          `/complete-profile?redirect=${encodeURIComponent(redirect)}`,
        );
        return currentUser;
      }

      // Redirect to original page
      router.replace(redirect);

      return currentUser;
    } catch (err: any) {
      console.log(err);

      setError(err.response?.data?.message || "Invalid or expired OTP.");

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtp,
    verifyOtp,
    otpSent,
    loading,
    error,
  };
};
