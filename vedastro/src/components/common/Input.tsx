"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1.5 select-none">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border ${
          error ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-amber-500/50"
        } bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-700 font-medium focus:outline-none focus:ring-1 ${
          error ? "focus:ring-red-500/20" : "focus:ring-amber-500/20"
        } transition duration-200 ${className}`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-bold text-red-400 mt-1.5 tracking-wide pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}