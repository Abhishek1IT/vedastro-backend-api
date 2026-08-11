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

  const { isAuthenticated, isHydrated } = useAuthStore();

  // Redirect if not logged in
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/");
    }
  }, [isHydrated, isAuthenticated, router]);

  // Loading state
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Prevent rendering before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col gap-12 py-8">
      {/* Live Astrologers */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <LiveAstro />
      </section>

      {/* Top Astrologers */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <TopAstrologers />
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <Services />
      </section>

      {/* Kundli Horoscope */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Kundli />
        <Horoscope />
      </section>

      {/* Why Choose */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <WhyChooseUs />
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <Testimonials />
      </section>

      {/* Download App */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <DownloadApp />
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6">
        <FAQ />
      </section>
    </div>
  );
}
