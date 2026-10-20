'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '../context/PropertyContext';

export default function RootEntryPage() {
  const router = useRouter();
  const { currentUser, isAuthLoaded } = useProperty();

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!currentUser.isAuthenticated) {
      router.replace('/login');
    } else if (currentUser.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
    } else {
      router.replace('/overview');
    }
  }, [currentUser.isAuthenticated, currentUser.onboardingStatus, isAuthLoaded, router]);

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-md mb-3 animate-pulse">
          <span className="font-extrabold text-xl text-white dark:text-[#111A17]">K</span>
        </div>
        <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] font-medium">
          Verifying Kejahub workspace session...
        </p>
      </div>
    </div>
  );
}
