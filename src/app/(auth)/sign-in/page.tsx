'use client';

import React, { Suspense } from 'react';
import { LoginView } from '../../../components/auth/LoginView';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <LoginView />
    </Suspense>
  );
}
