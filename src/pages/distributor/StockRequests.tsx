import React from 'react';
import { Package, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

const StockRequests = () => {
  const { stockRequests, updateStockRequestStatus } = usePOS();
  
  // Show all requests for demo, ideally filter by distributorId
  const requests = stockRequests || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Package className="text-indigo-500" /> Pharmacy Stock Requests
        </h2>
        <p className="text-slate-500">
          Manage and review incoming stock requests from pharmacies.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Incoming Requests</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
            {requests.filter(r => r.status === 'PENDING').length} Pending
          </span>
        </div>
        
        <div className="flex-1 p-0 overflow-auto">
          {requests.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Package size={48} className="mx-auto text-slate-200 mb-4" />
              <p>No stock requests found.</p>
              <p className="text-sm mt-1">When a pharmacy requests stock, it will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">Request Details</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Medicine & Batch</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Qty & Month</th>
                  <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{req.id}</p>
                      <p className="text-xs text-slate-500">Requested: {new Date(req.dateRequested).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{req.productName}</p>
                      <p className="text-xs text-slate-500 font-mono">Batch: {req.batchNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-indigo-600">{req.requestedQuantity} units</p>
                      <p className="text-xs text-slate-500">For: {req.month}</p>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                          <Clock size={14} /> PENDING
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                          <CheckCircle2 size={14} /> APPROVED
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200">
                          <XCircle size={14} /> REJECTED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateStockRequestStatus(req.id, 'APPROVED')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                            title="Approve Request"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateStockRequestStatus(req.id, 'REJECTED')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            title="Reject Request"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                      {req.status !== 'PENDING' && (
                        <span className="text-xs text-slate-400 font-medium">Action Taken</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockRequests;
