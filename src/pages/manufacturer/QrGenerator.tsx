import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router-dom';
import { initialMfrBatches } from '../../data/manufacturerData';
import { Download, Printer, Search, RefreshCw } from 'lucide-react';

const QrGenerator = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('batch') || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const results = initialMfrBatches.filter(b => 
        (b.batchNumber && b.batchNumber.toLowerCase().includes(query)) ||
        (b.tabletId && b.tabletId.toLowerCase().includes(query)) ||
        (b.medicineName && b.medicineName.toLowerCase().includes(query))
      );
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedBatch(null);
    }
  }, [searchQuery]);

  const selectBatch = (batch: any) => {
    setSearchQuery(batch.batchNumber || batch.tabletId || batch.medicineName);
    setShowSuggestions(false);
    
    if (!batch.medicineName || !batch.tabletId || !batch.batchNumber || !batch.mfgDate || !batch.expDate) {
      setValidationError('Please complete all required medicine and batch details before generating the QR code.');
      setSelectedBatch(null);
      return;
    }

    setValidationError('');
    setSelectedBatch(batch);
  };

  const generateQrPayload = (batch: any) => {
    return `MEDICINE: ${batch.medicineName} ${batch.strength || ''}
TABLET NUMBER: ${batch.tabletId}
BATCH NUMBER: ${batch.batchNumber}
MANUFACTURED DATE: ${batch.mfgDate}
EXPIRY DATE: ${batch.expDate}`.trim();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">QR / Barcode Generator</h1>
        <p className="text-slate-500">Generate trackable labels for medicine batches.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex-1 relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">Search medicine or batch</label>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (searchQuery) setShowSuggestions(true); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. BATCH-PAR-26001 or Paracetamol"
            />
          </div>
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
              {suggestions.length > 0 ? (
                suggestions.map((batch, index) => (
                  <div 
                    key={index} 
                    className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() => selectBatch(batch)}
                  >
                    <div className="font-medium text-slate-800">{batch.medicineName} {batch.strength || ''}</div>
                    <div className="text-sm text-slate-500">Batch: {batch.batchNumber} | Tablet No: {batch.tabletId}</div>
                    <div className="text-xs text-slate-400">Expiry: {batch.expDate}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No batches found
                </div>
              )}
            </div>
          )}
        </div>
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
          
          <div className="p-8 bg-slate-50 flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex-1 w-full">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Selected Medicine Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Medicine Name</p>
                  <p className="font-semibold text-slate-900 text-lg">{selectedBatch.medicineName} {selectedBatch.strength || ''}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Tablet Number</p>
                    <p className="font-medium text-slate-900">{selectedBatch.tabletId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Batch Number</p>
                    <p className="font-medium text-slate-900">{selectedBatch.batchNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Manufactured Date</p>
                    <p className="font-medium text-slate-900">{selectedBatch.mfgDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Expiry Date</p>
                    <p className="font-medium text-slate-900">{selectedBatch.expDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">MRP</p>
                    <p className="font-medium text-slate-900">₹{selectedBatch.mrp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Available Quantity</p>
                    <p className="font-medium text-slate-900">{selectedBatch.remainingQuantity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Manufacturer</p>
                  <p className="font-medium text-slate-900">{selectedBatch.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Batch Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedBatch.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                    selectedBatch.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedBatch.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-slate-300 rounded-xl shadow-sm flex flex-col items-center shrink-0 w-full md:w-auto">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Generated QR Code</h3>
              <div className="bg-white p-2 border-4 border-slate-100 rounded-lg shadow-sm mb-6">
                <QRCode value={generateQrPayload(selectedBatch)} size={200} level="H" />
              </div>
              <div className="flex flex-col gap-3 w-full">
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium w-full">
                  <Printer size={16} /> Print QR
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-full">
                  <Download size={16} /> Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default QrGenerator;
