import React from 'react';
import { initialMfrBatches, updateBatchesBasedOnDate } from '../../data/manufacturerData';
import { AlertTriangle, Clock, XCircle } from 'lucide-react';

const ExpiryAlerts = () => {
  const batches = updateBatchesBasedOnDate(initialMfrBatches);
  
  const expired = batches.filter(b => b.status === 'EXPIRED');
  const nearExpiry = batches.filter(b => b.status === 'NEAR EXPIRY');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Expiry & Alerts</h1>
        <p className="text-slate-500">Monitor medicine batches approaching expiry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-800">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={24} />
            <h3 className="font-bold text-lg">Expired</h3>
          </div>
          <p className="text-3xl font-bold">{expired.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-800">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle size={24} />
            <h3 className="font-bold text-lg">Near Expiry</h3>
          </div>
          <p className="text-3xl font-bold">{nearExpiry.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} />
            <h3 className="font-bold text-lg">Expiring in 90 days</h3>
          </div>
          <p className="text-3xl font-bold">{nearExpiry.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Action Required</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-3">Medicine</th>
                <th className="px-6 py-3">Batch</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Remaining Stock</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...expired, ...nearExpiry].map(b => (
                <tr key={b.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">{b.medicineName} {b.strength}</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{b.batchNumber}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{b.expDate}</td>
                  <td className="px-6 py-4 text-sm">{b.remainingQuantity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      b.status === 'EXPIRED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
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

export default ExpiryAlerts;
