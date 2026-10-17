import React, { useState } from 'react';
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
            Operating Expenses
          </h1>
          <p className="text-xs sm:text-sm text-[#64736C] dark:text-[#9EB2A9]">
            Track utility tokens, caretaker wages, county rates, security, and repairs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== 'READ_ONLY' && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Banner */}
      <div className="bg-white dark:bg-[#1B2622] p-5 rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
            Total Operational Outflow (October)
          </span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">
            {formatKES(totalExpenseAmount)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400">Filter Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value as any)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
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

      {/* Expenses Table */}
      <div className="bg-white dark:bg-[#1B2622] rounded-2xl border border-[#E2E8E5] dark:border-[#2D4039] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700 dark:text-gray-300">
            <thead className="bg-[#F6F8F6] dark:bg-[#24332D] uppercase text-[10px] font-bold text-gray-500 dark:text-gray-400 border-b border-[#E2E8E5] dark:border-[#2D4039]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Expense Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredExpenses.map((exp) => {
                const prop = properties.find((p) => p.id === exp.propertyId);
                return (
                  <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3.5 text-gray-500 font-medium">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-gray-100">
                      {exp.description}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {exp.category.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-gray-800 dark:text-gray-200">
                      {prop?.name}
                    </td>

                    <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">
                      {exp.vendor}
                    </td>

                    <td className="px-4 py-3.5 font-extrabold text-gray-900 dark:text-gray-100">
                      {formatKES(exp.amount)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                        <Paperclip className="w-3.5 h-3.5" /> Voucher
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1B2622] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              Record Operational Expense
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              AI automatically suggests classification as you type description.
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="e.g. Kenya Power Common Area Tokens"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Category (AI Classified)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Property
                  </label>
                  <select
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Vendor / Payee *
                  </label>
                  <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="e.g. Kenya Power Ltd"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:text-[#111A17] rounded-xl"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
