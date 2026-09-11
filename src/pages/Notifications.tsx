import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, FileText } from 'lucide-react';

const Notifications = () => {
  const { profile } = useAuth();
  const [dynamicNotifs, setDynamicNotifs] = useState<any[]>([]);
  const [sharedReports, setSharedReports] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      const shortId = profile.id.substring(0, 8).toLowerCase();
      
      const notifsKey = `sys_notifications_${shortId}`;
      const savedNotifs = JSON.parse(localStorage.getItem(notifsKey) || '[]');
      setDynamicNotifs(savedNotifs);

      const reportsKey = `shared_reports_${shortId}`;
      const savedReports = JSON.parse(localStorage.getItem(reportsKey) || '[]');
      setSharedReports(savedReports);
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="text-emerald-600" /> Notifications & Shared Reports
        </h1>
        <p className="text-slate-500">System alerts and reports shared with your unique ID.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={18} /> Alerts
          </h2>
          {dynamicNotifs.length === 0 ? (
            <p className="text-slate-400 text-sm">No new alerts.</p>
          ) : (
            dynamicNotifs.map((n, i) => (
              <div key={i} className={`p-4 bg-${n.type}-50 border border-${n.type}-200 text-${n.type}-800 rounded-lg mb-4 text-sm`}>
                {n.text}
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={18} /> Shared Reports
          </h2>
          {sharedReports.length === 0 ? (
            <p className="text-slate-400 text-sm">No reports have been shared with you yet.</p>
          ) : (
            sharedReports.map((r, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-700">Distribution Report</span>
                  <span className="text-xs text-slate-500">{r.date}</span>
                </div>
                <p className="text-sm text-slate-600">From: {r.from}</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{r.items} Items</span>
                  <span className="font-bold text-emerald-600">₹{typeof r.total === 'number' ? r.total.toFixed(2) : r.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
