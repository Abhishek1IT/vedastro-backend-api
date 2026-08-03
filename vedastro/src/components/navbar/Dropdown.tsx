// components/navbar/Dropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";

import Card from "../../components/ui/Card";

interface DropdownItem {
  label: string;
  path: string;
  icon?: string;
}

interface DropdownProps {
  triggerLabel: string;
  items: DropdownItem[];
}

export default function Dropdown({ triggerLabel, items }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isChildActive = items.some((item) => pathname.startsWith(item.path));

  useEffect(() => {
    function clickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <div 
      className="relative inline-block text-left"
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-colors hover:text-amber-400 focus:outline-none py-2 select-none",
          isChildActive 
            ? "text-amber-500 font-extrabold" 
            : "text-slate-400 dark:text-slate-400 light:text-slate-600"
        )}
      >
        <span>{triggerLabel}</span>
        <span className={cn("text-[9px] text-slate-500 transition-transform duration-200", isOpen && "rotate-180 text-amber-500")}>
          ▼
        </span>
      </button>

      {isOpen && (
        <Card
          hoverEffect={false}
          className="absolute left-0 mt-0 w-52 origin-top-left rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-950 dark:bg-slate-950 light:bg-white p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {items.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold transition duration-150 select-none",
                  isActive 
                    ? "bg-slate-900 dark:bg-slate-900 light:bg-slate-100 text-amber-500 font-extrabold" 
                    : "text-slate-400 dark:text-slate-400 light:text-slate-500 hover:bg-slate-900/60 dark:hover:bg-slate-900/60 light:hover:bg-slate-50 hover:text-white dark:hover:text-white light:hover:text-slate-900"
                )}
              >
                {item.icon && <span className="text-xs shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </Card>
      )}
    </div>
  );
}