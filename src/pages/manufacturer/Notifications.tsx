import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, FileText, Download } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Bell className="text-emerald-600" /> Notifications & Shared Reports
        </h1>
        <p className="text-slate-500">System alerts, messages, and reports shared with you securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Bell size={20} /> Alerts
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            {dynamicNotifs.length === 0 && (
              <p className="text-slate-500 text-sm">No new system alerts.</p>
            )}
            {dynamicNotifs.map((n, i) => (
              <div key={i} className={`p-4 bg-${n.type}-50 border border-${n.type}-200 text-${n.type}-800 rounded-lg`}>
                {n.text}
              </div>
            ))}
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg">
              12 batches are nearing expiry.
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg">
              Batch PCT-24051 was dispatched to ABC Medicals.
            </div>
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              Batch CET-23102 has expired.
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} /> Shared Reports
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            {sharedReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-slate-200 mb-2" />
                <p className="text-slate-500">No reports have been shared with you yet.</p>
              </div>
            ) : (
              sharedReports.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
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
