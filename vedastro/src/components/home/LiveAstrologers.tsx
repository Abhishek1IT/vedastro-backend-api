/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LiveAstrologers: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#0D0905] text-white flex flex-col justify-between font-sans relative overflow-hidden">

      {/* 2. Hero Content Section */}
      <main className="max-w-7xl mx-auto w-full min-w-0 px-4 sm:px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 relative z-10">

        {/* Left Column Text */}
        <div className="lg:col-span-6 space-y-6">

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl font-light leading-tight tracking-tight">
            India&apos;s most accurate <br />
            <span className="text-[#E5882B] font-normal">astrology platform</span>
          </h1>

          {/* Highlights */}
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#EAD170]" />
            </div>
          </div>

          <div className="pt-2">
            <Link href="consultations">
              <button className="bg-[#EAD170] text-black font-semibold px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-yellow-400 transition-transform hover:scale-105 shadow-xl shadow-yellow-500/10">
                Start Free Chat <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Astrologer Portrait Cards */}
        <div className="lg:col-span-6 flex items-center justify-center gap-4 py-8 overflow-hidden">
          {/* Card 1 */}
          <div className="w-24 h-40 sm:w-32 sm:h-52 md:w-40 md:h-64 rounded-full overflow-hidden border border-[#3A2A1A] relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=80"
              alt="Astrologer 1"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Center Card */}
          <div className="w-32 h-56 sm:w-44 sm:h-72 md:w-56 md:h-96 rounded-full overflow-hidden border-2 border-[#EAD170] relative shrink-0 shadow-2xl shadow-yellow-600/20">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80"
              alt="Astrologer Center"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card 3 */}
          <div className="w-24 h-40 sm:w-32 sm:h-52 md:w-40 md:h-64 rounded-full overflow-hidden border border-[#3A2A1A] relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
              alt="Astrologer 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </main>

      {/* 3. Live Activity Ticker Bar */}
      <footer className="bg-[#080503] py-3 px-4 sm:px-6 border-t border-white/5 text-xs text-gray-400 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-x-6">

          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
            <span className="truncate">
              with <strong className="text-white">Acharya Prem</strong> · 2 min ago
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
            <span className="wrap-break-word">
              <strong className="text-white">Rahul</strong> from Mumbai booked Saturn puja with{" "}
              <strong className="text-[#EAD170]">Pt. Ram Naresh</strong> · just now
            </span>
          </div>

          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
            <span className="wrap-break-word">
              <strong className="text-white">Neha</strong> from Hyderabad got her Kundli read by{" "}
              <strong className="text-[#EAD170]">Saanvi Sharma</strong> · 4 min ago
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LiveAstrologers;
