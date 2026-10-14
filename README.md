# Torqova Workshop OS

> **Automotive Workshop, Garage & Multi-Brand Service Management System**  
> Developed by [Infinex Loop](https://infinexloop.netlify.app/). All rights reserved.

---

## 📌 Product Overview

**Torqova Workshop OS** is an interactive, enterprise-grade automotive workshop and garage management system demonstration engineered for multi-brand car repair centers, dealership bodyshops, and independent automotive service facilities. 

It provides end-to-end operational visibility across the workshop lifecycle—from vehicle gate-in and inspection through job estimation, parts requisition, technician bay assignment, counter collections, spare parts inventory, supplier payables, biometric attendance, statutory payroll compliance (EPF & ESI), and management profit & loss reporting.

This demonstration software operates with simulated client-side storage (`localStorage` & `sessionStorage`) and pre-populated realistic Indian automotive workshop operational data (based in Bengaluru, Karnataka, with INR currency standards).

---

## ✨ Primary Modules & Capabilities

### 1. Front Desk & Service Bay Operations
- **Live Workshop Dashboard (`/today`)**: Real-time floor overview of vehicles on lifts, bays in progress, quick-entry actions, and live cashier audit feeds.
- **Job Cards (`/jobs`)**: Gate-in job cards with status progression (`Open` → `In Progress` → `Ready` → `Delivered` → `Paid` → `Closed`), customer-paid vs insurance cover filters, complaints intake, parts/labour tracking, and live balance due calculation.
- **Job Card Creation (`/jobs/new`)**: Rapid vehicle intake with customer/vehicle autocomplete, service advisor assignment, quick-add parts catalog, and technician labour costing.
- **Official Tax Invoice & Print (`/jobs/:id/print`)**: Clean, GST-compliant tax invoice format with HSN/SAC breakdowns, CGST/SGST tables, authorized signatory sections, and `@media print` layout.
- **Cost Estimates (`/estimates`)**: Formal repair quotation cards and tables with single-click conversion from approved estimate directly into an active job card.
- **Customer Directory & Fleet (`/customers`, `/customers/:id`)**: Comprehensive customer directory with GSTIN categorization, multi-vehicle fleet profiles, and lifetime service history.

### 2. Money, Ledger & Supply Chain
- **Finance & Day Book (`/finance`)**: Real-time counter receipts filtered by payment mode (Cash, UPI, Cheque, Card, Bank transfer), cashier drawer accountability, and end-of-day reconciliation.
- **Workshop Expenses (`/expenses`)**: Categorized petty cash vouchers, electricity bills, shop rent, tools, and capex vs opex classification.
- **Supplier Ledger (`/suppliers`, `/suppliers/:id`)**: Accounts payable aging analysis (0–30, 31–90, 90+ days), vendor statements, credit term tracking, and bill settlement modals.
- **Spare Parts Inventory (`/inventory`)**: SKU management with OEM part numbers, HSN codes, purchase cost vs sell rate margins, reorder level alerts, and quick stock receipt/issue controls.
- **Insurance Claims (`/insurance`)**: Cashless accident claims portfolio across 4 distinct books (*UIIC / NIA PSU*, *Policy Bazaar*, *Workshop Tie-ups*, *Private Insurers*), surveyor logs, and approval gap tracking.

### 3. People, Biometrics & Payroll
- **Staff Master (`/employees`)**: 27 workshop staff members across Service Advisors, Technicians, Store Managers, Support, and Executive Management with basic pay and PF wage parameters.
- **Biometric Attendance (`/attendance`)**: Fingerprint terminal synchronization, punctuality tracking, late punch warnings, and loss-of-pay (LOP) days.
- **Monthly Payroll (`/payroll`)**: Comprehensive wage register computing gross wages, biometric leave deductions, employee EPF (12%), employee ESI (0.75%), net take-home pay, and batch NEFT disbursal simulation.
- **Statutory Compliance (`/statutory`)**: EPFO monthly challan breakdown (A/c 1, 2, 10, 21), ESIC monthly deposit breakdown, member-wise ECR register, and simulated ECR export.
- **Targets & Productivity (`/targets`)**: Tiered monthly revenue milestones for Service Advisors, bay labour productivity for Technicians, and spares turnover for Store managers.

### 4. Insight & Governance
- **Workshop Analytics & Tax Reports (`/reports`)**: Spares vs Labour revenue composition, brand-wise turnover distribution, and rate-wise GSTR-1 GST reports (18%, 28%, 12%).
- **Profit & Loss Statement (`/pnl`)**: Operating revenue, parts cost of goods sold (COGS), payroll burden, shop utilities, gross margin, and net EBITDA operating profit.
- **Audit Log & Security Trail (`/audit`)**: Immutable system audit trail capturing counter receipts, status updates, bill creations, and security anomaly flags.

---

## 👥 Demo User Roles & Permissions

The application implements role-specific presentation access replicating authentic workshop divisional security:

| Role | Title | Accessible Modules |
| :--- | :--- | :--- |
| **Admin** | Workshop Administrator | Full unrestricted access to all 17 workshop modules, P&L, payroll, audit logs, and settings. |
| **Accountant** | Financial Accountant | Front desk overview, Finance, Expenses, Suppliers, Inventory, Insurance, Payroll, EPF & ESI, Targets, Reports, and P&L. |
| **Advisor** | Service Advisor | Today dashboard, Job Cards, Estimates, Customers, Inventory lookup, and Personal targets. |
| **Store** | Store & Inventory Manager | Today dashboard, Job Cards, Estimates, Customers, Expenses, Suppliers, Inventory, Targets, and Reports. |

### 🚀 One-Click Demo Sign-in
On the login screen (`/login`), click any of the 4 quick demo buttons:
- **Admin**
- **Accountant**
- **Advisor**
- **Store**

No password is required for quick demonstration access. You can also switch roles on the fly using the role switcher located in the top navigation bar.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite 6
- **Routing**: React Router 7 (SPA with client-side history)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Inter & JetBrains Mono (Google Fonts)
- **State & Data**: React Context API (`AuthContext`, `DataContext`, `ThemeContext`)
- **Persistence**: `localStorage` (workshop state, job cards, inventory) & `sessionStorage` (demo session)
- **Deployment Target**: Cloudflare Pages (`public/_redirects` configured for SPA routing)

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js 18+ or 20+
- `pnpm` (recommended) or `npm`

### Installation
```bash
# Clone or navigate to the workspace
cd automotive-workshop-management-system

# Install dependencies
pnpm install

# Approve native build scripts if prompted
pnpm approve-builds esbuild
```

### Run Locally
```bash
# Start Vite development server
pnpm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
```bash
# Type check and build optimized bundle
pnpm run build

# Preview production build locally
pnpm run preview
```

---

## 🌐 Cloudflare Pages Deployment

This project is structured as a single-page application (SPA) ready for zero-configuration Cloudflare Pages deployment:
- **Build command**: `pnpm run build`
- **Build output directory**: `dist`
- **SPA Fallback Routing**: Handled via `public/_redirects` (`/* /index.html 200`)

---

## 🏢 Attribution & Notice

- **Product Identity**: Torqova Workshop OS
- **Developer**: [Infinex Loop](https://infinexloop.netlify.app/)
- **Attribution**: *Developed by Infinex Loop. All rights reserved.*
- **Demonstration Notice**: *This software is an interactive frontend demonstration built with realistic fictional data. It does not connect to a production backend or process live financial transactions.*
