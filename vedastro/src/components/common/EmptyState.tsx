"use client";

import React from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function EmptyState({
  icon = "🛸",
  title,
  description,
  actionLabel,
  onActionClick
}: EmptyStateProps) {
  return (
    <div className="w-full text-center p-8 md:p-12 border border-dashed border-slate-900 bg-slate-900/10 rounded-2xl backdrop-blur-sm max-w-sm mx-auto shadow-xl">
      <span className="text-3xl block mb-4 select-none filter drop-shadow-md">{icon}</span>
      <h3 className="text-xs font-black text-slate-200 tracking-wide">{title}</h3>
      <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-medium mb-6">
        {description}
      </p>
      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition active:scale-98"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}