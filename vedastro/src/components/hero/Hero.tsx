"use client";

import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";
import HeroStats from "./HeroStats";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-slate-950 pt-14 pb-20 sm:pb-28">
      {/* Dynamic Back-glow Graphics */}
      <div className="absolute top-0 right-0 -z-10 h-150 w-150 rounded-full bg-linear-to-br from-amber-500/10 to-orange-600/5 blur-[150px]" />
      <div className="absolute top-20 left-10 -z-10 h-100 w-100 rounded-full bg-indigo-500/5 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-12">
          
          {/* Copywrite and Interactive Buttons Column */}
          <div className="max-w-xl lg:max-w-lg">
            <HeroContent />
            <HeroStats />
          </div>

          {/* Graphical Illustration Frame Column */}
          <div className="flex justify-center lg:justify-end">
            <HeroImage />
          </div>

        </div>
      </div>
    </div>
  );
}