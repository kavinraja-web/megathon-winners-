import React from 'react';
import { mockBatches } from '../data/mockData';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const Returns = () => {
  const returnRequests = mockBatches.filter(b => b.status === 'Return Requested');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Return Requests</h2>
        <p className="text-slate-500">Manage batches requested for return due to expiry, damage, or recall.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {returnRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <RefreshCw size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium">No pending return requests</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-semibold">Batch ID</th>
                <th className="p-4 font-semibold">Medicine</th>
                <th className="p-4 font-semibold">Pharmacy / Location</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returnRequests.map(batch => (
                <tr key={batch.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{batch.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{batch.name}</p>
                    <p className="text-xs text-slate-500">Qty: {batch.quantity}</p>
                  </td>
                  <td className="p-4 text-slate-600">{batch.location}</td>
                  <td className="p-4 text-orange-600 font-medium text-sm">Expired</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Returns;