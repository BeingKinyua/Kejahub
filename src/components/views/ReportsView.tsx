import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  BarChart3,
  Download,
  Calendar,
  Building,
  TrendingUp,
  AlertTriangle,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';

export const ReportsView: React.FC = () => {
  const { properties, units, tenants, transactions, expenses, portfolioMetrics, getTenantBalance, addToast } = useProperty();

  // Calculate Net Operating Income (NOI)
  const totalIncome = portfolioMetrics.collectedRent;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingIncome = totalIncome - totalExpenses;

  // Arrears Ageing Buckets
  const arrearsBuckets = {
    current: 0, // 0-5 days
    days6to30: 0, // 6-30 days
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
    const headers = ['Property', 'Unit', 'Tenant Name', 'Phone', 'Expected Monthly Rent', 'October Balance', 'Arrears Status'];
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

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kejahub_rent_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('SUCCESS', 'CSV Exported', 'Rent roll and arrears report downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Rent collection performance, arrears ageing, NOI, and KRA-ready tax summaries
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV (Demo Data)</span>
        </button>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Total Revenue Collected</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {formatKES(totalIncome)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">October 2026 accounting cycle</span>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Operational Expenses</span>
          <div className="text-2xl font-extrabold text-red-500 dark:text-red-400 mt-2">
            {formatKES(totalExpenses)}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Utilities, wages & maintenance</span>
        </div>

        <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Net Operating Income (NOI)</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">
            {formatKES(netOperatingIncome)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            {Math.round((netOperatingIncome / (totalIncome || 1)) * 100)}% Net Margin
          </span>
        </div>
      </div>

      {/* Arrears Ageing Breakdown */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Arrears Ageing Analysis
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution of overdue rent across ageing windows
            </p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
            Total Arrears: {formatKES(portfolioMetrics.outstandingRent)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <span className="text-[11px] text-gray-400 block">Current (0–5 Days)</span>
            <div className="text-base font-extrabold text-gray-800 dark:text-gray-200 mt-1">
              {formatKES(arrearsBuckets.current)}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Within Grace</span>
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-500/20">
            <span className="text-[11px] text-amber-800 dark:text-amber-400 block font-semibold">6–30 Days</span>
            <div className="text-base font-extrabold text-amber-600 mt-1">
              {formatKES(arrearsBuckets.days6to30)}
            </div>
            <span className="text-[10px] text-amber-600 font-medium">Follow-up Active</span>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <span className="text-[11px] text-gray-400 block">31–60 Days</span>
            <div className="text-base font-extrabold text-gray-800 dark:text-gray-200 mt-1">
              {formatKES(arrearsBuckets.days31to60)}
            </div>
            <span className="text-[10px] text-gray-400">0 Accounts</span>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <span className="text-[11px] text-gray-400 block">60+ Days (Default Risk)</span>
            <div className="text-base font-extrabold text-gray-800 dark:text-gray-200 mt-1">
              {formatKES(arrearsBuckets.days60plus)}
            </div>
            <span className="text-[10px] text-gray-400">0 Accounts</span>
          </div>
        </div>
      </div>

      {/* Property-Level Performance Breakdown */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
          Property-Level Income & Expense Breakdown
        </h3>

        <div className="space-y-4">
          {properties.map((prop) => {
            const pUnits = units.filter((u) => u.propertyId === prop.id);
            const pExpected = pUnits.reduce((acc, u) => acc + (u.status === 'OCCUPIED' ? u.monthlyRent + u.serviceCharge : 0), 0);
            const pCollected = transactions
              .filter((tx) => tx.propertyId === prop.id && (tx.status === 'CONFIRMED' || tx.status === 'RECONCILED'))
              .reduce((acc, tx) => acc + tx.amount, 0);
            const pExpenses = expenses
              .filter((e) => e.propertyId === prop.id)
              .reduce((acc, e) => acc + e.amount, 0);
            const pNOI = pCollected - pExpenses;
            const occ = pUnits.filter((u) => u.status === 'OCCUPIED').length;
            const occPct = pUnits.length > 0 ? Math.round((occ / pUnits.length) * 100) : 0;

            return (
              <div
                key={prop.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#2F8A68]" />
                    <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{prop.name}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                      {occPct}% Occupancy ({occ}/{pUnits.length})
                    </span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-1">
                    Expected: {formatKES(pExpected)} • Collected: {formatKES(pCollected)}
                  </div>
                </div>

                <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Expenses</span>
                    <span className="font-semibold text-red-500">{formatKES(pExpenses)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Property NOI</span>
                    <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                      {formatKES(pNOI)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
