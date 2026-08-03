"use client";

import React, { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce"; 

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Search astrologers, poojas, horoscopes...", 
  onSearch,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full max-w-sm hidden lg:block ${className}`}
    >
      <div className="relative flex items-center">
        <span className="absolute left-3.5 pointer-events-none text-slate-500 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search field"
          className="w-full rounded-xl border border-slate-800 bg-slate-900/40 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition text-[10px]"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}