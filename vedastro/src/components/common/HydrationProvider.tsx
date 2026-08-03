/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function HydrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const hydrateStore = useAuthStore((state) => state.hydrateStore);

  useEffect(() => {
    hydrateStore();       
    setMounted(true);     
  }, [hydrateStore]);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return <>{children}</>;
}