"use client";

import React from "react";

interface VideoCallProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
}

export default function VideoCall({
  localVideoRef,
  remoteVideoRef,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}: VideoCallProps) {
  return (
    <div className="relative w-full max-w-4xl h-125 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Remote View Stream Screen */}
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80 text-xs text-slate-200">
          Astrologer Screen
        </div>
      </div>

      {/* Floating Local Camera view box */}
      <div className="absolute top-4 right-4 w-32 h-44 bg-slate-950 rounded-xl border border-slate-700 overflow-hidden shadow-xl z-10">
        {isCameraOff ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 bg-slate-900">
            Camera Off
          </div>
        ) : (
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover reversed"
          />
        )}
      </div>

      {/* Floating Media System Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-800">
        <button
          onClick={onToggleMute}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border text-xs ${
            isMuted ? "bg-amber-600/20 border-amber-500 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
          {isMuted ? "🔇" : "🎙️"}
        </button>

        <button
          onClick={onToggleCamera}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border text-xs ${
            isCameraOff ? "bg-amber-600/20 border-amber-500 text-amber-400" : "bg-slate-800 border-slate-700 text-slate-300"
          }`}
        >
          {isCameraOff ? "📷 Off" : "📷 On"}
        </button>

        <button
          onClick={onEndCall}
          className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-lg text-white hover:bg-red-500 transition active:scale-95"
        >
          🛑
        </button>
      </div>
    </div>
  );
}