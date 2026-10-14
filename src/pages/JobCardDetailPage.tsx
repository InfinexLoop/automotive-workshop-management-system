import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { JobCardStatus } from '../types';
import { Printer, Edit3, ArrowLeft, CheckCircle2, CreditCard, ChevronRight } from 'lucide-react';
import { Modal } from '../components/Modal';

export const JobCardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobCards, updateJobCardStatus, addPaymentToJobCard } = useData();

  const job = jobCards.find((j) => j.id === id);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Cheque' | 'Card' | 'Bank transfer'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');
  const [collector, setCollector] = useState('Aditya Kulkarni');

  if (!job) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Job card not found
        </h2>
        <button
          onClick={() => navigate('/jobs')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white"
        >
          Back to all job cards
        </button>
      </div>
    );
  }

  const steps: JobCardStatus[] = ['Open', 'In Progress', 'Ready', 'Delivered', 'Paid', 'Closed'];
  const currentStepIndex = steps.indexOf(job.status);

  const handleOpenPayment = () => {
    setPaymentAmount(Math.round(job.balanceDue));
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;

    addPaymentToJobCard(job.id, {
      date: new Date().toLocaleDateString('en-GB'),
      mode: paymentMode,
      reference: paymentRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      collectedBy: collector,
      amount: Number(paymentAmount),
    });

    setIsPaymentModalOpen(false);
    setPaymentRef('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with metadata and actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
            <span>{job.billNo}</span>
            <span>·</span>
            <span>{job.gateInNo}</span>
            <span>·</span>
            <span>{job.date}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
              {job.regNo}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                job.status === 'Paid'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : job.status === 'Ready'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {job.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {job.vehicleName} · {job.customerName} · {job.customerMobile}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {job.balanceDue > 0 && (
            <button
              onClick={handleOpenPayment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Take Payment (₹{Math.round(job.balanceDue).toLocaleString('en-IN')})</span>
            </button>
          )}

          <Link
            to={`/jobs/${job.id}/print`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Invoice / Print</span>
          </Link>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Progress
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Currently: <span className="font-bold text-slate-800 dark:text-slate-200">{job.status}</span>
          </span>
        </div>

        {/* Stepper bubbles */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
          {steps.map((st, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <button
                key={st}
                onClick={() => updateJobCardStatus(job.id, st)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 hover:bg-slate-200'
                }`}
              >
                {isCompleted && !isCurrent && <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                <span>{st}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spares, Labour, Payments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Spares Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Spares
              </h2>
              <span className="text-xs text-slate-400">
                {job.parts.length} {job.parts.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Part</th>
                    <th className="py-2.5 px-3">HSN</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Rate</th>
                    <th className="py-2.5 px-3">GST</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {job.parts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        No parts added to this job card.
                      </td>
                    </tr>
                  ) : (
                    job.parts.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {p.hsn}
                        </td>
                        <td className="py-2.5 px-3">
                          {p.qty}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          ₹{p.rate.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {p.gstPercent}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          ₹{p.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  {job.parts.length > 0 && (
                    <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-semibold">
                      <td colSpan={5} className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        Spare amount
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white">
                        ₹{job.sparesTotal.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Labour Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Labour
              </h2>
              <span className="text-xs text-slate-400">
                {job.labour.length} operations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Work done</th>
                    <th className="py-2.5 px-3">SAC</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Rate</th>
                    <th className="py-2.5 px-3">GST</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {job.labour.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        No labour operations recorded.
                      </td>
                    </tr>
                  ) : (
                    job.labour.map((l) => (
                      <tr key={l.id}>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {l.name}
                          </div>
                          {l.technicianName && (
                            <div className="text-[11px] text-slate-400">
                              by {l.technicianName}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {l.sac}
                        </td>
                        <td className="py-2.5 px-3">
                          {l.qty}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          ₹{l.rate.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {l.gstPercent}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          ₹{l.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  {job.labour.length > 0 && (
                    <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-semibold">
                      <td colSpan={5} className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        Labour amount
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 dark:text-white">
                        ₹{job.labourTotal.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments Received Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Payments received
              </h2>
              {job.balanceDue > 0 && (
                <button
                  onClick={handleOpenPayment}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Add Payment
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Collected by</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {job.payments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No payments received yet.
                      </td>
                    </tr>
                  ) : (
                    job.payments.map((pay) => (
                      <tr key={pay.id}>
                        <td className="py-2.5 px-3 text-slate-500">
                          {pay.date}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {pay.mode}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">
                          {pay.reference || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          {pay.collectedBy}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          ₹{pay.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  {job.payments.length > 0 && (
                    <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-semibold">
                      <td colSpan={4} className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        Total Received
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400">
                        ₹{job.payments.reduce((s, p) => s + p.amount, 0).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Costing Summary */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Costing
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Spare amount</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  ₹{job.sparesTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Labour amount</span>
                <span className="font-mono text-slate-900 dark:text-white font-medium">
                  ₹{job.labourTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Gross</span>
                <span className="font-mono">
                  ₹{job.grossTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Taxable value</span>
                <span className="font-mono">
                  ₹{job.taxableTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>CGST</span>
                <span className="font-mono">
                  ₹{job.cgstTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>SGST</span>
                <span className="font-mono">
                  ₹{job.sgstTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Net Invoice
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Inclusive of taxes
                  </div>
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  ₹{Math.round(job.netTotal).toLocaleString('en-IN')}.00
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Balance Due</span>
                <span className={`font-mono font-bold ${job.balanceDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {job.balanceDue > 0 ? `₹${Math.round(job.balanceDue).toLocaleString('en-IN')}.00` : 'Fully paid'}
                </span>
              </div>
            </div>

            {job.balanceDue > 0 ? (
              <button
                onClick={handleOpenPayment}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Receive Payment</span>
              </button>
            ) : (
              <div className="w-full mt-3 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
                ✓ Fully Settled
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        subtitle={`Collect bill settlement for ${job.billNo} (${job.regNo})`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              max={job.balanceDue}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Remaining balance due: ₹{Math.round(job.balanceDue).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={(e: any) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white"
            >
              <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Cash">Cash (Physical Cash Drawer)</option>
              <option value="Bank transfer">Bank Transfer (IMPS / NEFT)</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transaction Reference / UTR
            </label>
            <input
              type="text"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="UPI/NEFT Txn ID or Cheque No."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Collected By
            </label>
            <input
              type="text"
              value={collector}
              onChange={(e) => setCollector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
