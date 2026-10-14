import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const FinancePage: React.FC = () => {
  const { jobCards, addAuditLog } = useData();

  const [filterMode, setFilterMode] = useState<string>('All');
  const [isDayCloseModalOpen, setIsDayCloseModalOpen] = useState(false);
  const [dayCloseSuccess, setDayCloseSuccess] = useState(false);

  // Extract all payment records from job cards
  const allPayments = jobCards.flatMap((jc) =>
    jc.payments.map((p) => ({
      ...p,
      billNo: jc.billNo,
      regNo: jc.regNo,
      customerName: jc.customerName,
      jobCardId: jc.id,
    }))
  ).sort((a, b) => b.id.localeCompare(a.id));

  // Mode totals
  const totalCollections = allPayments.reduce((acc, p) => acc + p.amount, 0);
  const cashTotal = allPayments.filter((p) => p.mode === 'Cash').reduce((acc, p) => acc + p.amount, 0);
  const upiTotal = allPayments.filter((p) => p.mode === 'UPI').reduce((acc, p) => acc + p.amount, 0);
  const cardBankTotal = allPayments
    .filter((p) => p.mode === 'Card' || p.mode === 'Bank transfer' || p.mode === 'Cheque')
    .reduce((acc, p) => acc + p.amount, 0);

  // Staff accountability breakdown
  const staffSummary: Record<string, { count: number; total: number; cash: number; digital: number }> = {};
  allPayments.forEach((p) => {
    const staff = p.collectedBy || 'Front Desk';
    if (!staffSummary[staff]) {
      staffSummary[staff] = { count: 0, total: 0, cash: 0, digital: 0 };
    }
    staffSummary[staff].count += 1;
    staffSummary[staff].total += p.amount;
    if (p.mode === 'Cash') {
      staffSummary[staff].cash += p.amount;
    } else {
      staffSummary[staff].digital += p.amount;
    }
  });

  const filteredPayments = allPayments.filter((p) => {
    if (filterMode === 'All') return true;
    return p.mode === filterMode;
  });

  const handleConfirmDayClose = () => {
    addAuditLog({
      user: 'accountant',
      role: 'accountant',
      action: 'Day Close Reconciled',
      module: 'Finance',
      detail: `Cash in hand: ₹${cashTotal.toLocaleString('en-IN')} · UPI: ₹${upiTotal.toLocaleString('en-IN')} · Net: ₹${totalCollections.toLocaleString('en-IN')}`,
      reason: 'End-of-day counter closing settlement',
      isAlert: false,
    });
    setDayCloseSuccess(true);
    setTimeout(() => {
      setIsDayCloseModalOpen(false);
      setDayCloseSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Finance & Collections
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Front counter receipts, staff drawer accountability, payment modes & day closing
          </p>
        </div>
        <button
          onClick={() => setIsDayCloseModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition-colors"
        >
          <span>✓</span>
          Reconcile & Close Day
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Collections"
          value={`₹${totalCollections.toLocaleString('en-IN')}`}
          subtitle={`${allPayments.length} receipts generated`}
        />
        <StatCard
          title="Cash in Hand"
          value={`₹${cashTotal.toLocaleString('en-IN')}`}
          subtitle="Physical cash drawer"
        />
        <StatCard
          title="UPI / QR Payments"
          value={`₹${upiTotal.toLocaleString('en-IN')}`}
          subtitle="Direct bank transfers"
        />
        <StatCard
          title="POS / Cheque / NEFT"
          value={`₹${cardBankTotal.toLocaleString('en-IN')}`}
          subtitle="Card swipe & bank credits"
        />
      </div>

      {/* Staff Accountability Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Staff Drawer & Shift Accountability
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(staffSummary).map(([staffName, data]) => (
            <div
              key={staffName}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {staffName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {data.count} bills
                </span>
              </div>
              <div className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                ₹{data.total.toLocaleString('en-IN')}
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>Cash: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{data.cash.toLocaleString('en-IN')}</span></div>
                <div>Digital: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{data.digital.toLocaleString('en-IN')}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Book Table with Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Collection Register (Day Book)
          </h2>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Cash', 'UPI', 'Card', 'Bank transfer', 'Cheque'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Bill / Ref</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Cashier / Staff</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No payment receipts matching mode &quot;{filterMode}&quot;
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs">{p.date}</td>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {p.billNo}
                        <div className="text-[10px] text-slate-400 font-normal">{p.reference}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {p.regNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900 dark:text-slate-200">
                        {p.customerName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            p.mode === 'Cash'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : p.mode === 'UPI'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          }`}
                        >
                          {p.mode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{p.collectedBy}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Day Close Modal */}
      <Modal
        isOpen={isDayCloseModalOpen}
        onClose={() => setIsDayCloseModalOpen(false)}
        title="Reconcile & Close Cash Drawer"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Verify total cash drawer balance against collected receipts before generating the daily settlement report.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Physical Cash in Drawer:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{cashTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">UPI / QR Settlements:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{upiTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">POS / Card & Bank Credits:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{cardBankTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
              <span className="text-slate-900 dark:text-white">Grand Collection:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                ₹{totalCollections.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {dayCloseSuccess ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm text-center font-semibold">
              ✓ Day close settled successfully! Audit log updated.
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsDayCloseModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDayClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs"
              >
                Confirm Settlement
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
