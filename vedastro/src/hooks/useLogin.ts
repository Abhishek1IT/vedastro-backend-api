/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";

type LoginRole = "USER" | "ASTROLOGER" | "ADMIN";

export const useLogin = () => {
  const setUser = useAuthStore((state: { setUser: any }) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, "").slice(-10);
  };

  const sendOtp = async (phone: string, role: LoginRole) => {
    try {
      setLoading(true);
      setError("");

      await authService.sendOtp(formatPhone(phone), role);

      setOtpSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "OTP failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string, role: LoginRole) => {
    try {
      setLoading(true);
      setError("");

      // Verify OTP and get user data
      const authData = await authService.verifyOtp(formatPhone(phone), otp, role);
      
      const currentUser = authData.user;
      const accessToken = authData.accessToken;

      console.log("========== LOGIN DEBUG ==========");
      console.log("CURRENT USER:", currentUser);
      console.log("ROLE:", currentUser?.role);
      console.log("PROFILE COMPLETED:", currentUser?.profileCompleted);
      console.log("=================================");

      if (!currentUser) {
        throw new Error("User data not received");
      }

      setUser(currentUser, accessToken);

      return currentUser;
    } catch (err: any) {
      console.error("VERIFY OTP ERROR:", err);

      setError(err?.response?.data?.message || err?.message || "Invalid OTP");

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
