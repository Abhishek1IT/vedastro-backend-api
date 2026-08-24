/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "../../../components/ui/Card";
import Button from "../../../components/common/Button";

import { useLogin } from "../../../hooks/useLogin";

export default function AdminLoginPage() {
  const router = useRouter();

  const { sendOtp, verifyOtp, loading, error, otpSent } = useLogin();
  const [localError, setLocalError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Use either the hook's error or the local validation error
  const displayError = error || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    const cleanPhone = phone.replace(/\D/g, "");

    if (!otpSent) {
      if (cleanPhone.length > 0 && parseInt(cleanPhone.charAt(0)) < 5) {
        setLocalError("Provide a valid 10-digit mobile number.");
        return;
      }
      if (!/^[5-9]\d{9}$/.test(cleanPhone)) {
        setLocalError(
          "Provide a valid 10-digit mobile number starting with 5-9.",
        );
        return;
      }

      try {
        await sendOtp(cleanPhone, "ADMIN");
      } catch (err: any) {
        console.error("Admin send OTP error:", err);
      }
      return;
    }

    const cleanOtp = otp.replace(/\D/g, "");

    if (!/^\d{6}$/.test(cleanOtp)) {
      setLocalError("OTP must be exactly 6 digits.");
      return;
    }

    try {
      const user = await verifyOtp(cleanPhone, cleanOtp, "ADMIN");

      if (!user) {
        return;
      }

      if (user.role !== "ADMIN") {
        setLocalError("You are not authorized as an admin.");
        return;
      }

      router.replace("/admin");
    } catch (err: any) {
      console.error("Admin verify OTP error:", err);
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
        {displayError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-semibold text-red-400">
            {displayError}
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
