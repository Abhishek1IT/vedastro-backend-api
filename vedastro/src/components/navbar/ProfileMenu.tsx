/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { authService } from "@/src/services/auth.service";

export default function ProfileMenu({
  user,
}: {
  user?: any;
}) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { logout } = useAuthStore();
  const { clearProfile } = useUserStore();

  const displayName =
    user?.name || user?.phone || "User";

  const displayInitial =
    displayName[0]?.toUpperCase() || "U";

  const role = user?.role;

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener(
        "click",
        handleOutsideClick,
      );
    }

    return () => {
      document.removeEventListener(
        "click",
        handleOutsideClick,
      );
    };
  }, [isOpen]);

  const handleProfileClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleDropdownClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    event.stopPropagation();
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      logout();
      clearProfile();
      router.replace("/");
    }
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        type="button"
        onClick={handleProfileClick}
        className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white transition hover:border-amber-500/50"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
          {displayInitial}
        </div>

        <span className="font-semibold">
          {displayName}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          onClick={handleDropdownClick}
          className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl"
        >
          {/* User Info */}
          <div className="border-b border-slate-900 px-3 py-2">
            <p className="text-xs font-bold text-white">
              {displayName}
            </p>

            {user?.email && (
              <p className="truncate text-[10px] text-slate-400">
                {user.email}
              </p>
            )}

            <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-amber-500">
              {role || "USER"}
            </p>
          </div>

          {/* ADMIN */}
          {role === "ADMIN" && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/admin");
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-amber-400 transition hover:bg-slate-900"
            >
              Admin Dashboard
            </button>
          )}

          {/* APPROVED ASTROLOGER */}
          {role === "ASTROLOGER" &&
            user?.approvalStatus === "APPROVED" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(
                    "/astrologer/dashboard",
                  );
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-amber-400 transition hover:bg-slate-900"
              >
                Astrologer Dashboard
              </button>
            )}

          {/* PENDING ASTROLOGER */}
          {role === "ASTROLOGER" &&
            user?.approvalStatus !== "APPROVED" && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(
                    "/astrologer/pending",
                  );
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-yellow-400 transition hover:bg-slate-900"
              >
                Application Status
              </button>
            )}

          {/* ORDERS - USER ONLY */}
          {role === "USER" && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/orders");
              }}
              className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-slate-900"
            >
              My Orders
            </button>
          )}

          {/* PROFILE */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push("/profile");
            }}
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-slate-900"
          >
            My Profile
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-xs font-bold text-red-400 transition hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}