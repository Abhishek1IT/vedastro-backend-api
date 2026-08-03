"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),linear-gradient(180deg,#08111f_0%,#050816_100%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl shadow-black/30 backdrop-blur xl:block">
          <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/80">
              VedAstro Admin
            </p>
            <h1 className="mt-2 text-2xl font-black text-white">
              Control Center
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Manage products, users, astrologers, and conversations in one place.
            </p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-amber-400 text-slate-950"
                      : "border border-white/5 bg-white/5 text-slate-200 hover:border-amber-400/30 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}