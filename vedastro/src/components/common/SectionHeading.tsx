"use client";

import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = false }: SectionHeadingProps) {
  return (
    <div className={`mb-8 border-b border-slate-900 pb-4 ${centered ? "text-center" : "text-left"}`}>
      <h2 className="text-base font-extrabold tracking-wide text-slate-200 uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[10px] text-slate-500 mt-0.5 font-medium tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
}