"use client";

import React from "react";

interface LoaderProps {
  message?: string;
  fullscreen?: boolean;
}

export default function Loader({ message = "Aligning Cosmic Pipelines...", fullscreen = false }: LoaderProps) {
  const layoutStyle = fullscreen 
    ? "min-h-screen fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center"
    : "py-12 flex flex-col items-center justify-center w-full";

  return (
    <div className={layoutStyle}>
      <div className="relative flex items-center justify-center h-10 w-10">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500/10 opacity-75" />
        <span className="relative inline-flex rounded-full h-6 w-6 border-2 border-slate-800 border-t-amber-500 animate-spin" />
      </div>
      {message && (
        <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-4 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}