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
  Sparkles,
} from 'lucide-react';

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
    workspaceConfig,
    toasts,
    dismissToast,
    isAssistantOpen,
    setIsAssistantOpen,
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
      <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-md mb-3 animate-pulse">
            <span className="font-extrabold text-xl text-white dark:text-[#111A17]">K</span>
          </div>
          <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] font-medium">
            Verifying workspace access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] text-[#24312D] dark:text-[#EDF5F1] flex flex-col font-sans transition-colors duration-200">
      <div className="flex-1 flex overflow-hidden">
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
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>

      {/* Floating Action Button for Assistant */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 group font-semibold text-xs sm:text-sm border-2 border-emerald-400/30"
          aria-label="Open AI Property Agent Assistant"
        >
          <Sparkles className="w-4 h-4 text-emerald-300 dark:text-[#111A17] animate-pulse" />
          <span>Ask Agent</span>
        </button>
      )}

      {/* Persistent Sliding Assistant Drawer */}
      <PersistentAssistantDrawer />

      {/* Toast Notifications Stack */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200 text-xs ${
              toast.type === 'SUCCESS'
                ? 'bg-white dark:bg-[#1B2622] border-emerald-500/40 text-gray-900 dark:text-gray-100'
                : toast.type === 'ERROR'
                ? 'bg-white dark:bg-[#1B2622] border-red-500/40 text-gray-900 dark:text-gray-100'
                : 'bg-white dark:bg-[#1B2622] border-blue-500/40 text-gray-900 dark:text-gray-100'
            }`}
          >
            {toast.type === 'SUCCESS' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === 'ERROR' ? (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <span className="font-bold block">{toast.title}</span>
              {toast.message && <p className="text-gray-500 dark:text-gray-400 mt-0.5">{toast.message}</p>}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
