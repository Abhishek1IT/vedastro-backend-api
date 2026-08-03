"use client";

import Link from "next/link";
import { ROUTES } from "../../constants/routes";

export default function HeroContent() {
  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="inline-flex max-w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
        <span></span> Learn from Top Vedic Astrologers
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        Reveal What the <span className="bg-linear-to-r from-amber-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">Stars Decreed</span> For You
      </h1>
      
      <p className="text-base text-slate-400 leading-relaxed sm:text-lg">
        Unlock insights regarding relationships, career pathways, and inner spiritual alignment using specialized interactive Kundli systems and realtime verification engines.
      </p>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href={ROUTES.CONSULTATIONS.ROOT}
          className="rounded-xl bg-linear-to-r from-amber-600 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-950/30 hover:from-amber-500 hover:to-orange-500 transition-all active:scale-[0.98]"
        >
          Consult An Expert Now
        </Link>
        {/* <Link
          href={ROUTES.FREE_SERVICES.KUNDLI}
          className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          Generate Free Kundli
        </Link> */}
      </div>
    </div>
  );
}