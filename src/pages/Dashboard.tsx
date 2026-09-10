import React from 'react';
import { Package, AlertTriangle, RefreshCw, Truck, Trash2, ShieldAlert } from 'lucide-react';
import { mockBatches, mockNotifications } from '../data/mockData';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statCards = [
  { title: 'Total Active Batches', value: '1,245', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Near Expiry', value: '84', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Pending Returns', value: '12', icon: RefreshCw, color: 'text-purple-500', bg: 'bg-purple-50' },
  { title: 'In Transit', value: '38', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { title: 'Destroyed', value: '450', icon: Trash2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Fraud Alerts', value: '3', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-50' },
];

const chartData = [
  { name: 'Jan', Returns: 40, Destroyed: 24 },
  { name: 'Feb', Returns: 30, Destroyed: 13 },
  { name: 'Mar', Returns: 20, Destroyed: 58 },
  { name: 'Apr', Returns: 27, Destroyed: 39 },
  { name: 'May', Returns: 18, Destroyed: 48 },
  { name: 'Jun', Returns: 23, Destroyed: 38 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm">Welcome back. Here is the latest system overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/scanner" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Launch Scanner
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">Returns vs Destruction Overview</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="Returns" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Destroyed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">Recent Notifications</h3>
          <div className="space-y-4">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  notif.type === 'alert' ? 'bg-orange-500' :
                  notif.type === 'logistics' ? 'bg-blue-500' :
                  notif.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className={`text-sm ${notif.type === 'fraud' ? 'font-bold text-red-600' : 'text-slate-700'}`}>
                    {notif.message}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;