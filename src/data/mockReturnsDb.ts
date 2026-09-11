import { ReturnEvent } from '../components/ReturnTimeline';

export interface ReturnRecord {
  id: string;
  tracking_id: string;
  medicine_name: string;
  batch_number: string;
  tablet_id: string;
  quantity_expected: number;
  quantity_received_dist?: number;
  quantity_received_mfr?: number;
  pharmacy_id: string;
  distributor_id: string | null;
  manufacturer_id: string | null;
  return_reason: string;
  status: string;
  created_at: string;
}

export interface ReturnEventRecord extends ReturnEvent {
  id: string;
  return_id: string;
}

export const getLocalReturns = (): ReturnRecord[] => {
  return JSON.parse(localStorage.getItem('PHARMAX_LOCAL_RETURNS') || '[]');
};

export const saveLocalReturns = (returns: ReturnRecord[]) => {
  localStorage.setItem('PHARMAX_LOCAL_RETURNS', JSON.stringify(returns));
};

export const getLocalReturnEvents = (): ReturnEventRecord[] => {
  return JSON.parse(localStorage.getItem('PHARMAX_LOCAL_RETURN_EVENTS') || '[]');
};

export const saveLocalReturnEvents = (events: ReturnEventRecord[]) => {
  localStorage.setItem('PHARMAX_LOCAL_RETURN_EVENTS', JSON.stringify(events));
};

export const createLocalReturn = (ret: Partial<ReturnRecord>): ReturnRecord => {
  const newReturn = {
    ...ret,
    id: 'ret-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  } as ReturnRecord;
  const all = getLocalReturns();
  saveLocalReturns([newReturn, ...all]);
  return newReturn;
};

export const updateLocalReturn = (id: string, updates: Partial<ReturnRecord>): ReturnRecord | null => {
  const all = getLocalReturns();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  
  all[idx] = { ...all[idx], ...updates };
  saveLocalReturns(all);
  return all[idx];
};

export const createLocalReturnEvent = (evt: Partial<ReturnEventRecord>): ReturnEventRecord => {
  const newEvent = {
    ...evt,
    id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  } as ReturnEventRecord;
  const all = getLocalReturnEvents();
  saveLocalReturnEvents([newEvent, ...all]);
  return newEvent;
};
