import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TorqovaLogo } from './Logo';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  badge?: number | string;
  moduleKey: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { canAccess, user } = useAuth();
  const { jobCards } = useData();

  // Active in-progress/open vehicles count
  const activeJobsCount = jobCards.filter((j) => j.status !== 'Closed' && j.status !== 'Paid').length || 35;

  const sections: NavSection[] = [
    {
      title: 'Front desk',
      items: [
        { name: 'Today', path: '/today', icon: '◧', moduleKey: 'today' },
        { name: 'Job Cards', path: '/jobs', icon: '▤', badge: activeJobsCount, moduleKey: 'jobs' },
        { name: 'Estimates', path: '/estimates', icon: '◱', moduleKey: 'estimates' },
        { name: 'Customers', path: '/customers', icon: '◍', moduleKey: 'customers' },
      ],
    },
    {
      title: 'Money',
      items: [
        { name: 'Finance', path: '/finance', icon: '₹', moduleKey: 'finance' },
        { name: 'Expenses', path: '/expenses', icon: '▼', moduleKey: 'expenses' },
        { name: 'Supplier Ledger', path: '/suppliers', icon: '▦', moduleKey: 'suppliers' },
        { name: 'Inventory', path: '/inventory', icon: '▥', moduleKey: 'inventory' },
        { name: 'Insurance Claims', path: '/insurance', icon: '◈', moduleKey: 'insurance' },
      ],
    },
    {
      title: 'People',
      items: [
        { name: 'Employees', path: '/employees', icon: '☰', moduleKey: 'employees' },
        { name: 'Attendance', path: '/attendance', icon: '◫', moduleKey: 'attendance' },
        { name: 'Payroll', path: '/payroll', icon: '▩', moduleKey: 'payroll' },
        { name: 'EPF & ESI', path: '/statutory', icon: '▣', moduleKey: 'statutory' },
        { name: 'Targets', path: '/targets', icon: '◎', moduleKey: 'targets' },
      ],
    },
    {
      title: 'Insight',
      items: [
        { name: 'Reports', path: '/reports', icon: '◪', moduleKey: 'reports' },
        { name: 'Profit & Loss', path: '/pnl', icon: '◨', moduleKey: 'pnl' },
        { name: 'Audit Log', path: '/audit', icon: '◈', moduleKey: 'audit' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 flex flex-col h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } shrink-0 select-none overflow-y-auto`}
      >
        {/* Header / Brand */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <TorqovaLogo size="md" subtitleText="Multibrand car service" />
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-6">
          {sections.map((section) => {
            const accessibleItems = section.items.filter((item) => canAccess(item.moduleKey));
            if (accessibleItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {section.title}
                </div>
                {accessibleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none text-slate-400 dark:text-slate-500 w-5 text-center">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer with Developer Attribution */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            Torqova Workshop OS
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Multi-brand vehicle service
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-400 leading-normal">
            Developed by{' '}
            <a
              href="https://infinexloop.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Infinex Loop
            </a>
            . All rights reserved.
          </div>
        </div>
      </aside>
    </>
  );
};
