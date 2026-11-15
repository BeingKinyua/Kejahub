'use client';

import React, { useState } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  BarChart3,
  Download,
  Calendar,
  Building,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';
import { BentoCard } from '../ui/BentoCard';
import { StatusBadge } from '../ui/StatusBadge';
import { GSAPEntrance } from '../animation/GSAPEntrance';
import { ArrearsAgeingChart } from '../charts/ArrearsAgeingChart';
import { IncomeExpenseChart } from '../charts/IncomeExpenseChart';

export const ReportsView: React.FC = () => {
  const {
    properties,
    units,
    tenants,
    transactions,
    expenses,
    portfolioMetrics,
    getTenantBalance,
    addToast,
  } = useProperty();

  // Calculate Net Operating Income (NOI)
  const totalIncome = portfolioMetrics.collectedRent;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingIncome = totalIncome - totalExpenses;

  // Kenya Residential Rental Income Tax (7.5% on gross rent collected)
  const estimatedKraTax = Math.round(totalIncome * 0.075);

  // Arrears Ageing Buckets
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

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = [
      'Property',
      'Unit',
      'Tenant Name',
      'Phone',
      'Expected Monthly Rent',
      'October Balance',
      'Arrears Status',
    ];
    const rows = tenants.map((t) => {
      const u = units.find((unit) => unit.id === t.assignedUnitId);
      const p = properties.find((prop) => prop.id === t.assignedPropertyId);
      const b = getTenantBalance(t.id);
      return [
        `"${p?.name || ''}"`,
        `"${u?.unitNumber || ''}"`,
        `"${t.name}"`,
        `"${t.phone}"`,
        (u?.monthlyRent || 0) + (u?.serviceCharge || 0),
        b.balance,
        b.status,
      ].join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `kejahub_rent_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(
      'SUCCESS',
      'CSV Exported',
      'Rent roll and arrears audit log downloaded.'
    );
  };

  return (
    <GSAPEntrance className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
              Financial & Operational Reports
            </h1>
            <StatusBadge label="October 2026" variant="neutral" />
          </div>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
            Rent collection performance, arrears ageing analysis, NOI, and KRA Section 6A tax estimation
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm self-start sm:self-auto shrink-0 min-h-[38px]"
        >
          <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
          <span>Export Rent Roll (CSV)</span>
        </button>
      </div>

      {/* 4 Financial KPIs in Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BentoCard
          title="Gross Revenue Collected"
          subtitle="October billing cycle"
          badge={
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 tabular-nums">
            {formatKES(totalIncome)}
          </div>
          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-2 font-medium tabular-nums">
            From {transactions.filter((t) => t.status === 'CONFIRMED' || t.status === 'RECONCILED').length} transactions
          </div>
        </BentoCard>

        <BentoCard
          title="Operating Expenses"
          subtitle="Utilities & repairs"
          badge={
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1 tabular-nums">
            {formatKES(totalExpenses)}
          </div>
          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-2 font-medium tabular-nums">
            {expenses.length} logged expense items
          </div>
        </BentoCard>

        <BentoCard
          title="Net Operating Income"
          subtitle="NOI = Gross - Opex"
          badge={
            <span className="p-2 rounded-xl bg-[#F0F4F2] dark:bg-[#24332D] text-[#64736C] dark:text-[#9EB2A9]">
              <Calculator className="w-4 h-4" aria-hidden="true" />
            </span>
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1 tabular-nums">
            {formatKES(netOperatingIncome)}
          </div>
          <div className="text-[11px] text-[#267256] dark:text-[#79C8A4] mt-2 font-medium">
            Healthy operating margin
          </div>
        </BentoCard>

        <BentoCard
          title="Estimated KRA Tax (7.5%)"
          subtitle="Residential Rental Income"
          badge={
            <StatusBadge
              label="Sec 6A"
              variant="evergreen"
              size="sm"
            />
          }
        >
          <div className="text-xl sm:text-2xl font-extrabold text-purple-700 dark:text-purple-400 mt-1 tabular-nums">
            {formatKES(estimatedKraTax)}
          </div>
          <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-2 font-medium">
            Due 20th of the following month
          </div>
        </BentoCard>
      </div>

      {/* Visualizations Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BentoCard
          title="Income vs Expenses (Monthly Trend)"
          subtitle="Comparison of rental cash inflow versus outflow"
          badge={<StatusBadge label="Cashflow" variant="success" size="sm" />}
        >
          <IncomeExpenseChart />
        </BentoCard>

        <BentoCard
          title="Arrears Ageing Analysis"
          subtitle="Cumulative exposure grouped by days delinquent"
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
      </div>

      {/* Rent Roll Table Bento */}
      <BentoCard
        title="Portfolio Rent Roll & Ledger Reconciliation"
        subtitle="Current status across all leased units in Nairobi"
        badge={
          <StatusBadge
            label={`${tenants.length} Tenants`}
            variant="neutral"
            size="sm"
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F6F8F6] dark:bg-[#202D28] text-[#64736C] dark:text-[#9EB2A9] uppercase font-semibold border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="py-2.5 px-3">Property</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Tenant Name</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3 text-right">Rent + SC</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
              {tenants.map((t) => {
                const u = units.find((unit) => unit.id === t.assignedUnitId);
                const p = properties.find((prop) => prop.id === t.assignedPropertyId);
                const b = getTenantBalance(t.id);
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-[#F6F8F6]/70 dark:hover:bg-[#202D28]/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-[#24312D] dark:text-[#EDF5F1] wrap-anywhere">
                      {p?.name || 'Estate'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#267256] dark:text-[#79C8A4] whitespace-nowrap tabular-nums">
                      {u?.unitNumber || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-[#24312D] dark:text-[#EDF5F1] wrap-anywhere">
                      {t.name}
                    </td>
                    <td className="py-2.5 px-3 text-[#64736C] dark:text-[#9EB2A9] font-mono whitespace-nowrap tabular-nums">
                      {t.phone}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-[#24312D] dark:text-[#EDF5F1] whitespace-nowrap tabular-nums">
                      {formatKES((u?.monthlyRent || 0) + (u?.serviceCharge || 0))}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold whitespace-nowrap tabular-nums ${
                        b.balance > 0
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {formatKES(b.balance)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge
                        label={b.status}
                        variant={
                          b.status === 'PAID'
                            ? 'success'
                            : b.status === 'PARTIAL'
                            ? 'warning'
                            : 'error'
                        }
                        size="sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BentoCard>
    </GSAPEntrance>
  );
};
