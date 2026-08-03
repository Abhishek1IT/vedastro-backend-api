"use client";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

export type PaymentType = "cod" | "razorpay" | "upi";

interface Props {
  value: PaymentType;
  onChange: (value: PaymentType) => void;
}

const methods = [
  {
    id: "cod",
    title: "Cash On Delivery",
  },
  {
    id: "razorpay",
    title: "Razorpay",
  },
  {
    id: "upi",
    title: "UPI Payment",
  },
];

export default function PaymentMethod({ value, onChange }: Props) {
  return (
    <Card>
      <h2 className="mb-5 text-2xl font-black">Payment Method</h2>

      <div className="space-y-4">
        {methods.map((method) => (
          <label
            key={method.id}
            className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 p-4 hover:border-amber-500"
          >
            <div>
              <p className="font-bold">{method.title}</p>
            </div>

            <input
              type="radio"
              checked={value === method.id}
              onChange={() => onChange(method.id as PaymentType)}
            />
          </label>
        ))}
      </div>

      <div className="mt-5">
        <Badge variant="amber">Secure Payment</Badge>
      </div>
    </Card>
  );
}
