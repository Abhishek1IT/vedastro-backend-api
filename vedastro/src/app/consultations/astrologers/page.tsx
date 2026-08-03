/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import api from "../../../lib/axios";

export default function AstrologersPage() {
  const [astrologers, setAstrologers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);

        const res = await api.get("/user/astrologers");

        console.log("ASTROLOGERS:", res.data);

        const data = res.data;

        if (Array.isArray(data)) {
          setAstrologers(data);
        } else if (data?.astrologers && Array.isArray(data.astrologers)) {
          setAstrologers(data.astrologers);
        } else if (data?.data && Array.isArray(data.data)) {
          setAstrologers(data.data);
        } else {
          setAstrologers([]);
        }
      } catch (error) {
        console.error("Astrologers Error:", error);

        setAstrologers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Link href="/consultations" className="text-amber-500 text-sm">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-amber-500">
        Available Astrologers
      </h1>

      {loading ? (
        <div className="text-slate-400">Loading astrologers...</div>
      ) : astrologers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {astrologers.map((astro: any) => (
            <div
              key={astro._id || astro.id}
              className="p-4 border border-slate-800 rounded-xl bg-slate-900/50"
            >
              <h3 className="font-bold text-lg">
                {astro.name || "Astro Expert"}
              </h3>

              <p className="text-xs text-slate-400">
                {astro.specialities?.join(", ") ||
                  astro.expertise ||
                  "Vedic Astrology"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-500 border border-slate-900 p-8 rounded-xl text-center">
          No astrologers online at the moment.
        </div>
      )}
    </div>
  );
}
