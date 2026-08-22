"use client";

import { useEffect } from "react";
import { useConsultationStore } from "../../store/useConsultationStore";
import {
    ConsultationMode,
    AvailabilityFilter,
    ExperienceFilter,
    EXPERTISE_OPTIONS,
    LANGUAGE_OPTIONS,
} from "../../types/consultation";
import { X } from "lucide-react";

const consultationTypeOptions: { value: ConsultationMode; label: string }[] = [
    { value: "chat", label: "Chat" },
    { value: "call", label: "Call" },
    { value: "video", label: "Video" },
];

const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
    { value: "now", label: "Available Now" },
    { value: "today", label: "Today" },
    { value: "later", label: "Schedule Later" },
];

const experienceOptions: { value: ExperienceFilter; label: string }[] = [
    { value: "1-5", label: "1–5 Years" },
    { value: "5-10", label: "5–10 Years" },
    { value: "10+", label: "10+ Years" },
];

export function MobileFilterSheet() {
    const { isMobileFilterOpen, setMobileFilterOpen, filters, setFilters, clearFilters } =
        useConsultationStore();

    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileFilterOpen]);

    if (!isMobileFilterOpen) return null;

    const toggleArrayValue = <T,>(arr: T[], val: T): T[] =>
        arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
            />

            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl transition-transform">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                    <button
                        type="button"
                        onClick={() => setMobileFilterOpen(false)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close filters"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-5 py-4">
                    <FilterSection title="Consultation Type">
                        <div className="flex flex-wrap gap-2">
                            {consultationTypeOptions.map((opt) => (
                                <FilterChip
                                    key={opt.value}
                                    label={opt.label}
                                    active={filters.consultationTypes.includes(opt.value)}
                                    onClick={() =>
                                        setFilters({
                                            consultationTypes: toggleArrayValue(
                                                filters.consultationTypes,
                                                opt.value
                                            ),
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Availability">
                        <div className="flex flex-wrap gap-2">
                            {availabilityOptions.map((opt) => (
                                <FilterChip
                                    key={opt.value}
                                    label={opt.label}
                                    active={filters.availability.includes(opt.value)}
                                    onClick={() =>
                                        setFilters({
                                            availability: toggleArrayValue(
                                                filters.availability,
                                                opt.value
                                            ),
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Experience">
                        <div className="flex flex-wrap gap-2">
                            {experienceOptions.map((opt) => (
                                <FilterChip
                                    key={opt.value}
                                    label={opt.label}
                                    active={filters.experience.includes(opt.value)}
                                    onClick={() =>
                                        setFilters({
                                            experience: toggleArrayValue(
                                                filters.experience,
                                                opt.value
                                            ),
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Languages">
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGE_OPTIONS.map((lang) => (
                                <FilterChip
                                    key={lang}
                                    label={lang}
                                    active={filters.languages.includes(lang)}
                                    onClick={() =>
                                        setFilters({
                                            languages: toggleArrayValue(filters.languages, lang),
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title="Price Range">
                        <div className="space-y-3">
                            <input
                                type="range"
                                min={0}
                                max={500}
                                step={10}
                                value={filters.priceRange[1]}
                                onChange={(e) =>
                                    setFilters({
                                        priceRange: [filters.priceRange[0], Number(e.target.value)],
                                    })
                                }
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500"
                            />
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>₹{filters.priceRange[0]}</span>
                                <span>₹{filters.priceRange[1]}</span>
                            </div>
                        </div>
                    </FilterSection>

                    <FilterSection title="Expertise">
                        <div className="flex flex-wrap gap-2">
                            {EXPERTISE_OPTIONS.map((ex) => (
                                <FilterChip
                                    key={ex}
                                    label={ex}
                                    active={filters.expertise.includes(ex)}
                                    onClick={() =>
                                        setFilters({
                                            expertise: toggleArrayValue(filters.expertise, ex),
                                        })
                                    }
                                />
                            ))}
                        </div>
                    </FilterSection>
                </div>

                <div className="sticky bottom-0 border-t border-slate-100 bg-white px-5 py-4">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileFilterOpen(false)}
                            className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="border-b border-slate-100 py-4 last:border-0">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
            {children}
        </div>
    );
}

function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${active
                    ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                    : "bg-slate-100 text-slate-600"
                }`}
        >
            {label}
        </button>
    );
}