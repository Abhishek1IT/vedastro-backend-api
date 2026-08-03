"use client";

interface LogoProps {
  showIconOnly?: boolean;
}

export default function Logo({ showIconOnly = false }: LogoProps) {
  return (
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-500/20 to-orange-600/10 border border-amber-500/30 shadow-inner group-hover:border-amber-500/50 transition">
        <span className="text-xl transform group-hover:rotate-12 transition duration-300">✨</span>
      
      {!showIconOnly && (
        <span className="text-lg font-bold tracking-wider text-white">
          Ved<span className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Astro</span>
        </span>
      )}
      </div>
    
  );
}