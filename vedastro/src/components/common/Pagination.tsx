"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-6 select-none">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-30 transition"
      >
        Prev
      </button>

      <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white disabled:opacity-30 transition"
      >
        Next
      </button>
    </div>
  );
}