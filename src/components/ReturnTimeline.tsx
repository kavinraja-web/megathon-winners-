import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, PlayCircle, ShieldCheck, Truck, Factory, Trash2, XCircle } from 'lucide-react';

export interface ReturnEvent {
  event_type: string;
  performed_by_name: string;
  performed_role: string;
  quantity?: number;
  notes?: string;
  created_at: string;
}

interface TimelineProps {
  status: string;
  events: ReturnEvent[];
}

const TIMELINE_STEPS = [
  { key: 'INITIATED', label: 'Return Initiated', role: 'Pharmacy', icon: PlayCircle },
  { key: 'RECEIVED_BY_DISTRIBUTOR', label: 'Received by Distributor', role: 'Distributor', icon: Truck },
  { key: 'FORWARDED_TO_MANUFACTURER', label: 'Sent to Manufacturer', role: 'Distributor', icon: Truck },
  { key: 'RECEIVED_BY_MANUFACTURER', label: 'Received by Manufacturer', role: 'Manufacturer', icon: Factory },
  { key: 'SENT_FOR_DESTRUCTION', label: 'Sent for Destruction', role: 'Manufacturer', icon: Trash2 },
  { key: 'DESTROYED', label: 'Destruction Completed', role: 'Facility', icon: ShieldCheck },
  { key: 'CLOSED', label: 'Return Closed', role: 'System', icon: CheckCircle2 }
];

const getStatusIndex = (status: string) => {
  const currentIndex = TIMELINE_STEPS.findIndex(s => s.key === status);
  if (status === 'DISPUTE') return 1; // Between Init and Recv
  if (currentIndex === -1) return 0;
  return currentIndex;
};

export const ReturnTimeline: React.FC<TimelineProps> = ({ status, events }) => {
  const currentIndex = getStatusIndex(status);

  return (
    <div className="relative pl-8 space-y-12 py-4">
      <div className="absolute left-10 top-8 bottom-8 w-1 bg-slate-200 rounded-full" />
      
      {TIMELINE_STEPS.map((step, index) => {
        // Find matching event
        const matchingEvent = events.find(e => {
          if (step.key === 'INITIATED') return e.event_type === 'RETURN_INITIATED';
          if (step.key === 'RECEIVED_BY_DISTRIBUTOR') return e.event_type === 'DISTRIBUTOR_RECEIVED';
          if (step.key === 'FORWARDED_TO_MANUFACTURER') return e.event_type === 'FORWARDED_TO_MANUFACTURER';
          if (step.key === 'RECEIVED_BY_MANUFACTURER') return e.event_type === 'MANUFACTURER_RECEIVED';
          if (step.key === 'SENT_FOR_DESTRUCTION') return e.event_type === 'SENT_FOR_DESTRUCTION';
          if (step.key === 'DESTROYED') return e.event_type === 'DESTROYED';
          if (step.key === 'CLOSED') return e.event_type === 'CLOSED';
          return false;
        });

        // Determine state
        let state: 'completed' | 'current' | 'pending' | 'dispute' = 'pending';
        if (matchingEvent) state = 'completed';
        else if (index === currentIndex + 1 && status !== 'CLOSED') state = 'current';
        
        // Special case for dispute
        if (status === 'DISPUTE' && step.key === 'RECEIVED_BY_DISTRIBUTOR') {
          state = 'dispute';
        }

        const Icon = step.icon;

        return (
          <div key={step.key} className="relative z-10 flex gap-6">
            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center -ml-[22px] border-4 border-white shadow-sm transition-all duration-300 ${
              state === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-200' :
              state === 'current' ? 'bg-blue-500 text-white animate-pulse shadow-blue-200' :
              state === 'dispute' ? 'bg-orange-500 text-white shadow-orange-200' :
              'bg-slate-100 text-slate-400'
            }`}>
              {state === 'completed' ? <CheckCircle2 size={24} /> :
               state === 'dispute' ? <AlertTriangle size={24} /> :
               <Icon size={24} />
              }
            </div>

            <div className={`flex-1 pt-1.5 ${state === 'pending' ? 'opacity-50' : ''}`}>
              <h3 className={`text-lg font-bold ${
                state === 'completed' ? 'text-emerald-900' :
                state === 'current' ? 'text-blue-900' :
                state === 'dispute' ? 'text-orange-900' :
                'text-slate-500'
              }`}>
                {step.label}
              </h3>
              
              <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">
                Role: {step.role}
              </div>

              {matchingEvent ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mt-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Clock size={14} />
                    {new Date(matchingEvent.created_at).toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-700 font-medium">Confirmed by: <span className="text-slate-900 font-bold">{matchingEvent.performed_by_name}</span></p>
                  
                  {matchingEvent.quantity && (
                    <p className="text-sm text-slate-700 font-medium mt-1">Quantity processed: <span className="text-slate-900 font-bold">{matchingEvent.quantity}</span></p>
                  )}
                  
                  {matchingEvent.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 italic">
                      "{matchingEvent.notes}"
                    </div>
                  )}
                </div>
              ) : state === 'current' ? (
                <div className="text-sm font-medium text-blue-600 mt-2 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Awaiting Manual Confirmation
                </div>
              ) : state === 'dispute' ? (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm mt-3">
                   <div className="text-orange-800 font-bold flex items-center gap-2 mb-2">
                     <AlertTriangle size={18} />
                     QUANTITY DISCREPANCY DETECTED
                   </div>
                   <p className="text-orange-700 text-sm font-medium">The received quantity does not match the expected pharmacy return quantity. Resolution required.</p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
