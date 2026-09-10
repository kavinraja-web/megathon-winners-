import React from 'react';
import { MOCK_MEDICINES } from '../data/mockPharmaData';
import { Search, Filter, Plus } from 'lucide-react';

export default function Medicines() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
          <p className="text-gray-500 mt-1">Manage your catalog of registered medicines.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search medicine name, manufacturer, ID..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2 bg-white">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-sm font-medium text-gray-500 bg-white">
              <th className="p-4">Medicine Name</th>
              <th className="p-4">Medicine ID</th>
              <th className="p-4">Category</th>
              <th className="p-4">Manufacturer</th>
              <th className="p-4">Total Batches</th>
              <th className="p-4">Total Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {MOCK_MEDICINES.map((medicine) => (
              <tr key={medicine.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{medicine.name}</td>
                <td className="p-4 font-mono text-xs text-gray-500">{medicine.id}</td>
                <td className="p-4 text-gray-600">{medicine.category}</td>
                <td className="p-4 text-gray-600">{medicine.manufacturer}</td>
                <td className="p-4 text-gray-600 font-medium">{medicine.totalBatches}</td>
                <td className="p-4 text-gray-600 font-medium">{medicine.stock.toLocaleString()}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {medicine.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">View</button>
                  <button className="text-gray-500 hover:text-gray-700 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
