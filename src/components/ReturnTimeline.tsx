import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, PlayCircle, ShieldCheck, Truck, Factory, Trash2, XCircle, Package } from 'lucide-react';

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
  { key: 'PENDING_MANUFACTURER_APPROVAL', label: 'Requested', role: 'Pharmacy', icon: PlayCircle },
  { key: 'APPROVED', label: 'Approved', role: 'Manufacturer', icon: CheckCircle2 },
  { key: 'PICKUP_ASSIGNED', label: 'Pickup Assigned', role: 'Distributor', icon: Truck },
  { key: 'PICKED_UP', label: 'Picked Up', role: 'Distributor', icon: Package },
  { key: 'IN_TRANSIT_TO_DISTRIBUTOR', label: 'In Transit to Hub', role: 'Distributor', icon: Truck },
  { key: 'DISTRIBUTOR_RECEIVED', label: 'Hub Received', role: 'Distributor', icon: Factory },
  { key: 'VERIFIED', label: 'Verified', role: 'Distributor', icon: ShieldCheck },
  { key: 'IN_TRANSIT_TO_MANUFACTURER', label: 'In Transit to Mfr', role: 'Distributor', icon: Truck },
  { key: 'MANUFACTURER_RECEIVED', label: 'Received by Mfr', role: 'Manufacturer', icon: Factory },
  { key: 'AWAITING_DESTRUCTION', label: 'Awaiting Destruction', role: 'Manufacturer', icon: Clock },
  { key: 'DESTROYED', label: 'Destroyed', role: 'Facility', icon: Trash2 },
  { key: 'CLOSED', label: 'Closed', role: 'System', icon: CheckCircle2 }
];

const getStatusIndex = (status: string) => {
  if (status === 'REJECTED') return 0;
  if (status === 'DISPUTED') return 5;
  const currentIndex = TIMELINE_STEPS.findIndex(s => s.key === status);
  if (currentIndex === -1) return 0;
  return currentIndex;
};

export const ReturnTimeline: React.FC<TimelineProps> = ({ status, events }) => {
  const currentIndex = getStatusIndex(status);

  return (
    <div className="relative pt-4">
      {TIMELINE_STEPS.map((step, index) => {
        // Find matching event for this specific step by mapping the event_types we dispatch to the timeline keys.
        // E.g. 'RETURN_REQUESTED' maps to 'PENDING_MANUFACTURER_APPROVAL'
        const matchingEvent = events.find(e => {
          if (step.key === 'PENDING_MANUFACTURER_APPROVAL' && e.event_type === 'RETURN_REQUESTED') return true;
          if (step.key === 'AWAITING_DESTRUCTION' && e.event_type === 'SENT_FOR_DESTRUCTION') return true;
          if (step.key === 'IN_TRANSIT_TO_MANUFACTURER' && e.event_type === 'DISPATCHED_TO_MANUFACTURER') return true;
          return e.event_type === step.key;
        });

        const isCompleted = index < currentIndex || (index === currentIndex && status === 'CLOSED');
        const isCurrent = index === currentIndex && status !== 'CLOSED';
        const isDispute = step.key === 'DISTRIBUTOR_RECEIVED' && status === 'DISPUTED';
        const isRejected = step.key === 'PENDING_MANUFACTURER_APPROVAL' && status === 'REJECTED';
        
        const state = isCompleted ? 'completed' : isDispute ? 'dispute' : isRejected ? 'rejected' : isCurrent ? 'current' : 'pending';
        const isLast = index === TIMELINE_STEPS.length - 1;

        const Icon = step.icon;

        return (
          <div key={step.key} className="relative z-10 flex gap-6">
            
            {/* Left Column: Icon and Dynamic Line */}
            <div className="flex flex-col items-center w-12">
              <div className={`relative z-10 w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 ${
                state === 'completed' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                state === 'current' ? 'bg-blue-500 text-white animate-pulse shadow-blue-200' :
                state === 'dispute' ? 'bg-orange-500 text-white shadow-orange-200' :
                state === 'rejected' ? 'bg-red-500 text-white shadow-red-200' :
                'bg-slate-100 text-slate-400'
              }`}>
                {state === 'completed' ? <CheckCircle2 size={24} /> : 
                 state === 'dispute' ? <AlertTriangle size={24} /> :
                 state === 'rejected' ? <XCircle size={24} /> :
                 <Icon size={24} />
                }
              </div>
              
              {/* The Dynamic Colored Connecting Line */}
              {!isLast && (
                <div className={`w-1 flex-1 my-1 rounded-full ${isCompleted || state === 'dispute' ? 'bg-emerald-500' : 'bg-slate-200'}`} style={{ minHeight: '3rem' }} />
              )}
            </div>

            {/* Right Column: Content */}
            <div className={`flex-1 pt-1.5 pb-8 ${state === 'pending' ? 'opacity-50' : ''}`}>
              <h3 className={`text-lg font-bold ${
                state === 'completed' ? 'text-emerald-900' :
                state === 'current' ? 'text-blue-900' :
                state === 'dispute' ? 'text-orange-900' :
                state === 'rejected' ? 'text-red-900' :
                'text-slate-500'
              }`}>
                {step.label} {state === 'rejected' && '- REJECTED'}
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
