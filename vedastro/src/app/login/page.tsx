"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLogin } from "../../hooks/useLogin";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";

export default function LoginPage() {
  const { sendOtp, verifyOtp, otpSent, loading, error } = useLogin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/home";

  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [localValidationError, setLocalValidationError] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationError("");

    const cleanPhone = phone.replace(/\D/g, "").trim();

    if (!otpSent) {
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setLocalValidationError(
          "Provide a valid 10-digit mobile number starting with 6-9.",
        );
        return;
      }

      await sendOtp(cleanPhone);
      return;
    }

    const cleanOtp = otpCode.replace(/\D/g, "").trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setLocalValidationError("Verification token must be exactly 6 digits.");
      return;
    }

    const user = await verifyOtp(cleanPhone, cleanOtp);

    if (!user) return;

    // Admin
    if (user.role === "ADMIN") {
      router.replace("/admin");
      return;
    }

    const profileCompleted =
      Boolean(user.name?.trim()) &&
      Boolean(user.email?.trim()) &&
      Boolean(user.dob);

    if (!profileCompleted) {
      router.replace(
        `/complete-profile?redirect=${encodeURIComponent(redirect)}`,
      );
      return;
    }

    router.replace(redirect);
  };

  const displayedError = localValidationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
      <Card
        hoverEffect={false}
        className="w-full max-w-sm rounded-2xl border border-slate-900 bg-yellow-300/40 p-6 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-6 text-center">
          <h2 className="text-xl font-black uppercase text-white">
            Login to Verify
          </h2>

          <p className="mt-2 text-[10px] text-slate-500">
            {!otpSent
              ? "Provide your mobile number."
              : "Enter the 6-digit OTP."}
          </p>
        </div>

        {displayedError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] font-bold text-red-400">
            {displayedError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!otpSent ? (
            <>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Mobile Number
              </label>

              <input
                type="tel"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Mobile Number"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none"
              />
            </>
          ) : (
            <>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                OTP
              </label>

              <input
                type="text"
                value={otpCode}
                maxLength={6}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-sm font-bold tracking-[0.4em] text-white outline-none"
              />
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : !otpSent ? "Get OTP" : "Verify OTP"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
