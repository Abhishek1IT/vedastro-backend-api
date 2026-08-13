/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Phone,
  Star,
  Briefcase,
  Circle,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

import { consultationService } from "../../services/consultation.service";
import { useAuthStore } from "../../store/authStore";
import lib from "../../lib/axios";

interface ConsultationPerson {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  language?: string;
  experience?: number;
  role?: string;
  isOnline?: boolean;
  isVerified?: boolean;

  conversationId?: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

type AdminFilter = "USER" | "ASTROLOGER";

export default function ConsultationPage() {
  const router = useRouter();

  const { user, isAuthenticated, isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState<ConsultationPerson[]>([]);
  const [adminFilter, setAdminFilter] = useState<AdminFilter>("USER");
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);

  const currentRole = String(user?.role || "").toUpperCase();

  const isAstrologer = currentRole === "ASTROLOGER";
  const isNormalUser = currentRole === "USER";
  const isAdmin = currentRole === "ADMIN";

  const isProfileComplete = user?.profileCompleted === true;

  const mapPerson = (
    person: any,
    role: "USER" | "ASTROLOGER",
  ): ConsultationPerson => {
    return {
      _id: String(person?._id || person?.id),

      name:
        person?.name ||
        person?.fullName ||
        (role === "ASTROLOGER" ? "Astrologer" : "User"),

      phone: person?.phone || "",

      email: person?.email || "",

      avatar:
        person?.avatar || person?.profileImage || person?.profilePicture || "",

      language: person?.language || "en",

      experience: Number(person?.experience || 0),

      role,

      isOnline: Boolean(person?.isOnline),

      isVerified: Boolean(person?.isVerified),

      conversationId: person?.conversationId
        ? String(person.conversationId)
        : undefined,

      lastMessage: person?.lastMessage || "",

      lastMessageAt: person?.lastMessageAt
        ? String(person.lastMessageAt)
        : undefined,
    };
  };

  const uniquePeople = (list: ConsultationPerson[]): ConsultationPerson[] => {
    return Array.from(
      new Map(list.map((person) => [person._id, person])).values(),
    );
  };

  const loadAstrologers = async () => {
    try {
      console.log("LOADING ASTROLOGERS...");

      const data = await consultationService.getAstrologers();

      console.log("ASTROLOGERS FROM SERVICE:", data);

      if (!Array.isArray(data)) {
        console.error("Astrologers data is not array:", data);
        setPeople([]);
        return;
      }

      const currentUserId = String(user?._id || "");

      const astrologers: ConsultationPerson[] = data
        .filter((astro: any) => {
          const astroId = String(astro?._id || astro?.id || "");

          // Current logged-in user ko list se hatao
          return astroId && astroId !== currentUserId;
        })
        .map((astro: any) => ({
          _id: String(astro._id || astro.id),

          name: astro.name || "Astrologer",

          phone: astro.phone || "",

          email: astro.email || "",

          avatar: astro.avatar || "",

          language: astro.language || "en",

          experience: Number(astro.experience || 0),

          role: "ASTROLOGER",

          isOnline: Boolean(astro.isOnline),

          isVerified: Boolean(astro.isVerified),

          conversationId: undefined,

          lastMessage: "",

          lastMessageAt: undefined,
        }));

      console.log("FINAL ASTROLOGERS:", astrologers);

      setPeople(uniquePeople(astrologers));
    } catch (error) {
      console.error("LOAD ASTROLOGERS ERROR:", error);
      setPeople([]);
    }
  };

  const loadUsersForAdmin = async () => {
    const response = await lib.get("/admin/users");

    const usersData = response?.data?.data;

    const users: ConsultationPerson[] = Array.isArray(usersData)
      ? usersData
        .filter((item: any) => {
          return String(item?.role || "").toUpperCase() === "USER";
        })
        .map((item: any) => mapPerson(item, "USER"))
      : [];

    setPeople(uniquePeople(users));
  };

  const loadUsersForAstrologer = async () => {
    const response = await lib.get("/chat/conversations");

    const conversations = response?.data?.data || [];

    if (!Array.isArray(conversations)) {
      setPeople([]);
      return;
    }

    const users: ConsultationPerson[] = conversations
      .map((conversation: any): ConsultationPerson | null => {
        const participants = conversation?.participants || [];

        if (!Array.isArray(participants)) {
          return null;
        }

        const otherUser = participants.find((participant: any) => {
          const participantId =
            typeof participant === "object"
              ? participant?._id || participant?.id
              : participant;

          return String(participantId) !== String(user?._id);
        });

        if (!otherUser) {
          return null;
        }

        const otherUserId =
          typeof otherUser === "object"
            ? otherUser?._id || otherUser?.id
            : otherUser;

        if (!otherUserId) {
          return null;
        }

        const otherRole =
          typeof otherUser === "object"
            ? String(otherUser?.role || "USER").toUpperCase()
            : "USER";

        if (otherRole !== "USER") {
          return null;
        }

        return {
          _id: String(otherUserId),

          name:
            typeof otherUser === "object"
              ? otherUser?.name || otherUser?.fullName || "User"
              : "User",

          phone: typeof otherUser === "object" ? otherUser?.phone || "" : "",

          email: typeof otherUser === "object" ? otherUser?.email || "" : "",

          avatar:
            typeof otherUser === "object"
              ? otherUser?.avatar || otherUser?.profileImage || ""
              : "",

          language:
            typeof otherUser === "object" ? otherUser?.language || "en" : "en",

          experience:
            typeof otherUser === "object"
              ? Number(otherUser?.experience || 0)
              : 0,

          role: "USER",

          isOnline:
            typeof otherUser === "object"
              ? Boolean(otherUser?.isOnline)
              : false,

          isVerified:
            typeof otherUser === "object"
              ? Boolean(otherUser?.isVerified)
              : false,

          conversationId: conversation?._id
            ? String(conversation._id)
            : undefined,

          lastMessage: conversation?.lastMessage || "",

          lastMessageAt: conversation?.lastMessageAt
            ? String(conversation.lastMessageAt)
            : undefined,
        };
      })
      .filter((person): person is ConsultationPerson => person !== null);

    setPeople(uniquePeople(users));
  };

  const loadConsultations = useCallback(async () => {
    try {
      setLoading(true);

      if (isAdmin) {
        if (adminFilter === "USER") {
          await loadUsersForAdmin();
        } else {
          await loadAstrologers();
        }

        return;
      }

      if (isAstrologer && isAuthenticated && user?._id) {
        await loadUsersForAstrologer();
        return;
      }

      await loadAstrologers();
    } catch (error) {
      console.error("Load consultations error:", error);

      setPeople([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, adminFilter, isAstrologer, isAuthenticated, user?._id]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    loadConsultations();
  }, [isHydrated, loadConsultations]);

  const handleAction = (
    type: "chat" | "call",
    personId: string,
    conversationId?: string,
  ) => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=${encodeURIComponent("/consultations")}`);

      return;
    }

    if (!isAdmin && user.profileCompleted !== true) {
      router.push(`/profile?redirect=${encodeURIComponent("/consultations")}`);

      return;
    }

    if (isAstrologer) {
      if (type === "chat") {
        const params = new URLSearchParams();

        params.set("userId", personId);

        if (conversationId) {
          params.set("conversationId", conversationId);
        }

        router.push(`/consultations/chat?${params.toString()}`);

        return;
      }

      router.push(`/consultations/call?userId=${encodeURIComponent(personId)}`);

      return;
    }

    if (isNormalUser) {
      if (type === "chat") {
        router.push(
          `/consultations/chat?astroId=${encodeURIComponent(personId)}`,
        );

        return;
      }

      router.push(
        `/consultations/call?astroId=${encodeURIComponent(personId)}`,
      );

      return;
    }

    if (isAdmin) {
      if (type === "chat") {
        const params = new URLSearchParams();

        if (adminFilter === "USER") {
          params.set("userId", personId);
        } else {
          params.set("astroId", personId);
        }

        if (conversationId) {
          params.set("conversationId", conversationId);
        }

        router.push(`/consultations/chat?${params.toString()}`);

        return;
      }

      if (adminFilter === "USER") {
        router.push(
          `/consultations/call?userId=${encodeURIComponent(personId)}`,
        );
      } else {
        router.push(
          `/consultations/call?astroId=${encodeURIComponent(personId)}`,
        );
      }
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="animate-pulse">Loading consultations...</p>
      </div>
    );
  }

  function ProfileAvatar({
    person,
  }: {
    person: ConsultationPerson;
  }) {
    const [imageError, setImageError] = useState(false);

    const name =
      person.name ||
      (person.role === "ASTROLOGER" ? "Astrologer" : "User");

    const getInitials = (value: string) => {
      return value
        .split(" ")
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    };

    const avatar =
      person.avatar &&
        person.avatar !== "/images/default-avatar.png" &&
        !person.avatar.includes("default-avatar.png")
        ? person.avatar
        : "";

    if (!avatar || imageError) {
      return (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xl font-bold text-amber-400">
          {getInitials(name)}
        </div>
      );
    }

    return (
      <img
        src={avatar}
        alt={name}
        className="h-20 w-20 shrink-0 rounded-full border border-slate-700 object-cover"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="mx-auto mb-4 max-w-7xl">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin
                ? "Consultations"
                : isAstrologer
                  ? "Recent Consultations"
                  : "Consult Astrologers"}
            </h1>

            <p className="mt-2 text-slate-400">
              {isAdmin
                ? "Manage users and astrologers."
                : isAstrologer
                  ? "Users who have messaged you."
                  : "Choose an astrologer and start Chat or Call."}
            </p>
          </div>

          {/* ADMIN DROPDOWN */}
          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                className="flex min-w-45 items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:border-amber-500"
              >
                <span>{adminFilter === "USER" ? "Users" : "Astrologers"}</span>

                <ChevronDown
                  size={18}
                  className={adminDropdownOpen ? "rotate-180" : ""}
                />
              </button>

              {adminDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-full min-w-45 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminFilter("USER");
                      setAdminDropdownOpen(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-800 ${adminFilter === "USER"
                      ? "bg-slate-800 text-amber-400"
                      : "text-white"
                      }`}
                  >
                    Users
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminFilter("ASTROLOGER");
                      setAdminDropdownOpen(false);
                    }}
                    className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-slate-800 ${adminFilter === "ASTROLOGER"
                      ? "bg-slate-800 text-amber-400"
                      : "text-white"
                      }`}
                  >
                    Astrologers
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logged out */}
        {!isAuthenticated && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
            You can browse astrologers without logging in. Login is required to
            Chat or Call.
          </div>
        )}

        {/* Profile incomplete */}
        {isAuthenticated && user && !isAdmin && !isProfileComplete && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm text-amber-200">
            Complete your profile before starting a Chat or Call.
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading...</div>
        ) : people.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            {isAstrologer
              ? "No users have messaged you yet."
              : isAdmin
                ? adminFilter === "USER"
                  ? "No users available."
                  : "No astrologers available."
                : "No astrologers available."}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <div
                key={person.conversationId || person._id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-amber-500"
              >
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <ProfileAvatar person={person} />

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold">
                      {person.name ||
                        (person.role === "ASTROLOGER" ? "Astrologer" : "User")}
                    </h2>

                    <p className="text-sm text-slate-400">
                      {person.role === "ASTROLOGER" ? "Astrologer" : "User"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Circle
                        size={10}
                        fill={person.isOnline ? "#22c55e" : "#ef4444"}
                        color={person.isOnline ? "#22c55e" : "#ef4444"}
                      />

                      <span className="text-xs">
                        {person.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3">
                  {person.role === "ASTROLOGER" ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase size={16} />
                        {person.experience || 0} Years Experience
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Star size={16} className="text-yellow-400" />

                        {person.isVerified
                          ? "Verified Astrologer"
                          : "Astrologer"}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MessageCircle size={16} />

                      <span className="truncate">
                        {person.lastMessage || "User"}
                      </span>
                    </div>
                  )}

                  {isAstrologer && person.lastMessageAt && (
                    <div className="text-xs text-slate-500">
                      Last message:{" "}
                      {new Date(person.lastMessageAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleAction("chat", person._id, person.conversationId)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400"
                  >
                    <MessageCircle size={18} />
                    Chat
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAction("call", person._id, person.conversationId)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-500"
                  >
                    <Phone size={18} />
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
