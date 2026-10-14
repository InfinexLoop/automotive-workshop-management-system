import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';
import { Employee } from '../types';

export const EmployeesPage: React.FC = () => {
  const { employees, addEmployee } = useData();

  const [groupFilter, setGroupFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Technician');
  const [group, setGroup] = useState<Employee['group']>('Technician');
  const [basic, setBasic] = useState<number | ''>('');
  const [otherAllow, setOtherAllow] = useState<number | ''>('');
  const [pfWage, setPfWage] = useState<number | ''>('');
  const [uan, setUan] = useState('');
  const [esiNo, setEsiNo] = useState('');
  const [isEnrolledEpf, setIsEnrolledEpf] = useState(true);
  const [isEnrolledEsi, setIsEnrolledEsi] = useState(true);

  // Totals
  const totalGrossCommitment = employees.reduce((sum, e) => sum + e.gross, 0);
  const epfEnrolledCount = employees.filter((e) => e.isEnrolledEpf).length;
  const esiEnrolledCount = employees.filter((e) => e.isEnrolledEsi).length;

  const groups = ['All', 'Service advisor', 'Technician', 'Store', 'Support', 'Management'];

  const filtered = employees.filter((e) => {
    const matchesGroup = groupFilter === 'All' || e.group === groupFilter;
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());

    return matchesGroup && matchesSearch;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    const basicNum = Number(basic) || 12000;
    const allowNum = Number(otherAllow) || 3000;
    const gross = basicNum + allowNum;
    const perDay = Math.round(gross / 30);
    const wageNum = Number(pfWage) || Math.min(gross, 15000);

    addEmployee({
      code: code.trim().toUpperCase(),
      name: name.trim().toUpperCase(),
      phone: phone.trim() || '9842100000',
      designation: designation.trim(),
      group,
      basic: basicNum,
      otherAllow: allowNum,
      gross,
      perDay,
      pfWage: wageNum,
      uan: uan.trim() || '101900000000',
      esiNo: esiNo.trim() || '51000000000000000',
      isEnrolledEpf,
      isEnrolledEsi,
      active: true,
      salaryPaidStatus: 'Unpaid',
    });

    setIsAddModalOpen(false);
    setCode('');
    setName('');
    setPhone('');
    setBasic('');
    setOtherAllow('');
    setPfWage('');
    setUan('');
    setEsiNo('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Staff & Employees Master
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            27 workshop technicians, service advisors, inventory controllers & management headcount
          </p>
        </div>
        <button
          onClick={() => {
            const nextCode = `EMP${String(employees.length + 1).padStart(3, '0')}`;
            setCode(nextCode);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
        >
          <span className="text-base font-bold">+</span>
          Add Employee
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Headcount"
          value={employees.length}
          subtitle="Active on payroll"
        />
        <StatCard
          title="Monthly Gross Payroll"
          value={`₹${totalGrossCommitment.toLocaleString('en-IN')}`}
          subtitle="Committed wage roll"
        />
        <StatCard
          title="EPF Covered Staff"
          value={epfEnrolledCount}
          subtitle="Provident Fund enrolled"
        />
        <StatCard
          title="ESI Covered Staff"
          value={esiEnrolledCount}
          subtitle="Statutory medical benefits"
        />
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, name, designation..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setGroupFilter(grp)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  groupFilter === grp
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Code & Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3 text-right">Basic</th>
                  <th className="px-4 py-3 text-right">Gross Salary</th>
                  <th className="px-4 py-3 text-right">Per Day</th>
                  <th className="px-4 py-3 text-center">Statutory Coverage</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No employees match the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {emp.code}
                        </span>
                        <div className="font-semibold text-slate-900 dark:text-white mt-1">
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{emp.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                          {emp.group}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-800 dark:text-slate-200">
                        {emp.designation}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-500">
                        ₹{emp.basic.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{emp.gross.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-slate-500">
                        ₹{emp.perDay.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex gap-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
                              emp.isEnrolledEpf
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            EPF
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
                              emp.isEnrolledEsi
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            ESI
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Employee Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. M. MUTHU"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Department / Group
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Technician</option>
                <option>Service advisor</option>
                <option>Store</option>
                <option>Support</option>
                <option>Management</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Senior Mechanic / Bodyshop Lead"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Basic Pay (₹)
              </label>
              <input
                type="number"
                value={basic}
                onChange={(e) => setBasic(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15000"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Allowances (₹)
              </label>
              <input
                type="number"
                value={otherAllow}
                onChange={(e) => setOtherAllow(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="3000"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                PF Wage Ceiling (₹)
              </label>
              <input
                type="number"
                value={pfWage}
                onChange={(e) => setPfWage(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15000"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Statutory Coverage Options
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isEnrolledEpf}
                  onChange={(e) => setIsEnrolledEpf(e.target.checked)}
                  className="rounded-sm text-blue-600"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Enrolled in EPF (12% + 12%)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isEnrolledEsi}
                  onChange={(e) => setIsEnrolledEsi(e.target.checked)}
                  className="rounded-sm text-blue-600"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Enrolled in ESI (0.75% + 3.25%)
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
