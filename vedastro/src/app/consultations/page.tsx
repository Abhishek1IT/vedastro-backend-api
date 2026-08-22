/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronDown } from "lucide-react";

import { consultationService } from "../../services/consultation.service";
import { useAuthStore } from "../../store/authStore";
import { useConsultationStore } from "../../store/useConsultationStore";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Astrologer,
  AstrologerExpertise,
} from "../../types/consultation";

import { ConsultationHero } from "../../components/consultation/ConsultationHero";
import { ConsultationTypeSelector } from "../../components/consultation/ConsultationTypeSelector";
import { ConsultationCategories } from "../../components/consultation/ConsultationCategories";
import { ConsultationToolbar } from "../../components/consultation/ConsultationToolbar";
import { ConsultationFilters as FilterSidebar } from "../../components/consultation/ConsultationFilters";
import { MobileFilterSheet } from "../../components/consultation/MobileFilterSheet";
import { AstrologerCard } from "../../components/consultation/AstrologerCard";
import { AstrologerCardSkeleton } from "../../components/consultation/AstrologerCardSkeleton";
import { ConsultationEmptyState } from "../../components/consultation/ConsultationEmptyState";
import { ConsultationErrorState } from "../../components/consultation/ConsultationErrorState";

const ITEMS_PER_PAGE = 12;

export default function ConsultationsPage() {
  const router = useRouter();

  const {
    isAuthenticated,
    user,
  } = useAuthStore();

  const isAstrologerView =
    user?.role === "ASTROLOGER";

  const {
    searchQuery,
    selectedConsultationType,
    selectedCategory,
    filters,
    sortBy,
  } = useConsultationStore();

  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    let cancelled = false;

    async function loadPeople() {
      setLoading(true);
      setError(null);

      try {
        let data: Astrologer[] = [];

        if (isAstrologerView) {
          data =
            await consultationService.getChatUsers();
        } else {
          data =
            await consultationService.getAstrologers();
        }

        if (!cancelled) {
          setAstrologers(
            Array.isArray(data)
              ? data
              : [],
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error(
          "CONSULTATIONS LOAD ERROR:",
          err,
        );

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Failed to load users",
          );
        } else {
          setError(
            "Something went wrong. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (isAstrologerView && (!isAuthenticated || !user)) {
      setLoading(false);
      return;
    }

    loadPeople();

    return () => {
      cancelled = true;
    };
  }, [
    isAuthenticated,
    isAstrologerView,
    user?._id,
  ]);

  const filteredAstrologers = useMemo(() => {
    let result = [...astrologers];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();

      result = result.filter((a) => {
        const name = String(a.name || "").toLowerCase();

        const expertise = Array.isArray(a.expertise)
          ? a.expertise
          : [];

        const specializations = Array.isArray(
          a.specializations,
        )
          ? a.specializations
          : [];

        return (
          name.includes(q) ||
          expertise.some((e) =>
            String(e).toLowerCase().includes(q),
          ) ||
          specializations.some((s) =>
            String(s).toLowerCase().includes(q),
          )
        );
      });
    }

    if (
      selectedCategory &&
      selectedCategory !== "All"
    ) {
      result = result.filter(
        (a) =>
          a.specializations?.includes(
            selectedCategory,
          ) ||
          a.expertise.includes(
            selectedCategory as AstrologerExpertise,
          ),
      );
    }

    if (filters.expertise.length > 0) {
      result = result.filter((a) =>
        filters.expertise.some((exp) =>
          a.expertise.includes(exp),
        ),
      );
    }

    if (filters.availability.length > 0) {
      result = result.filter((a) =>
        filters.availability.some((avail) => {
          if (avail === "now") {
            return (
              Boolean(a.isOnline) &&
              !Boolean(a.isBusy)
            );
          }

          if (avail === "today") {
            return (
              Boolean(a.isOnline) ||
              !Boolean(a.isBusy)
            );
          }

          return true;
        }),
      );
    }

    if (filters.experience.length > 0) {
      result = result.filter((a) =>
        filters.experience.some((exp) => {
          const experience =
            Number(a.experience) || 0;

          if (exp === "1-5") {
            return (
              experience >= 1 &&
              experience <= 5
            );
          }

          if (exp === "5-10") {
            return (
              experience > 5 &&
              experience <= 10
            );
          }

          if (exp === "10+") {
            return experience > 10;
          }

          return false;
        }),
      );
    }

    if (filters.languages.length > 0) {
      result = result.filter((a) => {
        const languages = Array.isArray(
          a.languages,
        )
          ? a.languages
          : [];

        return filters.languages.some((lang) =>
          languages.includes(lang),
        );
      });
    }

    const [minPrice, maxPrice] =
      filters.priceRange;

    if (minPrice > 0 || maxPrice < 0) {
      result = result.filter((a) => {
        const price =
          a.pricing?.[
          selectedConsultationType
          ];

        if (
          price === undefined ||
          price === null
        ) {
          return true;
        }

        return (
          price >= minPrice &&
          price <= maxPrice
        );
      });
    }

    switch (sortBy) {
      case "rating":
        result.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0),
        );
        break;

      case "experience":
        result.sort(
          (a, b) =>
            (b.experience || 0) -
            (a.experience || 0),
        );
        break;

      case "price-low":
        result.sort((a, b) => {
          const pa =
            a.pricing?.[
            selectedConsultationType
            ] ?? Infinity;

          const pb =
            b.pricing?.[
            selectedConsultationType
            ] ?? Infinity;

          return pa - pb;
        });
        break;

      case "price-high":
        result.sort((a, b) => {
          const pa =
            a.pricing?.[
            selectedConsultationType
            ] ?? -Infinity;

          const pb =
            b.pricing?.[
            selectedConsultationType
            ] ?? -Infinity;

          return pb - pa;
        });
        break;

      case "consulted":
        result.sort(
          (a, b) =>
            (b.consultationCount || 0) -
            (a.consultationCount || 0),
        );
        break;

      case "recommended":
      default:
        result.sort((a, b) => {
          const scoreA =
            (a.rating || 0) * 0.4 +
            (a.experience || 0) * 0.3 +
            (a.consultationCount || 0) *
            0.01 +
            (a.isOnline ? 5 : 0);

          const scoreB =
            (b.rating || 0) * 0.4 +
            (b.experience || 0) * 0.3 +
            (b.consultationCount || 0) *
            0.01 +
            (b.isOnline ? 5 : 0);

          return scoreB - scoreA;
        });

        break;
    }

    return result;
  }, [
    astrologers,
    debouncedSearch,
    selectedCategory,
    selectedConsultationType,
    filters,
    sortBy,
  ]);

  const paginatedAstrologers = useMemo(() => {
    return filteredAstrologers.slice(
      0,
      page * ITEMS_PER_PAGE,
    );
  }, [filteredAstrologers, page]);

  const hasMore =
    paginatedAstrologers.length <
    filteredAstrologers.length;

  const totalCount =
    filteredAstrologers.length;

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    selectedCategory,
    selectedConsultationType,
    filters,
    sortBy,
  ]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const handleChat = useCallback(
    (id: string) => {
      if (!id) {
        console.error(
          "Astrologer ID missing for chat",
        );
        return;
      }

      const url =
        `/consultations/chat?astrologerId=${encodeURIComponent(id)}`;

      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(url)}`,
        );
        return;
      }

      console.log(
        "OPENING CHAT FOR ASTROLOGER:",
        id,
      );

      router.push(url);
    },
    [isAuthenticated, router],
  );

  const handleCall = useCallback(
    (id: string) => {
      if (!id) {
        console.error(
          "Chat person ID missing",
        );
        return;
      }

      const url = isAstrologerView
        ? `/consultations/chat?userId=${encodeURIComponent(id)}`
        : `/consultations/chat?astrologerId=${encodeURIComponent(id)}`;

      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(url)}`,
        );
        return;
      }

      console.log(
        "OPEN CHAT:",
        {
          role: user?.role,
          id,
          url,
        },
      );

      router.push(url);
    },
    [
      isAuthenticated,
      isAstrologerView,
      router,
      user?.role,
    ],
  );

  const handleVideoCall = useCallback(
    (id: string) => {
      if (!id) {
        console.error(
          "Video call person ID missing",
        );
        return;
      }

      const url = isAstrologerView
        ? `/consultations/call?userId=${encodeURIComponent(id)}&type=video`
        : `/consultations/call?astrologerId=${encodeURIComponent(id)}&type=video`;

      if (!isAuthenticated) {
        router.push(
          `/login?redirect=${encodeURIComponent(url)}`,
        );
        return;
      }

      console.log(
        "OPEN VIDEO CALL:",
        {
          role: user?.role,
          id,
          url,
        },
      );

      router.push(url);
    },
    [
      isAuthenticated,
      isAstrologerView,
      router,
      user?.role,
    ],
  );

  const handleProfile = useCallback(
    (id: string) => {
      if (!id) {
        console.error(
          "Profile person ID missing",
        );
        return;
      }

      const url = isAstrologerView
        ? `/profile/${id}`
        : `/astrologer/${id}`;

      console.log(
        "OPEN PROFILE:",
        {
          role: user?.role,
          id,
          url,
        },
      );

      router.push(url);
    },
    [
      isAstrologerView,
      router,
      user?.role,
    ],
  );

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-24">

      <ConsultationHero />

      <ConsultationTypeSelector />

      <ConsultationCategories />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <ConsultationToolbar
          totalCount={totalCount}
          onToggleFilters={() =>
            setShowDesktopFilters(
              (prev) => !prev,
            )
          }
        />

        <div className="mt-6 flex gap-8">

          {showDesktopFilters && (
            <aside className="hidden w-72 shrink-0 lg:block">
              <FilterSidebar />
            </aside>
          )}

          <main className="min-w-0 flex-1">

            {error ? (
              <ConsultationErrorState
                onRetry={handleRetry}
              />
            ) : paginatedAstrologers.length ===
              0 &&
              !loading ? (
              <ConsultationEmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                  {paginatedAstrologers.map(
                    (astrologer) => (
                      <AstrologerCard
                        key={astrologer._id}
                        astrologer={astrologer}
                        consultationType={
                          selectedConsultationType
                        }
                        onChat={handleChat}
                        onCall={handleCall}
                        onVideoCall={handleVideoCall}
                        isAstrologerView={
                          isAstrologerView
                        }
                      />
                    ),
                  )}

                  {loading &&
                    Array.from({
                      length: 6,
                    }).map((_, i) => (
                      <AstrologerCardSkeleton
                        key={`skeleton-${i}`}
                      />
                    ))}
                </div>

                {hasMore &&
                  !loading &&
                  paginatedAstrologers.length >
                  0 && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={
                          handleLoadMore
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
                      >
                        Load More Astrologers
                        
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                {!hasMore &&
                  paginatedAstrologers.length >
                  0 && (
                    <p className="mt-10 text-center text-sm text-gray-500">
                      You&apos;ve seen all{" "}
                      {totalCount} astrologers
                    </p>
                  )}
              </>
            )}
          </main>
        </div>
      </div>

      <MobileFilterSheet />
    </div>
  );
}