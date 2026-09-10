import React, { useState, useEffect, useRef } from 'react';
import { mockBatches, Batch, updateBatchQuantity } from '../data/mockData';
import { QrCode, Search, ShieldAlert, CheckCircle, Upload, AlertTriangle, Receipt, Smartphone, Camera } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'details' | 'billing' | 'payment' | 'success' | 'fraud' | 'expired'>('idle');
  const [batchId, setBatchId] = useState('');
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isCameraOpen && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode("scanner-reader");
      
      scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setBatchId(decodedText);
          setIsCameraOpen(false);
          triggerScanLogic(decodedText);
          if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
              scannerRef.current?.clear();
              scannerRef.current = null;
            }).catch(e => console.error(e));
          }
        },
        () => {} // ignore frame errors
      ).catch((err) => {
        console.error("Camera start failed:", err);
      });
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        }).catch(e => console.error(e));
      }
    };
  }, [isCameraOpen]);

  const triggerScanLogic = (id: string) => {
    if (!id) return;
    setScanState('scanning');
    setTimeout(() => {
      if (id === 'B12351' || id === 'OLD2025Z') {
        setScanState('fraud');
        return;
      }
      
      const batch = mockBatches.find(b => b.id === id);
      if (batch) {
        setCurrentBatch(batch);
        const isExpired = new Date(batch.expDate) < new Date();
        if (isExpired || batch.status === 'Expired') {
          setScanState('expired');
        } else {
          setScanState('details');
        }
      } else {
        alert("Batch not found!");
        setScanState('idle');
      }
    }, 1500);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    triggerScanLogic(batchId);
  };

  const handleGenerateBill = () => {
    setScanState('billing');
  };

  const handleUPIPayment = () => {
    setScanState('payment');
  };

  const handleConfirmPayment = () => {
    if (currentBatch) {
      updateBatchQuantity(currentBatch.id, 1);
      setScanState('success');
    }
  };

  const resetScanner = () => {
    setScanState('idle');
    setBatchId('');
    setCurrentBatch(null);
    setIsCameraOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">POS Scanner & Billing</h2>
        <p className="text-slate-500">Scan QR Code, Verify Details, Check Expiry, and Generate Bill.</p>
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

          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-slate-500">
            <span>or</span>
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
                        Please open this directly in Chrome/Safari using https://
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
          <p className="text-slate-500">Retrieving details and verifying expiry status.</p>
        </div>
      )}

      {scanState === 'expired' && (
        <div className="bg-white border-2 border-red-500 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/20 animate-in zoom-in-95 duration-300">
          <div className="bg-red-600 text-white p-8 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white text-red-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                <ShieldAlert size={48} />
              </div>
              <h2 className="text-4xl font-extrabold mb-2 tracking-tight">SALE BLOCKED: EXPIRED MEDICINE</h2>
              <p className="text-red-100 text-xl font-medium max-w-lg mx-auto">
                Batch {batchId} has expired on {currentBatch?.expDate}. It cannot be sold.
              </p>
            </div>
          </div>
          <div className="p-8 text-center">
             <button onClick={resetScanner} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors">
                Cancel & Scan Another
              </button>
          </div>
        </div>
      )}

      {scanState === 'details' && currentBatch && (
        <div className="bg-white border border-emerald-200 rounded-3xl overflow-hidden shadow-lg shadow-emerald-100/50">
          <div className="bg-emerald-500 text-white p-8 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-2">Authentic & Valid Batch</h3>
              <p className="text-emerald-50 text-lg">Medicine is verified and safe for sale.</p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div>
                <p className="text-sm text-slate-500 mb-1">Medicine</p>
                <p className="font-semibold text-slate-900">{currentBatch.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Manufacturer</p>
                <p className="font-semibold text-slate-900">{currentBatch.manufacturer}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Expiry Date</p>
                <p className="font-semibold text-slate-900">{currentBatch.expDate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">MRP</p>
                <p className="font-semibold text-slate-900">₹{currentBatch.mrp || 120}</p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={resetScanner} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors">
                Cancel
              </button>
              <button onClick={handleGenerateBill} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                <Receipt size={20} /> Generate Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {scanState === 'billing' && currentBatch && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto">
          <div className="text-center mb-6">
             <Receipt size={48} className="mx-auto text-slate-700 mb-4" />
             <h3 className="text-2xl font-bold text-slate-900">Billing Summary</h3>
          </div>
          <div className="border-t border-b border-slate-200 py-4 mb-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600">{currentBatch.name} (x1)</span>
              <span className="font-medium">₹{currentBatch.mrp || 120}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Batch: {currentBatch.id}</span>
              <span>Exp: {currentBatch.expDate}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-bold text-emerald-600">₹{currentBatch.mrp || 120}</span>
          </div>
          <button onClick={handleUPIPayment} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
            <Smartphone size={20} /> Pay via UPI
          </button>
        </div>
      )}

      {scanState === 'payment' && currentBatch && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">UPI Payment</h3>
          <p className="text-slate-500 mb-6">Scan with any UPI app to pay</p>
          <div className="bg-white p-4 inline-block rounded-xl border border-slate-200 mb-6 shadow-sm">
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=pharmacy@upi&pn=Pharmacy&am=${currentBatch.mrp || 120}`} 
               alt="UPI QR Code"
               className="w-48 h-48 mx-auto"
             />
          </div>
          <div className="mb-8">
             <p className="text-lg font-bold text-slate-900">Amount: ₹{currentBatch.mrp || 120}</p>
          </div>
          <button onClick={handleConfirmPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-colors">
            Confirm Payment Successful
          </button>
        </div>
      )}

      {scanState === 'success' && currentBatch && (
        <div className="bg-white border border-emerald-200 rounded-3xl p-12 text-center shadow-lg shadow-emerald-100/50">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h3>
          <p className="text-slate-600 mb-8">
            Inventory has been updated. The sale is recorded in the system.
          </p>
          <button onClick={resetScanner} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-medium transition-colors">
            Start New Sale
          </button>
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