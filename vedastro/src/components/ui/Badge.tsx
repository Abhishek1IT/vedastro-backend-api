"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
  | "success"
  | "warning"
  | "error"
  | "slate"
  | "amber"
  | "ghost"
  | "primary"
  | "secondary";
  className?: string;
}

export default function Badge({
  children,
  variant = "slate",
  className = "",
}: BadgeProps) {
  const styles = {
    success:
      "bg-(--success) text-black",
    warning:
      "bg-(--warning) text-amber-400",
    error:
      "bg-(--error) text-amber-400",
    slate:
      "bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600",
    amber:
      "bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-500/20 text-amber-500",
    secondary:
      "bg-slate-800 dark:bg-slate-800 light:bg-slate-300 border-slate-600 dark:border-slate-600 light:border-slate-400 text-slate-400 dark:text-slate-400 light:text-slate-600",
    primary:
      "bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-100 border-blue-500/20 text-blue-400 dark:text-blue-400 light:text-blue-700",
    ghost:
      "bg-transparent border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-extrabold uppercase tracking-wider select-none ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
