import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const AttendancePage: React.FC = () => {
  const { dailyPunches, employees, recordDailyPunch, addAuditLog } = useData();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Manual Punch Form
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [punchInTime, setPunchInTime] = useState('09:00');
  const [punchOutTime, setPunchOutTime] = useState('18:00');
  const [statusVal, setStatusVal] = useState<'Present' | 'Absent' | 'Half Day' | 'Weekly Off'>('Present');

  // Stats
  const totalRoster = dailyPunches.length;
  const presentCount = dailyPunches.filter((p) => p.status === 'Present').length;
  const onTimeCount = dailyPunches.filter((p) => p.isOnTime && p.status === 'Present').length;
  const absentCount = dailyPunches.filter((p) => p.status === 'Absent').length;
  const attendanceRate = totalRoster > 0 ? Math.round((presentCount / totalRoster) * 100) : 0;

  const filtered = dailyPunches.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      p.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      p.designation.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleSyncBiometric = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addAuditLog({
        user: 'admin',
        role: 'admin',
        action: 'Biometric Terminal Synchronized',
        module: 'Attendance',
        detail: `eSSL Bio-station sync: ${presentCount} present, ${onTimeCount} on-time, ${absentCount} absents`,
        reason: 'Automated fingerprint scanner terminal poll',
        isAlert: false,
      });
    }, 900);
  };

  const handleManualPunch = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find((x) => x.id === selectedEmpId);
    if (!emp) return;

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const [h] = punchInTime.split(':').map(Number);
    const isOnTime = h < 9 || (h === 9 && Number(punchInTime.split(':')[1]) <= 15);

    recordDailyPunch({
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: emp.name,
      designation: emp.designation,
      date: dateStr,
      punchIn: punchInTime,
      punchOut: punchOutTime,
      isOnTime,
      status: statusVal,
    });

    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Attendance & Biometric Register
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Fingerprint time clock sync, shop floor punctuality, late marks & loss-of-pay tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50"
          >
            + Manual Punch Entry
          </button>
          <button
            onClick={handleSyncBiometric}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <span>{isSyncing ? '⏳' : '🔄'}</span>
            {isSyncing ? 'Polling Terminal...' : 'Sync Biometrics'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Floor Attendance"
          value={`${attendanceRate}%`}
          subtitle={`${presentCount} of ${totalRoster} staff present`}
        />
        <StatCard
          title="On-Time Arrivals"
          value={onTimeCount}
          subtitle="Punched before 09:15 AM"
        />
        <StatCard
          title="Late Marks"
          value={presentCount - onTimeCount}
          subtitle="Arrived after grace window"
        />
        <StatCard
          title="Reported Absents"
          value={absentCount}
          subtitle="Leave / loss of pay (LOP)"
        />
      </div>

      {/* Filters and Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee code, name..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['All', 'Present', 'Absent', 'Half Day'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Punch Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Code & Name</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3 text-center">Punch In</th>
                  <th className="px-4 py-3 text-center">Punch Out</th>
                  <th className="px-4 py-3 text-center">Punctuality</th>
                  <th className="px-4 py-3 text-right">Floor Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No attendance punches found for this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((punch) => (
                    <tr
                      key={punch.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {punch.employeeCode}
                        </span>
                        <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                          {punch.employeeName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{punch.designation}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {punch.punchIn || '—'}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-slate-900 dark:text-white">
                        {punch.punchOut || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {punch.status === 'Present' ? (
                          punch.isOnTime ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                              ✓ On Time
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                              ⚠️ Late Punch
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            punch.status === 'Present'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : punch.status === 'Half Day'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          }`}
                        >
                          {punch.status}
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

      {/* Manual Punch Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Override Manual Punch"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleManualPunch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Select Staff Member *
            </label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.code} - {emp.name} ({emp.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Punch In Time
              </label>
              <input
                type="time"
                value={punchInTime}
                onChange={(e) => setPunchInTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Punch Out Time
              </label>
              <input
                type="time"
                value={punchOutTime}
                onChange={(e) => setPunchOutTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Status Override
            </label>
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Present">Present</option>
              <option value="Half Day">Half Day</option>
              <option value="Absent">Absent (LOP)</option>
              <option value="Weekly Off">Weekly Off</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Punch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
