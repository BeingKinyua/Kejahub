import React, { useState, useEffect } from 'react';
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
import { GSAPEntrance } from '../animation/GSAPEntrance';
import { StatusBadge } from '../ui/StatusBadge';

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

  // Close active modal on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (manualModalOpen) {
        setManualModalOpen(false);
      } else if (receiptTx) {
        setReceiptTx(null);
      } else if (reconcileModalTx) {
        setReconcileModalTx(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [manualModalOpen, receiptTx, reconcileModalTx]);

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
    <GSAPEntrance className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
            Payments &amp; Reconciliation
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            M-Pesa statements, manual deposit records, ledger reconciliation, and receipts
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              type="button"
              onClick={() => setManualModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Record Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] block">Total Expected</span>
          <div className="text-lg font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1] mt-1">
            {formatKES(portfolioMetrics.expectedRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] block">Collected to Date</span>
          <div className="text-lg font-bold tabular-nums text-[#267256] dark:text-[#79C8A4] mt-1">
            {formatKES(portfolioMetrics.collectedRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] block">Outstanding Arrears</span>
          <div className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-400 mt-1">
            {formatKES(portfolioMetrics.outstandingRent)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] block">Unallocated M-Pesa</span>
          <div className="text-lg font-bold tabular-nums text-amber-700 dark:text-amber-400 mt-1">
            {portfolioMetrics.unallocatedCount} pending ({formatKES(portfolioMetrics.unallocatedAmount)})
          </div>
        </div>
      </div>

      {/* Unallocated Payments Action Callout */}
      {portfolioMetrics.unallocatedCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0" aria-hidden="true">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200 tabular-nums">
                {portfolioMetrics.unallocatedCount} Unallocated M-Pesa Payments Detected
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                Incoming funds received on Paybill 522522 with matched sender phone numbers ready for reconciliation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const unalloc = transactions.find((t) => t.status === 'UNALLOCATED');
              if (unalloc) handleOpenReconcile(unalloc);
            }}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Reconcile Now</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            aria-label="Search payments by M-Pesa ref, sender name, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by M-Pesa ref, sender name, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            aria-label="Filter payments by channel"
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          >
            <option value="ALL">All Channels</option>
            <option value="M-PESA">M-Pesa</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
          </select>

          <select
            aria-label="Filter payments by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="UNALLOCATED">Unallocated</option>
            <option value="RECONCILED">Reconciled</option>
          </select>
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      {filteredTxs.length === 0 ? (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] p-10 text-center">
          <Receipt className="w-8 h-8 mx-auto text-[#64736C] dark:text-[#9EB2A9] mb-2" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1]">
            No matching transactions found
          </h2>
          <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1">
            Adjust your reference search or channel/status filters.
          </p>
          {(searchTerm || channelFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setChannelFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#E2E8E5] dark:hover:bg-[#2D4039] cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#24312D] dark:text-[#EDF5F1]">
              <thead className="bg-[#F6F8F6] dark:bg-[#24332D] text-[11px] font-semibold tracking-wide text-[#64736C] dark:text-[#9EB2A9] border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <tr>
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3">Channel &amp; Ref</th>
                  <th className="px-4 py-3">Sender / Tenant</th>
                  <th className="px-4 py-3">Assigned Unit</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Receipt / Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
                {filteredTxs.map((tx) => {
                  const tenant = tenants.find((t) => t.id === tx.tenantId);
                  const unit = units.find((u) => u.id === tx.unitId);

                  return (
                    <tr key={tx.id} className="hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]/60 transition-colors">
                      <td className="px-4 py-3.5 text-[#64736C] dark:text-[#9EB2A9] font-medium tabular-nums">
                        {new Date(tx.date).toLocaleDateString()}{' '}
                        <span className="text-[11px] block">
                          {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-[#267256] dark:text-[#79C8A4] whitespace-nowrap">
                            {tx.channel}
                          </span>
                          <span aria-hidden="true" className="text-[#64736C] dark:text-[#9EB2A9]">·</span>
                          <span className="font-mono tabular-nums">{tx.referenceNumber}</span>
                        </div>
                        {tx.billRefNumber && (
                          <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] block mt-0.5">
                            Account Ref: <strong>{tx.billRefNumber}</strong>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                          {tx.senderName || tenant?.name || 'Unmatched Sender'}
                        </div>
                        {tx.senderPhone && (
                          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] font-mono tabular-nums">
                            +{tx.senderPhone}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {unit ? (
                          <span className="font-medium text-[#24312D] dark:text-[#EDF5F1]">
                            Unit {unit.unitNumber}
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">Unallocated</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">
                        {formatKES(tx.amount)}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge
                          label={tx.status}
                          variant={
                            tx.status === 'CONFIRMED'
                              ? 'success'
                              : tx.status === 'RECONCILED'
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        />
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2">
                        {tx.status === 'UNALLOCATED' ? (
                          <button
                            type="button"
                            onClick={() => handleOpenReconcile(tx)}
                            className="px-2.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap"
                          >
                            Match &amp; Reconcile
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setReceiptTx(tx)}
                            className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline cursor-pointer whitespace-nowrap"
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
      )}

      {/* Interactive Reconciliation Modal */}
      {reconcileModalTx && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setReconcileModalTx(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reconcile-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039]"
          >
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <h3 id="reconcile-modal-title" className="text-base font-bold text-[#24312D] dark:text-[#EDF5F1]">
                  Reconcile M-Pesa Transaction
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close reconciliation modal"
                onClick={() => setReconcileModalTx(null)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="my-4 p-4 bg-[#F6F8F6] dark:bg-[#24332D]/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Reference:</span>
                <span className="font-mono font-bold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">
                  {reconcileModalTx.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Amount Received:</span>
                <span className="font-bold tabular-nums text-[#267256] dark:text-[#79C8A4] text-sm">
                  {formatKES(reconcileModalTx.amount)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Sender Name:</span>
                <span className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">{reconcileModalTx.senderName || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Phone Number:</span>
                <span className="font-mono tabular-nums text-[#24312D] dark:text-[#EDF5F1]">+{reconcileModalTx.senderPhone}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Bill Ref / Account:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{reconcileModalTx.billRefNumber || 'None'}</span>
              </div>
            </div>

            {/* Match Selection */}
            <div className="space-y-3">
              <div>
                <label htmlFor="recon-tenant" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Match to Tenant:
                </label>
                <select
                  id="recon-tenant"
                  value={reconTenantId}
                  onChange={(e) => {
                    setReconTenantId(e.target.value);
                    const t = tenants.find((item) => item.id === e.target.value);
                    if (t) setReconUnitId(t.assignedUnitId);
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="recon-unit" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Apply Payment to Unit:
                </label>
                <select
                  id="recon-unit"
                  value={reconUnitId}
                  onChange={(e) => setReconUnitId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber} ({u.typeLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2E8E5] dark:border-[#2D4039] flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReconcileModalTx(null)}
                className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReconciliation}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Reconciliation &amp; Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptTx && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setReceiptTx(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039] relative"
          >
            <div className="flex justify-between items-start gap-2 border-b border-[#E2E8E5] dark:border-[#2D4039] pb-3">
              <div>
                <span className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4]">
                  Official Rent Receipt (Simulated)
                </span>
                <h3 id="receipt-modal-title" className="text-base font-extrabold tabular-nums text-[#24312D] dark:text-[#EDF5F1]">
                  {receiptTx.receiptNumber || 'KEJA-REC-2026-001'}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close receipt modal"
                onClick={() => setReceiptTx(null)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="my-4 p-4 border border-dashed border-[#E2E8E5] dark:border-[#2D4039] rounded-xl space-y-3 text-xs bg-[#F6F8F6]/60 dark:bg-[#111A17]/40">
              <div className="text-center pb-2 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                <div className="font-extrabold text-sm text-[#173C32] dark:text-[#79C8A4]">
                  KEJAHUB PROPERTY HOLDINGS
                </div>
                <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">
                  Automated Rent Collection Ledger
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Date Paid:</span>
                <span className="font-medium tabular-nums">{new Date(receiptTx.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Channel / Ref:</span>
                <span className="font-mono font-bold tabular-nums">{receiptTx.channel} • {receiptTx.referenceNumber}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Payer Name:</span>
                <span className="font-semibold">{receiptTx.senderName || 'Verified Tenant'}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-[#64736C] dark:text-[#9EB2A9]">Unit:</span>
                <span className="font-bold">
                  {units.find((u) => u.id === receiptTx.unitId)?.unitNumber || 'Allocated Unit'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2E8E5] dark:border-[#2D4039] flex justify-between items-center gap-2">
                <span className="font-bold text-xs">Amount Settled:</span>
                <span className="font-extrabold tabular-nums text-base text-[#267256] dark:text-[#79C8A4]">
                  {formatKES(receiptTx.amount)}
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-[#64736C] dark:text-[#9EB2A9]">
              Generated securely by Kejahub Sentinel • Prototype Demo Record
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 text-xs font-semibold border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl flex items-center gap-1.5 hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" /> Print / PDF
              </button>
              <button
                type="button"
                onClick={() => setReceiptTx(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Entry Modal */}
      {manualModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setManualModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="manual-payment-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039]"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 id="manual-payment-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Record Manual Payment
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setManualModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
              Enter cash, direct bank deposit, or external transaction details.
            </p>

            <form onSubmit={handleCreateManualPayment} className="space-y-4">
              <div>
                <label htmlFor="manual-tenant" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Tenant *
                </label>
                <select
                  id="manual-tenant"
                  required
                  value={selectedTenantId}
                  onChange={(e) => setSelectedTenantId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                >
                  <option value="">Select Tenant</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({units.find((u) => u.id === t.assignedUnitId)?.unitNumber || 'Unit'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="manual-amount" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Amount (KES) *
                  </label>
                  <input
                    id="manual-amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm tabular-nums bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  />
                </div>

                <div>
                  <label htmlFor="manual-channel" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Channel
                  </label>
                  <select
                    id="manual-channel"
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                  >
                    <option value="M-PESA">M-Pesa</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="manual-ref" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Reference Code *
                </label>
                <input
                  id="manual-ref"
                  type="text"
                  required
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono tabular-nums bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div>
                <label htmlFor="manual-notes" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Notes
                </label>
                <input
                  id="manual-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared via NCBA App"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E2E8E5] dark:border-[#2D4039]">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl cursor-pointer"
                >
                  Confirm &amp; Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GSAPEntrance>
  );
};
