"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "../../constants/routes";
import { cn } from "../../lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
}: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const menuItems = [
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
    <div className="md:hidden w-full border-t border-slate-900 bg-slate-950 px-4 py-3.5">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block w-full rounded-xl px-3 py-3 text-sm font-bold transition",
                isActive
                  ? "bg-slate-900 text-amber-500"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}