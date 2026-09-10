import React from 'react';
import { Building2 } from 'lucide-react';

const CompanyProfile = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-slate-500">Manage your manufacturer identity and compliance details.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 max-w-3xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={48} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">ABC Pharmaceuticals Ltd.</h2>
            <p className="text-slate-500 font-medium">Manufacturer ID: MFG-IN-48291</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
            <p className="font-semibold text-slate-900">contact@abcpharma.com</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Phone</p>
            <p className="font-semibold text-slate-900">+91 98765 43210</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">License Number</p>
            <p className="font-mono font-semibold text-slate-900">LIC-PH-992384</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">GST Number</p>
            <p className="font-mono font-semibold text-slate-900">22AAAAA0000A1Z5</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-slate-500 mb-1">Registered Address</p>
            <p className="font-semibold text-slate-900">Plot 42, Pharma City, Phase 1, Hyderabad, Telangana - 500001</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
