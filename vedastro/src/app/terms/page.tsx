"use client";

import React from "react";
import Container from "../../components/common/Container";
import SectionHeading from "../../components/common/SectionHeading";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function TermsPage() {
  const termsSections = [
    {
      heading: "1. Account Credential Rules",
      body: "By generating a profile session token inside our application framework, users verify that their access parameters are authentic. Any malicious packet simulation or identity spoofing leads to immediate registry isolation."
    },
    {
      heading: "2. Computational Advice Boundaries",
      body: "All dynamic charts, horoscopes, and metrics rendered by the calculation engines serve exclusively as informational data indices. Traditional calculation parameters do not represent rigid medical, financial, or legal directives."
    },
    {
      heading: "3. Fulfillment & Ritual Commitments",
      body: "Planetary remedies, energized gems, and special ritual requests are mapped strictly to individual astrological coordinates. Consequently, all store transactions become final and non-refundable once computational initialization begins."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 light:bg-slate-50 text-white dark:text-white light:text-slate-900 pt-24 pb-12 select-none">
      <Container>
        <SectionHeading 
          title="Terms of Service Matrix" 
          subtitle="Legal structural guidelines governing execution layers and marketplace ecosystems." 
        />

        <Card 
          hoverEffect={false} 
          className="max-w-3xl mx-auto space-y-6 border border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-900/5 backdrop-blur-md shadow-xl p-6 md:p-8 rounded-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/60 dark:border-slate-900/60 light:border-slate-100 pb-4">
            <p className="text-[11px] text-slate-500 dark:text-slate-500 light:text-slate-500 tracking-wide font-medium">
              Consensus Protocol Index: <strong className="text-slate-300 dark:text-slate-300 light:text-slate-800">Version 4.2.0-Alpha</strong>
            </p>
            <Badge variant="warning" className="w-fit shrink-0">System Agreement</Badge>
          </div>

          <div className="space-y-6">
            {termsSections.map((clause, idx) => (
              <div key={idx} className="space-y-1.5 animate-in fade-in duration-150">
                <h3 className="text-xs font-black text-slate-200 dark:text-slate-200 light:text-slate-800 tracking-wide uppercase">
                  {clause.heading}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-medium">
                  {clause.body}
                </p>
              </div>
            ))}
          </div>
          
          <Card 
            hoverEffect={false} 
            className="bg-slate-950/40 dark:bg-slate-950/40 light:bg-slate-100 border border-slate-900 dark:border-slate-900 light:border-slate-200 rounded-xl p-4 text-[10px] text-slate-500 dark:text-slate-500 light:text-slate-600 text-center font-bold"
          >
            Continued operation inside the portal console implies absolute alignment with the stated consensus laws.
          </Card>
        </Card>
      </Container>
    </div>
  );
}