import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  Building,
  Sparkles,
  ArrowRight,
  Clock,
  Wrench,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const OverviewView: React.FC = () => {
  const {
    workspaceConfig,
    portfolioMetrics,
    transactions,
    tenants,
    maintenanceTickets,
    agentTasks,
    setCurrentScreen,
    setIsAssistantOpen,
    approveAgentTask,
    approveMaintenanceTicket,
    getTenantBalance,
    currentUser,
  } = useProperty();

  // Find overdue tenants
  const overdueTenants = tenants
    .map((t) => ({ tenant: t, balanceInfo: getTenantBalance(t.id) }))
    .filter((item) => item.balanceInfo.status === 'OVERDUE' || item.balanceInfo.status === 'PARTIAL');

  // Find unallocated transactions
  const unallocatedTxs = transactions.filter((t) => t.status === 'UNALLOCATED');

  // Maintenance awaiting approval
  const pendingApprovals = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL');

  // Expiring leases
  const expiringTenants = tenants.filter((t) => t.leaseStatus === 'EXPIRING_SOON');

  // Collection progress percentage
  const collectionPct = portfolioMetrics.expectedRent > 0
    ? Math.min(100, Math.round((portfolioMetrics.collectedRent / portfolioMetrics.expectedRent) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Greeting and Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Habari, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
            Portfolio operations for {workspaceConfig.workspaceName} • October 2026 cycle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 dark:text-[#111A17]" />
            <span>Ask the Agent</span>
          </button>
        </div>
      </div>

      {/* 4 Core KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Expected Rent */}
        <div
          onClick={() => setCurrentScreen('payments')}
          className="bg-white dark:bg-[#1B2622] p-4 sm:p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs cursor-pointer hover:border-[#2F8A68] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Expected Rent</span>
            <span className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {formatKES(portfolioMetrics.expectedRent)}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Across {portfolioMetrics.totalUnits} registered units
          </div>
        </div>

        {/* KPI 2: Collected Rent */}
        <div
          onClick={() => setCurrentScreen('payments')}
          className="bg-white dark:bg-[#1B2622] p-4 sm:p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs cursor-pointer hover:border-[#2F8A68] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Collected Rent</span>
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatKES(portfolioMetrics.collectedRent)}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-500 mt-1 font-medium">
            {collectionPct}% of target received
          </div>
        </div>

        {/* KPI 3: Outstanding Rent */}
        <div
          onClick={() => setCurrentScreen('tenants')}
          className="bg-white dark:bg-[#1B2622] p-4 sm:p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs cursor-pointer hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Outstanding Rent</span>
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {formatKES(portfolioMetrics.outstandingRent)}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-500 mt-1 font-medium">
            {overdueTenants.length} tenants with balances
          </div>
        </div>

        {/* KPI 4: Occupancy Rate */}
        <div
          onClick={() => setCurrentScreen('properties')}
          className="bg-white dark:bg-[#1B2622] p-4 sm:p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs cursor-pointer hover:border-[#2F8A68] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Occupancy Rate</span>
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Building className="w-4 h-4" />
            </span>
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {portfolioMetrics.occupancyRate}%
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {portfolioMetrics.occupiedUnits} occupied • {portfolioMetrics.vacantUnits} vacant
          </div>
        </div>
      </div>

      {/* Collection Progress Bar */}
      <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-gray-700 dark:text-gray-300">
            Monthly Rent Collection Progress (Due 5th • Grace Period ended 10th)
          </span>
          <span className="text-[#2F8A68] dark:text-[#79C8A4] font-bold">
            {collectionPct}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#2F8A68] dark:bg-[#79C8A4] h-full rounded-full transition-all duration-500"
            style={{ width: `${collectionPct}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-gray-400 mt-2">
          <span>Collected: {formatKES(portfolioMetrics.collectedRent)}</span>
          <span>Target: {formatKES(portfolioMetrics.expectedRent)}</span>
        </div>
      </div>

      {/* ACTIONABLE ATTENTION QUEUE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>Actionable Attention Queue</span>
            <span className="text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
              {unallocatedTxs.length + pendingApprovals.length + overdueTenants.length} Items
            </span>
          </h2>
          <span className="text-xs text-gray-400">Direct operational actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Item 1: Unallocated Payments */}
          {unallocatedTxs.length > 0 && (
            <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border-l-4 border-l-amber-500 border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5" /> M-Pesa Unallocated
                  </span>
                  <span className="text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {unallocatedTxs.length} Pending
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {formatKES(portfolioMetrics.unallocatedAmount)} in Unmatched Funds
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Incoming payments from Fatuma Mohammed & John Ngugi waiting to match ledgers.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentScreen('payments')}
                  className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
                >
                  <span>Reconcile Transactions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Item 2: Maintenance Signoff */}
          {pendingApprovals.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border-l-4 border-l-red-500 border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" /> High-Cost Repair Signoff
                  </span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    {formatKES(m.estimatedCost)}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                  {m.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => approveMaintenanceTicket(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173C32] hover:bg-[#245245] text-white dark:bg-[#79C8A4] dark:text-[#111A17] transition-colors"
                >
                  Authorize Work Order
                </button>
                <button
                  onClick={() => setCurrentScreen('maintenance')}
                  className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Details
                </button>
              </div>
            </div>
          ))}

          {/* Item 3: Rent Arrears Past Grace Period */}
          {overdueTenants.length > 0 && (
            <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border-l-4 border-l-emerald-600 border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Rent Arrears Batch
                  </span>
                  <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {overdueTenants.length} Tenants
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Grace Period Expired (Oct 10)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Agent prepared polite WhatsApp reminders for Brian, Kevin, and Linda.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentScreen('agent')}
                  className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
                >
                  <span>Review & Approve Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Item 4: Expiring Leases */}
          {expiringTenants.length > 0 && (
            <div className="bg-white dark:bg-[#1B2622] p-4 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Lease Expirations (Q4)
                  </span>
                  <span className="text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    {expiringTenants.length} Leases
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Renewal Preparation
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Grace Njeri (Oct 31) and Brian Otieno (Nov 15) reach lease conclusion.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <button
                  onClick={() => setCurrentScreen('tenants')}
                  className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
                >
                  <span>Prepare Renewal Notices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Columns: Recent Confirmed Payments + Agent Sentinel Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Confirmed Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Recent Payment Ledger
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest confirmed M-Pesa & bank deposits
              </p>
            </div>
            <button
              onClick={() => setCurrentScreen('payments')}
              className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] ${
                      tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {tx.channel === 'M-PESA' ? 'M' : 'B'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {tx.senderName || 'Anonymous Deposit'}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Ref: <span className="font-mono text-gray-600 dark:text-gray-300">{tx.referenceNumber}</span> • {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {formatKES(tx.amount)}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Agent Sentinel Recommendations */}
        <div className="bg-gradient-to-br from-[#173C32]/5 to-[#2F8A68]/10 dark:from-[#173C32]/30 dark:to-[#2F8A68]/20 p-5 rounded-2xl border border-emerald-500/20 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#173C32] dark:text-[#79C8A4] mb-3">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Agent Recommendations</span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/80 dark:bg-[#1B2622]/80 p-3 rounded-xl border border-emerald-500/10 text-xs">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  M-Pesa Match Ready
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  2 unallocated transactions have 85%+ correlation with active leases. Reconciling will clear KES 83,000 in arrears.
                </p>
                <button
                  onClick={() => approveAgentTask('task-1')}
                  className="mt-2 text-xs font-bold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
                >
                  Approve Reconciliation Task →
                </button>
              </div>

              <div className="bg-white/80 dark:bg-[#1B2622]/80 p-3 rounded-xl border border-emerald-500/10 text-xs">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Water Token Consumption Spike
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                  Kilimani Heights water meter sub-reading shows higher baseline usage. Correlates with Unit A4 dripping valve.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Autonomous Sentinel</span>
            <button
              onClick={() => setCurrentScreen('agent')}
              className="font-bold text-[#173C32] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
            >
              Open Agent Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
