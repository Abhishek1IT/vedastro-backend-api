"use client";

import { Search } from "lucide-react";
import { useConsultationStore } from "../../store/useConsultationStore";

export function ConsultationHero() {
    const { searchQuery, setSearchQuery } = useConsultationStore();

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-amber-50 via-white to-orange-50 pb-10 pt-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Talk to the Right Astrologer for You
                    </h1>
                    <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                        Get personalized guidance for love, career, marriage, finance, and
                        life&apos;s important decisions.
                    </p>

                    <div className="mx-auto mt-6 max-w-xl">
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search astrologers, expertise, or problems..."
                                className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                aria-label="Search astrologers"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}