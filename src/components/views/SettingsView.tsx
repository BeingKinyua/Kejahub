import React, { useState, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Settings,
  User,
  Building,
  CreditCard,
  MessageSquare,
  ShieldAlert,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
  Eye,
  Sparkles,
  X,
} from 'lucide-react';
import { BuildingBlocksLoader } from '../ui/BuildingBlocksLoader';

export const SettingsView: React.FC = () => {
  const {
    workspaceConfig,
    updateWorkspaceConfig,
    theme,
    setTheme,
    resetDemoData,
    currentUser,
    signOut,
    addToast,
  } = useProperty();

  const [workspaceName, setWorkspaceName] = useState(workspaceConfig.workspaceName);
  const [landlordName, setLandlordName] = useState(workspaceConfig.landlordName);
  const [rentDueDay, setRentDueDay] = useState(workspaceConfig.rentDueDay);
  const [gracePeriodDays, setGracePeriodDays] = useState(workspaceConfig.gracePeriodDays);
  const [lateFeePercentage, setLateFeePercentage] = useState(workspaceConfig.lateFeePercentage);
  const [maintThreshold, setMaintThreshold] = useState(workspaceConfig.maintenanceApprovalThreshold);
  const [paybill, setPaybill] = useState(workspaceConfig.mpesaPaybillNumber || '522522');

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [pingMpesaSuccess, setPingMpesaSuccess] = useState(false);
  const [pingWhatsAppSuccess, setPingWhatsAppSuccess] = useState(false);
  const [loaderTestSize, setLoaderTestSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [loaderTestCompletion, setLoaderTestCompletion] = useState(false);
  const [loaderFullscreenPreview, setLoaderFullscreenPreview] = useState(false);
  const [loaderCustomLabel, setLoaderCustomLabel] = useState('Preparing your workspace…');

  useEffect(() => {
    if (!loaderFullscreenPreview && !resetConfirmOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (loaderFullscreenPreview) {
        setLoaderFullscreenPreview(false);
      } else if (resetConfirmOpen) {
        setResetConfirmOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loaderFullscreenPreview, resetConfirmOpen]);

  const handleSaveDefaults = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspaceConfig({
      workspaceName,
      landlordName,
      rentDueDay: Number(rentDueDay),
      gracePeriodDays: Number(gracePeriodDays),
      lateFeePercentage: Number(lateFeePercentage),
      maintenanceApprovalThreshold: Number(maintThreshold),
      mpesaPaybillNumber: paybill,
    });
  };

  const handleTestMpesaPing = () => {
    setPingMpesaSuccess(false);
    setTimeout(() => {
      setPingMpesaSuccess(true);
      addToast('SUCCESS', 'M-Pesa Webhook Pinged (Simulated)', 'Simulated C2B handshake OK. Response 200.');
    }, 400);
  };

  const handleTestWhatsAppPing = () => {
    setPingWhatsAppSuccess(false);
    setTimeout(() => {
      setPingWhatsAppSuccess(true);
      addToast('SUCCESS', 'WhatsApp Cloud API Pinged (Simulated)', 'Simulated Graph API webhook operational.');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
          Settings & Workspace Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
          Manage operating defaults, payment channels, AI safety thresholds, and appearance
        </p>
      </div>

      {/* Section 1: Appearance */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 id="appearance-heading" className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1">
          Interface Appearance
        </h3>
        <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
          Select your visual theme preference. Persisted to your local browser environment.
        </p>

        <div role="group" aria-labelledby="appearance-heading" className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md">
          {[
            { id: 'light', label: 'Light Theme', icon: Sun },
            { id: 'dark', label: 'Dark Theme', icon: Moon },
            { id: 'system', label: 'System Theme', icon: Laptop },
          ].map((th) => {
            const Icon = th.icon;
            const isSelected = theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTheme(th.id as 'light' | 'dark' | 'system')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all min-h-[72px] ${
                  isSelected
                    ? 'border-[#2F8A68] bg-[#173C32]/5 dark:bg-[#79C8A4]/10 ring-2 ring-[#2F8A68]'
                    : 'border-[#E2E8E5] dark:border-[#2D4039] hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isSelected ? 'text-[#267256] dark:text-[#79C8A4]' : 'text-[#64736C] dark:text-[#9EB2A9]'}`}
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1]">{th.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: KejaHub Building Blocks Loader Design System */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1]">
                KejaHub Building Blocks Loader
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                Motion System
              </span>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
              Architectural 9-block modular construction sequence: Foundation → Structure → Upper Floor → Details → Completion Shimmer
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoaderFullscreenPreview(true);
              setTimeout(() => setLoaderFullscreenPreview(false), 3500);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Preview Fullscreen (3s)</span>
          </button>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="bg-[#F6F8F6] dark:bg-[#111A17] rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] p-6 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
          <BuildingBlocksLoader
            size={loaderTestSize}
            variant="contained"
            label={loaderCustomLabel}
            completionState={loaderTestCompletion}
            completionMessage="Your workspace is ready"
          />

          <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-[#64736C] dark:text-[#9EB2A9] tabular-nums">
            {loaderTestCompletion ? 'STATE: COMPLETED ARCHITECTURE' : 'STATE: 3.6S LOOP CYCLE'}
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] text-xs">
          {/* Size Preset */}
          <div>
            <span id="loader-size-label" className="block text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] mb-1.5">
              Block Size Preset
            </span>
            <div role="group" aria-labelledby="loader-size-label" className="flex items-center gap-1.5 bg-[#F0F4F2] dark:bg-[#24332D] p-1 rounded-lg">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={loaderTestSize === s}
                  onClick={() => setLoaderTestSize(s)}
                  className={`flex-1 py-1 rounded text-xs font-semibold uppercase transition-all ${
                    loaderTestSize === s
                      ? 'bg-white dark:bg-[#1B2622] text-[#173C32] dark:text-[#79C8A4] shadow-xs'
                      : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Animation / Completion Mode */}
          <div>
            <span id="loader-state-label" className="block text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] mb-1.5">
              Animation State
            </span>
            <div role="group" aria-labelledby="loader-state-label" className="flex items-center gap-1.5 bg-[#F0F4F2] dark:bg-[#24332D] p-1 rounded-lg">
              <button
                type="button"
                aria-pressed={!loaderTestCompletion}
                onClick={() => setLoaderTestCompletion(false)}
                className={`flex-1 py-1 rounded text-xs font-semibold transition-all ${
                  !loaderTestCompletion
                    ? 'bg-white dark:bg-[#1B2622] text-[#173C32] dark:text-[#79C8A4] shadow-xs'
                    : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]'
                }`}
              >
                Constructing
              </button>
              <button
                type="button"
                aria-pressed={loaderTestCompletion}
                onClick={() => setLoaderTestCompletion(true)}
                className={`flex-1 py-1 rounded text-xs font-semibold transition-all ${
                  loaderTestCompletion
                    ? 'bg-white dark:bg-[#1B2622] text-[#173C32] dark:text-[#79C8A4] shadow-xs'
                    : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Contextual Label Input */}
          <div>
            <label htmlFor="loader-custom-label" className="block text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] mb-1.5">
              Contextual Label
            </label>
            <input
              id="loader-custom-label"
              type="text"
              value={loaderCustomLabel}
              onChange={(e) => setLoaderCustomLabel(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg text-[#24312D] dark:text-[#EDF5F1]"
            />
          </div>
        </div>

        {/* Fullscreen Overlay Test Modal */}
        {loaderFullscreenPreview && (
          <div className="relative" role="dialog" aria-modal="true" aria-label="Fullscreen loader preview">
            <BuildingBlocksLoader
              variant="fullscreen"
              size="lg"
              label={loaderCustomLabel}
              completionState={loaderTestCompletion}
            />
            <button
              type="button"
              onClick={() => setLoaderFullscreenPreview(false)}
              className="fixed top-5 right-5 z-[60] px-3 py-1.5 bg-black/75 hover:bg-black text-white rounded-lg text-xs font-semibold backdrop-blur-md"
            >
              Exit Preview (Esc)
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Workspace & Rent Defaults */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1">
          Rent Rules & Operational Thresholds
        </h3>
        <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
          Configurable policies guiding the AI Sentinel's reminder scheduling and approval gates.
        </p>

        <form onSubmit={handleSaveDefaults} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-workspace-name" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                Workspace Name
              </label>
              <input
                id="settings-workspace-name"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
              />
            </div>

            <div>
              <label htmlFor="settings-landlord-name" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                Landlord Display Name
              </label>
              <input
                id="settings-landlord-name"
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
              />
            </div>

            <div>
              <label htmlFor="settings-rent-due-day" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                Rent Due Day (Day of Month)
              </label>
              <input
                id="settings-rent-due-day"
                type="number"
                min={1}
                max={28}
                value={rentDueDay}
                onChange={(e) => setRentDueDay(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="settings-grace-period" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                Grace Period (Days before arrears flagging)
              </label>
              <input
                id="settings-grace-period"
                type="number"
                min={0}
                max={15}
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="settings-maint-threshold" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                Maintenance Approval Threshold (KES)
              </label>
              <input
                id="settings-maint-threshold"
                type="number"
                step={1000}
                value={maintThreshold}
                onChange={(e) => setMaintThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
              />
              <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block mt-1">
                Quotes above this amount require Landlord signoff.
              </span>
            </div>

            <div>
              <label htmlFor="settings-mpesa-paybill" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                M-Pesa Paybill / Till Number
              </label>
              <input
                id="settings-mpesa-paybill"
                type="text"
                value={paybill}
                onChange={(e) => setPaybill(e.target.value)}
                placeholder="522522"
                className="w-full px-3 py-2 text-sm font-mono bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl shadow-xs min-h-[38px]"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Integrations & Simulated Sandboxes */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1">
          Communications & Payment Integrations
        </h3>
        <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
          Status of external Kenyan payment rail and messaging webhooks. (Prototype demonstrates real simulation).
        </p>

        <div className="space-y-4">
          {/* M-Pesa Daraja Card */}
          <div className="p-4 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] bg-[#F6F8F6]/60 dark:bg-[#202D28]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                    Safaricom M-Pesa Daraja C2B / B2C
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Demo Sandbox Connected
                  </span>
                </div>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-0.5 tabular-nums">
                  Simulated Paybill {paybill}. Automated validation and confirmation URL handlers active.
                </p>
                {pingMpesaSuccess && (
                  <span role="status" className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1 tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Daraja Webhook Ping Verified (Latency 14ms)
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestMpesaPing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] shrink-0"
            >
              Test Daraja Ping
            </button>
          </div>

          {/* WhatsApp Cloud API Card */}
          <div className="p-4 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] bg-[#F6F8F6]/60 dark:bg-[#202D28]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-1 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                    WhatsApp Business Cloud API
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Demo Webhook Active
                  </span>
                </div>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
                  Tenant WhatsApp message intake and automated receipt dispatch simulated.
                </p>
                {pingWhatsAppSuccess && (
                  <span role="status" className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1 tabular-nums">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> WhatsApp Webhook Ping Verified (Latency 18ms)
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestWhatsAppPing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] shrink-0"
            >
              Test WhatsApp Ping
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-red-200 dark:border-red-950/60 shadow-xs">
        <h3 className="text-sm font-bold text-red-700 dark:text-red-400 mb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" /> Reset Demo Workspace
        </h3>
        <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
          Restore the portfolio dataset to the initial Kenyan properties, tenants, unallocated M-Pesa payments, and pending agent tasks.
        </p>

        <button
          type="button"
          onClick={() => setResetConfirmOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Demo Data to Initial Seed</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setResetConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039]"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 id="reset-confirm-title" className="text-base font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Confirm Demo Data Reset?
              </h3>
              <button
                type="button"
                aria-label="Close reset confirmation dialog"
                onClick={() => setResetConfirmOpen(false)}
                className="p-1 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4 leading-relaxed">
              This will restore all 3 properties (Kilimani Heights, Sapphire Court, Ruaka Greenview), re-queue the 2 unallocated M-Pesa payments, and reset agent approval tasks.
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setResetConfirmOpen(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
