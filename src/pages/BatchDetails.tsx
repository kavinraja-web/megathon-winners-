import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBatches } from '../data/mockData';
import { ArrowLeft, CheckCircle2, Truck, Store, RefreshCw, Trash2, ShieldAlert, QrCode } from 'lucide-react';

const timelineSteps = [
  { id: 1, title: 'Manufacturer Verification', date: '10 Jan 2026', time: '09:00 AM', status: 'completed', location: 'Sun Pharma Facility, Mumbai' },
  { id: 2, title: 'Distributor Received', date: '15 Jan 2026', time: '14:30 PM', status: 'completed', location: 'Chennai Main Hub' },
  { id: 3, title: 'Pharmacy Stocked', date: '18 Jan 2026', time: '10:15 AM', status: 'completed', location: 'Apollo Pharmacy, T-Nagar' },
  { id: 4, title: 'Return Requested', date: '10 Apr 2026', time: '16:45 PM', status: 'current', location: 'Apollo Pharmacy, T-Nagar' },
  { id: 5, title: 'Distributor Pickup', date: 'Pending', time: '', status: 'upcoming', location: 'Chennai' },
  { id: 6, title: 'Authorized Destruction', date: 'Pending', time: '', status: 'upcoming', location: 'Safe Disposal Facility' },
];

const BatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const batch = mockBatches.find(b => b.id === id) || mockBatches[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app/batches" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Batch {batch.id}</h2>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {batch.status}
            </span>
          </div>
          <p className="text-slate-500 text-sm">{batch.name} • {batch.manufacturer}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Traceability Timeline</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-slate-200 before:to-slate-200">
              {timelineSteps.map((step, i) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
                    step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                    step.status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100' : 
                    'bg-slate-200 text-slate-400'
                  }`}>
                    {step.status === 'completed' && <CheckCircle2 size={18} />}
                    {step.status === 'current' && <RefreshCw size={18} className="animate-spin-slow" />}
                    {step.status === 'upcoming' && <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      <time className="text-xs font-medium text-slate-500">{step.date}</time>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1 mt-2">
                      <Store size={14} /> {step.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Batch Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Medicine Name</p>
                <p className="font-medium text-slate-900">{batch.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Manufacturer</p>
                <p className="font-medium text-slate-900">{batch.manufacturer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Mfg Date</p>
                  <p className="font-medium text-slate-900">{batch.mfgDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Expiry Date</p>
                  <p className="font-medium text-slate-900">{batch.expDate}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Quantity</p>
                <p className="font-medium text-slate-900">{batch.quantity.toLocaleString()} Units</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-center">
            <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm">
              <QrCode size={120} className="text-slate-900" />
            </div>
            <h3 className="font-semibold text-white mb-1">Batch QR Code</h3>
            <p className="text-slate-400 text-xs mb-4">Unique digital identifier for tracking</p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;