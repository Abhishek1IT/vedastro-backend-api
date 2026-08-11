"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";

interface HydrationProviderProps {
  children: React.ReactNode;
}

export default function HydrationProvider({
  children,
}: HydrationProviderProps) {
  const [mounted, setMounted] = useState(false);

  const hydrateStore = useAuthStore((state) => state.hydrateStore);

  useEffect(() => {
    const hydrate = async () => {
      await hydrateStore();
      setMounted(true);
    };

    hydrate();
  }, [hydrateStore]);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
