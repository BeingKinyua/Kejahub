'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AuthGlassCard } from '../../../components/auth/AuthGlassCard';
import { Mail, CheckCircle2, ArrowLeft, ArrowRight, Info, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your registered email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address (e.g. name@property.co.ke).');
      return;
    }
    setError(null);
    setSubmitted(true);
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
            Reset Password
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-white/75 mt-0.5">
            Account Recovery
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-left"
            >
              <div className="flex items-center gap-2 text-[#EAE7DD] font-semibold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Recovery Instructions Dispatched</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                If an account exists for{' '}
                <strong className="text-white wrap-anywhere">{email.trim()}</strong>, a secure password reset link has been queued.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full min-h-[44px] py-3 px-4 rounded-xl text-sm font-semibold text-[#142820] bg-[#EAE7DD] hover:bg-[#FDFBF7] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {error && (
              <div
                id="recovery-error"
                ref={errorRef}
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className="p-3 rounded-xl bg-red-950/60 border border-red-400/40 flex items-start gap-2.5 text-xs text-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="recovery-email"
                className="block text-xs font-medium text-white/85 mb-1.5"
              >
                Registered Email Address
              </label>
              <div className="relative">
                <Mail
                  className="w-4 h-4 text-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="recovery-email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'recovery-error' : undefined}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@property.co.ke"
                  className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 bg-black/25 border border-white/15 rounded-xl text-sm text-[#F5F2E9] placeholder-white/45 focus:outline-none focus:border-[#EAE7DD]/80 focus:ring-1 focus:ring-[#EAE7DD]/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-white/75">
              <Info className="w-4 h-4 text-white/60 shrink-0 mt-0.5" aria-hidden="true" />
              <span>Enter the email associated with your landlord account.</span>
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-[#142820] bg-[#EAE7DD] hover:bg-[#FDFBF7] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-h-[36px] px-2 text-xs text-white/75 hover:text-white transition-colors"
              >
                &larr; Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </AuthGlassCard>

      <p className="mt-5 text-center text-xs text-white/75 tracking-wide">
        &copy; {new Date().getFullYear()} Kejahub • Kenya Property Operations
      </p>
    </div>
  );
}
