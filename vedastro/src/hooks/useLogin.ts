/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";

export const useLogin = () => {
  const router = useRouter();

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

      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend will set accessToken cookie
      const response = await authService.verifyOtp(formatPhone(phone), otp);

      console.log("VERIFY RESPONSE:", response);

      // Get logged in user using cookie
      const userResponse = await authService.getCurrentUser();

      console.log("CURRENT USER:", userResponse);

      const currentUser =
        userResponse.user || userResponse.data || userResponse;

      setUser(currentUser);

      if (currentUser.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/home");
      }
    } catch (err: any) {
      console.log("LOGIN ERROR:", err);

      setError(err.response?.data?.message || "Invalid or expired OTP.");
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
