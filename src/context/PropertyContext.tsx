'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Property,
  Unit,
  Tenant,
  PaymentTransaction,
  MaintenanceTicket,
  Expense,
  AgentTask,
  AutomationRule,
  AgentAuditLog,
  WorkspaceConfig,
  WhatsAppMessage,
  UserRole,
  ScreenId,
  CurrentUser,
  OnboardingData,
  OnboardingStatus,
} from '../types';
import {
  initialProperties,
  initialUnits,
  initialTenants,
  initialTransactions,
  initialMaintenanceTickets,
  initialExpenses,
  initialAgentTasks,
  initialAutomationRules,
  initialAuditLogs,
  initialWorkspaceConfig,
  initialWhatsAppMessages,
} from '../data/seedData';
import {
  calculateTenantBalance,
  matchMpesaTransaction,
  evaluateAgentActionSafety,
  TenantBalanceResult,
} from '../utils/propertyMath';

export interface AssistantChatMessage {
  id: string;
  sender: 'USER' | 'AGENT';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    screen: ScreenId;
    actionType?: string;
  };
}

export interface ToastNotice {
  id: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  title: string;
  message?: string;
}

interface PropertyContextType {
  // State
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  transactions: PaymentTransaction[];
  maintenanceTickets: MaintenanceTicket[];
  expenses: Expense[];
  agentTasks: AgentTask[];
  automationRules: AutomationRule[];
  auditLogs: AgentAuditLog[];
  whatsappMessages: WhatsAppMessage[];
  workspaceConfig: WorkspaceConfig;

  // App UI State
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Theme & Auth
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  currentUser: CurrentUser;
  isAuthLoaded: boolean;
  switchRole: (role: UserRole) => void;
  signIn: (email: string, role?: UserRole, options?: { isDemo?: boolean; redirectTo?: string }) => Promise<boolean>;
  signUp: (name: string, email: string, password?: string) => Promise<boolean>;
  signOut: () => void;
  resetDemoData: () => void;

  // Onboarding
  onboardingData: OnboardingData;
  updateOnboardingData: (updates: Partial<OnboardingData>) => void;
  completeOnboarding: (finalData?: OnboardingData) => void;

  // Assistant Drawer
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  assistantMessages: AssistantChatMessage[];
  sendAssistantMessage: (text: string) => void;

  // Toasts
  toasts: ToastNotice[];
  dismissToast: (id: string) => void;
  addToast: (type: ToastNotice['type'], title: string, message?: string) => void;

  // Operations
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  archiveProperty: (id: string) => void;

  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;

  addTenant: (tenant: Omit<Tenant, 'id'>, unitId?: string) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;

  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => PaymentTransaction;
  reconcilePayment: (transactionId: string, tenantId: string, unitId: string) => void;

  createMaintenanceTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => void;
  updateMaintenanceStatus: (id: string, status: MaintenanceTicket['status'], notes?: string) => void;
  approveMaintenanceTicket: (id: string) => boolean;

  addExpense: (expense: Omit<Expense, 'id'>) => void;

  approveAgentTask: (taskId: string) => boolean;
  rejectAgentTask: (taskId: string) => void;
  executeAgentTaskDirectly: (taskId: string) => void;
  toggleAutomationRule: (ruleId: string) => void;

  sendWhatsAppMessage: (tenantId: string, text: string) => void;
  updateWorkspaceConfig: (config: Partial<WorkspaceConfig>) => void;

  // Authoritative Derived Calculations
  getTenantBalance: (tenantId: string) => TenantBalanceResult;
  portfolioMetrics: {
    expectedRent: number;
    collectedRent: number;
    outstandingRent: number;
    occupancyRate: number;
    totalUnits: number;
    occupiedUnits: number;
    vacantUnits: number;
    unallocatedCount: number;
    unallocatedAmount: number;
    pendingMaintenanceCount: number;
  };
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const STORAGE_KEY = 'kejahub_app_state_v1';

export const defaultUnauthenticatedUser: CurrentUser = {
  id: '',
  name: '',
  email: '',
  role: 'LANDLORD',
  avatarUrl: undefined,
  isAuthenticated: false,
  onboardingStatus: 'not_started',
};

export const defaultDemoLandlord: CurrentUser = {
  id: 'usr-demo-david',
  name: 'David Mwangi',
  email: 'david.mwangi@kejahub.co.ke',
  role: 'LANDLORD',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  isAuthenticated: true,
  onboardingStatus: 'completed',
  workspaceId: 'ws-mwangi',
};

export const defaultOnboardingData: OnboardingData = {
  step: 1,
  status: 'not_started',
  landlordName: '',
  workspaceName: '',
  contactPhone: '+254 712 345 678',
  country: 'Kenya',
  currency: 'KES',
  timezone: 'Africa/Nairobi (EAT)',
  hasExistingProperties: true,
  propertyName: 'Kilimani Heights Apartments',
  propertyLocation: 'Lenana Road, Kilimani',
  propertyCity: 'Nairobi',
  propertyType: 'APARTMENT',
  totalUnitsCount: 8,
  unitNumber: 'A1',
  unitType: '2BR Master Ensuite',
  monthlyRent: 45000,
  serviceCharge: 3500,
  rentDueDay: 5,
  gracePeriodDays: 5,
  lateFeePercentage: 5,
  securityDepositMonths: 1,
  waterChargeType: 'FIXED',
  waterFixedAmount: 1500,
  garbageCharge: 500,
  addTenantNow: true,
  tenantName: 'Wanjiku Kamau',
  tenantPhone: '+254 712 345 678',
  tenantEmail: 'wanjiku.kamau@gmail.com',
  tenantNationalId: '32145678',
  leaseStart: '2026-01-01',
  leaseEnd: '2026-12-31',
  depositAmount: 48500,
  enableMpesa: true,
  mpesaPaybillNumber: '522522',
  mpesaRefFormat: 'Unit Number',
  enableWhatsApp: true,
  whatsappAutoReceipt: true,
  whatsappAutoReminders: true,
};

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Theme state
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');

  // Current user state - defaults to unauthenticated
  const [currentUser, setCurrentUser] = useState<CurrentUser>(defaultUnauthenticatedUser);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // Onboarding draft state
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);

  // Screen & Navigation
  const [currentScreen, setCurrentScreenState] = useState<ScreenId>('overview');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<AssistantChatMessage[]>([
    {
      id: 'init-1',
      sender: 'AGENT',
      text: 'Jambo! I am your Kejahub Property Agent. I assist with property monitoring, M-Pesa rent reconciliation, and WhatsApp communications.',
      timestamp: '12:00 PM',
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const addToast = (type: ToastNotice['type'], title: string, message?: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Main Entities State loaded from storage or seed
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(initialMaintenanceTickets);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>(initialAgentTasks);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [auditLogs, setAuditLogs] = useState<AgentAuditLog[]>(initialAuditLogs);
  const [whatsappMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(initialWhatsAppMessages);
  const [workspaceConfig, setWorkspaceConfigState] = useState<WorkspaceConfig>(initialWorkspaceConfig);

  // Sync state from client localStorage after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem('kejahub_theme') as any;
    if (savedTheme) setThemeState(savedTheme);

    const savedUser = getStored<CurrentUser | null>('kejahub_user', null);
    if (savedUser && savedUser.isAuthenticated) {
      setCurrentUser(savedUser);
    } else {
      setCurrentUser(defaultUnauthenticatedUser);
    }

    const savedDraft = getStored<OnboardingData | null>('kejahub_onboarding_draft', null);
    if (savedDraft) {
      setOnboardingData(savedDraft);
    }

    setProperties(getStored(STORAGE_KEY + '_props', initialProperties));
    setUnits(getStored(STORAGE_KEY + '_units', initialUnits));
    setTenants(getStored(STORAGE_KEY + '_tenants', initialTenants));
    setTransactions(getStored(STORAGE_KEY + '_txs', initialTransactions));
    setMaintenanceTickets(getStored(STORAGE_KEY + '_maint', initialMaintenanceTickets));
    setExpenses(getStored(STORAGE_KEY + '_exp', initialExpenses));
    setAgentTasks(getStored(STORAGE_KEY + '_tasks', initialAgentTasks));
    setAutomationRules(getStored(STORAGE_KEY + '_rules', initialAutomationRules));
    setAuditLogs(getStored(STORAGE_KEY + '_logs', initialAuditLogs));
    setWhatsAppMessages(getStored(STORAGE_KEY + '_wa', initialWhatsAppMessages));
    setWorkspaceConfigState(getStored(STORAGE_KEY + '_config', initialWorkspaceConfig));

    setIsAuthLoaded(true);
  }, []);

  // Sync route pathname with currentScreen
  useEffect(() => {
    if (!pathname) return;
    const clean = pathname.replace(/^\//, '');
    const validScreens: ScreenId[] = [
      'overview',
      'properties',
      'tenants',
      'payments',
      'maintenance',
      'expenses',
      'reports',
      'agent',
      'settings',
      'onboarding',
    ];
    if (validScreens.includes(clean as ScreenId)) {
      setCurrentScreenState(clean as ScreenId);
    }
  }, [pathname]);

  const setCurrentScreen = (screen: ScreenId) => {
    setCurrentScreenState(screen);
    if (router && typeof router.push === 'function') {
      router.push('/' + screen);
    }
  };

  // Apply Theme effect
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('kejahub_theme', theme);
  }, [theme]);

  // Persist entities
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_props', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_maint', JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_exp', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tasks', JSON.stringify(agentTasks));
  }, [agentTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_rules', JSON.stringify(automationRules));
  }, [automationRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_wa', JSON.stringify(whatsappMessages));
  }, [whatsappMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(workspaceConfig));
  }, [workspaceConfig]);

  useEffect(() => {
    localStorage.setItem('kejahub_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const setTheme = (t: 'light' | 'dark' | 'system') => {
    setThemeState(t);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name:
        role === 'LANDLORD'
          ? 'David Mwangi (Landlord)'
          : role === 'PROPERTY_MANAGER'
          ? 'Sarah Omondi (Property Manager)'
          : role === 'FINANCE'
          ? 'James Mwita (Accountant)'
          : role === 'MAINTENANCE'
          ? 'Fundi Patrick (Maintenance Ops)'
          : 'Jane Doe (Read-Only Auditor)',
    }));
    addToast('INFO', 'Active Role Switched', `Now operating under ${role} permissions.`);
  };

  const signIn = async (
    email: string,
    role: UserRole = 'LANDLORD',
    options?: { isDemo?: boolean; redirectTo?: string }
  ): Promise<boolean> => {
    const isDemo = options?.isDemo || email.includes('david.mwangi') || email.includes('sarah.omondi');

    let user: CurrentUser;
    if (isDemo) {
      user = {
        ...defaultDemoLandlord,
        role,
        name: role === 'PROPERTY_MANAGER' ? 'Sarah Omondi (Property Manager)' : 'David Mwangi (Landlord)',
        email: role === 'PROPERTY_MANAGER' ? 'sarah.omondi@kejahub.co.ke' : 'david.mwangi@kejahub.co.ke',
        isAuthenticated: true,
        onboardingStatus: 'completed',
      };
    } else {
      const existingDraft = getStored<OnboardingData | null>('kejahub_onboarding_draft', null);
      const isCompleted = workspaceConfig.onboardingCompleted || existingDraft?.status === 'completed';

      user = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].replace(/[._-]/g, ' '),
        email,
        role,
        isAuthenticated: true,
        onboardingStatus: isCompleted ? 'completed' : 'in_progress',
      };
    }

    setCurrentUser(user);
    localStorage.setItem('kejahub_user', JSON.stringify(user));

    try {
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, isDemo }),
      });
    } catch {}

    addToast('SUCCESS', 'Signed In', `Welcome back, ${user.name}`);

    const target = options?.redirectTo || (user.onboardingStatus === 'completed' ? '/overview' : '/onboarding');
    router.push(target);
    return true;
  };

  const signUp = async (name: string, email: string, password?: string): Promise<boolean> => {
    const newUser: CurrentUser = {
      id: 'usr-' + Date.now().toString(36),
      name,
      email,
      role: 'LANDLORD',
      isAuthenticated: true,
      onboardingStatus: 'in_progress',
      workspaceId: 'ws-' + Date.now().toString(36),
    };

    const initialDraft: OnboardingData = {
      ...defaultOnboardingData,
      step: 1,
      status: 'in_progress',
      landlordName: name,
      workspaceName: `${name}'s Properties`,
    };

    setCurrentUser(newUser);
    setOnboardingData(initialDraft);
    localStorage.setItem('kejahub_user', JSON.stringify(newUser));
    localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(initialDraft));

    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
    } catch {}

    addToast('SUCCESS', 'Account Created', `Welcome to Kejahub, ${name}! Setting up your workspace.`);
    router.push('/onboarding');
    return true;
  };

  const signOut = async () => {
    setCurrentUser(defaultUnauthenticatedUser);
    localStorage.removeItem('kejahub_user');

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    addToast('INFO', 'Signed Out', 'You have been signed out of Kejahub.');
    router.push('/login');
  };

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(updated));
      return updated;
    });

    try {
      fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingData: updates, isCompleted: false }),
      });
    } catch {}
  };

  const completeOnboarding = (finalPayload?: OnboardingData) => {
    const data = finalPayload || onboardingData;

    // 1. Add new property to properties
    const propId = 'prop-new-' + Date.now().toString(36);
    const newProperty: Property = {
      id: propId,
      name: data.propertyName || 'My Property Portfolio',
      location: data.propertyLocation || 'Kilimani, Nairobi',
      city: data.propertyCity || 'Nairobi',
      type: data.propertyType || 'APARTMENT',
      totalUnits: data.totalUnitsCount || 6,
      description: 'Configured during landlord onboarding.',
    };

    // 2. Add first unit
    const unitId = 'u-new-' + Date.now().toString(36);
    const newUnit: Unit = {
      id: unitId,
      propertyId: propId,
      unitNumber: data.unitNumber || 'A1',
      bedrooms: data.unitType?.toLowerCase().includes('1') ? 1 : 2,
      typeLabel: data.unitType || '2BR Master Ensuite',
      monthlyRent: data.monthlyRent || 45000,
      serviceCharge: data.serviceCharge || 3500,
      waterDepositOrFixed: data.waterFixedAmount || 1500,
      status: data.addTenantNow ? 'OCCUPIED' : 'VACANT',
    };

    // 3. Add initial tenant if requested
    let newTenant: Tenant | null = null;
    if (data.addTenantNow && data.tenantName) {
      const tenId = 'ten-new-' + Date.now().toString(36);
      newTenant = {
        id: tenId,
        name: data.tenantName,
        phone: data.tenantPhone || '+254 712 000 000',
        email: data.tenantEmail || 'tenant@property.co.ke',
        nationalIdOrPassport: data.tenantNationalId || '12345678',
        assignedPropertyId: propId,
        assignedUnitId: unitId,
        leaseStart: data.leaseStart || '2026-01-01',
        leaseEnd: data.leaseEnd || '2026-12-31',
        leaseStatus: 'ACTIVE',
        depositAmount: data.depositAmount || 48500,
      };
      newUnit.currentTenantId = tenId;
    }

    setProperties((prev) => [newProperty, ...prev]);
    setUnits((prev) => [newUnit, ...prev]);
    if (newTenant) {
      setTenants((prev) => [newTenant!, ...prev]);
    }

    // 4. Update workspace config
    const updatedConfig: WorkspaceConfig = {
      ...workspaceConfig,
      landlordName: data.landlordName || currentUser.name || 'Landlord',
      workspaceName: data.workspaceName || `${data.landlordName || 'Landlord'}'s Properties`,
      rentDueDay: data.rentDueDay || 5,
      gracePeriodDays: data.gracePeriodDays || 5,
      lateFeePercentage: data.lateFeePercentage || 5,
      onboardingCompleted: true,
      onboardingStatus: 'completed',
      onboardingStep: 7,
      mpesaPaybillNumber: data.mpesaPaybillNumber || '522522',
      mpesaAccountRefFormat: 'Unit Number',
    };
    setWorkspaceConfigState(updatedConfig);
    localStorage.setItem(STORAGE_KEY + '_config', JSON.stringify(updatedConfig));

    // 5. Update user state
    const updatedUser: CurrentUser = {
      ...currentUser,
      name: data.landlordName || currentUser.name,
      onboardingStatus: 'completed',
      isAuthenticated: true,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('kejahub_user', JSON.stringify(updatedUser));

    // 6. Persist completed onboarding data
    const completedData: OnboardingData = {
      ...data,
      status: 'completed',
      step: 7,
      completedAt: new Date().toISOString(),
    };
    setOnboardingData(completedData);
    localStorage.setItem('kejahub_onboarding_draft', JSON.stringify(completedData));

    try {
      fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingData: completedData, isCompleted: true }),
      });
    } catch {}

    addToast('SUCCESS', 'Onboarding Complete', `Workspace "${updatedConfig.workspaceName}" is ready.`);
    router.push('/overview');
  };

  const resetDemoData = () => {
    setProperties(initialProperties);
    setUnits(initialUnits);
    setTenants(initialTenants);
    setTransactions(initialTransactions);
    setMaintenanceTickets(initialMaintenanceTickets);
    setExpenses(initialExpenses);
    setAgentTasks(initialAgentTasks);
    setAutomationRules(initialAutomationRules);
    setAuditLogs(initialAuditLogs);
    setWhatsAppMessages(initialWhatsAppMessages);
    setWorkspaceConfigState(initialWorkspaceConfig);
    addToast('SUCCESS', 'Demo Data Reset', 'Workspace returned to initial Kenyan property dataset.');
  };

  // Authoritative Balance Calculation per tenant
  const getTenantBalance = (tenantId: string): TenantBalanceResult => {
    const tenant = tenants.find((t) => t.id === tenantId);
    if (!tenant) {
      return { totalCharges: 0, totalPayments: 0, balance: 0, status: 'PAID', daysOverdue: 0 };
    }
    const unit = units.find((u) => u.id === tenant.assignedUnitId);
    const monthlyTotal = (unit?.monthlyRent || 0) + (unit?.serviceCharge || 0);

    // Current month charges
    const charges = [{ amount: monthlyTotal }];
    const tenantPayments = transactions.filter(
      (tx) => tx.tenantId === tenantId && (tx.status === 'CONFIRMED' || tx.status === 'RECONCILED')
    );

    return calculateTenantBalance(charges, tenantPayments, workspaceConfig.rentDueDay);
  };

  // Portfolio KPIs derived authoritatively
  const portfolioMetrics = useMemo(() => {
    const filteredUnits = selectedPropertyId
      ? units.filter((u) => u.propertyId === selectedPropertyId)
      : units;

    const filteredTenants = selectedPropertyId
      ? tenants.filter((t) => t.assignedPropertyId === selectedPropertyId)
      : tenants;

    const filteredTransactions = selectedPropertyId
      ? transactions.filter((tx) => tx.propertyId === selectedPropertyId || !tx.propertyId)
      : transactions;

    const totalUnits = filteredUnits.length;
    const occupiedUnits = filteredUnits.filter((u) => u.status === 'OCCUPIED').length;
    const vacantUnits = filteredUnits.filter((u) => u.status === 'VACANT').length;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    let expectedRent = 0;
    for (const unit of filteredUnits) {
      if (unit.status === 'OCCUPIED') {
        expectedRent += (unit.monthlyRent || 0) + (unit.serviceCharge || 0);
      }
    }

    let collectedRent = 0;
    for (const tx of filteredTransactions) {
      if ((tx.status === 'CONFIRMED' || tx.status === 'RECONCILED') && tx.amount) {
        // Count confirmed payments for the active portfolio
        collectedRent += tx.amount;
      }
    }

    const unallocatedTxs = transactions.filter((tx) => tx.status === 'UNALLOCATED');
    const unallocatedCount = unallocatedTxs.length;
    const unallocatedAmount = unallocatedTxs.reduce((sum, tx) => sum + tx.amount, 0);

    const outstandingRent = Math.max(0, expectedRent - collectedRent);

    const pendingMaintenanceCount = maintenanceTickets.filter(
      (m) =>
        (!selectedPropertyId || m.propertyId === selectedPropertyId) &&
        (m.status === 'NEW' || m.status === 'AWAITING_APPROVAL')
    ).length;

    return {
      expectedRent,
      collectedRent,
      outstandingRent,
      occupancyRate,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      unallocatedCount,
      unallocatedAmount,
      pendingMaintenanceCount,
    };
  }, [units, tenants, transactions, maintenanceTickets, selectedPropertyId]);

  // Operations
  const addProperty = (newProp: Omit<Property, 'id'>) => {
    const id = 'prop-' + (properties.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
    const created = { ...newProp, id };
    setProperties((prev) => [created, ...prev]);
    addToast('SUCCESS', 'Property Added', `${created.name} successfully created.`);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addToast('SUCCESS', 'Property Updated', 'Property changes saved.');
  };

  const archiveProperty = (id: string) => {
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, archived: true } : p)));
    addToast('INFO', 'Property Archived', 'Property archived from active portfolio.');
  };

  const addUnit = (newUnit: Omit<Unit, 'id'>) => {
    const id = 'u-' + (units.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
    const created = { ...newUnit, id };
    setUnits((prev) => [...prev, created]);
    addToast('SUCCESS', 'Unit Added', `Unit ${created.unitNumber} added to property.`);
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    addToast('SUCCESS', 'Unit Updated', 'Unit details updated.');
  };

  const addTenant = (newTenant: Omit<Tenant, 'id'>, unitId?: string) => {
    const id = 'ten-' + (tenants.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
    const targetUnitId = unitId || newTenant.assignedUnitId;
    const created: Tenant = { ...newTenant, id, assignedUnitId: targetUnitId };
    setTenants((prev) => [created, ...prev]);

    if (targetUnitId) {
      setUnits((prev) =>
        prev.map((u) => (u.id === targetUnitId ? { ...u, status: 'OCCUPIED', currentTenantId: id } : u))
      );
    }
    addToast('SUCCESS', 'Tenant Registered', `${created.name} assigned to tenancy.`);
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    addToast('SUCCESS', 'Tenant Record Updated');
  };

  const recordPayment = (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber'>) => {
    const id = 'tx-' + Date.now();
    const receiptNumber = `KEJA-REC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
    const newTx: PaymentTransaction = {
      ...paymentData,
      id,
      receiptNumber,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add audit log
    const log: AgentAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
      action: 'PAYMENT_RECORDED',
      details: `Recorded ${newTx.channel} payment of KES ${newTx.amount.toLocaleString()} (Ref: ${newTx.referenceNumber}).`,
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('SUCCESS', 'Payment Recorded', `Receipt #${receiptNumber} generated.`);
    return newTx;
  };

  const reconcilePayment = (transactionId: string, tenantId: string, unitId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId);
    const unit = units.find((u) => u.id === unitId);
    const tx = transactions.find((t) => t.id === transactionId);

    if (!tx || !tenant || !unit) {
      addToast('ERROR', 'Reconciliation Failed', 'Required entity not found.');
      return;
    }

    const receiptNumber = tx.receiptNumber || `KEJA-REC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'RECONCILED',
              tenantId,
              unitId,
              propertyId: unit.propertyId,
              receiptNumber,
            }
          : t
      )
    );

    // Add audit log
    const log: AgentAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'AI_AGENT',
      action: 'PAYMENT_RECONCILED',
      details: `Reconciled ${tx.channel} payment of KES ${tx.amount.toLocaleString()} (Ref: ${tx.referenceNumber}) to ${tenant.name} (${unit.unitNumber}).`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    // Send automated WhatsApp receipt simulation
    const waMsg: WhatsAppMessage = {
      id: 'wa-' + Date.now(),
      tenantId: tenant.id,
      sender: 'AI_AGENT',
      message: `Jambo ${tenant.name}, your payment of KES ${tx.amount.toLocaleString()} (Ref: ${tx.referenceNumber}) has been matched and reconciled to Unit ${unit.unitNumber}. Receipt #${receiptNumber} issued.`,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      isSimulated: true,
    };
    setWhatsAppMessages((prev) => [...prev, waMsg]);

    addToast('SUCCESS', 'Payment Reconciled', `Matched KES ${tx.amount.toLocaleString()} to ${tenant.name}. Automated receipt generated.`);
  };

  const createMaintenanceTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => {
    const id = 'maint-' + (maintenanceTickets.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
    const requiresApproval = ticketData.estimatedCost > workspaceConfig.maintenanceApprovalThreshold;
    const initialStatus = requiresApproval ? 'AWAITING_APPROVAL' : ticketData.status || 'NEW';

    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id,
      status: initialStatus,
      reportedDate: new Date().toISOString(),
    };
    setMaintenanceTickets((prev) => [newTicket, ...prev]);

    const log: AgentAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: 'SYSTEM',
      action: 'TICKET_CREATED',
      details: `New maintenance ticket #${id} created: "${ticketData.title}". ${requiresApproval ? 'Awaiting Landlord approval (> KES 10,000 threshold).' : ''}`,
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('SUCCESS', 'Maintenance Ticket Created', `Ticket #${id} recorded.`);
  };

  const updateMaintenanceStatus = (id: string, status: MaintenanceTicket['status'], notes?: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              resolutionNotes: notes || m.resolutionNotes,
            }
          : m
      )
    );
    addToast('INFO', 'Maintenance Updated', `Ticket status changed to ${status}.`);
  };

  const approveMaintenanceTicket = (id: string): boolean => {
    const ticket = maintenanceTickets.find((m) => m.id === id);
    if (!ticket) return false;

    const safety = evaluateAgentActionSafety(
      'APPROVE_MAINTENANCE',
      currentUser.role,
      ticket.estimatedCost,
      workspaceConfig.maintenanceApprovalThreshold
    );

    if (!safety.allowed && safety.requiresLandlordApproval && currentUser.role !== 'LANDLORD') {
      addToast('WARNING', 'Approval Denied', safety.policyReason);
      return false;
    }

    setMaintenanceTickets((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'ASSIGNED',
              approvedBy: currentUser.name,
              approvedAt: new Date().toISOString(),
            }
          : m
      )
    );

    const log: AgentAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
      action: 'MAINTENANCE_APPROVED',
      details: `Authorized expenditure of KES ${ticket.estimatedCost.toLocaleString()} for ticket #${ticket.id} (${ticket.title}).`,
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('SUCCESS', 'Maintenance Approved', `Authorized KES ${ticket.estimatedCost.toLocaleString()} work order.`);
    return true;
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const id = 'exp-' + (expenses.length + 1) + '-' + Date.now().toString(36).substring(2, 5);
    const created: Expense = { ...expenseData, id };
    setExpenses((prev) => [created, ...prev]);
    addToast('SUCCESS', 'Expense Recorded', `Recorded KES ${created.amount.toLocaleString()} for ${created.description}`);
  };

  const approveAgentTask = (taskId: string): boolean => {
    const task = agentTasks.find((t) => t.id === taskId);
    if (!task) return false;

    // Verify role permissions
    if (task.safetyLevel === 'REQUIRES_APPROVAL' && currentUser.role === 'READ_ONLY') {
      addToast('ERROR', 'Permission Denied', 'Read-only users cannot authorize tasks.');
      return false;
    }

    // Execute task side-effects
    if (task.category === 'RECONCILIATION' || task.id === 'task-1') {
      // Reconcile the unallocated transactions
      reconcilePayment('tx-unalloc-1', 'ten-5', 'u-106');
      reconcilePayment('tx-unalloc-2', 'ten-11', 'u-301');
    } else if (task.category === 'RENT_COLLECTION' || task.id === 'task-2') {
      // Send simulated WhatsApp reminders
      sendWhatsAppMessage('ten-2', 'Jambo Brian, this is a friendly reminder that October rent of KES 48,500 for Unit A2 is due. Paybill 522522, Account A2. Asante.');
      sendWhatsAppMessage('ten-4', 'Jambo Kevin, this is a reminder for October rent balance of KES 48,500 for Unit A4. Paybill 522522, Account A4. Asante.');
      sendWhatsAppMessage('ten-10', 'Jambo Linda, friendly reminder for Sapphire Court Unit 2B rent balance of KES 59,000. Paybill 522522, Account 2B. Thank you.');
    }

    setAgentTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
              planSteps: t.planSteps.map((s) => ({ ...s, status: 'DONE' })),
              resultSummary: 'Executed safely with Landlord authorization.',
            }
          : t
      )
    );

    const log: AgentAuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: currentUser.role === 'LANDLORD' ? 'LANDLORD' : 'PROPERTY_MANAGER',
      action: 'TASK_APPROVED_AND_EXECUTED',
      details: `Approved task "${task.title}". Side effects completed successfully.`,
      taskId: task.id,
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('SUCCESS', 'Task Approved & Executed', `AI Agent completed "${task.title}".`);
    return true;
  };

  const rejectAgentTask = (taskId: string) => {
    setAgentTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'CANCELLED', resultSummary: 'Cancelled by operator.' } : t))
    );
    addToast('INFO', 'Task Cancelled', 'The task was cancelled with no side effects.');
  };

  const executeAgentTaskDirectly = (taskId: string) => {
    approveAgentTask(taskId);
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    addToast('INFO', 'Automation Rule Updated');
  };

  const sendWhatsAppMessage = (tenantId: string, text: string) => {
    const newMsg: WhatsAppMessage = {
      id: 'wa-' + Date.now() + Math.random().toString(36).substring(2, 4),
      tenantId,
      sender: 'LANDLORD',
      message: text,
      timestamp: new Date().toISOString(),
      status: 'DELIVERED',
      isSimulated: true,
    };
    setWhatsAppMessages((prev) => [...prev, newMsg]);
    addToast('SUCCESS', 'WhatsApp Sent (Simulated)', 'Message dispatched to tenant WhatsApp thread.');
  };

  const updateWorkspaceConfig = (updates: Partial<WorkspaceConfig>) => {
    setWorkspaceConfigState((prev) => ({ ...prev, ...updates }));
    addToast('SUCCESS', 'Settings Updated', 'Workspace configuration saved.');
  };

  // Assistant queries handling
  const sendAssistantMessage = (userText: string) => {
    const userMsg: AssistantChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'USER',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAssistantMessages((prev) => [...prev, userMsg]);

    // Intelligent local deterministic Agent response based on domain intent
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let responseText = '';
      let suggestedAction: AssistantChatMessage['suggestedAction'];

      if (lower.includes('unallocated') || lower.includes('m-pesa') || lower.includes('mpesa') || lower.includes('match')) {
        const unallocated = transactions.filter((t) => t.status === 'UNALLOCATED');
        if (unallocated.length > 0) {
          responseText = `I found ${unallocated.length} unallocated M-Pesa transaction(s) totaling KES ${unallocated.reduce((a, b) => a + b.amount, 0).toLocaleString()}. I have prepared a reconciliation task matching them to Unit B2 (Fatuma Mohammed) and Villa G1 (John Ngugi). Would you like to review and approve?`;
          suggestedAction = { label: 'Review in Agent Hub', screen: 'agent' };
        } else {
          responseText = 'All M-Pesa transactions are currently reconciled. No unallocated funds in the queue.';
          suggestedAction = { label: 'View Payments Ledger', screen: 'payments' };
        }
      } else if (lower.includes('attention') || lower.includes('summarize') || lower.includes('overview') || lower.includes('status')) {
        const overdueCount = tenants.filter((t) => getTenantBalance(t.id).status === 'OVERDUE' || getTenantBalance(t.id).status === 'PARTIAL').length;
        const pendingMaint = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL').length;
        responseText = `Portfolio Health Summary:\n• ${portfolioMetrics.occupancyRate}% Occupancy across ${portfolioMetrics.totalUnits} units\n• KES ${portfolioMetrics.collectedRent.toLocaleString()} collected of KES ${portfolioMetrics.expectedRent.toLocaleString()} expected (${Math.round((portfolioMetrics.collectedRent / (portfolioMetrics.expectedRent || 1)) * 100)}%)\n• ${overdueCount} tenants with pending balances\n• ${pendingMaint} high-priority maintenance ticket awaiting your approval (Water Booster Pump KES 28,500)`;
        suggestedAction = { label: 'Open Overview Dashboard', screen: 'overview' };
      } else if (lower.includes('reminder') || lower.includes('overdue') || lower.includes('rent')) {
        responseText = `I have drafted personalized WhatsApp reminders for 3 tenants with balances past the 5-day grace period. In accordance with safety policies, batch WhatsApp messages require your explicit review before dispatch.`;
        suggestedAction = { label: 'Approve WhatsApp Reminders', screen: 'agent' };
      } else if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('pump')) {
        const pendingMaint = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL');
        responseText = `There is 1 high-cost maintenance request requiring your authorization: "Water pump booster pressure failure" at Kilimani Heights (Estimate: KES 28,500). Certified contractor Pwani Hydraulics is on standby.`;
        suggestedAction = { label: 'Review Maintenance Ticket', screen: 'maintenance' };
      } else if (lower.includes('lease') || lower.includes('expire') || lower.includes('renewal')) {
        responseText = `Grace Njeri (Unit B3) has a lease expiring in 14 days (Oct 31, 2026), and Brian Otieno (Unit A2) expires in 29 days (Nov 15, 2026). Both qualify for standard 12-month extensions.`;
        suggestedAction = { label: 'View Tenant Directory', screen: 'tenants' };
      } else {
        responseText = `Understood. I can help you reconcile M-Pesa payments, audit overdue rent, draft tenant WhatsApp communications, approve fundi quotes, or export KRA tax-ready reports. Select one of the quick actions below:`;
        suggestedAction = { label: 'View All Pending Tasks', screen: 'agent' };
      }

      const agentMsg: AssistantChatMessage = {
        id: 'msg-agent-' + Date.now(),
        sender: 'AGENT',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setAssistantMessages((prev) => [...prev, agentMsg]);
    }, 400);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        units,
        tenants,
        transactions,
        maintenanceTickets,
        expenses,
        agentTasks,
        automationRules,
        auditLogs,
        whatsappMessages,
        workspaceConfig,
        currentScreen,
        setCurrentScreen,
        selectedPropertyId,
        setSelectedPropertyId,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        currentUser,
        isAuthLoaded,
        switchRole,
        signIn,
        signUp,
        signOut,
        resetDemoData,
        onboardingData,
        updateOnboardingData,
        completeOnboarding,
        isAssistantOpen,
        setIsAssistantOpen,
        assistantMessages,
        sendAssistantMessage,
        toasts,
        dismissToast,
        addToast,
        addProperty,
        updateProperty,
        archiveProperty,
        addUnit,
        updateUnit,
        addTenant,
        updateTenant,
        recordPayment,
        reconcilePayment,
        createMaintenanceTicket,
        updateMaintenanceStatus,
        approveMaintenanceTicket,
        addExpense,
        approveAgentTask,
        rejectAgentTask,
        executeAgentTaskDirectly,
        toggleAutomationRule,
        sendWhatsAppMessage,
        updateWorkspaceConfig,
        getTenantBalance,
        portfolioMetrics,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
