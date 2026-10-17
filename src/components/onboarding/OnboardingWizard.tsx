import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Users,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const {
    workspaceConfig,
    updateWorkspaceConfig,
    addProperty,
    addUnit,
    addTenant,
    setCurrentScreen,
    addToast,
  } = useProperty();

  const [step, setStep] = useState(1);

  // Form states across the 7 steps
  const [landlordName, setLandlordName] = useState(workspaceConfig.landlordName || 'David Mwangi');
  const [workspaceName, setWorkspaceName] = useState(workspaceConfig.workspaceName || 'Mwangi Property Holdings');
  const [currency, setCurrency] = useState('KES');
  const [country, setCountry] = useState('Kenya');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Step 2: Portfolio
  const [portfolioScale, setPortfolioScale] = useState<'ONE' | 'SEVERAL' | 'GROWING'>('SEVERAL');
  const [propertyName, setPropertyName] = useState('Kilimani Heights Apartments');
  const [propertyLocation, setPropertyLocation] = useState('Lenana Road, Kilimani');
  const [propertyType, setPropertyType] = useState<'APARTMENT' | 'MAISONETTE' | 'COMMERCIAL'>('APARTMENT');
  const [totalUnitsCount, setTotalUnitsCount] = useState(8);

  // Step 3: First Units
  const [unit1Number, setUnit1Number] = useState('A1');
  const [unit1Type, setUnit1Type] = useState('2BR Master Ensuite');
  const [unit1Rent, setUnit1Rent] = useState(45000);
  const [unit1ServiceCharge, setUnit1ServiceCharge] = useState(3500);

  // Step 4: Rent Rules
  const [rentDueDay, setRentDueDay] = useState(5);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeePercentage, setLateFeePercentage] = useState(5);

  // Step 5: Optional Tenant
  const [addTenantNow, setAddTenantNow] = useState(true);
  const [tenantName, setTenantName] = useState('Wanjiku Kamau');
  const [tenantPhone, setTenantPhone] = useState('+254 712 345 678');
  const [tenantEmail, setTenantEmail] = useState('wanjiku.kamau@gmail.com');
  const [leaseStart, setLeaseStart] = useState('2026-01-01');
  const [leaseEnd, setLeaseEnd] = useState('2026-12-31');
  const [depositAmount, setDepositAmount] = useState(48500);

  // Step 6: Integrations
  const [enableMpesaDemo, setEnableMpesaDemo] = useState(true);
  const [enableWhatsAppDemo, setEnableWhatsAppDemo] = useState(true);

  const steps = [
    { num: 1, title: 'Workspace' },
    { num: 2, title: 'Property' },
    { num: 3, title: 'Units' },
    { num: 4, title: 'Rent Rules' },
    { num: 5, title: 'Tenant' },
    { num: 6, title: 'Integrations' },
    { num: 7, title: 'Review & Launch' },
  ];

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkipToDemo = () => {
    updateWorkspaceConfig({ onboardingCompleted: true });
    setCurrentScreen('overview');
    addToast('INFO', 'Demo Workspace Active', 'Loaded pre-seeded Kenyan portfolio dataset.');
  };

  const handleComplete = () => {
    // Commit the configuration
    updateWorkspaceConfig({
      landlordName,
      workspaceName,
      currency,
      country,
      dateFormat,
      rentDueDay,
      gracePeriodDays,
      lateFeePercentage,
      onboardingCompleted: true,
    });

    addToast('SUCCESS', 'Setup Complete', `Workspace "${workspaceName}" configured!`);
    setCurrentScreen('overview');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner with Skip */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
        <div>
          <span className="text-xs uppercase font-bold text-[#2F8A68] dark:text-[#79C8A4] tracking-wider">
            Quick Onboarding Setup
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1]">
            Welcome to KEJAHUB
          </h1>
        </div>
        <button
          onClick={handleSkipToDemo}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Skip & Explore Demo Workspace
        </button>
      </div>

      {/* Progress Steps Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] ring-4 ring-emerald-500/20'
                    : step > s.num
                    ? 'bg-[#2F8A68] text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[10px] mt-1 hidden sm:block text-gray-500 dark:text-gray-400 font-medium">
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2F8A68] h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Form Card */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-6 sm:p-8 shadow-sm">
        {/* Step 1: Workspace */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                1. Workspace & Landlord Identity
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Set the foundational identity and currency rules for your property operations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Landlord / Manager Name
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
                  Workspace / Holding Entity
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
                  Operating Currency
                </label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400">Defaulted to Kenyan Shillings (KES)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Portfolio Setup */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                2. Portfolio Scope & First Property
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select your scale and enter details for your primary residential building.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'ONE', label: '1 Property', sub: '1–10 units' },
                { id: 'SEVERAL', label: 'Multiple Blocks', sub: '10–50 units' },
                { id: 'GROWING', label: 'Large Portfolio', sub: '50+ units' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPortfolioScale(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    portfolioScale === opt.id
                      ? 'border-[#2F8A68] bg-[#173C32]/5 dark:bg-[#79C8A4]/10 ring-2 ring-[#2F8A68]'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">{opt.label}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{opt.sub}</div>
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Kilimani Heights Apartments"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Location / Area
                  </label>
                  <input
                    type="text"
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    placeholder="e.g. Lenana Road, Kilimani, Nairobi"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    value={totalUnitsCount}
                    onChange={(e) => setTotalUnitsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Units and Occupancy */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                3. Configure First Unit
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Set up unit numbering and default monthly pricing structure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Identifier / Door Number
                </label>
                <input
                  type="text"
                  value={unit1Number}
                  onChange={(e) => setUnit1Number(e.target.value)}
                  placeholder="e.g. A1, Unit 12, Penthouse"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Configuration
                </label>
                <input
                  type="text"
                  value={unit1Type}
                  onChange={(e) => setUnit1Type(e.target.value)}
                  placeholder="e.g. 2BR Master Ensuite"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Base Rent (KES)
                </label>
                <input
                  type="number"
                  value={unit1Rent}
                  onChange={(e) => setUnit1Rent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Service Charge (KES)
                </label>
                <input
                  type="number"
                  value={unit1ServiceCharge}
                  onChange={(e) => setUnit1ServiceCharge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Total expected monthly per unit: <strong>KES {(unit1Rent + unit1ServiceCharge).toLocaleString()}</strong></span>
            </div>
          </div>
        )}

        {/* Step 4: Rent and Recurring Charges */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                4. Rent Payment & Grace Period Rules
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                These rules drive AI reminder scheduling and overdue calculation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Due Day of Month
                </label>
                <select
                  value={rentDueDay}
                  onChange={(e) => setRentDueDay(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value={1}>1st of month</option>
                  <option value={5}>5th of month (Standard Kenya)</option>
                  <option value={10}>10th of month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Grace Period (Days)
                </label>
                <select
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value={0}>0 days (Strict)</option>
                  <option value={5}>5 days (Standard)</option>
                  <option value={7}>7 days (Flexible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Late Fee Penalty
                </label>
                <select
                  value={lateFeePercentage}
                  onChange={(e) => setLateFeePercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value={0}>No penalty fee</option>
                  <option value={5}>5% of base rent</option>
                  <option value={10}>10% of base rent</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl leading-relaxed">
              Rent due on the <strong>{rentDueDay}th</strong>. The AI Agent will monitor incoming M-Pesa receipts, and flag overdue balances once the {gracePeriodDays}-day grace period expires (on the {rentDueDay + gracePeriodDays}th).
            </div>
          </div>
        )}

        {/* Step 5: Tenant and Lease Setup */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                5. Tenant & Tenancy Record (Optional)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You can assign your first tenant now or add them later from the tenant directory.
              </p>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                id="addTenantCheck"
                type="checkbox"
                checked={addTenantNow}
                onChange={(e) => setAddTenantNow(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
              />
              <label htmlFor="addTenantCheck" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Register an existing tenant for Unit {unit1Number}
              </label>
            </div>

            {addTenantNow && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Wanjiku Kamau"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp / Phone Number
                  </label>
                  <input
                    type="text"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    placeholder="wanjiku.kamau@gmail.com"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Security Deposit Held (KES)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Payments & Communications */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                6. Payments & WhatsApp Channels
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enable simulated channels for prototype evaluation. Real integrations require Daraja & Meta API keys.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start justify-between bg-gray-50/50 dark:bg-gray-800/40">
                <div className="flex gap-3">
                  <CreditCard className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                      M-Pesa Paybill / Till Reconciliation
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Simulate automatic matching of incoming M-Pesa receipts against unit account numbers.
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                      Simulated Sandbox Active
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableMpesaDemo}
                  onChange={(e) => setEnableMpesaDemo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                />
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-start justify-between bg-gray-50/50 dark:bg-gray-800/40">
                <div className="flex gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                      WhatsApp Tenant Communications
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Simulate automated payment receipts, maintenance updates, and reminder drafts.
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                      Simulated Interactive Logs
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableWhatsAppDemo}
                  onChange={(e) => setEnableWhatsAppDemo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review & Finish */}
        {step === 7 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                7. Review & Launch Workspace
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Review your settings. You can modify any property or rent rule later from Settings.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Workspace / Landlord:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{workspaceName} ({landlordName})</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Primary Property:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{propertyName} ({propertyLocation})</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">First Unit Rent:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Unit {unit1Number} • KES {unit1Rent.toLocaleString()} + KES {unit1ServiceCharge.toLocaleString()} SC
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Rent Due Schedule:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Day {rentDueDay} with {gracePeriodDays} days grace period
                </span>
              </div>
              {addTenantNow && (
                <div className="py-2 flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Initial Tenant:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {tenantName} ({tenantPhone})
                  </span>
                </div>
              )}
              <div className="py-2 flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">AI Safety Guard:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Human Approval Enabled for Mass Reminders & Waivers
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] transition-all shadow-sm"
          >
            <span>{step === 7 ? 'Complete Setup & Open Dashboard' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
