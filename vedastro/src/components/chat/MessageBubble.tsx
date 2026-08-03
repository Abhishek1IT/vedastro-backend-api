"use client";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isMe: boolean;
}

export default function MessageBubble({ text, timestamp, isMe }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} w-full`}>
      <div className={`max-w-[75%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
        isMe 
          ? "bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-br-none shadow-md shadow-orange-950/20" 
          : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"
      }`}>
        <p className="whitespace-pre-wrap wrap-break-word">{text}</p>
        <span className="block text-[9px] text-right mt-1 opacity-60 tracking-tighter select-none">
          {timestamp}
        </span>
      </div>
    </div>
  );
}