import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  Vehicle,
  JobCard,
  Estimate,
  InventoryPart,
  Supplier,
  SupplierBill,
  Expense,
  Employee,
  DailyPunch,
  PayrollRecord,
  TargetRecord,
  InsuranceClaim,
  AuditLogEntry,
  PaymentRecord,
  JobCardStatus
} from '../types';
import {
  initialCustomers,
  initialVehicles,
  initialJobCards,
  initialEstimates,
  initialInventoryParts,
  initialSuppliers,
  initialSupplierBills,
  initialExpenses,
  initialEmployees,
  initialDailyPunches,
  initialPayrollRecords,
  initialTargets,
  initialInsuranceClaims,
  initialAuditLogs
} from '../data/initialData';

interface DataContextType {
  customers: Customer[];
  vehicles: Vehicle[];
  jobCards: JobCard[];
  estimates: Estimate[];
  inventory: InventoryPart[];
  suppliers: Supplier[];
  supplierBills: SupplierBill[];
  expenses: Expense[];
  employees: Employee[];
  dailyPunches: DailyPunch[];
  payrollRecords: PayrollRecord[];
  targets: TargetRecord[];
  insuranceClaims: InsuranceClaim[];
  auditLogs: AuditLogEntry[];

  // Actions
  addJobCard: (card: Omit<JobCard, 'id' | 'billNo' | 'gateInNo' | 'createdAt'>) => JobCard;
  updateJobCard: (card: JobCard) => void;
  updateJobCardStatus: (id: string, newStatus: JobCardStatus) => void;
  addPaymentToJobCard: (id: string, payment: Omit<PaymentRecord, 'id'>) => void;
  
  addEstimate: (estimate: Omit<Estimate, 'id' | 'estimateNo'>) => Estimate;
  convertEstimateToJobCard: (estimateId: string) => JobCard | null;

  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (customer: Customer) => void;
  
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;

  addInventoryPart: (part: Omit<InventoryPart, 'id'>) => InventoryPart;
  adjustInventoryStock: (partId: string, quantityDelta: number) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'openBillsCount' | 'balanceDue'>) => Supplier;
  recordSupplierPayment: (supplierId: string, amount: number) => void;

  addExpense: (expense: Omit<Expense, 'id' | 'voucherNo'>) => Expense;

  addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (employee: Employee) => void;
  recordDailyPunch: (punch: Omit<DailyPunch, 'id'>) => void;

  runPayroll: (month: string) => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;

  resetToDefaultData: () => void;
}

export const DATA_VERSION = 'v2_fictional_2026';
const VERSION_KEY = 'torqova_data_version';

const checkAndMigrateStorage = () => {
  try {
    const existingVersion = localStorage.getItem(VERSION_KEY);
    if (existingVersion !== DATA_VERSION) {
      const preservedSession = sessionStorage.getItem('torqova_demo_session');
      localStorage.clear();
      if (preservedSession) {
        sessionStorage.setItem('torqova_demo_session', preservedSession);
      }
      localStorage.setItem(VERSION_KEY, DATA_VERSION);
    }
  } catch {
    // ignore
  }
};

checkAndMigrateStorage();

const STORAGE_PREFIX = 'torqova_';

const loadStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => loadStorage('customers', initialCustomers));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadStorage('vehicles', initialVehicles));
  const [jobCards, setJobCards] = useState<JobCard[]>(() => loadStorage('jobCards', initialJobCards));
  const [estimates, setEstimates] = useState<Estimate[]>(() => loadStorage('estimates', initialEstimates));
  const [inventory, setInventory] = useState<InventoryPart[]>(() => loadStorage('inventory', initialInventoryParts));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStorage('suppliers', initialSuppliers));
  const [supplierBills, setSupplierBills] = useState<SupplierBill[]>(() => loadStorage('supplierBills', initialSupplierBills));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStorage('expenses', initialExpenses));
  const [employees, setEmployees] = useState<Employee[]>(() => loadStorage('employees', initialEmployees));
  const [dailyPunches, setDailyPunches] = useState<DailyPunch[]>(() => loadStorage('dailyPunches', initialDailyPunches));
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => loadStorage('payrollRecords', initialPayrollRecords));
  const [targets, setTargets] = useState<TargetRecord[]>(() => loadStorage('targets', initialTargets));
  const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>(() => loadStorage('insuranceClaims', initialInsuranceClaims));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadStorage('auditLogs', initialAuditLogs));

  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('vehicles', vehicles), [vehicles]);
  useEffect(() => saveStorage('jobCards', jobCards), [jobCards]);
  useEffect(() => saveStorage('estimates', estimates), [estimates]);
  useEffect(() => saveStorage('inventory', inventory), [inventory]);
  useEffect(() => saveStorage('suppliers', suppliers), [suppliers]);
  useEffect(() => saveStorage('supplierBills', supplierBills), [supplierBills]);
  useEffect(() => saveStorage('expenses', expenses), [expenses]);
  useEffect(() => saveStorage('employees', employees), [employees]);
  useEffect(() => saveStorage('dailyPunches', dailyPunches), [dailyPunches]);
  useEffect(() => saveStorage('payrollRecords', payrollRecords), [payrollRecords]);
  useEffect(() => saveStorage('targets', targets), [targets]);
  useEffect(() => saveStorage('insuranceClaims', insuranceClaims), [insuranceClaims]);
  useEffect(() => saveStorage('auditLogs', auditLogs), [auditLogs]);

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `al-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const addJobCard = (cardData: Omit<JobCard, 'id' | 'billNo' | 'gateInNo' | 'createdAt'>): JobCard => {
    const nextNum = jobCards.length + 243;
    const billNo = `TQ/26-27/${String(nextNum).padStart(4, '0')}`;
    const gateInNo = `TQ/GIN/26-27/${String(nextNum - 40).padStart(4, '0')}`;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const newCard: JobCard = {
      ...cardData,
      id: `jc-${Date.now()}`,
      billNo,
      gateInNo,
      date: cardData.date || dateStr,
      createdAt: now.toISOString().split('T')[0],
    };

    setJobCards((prev) => [newCard, ...prev]);

    addAuditLog({
      user: 'advisor',
      role: 'advisor',
      action: 'Job card created',
      module: 'Billing',
      detail: `${billNo} · ${newCard.regNo} · ${newCard.customerName}`,
      reason: 'New vehicle check-in',
      isAlert: false,
    });

    return newCard;
  };

  const updateJobCard = (updatedCard: JobCard) => {
    setJobCards((prev) => prev.map((jc) => (jc.id === updatedCard.id ? updatedCard : jc)));
    addAuditLog({
      user: 'advisor',
      role: 'advisor',
      action: 'Job card updated',
      module: 'Billing',
      detail: `${updatedCard.billNo} · ${updatedCard.regNo} · ₹${updatedCard.netTotal.toLocaleString('en-IN')}`,
      reason: 'Service item adjustment',
      isAlert: false,
    });
  };

  const updateJobCardStatus = (id: string, newStatus: JobCardStatus) => {
    setJobCards((prev) =>
      prev.map((jc) => {
        if (jc.id === id) {
          addAuditLog({
            user: 'advisor',
            role: 'advisor',
            action: `Job status: ${newStatus}`,
            module: 'Billing',
            detail: `${jc.billNo} · ${jc.regNo} moved to ${newStatus}`,
            reason: 'Workflow progress',
            isAlert: false,
          });
          return { ...jc, status: newStatus };
        }
        return jc;
      })
    );
  };

  const addPaymentToJobCard = (id: string, paymentData: Omit<PaymentRecord, 'id'>) => {
    const payment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
    };

    setJobCards((prev) =>
      prev.map((jc) => {
        if (jc.id === id) {
          const updatedPayments = [...jc.payments, payment];
          const totalPaid = updatedPayments.reduce((acc, p) => acc + p.amount, 0);
          const newBalance = Math.max(0, jc.netTotal - totalPaid);
          const newStatus: JobCardStatus = newBalance <= 0 ? 'Paid' : jc.status;

          addAuditLog({
            user: payment.collectedBy || 'advisor',
            role: 'advisor',
            action: 'Payment received',
            module: 'Finance',
            detail: `${jc.billNo} · ₹${payment.amount.toLocaleString('en-IN')} via ${payment.mode}`,
            reason: 'Invoice payment',
            isAlert: false,
          });

          return {
            ...jc,
            payments: updatedPayments,
            balanceDue: newBalance,
            status: newStatus,
          };
        }
        return jc;
      })
    );
  };

  const addEstimate = (estData: Omit<Estimate, 'id' | 'estimateNo'>): Estimate => {
    const nextNum = estimates.length + 13;
    const estimateNo = `EST/26-27/${String(nextNum).padStart(4, '0')}`;
    const newEst: Estimate = {
      ...estData,
      id: `est-${Date.now()}`,
      estimateNo,
    };

    setEstimates((prev) => [newEst, ...prev]);

    addAuditLog({
      user: 'advisor',
      role: 'advisor',
      action: 'Estimate created',
      module: 'Estimates',
      detail: `${estimateNo} · ${newEst.regNo} · ₹${newEst.amount.toLocaleString('en-IN')}`,
      reason: 'Cost quotation',
      isAlert: false,
    });

    return newEst;
  };

  const convertEstimateToJobCard = (estimateId: string): JobCard | null => {
    const est = estimates.find((e) => e.id === estimateId);
    if (!est) return null;

    const newCard = addJobCard({
      date: new Date().toISOString().split('T')[0],
      customerId: est.customerId,
      customerName: est.customerName,
      customerMobile: est.customerMobile,
      vehicleId: est.vehicleId,
      regNo: est.regNo,
      vehicleName: est.vehicleName,
      vehicleFuel: 'Petrol',
      vehicleOdometer: 50000,
      advisorId: 'e3',
      advisorName: 'Aditya Kulkarni',
      advisorMobile: '9876500703',
      cover: 'Customer paid',
      complaints: 'Quoted repair work approved by customer',
      status: 'Open',
      parts: est.parts,
      labour: est.labour,
      payments: [],
      sparesTotal: est.parts.reduce((sum, p) => sum + p.amount, 0),
      labourTotal: est.labour.reduce((sum, l) => sum + l.amount, 0),
      grossTotal: est.amount,
      taxableTotal: est.amount,
      cgstTotal: est.amount * 0.09,
      sgstTotal: est.amount * 0.09,
      netTotal: est.amount * 1.18,
      balanceDue: est.amount * 1.18,
    });

    setEstimates((prev) =>
      prev.map((e) => (e.id === estimateId ? { ...e, status: 'Converted', jobCardId: newCard.id } : e))
    );

    addAuditLog({
      user: 'advisor',
      role: 'advisor',
      action: 'Estimate converted',
      module: 'Estimates',
      detail: `${est.estimateNo} converted to Job Card ${newCard.billNo}`,
      reason: 'Customer approval received',
      isAlert: false,
    });

    return newCard;
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    addAuditLog({
      user: 'advisor',
      role: 'advisor',
      action: 'Customer created',
      module: 'Customers',
      detail: `${newCust.name} · ${newCust.mobile}`,
      reason: 'New customer registration',
      isAlert: false,
    });
    return newCust;
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const addVehicle = (vehData: Omit<Vehicle, 'id'>): Vehicle => {
    const newVeh: Vehicle = {
      ...vehData,
      id: `v-${Date.now()}`,
    };
    setVehicles((prev) => [newVeh, ...prev]);
    return newVeh;
  };

  const updateVehicle = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const addInventoryPart = (partData: Omit<InventoryPart, 'id'>): InventoryPart => {
    const newPart: InventoryPart = {
      ...partData,
      id: `p-${Date.now()}`,
    };
    setInventory((prev) => [newPart, ...prev]);
    return newPart;
  };

  const adjustInventoryStock = (partId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const newQty = Math.max(0, p.inStock + delta);
          return { ...p, inStock: newQty };
        }
        return p;
      })
    );
  };

  const addSupplier = (supData: Omit<Supplier, 'id' | 'openBillsCount' | 'balanceDue'>): Supplier => {
    const newSup: Supplier = {
      ...supData,
      id: `s-${Date.now()}`,
      openBillsCount: 0,
      balanceDue: 0,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    addAuditLog({
      user: 'store',
      role: 'store',
      action: 'Supplier added',
      module: 'Supplier',
      detail: `${newSup.name} · ${newSup.gstin}`,
      reason: 'New vendor onboarding',
      isAlert: false,
    });
    return newSup;
  };

  const recordSupplierPayment = (supplierId: string, amount: number) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, balanceDue: Math.max(0, s.balanceDue - amount) } : s))
    );
  };

  const addExpense = (expData: Omit<Expense, 'id' | 'voucherNo'>): Expense => {
    const voucherNo = `EXP/26-27/${String(expenses.length + 30).padStart(4, '0')}`;
    const newExp: Expense = {
      ...expData,
      id: `exp-${Date.now()}`,
      voucherNo,
    };
    setExpenses((prev) => [newExp, ...prev]);
    addAuditLog({
      user: expData.paidBy || 'accountant',
      role: 'accountant',
      action: 'Expense recorded',
      module: 'Finance',
      detail: `${voucherNo} · ${newExp.category} · ₹${newExp.amount.toLocaleString('en-IN')}`,
      reason: newExp.description,
      isAlert: false,
    });
    return newExp;
  };

  const addEmployee = (empData: Omit<Employee, 'id'>): Employee => {
    const newEmp: Employee = {
      ...empData,
      id: `e-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    addAuditLog({
      user: 'admin',
      role: 'admin',
      action: 'Staff member added',
      module: 'People',
      detail: `${newEmp.code} · ${newEmp.name} (${newEmp.designation})`,
      reason: 'New hire onboarding',
      isAlert: false,
    });
    return newEmp;
  };

  const updateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const recordDailyPunch = (punchData: Omit<DailyPunch, 'id'>) => {
    const newPunch: DailyPunch = {
      ...punchData,
      id: `dp-${Date.now()}`,
    };
    setDailyPunches((prev) => [newPunch, ...prev]);
    addAuditLog({
      user: punchData.employeeName,
      role: 'advisor',
      action: 'Biometric punch recorded',
      module: 'Attendance',
      detail: `${punchData.employeeCode} · ${punchData.employeeName} · ${punchData.punchIn || 'Absent'}`,
      reason: 'Daily terminal sync',
      isAlert: false,
    });
  };

  const runPayroll = (month: string) => {
    const generated: PayrollRecord[] = employees.map((emp) => {
      const perDay = emp.gross / 30;
      const leaveDays = Math.floor(Math.random() * 4);
      const lossOfPay = Math.round(leaveDays * perDay);
      const daysWorked = 30 - leaveDays;
      const effectivePfWage = emp.isEnrolledEpf ? Math.min(emp.pfWage, 15000) * (daysWorked / 30) : 0;
      const epfEmployee = emp.isEnrolledEpf ? Math.round(effectivePfWage * 0.12) : 0;
      const esiEmployee = emp.isEnrolledEsi && emp.gross <= 21000 ? Math.round((emp.gross * (daysWorked / 30)) * 0.0075) : 0;
      const employerEpf = emp.isEnrolledEpf ? Math.round(effectivePfWage * 0.12) : 0;
      const employerEsi = emp.isEnrolledEsi && emp.gross <= 21000 ? Math.round((emp.gross * (daysWorked / 30)) * 0.0325) : 0;
      const totalDeduction = lossOfPay + epfEmployee + esiEmployee;
      const netSalary = Math.max(0, emp.gross - totalDeduction);

      return {
        id: `pr-${emp.id}-${month}`,
        month,
        employeeId: emp.id,
        employeeName: emp.name,
        employeeCode: emp.code,
        designation: emp.designation,
        basic: emp.basic,
        otherAllow: emp.otherAllow,
        gross: emp.gross,
        perDay: emp.perDay,
        otHours: 0,
        otSalary: 0,
        incentive: 0,
        grossPlusAdd: emp.gross,
        leaveDays,
        lossOfPay,
        epfEmployee,
        esiEmployee,
        chit: 0,
        totalDeduction,
        loanDeduction: 0,
        netSalary,
        employerEpf,
        employerEsi,
        salaryPaid: 'Unpaid',
      };
    });

    setPayrollRecords(generated);
    addAuditLog({
      user: 'accountant',
      role: 'accountant',
      action: 'Payroll run generated',
      module: 'Payroll',
      detail: `Monthly run for ${month} · 27 staff members processed`,
      reason: 'Month-end salary computation',
      isAlert: true,
    });
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
    setCustomers(initialCustomers);
    setVehicles(initialVehicles);
    setJobCards(initialJobCards);
    setEstimates(initialEstimates);
    setInventory(initialInventoryParts);
    setSuppliers(initialSuppliers);
    setSupplierBills(initialSupplierBills);
    setExpenses(initialExpenses);
    setEmployees(initialEmployees);
    setDailyPunches(initialDailyPunches);
    setPayrollRecords(initialPayrollRecords);
    setTargets(initialTargets);
    setInsuranceClaims(initialInsuranceClaims);
    setAuditLogs(initialAuditLogs);

    addAuditLog({
      user: 'admin',
      role: 'admin',
      action: 'Demo data reset',
      module: 'Security',
      detail: 'Restored all modules to baseline demonstration data state',
      reason: 'Demo environment reset',
      isAlert: true,
    });
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        vehicles,
        jobCards,
        estimates,
        inventory,
        suppliers,
        supplierBills,
        expenses,
        employees,
        dailyPunches,
        payrollRecords,
        targets,
        insuranceClaims,
        auditLogs,
        addJobCard,
        updateJobCard,
        updateJobCardStatus,
        addPaymentToJobCard,
        addEstimate,
        convertEstimateToJobCard,
        addCustomer,
        updateCustomer,
        addVehicle,
        updateVehicle,
        addInventoryPart,
        adjustInventoryStock,
        addSupplier,
        recordSupplierPayment,
        addExpense,
        addEmployee,
        updateEmployee,
        recordDailyPunch,
        runPayroll,
        addAuditLog,
        resetToDefaultData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
