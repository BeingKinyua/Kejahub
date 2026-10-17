import React, { useState } from 'react';
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
  CheckCircle,
} from 'lucide-react';

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

  if (!isAssistantOpen) return null;

  const quickPrompts = [
    'Summarize what needs my attention',
    'Show unallocated M-Pesa payments',
    'Draft rent reminders for tenants in arrears',
    'Review high-cost maintenance requests',
    'Audit lease expiries for Q4',
  ];

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

  return (
    <div
      className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[420px] bg-white dark:bg-[#1B2622] border-l border-[#E2E8E5] dark:border-[#2D4039] shadow-2xl z-50 flex flex-col transition-all duration-300 animate-in slide-in-from-right"
      role="dialog"
      aria-label="Kejahub AI Property Agent Assistant"
    >
      {/* Header */}
      <div className="p-4 bg-[#173C32] text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2F8A68] flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">Kejahub Agent</h3>
              <span className="text-[10px] font-semibold uppercase bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded">
                Autonomous + Human-Gated
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/70">
              Active Context: <span className="capitalize font-medium text-white">{currentScreen}</span> view
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAssistantOpen(false)}
          className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#245245] transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Policy Reminder Bar */}
      <div className="px-4 py-2 bg-emerald-50 dark:bg-[#21332B] border-b border-emerald-100 dark:border-[#2B4238] flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
        <span className="flex items-center gap-1 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Safety Level: Human Approval required for mass messaging & waivers
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
                    ? 'bg-[#F6F8F6] dark:bg-[#24332D] text-gray-900 dark:text-gray-100 border border-[#E2E8E5] dark:border-[#2D4039]'
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
                    className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B2622] text-[#173C32] dark:text-[#79C8A4] hover:bg-emerald-50 dark:hover:bg-[#243830] font-semibold text-xs rounded-lg border border-emerald-200 dark:border-emerald-800/50 shadow-xs transition-colors"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isAgent ? 'text-gray-400 dark:text-gray-500' : 'text-emerald-200 dark:text-[#111A17]/70'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAgent && (
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 pt-2 pb-1 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
          Suggested Actions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-[#24332D] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-[#2F8A68] hover:text-[#2F8A68] transition-colors truncate max-w-full text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="p-3 bg-white dark:bg-[#1B2622] border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask agent e.g. 'Show unallocated payments'..."
          className="flex-1 bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
        />
        <button
          onClick={() => handleSend(inputVal)}
          disabled={!inputVal.trim()}
          className="w-10 h-10 rounded-xl bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] disabled:opacity-40 text-white dark:text-[#111A17] flex items-center justify-center shrink-0 transition-all shadow-sm"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
