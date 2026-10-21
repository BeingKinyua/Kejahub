'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { useProperty } from '../../../context/PropertyContext';
import { AuthGlassCard } from '../../../components/auth/AuthGlassCard';

export default function VerifyEmailPage() {
  const { currentUser } = useProperty();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
    }, 700);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <AuthGlassCard>
        {/* Minimalist Top Logo & Brand Identity */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner mb-3 transition-transform hover:scale-105">
            <Mail className="w-6 h-6 text-[#F5F2E9]" />
          </div>
          <h1 className="text-xl font-medium tracking-tight text-[#F5F2E9]">
            Verify Your Email
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-white/50 mt-0.5">
            Email Confirmation
          </p>
        </div>

        <div className="text-center space-y-4">
          <p className="text-xs text-white/70 leading-relaxed">
            We sent a verification confirmation to{' '}
            <strong className="text-white font-semibold">
              {currentUser.email || 'your registered email'}
            </strong>
            . Check your inbox and click the verification link.
          </p>

          {resent && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-[#EAE7DD] flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verification email re-dispatched (Simulated).</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`}
              />
              <span>{resending ? 'Resending...' : 'Resend Verification Link'}</span>
            </button>

            <Link
              href="/onboarding"
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-[#142820] bg-[#EAE7DD] hover:bg-[#FDFBF7] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Landlord Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/login"
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </AuthGlassCard>

      <p className="mt-5 text-center text-xs text-white/40 tracking-wide">
        &copy; {new Date().getFullYear()} Kejahub • Kenya Property Operations
      </p>
    </div>
  );
}
