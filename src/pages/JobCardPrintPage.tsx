import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Printer, ArrowLeft } from 'lucide-react';
import { TorqovaLogo } from '../components/Logo';

export const JobCardPrintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobCards } = useData();

  const job = jobCards.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Job card not found.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg"
        >
          Back to list
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top action bar - hidden during print */}
      <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Job Card</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Printable Invoice Page */}
      <div className="print-page max-w-4xl mx-auto bg-white text-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200">
        {/* Header Block */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TorqovaLogo size="md" subtitleText="Automotive Workshop OS" />
            </div>
            <div className="text-xs text-slate-600 mt-2">
              <div className="font-bold text-slate-900">TORQOVA WORKSHOP OS</div>
              <div>Plot 42, Phase 1, Electronic City Industrial Area, Bengaluru, Karnataka — 560100</div>
              <div>Phone: +91 80 4910 8800 · service@torqova.example.com</div>
              <div className="font-mono font-semibold text-slate-800 mt-0.5">
                GSTIN: 29AAACT9842K1Z4
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-md">
              Tax Invoice
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Original for Recipient
            </div>
            <div className="text-xs font-mono font-bold text-slate-800 mt-1">
              Invoice #{job.gateInNo}
            </div>
            <div className="text-xs text-slate-600">
              Date: <span className="font-semibold">{job.date}</span>
            </div>
          </div>
        </div>

        {/* 3-Column Meta Information Block */}
        <div className="grid grid-cols-3 gap-6 py-4 border-b border-slate-200 text-xs">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Billed To (Customer)
            </div>
            <div className="font-bold text-slate-900 text-sm">{job.customerName}</div>
            <div className="text-slate-600 mt-0.5">{job.customerMobile}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {job.customerGstin ? `GSTIN: ${job.customerGstin}` : 'Consumer (Unregistered)'}
            </div>
            {job.customerAddress && (
              <div className="text-slate-500 text-[11px]">{job.customerAddress}</div>
            )}
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Vehicle Information
            </div>
            <div className="font-mono font-extrabold text-slate-900 text-sm">{job.regNo}</div>
            <div className="font-semibold text-slate-700">{job.vehicleName}</div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              Fuel: {job.vehicleFuel} · Odo: {job.vehicleOdometer.toLocaleString('en-IN')} KM
            </div>
            {job.vehicleEngineNo && (
              <div className="text-slate-500 text-[10px] font-mono">
                Engine: {job.vehicleEngineNo}
              </div>
            )}
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Job Card Details
            </div>
            <div className="font-mono font-semibold text-blue-700">#{job.billNo}</div>
            <div className="text-slate-700 mt-0.5">
              Advisor: <span className="font-semibold">{job.advisorName}</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Contact: {job.advisorMobile}
            </div>
            <div className="text-slate-500 text-[11px]">
              Cover: <span className="font-semibold">{job.cover}</span>
            </div>
          </div>
        </div>

        {/* Parts Table */}
        <div className="py-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            A. Spare Parts & Materials
          </div>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Part Description</th>
                <th className="py-2 px-3 font-mono">HSN</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-right">Rate</th>
                <th className="py-2 px-3 text-right">CGST</th>
                <th className="py-2 px-3 text-right">SGST</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {job.parts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2.5 px-3 text-center text-slate-400">
                    Nil parts consumed
                  </td>
                </tr>
              ) : (
                job.parts.map((p) => {
                  const halfGst = (p.amount * (p.gstPercent / 100)) / 2;
                  return (
                    <tr key={p.id}>
                      <td className="py-2 px-3 font-medium text-slate-800">{p.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{p.hsn}</td>
                      <td className="py-2 px-3 text-center">{p.qty}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{p.rate.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">₹{halfGst.toFixed(2)} ({p.gstPercent / 2}%)</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">₹{halfGst.toFixed(2)} ({p.gstPercent / 2}%)</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">₹{p.amount.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
              <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                <td colSpan={6} className="py-2 px-3 text-right text-slate-700">Parts Subtotal:</td>
                <td className="py-2 px-3 text-right font-mono text-slate-900">₹{job.sparesTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Services & Labour Table */}
        <div className="py-2 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            B. Labour & Operations
          </div>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Service / Labour Description</th>
                <th className="py-2 px-3 font-mono">SAC</th>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-right">Rate</th>
                <th className="py-2 px-3 text-right">CGST</th>
                <th className="py-2 px-3 text-right">SGST</th>
                <th className="py-2 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {job.labour.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-2.5 px-3 text-center text-slate-400">
                    Nil labour operations
                  </td>
                </tr>
              ) : (
                job.labour.map((l) => {
                  const halfGst = (l.amount * (l.gstPercent / 100)) / 2;
                  return (
                    <tr key={l.id}>
                      <td className="py-2 px-3">
                        <span className="font-medium text-slate-800">{l.name}</span>
                        {l.technicianName && (
                          <span className="text-[10px] text-slate-400 ml-1.5">(Tech: {l.technicianName})</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-500">{l.sac}</td>
                      <td className="py-2 px-3 text-center">{l.qty}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{l.rate.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">₹{halfGst.toFixed(2)} ({l.gstPercent / 2}%)</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">₹{halfGst.toFixed(2)} ({l.gstPercent / 2}%)</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold">₹{l.amount.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
              <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                <td colSpan={6} className="py-2 px-3 text-right text-slate-700">Labour Subtotal:</td>
                <td className="py-2 px-3 text-right font-mono text-slate-900">₹{job.labourTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cost Summary Box */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
          <div className="space-y-3 text-xs text-slate-500">
            <div>
              <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Reported Complaint
              </div>
              <p className="mt-0.5 text-slate-700 italic">
                "{job.complaints || 'Periodic service'}"
              </p>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 leading-relaxed">
              Warranty: 30 days or 1,000 km on labour operations. Spares are subject to respective manufacturer terms. Goods once sold will not be taken back unless defective.
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Spares:</span>
              <span className="font-mono">₹{job.sparesTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Labour:</span>
              <span className="font-mono">₹{job.labourTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-800 border-t border-slate-200 pt-1.5">
              <span>Taxable Value:</span>
              <span className="font-mono">₹{job.taxableTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>CGST:</span>
              <span className="font-mono">₹{job.cgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>SGST:</span>
              <span className="font-mono">₹{job.sgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t-2 border-slate-900 pt-2">
              <span>Net Invoice Amount:</span>
              <span className="font-mono text-base text-blue-700">₹{Math.round(job.netTotal).toLocaleString('en-IN')}.00</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
              <span>Amount Received:</span>
              <span className="font-mono font-semibold text-emerald-700">
                ₹{job.payments.reduce((s, p) => s + p.amount, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-800">
              <span>Balance Payable:</span>
              <span className="font-mono text-red-600">
                {job.balanceDue > 0 ? `₹${Math.round(job.balanceDue).toLocaleString('en-IN')}.00` : '₹0.00 (Paid)'}
              </span>
            </div>
          </div>
        </div>

        {/* Signature Block */}
        <div className="grid grid-cols-2 gap-8 pt-12 text-xs">
          <div>
            <div className="border-t border-slate-400 w-48 pt-1 text-slate-500 font-medium">
              Customer's Signature
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="border-t border-slate-400 w-52 pt-1 text-slate-700 font-semibold">
              For TORQOVA WORKSHOP OS
            </div>
            <div className="text-[10px] text-slate-400">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
