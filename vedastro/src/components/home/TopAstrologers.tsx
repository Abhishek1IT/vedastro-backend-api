/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Star, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Astrologer {
  _id: string;
  name?: string;
  avatar?: string;
  language?: string;
  experience?: number;
  isOnline?: boolean;

  skills?: string[];
  languages?: string[];

  rating?: number;
  orders?: number;
  price?: number;

  badge?: "TOP CHOICE" | "CELEBRITY";
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

function getAvatarUrl(avatar?: string) {
  if (!avatar || !avatar.trim()) {
    return null;
  }

  const value = avatar.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return `${BACKEND_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function getInitials(name?: string) {
  if (!name?.trim()) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function AstrologerAvatar({
  astrologer,
}: {
  astrologer: Astrologer;
}) {
  const [imageError, setImageError] = useState(false);

  const avatarUrl = getAvatarUrl(astrologer.avatar);

  const showImage = Boolean(avatarUrl) && !imageError;

  return (
    <div className="relative shrink-0">
      {showImage ? (
        <img
          src={avatarUrl!}
          alt={astrologer.name || "Astrologer"}
          className="w-12 h-12 rounded-full object-cover border border-green-500/50 p-0.5"
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        <div className="w-12 h-12 rounded-full border border-green-500/50 bg-[#2A2118] flex items-center justify-center text-white font-bold text-sm">
          {getInitials(astrologer.name)}
        </div>
      )}

      {astrologer.isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#120E0A]" />
      )}
    </div>
  );
}

const TopAstrologers: React.FC = () => {
  const router = useRouter();

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAstrologers = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/user/astrologers`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch astrologers: ${response.status}`,
          );
        }

        const result = await response.json();

        console.log("ASTROLOGERS RESPONSE:", result);

        const data: Astrologer[] =
          result?.data?.data ||
          result?.data ||
          [];

        if (mounted) {
          setAstrologers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("FETCH ASTROLOGERS ERROR:", error);

        if (mounted) {
          setAstrologers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAstrologers();

    return () => {
      mounted = false;
    };
  }, []);

  const topAstrologers = astrologers.slice(0, 4);

  return (
    <section className="bg-[#0B0805] text-white py-16 px-6 md:px-12 font-sans border-t border-[#1C1610] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              Talk to India&apos;s{" "}
              <span className="text-[#C88029] font-normal">
                Top
              </span>
              <br />
              <span className="text-[#C88029] font-normal">
                Rated
              </span>{" "}
              Astrologers
            </h2>

            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Every astrologer below has cleared a{" "}
              <strong className="text-gray-200">
                4-step verification
              </strong>{" "}
              — qualification, panel interview, live audits,
              and a{" "}
              <strong className="text-gray-200">
                30-day probation
              </strong>.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            href="/consultations"
            className="self-start md:self-auto"
          >
            <button
              type="button"
              className="bg-[#EAD170] text-black font-semibold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/10"
            >
              View all astrologers
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-85 rounded-2xl bg-[#120E0A] border border-[#231A12] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && topAstrologers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No astrologers available right now.
          </div>
        )}

        {!loading && topAstrologers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topAstrologers.map((astro) => {
              const skills =
                astro.skills?.length
                  ? astro.skills
                  : ["Vedic", "Numerology"];

              const languages =
                astro.languages?.length
                  ? astro.languages.join(" · ")
                  : astro.language === "en"
                    ? "English/Hindi"
                    : astro.language || "English/Hindi";

              const experience = astro.experience ?? 0;
              const rating = astro.rating ?? 5;
              const orders = astro.orders ?? 0;
              const price = astro.price ?? 0;

              return (
                <div
                  key={astro._id}
                  className="bg-[#120E0A] border border-[#231A12] hover:border-[#3D2C1E] rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-[1.02] shadow-xl relative"
                >
                  {/* PROFILE */}
                  <div className="flex items-center space-x-3">
                    <AstrologerAvatar astrologer={astro} />

                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-1">
                        <h3 className="font-semibold text-sm truncate text-white">
                          {astro.name || "Astrologer"}
                        </h3>

                        <span className="text-blue-400 text-[10px]">
                          ✔
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 truncate">
                        {experience} yrs exp ·{" "}
                        {languages.split(" · ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* SKILLS */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="bg-[#1C1610] text-gray-300 border border-[#2E2319] text-[10px] px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* DETAILS */}
                  <div className="text-[11px] text-gray-400 space-y-0.5 border-t border-white/5 pt-2">
                    <p>{languages}</p>

                    <p className="font-medium text-gray-300">
                      {experience} yrs exp
                    </p>
                  </div>

                  {/* RATING */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />

                      <span className="font-bold text-white">
                        {rating.toFixed(1)}
                      </span>

                      <span className="text-[10px] text-gray-400">
                        ·{" "}
                        {orders > 0
                          ? `${orders}+ orders`
                          : "New"}
                      </span>
                    </div>

                    <span
                      className={
                        astro.isOnline
                          ? "text-green-500 text-[11px] font-medium"
                          : "text-gray-500 text-[11px] font-medium"
                      }
                    >
                      {astro.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* PRICE */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
                    <div className="text-lg font-bold text-white">
                      ₹{price}
                      <span className="text-xs font-normal text-gray-400">
                        /min
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        router.push(
                          `/consultations/chat?astroId=${encodeURIComponent(astro._id)}`
                        );
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 px-4 font-semibold text-black transition hover:bg-amber-400"
                    >
                      <MessageCircle size={18} />
                      Free Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopAstrologers;