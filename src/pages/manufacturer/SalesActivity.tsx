import React from 'react';
import { Activity } from 'lucide-react';

const SalesActivity = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales & Scan Activity</h1>
        <p className="text-slate-500">Track downstream scans and activity across the supply chain.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-8 text-center text-slate-500 flex flex-col items-center">
        <Activity size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Activity Stream</h2>
        <p className="max-w-md">Detailed scan logs from pharmacies and distributors will appear here once the network is fully active.</p>
      </div>
    </div>
  );
};

export default SalesActivity;
