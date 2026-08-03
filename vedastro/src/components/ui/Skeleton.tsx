"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const variantStyles = {
    text: "h-3 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl"
  };

  return (
    <div 
      className={`animate-pulse bg-slate-900 dark:bg-slate-900 light:bg-slate-200/80 ${variantStyles[variant]} ${className}`} 
    />
  );
}