'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import gsap from 'gsap';

export const PersistentAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    assistantMessages,
    sendAssistantMessage,
    currentScreen,
    setCurrentScreen,
    portfolioMetrics,
    currentUser,
  } = useProperty();

  const [inputVal, setInputVal] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: ESC closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAssistantOpen) {
        setIsAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAssistantOpen, setIsAssistantOpen]);

  // GSAP animation for sliding drawer
  useEffect(() => {
    if (!drawerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isAssistantOpen) {
      if (prefersReducedMotion) {
        gsap.set(drawerRef.current, { x: 0 });
        if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 1 });
      } else {
        gsap.fromTo(
          drawerRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.4, ease: 'power3.out' }
        );
        if (backdropRef.current) {
          gsap.fromTo(
            backdropRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: 'power2.out' }
          );
        }
      }
    }
  }, [isAssistantOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [assistantMessages, isAssistantOpen]);

  if (!isAssistantOpen) return null;

  const quickPromptsByScreen: Record<string, string[]> = {
    overview: [
      'Summarize urgent items requiring my attention',
      'Show unallocated M-Pesa payments',
      'Draft rent arrears reminder for tenants past grace period',
      'What is our net operating income this month?',
    ],
    payments: [
      'Show unallocated M-Pesa payments',
      'Match transactions with phone numbers',
      'Calculate collection rate for October',
    ],
    tenants: [
      'Show tenants in arrears past Oct 10',
      'List leases expiring in the next 60 days',
      'Draft polite payment reminder via WhatsApp',
    ],
    maintenance: [
      'Show tickets exceeding KES 10,000 threshold',
      'What contractor is assigned to water leaks?',
      'Authorize pending plumbing work order',
    ],
    expenses: [
      'Break down expenses by utility category',
      'Compare water token expenses to previous cycle',
    ],
  };

  const activePrompts = quickPromptsByScreen[currentScreen] || quickPromptsByScreen.overview;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sendAssistantMessage(text.trim());
    setInputVal('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend(inputVal);
    }
  };

  const closeWithAnimation = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !drawerRef.current) {
      setIsAssistantOpen(false);
      return;
    }

    gsap.to(drawerRef.current, {
      x: '100%',
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        setIsAssistantOpen(false);
      },
    });
    if (backdropRef.current) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.25 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeWithAnimation}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="relative w-full sm:w-[420px] md:w-[460px] bg-white dark:bg-[#1B2622] border-l border-[#E2E8E5] dark:border-[#2D4039] shadow-2xl flex flex-col h-full z-10"
        role="dialog"
        aria-label="Kejahub AI Property Agent Assistant"
      >
        {/* Header */}
        <div className="p-4 bg-[#173C32] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2F8A68] flex items-center justify-center text-white shadow-inner">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white">Kejahub Agent</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                  Autonomous + Gated
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70">
                Active Context: <span className="capitalize font-semibold text-white">{currentScreen}</span> view
              </p>
            </div>
          </div>

          <button
            onClick={closeWithAnimation}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-[#245245] transition-colors"
            aria-label="Close Assistant (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Policy Reminder Bar */}
        <div className="px-4 py-2.5 bg-emerald-50 dark:bg-[#202D28] border-b border-emerald-100 dark:border-[#2D4039] flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Policy: Landlord Authorization required for disbursements & waivers
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {assistantMessages.map((msg) => {
            const isAgent = msg.sender === 'AGENT';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {isAgent && (
                  <div className="w-7 h-7 rounded-lg bg-[#173C32] dark:bg-[#2F8A68] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isAgent
                      ? 'bg-[#F6F8F6] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] border border-[#E2E8E5] dark:border-[#2D4039]'
                      : 'bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Suggested Action Button inside chat */}
                  {msg.suggestedAction && (
                    <button
                      onClick={() => {
                        setCurrentScreen(msg.suggestedAction!.screen);
                        setIsAssistantOpen(false);
                      }}
                      className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#2F8A68] dark:text-[#79C8A4] bg-white dark:bg-[#1B2622] px-3 py-1.5 rounded-lg border border-[#E2E8E5] dark:border-[#2D4039] hover:bg-gray-50 dark:hover:bg-[#202D28] transition-colors"
                    >
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Contextual Quick Suggestions */}
        <div className="p-3 bg-[#F6F8F6] dark:bg-[#202D28] border-t border-[#E2E8E5] dark:border-[#2D4039]">
          <span className="text-[11px] font-bold text-[#64736C] dark:text-[#9EB2A9] uppercase tracking-wider block mb-2">
            Suggested Prompts ({currentScreen})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[11px] font-medium bg-white dark:bg-[#1B2622] hover:bg-emerald-50 dark:hover:bg-[#273B33] text-[#24312D] dark:text-[#EDF5F1] border border-[#E2E8E5] dark:border-[#2D4039] hover:border-[#2F8A68] px-2.5 py-1 rounded-lg text-left transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white dark:bg-[#1B2622] border-t border-[#E2E8E5] dark:border-[#2D4039]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about rent, tenants, or M-Pesa..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
            />
            <button
              onClick={() => handleSend(inputVal)}
              disabled={!inputVal.trim()}
              className="p-2.5 bg-[#173C32] dark:bg-[#79C8A4] hover:bg-[#245245] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-[#64736C] dark:text-[#9EB2A9] mt-2 text-center">
            Agent operates under human supervisory guardrails. Press <kbd className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">Esc</kbd> to dismiss.
          </p>
        </div>
      </div>
    </div>
  );
};
