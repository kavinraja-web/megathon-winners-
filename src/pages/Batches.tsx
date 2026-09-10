import React, { useState } from 'react';
import { MOCK_BATCHES } from '../data/mockPharmaData';
import { Plus, Search, Filter } from 'lucide-react';

export default function Batches() {
  const [showForm, setShowForm] = useState(false);

  if (showForm) {
    return <RegisterBatchForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-500 mt-1">Manage and track all medicine batches across the supply chain.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Register New Medicine Batch
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search batches..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-sm font-medium text-gray-500 bg-white">
                <th className="p-4">Batch ID</th>
                <th className="p-4">Medicine</th>
                <th className="p-4">Batch No.</th>
                <th className="p-4">Mfg Date</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Total Qty</th>
                <th className="p-4">Remaining</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_BATCHES.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{batch.id}</td>
                  <td className="p-4 font-medium text-gray-900">{batch.medicineName}</td>
                  <td className="p-4 text-gray-600">{batch.batchNumber}</td>
                  <td className="p-4 text-gray-600">{batch.manufacturingDate}</td>
                  <td className="p-4 text-gray-600">{batch.expiryDate}</td>
                  <td className="p-4 text-gray-600">{batch.quantity.toLocaleString()}</td>
                  <td className="p-4 text-gray-600">{batch.remainingQuantity.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                      batch.status === 'EXPIRED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {batch.status}
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
    </div>
  );
}

function RegisterBatchForm({ onBack }: { onBack: () => void }) {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine batch registered successfully.</h2>
        <p className="text-gray-500 mb-8">Unique Batch ID and QR Code have been generated.</p>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 inline-block text-left space-y-4 w-full">
          <div>
            <p className="text-sm text-gray-500">System Batch ID</p>
            <p className="font-mono text-lg font-medium text-gray-900">PHM-BATCH-{Math.floor(10000 + Math.random() * 90000)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">QR Code ID</p>
            <p className="font-mono text-lg font-medium text-blue-600">PHM-{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Back to Batches
          </button>
          <button 
            onClick={() => setSuccess(false)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Register Another Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Register New Medicine Batch</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medicine Name</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Paracetamol" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medicine Category</label>
              <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select Category</option>
                <option value="Analgesic">Analgesic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antihistamine">Antihistamine</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Dosage / Strength</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 500mg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Manufacturer Name</label>
              <input required type="text" defaultValue="ABC Pharmaceuticals" className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" readOnly />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Batch Number (from packaging)</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. BATCH-2023" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Quantity Manufactured</label>
              <input required type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 50000" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Manufacturing Date</label>
              <input required type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <input required type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">MRP (₹)</label>
              <input required type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Storage Conditions</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Store below 25°C" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
            <button type="button" onClick={onBack} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Register Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}