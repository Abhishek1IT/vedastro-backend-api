/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";

export const useLogin = () => {
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/home";

  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const formatPhone = (phone: string) => {
    return phone.replace(/\D/g, "").slice(-10);
  };

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
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    if (!phone || !otp) {
      setError("Phone number and OTP are required.");

      return null;
    }

    setLoading(true);
    setError("");

    try {
      await authService.verifyOtp(formatPhone(phone), otp);

      const currentUser = await authService.getCurrentUser();

      console.log("CURRENT USER:", currentUser);

      setUser(currentUser);

      return currentUser;
    } catch (err: any) {
      console.log(err);

      setError(err?.response?.data?.message || "Invalid or expired OTP.");

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
    redirect,
  };
};
