"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md border border-slate-900 bg-slate-900 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Top Title Section */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-950/80 mb-4">
          <h3 className="text-sm font-black text-white tracking-wide">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-xs p-1 rounded-lg border border-transparent hover:bg-slate-950 transition"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Body Content Injection */}
        <div className="text-xs text-slate-300 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}