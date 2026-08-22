"use client";

export function AstrologerCardSkeleton() {
    return (
        <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            {/* Avatar + Name */}
            <div className="flex items-start gap-3.5">
                <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-slate-200" />
                <div className="min-w-0 flex-1 space-y-2 pt-1">
                    <div className="h-5 w-3/4 animate-pulse rounded-md bg-slate-200" />
                    <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-200" />
                    <div className="flex gap-3">
                        <div className="h-3 w-16 animate-pulse rounded-md bg-slate-200" />
                        <div className="h-3 w-20 animate-pulse rounded-md bg-slate-200" />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            </div>

            {/* Tags */}
            <div className="mt-3 flex gap-1.5">
                <div className="h-6 w-12 animate-pulse rounded-md bg-slate-200" />
                <div className="h-6 w-14 animate-pulse rounded-md bg-slate-200" />
                <div className="h-6 w-10 animate-pulse rounded-md bg-slate-200" />
            </div>

            {/* Price + Buttons */}
            <div className="mt-auto pt-4">
                <div className="mb-3 h-6 w-20 animate-pulse rounded-md bg-slate-200" />
                <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
                </div>
            </div>
        </div>
    );
}