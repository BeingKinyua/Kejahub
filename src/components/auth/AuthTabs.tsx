'use client';

import React from 'react';
import Link from 'next/link';

interface AuthTabsProps {
  activeTab: 'login' | 'signup';
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab }) => {
  return (
    <nav
      aria-label="Authentication mode"
      className="flex items-center justify-center border-b border-white/10 mb-6"
    >
      <Link
        href="/login"
        aria-current={activeTab === 'login' ? 'page' : undefined}
        className={`relative min-h-[44px] flex items-center px-5 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAE7DD] rounded-t-lg ${
          activeTab === 'login'
            ? 'text-[#F5F2E9] font-semibold'
            : 'text-white/70 hover:text-white'
        }`}
      >
        Sign In
        {activeTab === 'login' && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAE7DD] rounded-full shadow-[0_0_8px_rgba(234,231,221,0.5)]"
          />
        )}
      </Link>

      <Link
        href="/signup"
        aria-current={activeTab === 'signup' ? 'page' : undefined}
        className={`relative min-h-[44px] flex items-center px-5 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAE7DD] rounded-t-lg ${
          activeTab === 'signup'
            ? 'text-[#F5F2E9] font-semibold'
            : 'text-white/70 hover:text-white'
        }`}
      >
        Sign Up
        {activeTab === 'signup' && (
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAE7DD] rounded-full shadow-[0_0_8px_rgba(234,231,221,0.5)]"
          />
        )}
      </Link>
    </nav>
  );
};
