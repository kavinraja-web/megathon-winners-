import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Notifications = () => {
  const { profile } = useAuth();
  const [dynamicNotifs, setDynamicNotifs] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.id) {
      const shortId = profile.id.substring(0, 8).toLowerCase();
      const notifsKey = `sys_notifications_${shortId}`;
      const saved = JSON.parse(localStorage.getItem(notifsKey) || '[]');
      setDynamicNotifs(saved);
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500">System alerts and messages.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {dynamicNotifs.map((n, i) => (
          <div key={i} className={`p-4 bg-${n.type}-50 border border-${n.type}-200 text-${n.type}-800 rounded-lg mb-4`}>
            {n.text}
          </div>
        ))}
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg mb-4">
          12 batches are nearing expiry.
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg mb-4">
          Batch PCT-24051 was dispatched to ABC Medicals.
        </div>
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          Batch CET-23102 has expired.
        </div>
      </div>
    </div>
  );
};

export default Notifications;
