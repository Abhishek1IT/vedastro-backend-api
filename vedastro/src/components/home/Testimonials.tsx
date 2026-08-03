/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      text: "The Kundli logic accurately mapped my timeline changes! The connection speed was flawless and the astrologer provided immediate clarity.",
      user: "Abhishek K.",
      status: "Verified User",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      text: "Acharya Vashisth gave deeply profound advice on my family transition charts. Highly recommended for anyone seeking honest direction.",
      user: "Priya R.",
      status: "Premium Client",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="bg-[#0B0805] py-20 border-t border-[#1C1610] font-sans w-full relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[#B57E43] text-xs font-semibold tracking-[0.2em] uppercase">
            REAL STORIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            User <span className="text-[#C88029] font-normal">Success Stories</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Read how authentic consultations helped transform life pathways.
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#261C14] bg-[#140E0A] p-6 shadow-xl relative flex flex-col justify-between hover:border-[#422F20] transition-all duration-300 group"
            >
              {/* Background Quote Watermark */}
              <Quote className="w-10 h-10 text-[#2B1F16] absolute top-4 right-4 rotate-180 pointer-events-none group-hover:text-[#3D2C1E] transition-colors" />

              <div className="space-y-4 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#EAD170] text-[#EAD170]"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* User Profile Footer */}
              <div className="border-t border-[#231A12] pt-4 mt-6 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.avatar}
                    alt={rev.user}
                    className="w-9 h-9 rounded-full object-cover border border-[#3A291D]"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1">
                      {rev.user}
                      <CheckCircle2 className="w-3 h-3 text-blue-400 inline" />
                    </h3>
                    <p className="text-[10px] text-gray-500">Guided Consultation</p>
                  </div>
                </div>

                {/* Status Badge */}
                <span className="text-[10px] bg-[#211710] text-[#EAD170] border border-[#3A291D] px-2.5 py-1 rounded-full font-medium">
                  {rev.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}