"use client";

import {
  Banknote,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";

interface PaymentMethodProps {
  value: "COD" | "ONLINE";
  onChange: (value: "COD" | "ONLINE") => void;
}

export default function PaymentMethod({
  value,
  onChange,
}: PaymentMethodProps) {
  return (
    <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 sm:p-8 text-(--text-primary) shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-(--border) pb-4">
        <div>
          <h2 className="text-xl font-black text-(--text-primary)">
            Select Payment Method
          </h2>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
          <Lock className="h-3 w-3" />
          Step 2
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {/* ONLINE PAYMENT */}
        <label
          onClick={() => onChange("ONLINE")}
          className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
            value === "ONLINE"
              ? "border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10"
              : "border-(--border) bg-(--surface) hover:border-amber-500/40"
          }`}
        >
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500">
            {value === "ONLINE" && (
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-(--text-primary)">
                  Online Payment (UPI, Cards, NetBanking)
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Fastest Dispatch
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                <Zap className="h-3.5 w-3.5" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            <p className="mt-1.5 text-xs text-(--text-muted)">
              Pay securely via Google Pay, PhonePe, Paytm, UPI QR, Visa,
              Mastercard, RuPay, or Net Banking.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-(--border) bg-(--surface-tertiary) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                UPI / QR
              </span>
              <span className="rounded-md border border-(--border) bg-(--surface-tertiary) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                Debit / Credit Card
              </span>
              <span className="rounded-md border border-(--border) bg-(--surface-tertiary) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                Net Banking
              </span>
              <span className="rounded-md border border-(--border) bg-(--surface-tertiary) px-2 py-0.5 text-[11px] font-medium text-(--text-secondary)">
                Wallets
              </span>
            </div>
          </div>
        </label>

        {/* CASH ON DELIVERY */}
        <label
          onClick={() => onChange("COD")}
          className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
            value === "COD"
              ? "border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10"
              : "border-(--border) bg-(--surface) hover:border-amber-500/40"
          }`}
        >
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-500">
            {value === "COD" && (
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-(--text-primary)">
                  Cash on Delivery (COD)
                </span>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                  Pay at Doorstep
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-(--text-muted)">
                <Banknote className="h-3.5 w-3.5" />
                <span>Cash or UPI on Delivery</span>
              </div>
            </div>

            <p className="mt-1.5 text-xs text-(--text-muted)">
              Pay by Cash or scan delivery executive&apos;s UPI QR code when
              your package arrives.
            </p>
          </div>
        </label>
      </div>

      {/* SECURITY GUARANTEE */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-(--border) bg-(--surface-tertiary) p-3.5 text-xs text-(--text-muted)">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
        <p>
          All payments and transactions are processed through bank-grade 256-bit
          encrypted gateways. Your data is 100% confidential.
        </p>
      </div>
    </div>
  );
}
