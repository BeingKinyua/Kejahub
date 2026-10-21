'use client';

import React from 'react';
import Link from 'next/link';

interface AuthTabsProps {
  activeTab: 'login' | 'signup';
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab }) => {
  return (
    <div className="flex items-center justify-center border-b border-white/10 mb-6">
      <Link
        href="/login"
        className={`relative pb-3 px-5 text-sm font-medium transition-all duration-200 cursor-pointer ${
          activeTab === 'login'
            ? 'text-[#F5F2E9] font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        Sign In
        {activeTab === 'login' && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAE7DD] rounded-full shadow-[0_0_8px_rgba(234,231,221,0.5)]" />
        )}
      </Link>

      <Link
        href="/signup"
        className={`relative pb-3 px-5 text-sm font-medium transition-all duration-200 cursor-pointer ${
          activeTab === 'signup'
            ? 'text-[#F5F2E9] font-semibold'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        Sign Up
        {activeTab === 'signup' && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAE7DD] rounded-full shadow-[0_0_8px_rgba(234,231,221,0.5)]" />
        )}
      </Link>
    </div>
  );
};
