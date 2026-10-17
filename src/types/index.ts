export type UserRole = 'LANDLORD' | 'PROPERTY_MANAGER' | 'FINANCE' | 'MAINTENANCE' | 'READ_ONLY';

export type ScreenId =
  | 'overview'
  | 'properties'
  | 'tenants'
  | 'payments'
  | 'maintenance'
  | 'expenses'
  | 'reports'
  | 'agent'
  | 'settings'
  | 'onboarding';

export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  type: 'APARTMENT' | 'MAISONETTE' | 'COMMERCIAL' | 'MIXED_USE';
  totalUnits: number;
  description?: string;
  caretakerName?: string;
  caretakerPhone?: string;
  archived?: boolean;
}

export type OccupancyStatus = 'OCCUPIED' | 'VACANT' | 'MAINTENANCE';

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string; // e.g. "A1", "Penthouse 2"
  bedrooms: number; // 0 for bedsitter/studio, 1, 2, 3, etc.
  typeLabel: string; // "1 Bedroom", "2BR Master Ensuite", "Studio"
  monthlyRent: number; // in KES
  serviceCharge: number; // in KES
  waterDepositOrFixed?: number;
  status: OccupancyStatus;
  currentTenantId?: string;
  notes?: string;
}

export type LeaseStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'MONTH_TO_MONTH' | 'TERMINATED';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string; // e.g. "+254 712 345 678"
  nationalIdOrPassport: string;
  assignedPropertyId: string;
  assignedUnitId: string;
  leaseStart: string;
  leaseEnd: string;
  leaseStatus: LeaseStatus;
  depositAmount: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export type PaymentChannel = 'M-PESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE';
export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'UNALLOCATED' | 'RECONCILED' | 'FAILED' | 'REVERSED';

export interface PaymentTransaction {
  id: string;
  date: string; // ISO string e.g. "2026-10-15T09:30:00Z"
  amount: number;
  channel: PaymentChannel;
  referenceNumber: string; // e.g. "QHK8291X0"
  status: PaymentStatus;
  tenantId?: string;
  propertyId?: string;
  unitId?: string;
  senderPhone?: string;
  senderName?: string;
  billRefNumber?: string;
  notes?: string;
  receiptNumber?: string;
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type TicketStatus = 'NEW' | 'TRIAGED' | 'AWAITING_APPROVAL' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  unitId?: string;
  tenantId?: string;
  priority: TicketPriority;
  status: TicketStatus;
  reportedDate: string;
  estimatedCost: number; // in KES
  assigneeName?: string;
  assigneeRole?: string; // e.g. "Licensed Electrician", "Fundi Plumber"
  assigneePhone?: string;
  approvedBy?: string;
  approvedAt?: string;
  resolutionNotes?: string;
  whatsappSimulatedMessage?: string;
}

export type ExpenseCategory =
  | 'REPAIRS'
  | 'SECURITY_CARETAKER'
  | 'GARBAGE_COLLECTION'
  | 'NAIROBI_WATER'
  | 'KPLC_ELECTRICITY'
  | 'COUNTY_RATES'
  | 'INTERNET_WIFI'
  | 'INSURANCE';

export interface Expense {
  id: string;
  propertyId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  vendor: string;
  receiptStatus: 'ATTACHED' | 'PENDING' | 'NOT_APPLICABLE';
  status: 'RECORDED' | 'APPROVED';
}

export type AgentTaskStatus =
  | 'PROPOSED'
  | 'NEEDS_INFO'
  | 'AWAITING_APPROVAL'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface AgentTaskPlanStep {
  step: string;
  status: 'PENDING' | 'DONE' | 'FAILED';
}

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  requestedOutcome: string;
  category: 'RENT_COLLECTION' | 'RECONCILIATION' | 'MAINTENANCE' | 'REPORTING' | 'LEASE_AUDIT' | 'CUSTOM';
  status: AgentTaskStatus;
  safetyLevel: 'AUTONOMOUS' | 'REQUIRES_APPROVAL';
  requiredRole: UserRole;
  affectedEntities: {
    propertyIds?: string[];
    tenantIds?: string[];
    unitIds?: string[];
    transactionIds?: string[];
  };
  planSteps: AgentTaskPlanStep[];
  resultSummary?: string;
  proposedChangesSummary?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  triggerEvent: string;
  actionSummary: string;
  enabled: boolean;
  requiresLandlordApproval: boolean;
}

export interface AgentAuditLog {
  id: string;
  timestamp: string;
  actor: 'AI_AGENT' | 'LANDLORD' | 'PROPERTY_MANAGER' | 'SYSTEM';
  action: string;
  details: string;
  taskId?: string;
}

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  sender: 'LANDLORD' | 'AI_AGENT' | 'TENANT';
  message: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'PENDING_APPROVAL';
  isSimulated: boolean;
}

export interface WorkspaceConfig {
  landlordName: string;
  workspaceName: string;
  currency: string; // "KES"
  country: string; // "Kenya"
  dateFormat: string; // "DD/MM/YYYY"
  rentDueDay: number; // e.g. 5
  gracePeriodDays: number; // e.g. 5
  lateFeePercentage: number; // e.g. 5
  maintenanceApprovalThreshold: number; // e.g. 10000 KES
  onboardingCompleted: boolean;
  mpesaPaybillNumber?: string;
  mpesaAccountRefFormat?: string; // "Unit Number"
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isAuthenticated: boolean;
}
