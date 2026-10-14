import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, vehicles, jobCards, estimates, addVehicle, updateCustomer } = useData();

  const customer = customers.find((c) => c.id === id);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add vehicle state
  const [regNo, setRegNo] = useState('');
  const [brand, setBrand] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Electric'>('Petrol');
  const [year, setYear] = useState(2022);
  const [odometer, setOdometer] = useState(42000);
  const [engineNo, setEngineNo] = useState('');
  const [vin, setVin] = useState('');

  // Edit customer state
  const [editName, setEditName] = useState(customer?.name || '');
  const [editMobile, setEditMobile] = useState(customer?.mobile || '');
  const [editEmail, setEditEmail] = useState(customer?.email || '');
  const [editGstin, setEditGstin] = useState(customer?.gstin || '');
  const [editAddress, setEditAddress] = useState(customer?.address || '');

  if (!customer) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested customer record does not exist or has been removed.</p>
        <Link
          to="/customers"
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
        >
          Back to Customer Directory
        </Link>
      </div>
    );
  }

  const customerVehicles = vehicles.filter((v) => v.customerId === customer.id);
  const customerJobCards = jobCards.filter((j) => j.customerId === customer.id);
  const customerEstimates = estimates.filter((e) => e.customerId === customer.id);

  // Lifetime metrics
  const totalBilled = customerJobCards.reduce((sum, j) => sum + j.netTotal, 0);
  const totalOutstanding = customerJobCards.reduce((sum, j) => sum + j.balanceDue, 0);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim()) return;

    addVehicle({
      regNo: regNo.trim().toUpperCase(),
      brand,
      model: model.trim() || 'General',
      fuelType,
      year: Number(year) || 2022,
      odometer: Number(odometer) || 0,
      engineNo: engineNo.trim() || undefined,
      vin: vin.trim() || undefined,
      customerId: customer.id,
    });

    setIsVehicleModalOpen(false);
    setRegNo('');
    setModel('');
    setEngineNo('');
    setVin('');
  };

  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomer({
      ...customer,
      name: editName.trim().toUpperCase(),
      mobile: editMobile.trim(),
      email: editEmail.trim() || undefined,
      gstin: editGstin.trim().toUpperCase() || undefined,
      address: editAddress.trim() || undefined,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/customers"
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {customer.name}
              </h1>
              {customer.gstin && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900">
                  GSTIN
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Client profile & service records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditName(customer.name);
              setEditMobile(customer.mobile);
              setEditEmail(customer.email || '');
              setEditGstin(customer.gstin || '');
              setEditAddress(customer.address || '');
              setIsEditModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50"
          >
            + Add Vehicle
          </button>
          <button
            onClick={() => navigate(`/jobs/new?customerId=${customer.id}`)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            + New Job Card
          </button>
        </div>
      </div>

      {/* Customer summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact Info</div>
          <div className="mt-2 space-y-1">
            <div className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
              📞 {customer.mobile}
            </div>
            {customer.email && (
              <div className="text-xs text-slate-500 truncate">
                ✉️ {customer.email}
              </div>
            )}
            {customer.gstin && (
              <div className="font-mono text-xs text-blue-600 dark:text-blue-400">
                GST: {customer.gstin}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Registered Address</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
            {customer.address || 'No physical address recorded.'}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lifetime Business</div>
          <div className="mt-2">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              ₹{totalBilled.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Across {customerJobCards.length} service invoices
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Outstanding Balance</div>
          <div className="mt-2">
            <div className={`text-xl font-bold ${totalOutstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ₹{totalOutstanding.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {totalOutstanding > 0 ? 'Payment due on pending bills' : 'All accounts settled'}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Vehicles Fleet */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Associated Vehicles ({customerVehicles.length})
          </h2>
          <button
            onClick={() => setIsVehicleModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            + Register Another Car
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerVehicles.map((veh) => {
            const vehJobs = jobCards.filter((j) => j.vehicleId === veh.id);
            return (
              <div
                key={veh.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                      {veh.regNo}
                    </span>
                    <div className="font-semibold text-slate-900 dark:text-white mt-1.5">
                      {veh.brand} {veh.model}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 font-medium">
                    {veh.fuelType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>Year: <span className="font-semibold text-slate-700 dark:text-slate-300">{veh.year}</span></div>
                  <div>Odometer: <span className="font-semibold text-slate-700 dark:text-slate-300">{veh.odometer.toLocaleString('en-IN')} km</span></div>
                  <div>Total Visits: <span className="font-semibold text-slate-700 dark:text-slate-300">{vehJobs.length}</span></div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/jobs/new?vehicleId=${veh.id}`)}
                    className="w-full py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    + Check-in for Service
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service History / Job Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Service History ({customerJobCards.length})
        </h2>

        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Bill No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Advisor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Invoice Total</th>
                  <th className="px-4 py-3 text-right">Balance Due</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customerJobCards.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No service records logged yet for this customer.
                    </td>
                  </tr>
                ) : (
                  customerJobCards.map((jc) => (
                    <tr
                      key={jc.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-white">
                        <Link to={`/jobs/${jc.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {jc.billNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs">{jc.date}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {jc.regNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{jc.advisorName}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            jc.status === 'Paid' || jc.status === 'Closed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                              : jc.status === 'Ready' || jc.status === 'Delivered'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                          }`}
                        >
                          {jc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{jc.netTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {jc.balanceDue > 0 ? (
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            ₹{jc.balanceDue.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Nil</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/jobs/${jc.id}`}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors"
                        >
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        title={`Register Vehicle for ${customer.name}`}
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="TN 74 AB 1234"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Manufacturer / Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Model Name
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Swift VDi"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>CNG</option>
                <option>Electric</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Current Odometer Reading (km)
            </label>
            <input
              type="number"
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Customer Profile"
      >
        <form onSubmit={handleEditCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={editGstin}
                onChange={(e) => setEditGstin(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Billing Address
            </label>
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
