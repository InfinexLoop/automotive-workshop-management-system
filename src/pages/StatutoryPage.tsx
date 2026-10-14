import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';

export const StatutoryPage: React.FC = () => {
  const { employees, payrollRecords } = useData();

  const [month, setMonth] = useState('2026-10');

  // Calculate EPF & ESI totals
  const epfEligibleRecords = payrollRecords.filter((r) => (r.month === month || r.month === 'October 2026') && r.epfEmployee > 0);
  const esiEligibleRecords = payrollRecords.filter((r) => (r.month === month || r.month === 'October 2026') && r.esiEmployee > 0);

  const totalEmployeeEpf = epfEligibleRecords.reduce((sum, r) => sum + r.epfEmployee, 0);
  const totalEmployerEpf = epfEligibleRecords.reduce((sum, r) => sum + r.employerEpf, 0);
  const totalEpfDeposit = totalEmployeeEpf + totalEmployerEpf;

  // EPF statutory break-up
  const epfAc1Employee = totalEmployeeEpf; // 12%
  const epfAc10EmployerPension = Math.round(totalEmployerEpf * (8.33 / 12)); // 8.33% EPS
  const epfAc1EmployerPf = totalEmployerEpf - epfAc10EmployerPension; // 3.67% EPF
  const epfAc2Admin = Math.round(totalEmployeeEpf * (0.5 / 12)); // 0.5% Admin
  const epfAc21Edli = Math.round(totalEmployeeEpf * (0.5 / 12)); // 0.5% EDLI

  // ESI break-up
  const totalEmployeeEsi = esiEligibleRecords.reduce((sum, r) => sum + r.esiEmployee, 0);
  const totalEmployerEsi = esiEligibleRecords.reduce((sum, r) => sum + r.employerEsi, 0);
  const totalEsiDeposit = totalEmployeeEsi + totalEmployerEsi;

  const totalStatutoryLiability = totalEpfDeposit + epfAc2Admin + epfAc21Edli + totalEsiDeposit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            EPF & ESI Statutory Compliance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Provident Fund ECR challan, Employee State Insurance returns & government dues ledger
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          >
            <option value="2026-10">October 2026 (Active)</option>
            <option value="2026-09">September 2026</option>
            <option value="2026-08">August 2026</option>
          </select>
          <button
            onClick={() => alert(`Simulated: Downloaded EPFO Electronic Challan Return (ECR) for ${month}`)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            ⬇ Download ECR File
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Statutory Deposit"
          value={`₹${totalStatutoryLiability.toLocaleString('en-IN')}`}
          subtitle="Combined EPFO + ESIC liability"
        />
        <StatCard
          title="Total EPF Challan (A/c 1,2,10,21)"
          value={`₹${(totalEpfDeposit + epfAc2Admin + epfAc21Edli).toLocaleString('en-IN')}`}
          subtitle={`${epfEligibleRecords.length} enrolled members`}
        />
        <StatCard
          title="Total ESI Challan"
          value={`₹${totalEsiDeposit.toLocaleString('en-IN')}`}
          subtitle={`${esiEligibleRecords.length} insured workers`}
        />
        <StatCard
          title="Next Due Date"
          value="15th April 2026"
          subtitle="Mandatory monthly filing window"
        />
      </div>

      {/* Challan Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EPF Challan Structure */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              EPFO Challan Break-up (Monthly)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold">
              EPF Code: KN/BNG/0074128/000
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">A/c No. 01 — Employee Share (12%):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{epfAc1Employee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">A/c No. 01 — Employer EPF Difference (3.67%):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{epfAc1EmployerPf.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">A/c No. 10 — Employer Pension Scheme (8.33% EPS):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{epfAc10EmployerPension.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">A/c No. 02 — EPFO Admin Charges (0.50%):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{epfAc2Admin.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">A/c No. 21 — EDLI Insurance Fund (0.50%):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{epfAc21Edli.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold text-slate-900 dark:text-white">
              <span>Total EPF Net Challan:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                ₹{(totalEpfDeposit + epfAc2Admin + epfAc21Edli).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* ESI Challan Structure */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              ESIC Challan Break-up (Monthly)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold">
              ESI Sub-code: 53000741280001002
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Employee Contribution (0.75% of Gross):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{totalEmployeeEsi.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Employer Contribution (3.25% of Gross):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{totalEmployerEsi.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Statutory Wage Ceiling:</span>
              <span className="font-mono font-semibold text-slate-500">₹21,000 / month</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-600 dark:text-slate-400">Insured Technicians / Staff:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{esiEligibleRecords.length} workers</span>
            </div>
            <div className="flex justify-between pt-6 text-base font-bold text-slate-900 dark:text-white">
              <span>Total ESI Net Challan:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                ₹{totalEsiDeposit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Roster Statement */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Member-wise Statutory Deposit Register ({month})
        </h2>

        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">UAN / ESI Number</th>
                  <th className="px-4 py-3 text-right">Earned Gross</th>
                  <th className="px-4 py-3 text-right">Employee EPF</th>
                  <th className="px-4 py-3 text-right">Employer EPF</th>
                  <th className="px-4 py-3 text-right">Employee ESI</th>
                  <th className="px-4 py-3 text-right">Employer ESI</th>
                  <th className="px-4 py-3 text-right">Total Statutory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payrollRecords
                  .filter((r) => r.month === month)
                  .map((rec) => {
                    const emp = employees.find((e) => e.id === rec.employeeId);
                    const memberTotal = rec.epfEmployee + rec.employerEpf + rec.esiEmployee + rec.employerEsi;

                    return (
                      <tr
                        key={rec.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            {rec.employeeCode}
                          </span>
                          <span className="ml-2 font-semibold text-slate-900 dark:text-white">
                            {rec.employeeName}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          <div>UAN: {emp?.uan || '—'}</div>
                          <div>ESI: {emp?.esiNo || '—'}</div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                          ₹{rec.grossPlusAdd.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                          {rec.epfEmployee > 0 ? `₹${rec.epfEmployee.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                          {rec.employerEpf > 0 ? `₹${rec.employerEpf.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400">
                          {rec.esiEmployee > 0 ? `₹${rec.esiEmployee.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400">
                          {rec.employerEsi > 0 ? `₹${rec.employerEsi.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ₹{memberTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
