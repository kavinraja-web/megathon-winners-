import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router-dom';
import { initialMfrBatches } from '../../data/manufacturerData';
import { Download, Printer, Search } from 'lucide-react';

const QrGenerator = () => {
  const [searchParams] = useSearchParams();
  const [batchId, setBatchId] = useState(searchParams.get('batch') || '');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  useEffect(() => {
    if (batchId) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    const found = initialMfrBatches.find(b => b.batchNumber === batchId || b.id === batchId);
    setSelectedBatch(found || null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QR / Barcode Generator</h1>
        <p className="text-slate-500">Generate trackable labels for medicine batches.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-2">Search Batch Number or ID</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. PCT-24051"
            />
          </div>
        </div>
        <button onClick={handleSearch} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
          Generate
        </button>
      </div>

      {selectedBatch ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Label Preview</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                <Printer size={16} /> Print Label
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download size={16} /> Download QR
              </button>
            </div>
          </div>
          
          <div className="p-12 bg-slate-50 flex justify-center">
            <div className="bg-white p-8 border-2 border-slate-300 rounded-xl shadow-sm w-full max-w-md">
              <div className="text-center border-b-2 border-slate-200 pb-4 mb-4">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{selectedBatch.medicineName} {selectedBatch.strength}</h3>
                <p className="text-slate-500 font-medium">ABC Pharmaceuticals Ltd.</p>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                <div className="bg-white p-2 border-4 border-slate-100 rounded-lg shadow-sm">
                  <QRCode value={selectedBatch.id} size={180} level="H" />
                </div>
                <p className="mt-4 text-xs font-mono text-slate-500 tracking-widest">ID: {selectedBatch.id}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mt-4">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">Batch No.</p>
                  <p className="font-mono font-bold text-slate-900">{selectedBatch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">MRP (Incl. taxes)</p>
                  <p className="font-bold text-slate-900">₹{selectedBatch.mrp}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">Mfg Date</p>
                  <p className="font-medium text-slate-900">{selectedBatch.mfgDate}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-semibold">Exp Date</p>
                  <p className="font-medium text-red-600">{selectedBatch.expDate}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-slate-200 text-center">
                <div className="h-12 bg-slate-800 flex items-center justify-center rounded overflow-hidden">
                  {/* Fake barcode simulation */}
                  <div className="w-full flex justify-between px-2 opacity-80">
                    {[...Array(40)].map((_, i) => (
                      <div key={i} className={`h-full bg-white ${Math.random() > 0.5 ? 'w-1' : 'w-0.5'}`}></div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] font-mono mt-1 text-slate-500">{selectedBatch.id}-{selectedBatch.batchNumber}</p>
              </div>
            </div>
          </div>
        </div>
      ) : batchId && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <p className="text-slate-500">No batch found matching "{batchId}". Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
