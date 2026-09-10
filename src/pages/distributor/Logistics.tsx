import React from 'react';
import { Truck, MapPin, Navigation, Calendar } from 'lucide-react';

const mockLogistics = [
  { id: 'TRP-1001', dest: 'City Health Pharmacy', driver: 'Rajesh K.', vehicle: 'KA-01-AB-1234', status: 'On Route', eta: 'Today, 2:30 PM', progress: 75 },
  { id: 'TRP-1002', dest: 'MedPlus Pharmacy', driver: 'Suresh M.', vehicle: 'KA-05-XY-9876', status: 'Delivered', eta: 'Completed', progress: 100 },
  { id: 'TRP-1003', dest: 'Carewell Medicals', driver: 'Amit P.', vehicle: 'KA-03-MN-4567', status: 'Loading', eta: 'Tomorrow, 10:00 AM', progress: 10 },
];

const Logistics = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Logistics & Fleet</h2>
          <p className="text-slate-500 text-sm">Track your distribution vehicles and deliveries in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {mockLogistics.map((trip) => (
            <div key={trip.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${trip.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{trip.dest}</h3>
                    <p className="text-sm font-mono text-slate-500">Trip ID: {trip.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  trip.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                  trip.status === 'On Route' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {trip.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><UserIcon /> Driver</p>
                  <p className="font-medium text-slate-900">{trip.driver}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><TruckIcon /> Vehicle</p>
                  <p className="font-medium text-slate-900">{trip.vehicle}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 flex items-center gap-1"><Navigation /> ETA</p>
                  <p className="font-medium text-slate-900">{trip.eta}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                  <span>Warehouse</span>
                  <span>Destination</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${trip.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                    style={{ width: `${trip.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin size={20} className="text-indigo-400" /> Live Tracking Map</h3>
          <div className="flex-1 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 min-h-[300px]">
            <p className="text-slate-400 text-sm flex flex-col items-center gap-2">
              <Navigation size={32} className="opacity-50" />
              Map integration active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons to keep it simple
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="5" rx="2"/><path d="M18 5h2a2 2 0 0 1 2 2v8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><line x1="2" x2="5" y1="18" y2="18"/><line x1="9" x2="15" y1="18" y2="18"/><line x1="19" x2="22" y1="18" y2="18"/></svg>;

export default Logistics;
