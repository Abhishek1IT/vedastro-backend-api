/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  CreditCard,
  MapPin,
  MessageSquare,
  Printer,
  ShieldCheck,
  Sparkles,
  Truck,
  Phone,
  XCircle,
} from "lucide-react";

import orderService from "../../../services/order.service";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await orderService.getOrder(params.id as string);
        setOrder(data?.data || data);
      } catch (error) {
        console.error("GET ORDER ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadOrder();
    }
  }, [params.id]);

  const handleCopyId = () => {
    if (!order?._id) return;
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) text-(--text-primary)">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-(--text-muted)">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-24 text-(--text-primary)">
        <div className="max-w-md rounded-3xl border border-(--border) bg-(--surface-secondary) p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <XCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-black text-(--text-primary)">
            Order Not Found
          </h2>

          <p className="mt-2 text-xs text-(--text-muted)">
            We couldn&apos;t locate the order details. It may have been removed
            or the ID is invalid.
          </p>

          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = (order.orderStatus || "PENDING").toUpperCase();

  // TIMELINE STEPS
  const timelineSteps = [
    {
      key: "PENDING",
      title: "Order Placed",
      desc: "Order confirmed & sent to sanctification team",
      icon: Clock,
    },
    {
      key: "PROCESSING",
      title: "Pran Pratishtha",
      desc: "Energized by Vedic Gurus with sacred mantras",
      icon: Sparkles,
    },
    {
      key: "SHIPPED",
      title: "Dispatched",
      desc: "Handed over to courier with tracking",
      icon: Truck,
    },
    {
      key: "DELIVERED",
      title: "Delivered",
      desc: "Safely received at your doorstep",
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case "DELIVERED":
        return 3;
      case "SHIPPED":
        return 2;
      case "PROCESSING":
        return 1;
      case "PENDING":
      default:
        return 0;
    }
  };

  const currentStepIdx =
    status === "CANCELLED" ? -1 : getStepIndex(status);

  return (
    <div className="min-h-screen bg-(--background) py-24 text-(--text-primary) transition-colors duration-200">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* BACK BUTTON */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 transition-colors hover:text-amber-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Orders</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-(--border) bg-(--surface-secondary) px-3 py-1.5 text-xs font-semibold text-(--text-secondary) transition-colors hover:bg-(--surface-tertiary) hover:text-(--text-primary)"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* ORDER HEADER CARD */}
        <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--border) pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
                  Order Reference:
                </span>
                <span className="rounded-lg bg-amber-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-500">
                  #{order._id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy ID"
                  className="text-(--text-muted) hover:text-amber-500 cursor-pointer"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-(--text-muted)">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            {/* STATUS PILL */}
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-(--text-muted)">
                Current Status
              </span>
              <p
                className={`mt-0.5 inline-block rounded-full border px-3.5 py-1 text-xs font-bold ${
                  status === "DELIVERED"
                    ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : status === "CANCELLED"
                    ? "border-red-500/30 bg-red-500/15 text-red-600 dark:text-red-400"
                    : "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {status === "CANCELLED" ? "Order Cancelled" : status}
              </p>
            </div>
          </div>

          {/* TIMELINE PROGRESS TRACKER */}
          {status !== "CANCELLED" ? (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-6">
                Live Fulfillment Progress
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                {timelineSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div
                      key={step.key}
                      className={`relative flex flex-col rounded-2xl border p-4 transition-all ${
                        isCompleted
                          ? "border-amber-500/40 bg-amber-500/10"
                          : "border-(--border) bg-(--surface) opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                            isCompleted
                              ? "bg-amber-500 text-black shadow-sm"
                              : "border border-(--border) bg-(--surface-tertiary) text-(--text-muted)"
                          }`}
                        >
                          <StepIcon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-bold text-(--text-primary)">
                          {step.title}
                        </span>
                      </div>

                      <p className="mt-2 text-[11px] text-(--text-muted) leading-relaxed">
                        {step.desc}
                      </p>

                      {isCurrent && (
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                          <span>In Progress</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-500">
              This order was cancelled. If you were charged, a full refund will
              be processed to your original payment method within 3-5 business
              days.
            </div>
          )}
        </div>

        {/* 2-COLUMN DETAILS LAYOUT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT: ORDERED ITEMS */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-(--border) pb-4">
                <h3 className="text-base font-black text-(--text-primary)">
                  Items in this Order ({order.items?.length || 0})
                </h3>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Pran Pratishtha Verified
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {order.items?.map((item: any, idx: number) => {
                  const rawImg = item.image || item.product?.images?.[0]?.url;
                  const imgUrl = rawImg
                    ? rawImg.startsWith("http")
                      ? rawImg
                      : `${BACKEND_URL.replace(/\/$/, "")}/${rawImg.replace(/^\//, "")}`
                    : "/images/product-placeholder.png";

                  return (
                    <div
                      key={`${item.product || idx}-${idx}`}
                      className="flex flex-col gap-4 rounded-2xl border border-(--border) bg-(--surface) p-4 sm:flex-row sm:items-center"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-(--border) bg-(--surface-tertiary)">
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
                              e.currentTarget.src =
                                "/images/product-placeholder.png";
                            }
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                            Energized
                          </span>
                        </div>

                        <h4 className="mt-1 text-sm font-bold text-(--text-primary)">
                          {item.name}
                        </h4>

                        <p className="mt-1 text-xs text-(--text-muted)">
                          Quantity: {item.quantity} × ₹
                          {item.price?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-(--text-muted)">
                          Item Total
                        </span>
                        <p className="text-base font-black text-(--text-primary)">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SANKALP NOTE (IF ANY) */}
            {order.shippingAddress?.notes && (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6 text-xs text-(--text-primary)">
                <div className="flex items-center gap-2 font-bold text-amber-500">
                  <Sparkles className="h-4 w-4" />
                  <span>Personalized Vedic Sankalp Note</span>
                </div>
                <p className="mt-2 text-xs italic text-(--text-secondary)">
                  &ldquo;{order.shippingAddress.notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: ADDRESS, PAYMENT, BILLING */}
          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}
            {order.shippingAddress && (
              <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 text-xs">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-(--text-muted) border-b border-(--border) pb-3">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>Delivery Address</span>
                </div>

                <div className="mt-4 space-y-2 text-(--text-secondary)">
                  <p className="text-sm font-bold text-(--text-primary)">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="flex items-center gap-1.5 text-(--text-muted)">
                    <Phone className="h-3.5 w-3.5" />
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-(--text-secondary) leading-relaxed">
                    {order.shippingAddress.address}
                  </p>
                  <p className="font-semibold text-(--text-primary)">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* BILLING & PAYMENT SUMMARY */}
            <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-(--text-muted) border-b border-(--border) pb-3">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span>Payment Summary</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-(--text-secondary)">
                  <span>Payment Mode</span>
                  <span className="font-bold text-(--text-primary)">
                    {order.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment (UPI/Cards)"}
                  </span>
                </div>

                <div className="flex justify-between text-(--text-secondary)">
                  <span>Vedic Energization</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                </div>

                <div className="flex justify-between text-(--text-secondary)">
                  <span>Shipping & Handling</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                </div>

                <div className="border-t border-(--border) pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-bold text-(--text-primary)">
                      Total Paid / Payable
                    </span>
                    <span className="text-xl font-black text-amber-500">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NEED ASTROLOGY ADVICE CARD */}
            <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 text-center text-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="mt-3 font-bold text-(--text-primary)">
                Questions about wearing your item?
              </h4>
              <p className="mt-1 text-[11px] text-(--text-muted)">
                Our Vedic Astrologers can advise on the exact auspicious Mahurat
                and Beej Mantras.
              </p>
              <Link
                href="/consultations"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/15 px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors hover:bg-amber-500 hover:text-black"
              >
                <span>Consult Pandit Ji</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
