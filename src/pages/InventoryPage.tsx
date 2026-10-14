import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/Modal';

export const InventoryPage: React.FC = () => {
  const { inventory, addInventoryPart, adjustInventoryStock } = useData();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustPartId, setAdjustPartId] = useState<string | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(0);

  // Add Part Form State
  const [name, setName] = useState('');
  const [partNo, setPartNo] = useState('');
  const [hsn, setHsn] = useState('8708');
  const [category, setCategory] = useState('Filters');
  const [unit, setUnit] = useState('Nos');
  const [inStock, setInStock] = useState<number | ''>('');
  const [reorderLevel, setReorderLevel] = useState<number | ''>(5);
  const [avgCost, setAvgCost] = useState<number | ''>('');
  const [sellRate, setSellRate] = useState<number | ''>('');
  const [gstPercent, setGstPercent] = useState(18);

  // Valuation
  const totalCostValue = inventory.reduce((sum, p) => sum + p.inStock * p.avgCost, 0);
  const totalRetailValue = inventory.reduce((sum, p) => sum + p.inStock * p.sellRate, 0);
  const lowStockCount = inventory.filter((p) => p.inStock <= p.reorderLevel).length;

  const categories = ['All', 'Filters', 'Lubricants', 'Braking', 'Suspension', 'Electrical', 'Transmission', 'Cooling'];

  const filtered = inventory.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partNo.toLowerCase().includes(search.toLowerCase()) ||
      p.hsn.includes(search);
    const matchesLowStock = !onlyLowStock || p.inStock <= p.reorderLevel;

    return matchesCat && matchesSearch && matchesLowStock;
  });

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !partNo.trim()) return;

    addInventoryPart({
      name: name.trim().toUpperCase(),
      partNo: partNo.trim().toUpperCase(),
      hsn: hsn.trim(),
      category,
      unit,
      inStock: Number(inStock) || 0,
      reorderLevel: Number(reorderLevel) || 5,
      avgCost: Number(avgCost) || 0,
      sellRate: Number(sellRate) || 0,
      gstPercent,
    });

    setIsAddModalOpen(false);
    setName('');
    setPartNo('');
    setInStock('');
    setAvgCost('');
    setSellRate('');
  };

  const handleConfirmAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustPartId || adjustDelta === 0) return;
    adjustInventoryStock(adjustPartId, adjustDelta);
    setAdjustPartId(null);
    setAdjustDelta(0);
  };

  const activeAdjustPart = inventory.find((p) => p.id === adjustPartId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Spare Parts & Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time stock valuation, OEM part numbers, reorder warnings & bin management
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
        >
          <span className="text-base font-bold">+</span>
          Add Part SKU
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Stock Cost Value"
          value={`₹${totalCostValue.toLocaleString('en-IN')}`}
          subtitle="Valuation at purchase cost"
        />
        <StatCard
          title="Retail Potential"
          value={`₹${totalRetailValue.toLocaleString('en-IN')}`}
          subtitle="Estimated workshop billing value"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Items at or below reorder level"
        />
        <StatCard
          title="Active SKUs"
          value={inventory.length}
          subtitle="Spares, fluids & assemblies"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search part name, OEM part no, or HSN..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded-sm text-amber-600 focus:ring-amber-500"
            />
            <span>⚠️ Show Low Stock Only ({lowStockCount})</span>
          </label>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Part Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">HSN Code</th>
                  <th className="px-4 py-3 text-center">In Stock</th>
                  <th className="px-4 py-3 text-right">Avg Cost</th>
                  <th className="px-4 py-3 text-right">Selling Rate</th>
                  <th className="px-4 py-3 text-right">Margin</th>
                  <th className="px-4 py-3 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      No inventory parts found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((part) => {
                    const isLow = part.inStock <= part.reorderLevel;
                    const margin = part.sellRate > 0 ? (((part.sellRate - part.avgCost) / part.sellRate) * 100).toFixed(0) : '0';

                    return (
                      <tr
                        key={part.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {part.name}
                          </div>
                          <div className="font-mono text-xs text-slate-400">
                            OEM: {part.partNo}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {part.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                          {part.hsn}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full ${
                              isLow
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            }`}
                          >
                            {isLow && '⚠️ '}
                            {part.inStock} {part.unit}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Min: {part.reorderLevel}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs">
                          ₹{part.avgCost.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          ₹{part.sellRate.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          +{margin}%
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                setAdjustPartId(part.id);
                                setAdjustDelta(5);
                              }}
                              className="px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-md transition-colors"
                            >
                              + Receive
                            </button>
                            <button
                              onClick={() => {
                                setAdjustPartId(part.id);
                                setAdjustDelta(-1);
                              }}
                              className="px-2 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              - Issue
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
      </div>

      {/* Add Part Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Part SKU to Inventory"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreatePart} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Part Name & Specification *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Engine Oil Filter (Swift Petrol)"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                OEM / Part Number *
              </label>
              <input
                type="text"
                required
                value={partNo}
                onChange={(e) => setPartNo(e.target.value)}
                placeholder="e.g. 16510M68K00"
                className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Filters</option>
                <option>Lubricants</option>
                <option>Braking</option>
                <option>Suspension</option>
                <option>Electrical</option>
                <option>Transmission</option>
                <option>Cooling</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                HSN Code
              </label>
              <input
                type="text"
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Unit of Measure
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option>Nos</option>
                <option>Litre</option>
                <option>Set</option>
                <option>Metre</option>
                <option>Kg</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                value={inStock}
                onChange={(e) => setInStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="10"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Reorder Level
              </label>
              <input
                type="number"
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                value={avgCost}
                onChange={(e) => setAvgCost(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="220"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Sell Price (₹)
              </label>
              <input
                type="number"
                value={sellRate}
                onChange={(e) => setSellRate(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="320"
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
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
              Save SKU
            </button>
          </div>
        </form>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!adjustPartId}
        onClose={() => setAdjustPartId(null)}
        title={`Adjust Stock: ${activeAdjustPart?.name || ''}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmAdjust} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-sm border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400">Current In-Stock Quantity:</div>
            <div className="text-xl font-mono font-bold text-slate-900 dark:text-white">
              {activeAdjustPart?.inStock} {activeAdjustPart?.unit}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Quantity Delta (+ to Receive, - to Issue) *
            </label>
            <input
              type="number"
              required
              value={adjustDelta}
              onChange={(e) => setAdjustDelta(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="text-xs text-slate-500">
            New balance will be:{' '}
            <span className="font-bold font-mono text-slate-900 dark:text-white">
              {Math.max(0, (activeAdjustPart?.inStock || 0) + adjustDelta)} {activeAdjustPart?.unit}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setAdjustPartId(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
