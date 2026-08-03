"use client";

import React from "react";

interface IncomingCallProps {
  callerName: string;
  callType: "audio" | "video";
  onAccept: () => void;
  onDecline: () => void;
}

export default function IncomingCall({ callerName, callType, onAccept, onDecline }: IncomingCallProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border-2 border-amber-500/40 bg-slate-900 p-5 shadow-2xl shadow-amber-500/10 w-80 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3.5 mb-4">
        <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl animate-pulse text-red-400">
          {callType === "video" ? "📹" : "📞"}
        </div>
        <div>
          <h4 className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Incoming Call Loop</h4>
          <p className="text-sm font-black text-white mt-0.5">{callerName}</p>
          <span className="text-[10px] text-slate-500 capitalize">{callType} Consultation Request</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={onDecline}
          className="rounded-xl bg-slate-800 border border-slate-700 py-2 text-xs font-bold text-slate-400 hover:bg-slate-700 hover:text-white transition"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-md shadow-emerald-950/20"
        >
          Accept & Connect
        </button>
      </div>
    </div>
  );
}