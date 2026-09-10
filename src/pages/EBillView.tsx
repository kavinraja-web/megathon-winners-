import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

const EBillView = () => {
  const [searchParams] = useSearchParams();
  const [billData, setBillData] = useState<any>(null);
  const [error, setError] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decoded = JSON.parse(atob(dataParam));
        setBillData(decoded);
      } catch (err) {
        setError('Invalid or corrupted E-Bill data.');
      }
    } else {
      setError('No E-Bill data found in URL.');
    }
  }, [searchParams]);

  const downloadPDF = () => {
    window.print();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border-t-4 border-red-500">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading E-Bill</h2>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!billData) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading E-Bill...</div>;
  }

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
      <div className="min-h-screen bg-slate-100 p-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl flex justify-between items-center mb-6 no-print">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> Digital E-Bill Verified
          </h1>
          <button 
            onClick={downloadPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <Download size={18} /> Save as PDF
          </button>
        </div>

        <div 
          ref={invoiceRef}
          className="print-area w-full max-w-2xl bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200"
        >
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">PHARMA TRACE</h2>
            <p className="text-slate-500 mt-1 font-medium">Verified Pharmacy Receipt</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-slate-800 mb-1">INVOICE</h3>
            <p className="text-sm text-slate-500 font-mono">#{billData.id}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
            <p className="text-slate-900 font-medium">{billData.customerName || 'Walk-in Customer'}</p>
            {billData.customerPhone && <p className="text-slate-600 text-sm">{billData.customerPhone}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
            <p className="text-slate-900 font-medium">{new Date(billData.date).toLocaleDateString()}</p>
            <p className="text-slate-600 text-sm">{new Date(billData.date).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-3 text-sm font-bold text-slate-800">Medicine & Batch</th>
                <th className="py-3 text-sm font-bold text-slate-800">Expiry Date</th>
                <th className="py-3 text-sm font-bold text-slate-800 text-center">Qty</th>
                <th className="py-3 text-sm font-bold text-slate-800 text-right">Price</th>
                <th className="py-3 text-sm font-bold text-slate-800 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {billData.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-4">
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="text-xs text-slate-500 font-mono">Batch: {item.batchNumber}</p>
                  </td>
                  <td className="py-4 text-sm text-slate-700">
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-center font-medium text-slate-700">{item.quantity}</td>
                  <td className="py-4 text-right text-slate-700">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-slate-900">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t border-slate-200 pt-6">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{billData.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-xl font-black text-slate-900 border-t border-slate-200 pt-3">
              <span>TOTAL</span>
              <span>₹{billData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-emerald-600 font-bold mb-2 flex items-center justify-center gap-2">
            <CheckCircle size={16} /> Authentic Medicines Guaranteed
          </p>
          <p className="text-slate-400 text-xs">
            This digital receipt verifies that the medicines purchased have been authenticated via the Pharma Trace system.
          </p>
        </div>
        </div>
      </div>
    </>
  );
};

export default EBillView;
