/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../../../components/ui/Card";
import Button from "../../../components/common/Button";

import { authService, type AuthUser } from "../../../services/auth.service";

import { useAuthStore } from "../../../store/authStore";

export default function AdminLoginPage() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (!otpSent) {
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError(
          "Provide a valid 10-digit mobile number starting with 6-9.",
        );
        return;
      }

      try {
        setLoading(true);

        await authService.sendOtp(cleanPhone, "ADMIN");

        setOtpSent(true);
      } catch (err: any) {
        console.error("Admin send OTP error:", err);

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to send OTP",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    const cleanOtp = otp.replace(/\D/g, "");

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const user: AuthUser = await authService.verifyOtp(
        cleanPhone,
        cleanOtp,
        "ADMIN",
      );

      console.log("ADMIN VERIFY USER:", user);

      if (!user) {
        setError("User information not received.");
        return;
      }

      if (user.role !== "ADMIN") {
        setError("You are not authorized as an admin.");
        return;
      }

      setUser(user);

      router.replace("/admin");
    } catch (err: any) {
      console.error(
        "Admin verify OTP error:",
        err?.response?.data || err,
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-white">Admin Login</h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!otpSent ? (
            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Admin Mobile Number
              </label>

              <input
                type="tel"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Mobile Number"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
          ) : (
            <>
              {/* Admin Number */}
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Admin Number
                </p>

                <p className="mt-1 text-sm font-bold text-amber-400">
                  +91 {phone}
                </p>
              </div>

              {/* OTP */}
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-sm font-bold tracking-[0.4em] text-white outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Processing..."
              : !otpSent
                ? "Get Admin OTP"
                : "Verify & Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
