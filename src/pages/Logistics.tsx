import React from 'react';
import { mockBatches } from '../data/mockData';
import { Truck, MapPin } from 'lucide-react';

const Logistics = () => {
  const inTransit = mockBatches.filter(b => b.status === 'In Transit');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reverse Logistics Tracking</h2>
        <p className="text-slate-500">Track shipments returning to manufacturers or moving to destruction facilities.</p>
      </div>

      <div className="grid gap-6">
        {inTransit.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Truck size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No active shipments in transit.</p>
          </div>
        ) : (
          inTransit.map(batch => (
            <div key={batch.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Shipment {batch.id}</h3>
                    <p className="text-sm text-slate-500">{batch.name} • {batch.quantity} units</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    In Transit
                  </span>
                </div>
                
                <div className="relative pt-8 pb-4">
                  <div className="absolute top-10 left-4 right-4 h-1 bg-slate-200 rounded">
                    <div className="h-full bg-blue-500 rounded w-1/2"></div>
                  </div>
                  <div className="flex justify-between relative z-10 text-sm font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <span className="text-slate-900">Origin Pharmacy</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                      <span className="text-blue-600 font-bold">Current: {batch.location}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                        <MapPin size={16} />
                      </div>
                      <span className="text-slate-500">Destruction Facility</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logistics;