import React, { useState } from 'react';
import { Store, Send, Search, CheckCircle2, ShieldCheck, Database, FileSpreadsheet, Package } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock data for available inventory received from manufacturer
const inventoryData = [
  { id: 'INV-001', name: 'Paracetamol 500mg', batchId: 'B-2023-001', manufacturer: 'ABC Pharma', expiry: '2025-10-15', availableQty: 5000, selectedQty: 0 },
  { id: 'INV-002', name: 'Amoxicillin 250mg', batchId: 'B-2023-089', manufacturer: 'ABC Pharma', expiry: '2024-12-01', availableQty: 2000, selectedQty: 0 },
  { id: 'INV-003', name: 'Ibuprofen 400mg', batchId: 'B-2023-112', manufacturer: 'XYZ Pharmaceuticals', expiry: '2026-01-20', availableQty: 8000, selectedQty: 0 },
  { id: 'INV-004', name: 'Vitamin C 1000mg', batchId: 'B-2023-045', manufacturer: 'HealthPlus', expiry: '2025-05-10', availableQty: 10000, selectedQty: 0 },
  { id: 'INV-005', name: 'Cetirizine 10mg', batchId: 'B-2023-067', manufacturer: 'ABC Pharma', expiry: '2025-08-22', availableQty: 3500, selectedQty: 0 },
];

const pharmacies = [
  { id: 'P-001', name: 'City Health Pharmacy', licenseNo: 'PH-12345', address: '123 Main St, Downtown' },
  { id: 'P-002', name: 'MedPlus Pharmacy', licenseNo: 'PH-67890', address: '456 Oak Avenue, Westside' },
  { id: 'P-003', name: 'Carewell Medicals', licenseNo: 'PH-11223', address: '789 Pine Road, Northville' },
];

const PharmacyConnect = () => {
  const [inventory, setInventory] = useState(inventoryData);
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacies[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleQtyChange = (id: string, value: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        // Ensure selected qty doesn't exceed available qty
        const safeValue = Math.min(Math.max(0, value), item.availableQty);
        return { ...item, selectedQty: safeValue };
      }
      return item;
    }));
  };

  const selectedItems = inventory.filter(item => item.selectedQty > 0);

  const handleShareDatabase = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one medicine to share.');
      return;
    }
    
    // In a real application, this would trigger an API call to transfer ownership of these items to the pharmacy
    // and share the complete tracing/lineage data.
    toast.success('Complete database securely shared with the selected pharmacy!');
    
    // Reset selected quantities
    setInventory(inventory.map(item => ({
      ...item,
      availableQty: item.availableQty - item.selectedQty,
      selectedQty: 0
    })));
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dealer to Pharmacist Connect</h2>
          <p className="text-slate-500 text-sm">Segregate medicines and share complete database tracking with medical shops.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Segregation & Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Package size={20} className="text-indigo-500" />
                Segregate Manufacturer Inventory
              </h3>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-64">
                <Search size={16} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search inventory..." 
                  className="bg-transparent border-none outline-none text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Medicine Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Batch ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Available Qty</th>
                    <th className="px-4 py-3 text-xs font-semibold text-indigo-600 uppercase">Allocate Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.manufacturer}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-mono">{item.batchId}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{item.availableQty}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max={item.availableQty}
                          value={item.selectedQty || ''}
                          onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-1.5 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pharmacy Selection & Database Share */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Store size={20} className="text-indigo-500" />
              Target Pharmacy
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Medical Shop</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={selectedPharmacy}
                  onChange={(e) => setSelectedPharmacy(e.target.value)}
                >
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {pharmacies.filter(p => p.id === selectedPharmacy).map(p => (
                <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-slate-900">{p.name}</p>
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-1">License: {p.licenseNo}</p>
                  <p className="text-xs text-slate-500">{p.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 shadow-md text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Database size={20} className="text-indigo-400" />
              Share Database
            </h3>
            
            <p className="text-sm text-slate-300 mb-6">
              This action will securely transfer the complete database of selected medicines, including lineage, batch history, and manufacturer certifications directly to the pharmacist's system.
            </p>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-200">Selected Items:</span>
                <span className="text-sm font-bold text-white">{selectedItems.length} batches</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-200">Total Units:</span>
                <span className="text-sm font-bold text-indigo-400">
                  {selectedItems.reduce((acc, item) => acc + item.selectedQty, 0)} units
                </span>
              </div>
            </div>

            <button 
              onClick={handleShareDatabase}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              <Send size={18} />
              Share Complete Database
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PharmacyConnect;
