import React from 'react';
import { mockBatches } from '../data/mockData';
import { AlertTriangle, Clock, Send } from 'lucide-react';

const ExpiryAlerts = () => {
  const alerts = mockBatches.filter(b => {
    const isExpired = new Date(b.expDate) < new Date();
    const isNear = new Date(b.expDate).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 60; // 60 days
    return isExpired || isNear;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Expiry Alerts</h2>
        <p className="text-slate-500">Monitor batches that are expired or nearing expiration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex items-center gap-4">
          <Clock className="text-orange-500" size={32} />
          <div>
            <p className="text-sm font-medium text-orange-800">Expiring in 60 Days</p>
            <p className="text-2xl font-bold text-orange-900">{alerts.filter(a => new Date(a.expDate) >= new Date()).length}</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="text-red-500" size={32} />
          <div>
            <p className="text-sm font-medium text-red-800">Already Expired</p>
            <p className="text-2xl font-bold text-red-900">{alerts.filter(a => new Date(a.expDate) < new Date()).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-semibold">Batch ID</th>
              <th className="p-4 font-semibold">Medicine</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Expiry Date</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map(batch => (
              <tr key={batch.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-900">{batch.id}</td>
                <td className="p-4">
                  <p className="font-semibold text-slate-900">{batch.name}</p>
                  <p className="text-xs text-slate-500">Qty: {batch.quantity}</p>
                </td>
                <td className="p-4 text-slate-600">{batch.location}</td>
                <td className="p-4 text-slate-900 font-medium">{batch.expDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    new Date(batch.expDate) < new Date() ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {new Date(batch.expDate) < new Date() ? 'Expired' : 'Near Expiry'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-sm bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 ml-auto">
                    <Send size={14} /> Recall
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiryAlerts;