/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce"; 

import { useAppTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import Tooltip from "../../components/ui/Tooltip";
import Badge from "../../components/ui/Badge";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  placeholder = "Search astrologers, poojas, horoscopes...", 
  onSearch 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  
  const debouncedQuery = useDebounce(query, 500);

  const { theme } = useAppTheme();
  const { isAuthenticated } = useAuthStore();

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
      className="relative w-full max-w-sm hidden lg:block"
    >
      <div className="relative flex items-center">
        <Tooltip content={isAuthenticated ? "Realtime index filtering active" : "Login for global analytics query match"}>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs transition duration-150 select-none">
            🔍
          </span>
        </Tooltip>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Global Portal Query Selector"
          className="w-full rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white pl-10 pr-14 py-2 text-xs text-slate-200 dark:text-slate-100 light:text-slate-900 placeholder-slate-500 focus:border-amber-500/50 focus:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition duration-150"
        />

        {query === "" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none pointer-events-none">
            <Badge variant="slate" className="text-[8px] px-1.5 opacity-60">CTRL K</Badge>
          </div>
        )}

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition duration-150 text-[10px]"
            aria-label="Flush search query buffer"
          >
            ✕
          </button>
        )}
      </div>
    </form>
  );
}