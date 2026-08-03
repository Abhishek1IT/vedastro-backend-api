"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../lib/utils";

import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { isAuthenticated } = useAuthStore();

  if (!isOpen) return null;

  const menuItems = [
    { label: "Horoscope Tracker", path: ROUTES.HOROSCOPE.DAILY },
    { label: "Live Astrologer Consultation", path: ROUTES.CONSULTATIONS.ROOT },
    { label: "Vedic Panchang Engine", path: ROUTES.PANCHANG },
    { label: "Kundli Matching Tools", path: ROUTES.FREE_SERVICES.KUNDLI },
    { label: "Spiritual Divine Shop", path: ROUTES.SHOP },
  ];

  return (
    <div className="md:hidden border-t border-slate-900 dark:border-slate-900 light:border-slate-200 bg-slate-950 dark:bg-slate-950 light:bg-white px-4 py-3.5 space-y-1 animate-in slide-in-from-top duration-200 select-none">
      
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "block rounded-xl px-3 py-2.5 text-xs font-black tracking-wide uppercase transition duration-150",
              isActive 
                ? "bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-amber-500 font-extrabold" 
                : "text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-900 dark:hover:bg-slate-900 light:hover:bg-slate-100 hover:text-white dark:hover:text-white light:hover:text-slate-900"
            )}
          >
            {item.label}
          </Link>
        );
      })}
      
      {!isAuthenticated && (
        <div className="pt-2 mt-2 border-t border-slate-900/60 dark:border-slate-900/60 light:border-slate-100">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setIsOpen(false);
              router.push(ROUTES.LOGIN);
            }}
            className="w-full text-[10px] py-3 rounded-xl uppercase tracking-widest font-black shadow-md"
          >
            Access Platform Login
          </Button>
        </div>
      )}
    </div>
  );
}