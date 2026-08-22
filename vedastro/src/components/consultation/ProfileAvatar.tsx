"use client";

import { useState } from "react";

interface ProfileAvatarProps {
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg" | "xl";
    isOnline?: boolean;
    showIndicator?: boolean;
}

const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-base",
    lg: "h-20 w-20 text-xl",
    xl: "h-28 w-28 text-2xl",
};

export function ProfileAvatar({
    name,
    src,
    size = "md",
    isOnline,
    showIndicator = false,
}: ProfileAvatarProps) {
    const [imageError, setImageError] = useState(false);

    const getInitials = (value: string) => {
        return value
            .split(" ")
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("");
    };

    const isValidSrc =
        src &&
        src !== "/images/default-avatar.png" &&
        !src.includes("default-avatar.png");

    const baseClasses = `relative flex shrink-0 items-center justify-center rounded-full border-2 border-white shadow-sm ${sizeClasses[size]} ${isValidSrc && !imageError ? "" : "bg-amber-50 text-amber-700 font-bold"}`;

    return (
        <div className={baseClasses}>
            {isValidSrc && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={name}
                    className="h-full w-full rounded-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span>{getInitials(name)}</span>
            )}

            {showIndicator && (
                <span
                    className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${isOnline ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                />
            )}
        </div>
    );
}