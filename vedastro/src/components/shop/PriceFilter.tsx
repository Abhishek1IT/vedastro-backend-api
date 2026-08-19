"use client";

import Button from "../common/Button";
import { useRouter, useSearchParams } from "next/navigation";

const ranges = [
  { label: "All", min: 0, max: 0 },
  { label: "₹0 - ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹5000", min: 1000, max: 5000 },
  { label: "₹5000+", min: 5000, max: 999999 },
];

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMin = searchParams.get("minPrice") || "0";
  const currentMax = searchParams.get("maxPrice") || "0";

  function apply(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (min === 0 && max === 0) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", String(min));
      params.set("maxPrice", String(max));
    }

    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {ranges.map((range) => {
        const active =
          currentMin === String(range.min) && currentMax === String(range.max);

        return (
          <Button
            key={range.label}
            size="sm"
            variant={active ? "primary" : "ghost"}
            onClick={() => apply(range.min, range.max)}
            className="rounded-full whitespace-nowrap"
          >
            {range.label}
          </Button>
        );
      })}
    </div>
  );
}
