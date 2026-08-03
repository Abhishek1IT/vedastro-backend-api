"use client";

import React from "react";
import Rating from "./Rating";
import ChatButton from "./ChatButton";
import CallButton from "./CallButton";

interface AstrologerCardProps {
  id: string;
  name: string;
  skills: string[];
  experience: number;
  ratePerMinute: number;
  rating: number;
  isOnline: boolean;
}

export default function AstrologerCard({
  id,
  name,
  skills,
  experience,
  ratePerMinute,
  rating,
  isOnline,
}: AstrologerCardProps) {
  return (
    <div className="rounded-2xl border border-slate-950 bg-slate-900/20 backdrop-blur-md p-5 flex flex-col justify-between shadow-xl relative hover:border-slate-900 transition duration-200 group">
      
      {/* Top Details Layer */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="truncate">
            <h4 className="text-sm font-extrabold text-white group-hover:text-amber-400 transition truncate">
              {name}
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5 font-medium select-none">
              Exp: {experience} Years
            </p>
          </div>
          <Rating value={rating} />
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="text-[9px] font-bold text-slate-400 bg-slate-950/60 border border-slate-900/80 px-2 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-950/60">
        <div className="flex items-center justify-between mb-3.5 select-none">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Rate</span>
          <span className="text-xs font-black text-amber-500">₹{ratePerMinute}/min</span>
        </div>

        <div className="flex items-center gap-2">
          <ChatButton astroId={id} isOnline={isOnline} />
          <CallButton astroId={id} isOnline={isOnline} />
        </div>
      </div>

      <div className="absolute top-4 left-4 hidden">
        <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-600"}`} />
      </div>

    </div>
  );
}