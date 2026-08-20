"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";

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

  const {
    isAuthenticated,
    user,
    isHydrated,
    openLoginModal,
  } = useAuthStore();

  const {
    totalItems,
    fetchCart,
    syncGuestCart,
  } = useCartStore();

  useEffect(() => {
    if (!isHydrated) return;

    const loadCart = async () => {
      try {
        if (isAuthenticated) {
          await syncGuestCart();
        } else {
          await fetchCart();
        }
      } catch (error) {
        console.error("Navbar cart error:", error);
      }
    };

    loadCart();
  }, [
    isHydrated,
    isAuthenticated,
    fetchCart,
    syncGuestCart,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (
    isHydrated &&
    isAuthenticated &&
    user?.role === "ADMIN"
  ) {
    return null;
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full">
        <nav
          className={`mx-auto flex items-center justify-between backdrop-blur-md transition-all duration-300 ${isScrolled
              ? "mx-4 mt-4 max-w-5xl rounded-full border border-(--accent) bg-(--surface-secondary)/90 px-6 py-2.5 shadow-xl"
              : "w-full border-b border-transparent bg-transparent px-6 py-5"
            }`}
        >
          {/* LOGO */}
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="text-2xl text-(--accent)">
              ✨
            </span>

            <h1 className="text-xl font-bold">
              <span
                className={
                  isScrolled
                    ? "text-black"
                    : "text-amber-700/80"
                }
              >
                Ved
              </span>

              <span className="text-(--accent)">
                Astro
              </span>
            </h1>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:block">
            <DesktopMenu isScrolled={isScrolled} />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() =>
                setIsMobileOpen((prev) => !prev)
              }
              className={`rounded-full p-2 transition hover:bg-(--surface-tertiary) md:hidden ${isScrolled
                  ? "text-black"
                  : "text-amber-700/80"
                }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* CART */}
            {user?.role !== "ADMIN" && (
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className={`relative rounded-full p-2 transition hover:bg-(--surface-tertiary) ${isScrolled
                    ? "text-black"
                    : "text-amber-700/80"
                  }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />

                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {/* PROFILE / LOGIN */}
            {isAuthenticated && user ? (
              <ProfileMenu user={user} />
            ) : (
              <Button
                size="sm"
                onClick={openLoginModal}
              >
                Login
              </Button>
            )}
          </div>
        </nav>

        {/* MOBILE MENU */}
        <MobileMenu
          isOpen={isMobileOpen}
          setIsOpen={setIsMobileOpen}
        />
      </header>
    </>
  );
}