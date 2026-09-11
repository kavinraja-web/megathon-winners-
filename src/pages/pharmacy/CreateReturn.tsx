import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CreateReturn = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: '',
    batchNumber: '',
    tabletId: '',
    quantity: '',
    expiryDate: '',
    returnReason: 'Expired',
    distributorId: ''
  });

  const generateTrackingId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `RETURN-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);

    try {
      const trackingId = generateTrackingId();
      
      // We will look up the distributor by their short ID or full UUID
      // For the demo, let's assume they enter the short ID (first 8 chars) or full UUID
      // We need the full UUID to link. Let's do a quick lookup.
      const searchTerm = formData.distributorId.trim().toLowerCase();
      const { data: distProfile, error: distError } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('role', 'distributor')
        .ilike('id', `${searchTerm}%`)
        .limit(1)
        .single();

      if (distError || !distProfile) {
        throw new Error('Distributor ID not found. Please verify the ID.');
      }

      // 1. Create Return Record
      const { data: returnData, error: returnError } = await supabase
        .from('returns')
        .insert({
          tracking_id: trackingId,
          medicine_name: formData.medicineName,
          batch_number: formData.batchNumber,
          tablet_id: formData.tabletId,
          quantity_expected: parseInt(formData.quantity),
          pharmacy_id: profile.user_id,
          distributor_id: distProfile.user_id,
          return_reason: formData.returnReason,
          status: 'INITIATED'
        })
        .select('id')
        .single();

      if (returnError) throw returnError;

      // 2. Create Event Record
      const { error: eventError } = await supabase
        .from('return_events')
        .insert({
          return_id: returnData.id,
          event_type: 'RETURN_INITIATED',
          performed_by: profile.user_id,
          performed_role: 'pharmacy',
          quantity: parseInt(formData.quantity),
          notes: `Return initiated due to: ${formData.returnReason}`
        });

      if (eventError) throw eventError;

      // Add Local Notification for Demo
      const notifsKey = `sys_notifications_${searchTerm.substring(0,8)}`;
      const existingNotifs = JSON.parse(localStorage.getItem(notifsKey) || '[]');
      existingNotifs.unshift({
        type: 'orange',
        text: `New Return Request ${trackingId} from ${profile.full_name}`
      });
      localStorage.setItem(notifsKey, JSON.stringify(existingNotifs));

      toast.success(`Return ${trackingId} initiated!`);
      navigate('/pharmacy/returns');

    } catch (error: any) {
      toast.error(error.message || 'Failed to create return.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/pharmacy/returns')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Initiate Return</h1>
          <p className="text-slate-500">Create a new return request for expired or damaged medicines.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-orange-400" size={28} />
            <h2 className="text-xl font-bold">Return Details</h2>
          </div>
          <p className="text-slate-400 text-sm">Please fill in accurate batch details. A unique tracking ID will be generated upon submission.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Medicine Name</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Paracetamol 500mg"
                value={formData.medicineName}
                onChange={e => setFormData({...formData, medicineName: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tablet Number / ID</label>
              <input 
                type="text" 
                placeholder="e.g. TAB-PAR-0001"
                value={formData.tabletId}
                onChange={e => setFormData({...formData, tabletId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Batch Number</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. BATCH-26001"
                value={formData.batchNumber}
                onChange={e => setFormData({...formData, batchNumber: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity (Tablets)</label>
              <input 
                required 
                type="number" 
                placeholder="250"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date</label>
              <input 
                required 
                type="date" 
                value={formData.expiryDate}
                onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Return Reason</label>
              <select 
                value={formData.returnReason}
                onChange={e => setFormData({...formData, returnReason: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-xl px-4 py-3 outline-none transition-colors"
              >
                <option value="Expired">Expired</option>
                <option value="Damaged">Damaged</option>
                <option value="Recalled">Recalled</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-orange-800 font-bold mb-4">
                <AlertTriangle size={20} />
                <h3>Distributor Routing</h3>
              </div>
              <p className="text-orange-700 text-sm mb-4">Enter the exact Distributor ID. This return will be routed directly to their inbox for manual verification.</p>
              
              <div>
                <label className="block text-sm font-semibold text-orange-900 mb-2">Distributor ID</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. 550e8400 or DIST-ID"
                  value={formData.distributorId}
                  onChange={e => setFormData({...formData, distributorId: e.target.value.toUpperCase()})}
                  className="w-full bg-white border border-orange-300 focus:border-orange-500 rounded-xl px-4 py-3 outline-none transition-colors text-orange-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors shadow-lg"
            >
              {loading ? 'Processing...' : (
                <>
                  <Send size={20} />
                  Initiate Return
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReturn;
