import React, { useState } from 'react';
import { mockBatches, Batch, addBatch } from '../data/mockData';
import { Eye, MapPin, QrCode, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Batches = () => {
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    mfgDate: '',
    expDate: '',
    mrp: '',
    quantity: ''
  });

  const filteredBatches = filter === 'All' ? mockBatches : mockBatches.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Near Expiry': return 'bg-orange-100 text-orange-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Destroyed': return 'bg-slate-200 text-slate-700';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Return Requested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a simple mock batch ID
    const newId = `B${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newBatch: Batch = {
      id: newId,
      name: formData.name,
      manufacturer: formData.manufacturer,
      mfgDate: formData.mfgDate,
      expDate: formData.expDate,
      mrp: Number(formData.mrp),
      quantity: Number(formData.quantity),
      location: 'Manufacturer Warehouse',
      status: 'Active',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    addBatch(newBatch);
    setIsModalOpen(false);
    setShowQR(newId);
    
    // Reset form
    setFormData({
      name: '',
      manufacturer: '',
      mfgDate: '',
      expDate: '',
      mrp: '',
      quantity: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medicine Batches</h2>
          <p className="text-slate-500 text-sm">Manage and track all registered medicine batches.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Register New Batch
        </button>
      </div>

      {showQR && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100">
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${showQR}`} 
               alt={`QR Code for ${showQR}`}
               className="w-24 h-24"
             />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-1">
              <CheckCircle size={20} className="text-emerald-500" />
              Batch {showQR} Registered Successfully!
            </h3>
            <p className="text-emerald-700 text-sm mb-4">
              A unique QR code has been generated. Please print this and attach it to the medicine batch.
            </p>
            <button 
              onClick={() => setShowQR(null)}
              className="text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Register New Batch</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Paracetamol 500mg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input required type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., Sun Pharma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mfg Date</label>
                  <input required type="date" name="mfgDate" value={formData.mfgDate} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input required type="date" name="expDate" value={formData.expDate} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                  <input required type="number" min="0" step="0.01" name="mrp" value={formData.mrp} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 120.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input required type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g., 5000" />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
                  Generate QR & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-2 overflow-x-auto">
          {['All', 'Active', 'Near Expiry', 'Expired', 'Return Requested', 'In Transit', 'Destroyed'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Batch ID</th>
                <th className="p-4 font-semibold">Medicine</th>
                <th className="p-4 font-semibold">Expiry Date</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch: Batch) => (
                <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{batch.id}</td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-900">{batch.name}</p>
                    <p className="text-xs text-slate-500">{batch.manufacturer}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{batch.expDate}</td>
                  <td className="p-4 text-sm text-slate-600">{batch.quantity.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="truncate max-w-[150px]">{batch.location}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/app/batches/${batch.id}`} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="View Details">
                        <Eye size={18} />
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Scan QR">
                        <QrCode size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Batches;