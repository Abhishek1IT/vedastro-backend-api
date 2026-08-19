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

export default function MobileMenu({
  isOpen,
  setIsOpen,
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    isAuthenticated,
    user,
  } = useAuthStore();

  if (!isOpen) return null;

  const role = user?.role;

  if (
    isAuthenticated &&
    role === "ADMIN"
  ) {
    return (
      <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-3.5">
        <Link
          href="/admin"
          onClick={() => setIsOpen(false)}
          className={cn(
            "block rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wide",
            pathname.startsWith("/admin")
              ? "bg-slate-900 text-amber-500"
              : "text-slate-400 hover:bg-slate-900 hover:text-white",
          )}
        >
          Admin Dashboard
        </Link>
      </div>
    );
  }

  if (
    isAuthenticated &&
    role === "ASTROLOGER" &&
    user?.approvalStatus === "APPROVED"
  ) {
    const menuItems = [
      {
        label: "Astrologer Dashboard",
        path: "/astrologer/dashboard",
      },
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
      <MobileLinks
        menuItems={menuItems}
        pathname={pathname}
        setIsOpen={setIsOpen}
      />
    );
  }

  if (
    isAuthenticated &&
    role === "ASTROLOGER"
  ) {
    return (
      <MobileLinks
        menuItems={[
          {
            label: "Application Status",
            path: "/astrologer/pending",
          },
        ]}
        pathname={pathname}
        setIsOpen={setIsOpen}
      />
    );
  }

  const menuItems = [
    {
      label: "Horoscope Tracker",
      path: ROUTES.HOROSCOPE.DAILY,
    },
    {
      label: "Live Astrologer Consultation",
      path: ROUTES.CONSULTATIONS.ROOT,
    },
    {
      label: "Vedic Panchang Engine",
      path: ROUTES.PANCHANG,
    },
    {
      label: "Kundli Matching Tools",
      path: ROUTES.FREE_SERVICES.KUNDLI,
    },
    {
      label: "Spiritual Divine Shop",
      path: ROUTES.SHOP,
    },
  ];

  return (
    <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-3.5 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "block rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wide transition",
              isActive
                ? "bg-slate-900 text-amber-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}

      {!isAuthenticated && (
        <div className="mt-2 border-t border-slate-900/60 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setIsOpen(false);
              router.push(ROUTES.LOGIN);
            }}
            className="w-full rounded-xl py-3 text-[10px] font-black uppercase tracking-widest"
          >
            Access Platform Login
          </Button>
        </div>
      )}
    </div>
  );
}

function MobileLinks({
  menuItems,
  pathname,
  setIsOpen,
}: {
  menuItems: {
    label: string;
    path: string;
  }[];
  pathname: string;
  setIsOpen: (value: boolean) => void;
}) {
  return (
    <div className="md:hidden border-t border-slate-900 bg-slate-950 px-4 py-3.5 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.path);

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "block rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wide transition",
              isActive
                ? "bg-slate-900 text-amber-500"
                : "text-slate-400 hover:bg-slate-900 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}