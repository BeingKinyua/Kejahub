'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingWizard } from '../../components/onboarding/OnboardingWizard';
import { useProperty } from '../../context/PropertyContext';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { BuildingBlocksLoader } from '../../components/ui/BuildingBlocksLoader';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, isAuthLoaded } = useProperty();

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!currentUser.isAuthenticated) {
      router.replace('/login?next=/onboarding');
    }
  }, [currentUser.isAuthenticated, isAuthLoaded, router]);

  if (!isAuthLoaded || !currentUser.isAuthenticated) {
    return (
      <BuildingBlocksLoader
        variant="fullscreen"
        size="lg"
        label="Loading landlord onboarding…"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] text-[#24312D] dark:text-[#EDF5F1]">
      <DemoRoleSwitcher />
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <OnboardingWizard />
      </main>
    </div>
  );
}
