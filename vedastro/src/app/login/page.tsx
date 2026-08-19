/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useLogin } from "../../hooks/useLogin";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";

type LoginRole = "USER" | "ASTROLOGER";

type Step = "role" | "mobile" | "otp";

export default function LoginPage() {
  const { sendOtp, verifyOtp, otpSent, loading, error } = useLogin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/home";

  const [step, setStep] = useState<Step>("role");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [role, setRole] = useState<LoginRole>("USER");
  const [localValidationError, setLocalValidationError] = useState("");

  const handleRoleSelect = (selectedRole: LoginRole) => {
    setRole(selectedRole);
    setLocalValidationError("");
    setStep("mobile");
  };

  const handleSendOtp = async () => {
    setLocalValidationError("");

    const cleanPhone = phone.replace(/\D/g, "").trim();

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setLocalValidationError(
        "mobile number.",
      );
      return;
    }

    try {
      await sendOtp(cleanPhone, role);

      setPhone(cleanPhone);
      setStep("otp");
    } catch (error) {
      console.error("SEND OTP ERROR:", error);
    }
  };

  const handleVerifyOtp = async () => {
    setLocalValidationError("");

    const cleanPhone = phone.replace(/\D/g, "").trim();
    const cleanOtp = otpCode.replace(/\D/g, "").trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      setLocalValidationError(
        " ",
      );
      return;
    }

    try {
      const user = await verifyOtp(
        cleanPhone,
        cleanOtp,
        role
      );

      if (!user) {
        return;
      }

      console.log("LOGIN PAGE USER:", user);

      const userRole = String(user.role).toUpperCase();

      // ADMIN
      if (userRole === "ADMIN") {
        router.replace("/admin");
        return;
      }

      // ASTROLOGER
      if (userRole === "ASTROLOGER") {
        // Profile not completed
        if (user.profileCompleted !== true) {
          router.replace(
            `/profile?redirect=${encodeURIComponent(
              redirect
            )}`
          );
          return;
        }

        // Waiting for admin approval
        if (user.approvalStatus === "PENDING") {
          router.replace("/astrologer/pending");
          return;
        }

        // Admin rejected
        if (user.approvalStatus === "REJECTED") {
          router.replace("/profile");
          return;
        }

        // Admin approved
        if (user.approvalStatus === "APPROVED") {
          router.replace("/astrologer/dashboard");
          return;
        }

        // Safety fallback
        router.replace("/astrologer/pending");
        return;
      }

      // USER
      if (userRole === "USER") {
        if (user.profileCompleted === true) {
          router.replace("/home");
          return;
        }

        router.replace(
          `/profile?redirect=${encodeURIComponent(
            redirect
          )}`
        );

        return;
      }

      // Unknown role
      router.replace("/home");
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);
    }
  };

  const displayedError = localValidationError || error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <Card hoverEffect={false} className="w-full max-w-md">
        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Login to Verify</h1>

          <p className="mt-2 text-[10px] text-slate-500">
            {step === "role"}

            {step === "mobile" && "Enter your mobile number."}

            {step === "otp" && "Enter the 6-digit OTP sent to your mobile."}
          </p>
        </div>

        {/* ERROR */}
        {displayedError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] font-bold text-red-400">
            {displayedError}
          </div>
        )}

        {/* STEP 1 - ROLE */}
        {step === "role" && (
          <div className="space-y-4">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              Login As
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("USER")}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm font-semibold text-slate-300 transition hover:border-amber-500 hover:bg-amber-500 hover:text-black"
              >
                👤
                <span className="mt-2 block">User</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect("ASTROLOGER")}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm font-semibold text-slate-300 transition hover:border-amber-500 hover:bg-amber-500 hover:text-black"
              >
                🔮
                <span className="mt-2 block">Astrologer</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 - MOBILE */}
        {step === "mobile" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Login As
              </p>

              <p className="mt-1 text-sm font-bold text-amber-400">
                {role === "ASTROLOGER" ? "Astrologer" : "User"}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Mobile Number
              </label>

              <input
                type="tel"
                value={phone}
                maxLength={10}
                autoFocus
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter Mobile Number"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>

            <Button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setPhone("");
                setLocalValidationError("");
                setStep("role");
              }}
              className="w-full text-xs text-slate-500 hover:text-white"
            >
              ← Change Role
            </button>
          </div>
        )}

        {/* STEP 3 - OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Login As
              </p>

              <p className="mt-1 text-sm font-bold text-amber-400">
                {role === "ASTROLOGER" ? "Astrologer" : "User"}
              </p>

              <p className="mt-2 text-xs text-slate-400">+91 {phone}</p>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                OTP
              </label>

              <input
                type="text"
                value={otpCode}
                maxLength={6}
                autoFocus
                inputMode="numeric"
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-center text-sm font-bold tracking-[0.4em] text-white outline-none focus:border-amber-500"
              />
            </div>

            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setOtpCode("");
                  setLocalValidationError("");
                  setStep("mobile");
                }}
                className="text-xs text-slate-500 hover:text-white"
              >
                ← Change Number
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSendOtp}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
