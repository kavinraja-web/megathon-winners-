import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Search, ShieldAlert, CheckCircle, AlertTriangle, Camera, Info, XCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { initialMfrBatches } from '../data/manufacturerData';

const Scanner = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'fraud' | 'expired' | 'invalid'>('idle');
  const [batchId, setBatchId] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [rawPayload, setRawPayload] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [systemBatch, setSystemBatch] = useState<any>(null);
  const [mismatch, setMismatch] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (isCameraOpen && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner("scanner-reader", { fps: 10, qrbox: {width: 250, height: 250}, aspectRatio: 1.0 }, false);
      scannerRef.current.render((decodedText) => {
        setIsCameraOpen(false);
        triggerScanLogic(decodedText);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error(e));
          scannerRef.current = null;
        }
      }, () => {});
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
    };
  }, [isCameraOpen]);

  const parseQrData = (text: string) => {
    const lines = text.split('\n');
    const data: any = {};
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        data[key.trim()] = valueParts.join(':').trim();
      }
    });
    return data;
  };

  const triggerScanLogic = (text: string) => {
    if (!text) return;
    setRawPayload(text);
    setScanState('scanning');
    
    setTimeout(() => {
      const parsed = parseQrData(text);
      if (!parsed['MEDICINE'] || !parsed['BATCH NUMBER']) {
        setScanState('invalid');
        return;
      }
      
      setParsedData(parsed);
      const batchNo = parsed['BATCH NUMBER'];
      setBatchId(batchNo);
      
      const found = initialMfrBatches.find(b => b.batchNumber === batchNo);
      setSystemBatch(found);
      
      if (found) {
        const isMismatch = found.medicineName && !parsed['MEDICINE'].includes(found.medicineName) || 
                           found.tabletId !== parsed['TABLET NUMBER'];
        setMismatch(!!isMismatch);
      }
      
      if (parsed['EXPIRY DATE']) {
        let expDateStr = parsed['EXPIRY DATE'];
        let expDateObj = new Date(expDateStr);
        
        // Handle DD/MM/YYYY or MM/DD/YYYY by explicitly converting to YYYY-MM-DD if we see slashes
        if (expDateStr.includes('/')) {
           const parts = expDateStr.split('/');
           if (parts.length === 3) {
             // Assuming DD/MM/YYYY
             expDateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
           }
        }
        
        if (!isNaN(expDateObj.getTime()) && expDateObj < new Date()) {
          setScanState('expired');
          return;
        }
      }
      
      setScanState('success');
    }, 1500);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate a scan using batchId for testing
    // For manual entry, we mock a payload based on the input to allow testing
    // But actually, manual entry of batch ID can just mock the text payload
    const found = initialMfrBatches.find(b => b.batchNumber === batchId);
    if (found) {
      triggerScanLogic(`MEDICINE: ${found.medicineName} ${found.strength || ""}\nTABLET NUMBER: ${found.tabletId}\nBATCH NUMBER: ${found.batchNumber}\nMANUFACTURED DATE: ${found.mfgDate}\nEXPIRY DATE: ${found.expDate}`);
    } else {
      triggerScanLogic(batchId); // Might result in invalid
    }
  };

  const resetScanner = () => {
    setScanState('idle');
    setBatchId('');
    setRawPayload('');
    setParsedData(null);
    setSystemBatch(null);
    setMismatch(false);
    setShowRaw(false);
    setIsCameraOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Pharmacy QR Scanner</h2>
        <p className="text-slate-500">Scan medicine QR codes to verify authenticity, check expiry, and view contents.</p>
      </div>

      {scanState === 'idle' && (
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center transition-all hover:border-emerald-500">
          <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCode size={48} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Scan QR Code</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">Point your laptop camera at the QR code on the medicine packaging.</p>
          
          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
            {!isCameraOpen ? (
              <button 
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Camera size={18} /> Open Camera to Scan
              </button>
            ) : (
              <div className="w-full max-w-sm">
                <div className="bg-slate-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center mb-4 min-h-[300px]">
                  {(!window.isSecureContext || !navigator.mediaDevices) ? (
                    <div className="p-6 text-center">
                      <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">Camera Blocked</h3>
                      <p className="text-slate-300 text-sm mb-4">
                        Please open this directly in Chrome/Safari using https:// or localhost
                      </p>
                    </div>
                  ) : (
                    <div id="scanner-reader" className="w-full h-full object-cover"></div>
                  )}
                </div>
                <button 
                  onClick={() => setIsCameraOpen(false)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Close Camera
                </button>
              </div>
            )}
            
            <div className="w-full max-w-md mx-auto mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Developer Test / Manual Entry</span>
              <form onSubmit={handleScan} className="relative flex items-center">
                <Search className="absolute left-4 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter Batch ID manually" 
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full pl-12 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-4 text-sm rounded-lg font-medium transition-colors"
                >
                  Simulate
                </button>
              </form>
            </div>
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
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Reading QR Code...</h3>
          <p className="text-slate-500">Decoding RAW content and verifying system records.</p>
        </div>
      )}

      {scanState === 'invalid' && (
        <div className="bg-white border-2 border-orange-500 rounded-3xl p-12 text-center shadow-xl">
           <AlertTriangle size={64} className="text-orange-500 mx-auto mb-6" />
           <h3 className="text-2xl font-bold text-slate-900 mb-2">⚠ INVALID MEDICINE QR</h3>
           <p className="text-slate-600 mb-8">Required medicine information could not be identified.</p>
           
           <div className="bg-slate-50 p-4 rounded-xl text-left mb-8 overflow-auto max-h-40">
             <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Raw QR Content Scanned:</p>
             <pre className="text-sm font-mono text-slate-800 whitespace-pre-wrap">{rawPayload}</pre>
           </div>
           
           <button onClick={resetScanner} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-colors">
              Scan Again
           </button>
        </div>
      )}

      {(scanState === 'success' || scanState === 'expired') && parsedData && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-3">
              <QrCode className="text-slate-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800">QR CODE CONTENT</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Medicine</p>
                  <p className="font-medium text-slate-900 text-lg">{parsedData['MEDICINE'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tablet Number</p>
                  <p className="font-medium text-slate-900 text-lg">{parsedData['TABLET NUMBER'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Batch Number</p>
                  <p className="font-medium text-slate-900 text-lg">{parsedData['BATCH NUMBER'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Manufactured Date</p>
                  <p className="font-medium text-slate-900 text-lg">{parsedData['MANUFACTURED DATE'] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Expiry Date</p>
                  <p className="font-medium text-slate-900 text-lg">{parsedData['EXPIRY DATE'] || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setShowRaw(!showRaw)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  <Info size={16} /> {showRaw ? 'Hide' : 'View'} Raw QR Data
                </button>
                
                {showRaw && (
                  <div className="mt-4 bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {rawPayload}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
             <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center gap-3">
              <CheckCircle className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800">SYSTEM VERIFICATION</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {systemBatch ? (
                <>
                  <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <CheckCircle size={24} className="shrink-0" />
                    <div>
                      <p className="font-bold">✓ SYSTEM VERIFIED</p>
                      <p className="text-sm">Batch exists in manufacturer records.</p>
                    </div>
                  </div>
                  
                  {mismatch && (
                    <div className="flex items-start gap-3 text-orange-800 bg-orange-50 p-4 rounded-xl border border-orange-200 mt-4">
                      <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                      <div className="w-full">
                        <p className="font-bold mb-1">⚠ INFORMATION MISMATCH</p>
                        <p className="text-sm mb-3">QR information does not match the registered batch.</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm bg-white p-3 rounded-lg border border-orange-100">
                          <div>
                            <span className="font-semibold text-slate-500 block text-xs">QR Data</span>
                            <span className="font-medium">{parsedData['MEDICINE']}</span><br/>
                            <span className="font-medium">{parsedData['TABLET NUMBER']}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500 block text-xs">Registered Data</span>
                            <span className="font-medium">{systemBatch.medicineName} {systemBatch.strength}</span><br/>
                            <span className="font-medium">{systemBatch.tabletId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3 text-slate-700 bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <Info size={24} className="shrink-0" />
                  <div>
                    <p className="font-bold">UNKNOWN BATCH</p>
                    <p className="text-sm">This batch was not found in the system database.</p>
                  </div>
                </div>
              )}
              
              {scanState === 'expired' && (
                <div className="flex items-center gap-3 text-red-800 bg-red-50 p-4 rounded-xl border border-red-200 mt-4">
                  <XCircle size={32} className="shrink-0" />
                  <div>
                    <p className="font-bold text-lg">🔴 EXPIRED MEDICINE</p>
                    <p className="font-bold">🚫 SALE BLOCKED</p>
                    <p className="text-sm">This medicine has passed its expiry date and must not be sold.</p>
                  </div>
                </div>
              )}
              
              {scanState === 'success' && !mismatch && systemBatch && (
                <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200 mt-4">
                  <CheckCircle size={32} className="shrink-0" />
                  <div>
                    <p className="font-bold text-lg">🟢 MEDICINE VALID</p>
                    <p className="text-sm">Ready for pharmacy workflow.</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center pt-4">
                <button onClick={resetScanner} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-colors">
                  Scan Another Medicine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
