'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ArrowLeft, Info, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-lg mb-4">
          <span className="font-extrabold text-2xl text-white dark:text-[#111A17] tracking-wider">K</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
          Reset Password
        </h1>
        <p className="mt-1 text-sm text-[#64736C] dark:text-[#9EB2A9]">
          Kejahub Property AI Agent Account Recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#1B2622] py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039]">
          {submitted ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-left">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reset Instructions Dispatched (Simulated)
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  If an account exists for <strong>{email}</strong>, recovery instructions have been queued. (This is a prototype simulation).
                </p>
              </div>

              <Link
                href="/sign-in"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@property.co.ke"
                    className="w-full pl-9 pr-3 py-2 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Info className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Delivery is simulated in this prototype environment.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] transition-all shadow-sm"
              >
                Send Recovery Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/sign-in"
                  className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
