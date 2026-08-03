"use client";

import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/ui/Badge";

export default function LoginPage() {
  const { sendOtp, verifyOtp, otpSent, loading, error } = useLogin();
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
    } else {
      const cleanOtp = otpCode.replace(/\D/g, "").trim();

      if (!/^\d{6}$/.test(cleanOtp)) {
        setLocalValidationError("Verification token must be exactly 6 digits.");
        return;
      }

      await verifyOtp(cleanPhone, cleanOtp);
    }
  };

  const displayedError = localValidationError || error;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 antialiased">
      <Card
        hoverEffect={false}
        className="w-full max-w-sm rounded-2xl border border-slate-900 bg-yellow-300/40 p-6 md:p-8 shadow-2xl relative backdrop-blur-md"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <Badge
            variant="amber"
            className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-black mb-3"
          >
            Secure VedAstro
          </Badge>
          <h2 className="text-xl font-black tracking-tight text-white uppercase mt-1">
            Login to Your Account
          </h2>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">
            {!otpSent
              ? "Provide details to request access link."
              : "Enter the 6-digit verification key."}
          </p>
        </div>

        {/* Error Notification */}
        {displayedError && (
          <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 text-center animate-pulse">
            {displayedError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {!otpSent ? (
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit number"
                maxLength={10}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-amber-500/50 focus:outline-none transition duration-200"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1.5">
                OTP Verification
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                maxLength={6}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-center tracking-[0.3em] font-bold text-white focus:border-amber-500/50 focus:outline-none transition duration-200"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest mt-2 shadow-lg ${
              loading
                ? "opacity-50 cursor-not-allowed bg-slate-800"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950"
            }`}
          >
            {loading
              ? "Processing..."
              : !otpSent
                ? "Get OTP"
                : "Verify and Authenticate"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
