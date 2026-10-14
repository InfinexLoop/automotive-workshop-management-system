import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TorqovaLogo } from '../components/Logo';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { Role } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, quickLogin, isAuthenticated } = useAuth();
  const { addAuditLog } = useData();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('workshop123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect to /today
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/today');
    }
  }, [isAuthenticated, navigate]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    addAuditLog({
      user: username,
      role: 'admin',
      action: 'Standard login',
      module: 'Security',
      detail: `${username} authenticated with password credentials`,
      reason: 'Manual session start',
      isAlert: false,
    });

    login(username);
    navigate('/today');
  };

  const handleQuickLogin = (role: Role) => {
    addAuditLog({
      user: role,
      role: role,
      action: 'Demo login (no password)',
      module: 'Security',
      detail: `${role} · one-click demo sign-in`,
      reason: 'Demonstration access',
      isAlert: true,
    });

    quickLogin(role);
    navigate('/today');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      {/* Top Brand bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <TorqovaLogo size="md" subtitleText="Automotive Workshop OS" />
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Demo Deployment · Simulated Data
        </span>
      </div>

      {/* Main Login Container */}
      <div className="max-w-5xl w-full mx-auto my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          {/* Left Column: Manual Login Form */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
            <div>
              <div className="mb-8">
                <TorqovaLogo size="lg" subtitleText="Workshop OS" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign in to Torqova
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Sign in with your username and password.
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleManualSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Demo: any password
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-midnight-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-normal">
              Simulated demonstration session. No real credential checks or server-side transmission.
            </div>
          </div>

          {/* Right Column: Demo Sign-in with 4 Quick Roles */}
          <div className="lg:col-span-6 p-8 md:p-12 bg-slate-50/70 dark:bg-slate-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                    Demo sign-in
                  </h3>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  no password
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                These buttons sign in without a password. They are on because demo.one_click_login is enabled on this deployment. Every use is recorded in the audit log. Turn it off before this carries anyone’s real data.
              </p>

              {/* 4 Demo Roles */}
              <div className="space-y-3">
                {/* 1. Admin */}
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      admin
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Enter →
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Everything — payroll, P&L, audit log, settings
                  </div>
                </button>

                {/* 2. Accountant */}
                <button
                  onClick={() => handleQuickLogin('accountant')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      accountant
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Enter →
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    The books — finance, expenses, payroll, EPF/ESI, P&L
                  </div>
                </button>

                {/* 3. Advisor */}
                <button
                  onClick={() => handleQuickLogin('advisor')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      advisor
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Enter →
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    The counter — job cards, billing, payments
                  </div>
                </button>

                {/* 4. Store */}
                <button
                  onClick={() => handleQuickLogin('store')}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      store
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Quick Enter →
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Purchases, supplier ledger, inventory
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Demo access uses fictional data and simulated sessions.
            </div>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        Developed by{' '}
        <a
          href="https://infinexloop.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          Infinex Loop
        </a>
        . All rights reserved.
      </footer>
    </div>
  );
};
