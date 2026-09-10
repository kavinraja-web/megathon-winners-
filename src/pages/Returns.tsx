import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, Package } from 'lucide-react';
import { getReverseChain, ReverseRecord } from '../data/db';

const Returns = () => {
  const [returns, setReturns] = useState<ReverseRecord[]>([]);

  useEffect(() => {
    // Load returns from the mock database
    setReturns(getReverseChain().sort((a, b) => new Date(b.initiatedAt).getTime() - new Date(a.initiatedAt).getTime()));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Return Requests</h2>
        <p className="text-slate-500 text-sm">Track your expired medicine returns and reverse logistics.</p>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center">
          <Package size={48} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Returns</h3>
          <p className="text-slate-500 max-w-md mx-auto">You have not initiated any returns to distributors recently.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Return ID / Date</th>
                <th className="px-6 py-4">Batch Number</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Return To</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold font-mono text-slate-900">{ret.id}</p>
                    <p className="text-xs text-slate-500">{new Date(ret.initiatedAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{ret.batchNumber}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{ret.productName}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{ret.quantity} units</td>
                  <td className="px-6 py-4">{ret.toEntity}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      ret.status === 'PENDING_PICKUP' ? 'bg-orange-100 text-orange-700' :
                      ret.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ret.status === 'PENDING_PICKUP' && <Clock size={12} />}
                      {ret.status === 'IN_TRANSIT' && <Truck size={12} />}
                      {ret.status === 'DELIVERED' && <CheckCircle size={12} />}
                      {ret.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Returns;