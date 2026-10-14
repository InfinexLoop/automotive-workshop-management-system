import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { Menu, ArrowLeft, Sun, Moon, Plus, LogOut, RefreshCw, ChevronDown, Check } from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, quickLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetToDefaultData } = useData();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute clean breadcrumbs based on pathname
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === '/today') return 'Front Desk / Today';
    if (p === '/jobs') return 'Front Desk / Job Cards';
    if (p === '/jobs/new') return 'Front Desk / New Job Card';
    if (p.startsWith('/jobs/') && p.endsWith('/print')) return 'Front Desk / Invoice Print';
    if (p.startsWith('/jobs/')) return 'Front Desk / Job Card Details';
    if (p === '/estimates') return 'Front Desk / Estimates';
    if (p === '/customers') return 'Front Desk / Customers';
    if (p.startsWith('/customers/')) return 'Front Desk / Customer Profile';
    if (p === '/finance') return 'Money / Finance';
    if (p === '/expenses') return 'Money / Expenses';
    if (p === '/suppliers') return 'Money / Supplier Ledger';
    if (p.startsWith('/suppliers/')) return 'Money / Supplier Statement';
    if (p === '/inventory') return 'Money / Inventory';
    if (p === '/insurance') return 'Money / Insurance Claims';
    if (p === '/employees') return 'People / Staff Master';
    if (p === '/attendance') return 'People / Attendance';
    if (p === '/payroll') return 'People / Payroll';
    if (p === '/statutory') return 'People / EPF & ESI';
    if (p === '/targets') return 'People / Targets';
    if (p === '/reports') return 'Insight / Reports';
    if (p === '/pnl') return 'Insight / Profit & Loss';
    if (p === '/audit') return 'Insight / Audit Log';
    return 'Torqova Workshop OS';
  };

  const handleRoleSwitch = (newRole: Role) => {
    quickLogin(newRole);
    setIsUserMenuOpen(false);
  };

  const handleResetData = () => {
    resetToDefaultData();
    setShowResetConfirm(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 shrink-0">
      {/* Left section: Hamburger (mobile), Back button, Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 select-none">
          {getBreadcrumb()}
        </div>
      </div>

      {/* Right section: Theme toggle, + New Job Card, User menu, Logout */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">◐ Theme (light)</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">◑ Theme (dark)</span>
            </>
          )}
        </button>

        {/* Quick action: + New Job Card */}
        <Link
          to="/jobs/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Job Card</span>
        </Link>

        {/* Logout button */}
        <button
          onClick={logout}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>

        {/* User profile with Role switcher dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 md:py-1 md:px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-blue-600 text-xs font-bold uppercase">
              {user?.username?.[0] || 'U'}
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user?.username || 'admin'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {user?.role || 'admin'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {user?.roleTitle}
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                    Switch Demo Role
                  </div>
                  {(['admin', 'accountant', 'advisor', 'store'] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left transition-colors capitalize ${
                        user?.role === r
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {user?.role === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                {/* Reset Data Option */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reset Demo Data?
            </h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will restore all job cards, customers, vehicles, inventory parts, and audit logs to their initial demonstration defaults.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
