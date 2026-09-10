import React from 'react';
import { Bell, AlertTriangle, Package, Truck, Info } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'alert', title: 'Action Required: Verify Shipment', desc: 'Shipment SHP-9003 from HealthPlus Inc is pending quality assurance.', time: '2 hours ago', unread: true },
  { id: 2, type: 'truck', title: 'Delivery Completed', desc: 'Trip TRP-1002 to MedPlus Pharmacy was delivered successfully.', time: '4 hours ago', unread: true },
  { id: 3, type: 'package', title: 'New Stock Received', desc: '12,000 units of Paracetamol added to inventory from ABC Pharma.', time: '1 day ago', unread: false },
  { id: 4, type: 'info', title: 'System Update', desc: 'Database synchronization with Pharmacy nodes completed successfully.', time: '2 days ago', unread: false },
];

const Notifications = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500 text-sm">Stay updated with your distribution activities.</p>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className={`p-6 flex gap-4 transition-colors ${notif.unread ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}>
              <div className={`p-3 rounded-full shrink-0 h-fit ${
                notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                notif.type === 'truck' ? 'bg-emerald-100 text-emerald-600' :
                notif.type === 'package' ? 'bg-blue-100 text-blue-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {notif.type === 'alert' && <AlertTriangle size={20} />}
                {notif.type === 'truck' && <Truck size={20} />}
                {notif.type === 'package' && <Package size={20} />}
                {notif.type === 'info' && <Info size={20} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className={`text-sm ${notif.unread ? 'text-slate-700' : 'text-slate-500'}`}>{notif.desc}</p>
              </div>
              {notif.unread && (
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
