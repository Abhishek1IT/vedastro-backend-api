"use client";

interface TypingIndicatorProps {
  receiverName: string;
}

export default function TypingIndicator({ }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-[11px] text-amber-200 bg-slate-900/40 w-fit rounded-lg ml-2 animate-pulse">
      <span className="flex gap-0.5">
        <span className="h-1 w-1 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1 w-1 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1 w-1 bg-amber-300 rounded-full animate-bounce" />
      </span>
      <p>Typing...</p>
    </div>
  );
}