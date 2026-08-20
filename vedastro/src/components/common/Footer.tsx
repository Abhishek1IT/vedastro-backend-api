import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
  
    <footer className="w-full bg-[#080503] border-t border-white/5 py-6 px-6 text-xs text-gray-400 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div>
          <span>© {new Date().getFullYear()} VedAstro. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap gap-6 text-gray-400">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/about" className="hover:text-white transition-colors">About System</Link>
          <Link href="/support-terminal" className="hover:text-white transition-colors">Support Terminal</Link>
        </div>

      </div>
    </footer>
  );
}
