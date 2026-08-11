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

  const isHydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);

  const isLoginPage = pathname === "/admin/login";
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    // Admin login page ko protect mat karo
    if (isLoginPage) return;

    // Auth hydration complete hone do
    if (!isHydrated) return;

    // User nahi hai ya admin nahi hai
    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [isLoginPage, isHydrated, user, router]);

  // Login page always accessible
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Redirecting to admin login...
      </div>
    );
  }

  return <>{children}</>;
}
