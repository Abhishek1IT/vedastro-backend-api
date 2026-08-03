"use client";

export default function HeroImage() {
  return (
    <div className="relative w-full max-w-105 aspect-square flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
      {/* Outer Rotation Orbit Rings */}
      <div className="absolute inset-0 rounded-full border border-slate-800 border-dashed animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border border-amber-500/20 border-double animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute inset-20 rounded-full border border-slate-900" />
      
      {/* Central Interactive Focal Cosmic Core Element */}
      <div className="relative z-10 flex h-52 w-52 items-center justify-center rounded-full bg-linear-to-tr from-slate-900 to-slate-950 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 group">
        <div className="absolute inset-2 rounded-full border border-slate-800 bg-slate-900/40 animate-pulse" />
        <span className="text-6xl text-amber-500 select-none transform group-hover:scale-110 group-hover:rotate-12 transition duration-500">
          🔮
        </span>
        
        {/* Orbit Node Points */}
        <div className="absolute -top-2 left-1/2 h-4 w-4 -ml-2 rounded-full bg-orange-500 border border-white shadow-glow" />
        <div className="absolute bottom-10 -left-2 h-3 w-3 rounded-full bg-indigo-400" />
      </div>
    </div>
  );
}