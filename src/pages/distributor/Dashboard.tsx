import React from 'react';
import { Package, Truck, Store, ArrowRightLeft, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statCards = [
  { title: 'Total Medicines Received', value: '14,245', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { title: 'Dispatched to Pharmacy', value: '11,050', icon: Store, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { title: 'In Transit', value: '850', icon: Truck, color: 'text-orange-500', bg: 'bg-orange-50' },
  { title: 'Pending Segregation', value: '2,345', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
  { title: 'Verified Transfers', value: '11,048', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Returns Handled', value: '42', icon: ArrowRightLeft, color: 'text-red-500', bg: 'bg-red-50' },
];

const chartData = [
  { name: 'Mon', Received: 1200, Dispatched: 1000 },
  { name: 'Tue', Received: 1500, Dispatched: 1300 },
  { name: 'Wed', Received: 900, Dispatched: 1100 },
  { name: 'Thu', Received: 2000, Dispatched: 1600 },
  { name: 'Fri', Received: 1800, Dispatched: 1900 },
  { name: 'Sat', Received: 800, Dispatched: 1200 },
  { name: 'Sun', Received: 500, Dispatched: 600 },
];

const recentActivity = [
  { id: 1, type: 'dispatch', message: 'Dispatched 500 units of Paracetamol to City Health Pharmacy', time: '10 minutes ago' },
  { id: 2, type: 'receive', message: 'Received 2000 units of Amoxicillin from ABC Pharma', time: '1 hour ago' },
  { id: 3, type: 'dispatch', message: 'Dispatched 300 units of Ibuprofen to MedPlus Pharmacy', time: '3 hours ago' },
  { id: 4, type: 'alert', message: 'Delayed transit reported for order #10024', time: '5 hours ago' },
  { id: 5, type: 'receive', message: 'Received 1000 units of Vitamin C from XYZ Pharmaceuticals', time: '1 day ago' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Distributor Dashboard</h2>
          <p className="text-slate-500 text-sm">Overview of your distribution network and logistics.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/distributor/pharmacy-connect" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Store size={16} />
            Connect to Pharmacy
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
          <h3 className="font-semibold text-slate-900 mb-6">Medicines Flow (Weekly)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="Received" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Received from Mfr" />
                <Bar dataKey="Dispatched" fill="#6366f1" radius={[4, 4, 0, 0]} name="Dispatched to Pharmacy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start border-b border-slate-100 pb-4 last:border-0">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  activity.type === 'alert' ? 'bg-orange-500' :
                  activity.type === 'receive' ? 'bg-blue-500' :
                  activity.type === 'dispatch' ? 'bg-indigo-500' : 'bg-slate-500'
                }`} />
                <div>
                  <p className="text-sm text-slate-700">
                    {activity.message}
                  </p>
                  <span className="text-xs text-slate-400 mt-1 block">{activity.time}</span>
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
