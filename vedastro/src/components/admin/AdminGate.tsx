"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const isAdmin = user?.role === "ADMIN";

    if (!isAdmin) {
      router.replace("/login");
    }
  }, [isHydrated, router, user?.role]);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Loading admin access...
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}