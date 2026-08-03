"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../lib/utils";

export default function DesktopMenu() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", path: ROUTES.HOME.ROOT },
    // { label: "Horoscope", path: ROUTES.HOROSCOPE.DAILY },
    { label: "Consultation", path: ROUTES.CONSULTATIONS.ROOT },
    // { label: "Panchang", path: ROUTES.PANCHANG },
    // { label: "Free Services", path: ROUTES.FREE_SERVICES.KUNDLI },
    { label: "Shop", path: ROUTES.SHOP },
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
              isActive ? "text-white font-semibold" : "text-slate-300",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
