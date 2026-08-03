"use client";

import React from "react";

interface AudioCallProps {
  userName: string;
  duration: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
}

export default function AudioCall({ userName, duration, isMuted, onToggleMute, onEndCall }: AudioCallProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-sm text-center shadow-2xl backdrop-blur-md">
      {/* Avatar Box wrapper */}
      <div className="w-24 h-24 rounded-full bg-linear-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-4xl text-white shadow-lg shadow-orange-950/40 mb-6 animate-pulse">
        🎙️
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{userName}</h3>
      <p className="text-xs text-amber-500 font-semibold mb-8 tracking-wider">{duration || "00:00"}</p>

      {/* Controller Buttons Grid */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleMute}
          className={`w-12 h-12 rounded-xl flex items-center justify-center border text-sm font-bold transition ${
            isMuted 
              ? "bg-amber-600/20 border-amber-500 text-amber-400" 
              : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          }`}
        >
          {isMuted ? "🔇" : "🎙️"}
        </button>

        <button
          onClick={onEndCall}
          className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl text-white hover:bg-red-500 shadow-lg shadow-red-950/40 transition active:scale-95"
        >
          🛑
        </button>
      </div>
    </div>
  );
}