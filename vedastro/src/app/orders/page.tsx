"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Search,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import OrderCard from "../../components/shop/OrderCard";
import { useOrderStore } from "../../store/orderStore";
import { useAuthStore } from "../../store/authStore";
import type { Order } from "../../types/order";

type StatusTab = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, fetchOrders } = useOrderStore();
  const { isAuthenticated, isHydrated, openLoginModal } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, [isAuthenticated, isHydrated, fetchOrders, openLoginModal]);

  const handleCancelOrder = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await useOrderStore.getState().cancelOrder(id);
      await fetchOrders();
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);
      alert("Unable to cancel this order. It may have already been dispatched.");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = (order.orderStatus || "PENDING").toUpperCase();

      if (statusTab === "ACTIVE") {
        if (status === "DELIVERED" || status === "CANCELLED") return false;
      } else if (statusTab === "DELIVERED") {
        if (status !== "DELIVERED") return false;
      } else if (statusTab === "CANCELLED") {
        if (status !== "CANCELLED") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = order._id.toLowerCase().includes(q);
        const itemMatch = order.items?.some((item) =>
          (item.name || "").toLowerCase().includes(q),
        );
        return idMatch || itemMatch;
      }

      return true;
    });
  }, [orders, statusTab, searchQuery]);

  const activeCount = orders.filter(
    (o) =>
      o.orderStatus?.toUpperCase() !== "DELIVERED" &&
      o.orderStatus?.toUpperCase() !== "CANCELLED",
  ).length;

  const deliveredCount = orders.filter(
    (o) => o.orderStatus?.toUpperCase() === "DELIVERED",
  ).length;

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--text-primary)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-(--text-muted)">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-24 text-(--text-primary)">
        <div className="max-w-md rounded-3xl border border-(--border) bg-(--surface-secondary) p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
            <Package className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-(--text-primary)">
            Sign In to View Orders
          </h2>

          <p className="mt-2 text-xs text-(--text-muted)">
            Please login to check the status of your energized Vedic items,
            track package shipments, and download invoices.
          </p>

          <button
            type="button"
            onClick={openLoginModal}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition-all hover:opacity-95 cursor-pointer"
          >
            <span>Login to Continue</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background) py-24 text-(--text-primary) transition-colors duration-200">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Vedic Store</span>
          </Link>
        </div>

        {/* HEADER & STATS */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-(--text-primary) sm:text-4xl">
              My Orders & Rituals
            </h1>
            <p className="mt-1 text-sm text-(--text-muted)">
              Track your energized spiritual items and ritual deliveries
            </p>
          </div>

          {/* QUICK STAT PILLS */}
          <div className="flex flex-wrap gap-2.5">
            <div className="rounded-2xl border border-(--border) bg-(--surface-secondary) px-3.5 py-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-(--text-muted)">
                Total
              </span>
              <p className="text-lg font-black text-(--text-primary)">
                {orders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                In Transit / Active
              </span>
              <p className="text-lg font-black text-amber-600 dark:text-amber-400">{activeCount}</p>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                Delivered
              </span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {deliveredCount}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS: SEARCH & FILTER TABS */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y border-(--border) py-4">
          {/* FILTER TABS */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { key: "ALL", label: "All Orders" },
                { key: "ACTIVE", label: `Active (${activeCount})` },
                { key: "DELIVERED", label: "Delivered" },
                { key: "CANCELLED", label: "Cancelled" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusTab(tab.key)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  statusTab === tab.key
                    ? "bg-amber-500 text-black shadow-sm"
                    : "border border-(--border) bg-(--surface-secondary) text-(--text-secondary) hover:border-amber-500/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search by Order ID or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-(--border) bg-(--surface-secondary) py-2 pl-9 pr-3 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-3xl border border-(--border) bg-(--surface-secondary)"
                />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            /* EMPTY STATE */
            <div className="rounded-3xl border border-dashed border-(--border) bg-(--surface-secondary) p-10 text-center sm:p-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/5">
                <Package className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-black text-(--text-primary)">
                {searchQuery || statusTab !== "ALL"
                  ? "No matching orders found"
                  : "You haven't placed any orders yet"}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-xs text-(--text-muted)">
                {searchQuery || statusTab !== "ALL"
                  ? "Try adjusting your search terms or filter selection."
                  : "Explore certified Rudrakshas, Gemstones, and Vedic Yantras sanctified by Vedic astrologers."}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-bold text-black shadow-md shadow-amber-500/20 hover:opacity-90"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Explore Vedic Store</span>
                </Link>

                {(searchQuery || statusTab !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusTab("ALL");
                    }}
                    className="rounded-2xl border border-(--border) bg-(--surface-tertiary) px-4 py-2.5 text-xs font-bold text-(--text-primary) hover:bg-(--surface)"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order: Order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onView={(id) => router.push(`/orders/${id}`)}
                  onCancel={handleCancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}