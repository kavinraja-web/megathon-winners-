import React, { useEffect, useState } from 'react';
import { Package, Truck, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { ManufacturerBatch, initialMfrBatches, updateBatchesBasedOnDate } from '../../data/manufacturerData';

const Dashboard = () => {
  const [batches, setBatches] = useState<ManufacturerBatch[]>([]);

  useEffect(() => {
    setBatches(updateBatchesBasedOnDate(initialMfrBatches));
  }, []);

  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === 'ACTIVE').length;
  const totalUnits = batches.reduce((acc, b) => acc + b.mfgQuantity, 0);
  const unitsDistributed = batches.reduce((acc, b) => acc + b.distributedQuantity, 0);
  const nearExpiry = batches.filter(b => b.status === 'NEAR EXPIRY').length;
  const expired = batches.filter(b => b.status === 'EXPIRED').length;

  const activities = [
    { id: 1, text: 'Batch PCT-24051 registered', time: '2 hours ago', icon: Package, color: 'text-blue-500' },
    { id: 2, text: '5,000 units of Paracetamol 500mg dispatched', time: '4 hours ago', icon: Truck, color: 'text-green-500' },
    { id: 3, text: 'Batch AMX-24031 scanned by XYZ Pharmacy', time: '1 day ago', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 4, text: 'Batch CET-23102 marked expired', time: '2 days ago', icon: XCircle, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manufacturer Dashboard</h1>
        <p className="text-slate-500">Manage medicine batches, track distribution and verify product status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Total Medicine Batches</h3>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Package size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{totalBatches}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Active Batches</h3>
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{activeBatches}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Total Units Mfd</h3>
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Package size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{totalUnits.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Units Distributed</h3>
            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Truck size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{unitsDistributed.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Near Expiry</h3>
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertTriangle size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{nearExpiry}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Expired Batches</h3>
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><XCircle size={20} /></div>
          </div>
          <p className="text-3xl font-bold">{expired}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="p-4 flex items-start gap-4">
              <div className={`p-2 rounded-full bg-slate-50 ${act.color}`}>
                <act.icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{act.text}</p>
                <p className="text-xs text-slate-500 mt-1">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
