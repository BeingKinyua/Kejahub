"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProperty } from "../../context/PropertyContext";
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Building2,
  Check,
} from "lucide-react";

export const SignUpView: React.FC = () => {
  const router = useRouter();
  const { signUp, currentUser, isAuthLoaded } = useProperty();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in with completed onboarding, redirect to overview
  useEffect(() => {
    if (isAuthLoaded && currentUser.isAuthenticated) {
      if (currentUser.onboardingStatus === "completed") {
        router.replace("/overview");
      } else {
        router.replace("/onboarding");
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
      setError("Please enter your full name.");
      return false;
    }
    if (!email.trim()) {
      setError("Please enter your work or personal email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(
        "Please provide a valid email format (e.g. name@property.co.ke).",
      );
      return false;
    }
    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match. Please re-enter.");
      return false;
    }
    if (!agreeTerms) {
      setError(
        "Please agree to the Terms of Service & Privacy Policy to create your account.",
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
      setError(err?.message || "Registration failed. Please try again.");
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
          Create Account
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
                htmlFor="signup-name"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Full Name / Business Owner
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

              {/* Password strength indicator */}
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                <div
                  className={`flex items-center gap-1 ${hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400"}`}
                >
                  <Check
                    className={`w-3 h-3 ${hasMinLength ? "opacity-100" : "opacity-30"}`}
                  />
                  <span>8+ characters</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${hasLetter ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400"}`}
                >
                  <Check
                    className={`w-3 h-3 ${hasLetter ? "opacity-100" : "opacity-30"}`}
                  />
                  <span>Letter</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400"}`}
                >
                  <Check
                    className={`w-3 h-3 ${hasNumber ? "opacity-100" : "opacity-30"}`}
                  />
                  <span>Number</span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
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
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> Passwords match
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                      yet
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (error) setError(null);
                  }}
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                />
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy.
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
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800/80 pt-4">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Kejahub. All rights reserved.
        </p>
      </div>
    </div>
  );
};
