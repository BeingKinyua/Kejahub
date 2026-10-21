'use client';

import React from 'react';
import Image from 'next/image';

interface AuthBackgroundProps {
  children?: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[#0E1A14]">
      {/* Cinematic Architectural Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/auth-bg.jpg"
          alt="Modern contemporary architectural villa with warm ambient lighting surrounded by greenery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic dark olive/forest warm overlay to ensure high contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#091510]/55 via-[#0E1B15]/40 to-[#07110C]/75" />

        {/* Soft subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,13,9,0.65)_100%)]" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
};
