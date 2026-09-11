import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, QrCode, Truck } from 'lucide-react';
import { ManufacturerBatch, getMfrBatches, updateBatchesBasedOnDate } from '../../data/manufacturerData';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MedicineBatches = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<ManufacturerBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setBatches(updateBatchesBasedOnDate(getMfrBatches()));
  }, []);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? batch.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">ACTIVE</span>;
      case 'NEAR EXPIRY': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">NEAR EXPIRY</span>;
      case 'EXPIRED': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">EXPIRED</span>;
      case 'FULLY DISTRIBUTED': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">DISTRIBUTED</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Medicine Batches</h1>
        <button onClick={() => navigate('/manufacturer/add-batch')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add New Batch
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search medicine or batch number..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="NEAR EXPIRY">Near Expiry</option>
            <option value="EXPIRED">Expired</option>
            <option value="FULLY DISTRIBUTED">Fully Distributed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="p-4">Medicine</th>
                <th className="p-4">Batch No.</th>
                <th className="p-4">Mfg Date</th>
                <th className="p-4">Exp Date</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-slate-900">{batch.medicineName} {batch.strength}</p>
                    <p className="text-xs text-slate-500">{batch.id}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-mono">{batch.batchNumber}</td>
                  <td className="p-4 text-sm text-slate-600">{batch.mfgDate}</td>
                  <td className="p-4 text-sm text-slate-600">{batch.expDate}</td>
                  <td className="p-4 text-sm">
                    <p className="text-slate-900">{batch.mfgQuantity}</p>
                    <p className="text-xs text-slate-500">{batch.remainingQuantity} left</p>
                  </td>
                  <td className="p-4">{getStatusBadge(batch.status)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => toast.success('Viewing details for ' + batch.batchNumber)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => toast.success('Edit mode enabled for ' + batch.batchNumber)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => navigate(`/manufacturer/qr-generator?batch=${batch.batchNumber}`)} className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded" title="Generate QR">
                        <QrCode size={16} />
                      </button>
                      <button onClick={() => {
                        if(window.confirm('Are you sure you want to delete this batch?')) {
                          setBatches(batches.filter(b => b.id !== batch.id));
                          toast.success('Batch deleted successfully');
                        }
                      }} className="p-1.5 text-slate-400 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No batches found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicineBatches;
