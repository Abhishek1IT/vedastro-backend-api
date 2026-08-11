"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";

const HIDDEN_LAYOUT_ROUTES = [
  /^\/login(?:\/|$)/,
  /^\/register(?:\/|$)/,
  /^\/admin\/login(?:\/|$)/,

  // Chat / Call
  /^\/(?:chat|call)(?:\/|$)/,
  /^\/consultations\/(?:chat|call)(?:\/|$)/,

  // Cart / Checkout
  /^\/(?:cart|checkout)(?:\/|$)/,
  /^\/product\/([^\/]+)\/(\d+)(?:\/|$)/,

  // Admin Dashboard
  // /^\/admin(?:\/|$)/,
];

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const isHiddenRoute = HIDDEN_LAYOUT_ROUTES.some((regex) =>
    regex.test(pathname),
  );

  return (
    <>
      {!isHiddenRoute && <Navbar />}

      <main className="min-h-screen dynamic-content-optimization-layer">
        {children}
      </main>

      {!isHiddenRoute && <Footer />}
    </>
  );
}
