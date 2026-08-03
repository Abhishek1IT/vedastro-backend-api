"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/60 backdrop-blur-md py-6 mt-12 select-none">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-medium text-slate-500 tracking-wide">
        
        <p>© {year} VedAstro Computing System. Data Nodes Encrypted.</p>
        
        <div className="flex flex-wrap justify-center gap-4 text-slate-400">
          <Link href="/privacy-policy" className="hover:text-amber-500 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-500 transition">Terms of Service</Link>
          <Link href="/about" className="hover:text-amber-500 transition">About System</Link>
          <Link href="/contact" className="hover:text-amber-500 transition">Support Terminal</Link>
        </div>

      </div>
    </footer>
  );
}