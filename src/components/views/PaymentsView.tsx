import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { PaymentTransaction, PaymentChannel } from '../../types';
import {
  Receipt,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CreditCard,
  Building,
  User,
  X,
  Printer,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const PaymentsView: React.FC = () => {
  const {
    transactions,
    tenants,
    units,
    properties,
    portfolioMetrics,
    recordPayment,
    reconcilePayment,
    currentUser,
    addToast,
  } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'M-PESA' | 'BANK_TRANSFER' | 'CASH'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'UNALLOCATED' | 'RECONCILED'>('ALL');

  // Manual payment modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [amount, setAmount] = useState<number>(45000);
  const [channel, setChannel] = useState<PaymentChannel>('M-PESA');
  const [refNumber, setRefNumber] = useState('QHK' + Math.floor(100000 + Math.random() * 900000));
  const [notes, setNotes] = useState('');

  // Reconciliation modal
  const [reconcileModalTx, setReconcileModalTx] = useState<PaymentTransaction | null>(null);
  const [reconTenantId, setReconTenantId] = useState('');
  const [reconUnitId, setReconUnitId] = useState('');

  // Receipt preview modal
  const [receiptTx, setReceiptTx] = useState<PaymentTransaction | null>(null);

  // Filtered transactions
  const filteredTxs = transactions.filter((tx) => {
    const matchesSearch =
      tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.senderName && tx.senderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.senderPhone && tx.senderPhone.includes(searchTerm));

    if (!matchesSearch) return false;
    if (channelFilter !== 'ALL' && tx.channel !== channelFilter) return false;
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;
    return true;
  });

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId || !amount || !refNumber) {
      addToast('ERROR', 'Missing Fields', 'Tenant, amount, and reference number required.');
      return;
    }

    const tenant = tenants.find((t) => t.id === selectedTenantId);
    if (!tenant) return;

    recordPayment({
      date: new Date().toISOString(),
      amount: Number(amount),
      channel,
      referenceNumber: refNumber,
      status: 'CONFIRMED',
      tenantId: tenant.id,
      unitId: tenant.assignedUnitId,
      propertyId: tenant.assignedPropertyId,
      senderName: tenant.name,
      senderPhone: tenant.phone,
      notes,
    });

    setManualModalOpen(false);
    setSelectedTenantId('');
    setNotes('');
  };

  const handleOpenReconcile = (tx: PaymentTransaction) => {
    setReconcileModalTx(tx);
    // Auto-suggest best candidate
    if (tx.senderPhone?.includes('722114433') || tx.billRefNumber === 'B2') {
      setReconTenantId('ten-5'); // Fatuma Mohammed
      setReconUnitId('u-106'); // B2
    } else if (tx.senderPhone?.includes('718552299') || tx.billRefNumber?.includes('G1')) {
      setReconTenantId('ten-11'); // John Ngugi
      setReconUnitId('u-301'); // Villa G1
    } else {
      setReconTenantId(tenants[0]?.id || '');
      setReconUnitId(tenants[0]?.assignedUnitId || '');
    }
  };

  const handleConfirmReconciliation = () => {
    if (!reconcileModalTx || !reconTenantId || !reconUnitId) return;
    reconcilePayment(reconcileModalTx.id, reconTenantId, reconUnitId);
    setReconcileModalTx(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Payments & Reconciliation
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            M-Pesa statements, manual deposit records, ledger reconciliation, and receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              onClick={() => setManualModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Total Expected</span>
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
            {formatKES(portfolioMetrics.expectedRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Collected to Date</span>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatKES(portfolioMetrics.collectedRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Outstanding Arrears</span>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
            {formatKES(portfolioMetrics.outstandingRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 block">Unallocated M-Pesa</span>
          <div className="text-lg font-bold text-amber-500 mt-1">
            {portfolioMetrics.unallocatedCount} tx ({formatKES(portfolioMetrics.unallocatedAmount)})
          </div>
        </div>
      </div>

      {/* Unallocated Payments Action Callout */}
      {portfolioMetrics.unallocatedCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                {portfolioMetrics.unallocatedCount} Unallocated M-Pesa Payments Detected
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Incoming funds received on Paybill 522522 with matched sender phone numbers ready for reconciliation.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const unalloc = transactions.find((t) => t.status === 'UNALLOCATED');
              if (unalloc) handleOpenReconcile(unalloc);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Reconcile Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by M-Pesa ref, sender name, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Channels</option>
            <option value="M-PESA">M-Pesa</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="UNALLOCATED">Unallocated</option>
            <option value="RECONCILED">Reconciled</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Channel & Ref</th>
                <th className="px-4 py-3">Sender / Tenant</th>
                <th className="px-4 py-3">Assigned Unit</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTxs.map((tx) => {
                const tenant = tenants.find((t) => t.id === tx.tenantId);
                const unit = units.find((u) => u.id === tx.unitId);

                return (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-500 font-medium">
                      {new Date(tx.date).toLocaleDateString()}{' '}
                      <span className="text-[10px] text-gray-400 block">
                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                          {tx.channel}
                        </span>
                        <span className="font-mono">{tx.referenceNumber}</span>
                      </div>
                      {tx.billRefNumber && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Account Ref: <strong>{tx.billRefNumber}</strong>
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {tx.senderName || tenant?.name || 'Unmatched Sender'}
                      </div>
                      {tx.senderPhone && (
                        <div className="text-[10px] text-gray-400 font-mono">
                          +{tx.senderPhone}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      {unit ? (
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Unit {unit.unitNumber}
                        </span>
                      ) : (
                        <span className="text-amber-500 font-semibold">Unallocated</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-gray-100">
                      {formatKES(tx.amount)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          tx.status === 'CONFIRMED'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : tx.status === 'RECONCILED'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-2">
                      {tx.status === 'UNALLOCATED' ? (
                        <button
                          onClick={() => handleOpenReconcile(tx)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Match & Reconcile
                        </button>
                      ) : (
                        <button
                          onClick={() => setReceiptTx(tx)}
                          className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Reconciliation Modal */}
      {reconcileModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Reconcile M-Pesa Transaction
                </h3>
              </div>
              <button
                onClick={() => setReconcileModalTx(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Reference:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                  {reconcileModalTx.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Received:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatKES(reconcileModalTx.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sender Name:</span>
                <span className="font-semibold">{reconcileModalTx.senderName || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone Number:</span>
                <span className="font-mono">+{reconcileModalTx.senderPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bill Ref / Account:</span>
                <span className="font-bold text-amber-600">{reconcileModalTx.billRefNumber || 'None'}</span>
              </div>
            </div>

            {/* Match Selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Match to Tenant:
                </label>
                <select
                  value={reconTenantId}
                  onChange={(e) => {
                    setReconTenantId(e.target.value);
                    const t = tenants.find((item) => item.id === e.target.value);
                    if (t) setReconUnitId(t.assignedUnitId);
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Apply Payment to Unit:
                </label>
                <select
                  value={reconUnitId}
                  onChange={(e) => setReconUnitId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber} ({u.typeLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReconcileModalTx(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReconciliation}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl shadow-xs"
              >
                Confirm Reconciliation & Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptTx && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F8A68]">
                  Official Rent Receipt (Simulated)
                </span>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-100">
                  {receiptTx.receiptNumber || 'KEJA-REC-2026-001'}
                </h3>
              </div>
              <button
                onClick={() => setReceiptTx(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl space-y-3 text-xs bg-gray-50/50 dark:bg-gray-900/30">
              <div className="text-center pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="font-extrabold text-sm text-[#173C32] dark:text-[#79C8A4]">
                  KEJAHUB PROPERTY HOLDINGS
                </div>
                <div className="text-[10px] text-gray-400">
                  Automated Rent Collection Ledger
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date Paid:</span>
                <span className="font-medium">{new Date(receiptTx.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Channel / Ref:</span>
                <span className="font-mono font-bold">{receiptTx.channel} • {receiptTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payer Name:</span>
                <span className="font-semibold">{receiptTx.senderName || 'Verified Tenant'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unit:</span>
                <span className="font-bold">
                  {units.find((u) => u.id === receiptTx.unitId)?.unitNumber || 'Allocated Unit'}
                </span>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-xs">Amount Settled:</span>
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  {formatKES(receiptTx.amount)}
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-gray-400">
              Generated securely by Kejahub Sentinel • Prototype Demo Record
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-xl flex items-center gap-1.5 hover:bg-gray-100"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF
              </button>
              <button
                onClick={() => setReceiptTx(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-[#173C32] text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Entry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Record Manual Payment
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Enter cash, direct bank deposit, or external transaction details.
            </p>

            <form onSubmit={handleCreateManualPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tenant *
                </label>
                <select
                  required
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({units.find((u) => u.id === t.assignedUnitId)?.unitNumber || 'Unit'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Amount (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  >
                    <option value="M-PESA">M-Pesa</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Reference Code *
                </label>
                <input
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared via NCBA App"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Confirm & Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
