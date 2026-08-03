"use client";

import React, { useState } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallbackText: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

export default function Avatar({ src, alt = "Profile", fallbackText, size = "md", isOnline }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const dimensionStyles = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-sm"
  };

  const initialString = fallbackText.trim().substring(0, 2).toUpperCase();

  return (
    <div className="relative inline-block select-none shrink-0">
      <div className={`rounded-full border border-slate-800 bg-slate-900 text-slate-400 flex items-center justify-center overflow-hidden font-black tracking-wider ${dimensionStyles[size]}`}>
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={src} 
            alt={alt} 
            onError={() => setHasError(true)}
            className="h-full w-full object-cover" 
          />
        ) : (
          <span>{initialString}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-slate-950 ${
          isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-700"
        }`} />
      )}
    </div>
  );
}