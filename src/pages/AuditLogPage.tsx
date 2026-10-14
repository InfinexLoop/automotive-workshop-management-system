import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useData();

  const [moduleFilter, setModuleFilter] = useState('All');
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const [search, setSearch] = useState('');

  const totalLogs = auditLogs.length;
  const alertLogsCount = auditLogs.filter((l) => l.isAlert).length;

  const modules = ['All', 'Billing', 'Finance', 'Customers', 'Estimates', 'Payroll', 'Attendance', 'Supplier', 'People', 'Security'];

  const filtered = auditLogs.filter((log) => {
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    const matchesAlert = !onlyAlerts || log.isAlert;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.reason.toLowerCase().includes(search.toLowerCase());

    return matchesModule && matchesAlert && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit Log & Security Trail
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable system audit logs tracking cashier entries, status changes, bill creation & security alerts
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Events Logged"
          value={totalLogs}
          subtitle="Chronological audit records"
        />
        <StatCard
          title="Security Alerts"
          value={alertLogsCount}
          subtitle="Exceptions requiring audit"
        />
        <StatCard
          title="Active Cashier Audits"
          value={auditLogs.filter((l) => l.module === 'Finance').length}
          subtitle="Receipts and drawer events"
        />
        <StatCard
          title="Job Card Workflows"
          value={auditLogs.filter((l) => l.module === 'Billing').length}
          subtitle="Status transitions recorded"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, bill number, or reason..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyAlerts}
              onChange={(e) => setOnlyAlerts(e.target.checked)}
              className="rounded-sm text-rose-600 focus:ring-rose-500"
            />
            <span>🛡️ Show Security Alerts Only ({alertLogsCount})</span>
          </label>
        </div>

        {/* Modules Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                moduleFilter === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Audit Stream Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User & Role</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Detail</th>
                  <th className="px-4 py-3">Context / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-sans">
                      No audit events match the current criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        log.isAlert ? 'bg-rose-50/30 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-sans">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {log.user}
                        </span>
                        <span className="ml-1.5 text-[10px] uppercase px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                          {log.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                          {log.module}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                        {log.isAlert && <span className="mr-1">⚠️</span>}
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                        {log.detail}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-500 dark:text-slate-400">
                        {log.reason}
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
