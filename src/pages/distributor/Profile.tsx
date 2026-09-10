import React from 'react';
import { Building2, Mail, Phone, MapPin, Shield, Edit2 } from 'lucide-react';

const Profile = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Distributor Profile</h2>
          <p className="text-slate-500 text-sm">Manage your business information and credentials.</p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Edit2 size={16} /> Edit Profile
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-2xl">
            <div className="w-24 h-24 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Building2 size={48} />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 border-b border-slate-100">
          <h3 className="text-2xl font-bold text-slate-900">Global Logistics</h3>
          <p className="text-slate-500">Authorized Regional Distributor</p>
          <div className="flex gap-2 mt-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <Shield size={12} /> Verified Partner
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-bold">
              License: DL-2023-9988
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-slate-900">contact@globallogistics.com</p>
                  <p className="text-xs text-slate-500">Primary Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-slate-900">+91 98765 43210</p>
                  <p className="text-xs text-slate-500">Support Line</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-slate-900">100 Logistics Park, Ring Road</p>
                  <p className="text-xs text-slate-500">Bangalore, Karnataka 560100</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Business Details</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Registration Number</p>
                <p className="text-sm font-medium text-slate-900">REG-IND-554433</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Tax ID / GSTIN</p>
                <p className="text-sm font-medium text-slate-900">29ABCDE1234F1Z5</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Coverage Area</p>
                <p className="text-sm font-medium text-slate-900">South India Region</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
