"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "../common/Button";

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({
  categories,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = searchParams.get("category") || "all";

  const changeCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">

      {/* 1. "ALL" FILTER PILL */}
      <Button
        size="sm"
        variant={selected === "all" ? "primary" : "ghost"}
        onClick={() => changeCategory("all")}
        className="rounded-full whitespace-nowrap"
      >
        All
      </Button>

      {/* 2. DYNAMIC CATEGORY PILLS */}
      {categories.map((category) => {
        const isSelected = selected === category;
        return (
          <Button
            key={category}
            size="sm"
            variant={isSelected ? "primary" : "ghost"}
            onClick={() => changeCategory(category)}
            className="rounded-full whitespace-nowrap"
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
}
