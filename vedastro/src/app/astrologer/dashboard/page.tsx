/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    DollarSign,
    MoreHorizontal,
    Search,
    Star,
    Users,
    Wallet,
    Wifi,
    WifiOff,
    XCircle,
} from "lucide-react";

import { useAuthStore } from "../../../store/authStore";
import lib from "../../../lib/axios";

interface Participant {
    _id?: string;
    id?: string;
    name?: string;
    fullName?: string;
    role?: string;
    avatar?: string;
    profileImage?: string;
    profilePicture?: string;
    isOnline?: boolean;
    lastSeen?: string;
}

interface Conversation {
    _id?: string;
    id?: string;
    participants?: Participant[];
    lastMessage?: string;
    lastMessageAt?: string;
    updatedAt?: string;
}

interface ChatUser {
    conversationId: string;
    userId: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    lastMessage: string;
    lastMessageAt: string | undefined;
}

interface ConversationResponse {
    data?: Conversation[];
}

const getId = (
    value: Participant | string | null | undefined,
): string => {
    if (!value) return "";

    if (typeof value === "string") {
        return value;
    }

    return String(value._id || value.id || "");
};

const getName = (user: Participant): string => {
    return user.name || user.fullName || "User";
};

const formatTime = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatDate = (date?: string) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString([], {
        day: "numeric",
        month: "short",
    });
};

export default function AstrologerDashboard() {
    const [isOpenSearchEnabled, setIsOpenSearchEnabled] = useState(false);
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated,
    );
    const isHydrated = useAuthStore(
        (state) => state.isHydrated,
    );

    const [conversations, setConversations] = useState<
        Conversation[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [isOnline, setIsOnline] = useState(
        Boolean(user?.isOnline),
    );

    useEffect(() => {
        if (!isHydrated) return;

        if (!isAuthenticated || !user) {
            router.replace("/login");
            return;
        }

        if (user.role !== "ASTROLOGER") {
            router.replace("/home");
            return;
        }

        if (user.approvalStatus !== "APPROVED") {
            router.replace("/astrologer/pending");
        }
    }, [
        isHydrated,
        isAuthenticated,
        user,
        router,
    ]);

    const loadConversations = useCallback(
        async () => {
            if (
                !isAuthenticated ||
                !user ||
                user.role !== "ASTROLOGER"
            ) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response =
                    await lib.get<ConversationResponse>(
                        "/chat/conversations",
                    );

                const data = response.data?.data;

                setConversations(
                    Array.isArray(data) ? data : [],
                );
            } catch (err: any) {
                console.error(
                    "ASTROLOGER DASHBOARD ERROR:",
                    err,
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load dashboard data",
                );
            } finally {
                setLoading(false);
            }
        },
        [isAuthenticated, user],
    );

    useEffect(() => {
        if (!isHydrated) return;

        if (
            !isAuthenticated ||
            !user ||
            user.role !== "ASTROLOGER" ||
            user.approvalStatus !== "APPROVED"
        ) {
            setLoading(false);
            return;
        }

        loadConversations();
    }, [
        isHydrated,
        isAuthenticated,
        user,
        loadConversations,
    ]);

    const chatUsers = useMemo<ChatUser[]>(() => {
        if (!user) return [];

        const currentUserId = String(
            user._id || user.id || "",
        );

        if (!currentUserId) return [];

        return conversations
            .map((conversation) => {
                const participants =
                    Array.isArray(
                        conversation.participants,
                    )
                        ? conversation.participants
                        : [];

                const otherUser =
                    participants.find(
                        (participant) =>
                            getId(participant) !==
                            currentUserId,
                    );

                if (!otherUser) {
                    return null;
                }

                const conversationId = String(
                    conversation._id ||
                    conversation.id ||
                    "",
                );

                const otherUserId =
                    getId(otherUser);

                if (
                    !conversationId ||
                    !otherUserId
                ) {
                    return null;
                }

                return {
                    conversationId,
                    userId: otherUserId,
                    name: getName(otherUser),
                    avatar:
                        otherUser.avatar ||
                        otherUser.profileImage ||
                        otherUser.profilePicture ||
                        "",
                    isOnline: Boolean(
                        otherUser.isOnline,
                    ),
                    lastMessage:
                        conversation.lastMessage ||
                        "Start conversation",
                    lastMessageAt:
                        conversation.lastMessageAt ||
                        conversation.updatedAt,
                };
            })
            .filter(
                (
                    item,
                ): item is ChatUser =>
                    item !== null,
            );
    }, [conversations, user]);

    const filteredUsers = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return chatUsers;
        }

        return chatUsers.filter((item) =>
            item.name
                .toLowerCase()
                .includes(query),
        );
    }, [chatUsers, search]);

    const handleOnlineToggle = async () => {
        const nextStatus = !isOnline;

        try {
            setIsOnline(nextStatus);

            await lib.patch(
                "/users/status",
                {
                    isOnline: nextStatus,
                },
            );
        } catch (error) {
            console.error(
                "ONLINE STATUS ERROR:",
                error,
            );

            setIsOnline(!nextStatus);
        }
    };

    const stats = [
        {
            title: "Total Consultations",
            value: user?.totalOrders ?? 0,
            icon: CalendarDays,
            change: "+12%",
            description: "vs last month",
        },
        {
            title: "Total Clients",
            value: chatUsers.length,
            icon: Users,
            change: "+8%",
            description: "active conversations",
        },
        {
            title: "Rating",
            value: Number(user?.rating || 5).toFixed(1),
            icon: Star,
            change: "Excellent",
            description: "client rating",
        },
        {
            title: "Consultation Rate",
            value: `₹${0}`,
            icon: Wallet,
            change: "Per session",
            description: "current pricing",
        },
    ];

    if (!isHydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#090807] text-white">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#3a3023] border-t-[#d6a85f]" />
                    <p className="mt-4 text-sm text-gray-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (
        !isAuthenticated ||
        !user ||
        user.role !== "ASTROLOGER" ||
        user.approvalStatus !== "APPROVED"
    ) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white pt-20 text-black dark:bg-[#090807] dark:text-white">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 dark:border-[#3a3023] dark:bg-[#17120d]">
                                <span className="text-2xl">✨</span>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#a88a5a]">
                                    Astrologer Dashboard
                                </p>

                                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Welcome, {user.name || "Astrologer"}
                                </h1>
                            </div>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                            Manage your consultations, clients, availability and
                            professional profile from one place.
                        </p>
                    </div>

                    {/* ONLINE TOGGLE */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleOnlineToggle}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition ${isOnline
                                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                                : "border-gray-200 bg-gray-50 dark:border-[#302921] dark:bg-[#13100d]"
                                }`}
                        >
                            {isOnline ? (
                                <Wifi className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-gray-500" />
                            )}

                            <div className="text-left">
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <p
                                    className={`text-sm font-medium ${isOnline
                                        ? "text-emerald-500"
                                        : "text-gray-600 dark:text-gray-300"
                                        }`}
                                >
                                    {isOnline ? "Online" : "Offline"}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 dark:border-[#28221b] dark:bg-[#100e0c] dark:hover:border-[#4a3b28]"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1510]">
                                        <Icon className="h-5 w-5 text-[#c7a66a]" />
                                    </div>

                                    <MoreHorizontal className="h-5 w-5 text-gray-400 dark:text-gray-700" />
                                </div>

                                <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
                                    {stat.title}
                                </p>

                                <div className="mt-1 flex items-end justify-between gap-3">
                                    <h2 className="text-2xl font-semibold">
                                        {stat.value}
                                    </h2>

                                    <span className="text-xs text-emerald-500">
                                        {stat.change}
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-600">
                                    {stat.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* RECENT CLIENTS - FULL WIDTH */}
                <div className="mt-6">
                    <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#28221b] dark:bg-[#100e0c]">

                        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#28221b]">
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold">
                                    Recent Clients
                                </h2>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 te  xt-gray-400 dark:text-gray-600" onClick={() => setIsOpenSearchEnabled(!isOpenSearchEnabled)} />
                                {isOpenSearchEnabled && (
                                    <>
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-600" />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="Search clients..."
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-black outline-none placeholder:text-gray-400 focus:border-[#a88a5a] dark:border-[#29231c] dark:bg-[#15120f] dark:text-white dark:placeholder:text-gray-600 dark:focus:border-[#5a4932]"
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="space-y-3 p-5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="animate-pulse rounded-xl bg-gray-100 p-4 dark:bg-[#15120f]"
                                    >
                                        <div className="flex gap-3">
                                            <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-[#29231c]" />

                                            <div className="flex-1">
                                                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-[#29231c]" />

                                                <div className="mt-2 h-3 w-48 rounded bg-gray-200 dark:bg-[#29231c]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="flex min-h-64 items-center justify-center p-6 text-center">
                                <div>
                                    <XCircle className="mx-auto h-8 w-8 text-red-400" />

                                    <p className="mt-3 text-sm text-red-500">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={loadConversations}
                                        className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-[#181512]">
                                    <Users className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                                </div>

                                <h3 className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    No clients found
                                </h3>

                                <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500 dark:text-gray-600">
                                    Clients who start a conversation with you
                                    will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-[#211d18]">
                                {filteredUsers.slice(0, 8).map((client) => (
                                    <button
                                        key={client.conversationId}
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/astrologer/messages?conversationId=${encodeURIComponent(
                                                    client.conversationId,
                                                )}`,
                                            )
                                        }
                                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-[#15120f]"
                                    >
                                        <div className="relative shrink-0">
                                            {client.avatar ? (
                                                <img
                                                    src={client.avatar}
                                                    alt={client.name}
                                                    className="h-11 w-11 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-[#a88a5a] dark:bg-[#24201c] dark:text-[#c7a66a]">
                                                    {client.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            {client.isOnline && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#100e0c]" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    {client.name}
                                                </p>

                                                <span className="shrink-0 text-[10px] text-gray-400 dark:text-gray-600">
                                                    {formatTime(client.lastMessageAt)}
                                                </span>
                                            </div>

                                            <p className="mt-1 truncate text-xs text-gray-500">
                                                {client.lastMessage}
                                            </p>
                                        </div>

                                        <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-700" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {!loading && filteredUsers.length > 8 && (
                            <div className="border-t border-gray-200 p-4 dark:border-[#28221b]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push("/astrologer/messages")
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 transition hover:bg-gray-50 hover:text-black dark:border-[#332b22] dark:text-gray-400 dark:hover:bg-[#181512] dark:hover:text-white"
                                >
                                    View all messages
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* PRACTICE OVERVIEW */}
                <section className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-[#28221b] dark:bg-[#100e0c]">
                    <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-[#28221b]">
                        <div>
                            <h2 className="font-semibold">
                                Practice Overview
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-600">
                                Your professional activity
                            </p>
                        </div>

                        <Activity className="h-5 w-5 text-[#8e7750]" />
                    </div>

                    <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 dark:divide-[#28221b]">
                        <div className="p-5">
                            <div className="flex items-center gap-3">
                                <Clock3 className="h-4 w-4 text-gray-400 dark:text-gray-600" />

                                <span className="text-xs text-gray-500">
                                    Availability
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                {isOnline
                                    ? "Available for consultations"
                                    : "Currently offline"}
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                                <span className="text-xs text-gray-500">
                                    Profile
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                Approved & Active
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-3">
                                <Star className="h-4 w-4 text-[#c7a66a]" />

                                <span className="text-xs text-gray-500">
                                    Rating
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                {Number(user.rating || 5).toFixed(1)} / 5.0
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-600" />

                                <span className="text-xs text-gray-500">
                                    Session Price
                                </span>
                            </div>

                            <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                ₹{0}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}