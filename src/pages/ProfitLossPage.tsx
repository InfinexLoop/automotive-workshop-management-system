import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';

export const ProfitLossPage: React.FC = () => {
  const { jobCards, expenses, payrollRecords } = useData();

  const [period, setPeriod] = useState('Month to Date');

  // Revenue calculations
  const totalSparesRevenue = jobCards.reduce((sum, j) => sum + j.sparesTotal, 0);
  const totalLabourRevenue = jobCards.reduce((sum, j) => sum + j.labourTotal, 0);
  const totalOperatingRevenue = totalSparesRevenue + totalLabourRevenue;

  // Direct Costs (COGS)
  const sparesCost = Math.round(totalSparesRevenue * 0.68); // ~32% parts margin
  const lubricantsCost = Math.round(totalSparesRevenue * 0.12);
  const subletMachiningCost = 14500;
  const totalCogs = sparesCost + lubricantsCost + subletMachiningCost;

  // Gross Profit
  const grossProfit = totalOperatingRevenue - totalCogs;
  const grossMargin = totalOperatingRevenue > 0 ? ((grossProfit / totalOperatingRevenue) * 100).toFixed(1) : '0';

  // Operating Overheads
  const totalPayroll = payrollRecords.reduce((sum, r) => sum + r.grossPlusAdd, 0);
  const otherExpenses = expenses.reduce((sum, e) => sum + (e.isCapital ? 0 : e.amount), 0);
  const totalOpex = totalPayroll + otherExpenses;

  // Net Profit
  const netOperatingProfit = grossProfit - totalOpex;
  const netMargin = totalOperatingRevenue > 0 ? ((netOperatingProfit / totalOperatingRevenue) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profit & Loss Statement (P&L)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Operating revenue, parts COGS, payroll burden, workshop overheads & EBITDA margins
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
          >
            <option>Month to Date</option>
            <option>Previous Month (Feb 2026)</option>
            <option>Financial Year 2025-26</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Operating Revenue"
          value={`₹${totalOperatingRevenue.toLocaleString('en-IN')}`}
          subtitle="Exclusive of statutory taxes"
        />
        <StatCard
          title="Gross Profit"
          value={`₹${grossProfit.toLocaleString('en-IN')}`}
          subtitle={`${grossMargin}% Gross Margin`}
        />
        <StatCard
          title="Total Overhead Cost"
          value={`₹${totalOpex.toLocaleString('en-IN')}`}
          subtitle="Staff wages + shop utilities"
        />
        <StatCard
          title="Net Operating Profit"
          value={`₹${netOperatingProfit.toLocaleString('en-IN')}`}
          subtitle={`${netMargin}% Net Margin`}
        />
      </div>

      {/* Statement Sheet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white text-base">
            Detailed Income & Expenditure Statement ({period})
          </h2>
          <span className="text-xs font-mono font-semibold text-slate-500">
            INR (₹) · Multibrand Service Center
          </span>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Revenue Section */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-xs text-blue-600 dark:text-blue-400">
              1. Operating Revenue (Turnover)
            </div>
            <div className="space-y-1.5 pl-4">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Spare Parts & Accessories Invoiced:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{totalSparesRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Labour, Bodyshop & Diagnostic Charges:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{totalLabourRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Scrap Metal & Waste Oil Disposal:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹4,200</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-white">
                <span>Total Operating Revenue:</span>
                <span className="font-mono text-base text-blue-600 dark:text-blue-400">
                  ₹{(totalOperatingRevenue + 4200).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* COGS Section */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-xs text-amber-600 dark:text-amber-400">
              2. Direct Cost of Goods Sold (COGS)
            </div>
            <div className="space-y-1.5 pl-4">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Wholesale Spares & Parts Procurement:</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{sparesCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Bulk Engine Oils & Lubricants Consumed:</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{lubricantsCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Outsourced Lathe & Cylinder Head Machining:</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{subletMachiningCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-white">
                <span>Total Direct COGS:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  -₹{totalCogs.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Gross Profit Banner */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <span>GROSS PROFIT (Revenue - COGS):</span>
            <span className="font-mono text-lg text-emerald-600 dark:text-emerald-400">
              ₹{(grossProfit + 4200).toLocaleString('en-IN')} ({grossMargin}%)
            </span>
          </div>

          {/* Overheads Section */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-xs text-rose-600 dark:text-rose-400">
              3. Operating Overheads & Indirect Expenses
            </div>
            <div className="space-y-1.5 pl-4">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Staff Payroll & Employee Salaries (27 Headcount):</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{totalPayroll.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-300">Shop Rent, Electricity, Diesel & Utilities:</span>
                <span className="font-mono text-slate-900 dark:text-white">₹{otherExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-slate-900 dark:text-white">
                <span>Total Overheads (Opex):</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  -₹{totalOpex.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Net Profit Banner */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between font-bold text-slate-900 dark:text-white">
            <div>
              <div className="text-base text-emerald-900 dark:text-emerald-100">
                NET OPERATING PROFIT (EBITDA)
              </div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-normal mt-0.5">
                Retained workshop earnings before tax amortization
              </div>
            </div>
            <span className="font-mono text-2xl text-emerald-600 dark:text-emerald-400">
              ₹{(netOperatingProfit + 4200).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
