"use client";

import { useConsultationStore } from "../../store/useConsultationStore";
import { SORT_OPTIONS } from "../../types/consultation";
import { ArrowUpDown, SlidersHorizontal, Radio } from "lucide-react";

export function ConsultationToolbar({
    totalCount,
    onToggleFilters,
}: {
    totalCount: number;
    onToggleFilters: () => void;
}) {
    const { sortBy, setSortBy, setMobileFilterOpen } = useConsultationStore();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{totalCount}</span>{" "}
                astrologer{totalCount !== 1 ? "s" : ""} for you
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onToggleFilters}
                    className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:flex"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </button>

                <div className="relative">
                    <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as typeof sortBy)
                        }
                        className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:bg-slate-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                        aria-label="Sort astrologers"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                </button>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
                >
                    <Radio className="h-4 w-4 text-emerald-500" />
                    Available
                </button>
            </div>
        </div>
    );
}