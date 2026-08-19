"use client";

import { useAuthStore } from "../../../store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AstrologerPendingPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (user.role !== "ASTROLOGER") {
      router.replace("/home");
      return;
    }

    if (user.approvalStatus === "APPROVED") {
      router.replace("/astrologer/dashboard");
      return;
    }

    if (user.approvalStatus === "REJECTED") {
      return;
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 text-3xl">
          ⏳
        </div>

        <h1 className="text-2xl font-bold">
          Astrologer Profile Under Review
        </h1>

        <p className="mt-3 text-slate-400">
          Your astrologer profile has been submitted
          successfully.
        </p>

        <p className="mt-2 text-slate-400">
          Please wait for admin approval. You will be
          able to access the astrologer dashboard after
          approval.
        </p>

        <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-400">
            Status: <strong>{user.approvalStatus}</strong>
          </p>
        </div>

        {user.approvalStatus === "REJECTED" && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-400">
              Your astrologer application was rejected.
            </p>

            {user.rejectionReason && (
              <p className="mt-2 text-sm text-slate-300">
                Reason: {user.rejectionReason}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => router.replace("/home")}
          className="mt-6 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}