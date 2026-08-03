/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Search gemstones, rudraksha, yantras...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (keyword.trim()) {
        params.set("search", keyword);
      } else {
        params.delete("search");
      }

      router.push(`/shop?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div className="relative w-full">

      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        size={18}
      />

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/20 py-3 pl-11 pr-12 text-white outline-none transition focus:border-amber-500"
      />

      {keyword && (
        <button
          onClick={() => setKeyword("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
        >
          <X size={18} />
        </button>
      )}

    </div>
  );
}