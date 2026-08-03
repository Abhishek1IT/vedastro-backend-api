"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../common/Button";

interface HeroCardProps {
  className?: string;
}

export default function HeroCard({ className }: HeroCardProps) {
  const router = useRouter();

  const liveTelemetry = [
    { matrixLabel: "Ascendant Node", dataToken: "24° 12' Mesh", colorCode: "text-amber-500" },
    { matrixLabel: "Dasha Status", dataToken: "Rahu-Mercury", colorCode: "text-orange-500" },
    { matrixLabel: "System Latency", dataToken: "14ms Vector", colorCode: "text-emerald-500" }
  ];

  return (
    <div className={className}>
      <Card 
        hoverEffect={true} 
        className="w-full max-w-md border border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-900/40 backdrop-blur-md shadow-2xl p-6 rounded-3xl relative overflow-hidden transition-all duration-300 group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-center justify-between border-b border-slate-900 dark:border-slate-900 light:border-slate-100 pb-4 mb-4 select-none">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base">🛰️</span>
              <h3 className="text-xs font-black text-white dark:text-white light:text-slate-900 uppercase tracking-wider">
                Live Calculation Stream
              </h3>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-400">
              Active cluster ephemeris telemetry logs.
            </p>
          </div>
          <Badge variant="amber" className="text-[9px] uppercase tracking-widest px-2 py-0.5 animate-pulse font-black">
            Syncing
          </Badge>
        </div>

        <div className="space-y-3 mb-5 select-none">
          {liveTelemetry.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-900/40 dark:border-slate-900/40 light:border-slate-100 bg-slate-950/30 dark:bg-slate-950/30 light:bg-slate-50 hover:bg-slate-900/40 transition duration-150"
            >
              <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-500 light:text-slate-500 tracking-wide">
                {item.matrixLabel}
              </span>
              <span className={`text-xs font-mono font-bold tracking-tight ${item.colorCode}`}>
                {item.dataToken}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-900/40 dark:border-slate-900/40 light:border-slate-100">
          <Button 
            variant="primary" 
            size="md"
            onClick={() => router.push("/panchang")}
            className="w-full py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg shadow-amber-950/20"
          >
            Compute Live Chart Node
          </Button>
          
          <div className="flex items-center justify-center gap-1 text-[9px] text-slate-600 dark:text-slate-600 light:text-slate-400 font-bold uppercase select-none tracking-wide pt-1">
            🔒 End-to-End Cryptographic Calculation Matrix Secured
          </div>
        </div>

      </Card>
    </div>
  );
}