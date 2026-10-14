import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const ExpensesPage: React.FC = () => {
  const { expenses, addExpense, jobCards } = useData();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [category, setCategory] = useState('Shop consumables');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [mode, setMode] = useState<'Cash' | 'Bank transfer' | 'UPI' | 'Cheque'>('UPI');
  const [paidBy, setPaidBy] = useState('accountant');
  const [isCapital, setIsCapital] = useState(false);

  // Calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalRevenue = jobCards.reduce((sum, j) => sum + j.netTotal, 0);
  const expenseRatio = totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : '0';
  const capexTotal = expenses.filter((e) => e.isCapital).reduce((sum, e) => sum + e.amount, 0);
  const opexTotal = totalExpenses - capexTotal;

  // Categories present in data
  const categories = ['All', 'Electricity & Power', 'Workshop Rent', 'Shop consumables', 'Equipment & Tools', 'Staff Welfare & Tea', 'Admin & Office', 'Diesel & Fuel'];

  const filtered = expenses.filter((e) => {
    const matchesCat = categoryFilter === 'All' || e.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.voucherNo.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    addExpense({
      date: dateStr,
      category,
      description: description.trim() || category,
      mode,
      paidBy,
      amount: Number(amount),
      isCapital,
    });

    setIsModalOpen(false);
    setDescription('');
    setAmount('');
    setIsCapital(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workshop Expenses
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Operating overheads, utilities, consumables, shop equipment & petty cash vouchers
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
        >
          <span className="text-base font-bold">+</span>
          Record Expense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          subtitle={`${expenses.length} vouchers recorded`}
        />
        <StatCard
          title="Operating Overheads (Opex)"
          value={`₹${opexTotal.toLocaleString('en-IN')}`}
          subtitle="Direct workshop running cost"
        />
        <StatCard
          title="Capital Expenditures (Capex)"
          value={`₹${capexTotal.toLocaleString('en-IN')}`}
          subtitle="Lifts, scanners, shop tooling"
        />
        <StatCard
          title="Expense to Revenue"
          value={`${expenseRatio}%`}
          subtitle="Operating cost efficiency"
        />
      </div>

      {/* Category Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search voucher or description..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Voucher No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Paid By</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No expense records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {exp.voucherNo}
                        {exp.isCapital && (
                          <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-sm bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 font-bold border border-purple-200 dark:border-purple-800">
                            CAPEX
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">{exp.date}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-900 dark:text-slate-200 max-w-sm">
                        {exp.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400">
                          {exp.mode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono">{exp.paidBy}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Workshop Expense"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Expense Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Shop consumables</option>
                <option>Electricity & Power</option>
                <option>Workshop Rent</option>
                <option>Equipment & Tools</option>
                <option>Staff Welfare & Tea</option>
                <option>Admin & Office</option>
                <option>Diesel & Fuel</option>
                <option>Machinery Calibration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="e.g. 4500"
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Description / Voucher Note *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. BESCOM Industrial HT power tariff payment for workshop bay"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Payment Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank transfer</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Authorized By / Staff
              </label>
              <input
                type="text"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCapital}
                onChange={(e) => setIsCapital(e.target.checked)}
                className="rounded-sm text-blue-600"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Mark as Capital Expenditure (Capex / Fixed Asset)
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
