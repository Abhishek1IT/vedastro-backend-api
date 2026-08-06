"use client";

import { useRouter } from "next/navigation";

interface ChatButtonProps {
  astroId: string;
  isOnline: boolean;
}

export default function ChatButton({ astroId, isOnline }: ChatButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        isOnline && router.push(`/consultations/chat?astroId=${astroId}`)
      }
      disabled={!isOnline}
      className="flex-1 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700/80 hover:text-white py-2 text-xs font-bold text-slate-300 transition text-center disabled:opacity-40 disabled:hover:bg-slate-800 disabled:hover:text-slate-300"
    >
      Chat
    </button>
  );
}
