import React from 'react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-500 mt-1">Manage your manufacturer profile and account preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
              ABC
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">ABC Pharmaceuticals</h2>
              <p className="text-gray-500">Manufacturer ID: MFG-IN-8402</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" defaultValue="ABC Pharmaceuticals" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">License Number</label>
              <input type="text" defaultValue="DL-84029-2015" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600" readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" defaultValue="admin@abcpharma.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Registered Address</label>
              <textarea defaultValue="Plot 45, Phase II, Industrial Area, Sector 5, New Delhi 110020" className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows={3} />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
