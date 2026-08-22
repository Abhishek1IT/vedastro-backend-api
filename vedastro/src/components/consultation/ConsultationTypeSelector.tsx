"use client";

import { MessageCircle, Phone, Video } from "lucide-react";
import { useConsultationStore } from "../../store/useConsultationStore";
import { ConsultationMode } from "../../types/consultation";

const types: {
    key: ConsultationMode;
    icon: React.ReactNode;
    title: string;
    description: string;
    defaultPrice: number;
}[] = [
        {
            key: "chat",
            icon: <MessageCircle className="h-5 w-5" />,
            title: "Chat",
            description: "Talk instantly with an astrologer",
            defaultPrice: 0,
        },
        {
            key: "call",
            icon: <Phone className="h-5 w-5" />,
            title: "Call",
            description: "Voice consultation, private conversation",
            defaultPrice: 0,
        },
        {
            key: "video",
            icon: <Video className="h-5 w-5" />,
            title: "Video",
            description: "Face-to-face scheduled consultation",
            defaultPrice: 0,
        },
    ];

export function ConsultationTypeSelector() {
    const { selectedConsultationType, setConsultationType } =
        useConsultationStore();

    return (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {types.map((type) => {
                    const isSelected = selectedConsultationType === type.key;
                    return (
                        <button
                            key={type.key}
                            type="button"
                            onClick={() => setConsultationType(type.key)}
                            className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${isSelected
                                    ? "border-amber-400 bg-amber-50 shadow-sm ring-1 ring-amber-200"
                                    : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/50"
                                }`}
                            aria-pressed={isSelected}
                        >
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isSelected
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                            >
                                {type.icon}
                            </div>
                            <div className="min-w-0">
                                <p
                                    className={`text-sm font-semibold ${isSelected ? "text-amber-900" : "text-slate-900"
                                        }`}
                                >
                                    {type.title}
                                </p>
                                <p className="text-xs text-slate-500">{type.description}</p>
                                <p className="mt-0.5 text-xs font-medium text-amber-700">
                                    From ₹{type.defaultPrice}/min
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}