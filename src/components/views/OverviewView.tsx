'use client';

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
  ChevronRight,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';
import { BentoCard } from '../ui/BentoCard';
import { StatusBadge } from '../ui/StatusBadge';
import { GSAPEntrance } from '../animation/GSAPEntrance';
import { RentCollectionTrendChart } from '../charts/RentCollectionTrendChart';
import { OccupancyDonutChart } from '../charts/OccupancyDonutChart';
import { ArrearsAgeingChart } from '../charts/ArrearsAgeingChart';
import { IncomeExpenseChart } from '../charts/IncomeExpenseChart';
import { PropertyPerformanceChart } from '../charts/PropertyPerformanceChart';
import { MaintenanceStatusChart } from '../charts/MaintenanceStatusChart';

export const OverviewView: React.FC = () => {
  const {
    workspaceConfig,
    portfolioMetrics,
    properties,
    units,
    transactions,
    tenants,
    maintenanceTickets,
    expenses,
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
    .filter(
      (item) =>
        item.balanceInfo.status === 'OVERDUE' ||
        item.balanceInfo.status === 'PARTIAL'
    );

  // Arrears Ageing Buckets calculation
  const arrearsBuckets = {
    current: 0,
    days6to30: 0,
    days31to60: 0,
    days60plus: 0,
  };

  tenants.forEach((t) => {
    const bal = getTenantBalance(t.id);
    if (bal.balance > 0) {
      if (bal.daysOverdue <= 5) {
        arrearsBuckets.current += bal.balance;
      } else if (bal.daysOverdue <= 30) {
        arrearsBuckets.days6to30 += bal.balance;
      } else if (bal.daysOverdue <= 60) {
        arrearsBuckets.days31to60 += bal.balance;
      } else {
        arrearsBuckets.days60plus += bal.balance;
      }
    }
  });

  // Find unallocated transactions
  const unallocatedTxs = transactions.filter((t) => t.status === 'UNALLOCATED');

  // Maintenance awaiting approval
  const pendingApprovals = maintenanceTickets.filter(
    (m) => m.status === 'AWAITING_APPROVAL'
  );

  // Expiring leases
  const expiringTenants = tenants.filter(
    (t) => t.leaseStatus === 'EXPIRING_SOON'
  );

  // Collection progress percentage
  const collectionPct =
    portfolioMetrics.expectedRent > 0
      ? Math.min(
          100,
          Math.round(
            (portfolioMetrics.collectedRent / portfolioMetrics.expectedRent) *
              100
          )
        )
      : 0;

  // Property performance data
  const propertyRankData = properties.map((p) => {
    const pUnits = units.filter((u) => u.propertyId === p.id);
    const pTenants = tenants.filter((t) => t.assignedPropertyId === p.id);
    const pExpected = pUnits.reduce(
      (sum, u) => sum + u.monthlyRent + (u.serviceCharge || 0),
      0
    );
    const pCollected = pTenants.reduce((sum, t) => {
      const b = getTenantBalance(t.id);
      return sum + b.totalPayments;
    }, 0);
    const collectionRate =
      pExpected > 0 ? Math.min(100, Math.round((pCollected / pExpected) * 100)) : 80;
    const occupancyRate =
      pUnits.length > 0
        ? Math.round((pTenants.length / pUnits.length) * 100)
        : 100;
    return {
      name: p.name.split(' ')[0] + ' ' + (p.name.split(' ')[1] || ''),
      collectionRate,
      occupancyRate,
    };
  });

  return (
    <GSAPEntrance className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
              Habari, {currentUser.name ? currentUser.name.split(' ')[0] : 'Landlord'}
            </h1>
            <StatusBadge
              label="Live Sync"
              variant="evergreen"
              icon={<span className="w-1.5 h-1.5 rounded-full bg-[#2F8A68] dark:bg-[#79C8A4] animate-pulse" />}
            />
          </div>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
            Operational Overview for {workspaceConfig.workspaceName} • October 2026 Billing Cycle
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentScreen('reports')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#1B2622] hover:bg-gray-50 dark:hover:bg-[#202D28] text-[#24312D] dark:text-[#EDF5F1] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
          >
            <BarChart3 className="w-4 h-4 text-[#2F8A68] dark:text-[#79C8A4]" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 dark:text-[#111A17]" />
            <span>Ask AI Agent</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 4 KPIs Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Expected Rent */}
        <BentoCard
          hoverable
          onClick={() => setCurrentScreen('payments')}
          title="Expected Rent"
          subtitle={`Across ${portfolioMetrics.totalUnits} registered units`}
          badge={
            <span className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1">
            {formatKES(portfolioMetrics.expectedRent)}
          </div>
          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-2 flex items-center gap-1 font-medium">
            <span>Cycle Due: 5th of Month</span>
          </div>
        </BentoCard>

        {/* KPI 2: Collected Rent */}
        <BentoCard
          hoverable
          onClick={() => setCurrentScreen('payments')}
          title="Collected Rent"
          subtitle={`${collectionPct}% of target received`}
          badge={
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#2F8A68] dark:text-[#79C8A4] mt-1">
            {formatKES(portfolioMetrics.collectedRent)}
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden mt-2.5">
            <div
              className="bg-[#2F8A68] dark:bg-[#79C8A4] h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionPct}%` }}
            />
          </div>
        </BentoCard>

        {/* KPI 3: Outstanding Rent */}
        <BentoCard
          hoverable
          onClick={() => setCurrentScreen('tenants')}
          title="Outstanding Rent"
          subtitle={`${overdueTenants.length} tenants with balances`}
          badge={
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {formatKES(portfolioMetrics.outstandingRent)}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 font-medium flex items-center justify-between">
            <span>Grace ended Oct 10</span>
            <span className="underline cursor-pointer">View tenants →</span>
          </div>
        </BentoCard>

        {/* KPI 4: Occupancy Rate */}
        <BentoCard
          hoverable
          onClick={() => setCurrentScreen('properties')}
          title="Occupancy Rate"
          subtitle={`${portfolioMetrics.occupiedUnits} occupied • ${portfolioMetrics.vacantUnits} vacant`}
          badge={
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Building className="w-4 h-4" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1">
            {portfolioMetrics.occupancyRate}%
          </div>
          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-2 font-medium">
            <span>{properties.length} Active Estates in Nairobi</span>
          </div>
        </BentoCard>
      </div>

      {/* 3. Visualizations Bento Row: 6 Cohesive Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Viz 1: Rent Collection Trend (Spans 2 columns on desktop) */}
        <BentoCard
          className="lg:col-span-2"
          title="Rent Collection Performance Trend"
          subtitle="Expected billing vs confirmed ledger collections over the last 6 months"
          badge={
            <StatusBadge
              label="6 Months"
              variant="neutral"
              size="sm"
            />
          }
        >
          <RentCollectionTrendChart />
        </BentoCard>

        {/* Viz 2: Occupancy & Unit Distribution Donut */}
        <BentoCard
          title="Occupancy & Portfolio Breakdown"
          subtitle="Real-time occupancy status across units"
          badge={
            <StatusBadge
              label={`${portfolioMetrics.totalUnits} Units`}
              variant="evergreen"
              size="sm"
            />
          }
        >
          <OccupancyDonutChart
            occupied={portfolioMetrics.occupiedUnits}
            vacant={portfolioMetrics.vacantUnits}
            maintenance={1}
          />
        </BentoCard>

        {/* Viz 3: Arrears Ageing Breakdown */}
        <BentoCard
          title="Rent Arrears Ageing Breakdown"
          subtitle="Outstanding balances grouped by overdue days"
          badge={
            <StatusBadge
              label={formatKES(portfolioMetrics.outstandingRent)}
              variant="warning"
              size="sm"
            />
          }
        >
          <ArrearsAgeingChart buckets={arrearsBuckets} />
        </BentoCard>

        {/* Viz 4: Income vs Operating Expenses */}
        <BentoCard
          title="Income vs Operating Expenses"
          subtitle="Monthly gross revenue versus operational costs"
          badge={
            <StatusBadge
              label="Net Cashflow"
              variant="success"
              size="sm"
            />
          }
        >
          <IncomeExpenseChart />
        </BentoCard>

        {/* Viz 5: Property Performance Rankings */}
        <BentoCard
          title="Estate Collection & Occupancy Rank"
          subtitle="Comparing collection velocity by estate"
          badge={
            <StatusBadge
              label="Nairobi Portfolio"
              variant="evergreen"
              size="sm"
            />
          }
        >
          <PropertyPerformanceChart data={propertyRankData} />
        </BentoCard>
      </div>

      {/* 4. Actionable Attention Queue (Critical Operational Gate) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-[#24312D] dark:text-[#EDF5F1] flex items-center gap-2">
            <span>Actionable Operational Queue</span>
            <StatusBadge
              label={`${unallocatedTxs.length + pendingApprovals.length + overdueTenants.length} Pending Actions`}
              variant="warning"
              size="sm"
            />
          </h2>
          <span className="text-xs text-[#64736C] dark:text-[#9EB2A9] hidden sm:inline">
            Direct operational bottlenecks requiring landlord action
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Item 1: Unallocated Payments */}
          {unallocatedTxs.length > 0 && (
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border-l-4 border-l-amber-500 border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" /> M-Pesa Unallocated
                  </span>
                  <StatusBadge
                    label={`${unallocatedTxs.length} Unmatched`}
                    variant="warning"
                    size="sm"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                  {formatKES(portfolioMetrics.unallocatedAmount)} in Unmatched Paybill Deposits
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1.5 leading-relaxed">
                  Incoming payments from tenant phone numbers waiting for unit ledger reconciliation.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
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
              className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border-l-4 border-l-red-500 border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> High-Cost Repair Signoff
                  </span>
                  <StatusBadge
                    label={formatKES(m.estimatedCost)}
                    variant="error"
                    size="sm"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1] line-clamp-1">
                  {m.title}
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1.5 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
                <button
                  onClick={() => approveMaintenanceTicket(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173C32] hover:bg-[#245245] text-white dark:bg-[#79C8A4] dark:text-[#111A17] transition-colors"
                >
                  Authorize Work Order
                </button>
                <button
                  onClick={() => setCurrentScreen('maintenance')}
                  className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white"
                >
                  Details
                </button>
              </div>
            </div>
          ))}

          {/* Item 3: Rent Arrears Past Grace Period */}
          {overdueTenants.length > 0 && (
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border-l-4 border-l-[#2F8A68] border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#173C32] dark:text-[#79C8A4] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Rent Arrears Notice Batch
                  </span>
                  <StatusBadge
                    label={`${overdueTenants.length} Tenants`}
                    variant="evergreen"
                    size="sm"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                  Grace Period Expired (October 10)
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1.5 leading-relaxed">
                  Agent prepared polite WhatsApp reminders for Brian, Kevin, and Linda with M-Pesa Paybill ref.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
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
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Lease Expirations (Q4)
                  </span>
                  <StatusBadge
                    label={`${expiringTenants.length} Leases`}
                    variant="info"
                    size="sm"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                  Renewal Preparation Required
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1.5 leading-relaxed">
                  Tenants with upcoming lease expiry within 60 days. Agent can generate renewal addendums.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
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

      {/* 5. Lower Bento Section: Confirmed Ledger + Agent Sentinel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Confirmed Transactions */}
        <BentoCard
          className="lg:col-span-2"
          title="Recent Payment Ledger"
          subtitle="Latest confirmed M-Pesa Paybill & bank deposits matched to tenant accounts"
          action={
            <button
              onClick={() => setCurrentScreen('payments')}
              className="text-xs font-semibold text-[#2F8A68] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
            >
              <span>View All Payments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between text-xs hover:bg-gray-50/50 dark:hover:bg-[#202D28]/40 px-2 rounded-lg transition-colors"
              >
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
                    <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                      {tx.senderName || 'Anonymous Deposit'}
                    </div>
                    <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9]">
                      Ref:{' '}
                      <span className="font-mono text-[#24312D] dark:text-gray-300 font-semibold">
                        {tx.referenceNumber}
                      </span>{' '}
                      • {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-[#24312D] dark:text-[#EDF5F1]">
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
        </BentoCard>

        {/* Right Col: Autonomous Sentinel & Agent Recommendations */}
        <BentoCard
          title="Autonomous Sentinel"
          subtitle="Real-time proactive telemetry & workflow optimization"
          badge={
            <StatusBadge
              label="Human-Gated"
              variant="evergreen"
              size="sm"
              icon={<ShieldCheck className="w-3 h-3 text-[#2F8A68] dark:text-[#79C8A4]" />}
            />
          }
          footer={
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64736C] dark:text-[#9EB2A9]">AI Sentinel v2.4</span>
              <button
                onClick={() => setCurrentScreen('agent')}
                className="font-bold text-[#173C32] dark:text-[#79C8A4] hover:underline flex items-center gap-1"
              >
                Open Agent Hub <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <div className="bg-[#F6F8F6] dark:bg-[#24332D] p-3 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] text-xs">
              <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2F8A68] dark:text-[#79C8A4]" />
                <span>M-Pesa Match Ready</span>
              </div>
              <p className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] leading-relaxed">
                2 unallocated transactions have 85%+ correlation with active leases. Reconciling will clear KES 83,000 in arrears.
              </p>
              <button
                onClick={() => approveAgentTask('task-1')}
                className="mt-2 text-xs font-bold text-[#2F8A68] dark:text-[#79C8A4] hover:underline"
              >
                Approve Reconciliation Task →
              </button>
            </div>

            <div className="bg-[#F6F8F6] dark:bg-[#24332D] p-3 rounded-xl border border-[#E2E8E5] dark:border-[#2D4039] text-xs">
              <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                <span>Water Sub-Meter Spike</span>
              </div>
              <p className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] leading-relaxed">
                Kilimani Heights water meter sub-reading shows higher baseline usage. Correlates with Unit A4 dripping valve.
              </p>
            </div>
          </div>
        </BentoCard>
      </div>
    </GSAPEntrance>
  );
};
