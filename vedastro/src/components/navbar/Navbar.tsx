/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/routes";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ProfileMenu from "./ProfileMenu";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button";
import SearchBar from "../../components/common/SearchBar";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const { totalItems, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const handleSearchDispatch = (query: string) => {
    if (query.trim()) {
      router.push(
        `/consultations/astrologers?search=${encodeURIComponent(query)}`,
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center transition-all duration-300 pt-0 sm:pt-2">
      <nav
        className={`w-full transition-all duration-300 ease-in-out select-none ${
          isScrolled
            ? "max-w-6xl rounded-full border border-slate-800 bg-slate-950/90 shadow-2xl backdrop-blur-md px-6 py-1 mx-4"
            : "max-w-7xl border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-2"
        }`}
      >
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <span className="text-amber-500 text-2xl">✨</span>

            <h1>
              Ved<span className="text-amber-500">Astro</span>
            </h1>

            <div className="hidden md:block">
              <DesktopMenu />
            </div>
          </div>

          <SearchBar
            onSearch={handleSearchDispatch}
            className="hidden md:block flex-1 max-w-xs"
          />

          <button
            onClick={() => router.push("/cart")}
            className="relative text-white text-xl"
          >
            🛍️
            {totalItems > 0 && (
              <span
                className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      rounded-full
      w-5
      h-5
      flex
      items-center
      justify-center
      "
              >
                {totalItems}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.LOGIN)}
              >
                Login
              </Button>
            )}
          </div>

          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(ROUTES.LOGIN)}
              >
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
