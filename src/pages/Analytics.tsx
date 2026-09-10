import React, { useMemo } from 'react';
import { mockBatches } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Package, AlertTriangle, IndianRupee } from 'lucide-react';

const mockSalesData = [
  { date: 'Mon', sales: 4000, qty: 240 },
  { date: 'Tue', sales: 3000, qty: 139 },
  { date: 'Wed', sales: 2000, qty: 980 },
  { date: 'Thu', sales: 2780, qty: 390 },
  { date: 'Fri', sales: 1890, qty: 480 },
  { date: 'Sat', sales: 2390, qty: 380 },
  { date: 'Sun', sales: 3490, qty: 430 },
];

const Analytics = () => {
  const { totalStock, expiredCount, expiredBatches, totalBatches } = useMemo(() => {
    let stock = 0;
    let expired = 0;
    const expiredList = [];
    
    for (const batch of mockBatches) {
      stock += batch.quantity;
      const isExpired = new Date(batch.expDate) < new Date() || batch.status === 'Expired';
      if (isExpired) {
        expired += 1;
        expiredList.push(batch);
      }
    }
    
    return { 
      totalStock: stock, 
      expiredCount: expired, 
      expiredBatches: expiredList,
      totalBatches: mockBatches.length
    };
  }, [mockBatches]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
        <p className="text-slate-500">Daily sales, current inventory, and expiry tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Today's Sales</p>
            <p className="text-2xl font-bold text-slate-900">₹3,490</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Medicines Sold</p>
            <p className="text-2xl font-bold text-slate-900">430 units</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Stock</p>
            <p className="text-2xl font-bold text-slate-900">{totalStock.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Expired Batches</p>
            <p className="text-2xl font-bold text-red-600">{expiredCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue & Sales Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Units Sold by Day</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="qty" fill="#6366f1" radius={[4, 4, 0, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Expired Medicines Attention Required</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Medicine</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiry Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity Left</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expiredBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-900">{batch.id}</td>
                  <td className="p-4 text-sm text-slate-600">{batch.name}</td>
                  <td className="p-4 text-sm font-medium text-red-600">{batch.expDate}</td>
                  <td className="p-4 text-sm text-slate-600">{batch.quantity}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
              {expiredBatches.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No expired batches found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;