"use client";

interface OnlineStatusProps {
  isOnline: boolean;
}

export default function OnlineStatus({ isOnline }: OnlineStatusProps) {
  return (
    <span className="text-[10px] text-slate-500 flex items-center gap-1.5 select-none">
      <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}