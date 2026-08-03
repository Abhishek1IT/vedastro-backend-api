"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import Button from "../../components/common/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function AboutPage() {
  const router = useRouter();

  const platformMetrics = [
    { value: "500+", title: "Verified Experts" },
    { value: "2M+", title: "Sessions Served" },
    { value: "99.4%", title: "Accuracy Feedback" },
    { value: "24/7", title: "Active Channels" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-white dark:text-white light:text-slate-900 pt-24 pb-12 select-none">
      <Container>
        <SectionHeading
          title="About VedAstro Engine"
          subtitle="Synthesizing traditional planetary ephemeris data structures with low-latency modern engineering."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="amber">Core Mission</Badge>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
              VedAstro bridges ancient computation methodologies cleanly with
              modern realtime client channels. We substitute vagueness with
              programmatic precision, making calculations highly reliable for
              active user decision streams.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
              Every peer-to-peer session runs on top of secure WebSockets rooms,
              while live consultations streams use end-to-end encrypted WebRTC
              hardware pipelines to protect user profile data records strictly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {platformMetrics.map((metric, i) => (
              <Card
                key={i}
                hoverEffect={true}
                className="text-center p-5 bg-slate-900/10 backdrop-blur-xs"
              >
                <h4 className="text-xl font-black text-white dark:text-white light:text-slate-900 tracking-tight">
                  {metric.value}
                </h4>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                  {metric.title}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Card className="space-y-3">
            <span className="text-lg">🧮</span>
            <h3 className="text-xs font-black text-slate-200 dark:text-slate-200 light:text-slate-800 uppercase tracking-wide">
              Micro-Degree Precision
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Our system avoids raw assumptions. It extracts deep mathematical
              alignment matrices directly via real-time astronomical coordinate
              nodes down to absolute localized horizons.
            </p>
          </Card>

          <Card className="space-y-3">
            <span className="text-lg">🛡️</span>
            <h3 className="text-xs font-black text-slate-200 dark:text-slate-200 light:text-slate-800 uppercase tracking-wide">
              Authenticated Advisory
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed">
              Every certified consultant on our portal passes through rigorous
              computational profiling checks, ensuring you collaborate with pure
              verified ecosystem practitioners.
            </p>
          </Card>
        </div>

        <Card
          hoverEffect={false}
          className="border-amber-500/20 bg-linear-to-r from-amber-600/5 to-transparent mb-12"
        >
          <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-1">
            Ecosystem Statistics Update
          </h4>
          <p className="text-[11px] text-slate-300 dark:text-slate-300 light:text-slate-700 leading-relaxed">
            Processing over 100,000+ data coordinates per minute to maintain
            active planetary position caches, sync real-time consultation
            sessions, and verify marketplace orders cleanly.
          </p>
        </Card>

        <div className="border border-dashed border-slate-900 dark:border-slate-900 light:border-slate-300 bg-slate-900/10 rounded-2xl p-6 text-center max-w-2xl mx-auto backdrop-blur-xs">
          <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-2">
            Audit your cosmic transit lines interactively today
          </h4>
          <p className="text-[10px] text-slate-500 mb-6 font-medium">
            Create your profile token configuration matrix to begin tracking
            indices.
          </p>
          <button onClick={() => router.push("/login")}>Get Started</button>
        </div>
      </Container>
    </div>
  );
}
