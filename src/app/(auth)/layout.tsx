'use client';

import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Sun, Moon } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useProperty();

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] text-[#24312D] dark:text-[#EDF5F1] relative transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-xs transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
        </button>
      </div>

      {children}
    </div>
  );
}
