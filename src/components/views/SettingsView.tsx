import React, { useState } from 'react';
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
} from 'lucide-react';

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
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
          Settings & Workspace Configuration
        </h1>
        <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
          Manage operating defaults, payment channels, AI safety thresholds, and appearance
        </p>
      </div>

      {/* Section 1: Appearance */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Interface Appearance
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Select your visual theme preference. Persisted to your local browser environment.
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-md">
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
                onClick={() => setTheme(th.id as any)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-[#2F8A68] bg-[#173C32]/5 dark:bg-[#79C8A4]/10 ring-2 ring-[#2F8A68]'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-[#2F8A68] dark:text-[#79C8A4]' : 'text-gray-400'}`} />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{th.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Workspace & Rent Defaults */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Rent Rules & Operational Thresholds
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Configurable policies guiding the AI Sentinel's reminder scheduling and approval gates.
        </p>

        <form onSubmit={handleSaveDefaults} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Landlord Display Name
              </label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Rent Due Day (Day of Month)
              </label>
              <input
                type="number"
                min={1}
                max={28}
                value={rentDueDay}
                onChange={(e) => setRentDueDay(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Grace Period (Days before arrears flagging)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Maintenance Approval Threshold (KES)
              </label>
              <input
                type="number"
                step={1000}
                value={maintThreshold}
                onChange={(e) => setMaintThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
              <span className="text-[10px] text-gray-400">
                Quotes above this amount require Landlord signoff.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                M-Pesa Paybill / Till Number
              </label>
              <input
                type="text"
                value={paybill}
                onChange={(e) => setPaybill(e.target.value)}
                placeholder="522522"
                className="w-full px-3 py-2 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl shadow-xs"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Integrations & Simulated Sandboxes */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
          Communications & Payment Integrations
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Status of external Kenyan payment rail and messaging webhooks. (Prototype demonstrates real simulation).
        </p>

        <div className="space-y-4">
          {/* M-Pesa Daraja Card */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    Safaricom M-Pesa Daraja C2B / B2C
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Demo Sandbox Connected
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Simulated Paybill {paybill}. Automated validation and confirmation URL handlers active.
                </p>
                {pingMpesaSuccess && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Daraja Webhook Ping Verified (Latency 14ms)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleTestMpesaPing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
            >
              Test Daraja Ping
            </button>
          </div>

          {/* WhatsApp Cloud API Card */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-600 mt-1" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                    WhatsApp Business Cloud API
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Demo Webhook Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Tenant WhatsApp message intake and automated receipt dispatch simulated.
                </p>
                {pingWhatsAppSuccess && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp Webhook Ping Verified (Latency 18ms)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleTestWhatsAppPing}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
            >
              Test WhatsApp Ping
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Data Management & Reset */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-red-200 dark:border-red-950/60 shadow-xs">
        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Reset Demo Workspace
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Restore the portfolio dataset to the initial Kenyan properties, tenants, unallocated M-Pesa payments, and pending agent tasks.
        </p>

        <button
          onClick={() => setResetConfirmOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data to Initial Seed</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Demo Data Reset?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              This will restore all 3 properties (Kilimani Heights, Sapphire Court, Ruaka Greenview), re-queue the 2 unallocated M-Pesa payments, and reset agent approval tasks.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
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
