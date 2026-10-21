'use client';

import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Sun, Moon } from 'lucide-react';
import { AuthBackground } from '../../components/auth/AuthBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useProperty();

  return (
    <AuthBackground>
      {/* Fixed top right subtle glass theme toggle */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 sm:p-2.5 rounded-full bg-black/40 backdrop-blur-lg border border-white/15 text-white/80 hover:text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-emerald-200" />
          )}
        </button>
      </div>

      {children}
    </AuthBackground>
  );
}
