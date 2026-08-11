/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { authService } from "@/src/services/auth.service";

export default function ProfileMenu({ user }: { user?: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const { clearProfile } = useUserStore();

  const displayName = user?.name || user?.phone || "User";
  const displayInitial = displayName[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    try {

      const res = await authService.logout();

      console.log("Logout Response:", res);

      logout();

      clearProfile();

      router.replace("/");
    } catch (err) {
      console.error("Logout Error:", err);

      logout();
      clearProfile();

      router.replace("/");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-white hover:border-amber-500/50 transition"
      >
        <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
          {displayInitial}
        </div>
        <span className="font-semibold">{displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl z-50">
          <div className="px-3 py-2 border-b border-slate-900">
            <p className="text-xs font-bold text-white">{displayName}</p>
            {user?.email && (
              <p className="text-[10px] text-slate-400 truncate">
                {user.email}
              </p>
            )}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/profile");
            }}
            className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-900 rounded-lg transition"
          >
            My Profile
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg font-bold transition mt-1"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
