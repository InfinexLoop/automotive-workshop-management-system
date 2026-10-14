export type Role = 'admin' | 'accountant' | 'advisor' | 'store';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  roleTitle: string;
  roleDescription: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  gstin?: string;
  address?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  regNo: string;
  brand: string;
  model: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'LPG' | 'Electric' | 'Hybrid';
  engineNo?: string;
  vin?: string;
  color?: string;
  odometer: number;
  customerId: string;
}

export type JobCardStatus = 'Open' | 'In Progress' | 'Ready' | 'Delivered' | 'Paid' | 'Closed';
export type JobCardCover = 'Customer paid' | 'Insurance';

export interface JobCardPart {
  id: string;
  partId?: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
  gstPercent: number;
  amount: number;
}

export interface JobCardLabour {
  id: string;
  name: string;
  sac: string;
  technicianId?: string;
  technicianName?: string;
  qty: number;
  rate: number;
  gstPercent: number;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  date: string;
  mode: 'Cash' | 'UPI' | 'Cheque' | 'Card' | 'Bank transfer';
  reference: string;
  collectedBy: string;
  amount: number;
}

export interface JobCard {
  id: string;
  billNo: string;
  gateInNo: string;
  date: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  customerGstin?: string;
  customerAddress?: string;
  vehicleId: string;
  regNo: string;
  vehicleName: string;
  vehicleFuel: string;
  vehicleOdometer: number;
  vehicleEngineNo?: string;
  vehicleVin?: string;
  advisorId: string;
  advisorName: string;
  advisorMobile: string;
  cover: JobCardCover;
  insuranceCompany?: string;
  insurancePolicyNo?: string;
  insuranceClaimNo?: string;
  complaints: string;
  status: JobCardStatus;
  parts: JobCardPart[];
  labour: JobCardLabour[];
  payments: PaymentRecord[];
  promisedDeliveryDate?: string;
  sparesTotal: number;
  labourTotal: number;
  grossTotal: number;
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  netTotal: number;
  balanceDue: number;
  createdAt: string;
}

export type EstimateStatus = 'Draft' | 'Sent' | 'Approved' | 'Converted' | 'Rejected';

export interface Estimate {
  id: string;
  estimateNo: string;
  date: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  vehicleId: string;
  regNo: string;
  vehicleName: string;
  status: EstimateStatus;
  linesCount: number;
  amount: number;
  parts: JobCardPart[];
  labour: JobCardLabour[];
  jobCardId?: string;
}

export interface InventoryPart {
  id: string;
  name: string;
  partNo: string;
  hsn: string;
  inStock: number;
  unit: string;
  reorderLevel: number;
  avgCost: number;
  sellRate: number;
  gstPercent: number;
  category: string;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  gstin: string;
  terms: string;
  openBillsCount: number;
  balanceDue: number;
  phone: string;
  email?: string;
}

export interface SupplierBill {
  id: string;
  supplierId: string;
  supplierName: string;
  billNo: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balanceDue: number;
  itemsCount: number;
  status: 'Open' | 'Partially Paid' | 'Paid';
}

export interface Expense {
  id: string;
  voucherNo: string;
  date: string;
  category: string;
  description: string;
  mode: 'Cash' | 'Bank transfer' | 'UPI' | 'Cheque';
  paidBy: string;
  amount: number;
  isCapital: boolean;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  phone: string;
  designation: string;
  group: 'Management' | 'Service advisor' | 'Store' | 'Support' | 'Technician';
  basic: number;
  otherAllow: number;
  gross: number;
  perDay: number;
  pfWage: number;
  uan: string;
  esiNo: string;
  isEnrolledEpf: boolean;
  isEnrolledEsi: boolean;
  active: boolean;
  salaryPaidStatus: 'Paid' | 'Unpaid';
}

export interface DailyPunch {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  date: string;
  punchIn?: string;
  punchOut?: string;
  isOnTime: boolean;
  status: 'Present' | 'Absent' | 'Half Day' | 'Weekly Off';
}

export interface PayrollRecord {
  id: string;
  month: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  basic: number;
  otherAllow: number;
  gross: number;
  perDay: number;
  otHours: number;
  otSalary: number;
  incentive: number;
  grossPlusAdd: number;
  leaveDays: number;
  lossOfPay: number;
  epfEmployee: number;
  esiEmployee: number;
  chit: number;
  totalDeduction: number;
  loanDeduction: number;
  netSalary: number;
  employerEpf: number;
  employerEsi: number;
  salaryPaid: 'Paid' | 'Unpaid';
}

export interface TargetRecord {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  targetType: 'advisor' | 'technician' | 'store';
  targetAmount: number;
  achievedAmount: number;
  syntheticOil?: number;
  balanceAmount: number;
  vehiclesBilled?: number;
  sparesSales?: number;
  jobsWorked?: number;
  incentivePaid?: number;
}

export interface InsuranceClaim {
  id: string;
  claimNo: string;
  date: string;
  regNo: string;
  vehicleName: string;
  insurer: string;
  book: 'uiic_nia' | 'policy_bazaar' | 'tie_up' | 'others';
  billType: 'Cashless' | 'Credit' | 'Reimbursement';
  billedAmount: number;
  approvedAmount: number;
  receivedAmount: number;
  toCollectAmount: number;
  customerBearsAmount: number;
  overApprovalAmount?: number;
  surveyorName: string;
  surveyDate?: string;
  status: 'Open' | 'Awaiting Survey' | 'Approved' | 'Settled' | 'Disputed';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: string;
  module: 'Attendance' | 'Billing' | 'Customers' | 'Estimates' | 'Finance' | 'Payroll' | 'People' | 'Security' | 'Supplier';
  detail: string;
  reason: string;
  isAlert?: boolean;
}
