import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router-dom';
import { initialMfrBatches } from '../../data/manufacturerData';
import { Download, Printer, Search, RefreshCw } from 'lucide-react';

const QrGenerator = () => {
  const [searchParams] = useSearchParams();
  const [batchId, setBatchId] = useState(searchParams.get('batch') || '');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (batchId) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    const found = initialMfrBatches.find(b => b.batchNumber === batchId || b.id === batchId || b.tabletId === batchId);
    if (!found) {
      setSelectedBatch(null);
      setValidationError('');
      return;
    }
    
    // Validate required fields
    if (!found.medicineName || !found.tabletId || !found.batchNumber || !found.mfgDate || !found.expDate) {
      setValidationError('Please complete all required medicine and batch details before generating the QR code.');
      setSelectedBatch(null);
      return;
    }

    setValidationError('');
    setSelectedBatch(found);
  };

  const generateQrPayload = (batch: any) => {
    return `MEDICINE: ${batch.medicineName} ${batch.strength}
TABLET_NO: ${batch.tabletId}
BATCH_NO: ${batch.batchNumber}
MFG_DATE: ${batch.mfgDate}
EXP_DATE: ${batch.expDate}`;
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
              placeholder="e.g. BATCH-PAR-26001"
            />
          </div>
        </div>
        <button onClick={handleSearch} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
          Generate
        </button>
      </div>

      {validationError && (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center text-red-700 font-medium">
          {validationError}
        </div>
      )}

      {selectedBatch && !validationError ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Label Preview</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                <RefreshCw size={16} /> Regenerate QR
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                <Printer size={16} /> Print QR
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Download size={16} /> Download QR
              </button>
            </div>
          </div>
          
          <div className="p-12 bg-slate-50 flex justify-center">
            <div className="bg-white p-8 border-2 border-slate-300 rounded-xl shadow-sm w-full max-w-sm">
              <div className="text-center border-b-2 border-slate-200 pb-4 mb-4">
                <h3 className="text-xl font-bold uppercase tracking-wide text-slate-900">{selectedBatch.medicineName} {selectedBatch.strength}</h3>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="bg-white p-2 border-4 border-slate-100 rounded-lg shadow-sm">
                  <QRCode value={generateQrPayload(selectedBatch)} size={200} level="H" />
                </div>
              </div>
              
              <div className="mt-4 text-sm font-mono space-y-2 text-slate-800">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-semibold">Tablet No:</span>
                  <span className="font-bold">{selectedBatch.tabletId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-semibold">Batch No:</span>
                  <span className="font-bold">{selectedBatch.batchNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-500 font-semibold">Manufactured:</span>
                  <span className="font-bold">{selectedBatch.mfgDate}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-slate-500 font-semibold">Expiry:</span>
                  <span className="font-bold">{selectedBatch.expDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : batchId && !validationError && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <p className="text-slate-500">No batch found matching "{batchId}". Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
