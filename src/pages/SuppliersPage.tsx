import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const SuppliersPage: React.FC = () => {
  const { suppliers, addSupplier, recordSupplierPayment } = useData();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [payModalSupplierId, setPayModalSupplierId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState<number | ''>('');

  // Add form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState('30 days credit');

  // Stats
  const totalPayables = suppliers.reduce((sum, s) => sum + s.balanceDue, 0);
  const aging0to30 = Math.round(totalPayables * 0.58);
  const aging31to90 = Math.round(totalPayables * 0.32);
  const agingOver90 = Math.round(totalPayables * 0.10);

  const filtered = suppliers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.gstin.toLowerCase().includes(q)
    );
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gstin.trim()) return;

    addSupplier({
      name: name.trim().toUpperCase(),
      location: location.trim() || 'Bengaluru',
      gstin: gstin.trim().toUpperCase(),
      phone: phone.trim() || '+91 80 4910 8800',
      email: email.trim() || undefined,
      terms,
    });

    setIsAddModalOpen(false);
    setName('');
    setLocation('');
    setGstin('');
    setPhone('');
    setEmail('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalSupplierId || !payAmount || Number(payAmount) <= 0) return;

    recordSupplierPayment(payModalSupplierId, Number(payAmount));
    setPayModalSupplierId(null);
    setPayAmount('');
  };

  const activePaySupplier = suppliers.find((s) => s.id === payModalSupplierId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Supplier Ledger & Accounts Payable
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage spare parts vendors, lubricants distributors, credit aging & settlement statements
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
        >
          <span className="text-base font-bold">+</span>
          Add Supplier
        </button>
      </div>

      {/* Aging KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Payables"
          value={`₹${totalPayables.toLocaleString('en-IN')}`}
          subtitle={`${suppliers.length} active vendors`}
        />
        <StatCard
          title="0 - 30 Days (Current)"
          value={`₹${aging0to30.toLocaleString('en-IN')}`}
          subtitle="Within agreed credit terms"
        />
        <StatCard
          title="31 - 90 Days"
          value={`₹${aging31to90.toLocaleString('en-IN')}`}
          subtitle="Due for settlement"
        />
        <StatCard
          title="Over 90 Days"
          value={`₹${agingOver90.toLocaleString('en-IN')}`}
          subtitle="Critical aging payables"
        />
      </div>

      {/* Search & Vendor Directory */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vendor name, town, or GSTIN..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> of {suppliers.length} suppliers
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Supplier Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">GSTIN</th>
                  <th className="px-4 py-3">Credit Terms</th>
                  <th className="px-4 py-3">Open Bills</th>
                  <th className="px-4 py-3 text-right">Balance Due</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No suppliers matching &quot;{search}&quot;
                    </td>
                  </tr>
                ) : (
                  filtered.map((sup) => (
                    <tr
                      key={sup.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/suppliers/${sup.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {sup.name}
                        </Link>
                        <div className="text-xs text-slate-400 font-mono">{sup.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">{sup.location}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                          {sup.gstin}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{sup.terms}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                          {sup.openBillsCount} bills
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{sup.balanceDue.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => {
                              setPayModalSupplierId(sup.id);
                              setPayAmount(sup.balanceDue);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-md hover:bg-emerald-100 transition-colors"
                          >
                            Pay Bill
                          </button>
                          <Link
                            to={`/suppliers/${sup.id}`}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            Ledger →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Vendor / Supplier"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Supplier Business Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. S.K. AUTO SPARES (MADURAI)"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Location / Town *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Peenya / Whitefield"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                GSTIN *
              </label>
              <input
                type="text"
                required
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="29AAECS1234K1Z2"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="04652-240000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Credit Terms
              </label>
              <select
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Immediate / Cash</option>
                <option>15 days credit</option>
                <option>30 days credit</option>
                <option>45 days credit</option>
                <option>60 days credit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Supplier
            </button>
          </div>
        </form>
      </Modal>

      {/* Pay Supplier Modal */}
      <Modal
        isOpen={!!payModalSupplierId}
        onClose={() => setPayModalSupplierId(null)}
        title={`Settle Vendor Bill: ${activePaySupplier?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-sm border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400">Current Outstanding Balance:</div>
            <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              ₹{activePaySupplier?.balanceDue.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Payment Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setPayModalSupplierId(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
