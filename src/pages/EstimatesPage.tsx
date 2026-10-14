import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { EstimateStatus } from '../types';

export const EstimatesPage: React.FC = () => {
  const { estimates, customers, vehicles, addEstimate, convertEstimateToJobCard } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [regNo, setRegNo] = useState('');
  const [vehicleName, setVehicleName] = useState('Maruti Suzuki Swift VDi');
  const [amount, setAmount] = useState<number>(7500);

  const awaitingDecisionCount = estimates.filter((e) => e.status === 'Draft' || e.status === 'Sent').length;
  const approvedCount = estimates.filter((e) => e.status === 'Approved').length;
  const convertedCount = estimates.filter((e) => e.status === 'Converted').length;
  const totalQuoted = estimates
    .filter((e) => e.status === 'Draft' || e.status === 'Sent')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCustomerId(val);
    const found = customers.find((c) => c.id === val);
    if (found) {
      setCustomerName(found.name);
      setCustomerMobile(found.mobile);
      const custVeh = vehicles.find((v) => v.customerId === found.id);
      if (custVeh) {
        setRegNo(custVeh.regNo);
        setVehicleName(`${custVeh.brand} ${custVeh.model}`);
      }
    }
  };

  const handleCreateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    addEstimate({
      date: new Date().toLocaleDateString('en-GB'),
      customerId: selectedCustomerId || 'c1',
      customerName: customerName || 'Walk-in Customer',
      customerMobile: customerMobile || '9840000000',
      vehicleId: 'v1',
      regNo: regNo || 'KA01TQ1042',
      vehicleName: vehicleName || 'Maruti Suzuki Swift VDi',
      status: 'Sent',
      linesCount: 2,
      amount: Number(amount) || 5000,
      parts: [
        { id: 'ep1', name: 'General maintenance parts', hsn: '8708', qty: 1, rate: amount * 0.6, gstPercent: 18, amount: amount * 0.6 }
      ],
      labour: [
        { id: 'el1', name: 'Inspection & servicing labour', sac: '998714', qty: 1, rate: amount * 0.4, gstPercent: 18, amount: amount * 0.4 }
      ]
    });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: EstimateStatus) => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Sent':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold';
      case 'Converted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Front desk
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Estimates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            The repair order handed to a customer before work starts. An estimate carries no bill number and is never revenue — it becomes a job card once the customer approves it.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ New Estimate</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting a decision"
          value={awaitingDecisionCount}
          subtitle={`₹${totalQuoted.toLocaleString('en-IN')} quoted`}
          highlight={true}
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          subtitle="Ready to become a job card"
        />
        <StatCard
          title="Converted"
          value={convertedCount}
          subtitle="Became a job card"
        />
        <StatCard
          title="Total raised"
          value={estimates.length}
          subtitle="Most recent 100"
        />
      </div>

      {/* Estimates Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Estimate no.</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Lines</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {estimates.map((est) => (
                <tr key={est.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                    {est.estimateNo}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {est.date}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{est.regNo}</div>
                    <div className="text-[11px] text-slate-400">{est.vehicleName}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {est.customerName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${getStatusBadge(est.status)}`}>
                      {est.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {est.linesCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{est.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {est.status !== 'Converted' ? (
                      <button
                        onClick={() => convertEstimateToJobCard(est.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors cursor-pointer"
                      >
                        <span>Convert</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        ✓ Converted
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Estimate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Estimate"
        subtitle="Prepare repair quotation for customer approval"
      >
        <form onSubmit={handleCreateEstimate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={handleSelectCustomer}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white"
            >
              <option value="">-- Choose existing customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mobile})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile
              </label>
              <input
                type="text"
                required
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="Mobile number"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle No.
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="TN 74 XX 0000"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Amount (₹)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
            >
              Save Estimate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
