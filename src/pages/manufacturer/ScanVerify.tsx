import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { initialMfrBatches, updateBatchesBasedOnDate, ManufacturerBatch } from '../../data/manufacturerData';
import { Camera, X, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ScanVerify = () => {
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [result, setResult] = useState<ManufacturerBatch | null>(null);
  const [error, setError] = useState('');
  const [scannerId] = useState('qr-reader-manufacturer');

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = () => {
    setScanning(true);
    setError('');
    setResult(null);
    
    // Slight delay to ensure DOM element is ready
    setTimeout(() => {
      try {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          scannerId,
          { fps: 10, qrbox: { width: 300, height: 300 }, aspectRatio: 1.0 },
          /* verbose= */ false
        );
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      } catch (err) {
        console.error(err);
        setError("Could not access camera. Please allow permissions or use manual entry.");
        setScanning(false);
      }
    }, 100);
  };

  const stopScanner = () => {
    setScanning(false);
    try {
      const el = document.getElementById(scannerId);
      if (el) {
        el.innerHTML = '';
      }
    } catch (e) { console.error(e); }
  };

  const onScanSuccess = (decodedText: string, decodedResult: any) => {
    stopScanner();
    processBatchId(decodedText);
  };

  const onScanFailure = (error: any) => {
    // Ignore routine scan failures (no QR found yet)
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    processBatchId(manualId.trim());
  };

  const processBatchId = (scannedText: string) => {
    // Check if the scanned text is our new payload format
    let idToSearch = scannedText;
    if (scannedText.includes('TABLET_NO:')) {
      const match = scannedText.match(/TABLET_NO:\s*([^\n]+)/);
      if (match && match[1]) {
        idToSearch = match[1].trim();
      }
    } else if (scannedText.includes('BATCH_NO:')) {
      const match = scannedText.match(/BATCH_NO:\s*([^\n]+)/);
      if (match && match[1]) {
        idToSearch = match[1].trim();
      }
    }

    // Look up the batch
    const updatedBatches = updateBatchesBasedOnDate(initialMfrBatches);
    const found = updatedBatches.find(b => b.id === idToSearch || b.batchNumber === idToSearch || b.tabletId === idToSearch);
    
    if (found) {
      setResult(found);
      setError('');
    } else {
      setResult(null);
      setError('Invalid QR or Unknown Batch ID. Medicine not found in system.');
    }
  };

  const renderResultIcon = () => {
    if (!result) return null;
    if (result.status === 'EXPIRED') return <XCircle size={48} className="text-red-500 mx-auto mb-4" />;
    if (result.status === 'NEAR EXPIRY') return <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />;
    return <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />;
  };

  const renderStatusAlert = () => {
    if (!result) return null;
    if (result.status === 'EXPIRED') {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-center mt-6">
          <h3 className="font-bold text-lg mb-1 flex items-center justify-center gap-2">
            <XCircle size={20} /> SALE BLOCKED - EXPIRED MEDICINE
          </h3>
          <p>This medicine is expired and must not be distributed or sold.</p>
        </div>
      );
    }
    if (result.status === 'NEAR EXPIRY') {
      return (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-center mt-6">
          <h3 className="font-bold text-lg mb-1 flex items-center justify-center gap-2">
            <AlertTriangle size={20} /> NEAR EXPIRY
          </h3>
          <p>This medicine will expire soon. Proceed with caution.</p>
        </div>
      );
    }
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-center mt-6">
        <h3 className="font-bold text-lg mb-1 flex items-center justify-center gap-2">
          <CheckCircle size={20} /> MEDICINE VERIFIED
        </h3>
        <p>Medicine is valid and approved for distribution.</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Scan & Verify Medicine</h1>
        <p className="text-slate-500">Scan QR code using your webcam to verify authenticity and check expiry.</p>
      </div>

      {!scanning && !result && (
        <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-300 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera size={40} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to Scan</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Position the medicine's QR code in front of your laptop's camera to instantly verify its details.</p>
          
          <button 
            onClick={startScanner}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-sm"
          >
            Start Camera Scanner
          </button>

          <div className="mt-12 pt-8 border-t border-slate-100 max-w-md mx-auto">
            <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Or Enter Manually</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Batch ID (e.g. MED-000101)" 
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
              />
              <button type="submit" className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium">
                Verify
              </button>
            </form>
          </div>
        </div>
      )}

      {scanning && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              Live Camera Feed
            </h2>
            <button onClick={stopScanner} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-black rounded-xl overflow-hidden shadow-inner aspect-video flex items-center justify-center relative">
            <div id={scannerId} className="w-full max-w-lg mx-auto"></div>
          </div>
          
          <p className="text-center text-slate-500 mt-6 font-medium">Please allow camera permissions if prompted.</p>
        </div>
      )}

      {error && !scanning && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center shadow-sm">
          <AlertTriangle size={32} className="mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-1">Verification Failed</h3>
          <p>{error}</p>
          <button onClick={() => {setError(''); setManualId('');}} className="mt-4 px-6 py-2 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50 font-medium transition-colors">
            Try Again
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
            <div className="text-center w-full pt-4">
              {renderResultIcon()}
              <h2 className="text-2xl font-bold text-slate-900">{result.medicineName} {result.strength}</h2>
              <p className="text-slate-500 text-lg">{result.genericName}</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Manufacturer</p>
                <p className="font-semibold text-slate-900">ABC Pharmaceuticals Ltd.</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Batch Number</p>
                <p className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">{result.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Internal ID</p>
                <p className="font-mono text-slate-600">{result.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Manufacturing Date</p>
                <p className="font-semibold text-slate-900">{result.mfgDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Expiry Date</p>
                <p className={`font-bold ${result.status === 'EXPIRED' ? 'text-red-600' : 'text-slate-900'}`}>{result.expDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">MRP</p>
                <p className="font-semibold text-emerald-600 text-lg">₹{result.mrp}</p>
              </div>
            </div>

            {renderStatusAlert()}

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <button onClick={() => {setResult(null); setManualId('');}} className="px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium">
                Scan Another Medicine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanVerify;
