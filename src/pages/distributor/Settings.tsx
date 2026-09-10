import React from 'react';
import { Save, Bell, Shield, Smartphone, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500 text-sm">Configure your system preferences.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 border-r border-slate-100 p-4">
            <ul className="space-y-1 text-sm font-medium">
              <li><button className="w-full text-left px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg">General</button></li>
              <li><button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Notifications</button></li>
              <li><button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Security</button></li>
              <li><button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">API Integrations</button></li>
            </ul>
          </div>
          
          <div className="flex-1 p-8 space-y-8">
            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe size={18} className="text-indigo-500"/> Regional Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                    <select className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Bell size={18} className="text-indigo-500"/> Alert Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700">Email notifications for new shipments</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700">SMS alerts for delayed logistics</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm text-slate-700">Daily summary report</span>
                </label>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Shield size={18} className="text-indigo-500"/> Security</h3>
              <div className="space-y-4">
                <button className="text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors">
                  Change Password
                </button>
                <div>
                  <label className="flex items-center gap-3 mt-4">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700 flex items-center gap-2">Enable Two-Factor Authentication <Smartphone size={14} className="text-slate-400"/></span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
