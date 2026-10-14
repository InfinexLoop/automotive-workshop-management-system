import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { TodayDashboardPage } from './pages/TodayDashboardPage';
import { JobCardsPage } from './pages/JobCardsPage';
import { NewJobCardPage } from './pages/NewJobCardPage';
import { JobCardDetailPage } from './pages/JobCardDetailPage';
import { JobCardPrintPage } from './pages/JobCardPrintPage';
import { EstimatesPage } from './pages/EstimatesPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';
import { FinancePage } from './pages/FinancePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { SupplierLedgerPage } from './pages/SupplierLedgerPage';
import { InventoryPage } from './pages/InventoryPage';
import { InsurancePage } from './pages/InsurancePage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { PayrollPage } from './pages/PayrollPage';
import { StatutoryPage } from './pages/StatutoryPage';
import { TargetsPage } from './pages/TargetsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ProfitLossPage } from './pages/ProfitLossPage';
import { AuditLogPage } from './pages/AuditLogPage';

// Protected Route Guard
const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
};

// Route Access Guard for role-specific restrictions
const GuardedModule: React.FC<{ moduleKey: string; element: React.ReactElement }> = ({
  moduleKey,
  element,
}) => {
  const { canAccess } = useAuth();

  if (!canAccess(moduleKey)) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <div className="text-3xl">🔒</div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Restricted Workshop Module
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Your current demo role does not have authorization to view this section. Use the role switcher in the top navigation bar to switch to an authorized role.
        </p>
      </div>
    );
  }

  return element;
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/today" replace /> : <LoginPage />}
        />

        {/* Printable Standalone Document */}
        <Route
          path="/jobs/:id/print"
          element={isAuthenticated ? <JobCardPrintPage /> : <Navigate to="/login" replace />}
        />

        {/* Protected App Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route
            path="/today"
            element={<GuardedModule moduleKey="today" element={<TodayDashboardPage />} />}
          />
          <Route
            path="/jobs"
            element={<GuardedModule moduleKey="jobs" element={<JobCardsPage />} />}
          />
          <Route
            path="/jobs/new"
            element={<GuardedModule moduleKey="jobs" element={<NewJobCardPage />} />}
          />
          <Route
            path="/jobs/:id"
            element={<GuardedModule moduleKey="jobs" element={<JobCardDetailPage />} />}
          />
          <Route
            path="/estimates"
            element={<GuardedModule moduleKey="estimates" element={<EstimatesPage />} />}
          />
          <Route
            path="/customers"
            element={<GuardedModule moduleKey="customers" element={<CustomersPage />} />}
          />
          <Route
            path="/customers/:id"
            element={<GuardedModule moduleKey="customers" element={<CustomerDetailPage />} />}
          />
          <Route
            path="/finance"
            element={<GuardedModule moduleKey="finance" element={<FinancePage />} />}
          />
          <Route
            path="/expenses"
            element={<GuardedModule moduleKey="expenses" element={<ExpensesPage />} />}
          />
          <Route
            path="/suppliers"
            element={<GuardedModule moduleKey="suppliers" element={<SuppliersPage />} />}
          />
          <Route
            path="/suppliers/:id"
            element={<GuardedModule moduleKey="suppliers" element={<SupplierLedgerPage />} />}
          />
          <Route
            path="/inventory"
            element={<GuardedModule moduleKey="inventory" element={<InventoryPage />} />}
          />
          <Route
            path="/insurance"
            element={<GuardedModule moduleKey="insurance" element={<InsurancePage />} />}
          />
          <Route
            path="/employees"
            element={<GuardedModule moduleKey="employees" element={<EmployeesPage />} />}
          />
          <Route
            path="/attendance"
            element={<GuardedModule moduleKey="attendance" element={<AttendancePage />} />}
          />
          <Route
            path="/payroll"
            element={<GuardedModule moduleKey="payroll" element={<PayrollPage />} />}
          />
          <Route
            path="/statutory"
            element={<GuardedModule moduleKey="statutory" element={<StatutoryPage />} />}
          />
          <Route
            path="/targets"
            element={<GuardedModule moduleKey="targets" element={<TargetsPage />} />}
          />
          <Route
            path="/reports"
            element={<GuardedModule moduleKey="reports" element={<ReportsPage />} />}
          />
          <Route
            path="/pnl"
            element={<GuardedModule moduleKey="pnl" element={<ProfitLossPage />} />}
          />
          <Route
            path="/audit"
            element={<GuardedModule moduleKey="audit" element={<AuditLogPage />} />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/today" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
