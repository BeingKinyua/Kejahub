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
  Wrench,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  BarChart3,
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

export const OverviewView: React.FC = () => {
  const {
    workspaceConfig,
    portfolioMetrics,
    properties,
    units,
    transactions,
    tenants,
    maintenanceTickets,
    setCurrentScreen,
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
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
              Habari, {currentUser.name ? currentUser.name.split(' ')[0] : 'Landlord'}
            </h1>
            <StatusBadge
              label="Synced"
              variant="evergreen"
              icon={<CheckCircle2 className="w-3 h-3 text-[#2F8A68] dark:text-[#79C8A4]" />}
            />
          </div>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
            Operational overview for {workspaceConfig.workspaceName} • October 2026 billing cycle
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentScreen('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] bg-white dark:bg-[#1B2622] hover:bg-[#F0F4F2] dark:hover:bg-[#202D28] text-[#24312D] dark:text-[#EDF5F1] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <BarChart3 className="w-4 h-4 text-[#2F8A68] dark:text-[#79C8A4]" aria-hidden="true" />
            <span>Financial Reports</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 4 KPIs Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Expected Rent */}
        <BentoCard
          hoverable
          onClick={() => setCurrentScreen('payments')}
          title="Expected Rent"
          subtitle={`Across ${portfolioMetrics.totalUnits} registered units`}
          badge={
            <span className="p-2 rounded-xl bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1]">
              <Calendar className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1 tabular-nums">
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
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#267256] dark:text-[#79C8A4] mt-1 tabular-nums">
            {formatKES(portfolioMetrics.collectedRent)}
          </div>
          <div
            role="progressbar"
            aria-valuenow={collectionPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Rent collection progress"
            className="w-full bg-[#F0F4F2] dark:bg-[#24332D] h-2 rounded-full overflow-hidden mt-2.5"
          >
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
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 tabular-nums">
            {formatKES(portfolioMetrics.outstandingRent)}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 font-medium flex flex-wrap items-center justify-between gap-1">
            <span>Grace ended Oct 10</span>
            <span className="underline">View tenants &rarr;</span>
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
              <Building className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1 tabular-nums">
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
          action={
            <span className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] tabular-nums whitespace-nowrap">
              6 months
            </span>
          }
        >
          <RentCollectionTrendChart />
        </BentoCard>

        {/* Viz 2: Occupancy & Unit Distribution Donut */}
        <BentoCard
          title="Occupancy & Portfolio Breakdown"
          subtitle="Real-time occupancy status across units"
          action={
            <span className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] tabular-nums whitespace-nowrap">
              {portfolioMetrics.totalUnits} units
            </span>
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
          action={
            <span className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] whitespace-nowrap">
              Net cashflow
            </span>
          }
        >
          <IncomeExpenseChart />
        </BentoCard>

        {/* Viz 5: Property Performance Rankings */}
        <BentoCard
          title="Estate Collection & Occupancy Rank"
          subtitle="Comparing collection velocity by estate"
          action={
            <span className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] whitespace-nowrap">
              Nairobi portfolio
            </span>
          }
        >
          <PropertyPerformanceChart data={propertyRankData} />
        </BentoCard>
      </div>

      {/* 4. Actionable Attention Queue (Critical Operational Gate) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-bold text-[#24312D] dark:text-[#EDF5F1] flex flex-wrap items-center gap-2">
            <span>Actionable Operational Queue</span>
            <StatusBadge
              label={
                unallocatedTxs.length + pendingApprovals.length + overdueTenants.length > 0
                  ? `${unallocatedTxs.length + pendingApprovals.length + overdueTenants.length} Pending Actions`
                  : 'All Caught Up'
              }
              variant={
                unallocatedTxs.length + pendingApprovals.length + overdueTenants.length > 0
                  ? 'warning'
                  : 'success'
              }
              size="sm"
            />
          </h2>
          <span className="text-xs text-[#64736C] dark:text-[#9EB2A9] hidden sm:inline">
            Operational bottlenecks requiring landlord review
          </span>
        </div>

        {unallocatedTxs.length === 0 &&
        pendingApprovals.length === 0 &&
        overdueTenants.length === 0 &&
        expiringTenants.length === 0 ? (
          <div className="bento-card bg-white dark:bg-[#1B2622] p-6 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#2F8A68] dark:text-[#79C8A4] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1]">
                  All operational queues are clear
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
                  No unmatched deposits, pending repair approvals, or overdue rent notices await signoff.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentScreen('reports')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F0F4F2] hover:bg-[#E2E8E5] dark:bg-[#24332D] dark:hover:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1] transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
            >
              View Rent Roll
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Item 1: Unallocated Payments */}
          {unallocatedTxs.length > 0 && (
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" aria-hidden="true" /> M-Pesa Unallocated
                  </span>
                  <StatusBadge
                    label={`${unallocatedTxs.length} Unmatched`}
                    variant="warning"
                    size="sm"
                  />
                </div>
                <h3 className="font-bold text-sm text-[#24312D] dark:text-[#EDF5F1] tabular-nums">
                  {formatKES(portfolioMetrics.unallocatedAmount)} in Unmatched Paybill Deposits
                </h3>
                <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1.5 leading-relaxed">
                  Incoming payments from tenant phone numbers waiting for unit ledger reconciliation.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('payments')}
                  className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline flex items-center gap-1 py-1 cursor-pointer"
                >
                  <span>Reconcile Transactions</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Item 2: Maintenance Signoff */}
          {pendingApprovals.map((m) => (
            <div
              key={m.id}
              className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" aria-hidden="true" /> Repair Signoff
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

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => approveMaintenanceTicket(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#173C32] hover:bg-[#245245] text-white dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] transition-colors cursor-pointer"
                >
                  Authorize Work Order
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('maintenance')}
                  className="text-xs font-medium text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white py-1 px-1.5 cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          ))}

          {/* Item 3: Rent Arrears Past Grace Period */}
          {overdueTenants.length > 0 && (
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-[#173C32] dark:text-[#79C8A4] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" /> Rent Arrears Notices
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
                  Agent prepared {overdueTenants.length} polite WhatsApp reminder{overdueTenants.length === 1 ? '' : 's'} with M-Pesa Paybill details.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('agent')}
                  className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline flex items-center gap-1 py-1 cursor-pointer"
                >
                  <span>Review &amp; Approve Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Item 4: Expiring Leases */}
          {expiringTenants.length > 0 && (
            <div className="bento-card bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" /> Lease Expirations (Q4)
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
                  type="button"
                  onClick={() => setCurrentScreen('tenants')}
                  className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline flex items-center gap-1 py-1 cursor-pointer"
                >
                  <span>Prepare Renewal Notices</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
        )}
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
              type="button"
              onClick={() => setCurrentScreen('payments')}
              className="text-xs font-semibold text-[#267256] dark:text-[#79C8A4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Payments</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          }
        >
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
              No payment transactions recorded yet.
            </div>
          ) : (
          <div className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between gap-3 text-xs hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    aria-hidden="true"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${
                      tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {tx.channel === 'M-PESA' ? 'M' : 'B'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1] truncate">
                      {tx.senderName || 'Anonymous Deposit'}
                    </div>
                    <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] tabular-nums">
                      Ref:{' '}
                      <span className="font-mono text-[#24312D] dark:text-[#EDF5F1] font-semibold">
                        {tx.referenceNumber}
                      </span>{' '}
                      • {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] tabular-nums">
                    {formatKES(tx.amount)}
                  </div>
                  <StatusBadge
                    label={tx.status}
                    variant={
                      tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
          )}
        </BentoCard>

        {/* Right Col: Autonomous Sentinel & Agent Recommendations */}
        <BentoCard
          title="Autonomous Sentinel"
          subtitle="Proactive lease, payment, and maintenance flags"
          badge={
            <StatusBadge
              label="Human-Gated"
              variant="evergreen"
              size="sm"
              icon={<ShieldCheck className="w-3 h-3 text-[#2F8A68] dark:text-[#79C8A4]" />}
            />
          }
          footer={
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-[#64736C] dark:text-[#9EB2A9]">Human-gated execution</span>
              <button
                type="button"
                onClick={() => setCurrentScreen('agent')}
                className="font-bold text-[#173C32] dark:text-[#79C8A4] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Agent Hub <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          }
        >
          <div className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
            <div className="pb-3.5 text-xs">
              <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2F8A68] dark:text-[#79C8A4] shrink-0" aria-hidden="true" />
                <span>{unallocatedTxs.length > 0 ? 'M-Pesa Match Ready' : 'M-Pesa Ledger Matched'}</span>
              </div>
              <p className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] leading-relaxed tabular-nums">
                {unallocatedTxs.length > 0
                  ? `${unallocatedTxs.length} unallocated transaction${unallocatedTxs.length === 1 ? '' : 's'} ready to match with active leases (${formatKES(portfolioMetrics.unallocatedAmount)}).`
                  : 'All incoming Paybill deposits are matched to active tenant unit ledgers.'}
              </p>
              {unallocatedTxs.length > 0 && (
                <button
                  type="button"
                  onClick={() => approveAgentTask('task-1')}
                  className="mt-2 text-xs font-bold text-[#267256] dark:text-[#79C8A4] hover:underline cursor-pointer"
                >
                  Approve Reconciliation Task &rarr;
                </button>
              )}
            </div>

            <div className="pt-3.5 text-xs">
              <div className="font-bold text-[#24312D] dark:text-[#EDF5F1] mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
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
