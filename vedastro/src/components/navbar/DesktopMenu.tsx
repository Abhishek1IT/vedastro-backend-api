"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";

import { ROUTES } from "../../constants/routes";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

export default function DesktopMenu() {
  const pathname = usePathname();

  const { user } = useAuthStore();

  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: ROUTES.HOME.ROOT },
    { label: "Shop", path: ROUTES.SHOP },
  ];

  const consultationItems =
    user?.role === "ASTROLOGER"
      ? [
          {
            label: "Chat with User",
            href: "/consultations/chat",
            icon: MessageCircle,
          },
          {
            label: "Call with User",
            href: "/consultations/call",
            icon: Phone,
          },
        ]
      : [
          {
            label: "Chat with Astrologer",
            href: "/consultations/chat",
            icon: MessageCircle,
          },
          {
            label: "Call with Astrologer",
            href: "/consultations/call",
            icon: Phone,
          },
        ];

  return (
    <div className="flex items-center gap-6">
      {menuItems.map((item) => {
        const isActive =
          item.path === ROUTES.HOME.ROOT
            ? pathname === item.path
            : pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-amber-400",
              isActive ? "font-semibold text-white" : "text-slate-300",
            )}
          >
            {item.label}
          </Link>
        );
      })}

      {/* Consultation Dropdown */}

      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          className={cn(
            "flex items-center gap-1 text-sm font-medium transition-colors hover:text-amber-400",
            pathname.startsWith("/consultations")
              ? "font-semibold text-white"
              : "text-slate-300",
          )}
        >
          Consultation
          <ChevronDown className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute left-0 top-10 w-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
            {consultationItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-amber-400"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
