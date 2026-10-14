import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const CustomersPage: React.FC = () => {
  const { customers, vehicles, jobCards, addCustomer, addVehicle } = useData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New customer form state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  // Optional vehicle
  const [includeVehicle, setIncludeVehicle] = useState(true);
  const [regNo, setRegNo] = useState('');
  const [brand, setBrand] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Electric'>('Petrol');
  const [year, setYear] = useState(2022);
  const [odometer, setOdometer] = useState(35000);

  // Filter customers
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      (c.gstin && c.gstin.toLowerCase().includes(q))
    );
  });

  // Calculate fleet stats
  const totalVehicles = vehicles.length;
  const gstRegisteredCount = customers.filter((c) => c.gstin && c.gstin.trim().length > 0).length;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) return;

    const newCust = addCustomer({
      name: name.trim().toUpperCase(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      gstin: gstin.trim().toUpperCase() || undefined,
      address: address.trim() || undefined,
    });

    if (includeVehicle && regNo.trim()) {
      addVehicle({
        regNo: regNo.trim().toUpperCase(),
        brand,
        model: model.trim() || 'General',
        year: Number(year) || 2022,
        fuelType,
        odometer: Number(odometer) || 0,
        customerId: newCust.id,
      });
    }

    setIsModalOpen(false);
    setName('');
    setMobile('');
    setEmail('');
    setGstin('');
    setAddress('');
    setRegNo('');
    setModel('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage car owners, fleet accounts, contact info, and associated vehicles
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
        >
          <span className="text-base font-bold">+</span>
          Add Customer
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={customers.length}
          subtitle="Registered accounts"
        />
        <StatCard
          title="Fleet Vehicles"
          value={totalVehicles}
          subtitle="Active garage vehicles"
        />
        <StatCard
          title="GST Accounts"
          value={gstRegisteredCount}
          subtitle="Commercial & B2B clients"
        />
        <StatCard
          title="Avg Vehicles / Cust"
          value={(totalVehicles / (customers.length || 1)).toFixed(1)}
          subtitle="Customer vehicle ratio"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, mobile, or GSTIN..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> of {customers.length} records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">GSTIN</th>
                <th className="px-4 py-3">Vehicles</th>
                <th className="px-4 py-3">Job Cards</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    No customers found matching &quot;{search}&quot;
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => {
                  const custVehicles = vehicles.filter((v) => v.customerId === cust.id);
                  const custJobCards = jobCards.filter((j) => j.customerId === cust.id);

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/customers/${cust.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {cust.name}
                        </Link>
                        {cust.address && (
                          <div className="text-xs text-slate-400 truncate max-w-xs">
                            {cust.address}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-900 dark:text-slate-200">
                          {cust.mobile}
                        </div>
                        {cust.email && (
                          <div className="text-xs text-slate-400">{cust.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {cust.gstin ? (
                          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                            {cust.gstin}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Consumer (B2C)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {custVehicles.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">None</span>
                          ) : (
                            custVehicles.map((v) => (
                              <span
                                key={v.id}
                                className="font-mono text-[11px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700"
                              >
                                {v.regNo}
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {custJobCards.length} job(s)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/customers/${cust.id}`}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => navigate(`/jobs/new?customerId=${cust.id}`)}
                            className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 rounded-md transition-colors"
                          >
                            + Job Card
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Customer / Business Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. S. SENTHIL KUMAR"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9842100000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="29AAACR1234F1Z5"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Billing Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Door No, Street, Area, Town, Pin Code"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* Add Vehicle Sub-section */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={includeVehicle}
                onChange={(e) => setIncludeVehicle(e.target.checked)}
                className="rounded-sm text-blue-600"
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Register first vehicle now
              </span>
            </label>

            {includeVehicle && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="TN 74 AB 1234"
                      className="w-full px-2.5 py-1.5 text-sm font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Brand
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    >
                      <option>Maruti Suzuki</option>
                      <option>Hyundai</option>
                      <option>Tata</option>
                      <option>Mahindra</option>
                      <option>Toyota</option>
                      <option>Honda</option>
                      <option>Kia</option>
                      <option>Volkswagen</option>
                      <option>Skoda</option>
                      <option>Ford</option>
                      <option>Renault</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Swift / Creta"
                      className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Fuel
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>CNG</option>
                      <option>Electric</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
