import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const PayrollPage: React.FC = () => {
  const { payrollRecords, runPayroll, addAuditLog } = useData();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [search, setSearch] = useState('');
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isDisbursed, setIsDisbursed] = useState(false);

  // Filter records by month
  const monthRecords = payrollRecords.filter((r) => r.month === selectedMonth || r.month === 'October 2026');

  // Financial aggregates
  const totalGross = monthRecords.reduce((sum, r) => sum + r.grossPlusAdd, 0);
  const totalDeductions = monthRecords.reduce((sum, r) => sum + r.totalDeduction, 0);
  const totalNetSalary = monthRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalEmployerStatutory = monthRecords.reduce((sum, r) => sum + r.employerEpf + r.employerEsi, 0);

  const filtered = monthRecords.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(q) ||
      r.employeeCode.toLowerCase().includes(q) ||
      r.designation.toLowerCase().includes(q)
    );
  });

  const handleExecuteRun = () => {
    runPayroll(selectedMonth);
    setIsRunModalOpen(false);
  };

  const handleDisburseAll = () => {
    setIsDisbursed(true);
    addAuditLog({
      user: 'accountant',
      role: 'accountant',
      action: 'Salaries Disbursed via Bank NEFT',
      module: 'Payroll',
      detail: `${selectedMonth} Batch · Net Payout: ₹${totalNetSalary.toLocaleString('en-IN')} across ${monthRecords.length} staff`,
      reason: 'Monthly wage disbursal approved by management',
      isAlert: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workshop Payroll & Salary Register
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Biometric loss of pay, overtime, EPF/ESI deductions & direct bank salary sheet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          >
            <option value="2026-10">October 2026 (Active)</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </select>
          <button
            onClick={() => setIsRunModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50"
          >
            ⚡ Calculate Run
          </button>
          <button
            onClick={handleDisburseAll}
            disabled={isDisbursed}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50"
          >
            <span>{isDisbursed ? '✓' : '💳'}</span>
            {isDisbursed ? 'Salaries Transferred' : 'Disburse Net Pay'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Wage Bill"
          value={`₹${totalGross.toLocaleString('en-IN')}`}
          subtitle={`${monthRecords.length} staff processed`}
        />
        <StatCard
          title="Total Deductions (LOP+PF)"
          value={`₹${totalDeductions.toLocaleString('en-IN')}`}
          subtitle="Absence and employee statutory"
        />
        <StatCard
          title="Net Take-Home Pay"
          value={`₹${totalNetSalary.toLocaleString('en-IN')}`}
          subtitle="Net bank transfer requirement"
        />
        <StatCard
          title="Employer Statutory Load"
          value={`₹${totalEmployerStatutory.toLocaleString('en-IN')}`}
          subtitle="Employer EPF + ESI deposit"
        />
      </div>

      {/* Search and Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff code, name, designation..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> staff entries for {selectedMonth}
          </div>
        </div>

        {/* Salary Register Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3 text-right">Gross</th>
                  <th className="px-4 py-3 text-center">Leaves (LOP)</th>
                  <th className="px-4 py-3 text-right">EPF (12%)</th>
                  <th className="px-4 py-3 text-right">ESI (0.75%)</th>
                  <th className="px-4 py-3 text-right">Total Ded.</th>
                  <th className="px-4 py-3 text-right">Net Payable</th>
                  <th className="px-4 py-3 text-center">Disbursal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No payroll records found. Click &quot;Calculate Run&quot; to generate for this month.
                    </td>
                  </tr>
                ) : (
                  filtered.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {record.employeeCode}
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-white mt-1">
                          {record.employeeName}
                        </div>
                        <div className="text-[11px] text-slate-400">{record.designation}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{record.grossPlusAdd.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center text-xs">
                        {record.leaveDays > 0 ? (
                          <div>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono">
                              {record.leaveDays}d
                            </span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              -₹{record.lossOfPay.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Full</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                        {record.epfEmployee > 0 ? `₹${record.epfEmployee.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                        {record.esiEmployee > 0 ? `₹${record.esiEmployee.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold">
                        -₹{record.totalDeduction.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{record.netSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            isDisbursed || record.salaryPaid === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {isDisbursed ? 'Paid' : record.salaryPaid}
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

      {/* Calculate Run Modal */}
      <Modal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        title={`Execute Payroll Calculation: ${selectedMonth}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            This will calculate salaries for all 27 employees by matching attendance punch registers, calculating statutory EPF/ESI ceilings, and applying loss of pay.
          </p>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Target Month:</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Eligible Staff:</span>
              <span className="font-bold text-slate-900 dark:text-white">27 Employees</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">EPF Rate:</span>
              <span className="font-bold text-slate-900 dark:text-white">12% Employee + 12% Employer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ESI Rate:</span>
              <span className="font-bold text-slate-900 dark:text-white">0.75% Employee + 3.25% Employer</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsRunModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteRun}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Run Calculation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
