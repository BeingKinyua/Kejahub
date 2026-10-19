'use client';

import { OnboardingWizard } from '../../components/onboarding/OnboardingWizard';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] text-[#24312D] dark:text-[#EDF5F1]">
      <DemoRoleSwitcher />
      <OnboardingWizard />
    </div>
  );
}
