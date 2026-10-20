'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProperty } from '../../context/PropertyContext';
import { OnboardingData } from '../../types';
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
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const {
    currentUser,
    workspaceConfig,
    onboardingData,
    updateOnboardingData,
    completeOnboarding,
    addToast,
  } = useProperty();

  // Current active step (1 to 7)
  const [step, setStep] = useState<number>(onboardingData.step || 1);

  // Form local state initialized from saved onboarding draft
  const [landlordName, setLandlordName] = useState(
    onboardingData.landlordName || currentUser.name || 'David Mwangi'
  );
  const [workspaceName, setWorkspaceName] = useState(
    onboardingData.workspaceName || `${onboardingData.landlordName || currentUser.name || 'Mwangi'}'s Property Holdings`
  );
  const [contactPhone, setContactPhone] = useState(onboardingData.contactPhone || '+254 712 345 678');
  const [country, setCountry] = useState(onboardingData.country || 'Kenya');
  const [currency, setCurrency] = useState(onboardingData.currency || 'KES');
  const [timezone, setTimezone] = useState(onboardingData.timezone || 'Africa/Nairobi (EAT)');

  // Step 2: Property
  const [hasExistingProperties, setHasExistingProperties] = useState(onboardingData.hasExistingProperties !== false);
  const [propertyName, setPropertyName] = useState(onboardingData.propertyName || 'Kilimani Heights Apartments');
  const [propertyLocation, setPropertyLocation] = useState(onboardingData.propertyLocation || 'Lenana Road, Kilimani');
  const [propertyCity, setPropertyCity] = useState(onboardingData.propertyCity || 'Nairobi');
  const [propertyType, setPropertyType] = useState<OnboardingData['propertyType']>(
    onboardingData.propertyType || 'APARTMENT'
  );
  const [totalUnitsCount, setTotalUnitsCount] = useState<number>(onboardingData.totalUnitsCount || 8);

  // Step 3: Units
  const [unitNumber, setUnitNumber] = useState(onboardingData.unitNumber || 'A1');
  const [unitType, setUnitType] = useState(onboardingData.unitType || '2BR Master Ensuite');
  const [monthlyRent, setMonthlyRent] = useState<number>(onboardingData.monthlyRent || 45000);
  const [serviceCharge, setServiceCharge] = useState<number>(onboardingData.serviceCharge || 3500);

  // Step 4: Rent Rules
  const [rentDueDay, setRentDueDay] = useState<number>(onboardingData.rentDueDay || 5);
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(onboardingData.gracePeriodDays || 5);
  const [lateFeePercentage, setLateFeePercentage] = useState<number>(onboardingData.lateFeePercentage || 5);
  const [securityDepositMonths, setSecurityDepositMonths] = useState<number>(
    onboardingData.securityDepositMonths || 1
  );
  const [waterFixedAmount, setWaterFixedAmount] = useState<number>(onboardingData.waterFixedAmount || 1500);
  const [garbageCharge, setGarbageCharge] = useState<number>(onboardingData.garbageCharge || 500);

  // Step 5: Tenant
  const [addTenantNow, setAddTenantNow] = useState(onboardingData.addTenantNow !== false);
  const [tenantName, setTenantName] = useState(onboardingData.tenantName || 'Wanjiku Kamau');
  const [tenantPhone, setTenantPhone] = useState(onboardingData.tenantPhone || '+254 712 345 678');
  const [tenantEmail, setTenantEmail] = useState(onboardingData.tenantEmail || 'wanjiku.kamau@gmail.com');
  const [tenantNationalId, setTenantNationalId] = useState(onboardingData.tenantNationalId || '32145678');
  const [leaseStart, setLeaseStart] = useState(onboardingData.leaseStart || '2026-01-01');
  const [leaseEnd, setLeaseEnd] = useState(onboardingData.leaseEnd || '2026-12-31');
  const [depositAmount, setDepositAmount] = useState<number>(onboardingData.depositAmount || 48500);

  // Step 6: Integrations
  const [enableMpesa, setEnableMpesa] = useState(onboardingData.enableMpesa !== false);
  const [mpesaPaybillNumber, setMpesaPaybillNumber] = useState(onboardingData.mpesaPaybillNumber || '522522');
  const [mpesaRefFormat, setMpesaRefFormat] = useState(onboardingData.mpesaRefFormat || 'Unit Number (e.g. A1)');
  const [enableWhatsApp, setEnableWhatsApp] = useState(onboardingData.enableWhatsApp !== false);
  const [whatsappAutoReceipt, setWhatsappAutoReceipt] = useState(onboardingData.whatsappAutoReceipt !== false);
  const [whatsappAutoReminders, setWhatsappAutoReminders] = useState(
    onboardingData.whatsappAutoReminders !== false
  );

  // Validation errors
  const [stepError, setStepError] = useState<string | null>(null);

  // Auto-sync form changes to draft state
  const syncDraft = (stepNumber: number) => {
    const draft: Partial<OnboardingData> = {
      step: stepNumber,
      status: 'in_progress',
      landlordName,
      workspaceName,
      contactPhone,
      country,
      currency,
      timezone,
      hasExistingProperties,
      propertyName,
      propertyLocation,
      propertyCity,
      propertyType,
      totalUnitsCount,
      unitNumber,
      unitType,
      monthlyRent,
      serviceCharge,
      rentDueDay,
      gracePeriodDays,
      lateFeePercentage,
      securityDepositMonths,
      waterFixedAmount,
      garbageCharge,
      addTenantNow,
      tenantName,
      tenantPhone,
      tenantEmail,
      tenantNationalId,
      leaseStart,
      leaseEnd,
      depositAmount,
      enableMpesa,
      mpesaPaybillNumber,
      mpesaRefFormat,
      enableWhatsApp,
      whatsappAutoReceipt,
      whatsappAutoReminders,
    };
    updateOnboardingData(draft);
  };

  const stepsList = [
    { num: 1, title: 'Workspace', desc: 'Landlord & Entity' },
    { num: 2, title: 'Portfolio', desc: 'Properties' },
    { num: 3, title: 'Units', desc: 'Pricing & Layout' },
    { num: 4, title: 'Rent Rules', desc: 'Due Dates & Fees' },
    { num: 5, title: 'Tenants', desc: 'Leases' },
    { num: 6, title: 'Channels', desc: 'M-Pesa & WhatsApp' },
    { num: 7, title: 'Launch', desc: 'Review & Finish' },
  ];

  const validateCurrentStep = (): boolean => {
    setStepError(null);
    if (step === 1) {
      if (!landlordName.trim()) {
        setStepError('Please enter the Landlord or Business Manager name.');
        return false;
      }
      if (!workspaceName.trim()) {
        setStepError('Please enter the Workspace or Holding entity name.');
        return false;
      }
    } else if (step === 2) {
      if (hasExistingProperties && !propertyName.trim()) {
        setStepError('Please enter your primary property name.');
        return false;
      }
      if (hasExistingProperties && !propertyLocation.trim()) {
        setStepError('Please enter the property location (e.g. Kilimani, Westlands).');
        return false;
      }
    } else if (step === 3) {
      if (!unitNumber.trim()) {
        setStepError('Please specify a unit door identifier (e.g. A1, Unit 10).');
        return false;
      }
      if (monthlyRent <= 0) {
        setStepError('Please enter a valid monthly rent amount in KES.');
        return false;
      }
    } else if (step === 5) {
      if (addTenantNow && !tenantName.trim()) {
        setStepError('Please enter the tenant full name or uncheck registering a tenant now.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      syncDraft(nextStep);
    } else {
      handleFinalSubmission();
    }
  };

  const handlePrev = () => {
    setStepError(null);
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      syncDraft(prevStep);
    }
  };

  const handleSkipToDemo = () => {
    completeOnboarding();
    addToast('INFO', 'Demo Workspace Loaded', 'Loaded pre-seeded Kenyan property dataset.');
  };

  const handleFinalSubmission = () => {
    const finalData: OnboardingData = {
      step: 7,
      status: 'completed',
      landlordName,
      workspaceName,
      contactPhone,
      country,
      currency,
      timezone,
      hasExistingProperties,
      propertyName,
      propertyLocation,
      propertyCity,
      propertyType,
      totalUnitsCount,
      unitNumber,
      unitType,
      monthlyRent,
      serviceCharge,
      rentDueDay,
      gracePeriodDays,
      lateFeePercentage,
      securityDepositMonths,
      waterChargeType: 'FIXED',
      waterFixedAmount,
      garbageCharge,
      addTenantNow,
      tenantName,
      tenantPhone,
      tenantEmail,
      tenantNationalId,
      leaseStart,
      leaseEnd,
      depositAmount,
      enableMpesa,
      mpesaPaybillNumber,
      mpesaRefFormat,
      enableWhatsApp,
      whatsappAutoReceipt,
      whatsappAutoReminders,
      completedAt: new Date().toISOString(),
    };

    completeOnboarding(finalData);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 transition-colors duration-200">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8E5] dark:border-[#2D4039]">
        <div>
          <span className="text-xs uppercase font-extrabold text-[#2F8A68] dark:text-[#79C8A4] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            Landlord Onboarding Workflow
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-0.5">
            Configure Your Property Operations
          </h1>
        </div>

        <button
          onClick={handleSkipToDemo}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Skip & Explore Demo
        </button>
      </div>

      {/* 7-Step Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center cursor-pointer" onClick={() => s.num < step && setStep(s.num)}>
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
            className="bg-[#2F8A68] dark:bg-[#79C8A4] h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-6 sm:p-8 shadow-sm">
        {stepError && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{stepError}</span>
          </div>
        )}

        {/* STEP 1: Landlord Profile & Workspace */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                1. Landlord Profile & Workspace Identity
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Establish the ownership entity and regional parameters for your Kenyan property portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Landlord / Manager Name *
                </label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  placeholder="e.g. David Mwangi"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Workspace / Holding Entity Name *
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Mwangi Property Holdings"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Contact Phone (WhatsApp / SMS)
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Operating Timezone
                </label>
                <input
                  type="text"
                  value={timezone}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Operating Currency
                </label>
                <input
                  type="text"
                  value={`${currency} (Kenyan Shilling)`}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Property Portfolio */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                2. Property Portfolio & First Building
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter details for your primary residential building or managed estate.
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-center justify-between">
              <label htmlFor="managePropsToggle" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                I actively manage properties right now
              </label>
              <input
                id="managePropsToggle"
                type="checkbox"
                checked={hasExistingProperties}
                onChange={(e) => setHasExistingProperties(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
              />
            </div>

            {hasExistingProperties ? (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g. Kilimani Heights Apartments"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Street / Road Location *
                    </label>
                    <input
                      type="text"
                      value={propertyLocation}
                      onChange={(e) => setPropertyLocation(e.target.value)}
                      placeholder="e.g. Lenana Road, Kilimani"
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      City / County
                    </label>
                    <select
                      value={propertyCity}
                      onChange={(e) => setPropertyCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                    >
                      <option value="Nairobi">Nairobi</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Kisumu">Kisumu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Eldoret">Eldoret</option>
                      <option value="Kiambu">Kiambu</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Property Category
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                    >
                      <option value="APARTMENT">Apartment Complex</option>
                      <option value="MAISONETTE">Maisonette / Townhouse</option>
                      <option value="COMMERCIAL">Commercial Office / Retail</option>
                      <option value="MIXED_USE">Mixed-Use Commercial + Residential</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Registered Unit Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={totalUnitsCount}
                      onChange={(e) => setTotalUnitsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400">
                You can proceed with an empty portfolio now and create properties later directly from the Properties view.
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Units & Occupancy */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                3. Configure First Unit & Rental Pricing
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure door numbering and monthly pricing for your first managed unit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Door Number / ID *
                </label>
                <input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="e.g. A1, Unit 12, Penthouse"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
                <span className="text-[10px] text-gray-400">Used by tenants as their M-Pesa BillRef</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Unit Layout
                </label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  <option value="Bedsitter / Studio">Bedsitter / Studio</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2BR Master Ensuite">2BR Master Ensuite</option>
                  <option value="3 Bedroom">3 Bedroom</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Commercial Shop">Commercial Shop</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Base Rent (KES) *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Service Charge (KES)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between border border-emerald-500/20">
              <span className="font-medium">Total Monthly Expected Rent (Base + SC):</span>
              <strong className="text-sm font-extrabold">KES {(monthlyRent + serviceCharge).toLocaleString()}</strong>
            </div>
          </div>
        )}

        {/* STEP 4: Rent Rules & Recurring Charges */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                4. Billing Cycle, Grace Periods & Recurring Fees
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure rent due dates and automatic arrears follow-up schedules.
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
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
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
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  <option value={0}>0 days (Strict)</option>
                  <option value={5}>5 days (Standard)</option>
                  <option value={7}>7 days (Flexible)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Late Fee Surcharge
                </label>
                <select
                  value={lateFeePercentage}
                  onChange={(e) => setLateFeePercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  <option value={0}>No penalty fee</option>
                  <option value={5}>5% of base rent</option>
                  <option value={10}>10% of base rent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Security Deposit Requirement
                </label>
                <select
                  value={securityDepositMonths}
                  onChange={(e) => setSecurityDepositMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  <option value={1}>1 Month Base Rent</option>
                  <option value={2}>2 Months Base Rent</option>
                  <option value={0}>None / Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Garbage Collection (KES / Month)
                </label>
                <input
                  type="number"
                  value={garbageCharge}
                  onChange={(e) => setGarbageCharge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Rent due on the <strong>{rentDueDay}th</strong>. The Kejahub AI Agent will monitor incoming M-Pesa receipts, and trigger follow-up reminders once the {gracePeriodDays}-day grace period expires on the <strong>{rentDueDay + gracePeriodDays}th</strong>.
            </div>
          </div>
        )}

        {/* STEP 5: Tenants & Leases */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                5. Tenant & Tenancy Record (Optional)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Assign your first tenant now to evaluate M-Pesa reconciliation and WhatsApp messaging.
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl flex items-center justify-between">
              <label htmlFor="addTenantToggle" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Register an active tenant for Unit {unitNumber}
              </label>
              <input
                id="addTenantToggle"
                type="checkbox"
                checked={addTenantNow}
                onChange={(e) => setAddTenantNow(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
              />
            </div>

            {addTenantNow && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Tenant Full Name *
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Wanjiku Kamau"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp / M-Pesa Phone Number
                  </label>
                  <input
                    type="text"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
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
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    National ID / Passport Number
                  </label>
                  <input
                    type="text"
                    value={tenantNationalId}
                    onChange={(e) => setTenantNationalId(e.target.value)}
                    placeholder="e.g. 32145678"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Lease Start Date
                  </label>
                  <input
                    type="date"
                    value={leaseStart}
                    onChange={(e) => setLeaseStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
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
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Payments & Communications */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                6. Payments & Communications Channels
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure M-Pesa reconciliation parameters and automated WhatsApp communication rules.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <CreditCard className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                        M-Pesa Paybill / Till Reconciliation
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Matches incoming C2B M-Pesa receipts against unit account numbers.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                        Simulated Sandbox Configured
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableMpesa}
                    onChange={(e) => setEnableMpesa(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                  />
                </div>

                {enableMpesa && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Business Paybill / Till Number
                      </label>
                      <input
                        type="text"
                        value={mpesaPaybillNumber}
                        onChange={(e) => setMpesaPaybillNumber(e.target.value)}
                        placeholder="e.g. 522522"
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Account Reference Matching
                      </label>
                      <input
                        type="text"
                        value={mpesaRefFormat}
                        disabled
                        className="w-full px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <MessageSquare className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">
                        WhatsApp Tenant Communications
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Automated payment receipts, maintenance updates, and reminder drafts.
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                        Interactive Logs Ready
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableWhatsApp}
                    onChange={(e) => setEnableWhatsApp(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#2F8A68] focus:ring-[#2F8A68]"
                  />
                </div>

                {enableWhatsApp && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whatsappAutoReceipt}
                        onChange={(e) => setWhatsappAutoReceipt(e.target.checked)}
                        className="h-3.5 w-3.5 rounded text-[#2F8A68]"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Auto-dispatch WhatsApp receipt immediately upon payment reconciliation
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={whatsappAutoReminders}
                        onChange={(e) => setWhatsappAutoReminders(e.target.checked)}
                        className="h-3.5 w-3.5 rounded text-[#2F8A68]"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        Draft polite rent reminder batches for landlord sign-off when grace period expires
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Finish */}
        {step === 7 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                7. Review Workspace & Launch
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Review all details before finalizing. All settings can be adjusted anytime from Settings.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Workspace & Landlord:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{workspaceName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Primary Property:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {propertyName} ({propertyLocation}, {propertyCity})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-[11px]">First Unit Setup:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Unit {unitNumber} ({unitType}) • KES {monthlyRent.toLocaleString()} + KES {serviceCharge.toLocaleString()} Service Charge
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Billing Rules:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Due Day {rentDueDay} • {gracePeriodDays} Days Grace Period • {lateFeePercentage}% Late Fee
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                >
                  Edit
                </button>
              </div>

              {addTenantNow && (
                <div className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Initial Tenant:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {tenantName} ({tenantPhone}) &bull; Assigned to Unit {unitNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                  >
                    Edit
                  </button>
                </div>
              )}

              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block text-[11px]">Automations & Guardrails:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Human-in-the-Loop Safe Mode (Approval required for bulk messaging and expenditures &gt; KES 10,000)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="text-[11px] font-semibold text-[#2F8A68] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
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
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] transition-all shadow-sm cursor-pointer"
          >
            <span>{step === 7 ? 'Complete Setup & Launch Workspace' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
