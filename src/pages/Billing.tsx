import React, { useState, useEffect } from 'react';
import { usePOS } from '../context/POSContext';
import { Html5Qrcode } from 'html5-qrcode';
import { Search, Plus, Minus, Trash2, Camera, Receipt, AlertOctagon, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { BatchRecord, Product } from '../data/db';
import QRCode from 'react-qr-code';

const Billing = () => {
  const { currentBill, updateQuantity, removeFromBill, generateBill, batches, products, addToBill, findProductByBarcode, getBatchesForProduct, addInventoryItem } = usePOS();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [availableBatches, setAvailableBatches] = useState<BatchRecord[]>([]);
  
  // State for unrecognized QR
  const [unrecognizedQrData, setUnrecognizedQrData] = useState<any>(null);
  const [addQty, setAddQty] = useState<number>(10);
  const [addMrp, setAddMrp] = useState<number>(100);
  const [addSellingPrice, setAddSellingPrice] = useState<number>(80);

  const subtotal = currentBill.reduce((sum, item) => sum + item.total, 0);

  const scannerRef = React.useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
      scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedBarcode(decodedText);
          handleBarcodeLookup(decodedText);
          setIsScanning(false);
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
  }, [isScanning]);

  const parseQRCode = (text: string) => {
    if (!text.includes('MEDICINE:') && !text.includes('BATCH_NO:')) return null;
    const lines = text.split(/\r?\n/);
    const data: any = {};
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        data[key.trim()] = rest.join(':').trim();
      }
    });
    return data;
  };

  const handleBarcodeLookup = (barcode: string) => {
    const parsedQr = parseQRCode(barcode);
    // Support both sets of keys
    const tabletNo = parsedQr ? (parsedQr['TABLET_NO'] || parsedQr['TABLET NUMBER'] || barcode) : barcode;
    const product = findProductByBarcode(tabletNo);
    
    if (product) {
      setScannedProduct(product);
      setAvailableBatches(getBatchesForProduct(product.id));
      setUnrecognizedQrData(null);
    } else {
      if (parsedQr) {
        // Map the keys so that the UI can find them
        const normalizedQr = {
          MEDICINE: parsedQr['MEDICINE'] || '',
          TABLET_NO: parsedQr['TABLET_NO'] || parsedQr['TABLET NUMBER'] || '',
          BATCH_NO: parsedQr['BATCH_NO'] || parsedQr['BATCH NUMBER'] || '',
          MFG_DATE: parsedQr['MFG_DATE'] || parsedQr['MANUFACTURED DATE'] || '',
          EXP_DATE: parsedQr['EXP_DATE'] || parsedQr['EXPIRY DATE'] || '',
          MRP: parsedQr['MRP'] || ''
        };
        
        setUnrecognizedQrData(normalizedQr);
        
        if (normalizedQr.MRP) {
          const mrpVal = parseFloat(normalizedQr.MRP);
          if (!isNaN(mrpVal)) {
            setAddMrp(mrpVal);
            setAddSellingPrice(mrpVal); // default selling price to MRP or any logic
          }
        }
      } else {
        setUnrecognizedQrData(null);
      }
      setScannedProduct(null);
      setAvailableBatches([]);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedBarcode) handleBarcodeLookup(scannedBarcode);
  };

  const handleAddInventory = () => {
    if (!unrecognizedQrData) return;
    
    const productData = {
      name: unrecognizedQrData['MEDICINE'],
      barcode: unrecognizedQrData['TABLET_NO']
    };
    
    const batchData = {
      batchNumber: unrecognizedQrData['BATCH_NO'],
      manufacturingDate: unrecognizedQrData['MFG_DATE'],
      expiryDate: unrecognizedQrData['EXP_DATE'],
      quantity: addQty,
      mrp: addMrp,
      sellingPrice: addSellingPrice
    };

    const { product } = addInventoryItem(productData, batchData);
    setUnrecognizedQrData(null);
    // Reload lookup
    setScannedProduct(product);
    setAvailableBatches(getBatchesForProduct(product.id));
  };

  const handleGenerateBill = () => {
    const bill = generateBill();
    if (bill) {
      const eBillUrl = `${window.location.origin}/e-bill?data=${btoa(JSON.stringify(bill))}`;
      
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-6 border border-slate-200`}>
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">PHARMAX</h2>
            <p className="text-sm text-slate-500 uppercase tracking-widest">Digital Invoice</p>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-500">Bill No: {bill.billNumber}</span>
            <span className="text-slate-500">Date: {new Date(bill.date).toLocaleDateString()}</span>
          </div>
          
          <div className="border-t border-b border-slate-200 py-3 mb-4 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
              <span className="w-1/2">Medicine / Batch</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/3 text-right">Price</span>
            </div>
            {bill.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div className="w-1/2">
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-xs text-slate-500">{item.batchNumber}</p>
                </div>
                <span className="w-1/6 text-center mt-1">{item.quantity}</span>
                <span className="w-1/3 text-right mt-1">₹{item.total}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total:</span>
            <span>₹{bill.total}</span>
          </div>
          
          <div className="flex flex-col items-center bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Consumer E-Bill QR</p>
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 mb-2">
              <QRCode value={eBillUrl} size={140} />
            </div>
            <p className="text-[10px] text-slate-400 text-center max-w-[200px]">Customer can scan this QR code to download their PDF receipt instantly.</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => toast.dismiss(t.id)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-lg font-medium transition-colors text-sm text-slate-700">Close</button>
            <button onClick={() => { window.open(eBillUrl, '_blank'); toast.dismiss(t.id); }} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2">View & Download E-Bill</button>
          </div>
        </div>
      ), { duration: Infinity });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & POS</h2>
          <p className="text-slate-500 text-sm">Scan items, verify expiry, and generate e-bills securely.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Scanner and Product Details */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Scan Product Barcode</h3>
              <button 
                onClick={() => setIsScanning(!isScanning)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isScanning ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {isScanning ? 'Close Scanner' : <><Camera size={16} /> Open Camera</>}
              </button>
            </div>

            {isScanning && (
              <div className="bg-slate-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center mb-6 min-h-[300px]">
                {(!window.isSecureContext || !navigator.mediaDevices) ? (
                  <div className="p-6 text-center">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">Camera Blocked by Browser</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Your browser is blocking camera access because this site is not secure, or you are using an in-app browser (like WhatsApp/Instagram).
                    </p>
                    <p className="text-emerald-400 font-bold text-sm">
                      Please open this link directly in Chrome or Safari, and ensure it starts with https://
                    </p>
                  </div>
                ) : (
                  <div id="reader" className="w-full h-full object-cover"></div>
                )}
              </div>
            )}

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Barcode manually (e.g. 8901234567890)"
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>
              <button type="submit" className="bg-emerald-600 text-white px-6 rounded-lg font-medium hover:bg-emerald-700">Search</button>
            </form>
          </div>

          {scannedProduct && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{scannedProduct.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{scannedProduct.genericName} • {scannedProduct.manufacturer} • {scannedProduct.category}</p>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Available Batches (FEFO order)</h4>
                
                {availableBatches.length > 0 ? availableBatches.map(batch => (
                  <div key={batch.id} className={`border rounded-xl p-4 transition-all ${
                    batch.status === 'EXPIRED' ? 'border-red-200 bg-red-50/30' :
                    batch.status === 'PERMANENTLY_CLOSED' ? 'border-slate-300 bg-slate-50' :
                    'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-800">{batch.batchNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            batch.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                            batch.status === 'NEAR_EXPIRY' ? 'bg-yellow-100 text-yellow-700' :
                            batch.status === 'CRITICAL' ? 'bg-orange-100 text-orange-700' :
                            batch.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {batch.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Expiry: {new Date(batch.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-slate-800">₹{batch.sellingPrice} <span className="text-xs text-slate-500 font-normal">/ unit</span></span>
                        <span className="text-xs text-slate-500">MRP: ₹{batch.mrp}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium text-slate-600">Stock: {batch.quantity}</span>
                      
                      {batch.status === 'EXPIRED' || batch.status === 'RETURN_REQUESTED' ? (
                        <button disabled className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-lg text-sm font-bold cursor-not-allowed flex items-center gap-1">
                          <AlertTriangle size={14} /> AUTO-RETURNED TO DISTRIBUTOR
                        </button>
                      ) : batch.status === 'PERMANENTLY_CLOSED' ? (
                        <button disabled className="bg-slate-200 text-slate-500 px-4 py-1.5 rounded-lg text-sm font-bold cursor-not-allowed flex items-center gap-1">
                          <AlertOctagon size={14} /> DESTROYED
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToBill(batch, scannedProduct, 1)}
                          disabled={batch.quantity === 0}
                          className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:bg-slate-300 transition-colors"
                        >
                          Add to Bill
                        </button>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm">No batches available in inventory.</p>
                )}
              </div>
            </div>
          )}

          {unrecognizedQrData && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-orange-800 uppercase tracking-tight mb-2">New Product Scanned</h3>
              <p className="text-sm text-orange-700 mb-6">This product is not in your inventory. You can quickly add it below using the verified data from the QR tag.</p>

              <div className="bg-white p-4 rounded-xl border border-orange-100 mb-6 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Medicine:</span><span className="font-semibold text-slate-800">{unrecognizedQrData['MEDICINE']}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Batch No:</span><span className="font-semibold font-mono text-slate-800">{unrecognizedQrData['BATCH_NO']}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Expiry:</span><span className="font-semibold text-slate-800">{unrecognizedQrData['EXP_DATE']}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quantity Added</label>
                  <input type="number" value={addQty} onChange={e => setAddQty(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">MRP (₹)</label>
                  <input type="number" value={addMrp} onChange={e => setAddMrp(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                  <input type="number" value={addSellingPrice} onChange={e => setAddSellingPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setUnrecognizedQrData(null)} className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleAddInventory} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Plus size={18} /> Add to Inventory
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Current Bill */}
        <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 rounded-t-2xl">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Receipt size={20} className="text-emerald-600" /> Current Bill
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentBill.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="text-slate-200 mb-3" />
                <p>Bill is empty</p>
                <p className="text-xs text-center mt-2 px-4">Scan a barcode to add medicine to the bill.</p>
              </div>
            ) : (
              currentBill.map(item => (
                <div key={item.batchId} className="border border-slate-200 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm leading-tight">{item.productName}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Batch: {item.batchNumber}</p>
                    </div>
                    <span className="font-bold text-slate-800 text-sm">₹{item.total}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500">₹{item.unitPrice} each</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-100 rounded-md border border-slate-200">
                        <button onClick={() => updateQuantity(item.batchId, item.quantity - 1)} className="p-1 hover:bg-slate-200 text-slate-600 rounded-l-md transition-colors"><Minus size={14} /></button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.batchId, item.quantity + 1)} className="p-1 hover:bg-slate-200 text-slate-600 rounded-r-md transition-colors"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromBill(item.batchId)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-slate-200 rounded-b-2xl bg-slate-50/50">
            <div className="flex justify-between text-lg font-bold text-slate-800 mb-4">
              <span>Total Amount</span>
              <span>₹{subtotal}</span>
            </div>
            
            <button 
              onClick={handleGenerateBill}
              disabled={currentBill.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors"
            >
              Generate Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
