import React, { useState } from 'react';
import { initialMfrBatches } from '../../data/manufacturerData';
import { Truck, Search } from 'lucide-react';

const Distribution = () => {
  const [formData, setFormData] = useState({
    batchId: '',
    pharmacy: '',
    quantity: '',
    dispatchDate: new Date().toISOString().split('T')[0]
  });
  
  const [history, setHistory] = useState([
    { date: '2026-09-08', pharmacy: 'ABC Medicals', medicine: 'Paracetamol 500mg', batch: 'PCT-24051', quantity: 500, status: 'In Transit' },
    { date: '2026-09-05', pharmacy: 'Apollo Pharmacy', medicine: 'Amoxicillin 500mg', batch: 'AMX-24031', quantity: 1000, status: 'Delivered' }
  ]);

  const activeBatches = initialMfrBatches.filter(b => b.remainingQuantity > 0 && b.status !== 'EXPIRED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = initialMfrBatches.find(b => b.id === formData.batchId);
    if (!batch) return;
    
    if (parseInt(formData.quantity) > batch.remainingQuantity) {
      alert('Quantity exceeds remaining stock');
      return;
    }

    const newRecord = {
      date: formData.dispatchDate,
      pharmacy: formData.pharmacy,
      medicine: `${batch.medicineName} ${batch.strength}`,
      batch: batch.batchNumber,
      quantity: parseInt(formData.quantity),
      status: 'Dispatched'
    };
    
    setHistory([newRecord, ...history]);
    alert('Medicine batch dispatched successfully!');
    setFormData({...formData, quantity: '', pharmacy: ''});
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Distribution</h1>
        <p className="text-slate-500">Dispatch medicine batches to pharmacies and distributors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">New Dispatch</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Batch</label>
              <select 
                required 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.batchId}
                onChange={(e) => setFormData({...formData, batchId: e.target.value})}
              >
                <option value="">-- Select a Batch --</option>
                {activeBatches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.medicineName} {b.strength} ({b.batchNumber}) - {b.remainingQuantity} left
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Destination Pharmacy / Distributor</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. ABC Medicals"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.pharmacy}
                onChange={(e) => setFormData({...formData, pharmacy: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantity to Dispatch</label>
              <input 
                required 
                type="number" 
                min="1"
                placeholder="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dispatch Date</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.dispatchDate}
                onChange={(e) => setFormData({...formData, dispatchDate: e.target.value})}
              />
            </div>
            
            <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Truck size={18} /> Confirm Dispatch
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Distribution History</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search..." className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Pharmacy</th>
                    <th className="px-6 py-3">Medicine</th>
                    <th className="px-6 py-3">Batch</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((record, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{record.pharmacy}</td>
                      <td className="px-6 py-4 text-sm text-slate-800">{record.medicine}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{record.batch}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{record.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          record.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distribution;
