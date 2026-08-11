"use client";

import React, { useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (text: string) => void | Promise<void>;
  onTyping: () => void;
}

export default function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setText(value);

    if (value.trim()) {
      onTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSend = async () => {
    const cleanText = text.trim();

    if (!cleanText) return;

    if (sending) return;

    try {
      setSending(true);

      await onSendMessage(cleanText);

      // Clear only after send completes
      setText("");
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (sending) return;

    void handleSend();
  };

  return (
    <div className="flex gap-2 border-t border-slate-800 bg-slate-950 p-3">
      <input
        type="text"
        value={text}
        disabled={sending}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={sending ? "Sending..." : "Type your message..."}
        className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-100 focus:border-amber-500/50 focus:outline-none disabled:opacity-50"
      />

      <button
        type="button"
        disabled={sending || !text.trim()}
        onClick={() => void handleSend()}
        className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
