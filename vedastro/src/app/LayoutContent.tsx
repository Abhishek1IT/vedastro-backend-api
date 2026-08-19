"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";

const HIDDEN_LAYOUT_ROUTES = [
  // Auth
  /^\/login(?:\/|$)/,
  /^\/register(?:\/|$)/,

  // Admin
  /^\/admin(?:\/|$)/,

  // Chat / Call
  /^\/chat(?:\/|$)/,
  /^\/call(?:\/|$)/,
  /^\/consultations\/(?:chat|call)(?:\/|$)/,

  // Checkout / Payment
  /^\/checkout(?:\/|$)/,
  /^\/payment(?:\/|$)/,
];

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const hideLayout = HIDDEN_LAYOUT_ROUTES.some((regex) =>
    regex.test(pathname),
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