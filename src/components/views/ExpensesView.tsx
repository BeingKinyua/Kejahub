import React, { useState, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { Expense, ExpenseCategory } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles,
  Paperclip,
  Tag,
  X,
} from 'lucide-react';
import { formatKES } from '../../utils/propertyMath';
import { GSAPEntrance } from '../animation/GSAPEntrance';

export const ExpensesView: React.FC = () => {
  const { expenses, properties, addExpense, currentUser, addToast } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<'ALL' | ExpenseCategory>('ALL');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('SECURITY_CARETAKER');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(15000);
  const [vendor, setVendor] = useState('');
  const [date, setDate] = useState('2026-10-15');

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCat !== 'ALL' && e.category !== selectedCat) return false;
    return true;
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // AI Category Auto-Suggest
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    const low = text.toLowerCase();
    if (low.includes('kplc') || low.includes('token') || low.includes('power') || low.includes('stima')) {
      setCategory('KPLC_ELECTRICITY');
    } else if (low.includes('water') || low.includes('maji') || low.includes('borehole')) {
      setCategory('NAIROBI_WATER');
    } else if (low.includes('guard') || low.includes('security') || low.includes('caretaker') || low.includes('salary')) {
      setCategory('SECURITY_CARETAKER');
    } else if (low.includes('garbage') || low.includes('waste') || low.includes('cleansweep')) {
      setCategory('GARBAGE_COLLECTION');
    } else if (low.includes('repair') || low.includes('plumb') || low.includes('electric') || low.includes('fundi')) {
      setCategory('REPAIRS');
    }
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !vendor) {
      addToast('ERROR', 'Missing Fields', 'Description, amount, and vendor are required.');
      return;
    }

    addExpense({
      propertyId,
      category,
      description,
      amount: Number(amount),
      date,
      vendor,
      receiptStatus: 'ATTACHED',
      status: 'APPROVED',
    });

    setModalOpen(false);
    setDescription('');
    setVendor('');
  };

  return (
    <GSAPEntrance className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
            Operating Expenses
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Track utility tokens, caretaker wages, county rates, security, and repairs
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm min-h-[38px]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] block">
            Total Operational Outflow (October)
          </span>
          <div className="text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] mt-1 tabular-nums">
            {formatKES(totalExpenseAmount)}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 text-xs w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search expenses by description or vendor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search description or vendor..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="expense-category-filter" className="text-[#64736C] dark:text-[#9EB2A9] shrink-0">
              Category:
            </label>
            <select
              id="expense-category-filter"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as 'ALL' | ExpenseCategory)}
              className="px-3 py-2 bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
            >
              <option value="ALL">All Categories</option>
              <option value="SECURITY_CARETAKER">Security / Caretaker</option>
              <option value="KPLC_ELECTRICITY">KPLC Power Tokens</option>
              <option value="NAIROBI_WATER">Nairobi Water / Borehole</option>
              <option value="GARBAGE_COLLECTION">Garbage Collection</option>
              <option value="REPAIRS">Maintenance Repairs</option>
              <option value="COUNTY_RATES">County Land Rates</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center">
            <CreditCard className="w-10 h-10 mx-auto text-[#64736C] dark:text-[#9EB2A9] mb-2 opacity-60" aria-hidden="true" />
            <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1]">No expenses match your filters</h3>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mt-1">
              Try clearing your search term or switching back to all expense categories.
            </p>
            {(searchTerm || selectedCat !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCat('ALL');
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-[#F0F4F2] hover:bg-[#E2E8E5] dark:bg-[#24332D] dark:hover:bg-[#2D4039] text-[#24312D] dark:text-[#EDF5F1] transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#24312D] dark:text-[#EDF5F1]">
            <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[11px] font-bold text-[#64736C] dark:text-[#9EB2A9] border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Expense Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
              {filteredExpenses.map((exp) => {
                const prop = properties.find((p) => p.id === exp.propertyId);
                return (
                  <tr key={exp.id} className="hover:bg-[#F6F8F6] dark:hover:bg-[#202D28]/60 transition-colors">
                    <td className="px-4 py-3.5 text-[#64736C] dark:text-[#9EB2A9] font-medium whitespace-nowrap tabular-nums">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-[#24312D] dark:text-[#EDF5F1] wrap-anywhere">
                      {exp.description}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F0F4F2] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] whitespace-nowrap">
                        {exp.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-[#24312D] dark:text-[#EDF5F1]">
                      {prop?.name}
                    </td>

                    <td className="px-4 py-3.5 text-[#64736C] dark:text-[#9EB2A9] wrap-anywhere">
                      {exp.vendor}
                    </td>

                    <td className="px-4 py-3.5 font-extrabold text-[#24312D] dark:text-[#EDF5F1] text-right whitespace-nowrap tabular-nums">
                      {formatKES(exp.amount)}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className="text-[11px] text-[#267256] dark:text-[#79C8A4] font-semibold inline-flex items-center justify-end gap-1">
                        <Paperclip className="w-3.5 h-3.5" aria-hidden="true" /> Voucher
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-expense-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8E5] dark:border-[#2D4039] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 id="add-expense-modal-title" className="text-lg font-bold text-[#24312D] dark:text-[#EDF5F1]">
                Record Operational Expense
              </h3>
              <button
                type="button"
                aria-label="Close record expense modal"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-[#EDF5F1]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] mb-4">
              AI automatically suggests classification as you type description.
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label htmlFor="expense-description" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Description *
                </label>
                <input
                  id="expense-description"
                  type="text"
                  required
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="e.g. Kenya Power Common Area Tokens"
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expense-category" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Category (AI Classified)
                  </label>
                  <select
                    id="expense-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  >
                    <option value="SECURITY_CARETAKER">Security / Wages</option>
                    <option value="KPLC_ELECTRICITY">KPLC Electricity</option>
                    <option value="NAIROBI_WATER">Nairobi Water</option>
                    <option value="GARBAGE_COLLECTION">Garbage / Sanitation</option>
                    <option value="REPAIRS">Maintenance Repairs</option>
                    <option value="COUNTY_RATES">County Land Rates</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="expense-amount" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Amount (KES) *
                  </label>
                  <input
                    id="expense-amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expense-property" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Property
                  </label>
                  <select
                    id="expense-property"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="expense-vendor" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                    Vendor / Payee *
                  </label>
                  <input
                    id="expense-vendor"
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Kenya Power Ltd"
                    className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expense-date" className="block text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] mb-1">
                  Payment Date
                </label>
                <input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] tabular-nums"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E2E8E5] dark:border-[#2D4039]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#64736C] dark:text-[#9EB2A9] hover:bg-[#F0F4F2] dark:hover:bg-[#24332D] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] dark:text-[#111A17] rounded-xl"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GSAPEntrance>
  );
};
