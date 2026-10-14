import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Search, Plus, Filter } from 'lucide-react';
import { JobCardCover, JobCardStatus } from '../types';

export const JobCardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobCards } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  const coverParam = searchParams.get('cover'); // 'insurance' | 'own' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Compute counts
  const totalCount = jobCards.length;
  const insuranceCount = jobCards.filter((j) => j.cover === 'Insurance').length;
  const customerPaidCount = jobCards.filter((j) => j.cover === 'Customer paid').length;

  const filteredJobs = jobCards.filter((job) => {
    // Filter by cover tab
    if (coverParam === 'insurance' && job.cover !== 'Insurance') return false;
    if (coverParam === 'own' && job.cover !== 'Customer paid') return false;

    // Filter by status
    if (statusFilter !== 'All' && job.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBill = job.billNo.toLowerCase().includes(q);
      const matchReg = job.regNo.toLowerCase().includes(q);
      const matchCust = job.customerName.toLowerCase().includes(q);
      const matchVehicle = job.vehicleName.toLowerCase().includes(q);
      const matchAdvisor = job.advisorName.toLowerCase().includes(q);
      if (!matchBill && !matchReg && !matchCust && !matchVehicle && !matchAdvisor) return false;
    }

    return true;
  });

  const getStatusBadge = (status: JobCardStatus) => {
    switch (status) {
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      case 'Ready':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'Paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'Delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      case 'Open':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Front desk
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Job cards & bills
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            One record per vehicle visit — from gate-in to paid invoice. Click any row to open the bill, take a payment or print it.
          </p>
        </div>

        <Link
          to="/jobs/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors self-start sm:self-auto shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Job Card</span>
        </Link>
      </div>

      {/* Filter by Cover tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setSearchParams({})}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              !coverParam
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            All <span className="ml-1 opacity-70">({totalCount})</span>
          </button>
          <button
            onClick={() => setSearchParams({ cover: 'insurance' })}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              coverParam === 'insurance'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            Insurance <span className="ml-1 opacity-70">({insuranceCount})</span>
          </button>
          <button
            onClick={() => setSearchParams({ cover: 'own' })}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              coverParam === 'own'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            Customer paid <span className="ml-1 opacity-70">({customerPaidCount})</span>
          </button>
        </div>

        {/* Search & Status filter controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bill, vehicle, customer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Paid">Paid</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Job Cards Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Bill no.</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Cover</th>
                <th className="py-3.5 px-4">Advisor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Spares</th>
                <th className="py-3.5 px-4 text-right">Labour</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    No matching job cards found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                      {job.billNo}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {job.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {job.regNo}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {job.vehicleName}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {job.customerName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {job.cover === 'Insurance' ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Insurance</span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {job.advisorName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                      {job.sparesTotal > 0 ? Math.round(job.sparesTotal).toLocaleString('en-IN') : '0'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                      {job.labourTotal > 0 ? Math.round(job.labourTotal).toLocaleString('en-IN') : '0'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {job.netTotal > 0 ? Math.round(job.netTotal).toLocaleString('en-IN') : '0'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-600 dark:text-slate-300">
                      {job.balanceDue > 0 ? (
                        <span className="text-red-600 dark:text-red-400">
                          {Math.round(job.balanceDue).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
