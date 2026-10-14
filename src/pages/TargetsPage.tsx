import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';

export const TargetsPage: React.FC = () => {
  const { targets } = useData();

  const [activeTab, setActiveTab] = useState<'advisor' | 'technician' | 'store'>('advisor');
  const [month, setMonth] = useState('2026-10');

  const filtered = targets.filter((t) => t.targetType === activeTab && (t.month === month || t.month === 'October 2026'));

  // Aggregates
  const totalTarget = filtered.reduce((sum, t) => sum + t.targetAmount, 0);
  const totalAchieved = filtered.reduce((sum, t) => sum + t.achievedAmount, 0);
  const totalIncentive = filtered.reduce((sum, t) => sum + (t.incentivePaid || 0), 0);
  const achievementRate = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Targets & Staff Productivity
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Revenue milestones, bay labour productivity, vehicle volume & monthly incentives
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Team Target"
          value={`₹${totalTarget.toLocaleString('en-IN')}`}
          subtitle={`${filtered.length} staff enrolled in tier`}
        />
        <StatCard
          title="Achieved to Date"
          value={`₹${totalAchieved.toLocaleString('en-IN')}`}
          subtitle="Realized billings"
        />
        <StatCard
          title="Overall Achievement"
          value={`${achievementRate}%`}
          subtitle={achievementRate >= 100 ? 'Target achieved! 🎉' : 'In progress towards target'}
        />
        <StatCard
          title="Incentives Payable"
          value={`₹${totalIncentive.toLocaleString('en-IN')}`}
          subtitle="Commission on performance"
        />
      </div>

      {/* Sheet Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'advisor'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Service Advisors Sheet
          </button>
          <button
            onClick={() => setActiveTab('technician')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'technician'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Workshop Technicians Sheet
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'store'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Store & Spares Sheet
          </button>
        </div>
      </div>

      {/* Target Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => {
          const rate = t.targetAmount > 0 ? Math.round((t.achievedAmount / t.targetAmount) * 100) : 0;
          return (
            <div
              key={t.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {t.staffName}
                  </h3>
                  <div className="text-xs text-slate-400 capitalize">{t.targetType} Milestone</div>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono ${
                    rate >= 100
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                  }`}
                >
                  {rate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    rate >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(rate, 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400">Target:</span>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{t.targetAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Achieved:</span>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{t.achievedAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                {t.vehiclesBilled !== undefined && (
                  <div>
                    Vehicles: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.vehiclesBilled}</span>
                  </div>
                )}
                {t.syntheticOil !== undefined && (
                  <div>
                    Synth Oil: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.syntheticOil} L</span>
                  </div>
                )}
                {t.jobsWorked !== undefined && (
                  <div>
                    Jobs: <span className="font-semibold text-slate-700 dark:text-slate-300">{t.jobsWorked}</span>
                  </div>
                )}
                {t.sparesSales !== undefined && (
                  <div>
                    Spares: <span className="font-semibold text-slate-700 dark:text-slate-300">₹{(t.sparesSales / 1000).toFixed(0)}k</span>
                  </div>
                )}
                {t.incentivePaid !== undefined && (
                  <div className="col-span-2">
                    Incentive: <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹{t.incentivePaid.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
