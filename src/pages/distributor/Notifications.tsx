import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Package, Truck, Info, FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const staticNotifications = [
  { id: 1, type: 'alert', title: 'Action Required: Verify Shipment', desc: 'Shipment SHP-9003 from HealthPlus Inc is pending quality assurance.', time: '2 hours ago', unread: true },
  { id: 2, type: 'truck', title: 'Delivery Completed', desc: 'Trip TRP-1002 to MedPlus Pharmacy was delivered successfully.', time: '4 hours ago', unread: true },
  { id: 3, type: 'package', title: 'New Stock Received', desc: '12,000 units of Paracetamol added to inventory from ABC Pharma.', time: '1 day ago', unread: false },
  { id: 4, type: 'info', title: 'System Update', desc: 'Database synchronization with Pharmacy nodes completed successfully.', time: '2 days ago', unread: false },
];

const Notifications = () => {
  const { profile } = useAuth();
  const [dynamicNotifs, setDynamicNotifs] = useState<any[]>([]);
  const [sharedReports, setSharedReports] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      const shortId = profile.id.substring(0, 8).toLowerCase();
      
      const notifsKey = `sys_notifications_${shortId}`;
      const saved = JSON.parse(localStorage.getItem(notifsKey) || '[]');
      setDynamicNotifs(saved);

      const reportsKey = `shared_reports_${shortId}`;
      const savedReports = JSON.parse(localStorage.getItem(reportsKey) || '[]');
      setSharedReports(savedReports);
    }
  }, [profile]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications & Shared Reports</h2>
          <p className="text-slate-500 text-sm">Stay updated with your distribution activities and shared documents.</p>
        </div>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Bell size={20} /> System Alerts
          </h3>
          
          {dynamicNotifs.length > 0 && (
            <div className="bg-white border border-blue-200 rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="divide-y divide-blue-100 bg-blue-50/20">
                {dynamicNotifs.map((n, i) => (
                  <div key={`dyn-${i}`} className="p-6 flex gap-4">
                    <div className="p-3 rounded-full shrink-0 h-fit bg-blue-100 text-blue-600">
                      <Info size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Direct Message / System Event</h3>
                      <p className="text-sm text-slate-700 mt-1">{n.text}</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {staticNotifications.map((notif) => (
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

        <div className="lg:col-span-1">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <FileText size={20} /> Shared Reports
          </h3>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            {sharedReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-500">No reports have been shared with you yet.</p>
              </div>
            ) : (
              sharedReports.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
                  <div>
                    <h3 className="font-bold text-slate-800">{r.from} Report</h3>
                    <p className="text-sm text-slate-500">Date: {r.date} • Items: {r.items}</p>
                  </div>
                  <button onClick={() => alert("Downloading encrypted PDF report...")} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
