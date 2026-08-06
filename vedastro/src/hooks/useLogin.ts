/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, "").slice(-10);
  };

  const sendOtp = async (phone: string) => {
    try {
      setLoading(true);

      await authService.sendOtp(formatPhone(phone));

      setOtpSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      setLoading(true);

      await authService.verifyOtp(formatPhone(phone), otp);

      const user = await authService.getCurrentUser();

      console.log("USER:", user);

      setUser(user);

      return user;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid OTP");

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
