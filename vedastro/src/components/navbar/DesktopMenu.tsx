/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "../../constants/routes";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../store/authStore";

interface DesktopMenuProps {
  isScrolled?: boolean;
}

type MenuItem = {
  label: string;
  path: string;
};

export default function DesktopMenu({
  isScrolled = false,
}: DesktopMenuProps) {
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);

  const menuItems: MenuItem[] = [
    {
      label: "Consultation",
      path: ROUTES.CONSULTATIONS.ROOT,
    },
    {
      label: "Shop",
      path: ROUTES.SHOP,
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.path ||
          pathname.startsWith(`${item.path}/`);

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-(--accent)",
              isScrolled
                ? isActive
                  ? "font-bold text-(--accent)"
                  : "text-black"
                : isActive
                  ? "font-bold text-amber-700"
                  : "text-amber-500/80",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}