import React from 'react';
import { ShieldAlert, AlertTriangle, Activity, AlertOctagon, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '08:00', score: 12 },
  { time: '10:00', score: 15 },
  { time: '12:00', score: 25 },
  { time: '14:00', score: 18 },
  { time: '16:00', score: 96 },
  { time: '18:00', score: 30 },
  { time: '20:00', score: 20 },
];

const FraudDetection = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-purple-600" /> AI Fraud & Re-Entry Detection
          </h2>
          <p className="text-slate-500 text-sm">Real-time monitoring of suspicious scans and supply chain anomalies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">High Risk Events (24h)</h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">3 Alerts</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-slate-900">3</span>
            <span className="text-sm text-red-500 font-medium flex items-center mb-1">
              +2 from yesterday
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Duplicate Scans</h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">Warning</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-extrabold text-slate-900">14</span>
            <span className="text-sm text-slate-500 font-medium mb-1">Last 7 days</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">System Status</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center relative">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 relative z-10"></span>
            </div>
            <div>
              <p className="font-bold text-slate-900">Monitoring 2.4M items</p>
              <p className="text-xs text-slate-500">AI Model v4.2 Running</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <AlertOctagon size={120} />
            </div>
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="bg-red-600 text-white p-3 rounded-xl shrink-0">
                <ShieldAlert size={28} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-red-900">CRITICAL: Re-Entry Attempt Detected</h3>
                    <p className="text-red-700 text-sm font-medium">Batch B12351 • Paracetamol 500mg</p>
                  </div>
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                    Risk Score: 96%
                  </span>
                </div>
                
                <p className="text-red-800 mb-6 max-w-xl">
                  AI analysis flagged a highly suspicious scan event. A batch marked as permanently destroyed 6 months ago was just scanned at a retail location.
                </p>

                <div className="bg-white/60 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-red-500 font-bold uppercase mb-1">Original Destruction</p>
                    <p className="text-sm font-semibold text-slate-900">15 Feb 2025</p>
                    <p className="text-xs text-slate-600">Safe Disposal Facility, Chennai</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-500 font-bold uppercase mb-1">Illicit Scan Location</p>
                    <p className="text-sm font-semibold text-slate-900">Today, 16:05 PM</p>
                    <p className="text-xs text-slate-600">Unknown Pharmacy, Bengaluru</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
                    Freeze Batch Globally
                  </button>
                  <button className="bg-white hover:bg-red-50 text-red-700 border border-red-200 px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors">
                    Notify Local Authorities
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-6">Risk Score Timeline (24h)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-slate-400" /> Recent Anomalies
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Duplicate QR Scans', desc: 'Batch B12362 scanned simultaneously in Delhi and Mumbai.', score: 85, time: '2h ago' },
              { title: 'Quantity Mismatch', desc: 'Return request quantity exceeds original supplied amount for B12349.', score: 62, time: '5h ago' },
              { title: 'Location Jump', desc: 'Batch B12344 moved 1500km in under 2 hours. Impossible transit time.', score: 78, time: '1d ago' },
              { title: 'Invalid Formatting', desc: '5 consecutive failed QR verify attempts from IP 192.168.1.x', score: 45, time: '1d ago' },
            ].map((anom, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{anom.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    anom.score > 80 ? 'bg-red-100 text-red-700' : anom.score > 60 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    Risk: {anom.score}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 leading-relaxed">{anom.desc}</p>
                <p className="text-[10px] text-slate-400 font-medium">{anom.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;