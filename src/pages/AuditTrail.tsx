import React from 'react';
import { Activity, ShieldCheck, User, QrCode } from 'lucide-react';

const mockAuditLogs = [
  { id: 'LOG-001', action: 'Scan & Verify', user: 'Pharm-User-12', batchId: 'B12345', location: 'Apollo Pharmacy, Coimbatore', timestamp: '2026-09-10 09:42:15' },
  { id: 'LOG-002', action: 'Batch Created', user: 'Manufacturer-Sun', batchId: 'B99012', location: 'Manufacturer Warehouse', timestamp: '2026-09-10 10:15:22' },
  { id: 'LOG-003', action: 'Sale Blocked (Expired)', user: 'Pharm-User-45', batchId: 'B12347', location: 'Madurai Distributor', timestamp: '2026-09-10 11:05:03' },
  { id: 'LOG-004', action: 'Fraud Detected', user: 'System', batchId: 'B12351', location: 'Chennai Pharmacy', timestamp: '2026-09-10 11:30:45' },
  { id: 'LOG-005', action: 'Status Update (In Transit)', user: 'Logistics-Partner', batchId: 'B12352', location: 'Highway 44, Salem', timestamp: '2026-09-10 12:45:10' },
  { id: 'LOG-006', action: 'Payment Processed', user: 'Pharm-User-12', batchId: 'B12345', location: 'Apollo Pharmacy, Coimbatore', timestamp: '2026-09-10 13:10:00' },
];

const AuditTrail = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Audit Trail</h2>
          <p className="text-slate-500">Immutable ledger of all system interactions and tracking events.</p>
        </div>
        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Export Logs (CSV)
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th className="p-4 font-semibold">Log ID / Time</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Batch / Target</th>
              <th className="p-4 font-semibold">User / System</th>
              <th className="p-4 font-semibold">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAuditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{log.id}</div>
                  <div className="text-xs text-slate-500 mt-1">{log.timestamp}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {log.action.includes('Fraud') ? <ShieldCheck size={16} className="text-red-500" /> : 
                     log.action.includes('Scan') ? <QrCode size={16} className="text-emerald-500" /> :
                     <Activity size={16} className="text-blue-500" />}
                    <span className={`font-semibold text-sm ${log.action.includes('Fraud') ? 'text-red-600' : 'text-slate-700'}`}>
                      {log.action}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium text-indigo-600">
                  {log.batchId}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User size={14} className="text-slate-400" />
                    {log.user}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-500">
                  {log.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;