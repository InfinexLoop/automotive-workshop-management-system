import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { JobCardPart, JobCardLabour, JobCardCover } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export const NewJobCardPage: React.FC = () => {
  const navigate = useNavigate();
  const { customers, vehicles, employees, inventory, addJobCard, addCustomer, addVehicle } = useData();

  // Form states
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const [regNo, setRegNo] = useState('');
  const [brand, setBrand] = useState('Maruti Suzuki');
  const [model, setModel] = useState('Swift VDi');
  const [odometer, setOdometer] = useState<number>(45000);
  const [mfgYear, setMfgYear] = useState<number>(2021);
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'LPG' | 'Electric' | 'Hybrid'>('Diesel');
  const [engineNo, setEngineNo] = useState('');
  const [bodyColor, setBodyColor] = useState('Pearl white');

  const [advisorName, setAdvisorName] = useState('Aditya Kulkarni');
  const [advisorMobile, setAdvisorMobile] = useState('9876500703');
  const [sendSms, setSendSms] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [customerComplaint, setCustomerComplaint] = useState('');

  const [parts, setParts] = useState<JobCardPart[]>([]);
  const [labour, setLabour] = useState<JobCardLabour[]>([]);

  // When selecting existing customer
  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSelectedCustomerId('');
      return;
    }
    const found = customers.find((c) => c.id === val);
    if (found) {
      setSelectedCustomerId(found.id);
      setCustomerName(found.name);
      setCustomerMobile(found.mobile);

      // Check if this customer has a vehicle
      const custVeh = vehicles.find((v) => v.customerId === found.id);
      if (custVeh) {
        setRegNo(custVeh.regNo);
        setBrand(custVeh.brand);
        setModel(custVeh.model);
        setFuelType(custVeh.fuelType);
        setOdometer(custVeh.odometer);
        setMfgYear(custVeh.year);
        if (custVeh.engineNo) setEngineNo(custVeh.engineNo);
        if (custVeh.color) setBodyColor(custVeh.color);
      }
    }
  };

  // Quick select vehicle
  const handleSelectVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const foundVeh = vehicles.find((v) => v.regNo === val);
    if (foundVeh) {
      setRegNo(foundVeh.regNo);
      setBrand(foundVeh.brand);
      setModel(foundVeh.model);
      setFuelType(foundVeh.fuelType);
      setOdometer(foundVeh.odometer);
      setMfgYear(foundVeh.year);
      if (foundVeh.engineNo) setEngineNo(foundVeh.engineNo);
      if (foundVeh.color) setBodyColor(foundVeh.color);

      // Also set owner
      const owner = customers.find((c) => c.id === foundVeh.customerId);
      if (owner) {
        setSelectedCustomerId(owner.id);
        setCustomerName(owner.name);
        setCustomerMobile(owner.mobile);
      }
    }
  };

  // Quick add part
  const handleQuickAddPart = (partId: string) => {
    if (!partId) return;
    const inv = inventory.find((p) => p.id === partId);
    if (!inv) return;

    const newPart: JobCardPart = {
      id: `p-${Date.now()}-${Math.random()}`,
      partId: inv.id,
      name: inv.name,
      hsn: inv.hsn,
      qty: 1,
      rate: inv.sellRate,
      gstPercent: inv.gstPercent,
      amount: inv.sellRate,
    };
    setParts([...parts, newPart]);
  };

  const handleAddBlankPart = () => {
    const newPart: JobCardPart = {
      id: `p-${Date.now()}-${Math.random()}`,
      name: '',
      hsn: '8708',
      qty: 1,
      rate: 0,
      gstPercent: 18,
      amount: 0,
    };
    setParts([...parts, newPart]);
  };

  const handleUpdatePart = (id: string, field: keyof JobCardPart, val: any) => {
    setParts(
      parts.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: val };
          if (field === 'qty' || field === 'rate') {
            updated.amount = Number(updated.qty || 0) * Number(updated.rate || 0);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  // Quick add labour presets
  const LABOUR_PRESETS = [
    { name: 'AC service & gas top-up', sac: '998714', rate: 2500 },
    { name: 'Brake overhaul — front', sac: '998714', rate: 1200 },
    { name: 'Denting — per panel', sac: '998714', rate: 1800 },
    { name: 'Diagnostics scan', sac: '998714', rate: 750 },
    { name: 'Interior detailing', sac: '998714', rate: 1500 },
    { name: 'Painting — per panel', sac: '998714', rate: 2200 },
    { name: 'Periodic service', sac: '998714', rate: 1800 },
    { name: 'Wheel alignment', sac: '998714', rate: 450 },
    { name: 'Wheel balancing (4)', sac: '998714', rate: 600 },
  ];

  const handleQuickAddLabour = (name: string) => {
    if (!name) return;
    const preset = LABOUR_PRESETS.find((l) => l.name === name);
    if (!preset) return;

    const newLabour: JobCardLabour = {
      id: `l-${Date.now()}-${Math.random()}`,
      name: preset.name,
      sac: preset.sac,
      technicianId: 'e10',
      technicianName: 'Dinesh Kumar M.',
      qty: 1,
      rate: preset.rate,
      gstPercent: 18,
      amount: preset.rate,
    };
    setLabour([...labour, newLabour]);
  };

  const handleAddBlankLabour = () => {
    const newLabour: JobCardLabour = {
      id: `l-${Date.now()}-${Math.random()}`,
      name: '',
      sac: '998714',
      technicianId: 'e10',
      technicianName: 'Dinesh Kumar M.',
      qty: 1,
      rate: 0,
      gstPercent: 18,
      amount: 0,
    };
    setLabour([...labour, newLabour]);
  };

  const handleUpdateLabour = (id: string, field: keyof JobCardLabour, val: any) => {
    setLabour(
      labour.map((l) => {
        if (l.id === id) {
          const updated = { ...l, [field]: val };
          if (field === 'qty' || field === 'rate') {
            updated.amount = Number(updated.qty || 0) * Number(updated.rate || 0);
          }
          if (field === 'technicianId') {
            const foundTech = employees.find((e) => e.id === val);
            if (foundTech) updated.technicianName = foundTech.name;
          }
          return updated;
        }
        return l;
      })
    );
  };

  const handleRemoveLabour = (id: string) => {
    setLabour(labour.filter((l) => l.id !== id));
  };

  // Calculations
  const sparesTotal = parts.reduce((sum, p) => sum + p.amount, 0);
  const labourTotal = labour.reduce((sum, l) => sum + l.amount, 0);
  const grossTotal = sparesTotal + labourTotal;
  const taxableTotal = grossTotal;
  
  // GST calculation
  const partsGst = parts.reduce((sum, p) => sum + p.amount * (p.gstPercent / 100), 0);
  const labourGst = labour.reduce((sum, l) => sum + l.amount * (l.gstPercent / 100), 0);
  const totalGst = partsGst + labourGst;
  const cgstTotal = totalGst / 2;
  const sgstTotal = totalGst / 2;
  const netTotal = taxableTotal + totalGst;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCustId = selectedCustomerId;
    if (!finalCustId) {
      const createdCust = addCustomer({
        name: customerName || 'Walk-in Customer',
        mobile: customerMobile || '9840000000',
        email: '',
        gstin: '',
        address: 'Bengaluru',
      });
      finalCustId = createdCust.id;
    }

    const createdVeh = addVehicle({
      regNo: regNo || `KA05TQ${Math.floor(1000 + Math.random() * 9000)}`,
      brand,
      model,
      year: mfgYear,
      fuelType,
      engineNo,
      color: bodyColor,
      odometer: Number(odometer) || 0,
      customerId: finalCustId,
    });

    const cover: JobCardCover = isInsurance ? 'Insurance' : 'Customer paid';

    const newCard = addJobCard({
      date: new Date().toLocaleDateString('en-GB'),
      customerId: finalCustId,
      customerName: customerName || 'Walk-in Customer',
      customerMobile: customerMobile || '9840000000',
      vehicleId: createdVeh.id,
      regNo: createdVeh.regNo,
      vehicleName: `${brand} ${model}`,
      vehicleFuel: fuelType,
      vehicleOdometer: Number(odometer) || 0,
      vehicleEngineNo: engineNo,
      advisorId: 'e1',
      advisorName,
      advisorMobile,
      cover,
      insuranceCompany: isInsurance ? insuranceCompany || 'United India Insurance' : undefined,
      complaints: customerComplaint || 'Routine inspection & servicing',
      status: 'Open',
      parts,
      labour,
      payments: [],
      sparesTotal,
      labourTotal,
      grossTotal,
      taxableTotal,
      cgstTotal,
      sgstTotal,
      netTotal,
      balanceDue: netTotal,
    });

    navigate(`/jobs/${newCard.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            New job card · Gate-in Entry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Book a vehicle in
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Type a registration number — a known vehicle fills in its own brand, model, owner and service history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            Save job card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Customer, Vehicle, Spares, Labour */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Customer Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Customer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pick an existing customer or key in details for a walk-in
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Existing Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={handleSelectCustomer}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">-- Choose existing customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="98400 00000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Vehicle Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Vehicle
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pick a customer first, or type a registration
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Vehicle no. *
                </label>
                <input
                  type="text"
                  required
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                  placeholder="TN 74 XX 0000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Maruti Suzuki"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Swift VDi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Odometer (km)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(Number(e.target.value))}
                  placeholder="45000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Mfg. year
                </label>
                <input
                  type="number"
                  value={mfgYear}
                  onChange={(e) => setMfgYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Fuel
                </label>
                <select
                  value={fuelType}
                  onChange={(e: any) => setFuelType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="LPG">LPG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Engine no.
                </label>
                <input
                  type="text"
                  value={engineNo}
                  onChange={(e) => setEngineNo(e.target.value)}
                  placeholder="K10B..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Body colour
                </label>
                <input
                  type="text"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  placeholder="Pearl white"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Service advisor
                </label>
                <select
                  value={advisorName}
                  onChange={(e) => {
                    setAdvisorName(e.target.value);
                    const emp = employees.find((x) => x.name === e.target.value);
                    if (emp) setAdvisorMobile(emp.phone);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                >
                  {employees
                    .filter((e) => e.group === 'Service advisor' || e.group === 'Management')
                    .map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Advisor mobile
                </label>
                <input
                  type="text"
                  value={advisorMobile}
                  onChange={(e) => setAdvisorMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendSms}
                  onChange={(e) => setSendSms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Send the estimate to the customer by SMS
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isInsurance}
                  onChange={(e) => setIsInsurance(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  Insurance claim — bill the insurance company for this job
                </span>
              </label>
            </div>

            {isInsurance && (
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Insurance Provider
                </label>
                <select
                  value={insuranceCompany}
                  onChange={(e) => setInsuranceCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                >
                  <option value="United India Insurance">United India Insurance</option>
                  <option value="New India Assurance">New India Assurance</option>
                  <option value="Policy Bazaar (Tata AIG)">Policy Bazaar (Tata AIG)</option>
                  <option value="ICICI Lombard">ICICI Lombard</option>
                  <option value="Bajaj Allianz">Bajaj Allianz</option>
                  <option value="HDFC ERGO">HDFC ERGO</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Customer complaint / Reported Problems
              </label>
              <textarea
                rows={2}
                value={customerComplaint}
                onChange={(e) => setCustomerComplaint(e.target.value)}
                placeholder="What the customer reported..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* 3. Spares Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spares
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Parts required for this job
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    handleQuickAddPart(e.target.value);
                    e.target.value = '';
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <option value="">Quick add part…</option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} (₹{inv.sellRate})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddBlankPart}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Blank line</span>
                </button>
              </div>
            </div>

            {parts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No parts yet — pick one from “Quick add part” or add a blank line.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Part</th>
                      <th className="py-2.5 px-3 w-24">HSN</th>
                      <th className="py-2.5 px-3 w-16">Qty</th>
                      <th className="py-2.5 px-3 w-24">Rate</th>
                      <th className="py-2.5 px-3 w-16">GST%</th>
                      <th className="py-2.5 px-3 w-24 text-right">Amount</th>
                      <th className="py-2.5 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {parts.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => handleUpdatePart(p.id, 'name', e.target.value)}
                            placeholder="Part description"
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={p.hsn}
                            onChange={(e) => handleUpdatePart(p.id, 'hsn', e.target.value)}
                            className="w-full bg-transparent border-none text-xs font-mono text-slate-600 dark:text-slate-300 p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={p.qty}
                            onChange={(e) => handleUpdatePart(p.id, 'qty', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={p.rate}
                            onChange={(e) => handleUpdatePart(p.id, 'rate', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={p.gstPercent}
                            onChange={(e) => handleUpdatePart(p.id, 'gstPercent', Number(e.target.value))}
                            className="bg-transparent border-none text-xs text-slate-600 dark:text-slate-300 p-0 focus:ring-0"
                          >
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                            <option value={12}>12%</option>
                            <option value={5}>5%</option>
                            <option value={0}>0%</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
                          ₹{p.amount.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePart(p.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 4. Labour Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Labour
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Service operations & technician assignments
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    handleQuickAddLabour(e.target.value);
                    e.target.value = '';
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  <option value="">Quick add labour…</option>
                  {LABOUR_PRESETS.map((lp) => (
                    <option key={lp.name} value={lp.name}>
                      {lp.name} (₹{lp.rate})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddBlankLabour}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Blank line</span>
                </button>
              </div>
            </div>

            {labour.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No labour lines added yet. Pick from presets or create a custom task.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Work done</th>
                      <th className="py-2.5 px-3 w-40">Assigned Technician</th>
                      <th className="py-2.5 px-3 w-20">SAC</th>
                      <th className="py-2.5 px-3 w-16">Qty</th>
                      <th className="py-2.5 px-3 w-24">Rate</th>
                      <th className="py-2.5 px-3 w-24 text-right">Amount</th>
                      <th className="py-2.5 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {labour.map((l) => (
                      <tr key={l.id}>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={l.name}
                            onChange={(e) => handleUpdateLabour(l.id, 'name', e.target.value)}
                            placeholder="Operation details"
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <select
                            value={l.technicianId}
                            onChange={(e) => handleUpdateLabour(l.id, 'technicianId', e.target.value)}
                            className="w-full bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 p-0 focus:ring-0"
                          >
                            {employees
                              .filter((e) => e.group === 'Technician')
                              .map((tech) => (
                                <option key={tech.id} value={tech.id}>
                                  {tech.name}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={l.sac}
                            onChange={(e) => handleUpdateLabour(l.id, 'sac', e.target.value)}
                            className="w-full bg-transparent border-none text-xs font-mono text-slate-600 dark:text-slate-300 p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={l.qty}
                            onChange={(e) => handleUpdateLabour(l.id, 'qty', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={l.rate}
                            onChange={(e) => handleUpdateLabour(l.id, 'rate', Number(e.target.value))}
                            className="w-full bg-transparent border-none text-xs text-slate-900 dark:text-white p-0 focus:ring-0"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-medium text-slate-900 dark:text-white">
                          ₹{l.amount.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveLabour(l.id)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky Column: Live Costing Summary */}
        <div className="lg:col-span-4 sticky top-20 space-y-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Costing & Tax Summary
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Spare amount</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  ₹{sparesTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Labour amount</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  ₹{labourTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                <span>Gross value</span>
                <span className="font-mono">
                  ₹{grossTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Taxable value</span>
                <span className="font-mono">
                  ₹{taxableTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>CGST</span>
                <span className="font-mono">
                  ₹{cgstTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>SGST</span>
                <span className="font-mono">
                  ₹{sgstTotal.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Estimated Net Total
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Inclusive of all taxes
                  </div>
                </div>
                <div className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                  ₹{Math.round(netTotal).toLocaleString('en-IN')}.00
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Save & Generate Job Card</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
