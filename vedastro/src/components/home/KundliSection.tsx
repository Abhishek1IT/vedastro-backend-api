"use client";

// import Link from "next/link";
// import { ROUTES } from "../../constants/routes";

export default function KundliSection() {
  return (
    <section className="bg-[#0B0805] py-12 px-4 sm:px-6 md:px-12 border-t border-[#1C1610] w-full font-sans">
      <div className="max-w-7xl mx-auto w-full">
        <div className="relative overflow-hidden rounded-3xl border border-[#2B1F16] bg-linear-to-r from-[#140E0A] via-[#1A120D] to-[#140E0A] p-6 sm:p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />
          
          {/* Left Text Content */}
          <div className="max-w-xl text-center lg:text-left z-10 space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white leading-tight">
              Comprehensive <br className="hidden sm:inline" />
              <span className="text-white font-semibold">Birth Chart Matching</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Input precise geographical location vectors alongside temporal markers to map deep horoscope charts, compatibility scores, and planetary configurations.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 shrink-0 z-10 w-full lg:w-auto">
            {/* <Link
              href={ROUTES.FREE_SERVICES.KUNDLI}
              className="w-full sm:w-auto text-center rounded-full bg-linear-to-r from-amber-600 to-orange-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-orange-950/40 hover:from-amber-500 hover:to-orange-500 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            > */}
              Create Kundli Map
            {/* </Link> */}
            {/* <Link
              href={ROUTES.FREE_SERVICES.MATCHING}
              className="w-full sm:w-auto text-center rounded-full border border-[#3A2C20] bg-[#211710]/60 px-6 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:bg-[#322318] hover:text-white transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            > */}
              Kundli Milan (Matching)
            {/* </Link> */}
          </div>

        </div>
      </div>
    </section>
  );
}