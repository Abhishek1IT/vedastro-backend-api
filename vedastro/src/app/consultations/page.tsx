"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

interface DashboardStat {
  label: string;
  value: string;
  icon: string;
}

interface ActionCard {
  title: string;
  description: string;
  link: string;
  icon: string;
  color: string;
  badge?: string;
}

export default function ConsultationsHubPage() {
  const [liveAstroCount, setLiveAstroCount] = useState<number>(12);

  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const handleProtectedNavigation = (link: string) => {
    if (
      !user?.profileCompleted &&
      (link === "/consultations/chat" || link === "/consultations/call")
    ) {
      router.push(`/register?redirect=${encodeURIComponent(link)}`);
      return;
    }

    router.push(link);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAstroCount((prev) =>
        Math.random() > 0.5 ? Math.min(prev + 1, 18) : Math.max(prev - 1, 8),
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const systemStats: DashboardStat[] = [
    {
      label: "Active Experts Online",
      value: `${liveAstroCount} Live`,
      icon: "🟢",
    },
    { label: "Pending Requests", value: "0 Active", icon: "⏳" },
  ];

  const coreModules: ActionCard[] = [
    {
      title: "Browse Verified Astrologers",
      description:
        "Filter through elite verified experts by skillsets, experience charts, or pricing models to launch manual bookings.",
      link: "/consultations/astrologers",
      icon: "📇",
      color: "from-slate-900 via-slate-900 to-slate-900",
    },
    {
      title: "Secure Live Chat Room",
      description:
        "Launch responsive real-time socket sessions to chat instantly and exchange textual birth chart details.",
      link: "/consultations/chat",
      icon: "💬",
      color: "from-amber-600/10 to-orange-600/10",
      badge: "Fast Connection",
    },
    {
      title: "WebRTC Audio/Video Call",
      description:
        "Establish peer-to-peer secure low-latency audio/video media streams for high-definition face-to-face analysis.",
      link: "/consultations/call",
      icon: "📹",
      color: "from-blue-600/10 to-indigo-600/10",
      badge: "HD Link",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start p-4 sm:p-8 lg:p-12">
      <Link
        href="/home"
        className="inline-flex items-center text-[11px] font-bold text-amber-500 hover:text-amber-400 tracking-wide gap-1 w-full"
      >
        <span className="transform group-hover:translate-x-0.5 transition">
          ← Back
        </span>
      </Link>

      {/* Top Welcome Title Banner */}
      <div className="w-full max-w-5xl mb-12 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-linear-to-r from-amber-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Consultation Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 tracking-wide max-w-xl">
              Connect to your customized spiritual advisor network pipelines.
              Select a communication channel below to stream active computations
              securely.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Status Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl mb-10 select-none">
        {systemStats.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-slate-900 bg-slate-900/10 backdrop-blur-md flex items-center justify-between shadow-lg"
          >
            <div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {stat.label}
              </p>
              <h3 className="text-sm font-black text-slate-200 mt-1 tracking-wide">
                {stat.value}
              </h3>
            </div>
            <span className="text-lg bg-slate-950/40 p-2 rounded-lg border border-slate-900/40">
              {stat.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Main Structural Modules Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {coreModules.map((module, idx) => (
          <div
            key={idx}
            className={`group relative rounded-2xl border border-slate-900 bg-linear-to-br ${module.color} p-6 backdrop-blur-md shadow-2xl transition-all hover:border-slate-800 flex flex-col justify-between`}
          >
            {module.badge && (
              <span className="absolute top-4 right-4 text-[8px] font-extrabold tracking-widest uppercase bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
                {module.badge}
              </span>
            )}

            <div>
              <div className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center text-lg text-white mb-5 shadow-inner group-hover:scale-105 transition">
                {module.icon}
              </div>
              <h3 className="text-xs font-bold tracking-wide text-slate-100">
                {module.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed font-medium">
                {module.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-900/60">
              <button
                onClick={() => handleProtectedNavigation(module.link)}
                className="inline-flex items-center text-[11px] font-bold text-amber-500 hover:text-amber-400 tracking-wide gap-1 w-full"
              >
                Access Channel Workspace
                <span className="transform group-hover:translate-x-0.5 transition">
                  →
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines Blockquote Alert Area */}
      <div className="w-full max-w-5xl bg-slate-900/20 border border-slate-900 rounded-xl p-4 text-[10px] text-slate-500 flex items-center gap-2.5">
        <span className="text-sm">⚠️</span>
        <p>
          <strong>Security Protocol Notice:</strong> Ensure camera/mic
          peripheral permissions are authorized within your client-side tab
          configurations before launching the WebRTC active stream loop.
        </p>
      </div>
    </div>
  );
}
