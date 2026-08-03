"use client";

interface RatingProps {
  value: number;
}

export default function Rating({ value }: RatingProps) {
  return (
    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md select-none">
      <span>⭐</span>
      <span>{value.toFixed(1)}</span>
    </div>
  );
}