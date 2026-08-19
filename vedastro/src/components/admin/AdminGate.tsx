"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../../store/authStore";

export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isHydrated = useAuthStore(
    (state) => state.isHydrated,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isHydrated || isLoginPage) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace("/admin/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/home");
      return;
    }
  }, [
    isHydrated,
    isLoginPage,
    isAuthenticated,
    user,
    router,
  ]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading admin access...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Redirecting to admin login...
      </div>
    );
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}