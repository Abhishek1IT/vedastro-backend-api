/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import type { Order } from "../../types/order";

interface Props {
  order: Order;
  onView?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export default function OrderCard({ order, onView, onCancel }: Props) {
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onCancel) return;
    setCancelling(true);
    try {
      await onCancel(order._id);
    } finally {
      setCancelling(false);
    }
  };

  const status = (order.orderStatus || "PENDING").toUpperCase();

  const getStatusBadge = () => {
    switch (status) {
      case "DELIVERED":
        return {
          icon: CheckCircle2,
          label: "Delivered",
          classes:
            "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "SHIPPED":
        return {
          icon: Truck,
          label: "Shipped / In Transit",
          classes:
            "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "CANCELLED":
        return {
          icon: XCircle,
          label: "Cancelled",
          classes:
            "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        };
      case "PROCESSING":
        return {
          icon: Sparkles,
          label: "Pran Pratishtha / Packing",
          classes:
            "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "PENDING":
      default:
        return {
          icon: Clock,
          label: "Order Placed",
          classes:
            "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  const canCancel =
    status !== "DELIVERED" && status !== "CANCELLED" && status !== "SHIPPED";

  const items = order.items || [];
  const previewItems = items.slice(0, 3);
  const remainingCount = items.length - previewItems.length;

  return (
    <div
      onClick={() => onView?.(order._id)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl border border-(--border) bg-(--surface-secondary) p-5 sm:p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-md"
    >
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border) pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-(--border) bg-(--surface) px-2.5 py-1 text-xs font-mono font-bold text-(--text-primary)">
            <span>#{order._id.slice(-8).toUpperCase()}</span>
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Order ID"
              className="text-(--text-muted) hover:text-amber-500 cursor-pointer"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusInfo.classes}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{statusInfo.label}</span>
        </div>
      </div>

      {/* ITEMS PREVIEW */}
      <div className="mt-4 space-y-3">
        {previewItems.map((item: any, idx: number) => {
          const rawImg = item.image || item.product?.images?.[0]?.url;
          const imgUrl = rawImg
            ? rawImg.startsWith("http")
              ? rawImg
              : `${BACKEND_URL.replace(/\/$/, "")}/${rawImg.replace(/^\//, "")}`
            : "/images/product-placeholder.png";

          return (
            <div
              key={`${item.product || idx}-${idx}`}
              className="flex items-center gap-3"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-(--border) bg-(--surface-tertiary)">
                <img
                  src={imgUrl}
                  alt={item.name || "Product"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    if (
                      !e.currentTarget.src.endsWith(
                        "/images/product-placeholder.png",
                      )
                    ) {
                      e.currentTarget.src = "/images/product-placeholder.png";
                    }
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-(--text-primary) line-clamp-1">
                  {item.name || "Vedic Sacred Item"}
                </p>
                <p className="text-[11px] text-(--text-muted)">
                  Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-(--text-primary)">
                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}

        {remainingCount > 0 && (
          <p className="text-[11px] font-semibold text-amber-500">
            +{remainingCount} more item{remainingCount > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* FOOTER ROW */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-(--border) pt-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-(--text-muted)">
            Total Amount
          </span>
          <p className="text-xl font-black text-amber-500">
            ₹{order.total?.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && (
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={cancelling}
              className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50 cursor-pointer"
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(order._id);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500 hover:text-black cursor-pointer"
          >
            <span>View Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}