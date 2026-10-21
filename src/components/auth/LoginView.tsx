"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useProperty } from "../../context/PropertyContext";
import { UserRole } from "../../types";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  Sparkles,
} from "lucide-react";

export const LoginView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "";

  const { signIn, currentUser, isAuthLoaded, addToast } = useProperty();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated and onboarding completed, redirect to next or overview
  useEffect(() => {
    if (isAuthLoaded && currentUser.isAuthenticated) {
      if (currentUser.onboardingStatus === "completed") {
        const safeNext =
          nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//")
            ? nextUrl
            : "/overview";
        router.replace(safeNext);
      } else {
        router.replace("/onboarding");
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
      setError("Please enter your work email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email format (e.g. name@property.co.ke).");
      return false;
    }
    if (!password) {
      setError("Please enter your account password.");
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
        nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//")
          ? nextUrl
          : undefined;
      await signIn(email.trim(), "LANDLORD", { redirectTo: safeNext });
    } catch (err: any) {
      setError(
        err?.message ||
          "Authentication failed. Please verify your credentials.",
      );
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole, demoEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const safeNext =
        nextUrl && nextUrl.startsWith("/") && !nextUrl.startsWith("//")
          ? nextUrl
          : undefined;
      await signIn(demoEmail, role, { isDemo: true, redirectTo: safeNext });
    } catch (err: any) {
      setError("Demo login error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-xl mb-4 group transition-transform hover:scale-105">
          <span className="font-extrabold text-2xl text-white dark:text-[#111A17] tracking-wider">
            K
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
          Welcome to KEJAHUB
        </h1>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#1B2622] py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039]">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  placeholder="e.g. david.mwangi@kejahub.co.ke"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#2F8A68] hover:text-[#267256] dark:text-[#79C8A4] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your account password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                />
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F8A68] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dedicated Sign-up Link Section */}
          <div className="mt-5 text-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 pt-4">
            <span>Don't have an account? </span>
            <Link
              href="/signup"
              className="font-bold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Quick Demo Sign-in buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                1-Click Demo Evaluation
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Ready Workspace
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("LANDLORD", "david.mwangi@kejahub.co.ke")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold bg-[#173C32]/5 hover:bg-[#173C32]/10 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-[#173C32] dark:text-emerald-300 border border-emerald-500/20 transition-all text-left group"
              >
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>David Mwangi (Landlord / Owner)</span>
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Mwangi Property Holdings • 3 properties • M-Pesa & WhatsApp
                    active
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemo(
                    "PROPERTY_MANAGER",
                    "sarah.omondi@kejahub.co.ke",
                  )
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-all text-left group"
              >
                <div>
                  <div className="font-semibold">
                    Sarah Omondi (Property Manager)
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Operations, maintenance triage & tenant directory
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Kejahub. All rights reserved.
        </p>
      </div>
    </div>
  );
};
