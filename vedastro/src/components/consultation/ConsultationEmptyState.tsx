"use client";

import { SearchX } from "lucide-react";
import { useConsultationStore } from "../../store/useConsultationStore";

export function ConsultationEmptyState() {
    const { clearFilters } = useConsultationStore();

    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                <SearchX className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
                No astrologers found
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
                Try changing your filters or search for another astrologer.
            </p>
            <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]"
            >
                Clear Filters
            </button>
        </div>
    );
}