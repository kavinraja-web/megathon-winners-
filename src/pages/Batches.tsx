import React, { useState } from 'react';
import { mockBatches, Batch } from '../data/mockData';
import { Eye, MapPin, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const Batches = () => {
  const [filter, setFilter] = useState('All');

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medicine Batches</h2>
          <p className="text-slate-500 text-sm">Manage and track all registered medicine batches.</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          Register New Batch
        </button>
      </div>

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