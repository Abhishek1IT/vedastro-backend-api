/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    MessageCircle,
    Phone,
    Video,
    Star,
    BadgeCheck,
    Clock,
    Users,
} from "lucide-react";

import {
    Astrologer,
    ConsultationMode,
} from "../../types/consultation";

import { ProfileAvatar } from "./ProfileAvatar";

interface AstrologerCardProps {
    astrologer: Astrologer;
    consultationType: ConsultationMode;

    onChat: (id: string) => void;
    onCall: (id: string) => void;
    onVideoCall?: (id: string) => void;

    isAstrologerView?: boolean;
}

export function AstrologerCard({
    astrologer,
    consultationType,
    onChat,
    onCall,
    onVideoCall,
    isAstrologerView = false,
}: AstrologerCardProps) {
    const router = useRouter();

    const [actionLoading, setActionLoading] =
        useState(false);

    const personId = String(
        astrologer?._id ||
        (astrologer as any)?.id ||
        "",
    );

    const name =
        astrologer?.name ||
        astrologer?.fullName ||
        (isAstrologerView ? "User" : "Astrologer");

    const specializations = Array.isArray(
        astrologer?.specializations,
    )
        ? astrologer.specializations
        : [];

    const expertise = Array.isArray(
        astrologer?.expertise,
    )
        ? astrologer.expertise
        : [];

    const languages = Array.isArray(
        astrologer?.languages,
    )
        ? astrologer.languages
        : [];

    const experience =
        Number(astrologer?.experience) || 0;

    const rating =
        Number(astrologer?.rating) || 0;

    const reviewCount =
        Number(astrologer?.reviewCount) || 0;

    const consultationCount =
        Number(astrologer?.consultationCount) || 0;

    const profileImage =
        (astrologer as any)?.profileImage ||
        (astrologer as any)?.profilePicture ||
        (astrologer as any)?.avatar ||
        "";

    const price = 0;

    const availabilityText =
        astrologer?.isBusy
            ? "Busy"
            : astrologer?.isOnline
                ? "Available Now"
                : astrologer?.responseTime
                    ? `Available in ${astrologer.responseTime} min`
                    : "Offline";

    const availabilityColor =
        astrologer?.isBusy
            ? "text-amber-600"
            : astrologer?.isOnline
                ? "text-emerald-600"
                : "text-slate-400";

    const availabilityDot =
        astrologer?.isBusy
            ? "bg-amber-500"
            : astrologer?.isOnline
                ? "bg-emerald-500"
                : "bg-slate-300";

    const primaryActionLabel =
        consultationType === "chat"
            ? "Chat Now"
            : consultationType === "call"
                ? "Call Now"
                : "Video Call";

    const primaryActionIcon =
        consultationType === "chat" ? (
            <MessageCircle className="h-4 w-4" />
        ) : consultationType === "call" ? (
            <Phone className="h-4 w-4" />
        ) : (
            <Video className="h-4 w-4" />
        );

    const handlePrimaryAction = () => {
        if (!personId || actionLoading) {
            return;
        }

        try {
            setActionLoading(true);

            if (consultationType === "chat") {
                onChat(personId);
                return;
            }

            if (consultationType === "call") {
                onCall(personId);
                return;
            }

            if (consultationType === "video") {
                if (onVideoCall) {
                    onVideoCall(personId);
                } else {
                    console.warn(
                        "onVideoCall callback is not provided",
                    );
                }

                return;
            }
        } catch (error) {
            console.error(
                "CONSULTATION ACTION ERROR:",
                error,
            );
        } finally {
            setTimeout(() => {
                setActionLoading(false);
            }, 500);
        }
    };


    const handleViewProfile = () => {
        if (!personId) {
            console.error("Profile ID missing");
            return;
        }

        const url = isAstrologerView
            ? `/profile?userId=${encodeURIComponent(personId)}`
            : `/profile?astrologerId=${encodeURIComponent(personId)}`;

        console.log("OPEN PROFILE:", {
            role: isAstrologerView ? "ASTROLOGER" : "USER",
            personId,
            url,
        });

        router.push(url);
    };

    return (
        <article
            className="group flexbh-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-amber-200
        hover:shadow-lg
        sm:p-5"
        >
            {/* HEADER */}
            <div className="flex items-start gap-3.5">
                <ProfileAvatar
                    name={name}
                    src={profileImage}
                    size="lg"
                    isOnline={Boolean(
                        astrologer?.isOnline,
                    )}
                    showIndicator
                />

                <div className="min-w-0 flex-1">
                    {/* NAME */}
                    <div className="flex items-center gap-1.5">
                        <h3
                            className="
                truncate
                text-base
                font-bold
                text-slate-900
              "
                        >
                            {name}
                        </h3>

                        {astrologer?.isVerified &&
                            !isAstrologerView && (
                                <BadgeCheck
                                    className="
                    h-4
                    w-4
                    shrink-0
                    text-amber-500
                  "
                                    aria-label="Verified astrologer"
                                />
                            )}
                    </div>

                    {/* SPECIALIZATION / ROLE */}
                    <p
                        className="
              mt-0.5
              line-clamp-1
              text-sm
              text-slate-500
            "
                    >
                        {isAstrologerView
                            ? "User"
                            : specializations.length > 0
                                ? specializations.join(" • ")
                                : expertise.length > 0
                                    ? expertise.join(" • ")
                                    : "Astrologer"}
                    </p>

                    {/* EXPERIENCE + LANGUAGES */}
                    <div
                        className="
              mt-1.5
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              text-xs
              text-slate-500
            "
                    >
                        {!isAstrologerView &&
                            experience > 0 && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {experience}+ Years
                                </span>
                            )}

                        {!isAstrologerView &&
                            languages.length > 0 && (
                                <span>
                                    {languages
                                        .slice(0, 3)
                                        .join(" • ")}
                                </span>
                            )}
                    </div>
                </div>
            </div>

            {/* ASTROLOGER INFORMATION */}
            {!isAstrologerView && (
                <div
                    className="
            mt-4
            flex
            flex-wrap
            items-center
            gap-3
            text-xs
            text-slate-500
          "
                >
                    {/* RATING */}
                    {rating > 0 && (
                        <span
                            className="
                flex
                items-center
                gap-1
                rounded-full
                bg-amber-50
                px-2
                py-1
                font-medium
                text-amber-700
              "
                        >
                            <Star
                                className="
                  h-3
                  w-3
                  fill-amber-500
                  text-amber-500
                "
                            />

                            {rating.toFixed(1)}

                            {reviewCount > 0 && (
                                <span className="text-amber-600/70">
                                    (
                                    {formatCount(
                                        reviewCount,
                                    )}
                                    )
                                </span>
                            )}
                        </span>
                    )}

                    {/* CONSULTATIONS */}
                    {consultationCount > 0 && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />

                            {formatCount(
                                consultationCount,
                            )}{" "}
                            Consultations
                        </span>
                    )}

                    {/* ONLINE STATUS */}
                    <span
                        className={`
              flex
              items-center
              gap-1
              ${availabilityColor}
            `}
                    >
                        <span
                            className={`
                h-2
                w-2
                rounded-full
                ${availabilityDot}
              `}
                        />

                        {availabilityText}
                    </span>
                </div>
            )}

            {/* EXPERTISE */}
            {!isAstrologerView &&
                expertise.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {expertise
                            .slice(0, 4)
                            .map((tag) => (
                                <span
                                    key={tag}
                                    className="
                    rounded-md
                    bg-slate-100
                    px-2
                    py-1
                    text-xs
                    font-medium
                    text-slate-600
                  "
                                >
                                    {tag}
                                </span>
                            ))}
                    </div>
                )}

            {/* LAST MESSAGE FOR ASTROLOGER */}
            {isAstrologerView &&
                astrologer?.lastMessage && (
                    <p
                        className="
              mt-3
              line-clamp-2
              text-sm
              text-slate-500
            "
                    >
                        {astrologer.lastMessage}
                    </p>
                )}

            {/* FOOTER */}
            <div className="mt-auto pt-5">
                {/* PRICE */}
                {!isAstrologerView && (
                    <div className="mb-3 flex items-center justify-between">
                        {price > 0 ? (
                            <span
                                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
                            >
                                ₹{price}

                                <span
                                    className="
                    text-sm
                    font-normal
                    text-slate-500
                  "
                                >
                                    /min
                                </span>
                            </span>
                        ) : (
                            <span className="text-sm text-slate-400">
                            </span>
                        )}

                        {astrologer?.responseTime &&
                            astrologer.responseTime > 0 && (
                                <span className="text-xs text-slate-400">
                                    Responds in{" "}
                                    {astrologer.responseTime}m
                                </span>
                            )}
                    </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-2 gap-2">
                    {/* CHAT / CALL / VIDEO */}
                    <button
                        type="button"
                        disabled={
                            actionLoading ||
                            !personId
                        }
                        onClick={
                            handlePrimaryAction
                        }
                        className="
              flex
              items-center
              justify-center
              gap-1.5
              rounded-xl
              bg-amber-500
              px-3
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-amber-600
              focus:outline-none
              focus:ring-2
              focus:ring-amber-300
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
                    >
                        {actionLoading ? (
                            <>
                                <span
                                    className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                                />

                                Please wait...
                            </>
                        ) : (
                            <>
                                {primaryActionIcon}
                                {primaryActionLabel}
                            </>
                        )}
                    </button>

                    {/* PROFILE */}
                    <button
                        type="button"
                        onClick={
                            handleViewProfile
                        }
                        disabled={!personId}
                        className="
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:border-amber-300
              hover:bg-amber-50
              hover:text-amber-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >
                        View Profile
                    </button>
                </div>
            </div>
        </article>
    );
}

function formatCount(
    n: number,
): string {
    if (n >= 1_000_000) {
        return `${(
            n / 1_000_000
        ).toFixed(1)}M`;
    }

    if (n >= 1_000) {
        return `${(
            n / 1_000
        ).toFixed(1)}k`;
    }

    return String(n);
}