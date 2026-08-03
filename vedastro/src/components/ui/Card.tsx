"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export default function Card({ children, hoverEffect = true, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`rounded-2xl border border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-900/10 dark:bg-slate-900/10 light:bg-white p-5 backdrop-blur-sm transition duration-200 ${
        hoverEffect ? "hover:border-slate-800 dark:hover:border-slate-800 light:hover:border-slate-300 hover:shadow-xl hover:shadow-black/5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}