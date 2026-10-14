import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { InsuranceClaim } from '../types';

export const InsurancePage: React.FC = () => {
  const { insuranceClaims } = useData();

  const [activeBook, setActiveBook] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Calculations
  const totalBilled = insuranceClaims.reduce((sum, c) => sum + c.billedAmount, 0);
  const totalApproved = insuranceClaims.reduce((sum, c) => sum + c.approvedAmount, 0);
  const totalReceived = insuranceClaims.reduce((sum, c) => sum + c.receivedAmount, 0);
  const totalToCollect = insuranceClaims.reduce((sum, c) => sum + c.toCollectAmount, 0);
  const approvalGap = totalBilled - totalApproved;

  const filtered = insuranceClaims.filter((c) => {
    const matchesBook = activeBook === 'all' || c.book === activeBook;
    const matchesStatus = activeStatus === 'all' || c.status.toLowerCase() === activeStatus.toLowerCase();
    const matchesSearch =
      c.claimNo.toLowerCase().includes(search.toLowerCase()) ||
      c.regNo.toLowerCase().includes(search.toLowerCase()) ||
      c.insurer.toLowerCase().includes(search.toLowerCase()) ||
      c.surveyorName.toLowerCase().includes(search.toLowerCase());

    return matchesBook && matchesStatus && matchesSearch;
  });

  const books = [
    { key: 'all', label: 'All Insurance Books', count: insuranceClaims.length },
    { key: 'uiic_nia', label: 'UIIC / NIA PSU Book', count: insuranceClaims.filter((c) => c.book === 'uiic_nia').length },
    { key: 'policy_bazaar', label: 'Policy Bazaar Desk', count: insuranceClaims.filter((c) => c.book === 'policy_bazaar').length },
    { key: 'tie_up', label: 'Cashless Tie-up', count: insuranceClaims.filter((c) => c.book === 'tie_up').length },
    { key: 'others', label: 'Private Insurers', count: insuranceClaims.filter((c) => c.book === 'others').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Insurance Claims Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cashless accident claims, surveyor coordination, insurer books & liability settlements
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Claims Billed"
          value={`₹${totalBilled.toLocaleString('en-IN')}`}
          subtitle="Estimated repair estimate value"
        />
        <StatCard
          title="Approved Amount"
          value={`₹${totalApproved.toLocaleString('en-IN')}`}
          subtitle="Sanctioned by loss assessor"
        />
        <StatCard
          title="Insurer Payout Received"
          value={`₹${totalReceived.toLocaleString('en-IN')}`}
          subtitle="Credited to workshop account"
        />
        <StatCard
          title="Disallowance Gap"
          value={`₹${approvalGap.toLocaleString('en-IN')}`}
          subtitle="Depreciation / customer copay"
        />
      </div>

      {/* Book Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {books.map((b) => (
            <button
              key={b.key}
              onClick={() => setActiveBook(b.key)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeBook === b.key
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {b.label} ({b.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search claim no, reg no, insurer, or surveyor..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'open', 'awaiting survey', 'approved', 'settled'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                  activeStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Claim Details</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Insurance Company</th>
                  <th className="px-4 py-3">Surveyor</th>
                  <th className="px-4 py-3 text-right">Billed Amount</th>
                  <th className="px-4 py-3 text-right">Approved Amount</th>
                  <th className="px-4 py-3 text-right">Customer Share</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No insurance claims found for this selection.
                    </td>
                  </tr>
                ) : (
                  filtered.map((claim) => (
                    <tr
                      key={claim.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                          {claim.claimNo}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {claim.date} · {claim.billType}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {claim.regNo}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5">{claim.vehicleName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">
                          {claim.insurer}
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {claim.book.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {claim.surveyorName}
                        </div>
                        {claim.surveyDate && (
                          <div className="text-[10px] text-slate-400">Survey: {claim.surveyDate}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-900 dark:text-white">
                        ₹{claim.billedAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{claim.approvedAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        ₹{claim.customerBearsAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            claim.status === 'Settled'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : claim.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                              : claim.status === 'Awaiting Survey'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
