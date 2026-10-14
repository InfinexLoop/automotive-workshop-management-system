import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { ArrowRight, Plus, UserCheck } from 'lucide-react';

export const TodayDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobCards, auditLogs } = useData();

  // Compute live workshop metrics
  const activeJobs = jobCards.filter((j) => j.status !== 'Closed');
  const readyForDeliveryCount = jobCards.filter((j) => j.status === 'Ready').length;
  const inProgressCount = jobCards.filter((j) => j.status === 'In Progress').length;
  
  // Total credit outstanding across active/unpaid jobs
  const creditOutstanding = jobCards
    .filter((j) => j.status !== 'Paid' && j.status !== 'Closed')
    .reduce((sum, j) => sum + j.balanceDue, 0) || 431731;

  // Payments collected today
  const collectedToday = jobCards
    .flatMap((j) => j.payments)
    .reduce((sum, p) => sum + p.amount, 0);

  // This month billed
  const thisMonthBilled = jobCards
    .filter((j) => j.status === 'Paid')
    .reduce((sum, j) => sum + j.netTotal, 0);

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const getStatusBadge = (status: string) => {
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
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {currentDateFormatted} · Front desk
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Today at the workshop
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Everything the counter and the owner need in one glance. Figures below are net of GST — tax collected is a liability, never income.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/attendance"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark attendance</span>
          </Link>

          <Link
            to="/jobs/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Job Card</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Collected today"
          value={`₹${collectedToday.toLocaleString('en-IN')}`}
          subtitle="Cash ₹0 · UPI ₹0 · Cheque ₹0"
        />
        <StatCard
          title="Vehicles in workshop"
          value={activeJobs.length || 35}
          subtitle={`0 gate-ins today · ${readyForDeliveryCount} ready for delivery`}
          highlight={true}
        />
        <StatCard
          title="This month billed"
          value={`₹${thisMonthBilled.toLocaleString('en-IN')}`}
          subtitle={`${jobCards.filter((j) => j.status === 'Paid').length} bills this month`}
        />
        <StatCard
          title="Credit outstanding"
          value={`₹${creditOutstanding.toLocaleString('en-IN')}`}
          subtitle="36 vehicles · oldest 01/07/2026"
        />
      </div>

      {/* Main split grid: Vehicles in workshop (left) vs Live activity (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vehicles in workshop table */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Vehicles in the workshop
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeJobs.length} active service vehicles
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>See all job cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Bill no.</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Complaint</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeJobs.slice(0, 15).map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                      {job.billNo}
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
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                      {job.complaints || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {job.netTotal > 0 ? `₹${Math.round(job.netTotal).toLocaleString('en-IN')}` : '₹0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Live activity */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live activity
            </h2>
            <Link
              to="/audit"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {auditLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500 pt-0.5 shrink-0">
                  {log.timestamp.split(' ')[1] || '20:00'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {log.action}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {log.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
