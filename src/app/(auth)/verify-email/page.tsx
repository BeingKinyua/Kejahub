'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useProperty } from '../../../context/PropertyContext';

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
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-lg mb-4">
          <Mail className="w-7 h-7 text-white dark:text-[#111A17]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
          Verify Your Email
        </h1>
        <p className="mt-1 text-sm text-[#64736C] dark:text-[#9EB2A9]">
          Confirm your landlord email address for Kejahub notifications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#1B2622] py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] text-center space-y-5">
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            We sent a verification confirmation to{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">
              {currentUser.email || 'your email'}
            </strong>
            . Check your inbox and click the verification link.
          </p>

          {resent && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verification email re-dispatched (Simulated).</span>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Resending...' : 'Resend Verification Link'}</span>
            </button>

            <Link
              href="/onboarding"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] transition-all shadow-sm"
            >
              <span>Proceed to Landlord Onboarding</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/login"
              className="text-xs text-[#2F8A68] dark:text-[#79C8A4] hover:underline font-semibold"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
