"use client";

import { useRef } from "react";
import { useConsultationStore } from "../../store/useConsultationStore";
import { CATEGORIES } from "../../types/consultation";
import { SlidersHorizontal } from "lucide-react";

export function ConsultationCategories() {
    const { selectedCategory, setCategory, setMobileFilterOpen } =
        useConsultationStore();
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <section className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <div
                    ref={scrollRef}
                    className="flex flex-1 gap-2 overflow-x-auto pb-1 scrollbar-hide"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${isActive
                                        ? "bg-amber-500 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                    aria-label="Open filters"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                </button>
            </div>
        </section>
    );
}