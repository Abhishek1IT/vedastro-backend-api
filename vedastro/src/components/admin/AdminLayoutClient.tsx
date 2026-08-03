"use client";

import type { ReactNode } from "react";
import AdminGate from "./AdminGate";
import AdminShell from "./AdminShell";

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}