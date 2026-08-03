"use client";

import React from "react";
import { ShieldCheck, Award, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      label: "100% Secure Privacy",
      desc: "Your personal chat histories and birth charts are highly protected.",
      icon: <ShieldCheck className="w-7 h-7 text-[#EAD170]" />,
    },
    {
      label: "Top-Tier Astrologers",
      desc: "Every single advisor completes a thorough 4-step interview mapping loop.",
      icon: <Award className="w-7 h-7 text-[#EAD170]" />,
    },
    {
      label: "Live Instant Access",
      desc: "No long waiting lines; connect directly via web sockets within 30 seconds.",
      icon: <Zap className="w-7 h-7 text-[#EAD170]" />,
    },
  ];

  return (
    <section className="bg-[#0B0805] py-20 border-t border-[#1C1610] font-sans w-full relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
            WHY VEDASTRO
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            Engineered For <span className="text-[#C88029] font-normal">Clarity</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pt-1">
            Why thousands rely on VedAstro for personal consultation pathways.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#140E0A] border border-[#261C14] hover:border-[#422F20] transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#211710] border border-[#3A291D] flex items-center justify-center shadow-md mb-5 group-hover:scale-110 transition-transform">
                {pt.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{pt.label}</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}