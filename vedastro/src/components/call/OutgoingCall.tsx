"use client";

import React from "react";

interface OutgoingCallProps {
  userName: string;
  callType: "audio" | "video";
  onCancelCall: () => void;
}

export default function OutgoingCall({ userName, callType, onCancelCall }: OutgoingCallProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-sm text-center shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-6 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-amber-500/5 opacity-75"></span>
        {callType === "video" ? "📹" : "📞"}
      </div>

      <h3 className="text-base font-bold text-white mb-1">Calling Expert...</h3>
      <p className="text-sm text-slate-300 font-medium mb-2">{userName}</p>
      <p className="text-[11px] text-slate-500 animate-pulse mb-8">Waiting for connection confirmation...</p>

      <button
        onClick={onCancelCall}
        className="w-full rounded-xl bg-slate-800 border border-slate-700 py-3 text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-400 transition"
      >
        Cancel Request
      </button>
    </div>
  );
}