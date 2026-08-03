"use client";

import React from "react";
import Hero from "../components/hero/Hero";
import Services from "../components/home/Services";
import TopAstrologers from "../components/home/TopAstrologers";
import WhyChooseUs from "../components/home/WhyChooseUs";
import KundliSection from "../components/home/KundliSection";
import HoroscopeSection from "../components/home/HoroscopeSection";
import DownloadApp from "../components/home/DownloadApp";
import FAQ from "../components/home/FAQ";

export default function Page() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-300 space-y-20 pb-20 bg-[#0B0805] text-white">
      <Hero />
      <KundliSection />
      <Services />
      <HoroscopeSection />
      <TopAstrologers />
      <WhyChooseUs />
      <DownloadApp />
      <FAQ />
    </div>
  );
}
