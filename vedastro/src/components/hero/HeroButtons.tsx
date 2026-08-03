"use client";

import Link from "next/link";
import { ROUTES } from "../../constants/routes";

export default function HeroButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-2">
      <Link
        href={ROUTES.CONSULTATIONS.ROOT}
        className="rounded-xl bg-linear-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 hover:from-amber-500 hover:to-orange-500 transition-all active:scale-[0.98]"
      >
        Consult An Expert Now
      </Link>
      <Link
        href={ROUTES.FREE_SERVICES.KUNDLI}
        className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Generate Free Kundli
      </Link>
    </div>
  );
}