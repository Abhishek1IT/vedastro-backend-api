"use client";

import React, { useState, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onTyping: () => void;
}

export default function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    onTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText("");
  };

  return (
    <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
        className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500/50"
      />
      <button
        onClick={handleSend}
        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
      >
        Send
      </button>
    </div>
  );
}