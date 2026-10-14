import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';

export const ReportsPage: React.FC = () => {
  const { jobCards, inventory } = useData();

  const [dateRange, setDateRange] = useState('Month to Date');

  // Aggregates
  const totalBilled = jobCards.reduce((sum, j) => sum + j.netTotal, 0);
  const totalSpares = jobCards.reduce((sum, j) => sum + j.sparesTotal, 0);
  const totalLabour = jobCards.reduce((sum, j) => sum + j.labourTotal, 0);
  const totalTax = jobCards.reduce((sum, j) => sum + j.cgstTotal + j.sgstTotal, 0);

  const sparesRatio = totalBilled > 0 ? Math.round((totalSpares / totalBilled) * 100) : 0;
  const labourRatio = 100 - sparesRatio;

  // GSTR-1 Rate-wise Break-up
  const gstBreakup = [
    { rate: '18% GST (Labour & Spares)', taxable: Math.round(totalBilled * 0.72 / 1.18), cgst: Math.round(totalTax * 0.72 / 2), sgst: Math.round(totalTax * 0.72 / 2) },
    { rate: '28% GST (Batteries & Tyres)', taxable: Math.round(totalBilled * 0.18 / 1.28), cgst: Math.round(totalTax * 0.18 / 2), sgst: Math.round(totalTax * 0.18 / 2) },
    { rate: '12% GST (Lubricants & Oils)', taxable: Math.round(totalBilled * 0.10 / 1.12), cgst: Math.round(totalTax * 0.10 / 2), sgst: Math.round(totalTax * 0.10 / 2) },
  ];

  // Brand Revenue Breakdown
  const brandMap: Record<string, { count: number; total: number }> = {};
  jobCards.forEach((j) => {
    const brand = j.vehicleName.split(' ')[0] || 'Other';
    if (!brandMap[brand]) {
      brandMap[brand] = { count: 0, total: 0 };
    }
    brandMap[brand].count += 1;
    brandMap[brand].total += j.netTotal;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Workshop Analytics & Tax Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Spares vs labour split, rate-wise GSTR-1 GST summary & brand performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>Month to Date</option>
            <option>Financial Year 2026-27</option>
          </select>
          <button
            onClick={() => alert('Simulated: Exported GSTR-1 Excel B2B / B2C report')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            Export GSTR-1 Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Workshop Revenue"
          value={`₹${totalBilled.toLocaleString('en-IN')}`}
          subtitle={`${jobCards.length} invoices generated`}
        />
        <StatCard
          title="Spare Parts Turnover"
          value={`₹${totalSpares.toLocaleString('en-IN')}`}
          subtitle={`${sparesRatio}% of workshop billing`}
        />
        <StatCard
          title="Labour & Service Fees"
          value={`₹${totalLabour.toLocaleString('en-IN')}`}
          subtitle={`${labourRatio}% high-margin revenue`}
        />
        <StatCard
          title="Output GST Collected"
          value={`₹${totalTax.toLocaleString('en-IN')}`}
          subtitle="CGST + SGST payable"
        />
      </div>

      {/* Spares vs Labour Ratio & Brand Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spares vs Labour Bar */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Revenue Composition: Spares vs Labour
          </h2>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-lg overflow-hidden flex">
            <div
              className="bg-blue-600 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              style={{ width: `${sparesRatio}%` }}
            >
              Spares {sparesRatio}%
            </div>
            <div
              className="bg-emerald-500 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              style={{ width: `${labourRatio}%` }}
            >
              Labour {labourRatio}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/60">
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Spare Parts Billing</div>
              <div className="text-lg font-mono font-bold text-blue-900 dark:text-blue-100 mt-1">
                ₹{totalSpares.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-100 dark:border-emerald-900/60">
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Labour & Services</div>
              <div className="text-lg font-mono font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                ₹{totalLabour.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Breakdown */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Brand-wise Revenue Share
          </h2>

          <div className="space-y-2">
            {Object.entries(brandMap).map(([brand, data]) => {
              const share = totalBilled > 0 ? Math.round((data.total / totalBilled) * 100) : 0;
              return (
                <div key={brand} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {brand} ({data.count} cars)
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      ₹{data.total.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GSTR-1 Rate-wise Statement */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Rate-wise GST Summary (GSTR-1 Ready)
        </h2>

        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">GST Slab & Applicable Description</th>
                  <th className="px-4 py-3 text-right">Taxable Turnover</th>
                  <th className="px-4 py-3 text-right">Central GST (CGST)</th>
                  <th className="px-4 py-3 text-right">State GST (SGST)</th>
                  <th className="px-4 py-3 text-right">Total GST Output</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gstBreakup.map((row) => (
                  <tr
                    key={row.rate}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {row.rate}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹{row.taxable.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                      ₹{row.cgst.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-blue-600 dark:text-blue-400">
                      ₹{row.sgst.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{(row.cgst + row.sgst).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
