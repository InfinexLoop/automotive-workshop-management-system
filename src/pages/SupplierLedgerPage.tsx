import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';

export const SupplierLedgerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { suppliers, supplierBills, recordSupplierPayment } = useData();

  const supplier = suppliers.find((s) => s.id === id);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  if (!supplier) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Supplier Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The selected vendor record could not be found.</p>
        <Link
          to="/suppliers"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
        >
          Back to Supplier Ledger
        </Link>
      </div>
    );
  }

  // Bills for this supplier
  const bills = supplierBills.filter((b) => b.supplierId === supplier.id || b.supplierName === supplier.name);

  const totalBilled = bills.reduce((sum, b) => sum + b.amount, 0) || supplier.balanceDue * 1.5;
  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0) || (totalBilled - supplier.balanceDue);

  const filteredBills = bills.filter((b) => {
    if (filterStatus === 'All') return true;
    return b.status === filterStatus;
  });

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) return;
    recordSupplierPayment(supplier.id, Number(payAmount));
    setIsPayModalOpen(false);
    setPayAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/suppliers"
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {supplier.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
                {supplier.gstin}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Vendor Ledger & Purchase Invoice Statements
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setPayAmount(supplier.balanceDue);
            setIsPayModalOpen(true);
          }}
          className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs"
        >
          Settle Balance
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Vendor Details</div>
          <div className="mt-2 space-y-1">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              📍 {supplier.location}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              📞 {supplier.phone}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              Terms: {supplier.terms}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Purchases</div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Across supply invoices
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Paid Out</div>
          <div className="mt-2">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Cleared payments
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Balance Due</div>
          <div className="mt-2">
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              ₹{supplier.balanceDue.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Outstanding payable
            </div>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Purchase Bills & Credit Invoices ({filteredBills.length})
          </h2>
          <div className="flex items-center gap-1.5">
            {['All', 'Open', 'Partially Paid', 'Paid'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Bill Number</th>
                  <th className="px-4 py-3">Bill Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Bill Total</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No bills found for the selected status filter.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                        {b.billNo}
                      </td>
                      <td className="px-4 py-3 text-xs">{b.date}</td>
                      <td className="px-4 py-3 text-xs">{b.dueDate}</td>
                      <td className="px-4 py-3 text-xs">{b.itemsCount} spares</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            b.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : b.status === 'Partially Paid'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{b.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        ₹{b.paidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                        ₹{b.balanceDue.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Vendor Settlement: ${supplier.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleMakePayment} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-sm border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400">Current Outstanding Balance:</div>
            <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              ₹{supplier.balanceDue.toLocaleString('en-IN')}
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
              onClick={() => setIsPayModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
