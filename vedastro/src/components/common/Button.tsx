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
    primary: "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-slate-950",
    amber: "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-slate-950",
    secondary: "bg-[var(--surface-tertiary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border-strong)]",
    ghost:
      "bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    themeToggle:
      "bg-[var(--surface-secondary)] text-[var(--accent)] border border-[var(--border)] hover:bg-[var(--surface-tertiary)]",
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
