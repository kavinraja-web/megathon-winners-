import React, { useState } from 'react';
import { QrCode, Search, ShieldAlert, CheckCircle, Upload, AlertTriangle } from 'lucide-react';

const Scanner = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'fraud'>('idle');
  const [batchId, setBatchId] = useState('');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    
    setScanState('scanning');
    setTimeout(() => {
      if (batchId === 'B12351') {
        setScanState('fraud');
      } else {
        setScanState('success');
      }
    }, 1500);
  };

  const resetScanner = () => {
    setScanState('idle');
    setBatchId('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">QR Code Scanner</h2>
        <p className="text-slate-500">Scan medicine batches to verify authenticity, check expiry, and track lifecycle.</p>
      </div>

      {scanState === 'idle' && (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center transition-all hover:border-emerald-500">
          <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode size={48} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Scan QR Code</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Point your camera at the QR code on the medicine packaging or enter the batch ID manually.</p>
          
          <form onSubmit={handleScan} className="max-w-md mx-auto relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter Batch ID manually (e.g., B12345)" 
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full pl-12 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-lg font-medium transition-colors"
            >
              Verify
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>or</span>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
              <Upload size={16} /> Upload Image
            </button>
          </div>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-24 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-3xl"></div>
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-3xl border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode size={48} className="text-emerald-500 animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Data...</h3>
          <p className="text-slate-500">Verifying batch origin, expiry, and destruction records.</p>
        </div>
      )}

      {scanState === 'success' && (
        <div className="bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-lg shadow-emerald-100/50">
          <div className="bg-emerald-500 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 transform translate-x-1/4 -translate-y-1/4">
              <CheckCircle size={200} />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-2">Authentic Batch Verified</h3>
              <p className="text-emerald-50 text-lg">Batch {batchId} is active and safe for distribution.</p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Medicine</p>
                <p className="font-semibold text-slate-900">Paracetamol 500mg</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Manufacturer</p>
                <p className="font-semibold text-slate-900">Sun Pharma</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Expiry Date</p>
                <p className="font-semibold text-slate-900">01 Jan 2027</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Current Location</p>
                <p className="font-semibold text-slate-900">Chennai Hub</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={resetScanner} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors">
                Scan Another
              </button>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                View Full Traceability
              </button>
            </div>
          </div>
        </div>
      )}

      {scanState === 'fraud' && (
        <div className="bg-white border-2 border-red-500 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20 animate-in zoom-in-95 duration-300">
          <div className="bg-red-600 text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white text-red-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                <AlertTriangle size={48} />
              </div>
              <h2 className="text-4xl font-extrabold mb-2 tracking-tight">RE-ENTRY DETECTED!</h2>
              <p className="text-red-100 text-xl font-medium max-w-lg mx-auto">
                Batch {batchId} was already marked as DESTROYED. This is a severe compliance violation.
              </p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8">
              <h4 className="text-red-800 font-bold mb-4 flex items-center gap-2">
                <ShieldAlert size={20} /> AI Fraud Analysis Report
              </h4>
              <ul className="space-y-3 text-red-700 text-sm font-medium">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  This batch was officially destroyed on <strong>15 Feb 2025</strong> at Safe Disposal Facility, Chennai.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  Destruction Certificate ID: <strong>DC2025-8891</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  Current scan location (Bengaluru) conflicts with final destruction location.
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center gap-4">
              <button onClick={resetScanner} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-600/30">
                Report Fraud Immediately
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;