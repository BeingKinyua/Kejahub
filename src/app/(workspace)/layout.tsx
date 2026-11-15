'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProperty } from '../../context/PropertyContext';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { DemoRoleSwitcher } from '../../components/layout/DemoRoleSwitcher';
import { PersistentAssistantDrawer } from '../../components/assistant/PersistentAssistantDrawer';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from 'lucide-react';
import { BuildingBlocksLoader } from '../../components/ui/BuildingBlocksLoader';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentUser,
    isAuthLoaded,
    toasts,
    dismissToast,
  } = useProperty();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!currentUser.isAuthenticated) {
      const returnUrl = pathname && pathname !== '/' ? encodeURIComponent(pathname) : '';
      router.replace(returnUrl ? `/login?next=${returnUrl}` : '/login');
    } else if (currentUser.onboardingStatus !== 'completed') {
      router.replace('/onboarding');
    }
  }, [currentUser.isAuthenticated, currentUser.onboardingStatus, isAuthLoaded, pathname, router]);

  if (!isAuthLoaded || !currentUser.isAuthenticated || currentUser.onboardingStatus !== 'completed') {
    return (
      <BuildingBlocksLoader
        variant="fullscreen"
        size="lg"
        label="Verifying your workspace access…"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] text-[#24312D] dark:text-[#EDF5F1] flex flex-col font-sans transition-colors duration-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#173C32] focus:text-white dark:focus:bg-[#79C8A4] dark:focus:text-[#111A17] focus:text-xs focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="flex-1 flex overflow-x-clip">
        {/* 1. Responsive Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* 2. Main Content Container */}
        <div
          className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Demo Role Switcher */}
          <DemoRoleSwitcher />

          {/* Top Bar */}
          <TopBar onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

          {/* Active Viewport */}
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
          >
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      {/* Persistent Sliding Assistant Drawer */}
      <PersistentAssistantDrawer />

      {/* Toast Notifications Stack */}
      <div
        role="region"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-5 left-5 right-5 sm:right-auto z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200 text-xs ${
              toast.type === 'SUCCESS'
                ? 'bg-white dark:bg-[#1B2622] border-emerald-500/40 text-[#24312D] dark:text-[#EDF5F1]'
                : toast.type === 'ERROR'
                ? 'bg-white dark:bg-[#1B2622] border-red-500/40 text-[#24312D] dark:text-[#EDF5F1]'
                : 'bg-white dark:bg-[#1B2622] border-blue-500/40 text-[#24312D] dark:text-[#EDF5F1]'
            }`}
          >
            {toast.type === 'SUCCESS' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
            ) : toast.type === 'ERROR' ? (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" aria-hidden="true" />
            )}

            <div className="flex-1 min-w-0">
              <span className="font-bold block">{toast.title}</span>
              {toast.message && (
                <p className="text-[#64736C] dark:text-[#9EB2A9] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white p-1.5 -m-1 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
