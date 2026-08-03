"use client";

export default function HeroStats() {
  const stats = [
    { value: "500+", label: "Verified Astrologers" },
    { value: "10M+", label: "Minutes Managed" },
    { value: "4.8★", label: "User Rating" },
  ];

  return (
    <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-900 pt-8 animate-in fade-in duration-700 delay-150">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col space-y-1">
          <span className="text-xl font-black text-white sm:text-2xl tracking-tight bg-linear-to-b from-white to-slate-400 bg-clip-text">
            {stat.value}
          </span>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}