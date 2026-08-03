/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

import {
  LiveAstro,
  TopAstrologers,
  Services,
  Kundli,
  Horoscope,
  WhyChooseUs,
  Testimonials,
  Home as DownloadApp,
  FAQ,
} from "../../components/home";

export default function DashboardHomePage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated, hydrateStore } = useAuthStore();

  useEffect(() => {
    hydrateStore();
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col gap-12 py-8">
      {/* 1. Live & Top Astrologers */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <LiveAstro />
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <TopAstrologers />
      </section>

      {/* 2. Core Astrology Services */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <Services />
      </section>

      {/* 3. Kundli & Horoscope Features */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Kundli />
        <Horoscope />
      </section>

      {/* 4. Trust, Testimonials & App Download */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <WhyChooseUs />
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <Testimonials />
      </section>

      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <DownloadApp />
      </section>

      {/* 5. FAQs */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <FAQ />
      </section>
    </div>
  );
}
