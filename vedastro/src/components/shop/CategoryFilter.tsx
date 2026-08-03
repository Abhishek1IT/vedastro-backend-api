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
    <div className="flex gap-3 overflow-x-auto py-2">

      <Button
        size="sm"
        variant={selected === "all" ? "primary" : "ghost"}
        onClick={() => changeCategory("all")}
      >
        All
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          size="sm"
          variant={
            selected === category
              ? "primary"
              : "ghost"
          }
          onClick={() => changeCategory(category)}
        >
          {category}
        </Button>
      ))}

    </div>
  );
}