"use client";

interface FilterSidebarProps {
  currentFilter: string;
  onFilterChange: (skill: string) => void;
}

export default function FilterSidebar({ currentFilter, onFilterChange }: FilterSidebarProps) {
  const skillsList = ["All", "Vedic", "Kundli", "KP System", "Numerology", "Palmistry", "Vastu"];

  return (
    <div className="w-full md:w-56 border border-slate-900 bg-slate-900/10 rounded-2xl p-4 backdrop-blur-md shrink-0">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5 select-none">
        Filter Skills
      </h3>
      
      <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
        {skillsList.map((skill) => {
          const isActive = currentFilter === skill;
          return (
            <button
              key={skill}
              onClick={() => onFilterChange(skill)}
              className={`text-left text-xs font-bold px-3 py-2 rounded-xl transition whitespace-nowrap border ${
                isActive
                  ? "bg-amber-600/10 border-amber-500/40 text-amber-400"
                  : "bg-slate-950/40 border-slate-900/40 text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}