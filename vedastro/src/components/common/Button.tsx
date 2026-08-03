"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "amber"
    | "danger"
    | "ghost"
    | "themeToggle";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-amber-500 hover:bg-amber-600 text-slate-950",
    amber: "bg-amber-500 hover:bg-amber-600 text-slate-950",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white",
    ghost:
      "bg-transparent border border-slate-700 hover:bg-slate-800 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    themeToggle:
      "bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}