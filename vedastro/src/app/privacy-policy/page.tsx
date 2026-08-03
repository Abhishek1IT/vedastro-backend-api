"use client";

import React from "react";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      heading: "1. Data Vector Collection Layout",
      body: "We cache birth parameters coordinates (Latitude, Longitude, Date, Time) strictly to compute matching planetary charts maps arrays inside local script files. This context configuration parameters can be removed at user request instantly."
    },
    {
      heading: "2. Peer Consultation Stream Safety",
      body: "Our direct media pipes for audio/video consultations run through serverless WebRTC routing networks. Session interactions stream payloads are completely transient and never written into permanent persistent MongoDB storage blocks logs."
    },
    {
      heading: "3. Encryption Parameters",
      body: "All authorization tracking signatures use standardized system JSON Web Tokens (JWT) sent securely over HTTPS channels to defend tracking indices profiles from unauthorized injection matrices."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-white dark:text-white light:text-slate-900 pt-24 pb-12 select-none">
      <Container>
        <SectionHeading 
          title="Privacy Policy Matrix" 
          subtitle="Legal structural architectures regulating internal data telemetry pipelines." 
        />
        
        <Card 
          hoverEffect={false} 
          className="max-w-3xl mx-auto space-y-6 border border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-900/5 backdrop-blur-md shadow-xl p-6 md:p-8 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/60 dark:border-slate-900/60 light:border-slate-100 pb-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-500 light:text-slate-500 tracking-wide font-medium">
              Effective Version Tracking Index: <strong className="text-slate-300 dark:text-slate-300 light:text-slate-800">July 2026</strong>. This legal clause controls absolute privacy metrics across all routing scopes inside the VedAstro domain layers.
            </p>
            <Badge variant="error" className="w-fit shrink-0">Security Vault</Badge>
          </div>

          <div className="space-y-6">
            {policySections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5 animate-in fade-in duration-150">
                <h3 className="text-xs font-extrabold text-slate-200 dark:text-slate-200 light:text-slate-800 tracking-wide uppercase">
                  {sec.heading}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>
          
          <Card 
            hoverEffect={false} 
            className="bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 border border-slate-900 dark:border-slate-900 light:border-slate-200 rounded-xl p-4 text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-600 text-center font-bold"
          >
            Compliance parameters match global decentralized encryption design protocols cleanly.
          </Card>
        </Card>
      </Container>
    </div>
  );
}