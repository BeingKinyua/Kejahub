'use client';

import React from 'react';

interface AuthGlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthGlassCard: React.FC<AuthGlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`w-full max-w-[420px] rounded-[24px] sm:rounded-[28px] bg-[#18251B]/75 backdrop-blur-[24px] border border-white/15 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.15)] p-6 sm:p-9 text-[#F5F2E9] relative transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'rgba(24, 37, 27, 0.72)',
      }}
    >
      {/* Subtle top glare reflection line */}
      <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
