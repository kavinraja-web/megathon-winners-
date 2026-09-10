import React from 'react';
import { MOCK_ALERTS } from '../data/mockPharmaData';
import { AlertOctagon, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Alerts() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-100';
      case 'error': return 'bg-orange-50 border-orange-100';
      case 'warning': return 'bg-yellow-50 border-yellow-100';
      case 'success': return 'bg-green-50 border-green-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
        <p className="text-gray-500 mt-1">System alerts, expiry warnings, and recall notifications.</p>
      </div>

      <div className="space-y-4">
        {MOCK_ALERTS.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border flex items-start justify-between ${getBgClass(alert.type)}`}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div>
                <p className="font-medium text-gray-900">{alert.message}</p>
                <p className="text-sm text-gray-500 mt-1">{alert.date}</p>
              </div>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700">Dismiss</button>
          </div>
        ))}
      </div>
    </div>
  );
}
