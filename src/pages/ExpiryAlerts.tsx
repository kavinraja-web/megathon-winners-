import React from 'react';
import { usePOS } from '../context/POSContext';
import { AlertTriangle, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ExpiryAlerts = () => {
  const { batches, products, createReturnRequest, calculateDaysRemaining } = usePOS();

  // Filter batches that are expired or expiring soon, and are NOT already permanently closed or returned
  const alerts = batches
    .filter(b => ['EXPIRED', 'CRITICAL', 'NEAR_EXPIRY'].includes(b.status))
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const handleReturn = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;
    
    const product = products.find(p => p.id === batch.productId);
    if (!product) return;

    if (window.confirm(`Are you sure you want to initiate a return to ${batch.supplier} for ${batch.quantity} units of ${product.name}?`)) {
      createReturnRequest(batch, product);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Expiry Alerts</h2>
        <p className="text-slate-500 text-sm">Monitor expiring stock and initiate returns to distributors.</p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center">
          <CheckCircle size={48} className="text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">All Clear!</h3>
          <p className="text-slate-500 max-w-md mx-auto">You have no expired or near-expiry stock. Great job managing your inventory.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Medicine / Batch</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((batch) => {
                const product = products.find(p => p.id === batch.productId);
                const days = calculateDaysRemaining(batch.expiryDate);
                const isExpired = batch.status === 'EXPIRED';

                return (
                  <tr key={batch.id} className={`hover:bg-slate-50 transition-colors ${isExpired ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{product?.name || 'Unknown Product'}</p>
                      <p className="text-xs font-mono text-slate-500">{batch.batchNumber}</p>
                    </td>
                    <td className="px-6 py-4">{batch.supplier}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{batch.quantity} units</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{new Date(batch.expiryDate).toLocaleDateString()}</p>
                      <p className={`text-xs font-bold mt-0.5 ${isExpired ? 'text-red-600' : 'text-orange-500'}`}>
                        {isExpired ? `Expired ${Math.abs(days)} days ago` : `${days} days remaining`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        isExpired ? 'bg-red-100 text-red-700' :
                        batch.status === 'CRITICAL' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {batch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isExpired ? (
                        <button
                          onClick={() => handleReturn(batch.id)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-xs"
                        >
                          <RefreshCw size={14} /> Return to Distributor
                        </button>
                      ) : (
                        <button className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-xs">
                          <Clock size={14} /> Mark for Discount
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpiryAlerts;