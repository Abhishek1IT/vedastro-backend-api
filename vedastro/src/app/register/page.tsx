"use client";

import React, { useState } from "react";
import { useRegister } from "../../hooks/useRegister";
import Card from "../../components/ui/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/ui/Badge";

export default function RegisterPage() {
  const { registerUser, loading, error } = useRegister();

  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
  });

  const [localValidationError, setLocalValidationError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalValidationError("");

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim();

    if (cleanName.length < 3) {
      setLocalValidationError(
        "Name must be at least 3 characters long."
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setLocalValidationError("Please enter a valid email address.");
      return;
    }

    if (!form.dob) {
      setLocalValidationError("Please select your date of birth.");
      return;
    }

    await registerUser({
      name: cleanName,
      email: cleanEmail,
      dob: form.dob,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <Card
        hoverEffect={false}
        className="w-full max-w-md rounded-2xl border border-slate-900 bg-slate-900/40 p-6 md:p-8 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-6 text-center">
          <Badge
            variant="amber"
            className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-black mb-3"
          >
            Complete Profile
          </Badge>

          <h2 className="text-xl font-black tracking-tight text-white uppercase">
            Complete Your Profile
          </h2>

          <p className="text-[11px] text-slate-400 mt-2">
            Please complete your profile before continuing.
          </p>
        </div>

        {(localValidationError || error) && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] font-bold text-red-400">
            {localValidationError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase text-slate-500">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase text-slate-500">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-black uppercase text-slate-500">
              Date of Birth
            </label>

            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest"
          >
            {loading ? "Saving Profile..." : "Complete Profile"}
          </Button>
        </form>
      </Card>
    </div>
  );
}