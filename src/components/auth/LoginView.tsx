'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProperty } from '../../context/PropertyContext';
import { UserRole } from '../../types';
import { AuthGlassCard } from './AuthGlassCard';
import { AuthTabs } from './AuthTabs';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '';

  const { signIn, currentUser, isAuthLoaded } = useProperty();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  // If already authenticated and onboarding completed, redirect to next or overview
  useEffect(() => {
    if (isAuthLoaded && currentUser.isAuthenticated) {
      if (currentUser.onboardingStatus === 'completed') {
        const safeNext =
          nextUrl && nextUrl.startsWith('/') && !nextUrl.startsWith('//')
            ? nextUrl
            : '/overview';
        router.replace(safeNext);
      } else {
        router.replace('/onboarding');
      }
    }
  }, [
    isAuthLoaded,
    currentUser.isAuthenticated,
    currentUser.onboardingStatus,
    nextUrl,
    router,
  ]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your work email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email format (e.g. name@property.co.ke).');
      return false;
    }
    if (!password) {
      setError('Please enter your account password.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const safeNext =
        nextUrl && nextUrl.startsWith('/') && !nextUrl.startsWith('//')
          ? nextUrl
          : undefined;
      await signIn(email.trim(), 'LANDLORD', { redirectTo: safeNext });
    } catch (err: any) {
      setError(
        err?.message ||
          'Authentication failed. Please verify your credentials.'
      );
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole, demoEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const safeNext =
        nextUrl && nextUrl.startsWith('/') && !nextUrl.startsWith('//')
          ? nextUrl
          : undefined;
      await signIn(demoEmail, role, { isDemo: true, redirectTo: safeNext });
    } catch (err: any) {
      setError('Demo login error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AuthGlassCard>
        {/* Minimalist Top Logo & Brand Identity */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner mb-3 transition-transform hover:scale-105">
            <span className="font-serif font-bold text-2xl text-[#F5F2E9] tracking-wider">
              K
            </span>
          </div>
          <h1 className="text-xl font-medium tracking-tight text-[#F5F2E9]">
            Kejahub
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-white/50 mt-0.5">
            Property AI Operations
          </p>
        </div>

        {/* Tab Navigation: Sign In | Sign Up */}
        <AuthTabs activeTab="login" />

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/50 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-medium text-white/80 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                required
                autoComplete="email"
                placeholder="name@property.co.ke"
                className="w-full pl-10 pr-3.5 py-2.5 bg-black/25 border border-white/15 rounded-xl text-sm text-[#F5F2E9] placeholder-white/35 focus:outline-none focus:border-[#EAE7DD]/80 focus:ring-1 focus:ring-[#EAE7DD]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-medium text-white/80"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#D8E4DC] hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 bg-black/25 border border-white/15 rounded-xl text-sm text-[#F5F2E9] placeholder-white/35 focus:outline-none focus:border-[#EAE7DD]/80 focus:ring-1 focus:ring-[#EAE7DD]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-black/30 text-emerald-600 focus:ring-0 focus:outline-none accent-[#173C32]"
              />
              <span className="ml-2 text-xs text-white/70">
                Remember me
              </span>
            </label>
          </div>

          {/* Primary Action Button: Warm Cream */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-[#142820] bg-[#EAE7DD] hover:bg-[#FDFBF7] shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#142820] border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Minimalist Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-white/40">or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Minimal Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('LANDLORD', 'david.mwangi@kejahub.co.ke')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18 12.24 18c-3.37 0-6.1-2.73-6.1-6.1s2.73-6.1 6.1-6.1c1.555 0 2.97.585 4.05 1.55l2.42-2.42C16.945 3.32 14.73 2.5 12.24 2.5 7.025 2.5 2.79 6.735 2.79 11.95s4.235 9.45 9.45 9.45c5.455 0 9.07-3.835 9.07-9.24 0-.62-.065-1.22-.175-1.875H12.24z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('LANDLORD', 'david.mwangi@kejahub.co.ke')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.74-.95 2.76 1.01.08 2.05-.51 2.67-1.26z"
              />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Evaluator Options */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowDemoOptions(!showDemoOptions)}
            className="w-full flex items-center justify-between text-[11px] text-white/60 hover:text-white/90 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#EAE7DD]" />
              <span>1-Click Landlord Demo Workspace</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showDemoOptions ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showDemoOptions && (
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo('LANDLORD', 'david.mwangi@kejahub.co.ke')
                }
                disabled={isLoading}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#EAE7DD]" />
                    <span className="text-xs font-medium text-[#F5F2E9]">
                      David Mwangi (Landlord)
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-white/50 pl-5.5 mt-0.5">
                  Mwangi Holdings • 3 properties • Ready data
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    'PROPERTY_MANAGER',
                    'sarah.omondi@kejahub.co.ke'
                  )
                }
                disabled={isLoading}
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[9px]">
                      P
                    </span>
                    <span className="text-xs font-medium text-[#F5F2E9]">
                      Sarah Omondi (Manager)
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] text-white/50 pl-5.5 mt-0.5">
                  Operations, maintenance triage & payments
                </p>
              </button>
            </div>
          )}
        </div>
      </AuthGlassCard>

      {/* Subtle Bottom Attribution */}
      <p className="mt-5 text-center text-xs text-white/40 tracking-wide">
        &copy; {new Date().getFullYear()} Kejahub • Kenya Property Operations
      </p>
    </div>
  );
};
