import React, { useState } from 'react';
import { Package, Send, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

const RequestStock = () => {
  const { requestStock, stockRequests } = usePOS();
  
  const [batchNumber, setBatchNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [distributorId, setDistributorId] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState(100);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber || !productName || !distributorId || requestedQuantity <= 0 || !month) {
      return;
    }
    requestStock(batchNumber, productName, distributorId, requestedQuantity, month);
    setBatchNumber('');
    setProductName('');
    setDistributorId('');
    setRequestedQuantity(100);
  };

  const myRequests = stockRequests || []; 

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Package className="text-indigo-500" /> Request Monthly Stock
        </h2>
        <p className="text-slate-500">
          Request additional stock from your distributors for specific months by providing the unique batch ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">New Request</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batch ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. PCM2026A"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Paracetamol 500mg"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Distributor ID</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. DIST-102"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={distributorId}
                  onChange={e => setDistributorId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={requestedQuantity}
                    onChange={e => setRequestedQuantity(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Month</label>
                  <input 
                    type="month" 
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send Request
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">My Stock Requests</h3>
            </div>
            
            <div className="flex-1 p-0 overflow-auto">
              {myRequests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Package size={48} className="mx-auto text-slate-200 mb-4" />
                  <p>No stock requests yet.</p>
                  <p className="text-sm mt-1">Submit a request to your distributor to see it here.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-600">ID & Date</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Medicine & Batch</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Distributor</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Qty / Month</th>
                      <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{req.id}</p>
                          <p className="text-xs text-slate-500">{new Date(req.dateRequested).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{req.productName}</p>
                          <p className="text-xs text-slate-500 font-mono">Batch: {req.batchNumber}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">
                          {req.distributorId}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStock;
