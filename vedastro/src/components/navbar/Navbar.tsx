/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ROUTES } from "../../constants/routes";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ProfileMenu from "./ProfileMenu";

import Button from "../common/Button";
import SearchBar from "../common/SearchBar";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, user, isHydrated } = useAuthStore();

  const { totalItems, fetchCart, loading } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isHydrated) return null;

  const handleSearchDispatch = (query: string) => {
    if (!query.trim()) return;

    router.push(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "mx-4 max-w-6xl rounded-full border border-slate-800 bg-slate-950/90 px-6 py-1 shadow-2xl backdrop-blur-md"
            : "max-w-7xl border-b border-slate-900 bg-slate-950/80 px-4 py-2 backdrop-blur-md sm:px-6 lg:px-8"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}

          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => router.push("/")}
          >
            <span className="text-2xl text-amber-500">✨</span>

            <h1 className="text-xl font-bold text-white">
              Ved<span className="text-amber-500">Astro</span>
            </h1>
          </div>

          {/* Desktop Menu */}

          <div className="hidden md:block">
            <DesktopMenu />
          </div>

          {/* Search */}

          <SearchBar
            onSearch={handleSearchDispatch}
            className="hidden max-w-sm flex-1 md:block"
          />

          <div className="flex items-center gap-4">
            {/* Cart */}

            <button
              onClick={() => router.push("/cart")}
              className="relative text-2xl"
            >
              🛍️
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Login/Profile */}

            {isAuthenticated && user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button size="sm" onClick={() => router.push(ROUTES.LOGIN)}>
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
    </header>
  );
}
