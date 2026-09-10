import React from 'react';
import { MOCK_BATCHES } from '../data/mockPharmaData';
import { AlertOctagon, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

export default function ExpiryMonitor() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Expiry Monitor</h1>
        <p className="text-gray-500 mt-1">Track medicine batches approaching expiry and manage expired stock.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-l-red-500 border-y border-r border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Expired</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">36 Batches</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-l-orange-500 border-y border-r border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Expiring in &lt; 30 days</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">17 Batches</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-l-yellow-500 border-y border-r border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Expiring in 30-90 days</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">42 Batches</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-l-green-500 border-y border-r border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Safe Stock</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">247 Batches</p>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">All Monitored</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Expired</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">&lt; 30 Days</button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">&lt; 90 Days</button>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="p-4">Medicine</th>
              <th className="p-4">Batch</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Remaining Qty</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {MOCK_BATCHES.filter(b => b.status === 'EXPIRED' || new Date(b.expiryDate).getFullYear() < 2028).map((batch) => (
              <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{batch.medicineName}</td>
                <td className="p-4 text-gray-600">{batch.batchNumber}</td>
                <td className={`p-4 font-medium ${batch.status === 'EXPIRED' ? 'text-red-600' : 'text-orange-600'}`}>
                  {batch.expiryDate}
                </td>
                <td className="p-4 text-gray-600">{batch.remainingQuantity.toLocaleString()}</td>
                <td className="p-4">
                  {batch.status === 'EXPIRED' ? (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <AlertOctagon className="w-4 h-4" /> Expired
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 font-medium">
                      <AlertTriangle className="w-4 h-4" /> High Risk
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {batch.status === 'EXPIRED' ? (
                    <button className="text-red-600 hover:text-red-800 font-medium">Recall / Destroy</button>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Discount / Alert</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
