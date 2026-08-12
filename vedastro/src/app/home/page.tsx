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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col gap-12 py-8">
      {/* Live Astrologers */}
      <section className="w-full p-0">
        <LiveAstro />
      </section>

      {/* Top Astrologers */}
      <section className="w-full px-4 sm:px-6">
        <TopAstrologers />
      </section>

      {/* Services */}
      <section className="w-full px-4 sm:px-6">
        <Services />
      </section>

      {/* Kundli */}
      <section className="w-full px-4 sm:px-6">
        <Kundli />
      </section>

      {/* Horoscope */}
      <section className="w-full px-4 sm:px-6">
        <Horoscope />
      </section>

      {/* Why Choose */}
      <section className="w-full px-4 sm:px-6">
        <WhyChooseUs />
      </section>

      {/* Testimonials */}
      <section className="w-full px-4 sm:px-6">
        <Testimonials />
      </section>

      {/* Download App */}
      <section className="w-full px-4 sm:px-6">
        <DownloadApp />
      </section>

      {/* FAQ */}
      <section className="w-full px-4 sm:px-6">
        <FAQ />
      </section>
    </div>
  );
}
