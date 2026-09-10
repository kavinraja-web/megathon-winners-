import React from 'react';
import { MOCK_SALES } from '../data/mockPharmaData';

export default function Sales() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Sales & Distribution</h1>
        <p className="text-gray-500 mt-1">Track where batches have been distributed across the supply chain.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
              <th className="p-4">Distribution ID</th>
              <th className="p-4">Medicine</th>
              <th className="p-4">Batch Number</th>
              <th className="p-4">Pharmacy / Distributor</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {MOCK_SALES.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-50">
                <td className="p-4 font-mono text-xs text-gray-500">{sale.id}</td>
                <td className="p-4 font-medium text-gray-900">{sale.medicine}</td>
                <td className="p-4 text-gray-600">{sale.batch}</td>
                <td className="p-4 font-medium text-blue-600">{sale.pharmacy}</td>
                <td className="p-4 text-gray-600">{sale.quantity}</td>
                <td className="p-4 text-gray-600">{sale.date}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
