/**
 * Pure domain logic for Kejahub Property AI Agent
 * Decoupled from UI for testing and portability.
 */

export type ArrearsStatus = 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CREDIT';

export interface LedgerItem {
  id: string;
  type: 'RENT' | 'SERVICE_CHARGE' | 'WATER' | 'GARBAGE' | 'PAYMENT';
  amount: number; // positive for charges, positive for payments in their respective fields
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'RECONCILED' | 'REVERSED';
}

export interface TenantBalanceResult {
  totalCharges: number;
  totalPayments: number;
  balance: number; // positive = owes money, negative = overpaid/credit
  status: ArrearsStatus;
  daysOverdue: number;
}

export function calculateTenantBalance(
  charges: { amount: number }[],
  payments: { amount: number; status: string }[],
  dueDateDay: number = 5,
  referenceDate: Date = new Date()
): TenantBalanceResult {
  const totalCharges = charges.reduce((acc, c) => acc + (c.amount || 0), 0);
  const totalPayments = payments
    .filter((p) => p.status === 'CONFIRMED' || p.status === 'RECONCILED')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const balance = totalCharges - totalPayments;
  const currentDay = referenceDate.getDate();

  let daysOverdue = 0;
  if (balance > 0 && currentDay > dueDateDay) {
    daysOverdue = currentDay - dueDateDay;
  }

  let status: ArrearsStatus = 'PAID';
  if (balance > 0) {
    status = totalPayments > 0 ? 'PARTIAL' : 'OVERDUE';
  } else if (balance < 0) {
    status = 'CREDIT';
  }

  return {
    totalCharges,
    totalPayments,
    balance,
    status,
    daysOverdue,
  };
}

export interface CandidateTarget {
  tenantId: string;
  tenantName: string;
  phone: string;
  unitId: string;
  unitNumber: string;
  monthlyExpected: number;
}

export interface MpesaMatchResult {
  candidate: CandidateTarget | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  matchReason: string;
  score: number;
}

export function normalizePhoneNumber(phone: string): string {
  // Normalize Kenyan phone numbers e.g. 0712345678 -> 254712345678, +254 712 345 678 -> 254712345678
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '254' + digits.substring(1);
  }
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  return digits;
}

export function matchMpesaTransaction(
  tx: {
    senderPhone: string;
    senderName?: string;
    billRefNumber?: string;
    amount: number;
  },
  candidates: CandidateTarget[]
): MpesaMatchResult {
  if (!candidates || candidates.length === 0) {
    return {
      candidate: null,
      confidence: 'NONE',
      matchReason: 'No candidates available',
      score: 0,
    };
  }

  const normalizedTxPhone = normalizePhoneNumber(tx.senderPhone || '');
  const cleanRef = (tx.billRefNumber || '').trim().toUpperCase();

  let bestCandidate: CandidateTarget | null = null;
  let highestScore = 0;
  let reason = '';

  for (const cand of candidates) {
    let score = 0;
    const candPhone = normalizePhoneNumber(cand.phone);
    const candUnit = cand.unitNumber.trim().toUpperCase();

    // 1. Account / Bill Reference match (e.g. Tenant typed "A4" or "UNIT A4")
    if (cleanRef && (cleanRef === candUnit || cleanRef.includes(candUnit))) {
      score += 50;
    }

    // 2. Exact or partial phone number match
    if (normalizedTxPhone && candPhone && (normalizedTxPhone === candPhone || normalizedTxPhone.endsWith(candPhone.slice(-9)))) {
      score += 40;
    }

    // 3. Exact expected rent amount match
    if (tx.amount > 0 && cand.monthlyExpected > 0 && Math.abs(tx.amount - cand.monthlyExpected) < 1) {
      score += 20;
    }

    // 4. Name similarity (first or last name matches)
    if (tx.senderName && cand.tenantName) {
      const txParts = tx.senderName.toUpperCase().split(/\s+/);
      const candParts = cand.tenantName.toUpperCase().split(/\s+/);
      const sharesName = txParts.some((p) => p.length > 2 && candParts.includes(p));
      if (sharesName) {
        score += 15;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestCandidate = cand;
      const reasons: string[] = [];
      if (cleanRef && (cleanRef === candUnit || cleanRef.includes(candUnit))) reasons.push(`Unit ref '${cleanRef}' matched`);
      if (normalizedTxPhone && candPhone && normalizedTxPhone.endsWith(candPhone.slice(-9))) reasons.push('Sender phone matched tenant');
      if (Math.abs(tx.amount - cand.monthlyExpected) < 1) reasons.push('Amount equals monthly expected rent');
      reason = reasons.join(', ');
    }
  }

  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
  if (highestScore >= 60) {
    confidence = 'HIGH';
  } else if (highestScore >= 40) {
    confidence = 'MEDIUM';
  } else if (highestScore >= 20) {
    confidence = 'LOW';
  }

  return {
    candidate: highestScore >= 20 ? bestCandidate : null,
    confidence,
    matchReason: reason || 'Low correlation with known tenant units or numbers',
    score: highestScore,
  };
}

export type UserRole = 'LANDLORD' | 'PROPERTY_MANAGER' | 'FINANCE' | 'MAINTENANCE' | 'READ_ONLY';

export interface ActionPermissionCheck {
  allowed: boolean;
  requiresLandlordApproval: boolean;
  policyReason: string;
}

export function evaluateAgentActionSafety(
  actionType:
    | 'DRAFT_SUMMARY'
    | 'SEND_SINGLE_WHATSAPP'
    | 'SEND_BATCH_WHATSAPP'
    | 'RECONCILE_PAYMENT'
    | 'WAIVE_RENT'
    | 'AMEND_LEASE'
    | 'APPROVE_MAINTENANCE'
    | 'CLASSIFY_EXPENSE',
  userRole: UserRole,
  costOrCount: number = 0,
  maintenanceCostThreshold: number = 10000
): ActionPermissionCheck {
  // Read-only cannot perform any mutating or communicating actions
  if (userRole === 'READ_ONLY') {
    if (actionType === 'DRAFT_SUMMARY' || actionType === 'CLASSIFY_EXPENSE') {
      return { allowed: true, requiresLandlordApproval: false, policyReason: 'Informational analysis is permitted' };
    }
    return { allowed: false, requiresLandlordApproval: true, policyReason: 'Read-only role cannot execute operations' };
  }

  // Maintenance staff only deals with maintenance triage and draft
  if (userRole === 'MAINTENANCE') {
    if (actionType === 'APPROVE_MAINTENANCE') {
      if (costOrCount > maintenanceCostThreshold) {
        return {
          allowed: false,
          requiresLandlordApproval: true,
          policyReason: `Estimates exceeding KES ${maintenanceCostThreshold.toLocaleString()} require Landlord approval`,
        };
      }
      return { allowed: true, requiresLandlordApproval: false, policyReason: 'Within minor maintenance threshold' };
    }
    if (actionType === 'DRAFT_SUMMARY') {
      return { allowed: true, requiresLandlordApproval: false, policyReason: 'Summary preview allowed' };
    }
    return { allowed: false, requiresLandlordApproval: true, policyReason: 'Maintenance role restricted to repair tickets' };
  }

  // Financial actions
  if (actionType === 'WAIVE_RENT' || actionType === 'AMEND_LEASE') {
    // Only Landlord can waive rent or amend lease terms
    if (userRole === 'LANDLORD') {
      return {
        allowed: true,
        requiresLandlordApproval: true,
        policyReason: 'High-impact legal/financial action requires explicit landlord sign-off',
      };
    }
    return {
      allowed: false,
      requiresLandlordApproval: true,
      policyReason: 'Only Landlord can authorize rent waivers or lease modifications',
    };
  }

  // Batch communication
  if (actionType === 'SEND_BATCH_WHATSAPP') {
    return {
      allowed: true,
      requiresLandlordApproval: true,
      policyReason: `Batch messaging (${costOrCount} recipients) requires human approval before broadcast`,
    };
  }

  // Maintenance approval above threshold
  if (actionType === 'APPROVE_MAINTENANCE') {
    if (costOrCount > maintenanceCostThreshold && userRole !== 'LANDLORD') {
      return {
        allowed: false,
        requiresLandlordApproval: true,
        policyReason: `High-value maintenance (KES ${costOrCount.toLocaleString()}) requires Landlord sign-off`,
      };
    }
    return { allowed: true, requiresLandlordApproval: false, policyReason: 'Approved within budget limit' };
  }

  return {
    allowed: true,
    requiresLandlordApproval: false,
    policyReason: 'Autonomous execution authorized under safety policy',
  };
}

export function formatKES(amount: number): string {
  const rounded = Math.round(amount || 0);
  return `KES ${rounded.toLocaleString('en-KE')}`;
}
