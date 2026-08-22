"use client";

import { AlertTriangle } from "lucide-react";

interface ConsultationErrorStateProps {
    onRetry: () => void;
}

export function ConsultationErrorState({ onRetry }: ConsultationErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
                Something went wrong
            </h3>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
                We couldn&apos;t load astrologers right now. Please try again.
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.98]"
            >
                Try Again
            </button>
        </div>
    );
}