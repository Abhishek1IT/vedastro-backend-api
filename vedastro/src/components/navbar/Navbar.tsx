"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

import { ROUTES } from "../../constants/routes";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ProfileMenu from "./ProfileMenu";

import Button from "../common/Button";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, user, isHydrated } = useAuthStore();

  const { totalItems, fetchCart, syncGuestCart } = useCartStore();

  useEffect(() => {
    if (!isHydrated) return;

    const loadCart = async () => {
      if (isAuthenticated) {
        await syncGuestCart();
      } else {
        await fetchCart();
      }
    };

    loadCart();
  }, [isHydrated, isAuthenticated, fetchCart, syncGuestCart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <nav
          className={`mx-auto flex w-full items-center justify-between transition-all duration-300 ${
            isScrolled
              ? "mx-4 max-w-6xl rounded-full border border-slate-800 bg-slate-950/90 px-6 py-2 shadow-2xl backdrop-blur-md"
              : "max-w-7xl border-b border-slate-900 bg-slate-950/80 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8"
          }`}
        >
          {/* LOGO */}
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => router.push("/")}
          >
            <span className="text-2xl text-amber-500">✨</span>

            <h1 className="text-xl font-bold text-white">
              Ved<span className="text-amber-500">Astro</span>
            </h1>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <DesktopMenu />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* CART - GUEST + LOGGED IN BOTH */}
            <button
              type="button"
              onClick={() => router.push("/cart")}
              className="relative rounded-full p-2 text-white transition hover:bg-slate-800"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* LOGIN / PROFILE */}
            {isAuthenticated && user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button size="sm" onClick={() => router.push(ROUTES.LOGIN)}>
                Login
              </Button>
            )}
          </div>
        </nav>

        {/* MOBILE MENU */}
        <MobileMenu isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
      </header>
    </>
  );
}
