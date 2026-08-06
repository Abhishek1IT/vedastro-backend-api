/* eslint-disable react-hooks/immutability */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Star, Briefcase, Circle } from "lucide-react";

import { consultationService } from "../../services/consultation.service";
import { useAuthStore } from "../../store/authStore";

interface Astrologer {
  _id: string;
  name?: string;
  phone: string;
  avatar?: string;
  language: string;
  experience: number;
  role: string;
  isOnline: boolean;
  isVerified: boolean;
}

export default function ConsultationPage() {
  const router = useRouter();

  const { user, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);

  useEffect(() => {
    loadAstrologers();
  }, []);

  const loadAstrologers = async () => {
    try {
      const data = await consultationService.getAstrologers();
      setAstrologers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: "chat" | "call") => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/consultations/${type}`);
      return;
    }

    if (!user?.profileCompleted) {
      router.push(`/complete-profile?redirect=/consultations/${type}`);
      return;
    }

    router.push(`/consultations/${type}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black">Consult Astrologers</h1>

          <p className="mt-2 text-slate-400">
            Choose an astrologer and start Chat or Call.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading astrologers...</div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No astrologers available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {astrologers.map((astro) => (
              <div
                key={astro._id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-amber-500 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      astro.avatar ||
                      "https://ui-avatars.com/api/?name=Astrologer"
                    }
                    alt=""
                    className="h-20 w-20 rounded-full object-cover border border-slate-700"
                  />

                  <div>
                    <h2 className="text-lg font-bold">
                      {astro.name || "Astrologer"}
                    </h2>

                    <p className="text-sm text-slate-400">
                      {astro.language.toUpperCase()}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Circle
                        size={10}
                        fill={astro.isOnline ? "#22c55e" : "#ef4444"}
                        color={astro.isOnline ? "#22c55e" : "#ef4444"}
                      />

                      <span className="text-xs">
                        {astro.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} />
                    {astro.experience} Years Experience
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Star size={16} className="text-yellow-400" />
                    Verified Astrologer
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAction("chat")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-semibold text-black hover:bg-amber-400"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </button>

                  <button
                    onClick={() => handleAction("call")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-500"
                  >
                    <Phone size={18} />
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
