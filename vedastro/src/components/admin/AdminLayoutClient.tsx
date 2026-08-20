"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import AdminGate from "./AdminGate";
import AdminShell from "./AdminShell";

export default function AdminLayoutClient({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminGate>
      {isLoginPage ? (
        children
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
    </AdminGate>
  );
}