import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  highlight?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  highlight = false,
  className = '',
}) => {
  return (
    <div
      className={`p-4 md:p-5 rounded-xl border transition-all ${
        highlight
          ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      } ${className}`}
    >
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>{title}</span>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};
