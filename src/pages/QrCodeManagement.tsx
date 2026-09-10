import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { MOCK_BATCHES } from '../data/mockPharmaData';
import { QrCode, Download, Printer, Search } from 'lucide-react';

export default function QrCodeManagement() {
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">QR & Barcode Management</h1>
        <p className="text-gray-500 mt-1">Generate and manage unique QR codes and barcodes for your medicine batches.</p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="font-semibold text-gray-800">Registered Batches</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search batches..." 
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-sm font-medium text-gray-500 bg-white">
                <th className="p-4">Medicine</th>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">QR Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {MOCK_BATCHES.map((batch) => (
                <tr key={batch.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${selectedBatch?.id === batch.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedBatch(batch)}>
                  <td className="p-4 font-medium text-gray-900">{batch.medicineName}</td>
                  <td className="p-4 text-gray-600 font-mono">{batch.batchNumber}</td>
                  <td className="p-4 text-gray-600">{batch.expiryDate}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Generated
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                      }}
                      className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
                    >
                      <QrCode className="w-4 h-4" />
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBatch && (
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <h3 className="font-bold text-gray-900 mb-1">{selectedBatch.medicineName}</h3>
              <p className="text-gray-500 text-sm mb-6">Batch: {selectedBatch.batchNumber}</p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-6">
                <QRCode 
                  value={selectedBatch.id}
                  size={180}
                  level="M"
                />
              </div>
              
              <p className="text-sm text-gray-600 font-mono bg-gray-100 px-4 py-2 rounded-lg w-full mb-6">
                {selectedBatch.id}
              </p>
              
              <div className="w-full flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mt-4 text-sm flex gap-3 border border-blue-100">
              <div className="mt-0.5">ℹ️</div>
              <p>This QR code contains the unique batch identifier. When scanned, it retrieves full details from the database to prevent counterfeiting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
