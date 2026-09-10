import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle, AlertTriangle, AlertOctagon, X } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { MOCK_BATCHES } from '../data/mockPharmaData';

export default function Scanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [medicineData, setMedicineData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(null);

  const startCamera = async () => {
    setCameraActive(true);
    setScanResult(null);
    setMedicineData(null);
    try {
      const html5QrCode = new Html5Qrcode("reader");
      setScannerInstance(html5QrCode);
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanSuccess(decodedText);
          html5QrCode.stop();
          setCameraActive(false);
        },
        () => {
          // ignore failures during scanning
        }
      );
    } catch (err) {
      console.error("Error starting camera", err);
      alert("Camera unavailable. Please check permissions or use manual entry.");
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerInstance) {
      try {
        await scannerInstance.stop();
        setScannerInstance(null);
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (scannerInstance) {
        scannerInstance.stop().catch(console.error);
      }
    };
  }, [scannerInstance]);

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(decodedText);
    fetchMedicineData(decodedText);
  };

  const fetchMedicineData = (code: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const found = MOCK_BATCHES.find(b => b.qrCode === code || b.id === code);
      if (found) {
        const isExpired = new Date(found.expiryDate) < new Date();
        setMedicineData({ ...found, isExpired });
      } else {
        setMedicineData(null);
      }
      setLoading(false);
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scan Medicine QR / Barcode</h1>
        <p className="text-gray-500">Scan the unique code to retrieve medicine and batch information.</p>
      </div>

      {!scanResult && !cameraActive && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-8">
          <div className="w-64 h-64 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 flex flex-col items-center">
              <Camera className="w-16 h-16 mb-4" />
              <p className="font-medium">QR SCANNER</p>
            </div>
          </div>
          
          <button 
            onClick={startCamera}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors flex items-center gap-2 text-lg"
          >
            <Camera className="w-6 h-6" />
            Start Camera
          </button>

          <div className="w-full max-w-sm border-t border-gray-200 pt-8 mt-4">
            <p className="text-gray-500 mb-4 font-medium">Camera unavailable?</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter QR / Barcode ID manually" 
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
              >
                Submit
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">Example: PHM-BATCH-00452</p>
          </div>
        </div>
      )}

      {cameraActive && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center relative">
          <button 
            onClick={stopCamera}
            className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-md bg-black rounded-lg overflow-hidden relative">
            <div id="reader" className="w-full h-full min-h-[300px]"></div>
            <div className="absolute inset-0 border-[6px] border-blue-500/50 m-12 rounded-xl pointer-events-none"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium animate-pulse text-lg">Scanning... Position QR code inside the frame</p>
        </div>
      )}

      {scanResult && loading && (
        <div className="bg-white p-16 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700">Retrieving medicine information...</p>
        </div>
      )}

      {scanResult && !loading && medicineData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className={`p-6 text-white flex items-center justify-between ${
            medicineData.isExpired ? 'bg-red-600' : 'bg-green-600'
          }`}>
            <div className="flex items-center gap-3">
              {medicineData.isExpired ? <AlertOctagon className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              <h2 className="text-2xl font-bold">
                {medicineData.isExpired ? 'EXPIRED MEDICINE' : 'MEDICINE VERIFIED'}
              </h2>
            </div>
            <span className="bg-white/20 px-4 py-1.5 rounded-lg font-medium tracking-wider text-sm">
              {medicineData.id}
            </span>
          </div>

          <div className="p-8">
            {medicineData.isExpired && (
              <div className="mb-8 bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <h3 className="font-bold text-lg">SALE / DISTRIBUTION SHOULD BE BLOCKED</h3>
                  <p className="mt-1 text-red-700">This batch has passed its expiry date and is unsafe for consumption.</p>
                </div>
              </div>
            )}
            
            {!medicineData.isExpired && (
              <div className="mb-8 bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 shrink-0 mt-0.5 text-green-600" />
                <div>
                  <h3 className="font-bold text-lg">Batch is currently active.</h3>
                  <p className="mt-1 text-green-700">This product is verified and safe for sale/distribution.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Medicine Name</p>
                  <p className="text-xl font-bold text-gray-900">{medicineData.medicineName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Manufacturer</p>
                  <p className="text-lg font-medium text-gray-800">{medicineData.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Batch Number</p>
                  <p className="text-lg font-medium text-gray-800">{medicineData.batchNumber}</p>
                </div>
              </div>
              
              <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Manufacturing Date</p>
                    <p className="font-medium text-gray-900">{medicineData.manufacturingDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Expiry Date</p>
                    <p className={`font-bold ${medicineData.isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                      {medicineData.expiryDate}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">MRP</p>
                    <p className="font-medium text-gray-900">₹{medicineData.mrp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Quantity</p>
                    <p className="font-medium text-gray-900">{medicineData.quantity.toLocaleString()} units</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">System Status</p>
                  <p className="font-medium text-gray-900">{medicineData.status}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4 border-t border-gray-100 pt-8">
              {medicineData.isExpired ? (
                <>
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Report Batch
                  </button>
                  <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors border border-gray-300">
                    View Batch Details
                  </button>
                </>
              ) : (
                <>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    View Full Batch
                  </button>
                  <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors">
                    Add to Inventory
                  </button>
                  <button className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors ml-auto">
                    Print Details
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {scanResult && !loading && !medicineData && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Code Not Found</h2>
          <p className="text-gray-600 mb-8">The scanned code ({scanResult}) could not be found in our database. It may be invalid or not yet registered.</p>
          <button 
            onClick={() => setScanResult(null)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Scan Again
          </button>
        </div>
      )}
      
      {scanResult && !loading && medicineData && (
        <div className="text-center mt-6">
          <button 
            onClick={() => {
              setScanResult(null);
              setMedicineData(null);
              setManualInput('');
            }}
            className="px-6 py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Scan Another Code
          </button>
        </div>
      )}
    </div>
  );
}