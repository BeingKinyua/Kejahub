'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProperty } from '../../context/PropertyContext';
import { AuthGlassCard } from './AuthGlassCard';
import { AuthTabs } from './AuthTabs';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';

export const SignUpView: React.FC = () => {
  const router = useRouter();
  const { signUp, currentUser, isAuthLoaded } = useProperty();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in with completed onboarding, redirect to overview
  useEffect(() => {
    if (isAuthLoaded && currentUser.isAuthenticated) {
      if (currentUser.onboardingStatus === 'completed') {
        router.replace('/overview');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [
    isAuthLoaded,
    currentUser.isAuthenticated,
    currentUser.onboardingStatus,
    router,
  ]);

  // Password rules
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const validate = () => {
    if (!fullName.trim()) {
      setError('Please enter your full name or legal business entity.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your work or personal email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(
        'Please provide a valid email format (e.g. name@property.co.ke).'
      );
      return false;
    }
    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match. Please re-enter.');
      return false;
    }
    if (!agreeTerms) {
      setError(
        'Please agree to the Terms of Service & Privacy Policy to register.'
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      await signUp(fullName.trim(), email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
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
        <AuthTabs activeTab="signup" />

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-medium text-white/80 mb-1"
            >
              Full Name / Landlord Owner
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError(null);
                }}
                required
                placeholder="e.g. David Mwangi"
                className="w-full pl-10 pr-3.5 py-2.5 bg-black/25 border border-white/15 rounded-xl text-sm text-[#F5F2E9] placeholder-white/35 focus:outline-none focus:border-[#EAE7DD]/80 focus:ring-1 focus:ring-[#EAE7DD]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-medium text-white/80 mb-1"
            >
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-email"
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
            <label
              htmlFor="signup-password"
              className="block text-xs font-medium text-white/80 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                autoComplete="new-password"
                placeholder="Min 8 characters"
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

            {/* Micro requirements checklist */}
            <div className="mt-1.5 flex items-center gap-3 text-[10px]">
              <div
                className={`flex items-center gap-1 ${
                  hasMinLength ? 'text-[#EAE7DD] font-semibold' : 'text-white/40'
                }`}
              >
                <Check
                  className={`w-3 h-3 ${hasMinLength ? 'opacity-100' : 'opacity-30'}`}
                />
                <span>8+ chars</span>
              </div>
              <div
                className={`flex items-center gap-1 ${
                  hasLetter ? 'text-[#EAE7DD] font-semibold' : 'text-white/40'
                }`}
              >
                <Check
                  className={`w-3 h-3 ${hasLetter ? 'opacity-100' : 'opacity-30'}`}
                />
                <span>Letter</span>
              </div>
              <div
                className={`flex items-center gap-1 ${
                  hasNumber ? 'text-[#EAE7DD] font-semibold' : 'text-white/40'
                }`}
              >
                <Check
                  className={`w-3 h-3 ${hasNumber ? 'opacity-100' : 'opacity-30'}`}
                />
                <span>Number</span>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-medium text-white/80 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                className="w-full pl-10 pr-10 py-2.5 bg-black/25 border border-white/15 rounded-xl text-sm text-[#F5F2E9] placeholder-white/35 focus:outline-none focus:border-[#EAE7DD]/80 focus:ring-1 focus:ring-[#EAE7DD]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 p-1 cursor-pointer transition-colors"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && (
              <div className="mt-1 text-[11px]">
                {passwordsMatch ? (
                  <span className="text-[#EAE7DD] flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Passwords match
                  </span>
                ) : (
                  <span className="text-red-300 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Passwords do not match
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="pt-1">
            <label className="flex items-start cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (error) setError(null);
                }}
                className="h-3.5 w-3.5 mt-0.5 rounded border-white/20 bg-black/30 text-emerald-600 focus:ring-0 focus:outline-none accent-[#173C32]"
              />
              <span className="ml-2 text-xs text-white/70 leading-relaxed">
                I agree to the Terms of Service & Privacy Policy.
              </span>
            </label>
          </div>

          {/* Primary Action Button: Warm Cream */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3 px-4 rounded-xl text-sm font-semibold text-[#142820] bg-[#EAE7DD] hover:bg-[#FDFBF7] shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-[#142820] border-t-transparent" />
            ) : (
              <>
                <span>Create Account & Start Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Minimalist Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-white/40">or sign up with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Minimal Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setFullName('David Mwangi');
              setEmail('david.mwangi@kejahub.co.ke');
            }}
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
            onClick={() => {
              setFullName('David Mwangi');
              setEmail('david.mwangi@kejahub.co.ke');
            }}
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

        <div className="mt-4 text-center text-xs text-white/50">
          Already registered?{' '}
          <Link
            href="/login"
            className="text-[#EAE7DD] hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>
      </AuthGlassCard>

      {/* Subtle Bottom Attribution */}
      <p className="mt-5 text-center text-xs text-white/40 tracking-wide">
        &copy; {new Date().getFullYear()} Kejahub • Kenya Property Operations
      </p>
    </div>
  );
};
