'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '../context/PropertyContext';

import { BuildingBlocksLoader } from '../components/ui/BuildingBlocksLoader';

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
    <BuildingBlocksLoader
      variant="fullscreen"
      size="lg"
      label="Verifying Kejahub workspace session…"
    />
  );
}
