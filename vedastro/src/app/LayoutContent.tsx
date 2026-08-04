"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/common/Footer";
import { useAuthStore } from "../store/authStore";

const HIDDEN_LAYOUT_ROUTES = [
  /^\/login/,
  /^\/register/,
  /^\/(consultations|chat|call)($|\/)/,
];

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  const hydrateStore = useAuthStore((state) => state.hydrateStore);

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  const isAuthOrConsultationRoute = HIDDEN_LAYOUT_ROUTES.some((routeRegex) =>
    routeRegex.test(pathname)
  );

  return (
    <>
      {!isAuthOrConsultationRoute && <Navbar />}

      <main className="min-h-screen dynamic-content-optimization-layer">
        {children}
      </main>

      {!isAuthOrConsultationRoute && <Footer />}
    </>
  );
}