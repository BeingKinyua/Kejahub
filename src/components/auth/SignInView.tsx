import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Eye,
  EyeOff,
  Building2,
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

export const SignInView: React.FC = () => {
  const { signIn, addToast } = useProperty();

  const [email, setEmail] = useState('david.mwangi@kejahub.co.ke');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('ERROR', 'Email Required', 'Please enter your account email.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signIn(email, 'LANDLORD');
    }, 450);
  };

  const handleQuickDemoLogin = (role: UserRole, demoEmail: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signIn(demoEmail, role);
    }, 300);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) return;
    setRecoverySubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#111A17] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center mx-auto shadow-lg mb-4">
          <span className="font-extrabold text-2xl text-white dark:text-[#111A17] tracking-wider">K</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
          KEJAHUB
        </h1>
        <p className="mt-1 text-sm text-[#64736C] dark:text-[#9EB2A9]">
          AI-Native Property Operations & Autonomous Agent
        </p>

        {/* Prototype banner */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <ShieldCheck className="w-3.5 h-3.5" /> Interactive Landlord Demo Environment
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#1B2622] py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@property.co.ke"
                  className="w-full pl-9 pr-3 py-2 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(true);
                    setRecoverySubmitted(false);
                    setRecoveryEmail(email);
                  }}
                  className="text-xs font-semibold text-[#2F8A68] hover:text-[#267256] dark:text-[#79C8A4]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-600 dark:text-gray-400">
                Remember my session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F8A68]"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Sign-in buttons */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2.5 text-center">
              Instant Demo Sign-In
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('LANDLORD', 'david.mwangi@kejahub.co.ke')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#173C32]/5 hover:bg-[#173C32]/10 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-[#173C32] dark:text-emerald-300 border border-emerald-500/20 transition-all text-left"
              >
                <div>
                  <div className="font-bold">David Mwangi (Landlord / Owner)</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Full portfolio management & financial sign-off</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PROPERTY_MANAGER', 'sarah.omondi@kejahub.co.ke')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-all text-left"
              >
                <div>
                  <div className="font-semibold">Sarah Omondi (Property Manager)</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">Operations, tenants & triage</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            </div>
          </div>
        </div>

        {/* Kenya Readiness Footer Note */}
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Built for Kenyan landlords managing 1–50+ units • M-Pesa & WhatsApp first
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Enter your work email address to receive password reset instructions.
            </p>

            {recoverySubmitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-left mb-4">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reset Instructions Dispatched (Simulated)
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  If an account exists for <strong>{recoveryEmail}</strong>, password reset instructions have been sent. (This is a prototype simulation; no real email is delivered).
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="name@property.co.ke"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-[11px] text-gray-400">
                    Delivery is simulated in this prototype environment.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] transition-colors"
                >
                  Send Recovery Link
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
