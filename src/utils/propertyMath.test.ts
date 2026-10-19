import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTenantBalance,
  matchMpesaTransaction,
  evaluateAgentActionSafety,
  normalizePhoneNumber,
  formatKES,
} from './propertyMath';

test('normalizePhoneNumber handles various Kenyan phone formats', () => {
  assert.equal(normalizePhoneNumber('0712345678'), '254712345678');
  assert.equal(normalizePhoneNumber('+254 712 345 678'), '254712345678');
  assert.equal(normalizePhoneNumber('254712345678'), '254712345678');
});

test('calculateTenantBalance computes arrears, payments, and overdue days', () => {
  const charges = [{ amount: 35000 }, { amount: 2500 }]; // 37500 total
  const payments = [{ amount: 20000, status: 'CONFIRMED' }];

  // Reference date 10th of month with due date 5th -> 5 days overdue
  const refDate = new Date(2026, 9, 10);
  const result = calculateTenantBalance(charges, payments, 5, refDate);

  assert.equal(result.totalCharges, 37500);
  assert.equal(result.totalPayments, 20000);
  assert.equal(result.balance, 17500);
  assert.equal(result.status, 'PARTIAL');
  assert.equal(result.daysOverdue, 5);
});

test('calculateTenantBalance marks zero balance as PAID and negative as CREDIT', () => {
  const charges = [{ amount: 35000 }];
  const fullPayment = [{ amount: 35000, status: 'CONFIRMED' }];
  const overPayment = [{ amount: 40000, status: 'RECONCILED' }];

  const resPaid = calculateTenantBalance(charges, fullPayment);
  assert.equal(resPaid.balance, 0);
  assert.equal(resPaid.status, 'PAID');

  const resCredit = calculateTenantBalance(charges, overPayment);
  assert.equal(resCredit.balance, -5000);
  assert.equal(resCredit.status, 'CREDIT');
});

test('matchMpesaTransaction matches candidate by bill reference and phone number', () => {
  const candidates = [
    {
      tenantId: 't1',
      tenantName: 'Wanjiku Kamau',
      phone: '+254712345678',
      unitId: 'u1',
      unitNumber: 'B4',
      monthlyExpected: 42000,
    },
    {
      tenantId: 't2',
      tenantName: 'Brian Otieno',
      phone: '+254722998877',
      unitId: 'u2',
      unitNumber: 'A2',
      monthlyExpected: 30000,
    },
  ];

  // Transaction with unit ref "B4" and phone match
  const match1 = matchMpesaTransaction(
    {
      senderPhone: '0712345678',
      senderName: 'WANJIKU K',
      billRefNumber: 'B4',
      amount: 42000,
    },
    candidates
  );

  assert.equal(match1.confidence, 'HIGH');
  assert.equal(match1.candidate?.tenantId, 't1');
  assert.ok(match1.score >= 60);

  // Transaction with no match
  const matchNone = matchMpesaTransaction(
    {
      senderPhone: '0799000000',
      billRefNumber: 'UNKNOWN',
      amount: 15000,
    },
    candidates
  );
  assert.equal(matchNone.confidence, 'NONE');
  assert.equal(matchNone.candidate, null);
});

test('evaluateAgentActionSafety enforces role gates and approvals', () => {
  // Read-only role cannot execute operations
  const readOnlyCheck = evaluateAgentActionSafety('RECONCILE_PAYMENT', 'READ_ONLY');
  assert.equal(readOnlyCheck.allowed, false);

  // Batch messaging requires approval
  const batchCheck = evaluateAgentActionSafety('SEND_BATCH_WHATSAPP', 'LANDLORD', 14);
  assert.equal(batchCheck.requiresLandlordApproval, true);

  // Rent waiver requires explicit approval
  const waiveCheck = evaluateAgentActionSafety('WAIVE_RENT', 'LANDLORD', 5000);
  assert.equal(waiveCheck.requiresLandlordApproval, true);

  // Maintenance over 10k threshold by Property Manager requires Landlord approval
  const maintCheck = evaluateAgentActionSafety('APPROVE_MAINTENANCE', 'PROPERTY_MANAGER', 25000, 10000);
  assert.equal(maintCheck.allowed, false);
  assert.equal(maintCheck.requiresLandlordApproval, true);

  // Minor maintenance can proceed
  const minorMaint = evaluateAgentActionSafety('APPROVE_MAINTENANCE', 'PROPERTY_MANAGER', 4500, 10000);
  assert.equal(minorMaint.allowed, true);
  assert.equal(minorMaint.requiresLandlordApproval, false);
});

test('formatKES formats Kenyan Shillings cleanly', () => {
  const formatted = formatKES(45000);
  assert.ok(formatted.includes('45,000') || formatted.includes('45'));
});
