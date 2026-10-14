import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (username: string, role?: Role) => boolean;
  quickLogin: (role: Role) => void;
  logout: () => void;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_DETAILS: Record<Role, { title: string; desc: string }> = {
  admin: {
    title: 'Workshop Administrator',
    desc: 'Everything — payroll, P&L, audit log, settings',
  },
  accountant: {
    title: 'Financial Accountant',
    desc: 'The books — finance, expenses, payroll, EPF/ESI, P&L',
  },
  advisor: {
    title: 'Service Advisor',
    desc: 'The counter — job cards, billing, payments',
  },
  store: {
    title: 'Store & Inventory Manager',
    desc: 'Purchases, supplier ledger, inventory',
  },
};

// Route and module permission matrix observed from the reference application
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    'today',
    'jobs',
    'estimates',
    'customers',
    'finance',
    'expenses',
    'suppliers',
    'inventory',
    'insurance',
    'employees',
    'attendance',
    'payroll',
    'statutory',
    'targets',
    'reports',
    'pnl',
    'audit',
  ],
  accountant: [
    'today',
    'finance',
    'expenses',
    'suppliers',
    'inventory',
    'insurance',
    'payroll',
    'statutory',
    'targets',
    'reports',
    'pnl',
  ],
  advisor: [
    'today',
    'jobs',
    'estimates',
    'customers',
    'inventory',
    'targets',
  ],
  store: [
    'today',
    'jobs',
    'estimates',
    'customers',
    'expenses',
    'suppliers',
    'inventory',
    'targets',
    'reports',
  ],
};

const SESSION_KEY = 'torqova_demo_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const login = (username: string, explicitRole?: Role): boolean => {
    const trimmed = username.toLowerCase().trim();
    let determinedRole: Role = explicitRole || 'admin';

    if (!explicitRole) {
      if (trimmed.includes('accountant') || trimmed === 'acc') determinedRole = 'accountant';
      else if (trimmed.includes('advisor') || trimmed === 'adv') determinedRole = 'advisor';
      else if (trimmed.includes('store') || trimmed === 'inv') determinedRole = 'store';
      else determinedRole = 'admin';
    }

    const newUser: User = {
      id: `usr-${determinedRole}`,
      username: trimmed || determinedRole,
      name: trimmed ? trimmed.toUpperCase() : determinedRole,
      role: determinedRole,
      roleTitle: ROLE_DETAILS[determinedRole].title,
      roleDescription: ROLE_DETAILS[determinedRole].desc,
    };

    setUser(newUser);
    return true;
  };

  const quickLogin = (selectedRole: Role) => {
    const newUser: User = {
      id: `usr-${selectedRole}`,
      username: selectedRole,
      name: selectedRole,
      role: selectedRole,
      roleTitle: ROLE_DETAILS[selectedRole].title,
      roleDescription: ROLE_DETAILS[selectedRole].desc,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    const allowed = ROLE_PERMISSIONS[user.role] || [];
    return allowed.includes(module.toLowerCase());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        quickLogin,
        logout,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
