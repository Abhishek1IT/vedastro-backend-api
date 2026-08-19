"use client";

interface PaymentMethodProps {
  value: "COD" | "ONLINE";
  onChange: (value: "COD" | "ONLINE") => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-white p-6">
      <h2 className="mb-6 text-xl font-bold text-black">Payment Method</h2>

      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 hover:border-amber-500">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={value === "COD"}
            onChange={() => onChange("COD")}
          />

          <div>
            <p className="font-semibold text-black">Cash on Delivery</p>

            <p className="text-sm text-slate-400">
              Pay when your order is delivered.
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 hover:border-amber-500">
          <input
            type="radio"
            name="paymentMethod"
            value="ONLINE"
            checked={value === "ONLINE"}
            onChange={() => onChange("ONLINE")}
          />

          <div>
            <p className="font-semibold text-black">Online Payment</p>

            <p className="text-sm text-black/40">
              Pay securely using UPI, Card or Net Banking.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
