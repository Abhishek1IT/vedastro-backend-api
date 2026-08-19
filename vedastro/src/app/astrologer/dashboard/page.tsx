"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";

export default function AstrologerDashboard() {
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated,
    );
    const isHydrated = useAuthStore(
        (state) => state.isHydrated,
    );

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated || !user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "ASTROLOGER") {
            router.replace("/home");
            return;
        }

        if (user.approvalStatus !== "APPROVED") {
            router.replace("/astrologer/pending");
            return;
        }
    }, [
        isHydrated,
        isAuthenticated,
        user,
        router,
    ]);

    if (!isHydrated || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-white py-24">
            <h1 className="text-3xl font-bold">
                Astrologer Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
                Welcome, {user.name}
            </p>
        </div>
    );
}