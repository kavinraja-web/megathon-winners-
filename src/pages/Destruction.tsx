import React, { useState } from 'react';
import { Trash2, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Destruction = () => {
  const [certGenerated, setCertGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Destruction Facility</h2>
          <p className="text-slate-500 text-sm">Verify and process medicine destruction safely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-4">Pending Destruction Workflow</h3>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Batch ID</span>
                <h4 className="text-lg font-bold text-slate-900">B12355</h4>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Ready for Disposal</span>
            </div>
            <p className="text-sm text-slate-700"><strong>Medicine:</strong> Cough Syrup 100ml (Himalaya)</p>
            <p className="text-sm text-slate-700"><strong>Quantity:</strong> 800 Units</p>
            <p className="text-sm text-slate-700 mb-4"><strong>Reason:</strong> Expired</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="verify" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                <label htmlFor="verify" className="text-sm font-medium text-slate-700 cursor-pointer">Physical batch quantity verified matches system records</label>
              </div>
              
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-500 transition-colors text-center cursor-pointer">
                <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                <p className="text-sm font-medium text-slate-700">Upload Video/Photo Evidence</p>
                <p className="text-xs text-slate-500 mt-1">MP4 or JPG up to 50MB</p>
              </div>

              {!certGenerated ? (
                <button 
                  onClick={() => setCertGenerated(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                >
                  <Trash2 size={18} /> Execute Destruction
                </button>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Destruction Successful</p>
                    <p className="text-xs mt-0.5">Records updated permanently.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          {certGenerated ? (
            <div className="bg-white border-2 border-emerald-500 rounded-2xl shadow-xl shadow-emerald-100 overflow-hidden relative">
              <div className="bg-slate-900 p-6 text-center">
                <FileText size={48} className="text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white tracking-widest uppercase">Destruction Certificate</h3>
                <p className="text-slate-400 text-sm mt-1">Legally Binding Digital Record</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Certificate ID</p>
                    <p className="font-mono text-lg font-bold text-slate-900">DC2026-8992</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Date</p>
                    <p className="text-slate-900 font-medium">10 Sep 2026</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Batch ID</p>
                    <p className="text-slate-900 font-medium">B12355</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Medicine</p>
                    <p className="text-slate-900 font-medium">Cough Syrup 100ml</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Quantity</p>
                    <p className="text-slate-900 font-medium">800 Units</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
                    <p className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={16}/> DESTROYED</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-2">Authorized Signature / Hash</p>
                  <p className="font-mono text-[10px] text-slate-400 break-all">
                    0x8fB9...3a4C_VERIFIED_PHARMA_TRACE_NODE_09
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors">
                    Download PDF
                  </button>
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-colors">
                    Share Record
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <AlertCircle size={48} className="mb-4 text-slate-300" />
              <p className="font-medium text-slate-500">Certificate will appear here</p>
              <p className="text-sm mt-2">Complete the destruction workflow to generate a verifiable certificate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Destruction;