"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";

const HIDDEN_LAYOUT_ROUTES = [
  // Auth
  /^\/login(?:\/|$)/i,
  /^\/register(?:\/|$)/i,

  // Admin
  /^\/admin$/i,
  /^\/admin\/login$/i,
  /^\/admin\/products$/i,
  /^\/admin\/products\/create$/i,
  /^\/admin\/products\/[^/]+$/i,
  /^\/admin\/products\/[^/]+\/edit$/i,

  // Chat / Call
  /^\/chat(?:\/|$)/i,
  /^\/call(?:\/|$)/i,
  /^\/consultations\/(?:chat|call)(?:\/|$)/i,
  /^\/astrologer\/messages(?:\/|$)/i,

  // Checkout / Payment
  /^\/checkout(?:\/|$)/i,
  /^\/payment(?:\/|$)/i,
];

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const hideLayout = HIDDEN_LAYOUT_ROUTES.some((regex) =>
    regex.test(pathname)
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className="min-h-screen dynamic-content-optimization-layer">
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}