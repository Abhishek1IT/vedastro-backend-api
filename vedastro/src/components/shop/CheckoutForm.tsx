"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Button from "../common/Button";

export interface CheckoutData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutFormProps {
  initialValues?: CheckoutData;
  onSubmit: (data: CheckoutData) => void;
}

export default function CheckoutForm({
  initialValues,
  onSubmit,
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutData>(
    initialValues ?? {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-black">Shipping Address</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/20 p-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/20 p-3"
        />

        <textarea
          name="address"
          placeholder="Address"
          rows={3}
          value={form.address}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/20 p-3"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="rounded-lg border border-slate-800 bg-slate-900/20 p-3"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="rounded-lg border border-slate-800 bg-slate-900/20 p-3"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            className="rounded-lg border border-slate-800 bg-slate-900/20 p-3"
          />
        </div>

        <Button className="w-full">Continue To Payment</Button>
      </form>
    </Card>
  );
}
