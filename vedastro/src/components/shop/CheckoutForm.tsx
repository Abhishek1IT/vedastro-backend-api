"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Building,
  Navigation,
  Sparkles,
  Lock,
  MapPin,
  AlertCircle,
} from "lucide-react";

export interface CheckoutData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

interface CheckoutFormProps {
  initialValues?: CheckoutData;
  onSubmit: (data: CheckoutData) => void;
  loading?: boolean;
  totalAmount?: number;
}

export default function CheckoutForm({
  initialValues,
  onSubmit,
  loading = false,
  totalAmount,
}: CheckoutFormProps) {
  const [form, setForm] = useState<CheckoutData>(
    initialValues ?? {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      notes: "",
    },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    } else if (parseInt(cleanPhone.charAt(0)) < 5) {
      alert("Invalid mobile number format. Number cannot start with a digit less than 5.");
      newErrors.phone = "Mobile number cannot start with a digit less than 5";
    }

    if (!form.address.trim()) {
      newErrors.address = "Complete delivery address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    const cleanPin = form.pincode.replace(/\D/g, "");
    if (!cleanPin) {
      newErrors.pincode = "Pincode is required";
    } else if (cleanPin.length !== 6) {
      newErrors.pincode = "Enter a valid 6-digit Indian PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <div className="rounded-3xl border border-(--border) bg-(--surface-secondary) p-6 sm:p-8 text-(--text-primary) shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-(--border) pb-4">
        <div>
          <h2 className="text-xl font-black text-(--text-primary)">
            Delivery Address
          </h2>
          <p className="mt-0.5 text-xs text-(--text-muted)">
            Where should we deliver your energized items?
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
          <MapPin className="h-3 w-3" />
          Step 1
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* FULL NAME & PHONE */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
              <input
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-(--surface) py-2.5 pl-10 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.fullName
                  ? "border-red-500"
                  : "border-(--border)"
                  }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
              <input
                name="phone"
                type="tel"
                placeholder="Enter your mobile number"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full rounded-xl border bg-(--surface) py-2.5 pl-10 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.phone
                  ? "border-red-500"
                  : "border-(--border)"
                  }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* STREET ADDRESS */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
            Flat, House no., Building, Street Area *
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-(--text-muted)" />
            <textarea
              name="address"
              rows={3}
              placeholder="Enter your full address"
              value={form.address}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-(--surface) py-2.5 pl-10 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.address
                ? "border-red-500"
                : "border-(--border)"
                }`}
            />
          </div>
          {errors.address && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.address}
            </p>
          )}
        </div>

        {/* CITY, STATE, PINCODE */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
              City / District *
            </label>
            <input
              name="city"
              type="text"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-(--surface) py-2.5 px-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.city
                ? "border-red-500"
                : "border-(--border)"
                }`}
            />
            {errors.city && (
              <p className="mt-1 text-[11px] text-red-500">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
              State *
            </label>
            <input
              name="state"
              type="text"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-(--surface) py-2.5 px-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.state
                ? "border-red-500"
                : "border-(--border)"
                }`}
            />
            {errors.state && (
              <p className="mt-1 text-[11px] text-red-500">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-(--text-secondary) mb-1.5">
              PIN Code *
            </label>
            <div className="relative">
              <Navigation className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-muted)" />
              <input
                name="pincode"
                type="text"
                maxLength={6}
                placeholder="Pincode"
                value={form.pincode}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-(--surface) py-2.5 pl-10 pr-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-amber-500 focus:outline-hidden ${errors.pincode
                  ? "border-red-500"
                  : "border-(--border)"
                  }`}
              />
            </div>
            {errors.pincode && (
              <p className="mt-1 text-[11px] text-red-500">{errors.pincode}</p>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 py-3.5 text-sm font-black text-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:opacity-95 hover:shadow-amber-500/35 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              <span>Securing Your Order...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>
                Confirm Order & Proceed{" "}
                {totalAmount ? `(₹${totalAmount.toLocaleString("en-IN")})` : ""}
              </span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
