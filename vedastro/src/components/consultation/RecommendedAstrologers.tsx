"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";
import { Astrologer, ConsultationMode } from "../../types/consultation";
import { ProfileAvatar } from "./ProfileAvatar";

interface RecommendedAstrologersProps {
    astrologers: Astrologer[];
    consultationType: ConsultationMode;
    onChat: (id: string) => void;
    onCall: (id: string) => void;
}

export function RecommendedAstrologers({
    astrologers,
    consultationType,
    onChat,
    onCall,
}: RecommendedAstrologersProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 320;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    if (astrologers.length === 0) return null;

    return (
        <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                    Recommended for You
                </h2>
                <div className="hidden gap-1 sm:flex">
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-50"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-50"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {astrologers.map((astro) => {
                    const price =
                        consultationType === "chat"
                            ? astro.pricing?.chat
                            : consultationType === "call"
                                ? astro.pricing?.call
                                : astro.pricing?.video;

                    return (
                        <div
                            key={astro._id}
                            className="w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md"
                        >
                            <div className="flex items-start gap-3">
                                <ProfileAvatar
                                    name={astro.name}
                                    src={astro.profileImage}
                                    size="md"
                                    isOnline={astro.isOnline}
                                    showIndicator
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1">
                                        <h3 className="truncate text-sm font-bold text-slate-900">
                                            {astro.name}
                                        </h3>
                                        {astro.isVerified && (
                                            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {astro.specializations.slice(0, 2).join(" • ") ||
                                            astro.expertise.slice(0, 2).join(" • ") ||
                                            "Astrologer"}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                                        {astro.rating && astro.rating > 0 && (
                                            <span className="flex items-center gap-0.5 font-medium text-amber-700">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                {astro.rating.toFixed(1)}
                                            </span>
                                        )}
                                        <span className="text-emerald-600">
                                            {astro.isOnline ? "Available Now" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                {typeof price === "number" && price > 0 ? (
                                    <span className="text-base font-bold text-slate-900">
                                        ₹{price}
                                        <span className="text-xs font-normal text-slate-500">
                                            /min
                                        </span>
                                    </span>
                                ) : (
                                    <span />
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        consultationType === "chat"
                                            ? onChat(astro._id)
                                            : onCall(astro._id)
                                    }
                                    className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]"
                                >
                                    {consultationType === "chat"
                                        ? "Chat"
                                        : consultationType === "call"
                                            ? "Call"
                                            : "Book"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}