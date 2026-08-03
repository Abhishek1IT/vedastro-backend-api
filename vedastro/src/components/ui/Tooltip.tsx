"use client";

import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-[10px] font-bold text-slate-300 whitespace-nowrap shadow-2xl animate-in fade-in zoom-in-95 duration-100 pointer-events-none select-none">
          {content}
        </div>
      )}
    </div>
  );
}