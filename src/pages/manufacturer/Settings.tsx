import React from 'react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Configure system preferences.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-2xl">
        <p className="text-slate-500">Settings available in future updates.</p>
      </div>
    </div>
  );
};

export default Settings;
