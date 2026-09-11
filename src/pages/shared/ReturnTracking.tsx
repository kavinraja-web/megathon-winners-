import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ReturnTimeline, ReturnEvent } from '../../components/ReturnTimeline';
import { Package, Search, ArrowLeft, ShieldAlert, CheckCircle, Clock, Truck, ShieldCheck, Download, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ReturnTracking = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [returns, setReturns] = useState<any[]>([]);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [events, setEvents] = useState<ReturnEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Action states
  const [actionQuantity, setActionQuantity] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReturns();
  }, [profile]);

  const fetchReturns = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      let query = supabase.from('returns').select('*').order('created_at', { ascending: false });
      
      if (profile.role === 'pharmacy') {
        query = query.eq('pharmacy_id', profile.user_id);
      } else if (profile.role === 'distributor') {
        query = query.eq('distributor_id', profile.user_id);
      } else if (profile.role === 'manufacturer') {
        // Mfr sees returns
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setReturns(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch returns: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadReturnDetails = async (ret: any) => {
    setSelectedReturn(ret);
    setActionQuantity(ret.quantity_expected.toString());
    setActionNotes('');
    
    try {
      const { data, error } = await supabase
        .from('return_events')
        .select(`
          event_type, performed_role, quantity, notes, created_at,
          profiles:performed_by (full_name)
        `)
        .eq('return_id', ret.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      const formattedEvents = data.map((d: any) => ({
        event_type: d.event_type,
        performed_by_name: d.profiles?.full_name || 'Unknown User',
        performed_role: d.performed_role,
        quantity: d.quantity,
        notes: d.notes,
        created_at: d.created_at
      }));
      
      setEvents(formattedEvents);
    } catch (err: any) {
      toast.error('Failed to load timeline.');
    }
  };

  const handleAction = async (newStatus: string, eventType: string) => {
    if (!profile || !selectedReturn) return;
    setActionLoading(true);

    try {
      const qty = parseInt(actionQuantity);
      
      let finalStatus = newStatus;
      if (eventType === 'DISTRIBUTOR_RECEIVED') {
        if (qty !== selectedReturn.quantity_expected) {
          finalStatus = 'DISPUTE';
        }
      }

      const { error: updateError } = await supabase
        .from('returns')
        .update({ 
          status: finalStatus,
          ...(eventType === 'DISTRIBUTOR_RECEIVED' && { quantity_received_dist: qty }),
          ...(eventType === 'MANUFACTURER_RECEIVED' && { quantity_received_mfr: qty })
        })
        .eq('id', selectedReturn.id);

      if (updateError) throw updateError;

      const { error: eventError } = await supabase
        .from('return_events')
        .insert({
          return_id: selectedReturn.id,
          event_type: finalStatus === 'DISPUTE' ? 'DISPUTE_RAISED' : eventType,
          performed_by: profile.user_id,
          performed_role: profile.role,
          quantity: qty,
          notes: actionNotes
        });

      if (eventError) throw eventError;

      toast.success('Action recorded successfully.');
      
      const { data: refreshedReturn } = await supabase.from('returns').select('*').eq('id', selectedReturn.id).single();
      if (refreshedReturn) {
        await loadReturnDetails(refreshedReturn);
        setReturns(prev => prev.map(r => r.id === refreshedReturn.id ? refreshedReturn : r));
      }

    } catch (err: any) {
      toast.error('Failed to process action: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'CLOSED') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'DISPUTE') return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  if (loading) return <div className="p-8 text-slate-500">Loading tracking system...</div>;

  if (selectedReturn) {
    const r = selectedReturn;
    const isPharmacy = profile?.role === 'pharmacy';
    const isDistributor = profile?.role === 'distributor';
    const isManufacturer = profile?.role === 'manufacturer';

    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setSelectedReturn(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{r.tracking_id}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(r.status)}`}>
                {r.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-500 font-medium">Unified Return Lifecycle Tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <Package size={32} className="text-emerald-400 mb-4" />
              <h2 className="text-2xl font-bold mb-1">{r.medicine_name}</h2>
              <p className="text-emerald-400 font-mono mb-6">Batch: {r.batch_number}</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Expected Quantity</p>
                  <p className="text-lg font-medium">{r.quantity_expected} Tablets</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Return Reason</p>
                  <p className="text-lg font-medium">{r.return_reason}</p>
                </div>
              </div>
            </div>

            {r.status !== 'CLOSED' && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" />
                  Manual Confirmation
                </h3>

                {(isDistributor || isManufacturer) && r.status !== 'DISPUTE' && (
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Confirmed Quantity</label>
                      <input 
                        type="number" 
                        value={actionQuantity}
                        onChange={e => setActionQuantity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 font-mono text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Notes / Evidence (Optional)</label>
                      <textarea 
                        value={actionNotes}
                        onChange={e => setActionNotes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm h-20"
                        placeholder="Condition of package, etc."
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {isDistributor && r.status === 'INITIATED' && (
                    <button onClick={() => handleAction('RECEIVED_BY_DISTRIBUTOR', 'DISTRIBUTOR_RECEIVED')} disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <CheckCircle size={20} /> CONFIRM RECEIVED
                    </button>
                  )}
                  {isDistributor && r.status === 'DISPUTE' && (
                    <button onClick={() => handleAction('FORWARDED_TO_MANUFACTURER', 'DISPUTE_RESOLVED_FORWARDED')} disabled={actionLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <CheckCircle size={20} /> OVERRIDE & FORWARD
                    </button>
                  )}
                  {isDistributor && r.status === 'RECEIVED_BY_DISTRIBUTOR' && (
                    <button onClick={() => handleAction('FORWARDED_TO_MANUFACTURER', 'FORWARDED_TO_MANUFACTURER')} disabled={actionLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Truck size={20} /> FORWARD TO MANUFACTURER
                    </button>
                  )}

                  {isManufacturer && r.status === 'FORWARDED_TO_MANUFACTURER' && (
                    <button onClick={() => handleAction('RECEIVED_BY_MANUFACTURER', 'MANUFACTURER_RECEIVED')} disabled={actionLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <CheckCircle size={20} /> CONFIRM RECEIVED
                    </button>
                  )}
                  {isManufacturer && r.status === 'RECEIVED_BY_MANUFACTURER' && (
                    <button onClick={() => handleAction('SENT_FOR_DESTRUCTION', 'SENT_FOR_DESTRUCTION')} disabled={actionLoading} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <ShieldAlert size={20} /> MARK FOR DESTRUCTION
                    </button>
                  )}
                  {isManufacturer && r.status === 'SENT_FOR_DESTRUCTION' && (
                    <button onClick={() => handleAction('DESTROYED', 'DESTROYED')} disabled={actionLoading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Trash2 size={20} /> COMPLETE DESTRUCTION
                    </button>
                  )}
                  {isManufacturer && r.status === 'DESTROYED' && (
                    <button onClick={() => handleAction('CLOSED', 'CLOSED')} disabled={actionLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                      <Download size={20} /> UPLOAD CERTIFICATE & CLOSE
                    </button>
                  )}

                  {isPharmacy && (
                    <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <Clock className="mx-auto text-slate-400 mb-2" size={24} />
                      <p className="text-sm font-medium text-slate-500">Awaiting processing by downstream partners.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Lifecycle Timeline</h2>
              <ReturnTimeline status={r.status} events={events} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Return Control Tower</h1>
          <p className="text-slate-500 mb-4">Unified tracking for expired medicine reverse logistics.</p>
          {profile?.role === 'pharmacy' && (
            <button onClick={() => navigate('/pharmacy/create-return')} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all">
              <Plus size={18} /> Initiate New Return
            </button>
          )}
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search Tracking ID..." className="outline-none bg-transparent text-sm w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {returns.map(ret => (
          <div key={ret.id} onClick={() => loadReturnDetails(ret)} className="bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-20 transition-transform group-hover:scale-150 ${getStatusColor(ret.status)}`} />
            
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(ret.status)}`}>
                {ret.status.replace(/_/g, ' ')}
              </span>
            </div>
            
            <h3 className="font-mono font-bold text-lg text-slate-900 mb-1 tracking-tight">{ret.tracking_id}</h3>
            <p className="font-medium text-slate-700">{ret.medicine_name}</p>
            <p className="text-xs text-slate-500 font-mono mb-4">Batch: {ret.batch_number}</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Expected Qty</p>
                <p className="font-medium text-slate-700">{ret.quantity_expected} units</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Created</p>
                <p className="font-medium text-slate-700">{new Date(ret.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}

        {returns.length === 0 && (
          <div className="col-span-full bg-slate-50 border border-slate-200 rounded-3xl p-16 text-center">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Returns Found</h3>
            <p className="text-slate-500">There are no return records in your custody pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnTracking;
