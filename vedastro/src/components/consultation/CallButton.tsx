"use client";

import { useRouter } from "next/navigation";

interface CallButtonProps {
  astroId: string;
  isOnline: boolean;
}

export default function CallButton({ astroId, isOnline }: CallButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => isOnline && router.push(`/consultations/call?astroId=${astroId}`)}
      disabled={!isOnline}
      className="flex-1 rounded-xl bg-linear-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 py-2 text-xs font-bold shadow-md shadow-orange-950/20 transition text-center disabled:from-slate-800 disabled:to-slate-800 disabled:opacity-40"
    >
      📹 Call
    </button>
  );
}