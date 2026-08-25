"use client";

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

function FilterGroup({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="border-b border-slate-100 py-5 last:border-0">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
            {children}
        </div>
    );
}

function CheckboxList<T extends string>({
    options,
    selected,
    onToggle,
}: {
    options: { value: T; label: string }[];
    selected: T[];
    onToggle: (value: T) => void;
}) {
    return (
        <div className="space-y-2">
            {options.map((opt) => {
                const isChecked = selected.includes(opt.value);
                return (
                    <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-slate-700 transition hover:text-slate-900"
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggle(opt.value)}
                            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        {opt.label}
                    </label>
                );
            })}
        </div>
    );
}

export function ConsultationFilters() {
    const { filters, setFilters, clearFilters } = useConsultationStore();

    const hasActiveFilters =
        filters.consultationTypes.length > 0 ||
        filters.availability.length > 0 ||
        filters.experience.length > 0 ||
        filters.languages.length > 0 ||
        filters.expertise.length > 0 ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 0;

    return (
        <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Filters</h2>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-xs font-medium text-amber-600 transition hover:text-amber-700"
                        >
                            <X className="h-3 w-3" />
                            Clear All
                        </button>
                    )}
                </div>

                <FilterGroup title="Consultation Type">
                    <CheckboxList
                        options={consultationTypeOptions}
                        selected={filters.consultationTypes}
                        onToggle={(val) =>
                            setFilters({
                                consultationTypes: filters.consultationTypes.includes(val)
                                    ? filters.consultationTypes.filter((v) => v !== val)
                                    : [...filters.consultationTypes, val],
                            })
                        }
                    />
                </FilterGroup>

                <FilterGroup title="Availability">
                    <CheckboxList
                        options={availabilityOptions}
                        selected={filters.availability}
                        onToggle={(val) =>
                            setFilters({
                                availability: filters.availability.includes(val)
                                    ? filters.availability.filter((v) => v !== val)
                                    : [...filters.availability, val],
                            })
                        }
                    />
                </FilterGroup>

                <FilterGroup title="Experience">
                    <CheckboxList
                        options={experienceOptions}
                        selected={filters.experience}
                        onToggle={(val) =>
                            setFilters({
                                experience: filters.experience.includes(val)
                                    ? filters.experience.filter((v) => v !== val)
                                    : [...filters.experience, val],
                            })
                        }
                    />
                </FilterGroup>

                <FilterGroup title="Languages">
                    <CheckboxList
                        options={LANGUAGE_OPTIONS.map((l) => ({ value: l, label: l }))}
                        selected={filters.languages}
                        onToggle={(val) =>
                            setFilters({
                                languages: filters.languages.includes(val)
                                    ? filters.languages.filter((v) => v !== val)
                                    : [...filters.languages, val],
                            })
                        }
                    />
                </FilterGroup>

                <FilterGroup title="Price Range (₹/min)">
                    <div className="space-y-3">
                        <input
                            type="range"
                            min={0}
                            max={0}
                            step={10}
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                                setFilters({
                                    priceRange: [filters.priceRange[0], Number(e.target.value)],
                                })
                            }
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500"
                            aria-label="Maximum price"
                        />
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>₹{filters.priceRange[0]}</span>
                            <span>₹{filters.priceRange[1]}</span>
                        </div>
                    </div>
                </FilterGroup>

                <FilterGroup title="Expertise">
                    <div className="flex flex-wrap gap-2">
                        {EXPERTISE_OPTIONS.map((ex) => {
                            const isActive = filters.expertise.includes(ex);
                            return (
                                <button
                                    key={ex}
                                    type="button"
                                    onClick={() =>
                                        setFilters({
                                            expertise: filters.expertise.includes(ex)
                                                ? filters.expertise.filter((v) => v !== ex)
                                                : [...filters.expertise, ex],
                                        })
                                    }
                                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${isActive
                                        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {ex}
                                </button>
                            );
                        })}
                    </div>
                </FilterGroup>
            </div>
        </aside>
    );
}