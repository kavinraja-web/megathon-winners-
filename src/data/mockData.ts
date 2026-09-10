export type Role = 'Manufacturer' | 'Distributor' | 'Pharmacy';

export type BatchStatus = 'Active' | 'Near Expiry' | 'Expired' | 'Return Requested' | 'In Transit' | 'Verified' | 'Awaiting Destruction' | 'Destroyed';

export interface Batch {
  id: string;
  name: string;
  manufacturer: string;
  mfgDate: string;
  expDate: string;
  mrp: number;
  quantity: number;
  location: string;
  status: BatchStatus;
  lastUpdated: string;
}

export let mockBatches: Batch[] = [
  { id: 'B12345', name: 'Paracetamol 500mg', manufacturer: 'Sun Pharma', mfgDate: '2025-01-01', expDate: '2027-01-01', mrp: Math.floor(Math.random() * 500) + 50, quantity: 5000, location: 'Chennai Distributor', status: 'Active', lastUpdated: '2026-04-10' },
  { id: 'B12346', name: 'Amoxicillin 250mg', manufacturer: 'Cipla', mfgDate: '2024-06-15', expDate: '2026-06-15', mrp: Math.floor(Math.random() * 500) + 50, quantity: 2000, location: 'Apollo Pharmacy, Coimbatore', status: 'Active', lastUpdated: '2026-04-12' },
  { id: 'B12347', name: 'Ibuprofen 400mg', manufacturer: 'Dr. Reddy\'s', mfgDate: '2023-04-20', expDate: '2025-04-20', mrp: Math.floor(Math.random() * 500) + 50, quantity: 500, location: 'Madurai Distributor', status: 'Expired', lastUpdated: '2025-04-21' },
  { id: 'B12348', name: 'Cetirizine 10mg', manufacturer: 'Lupin', mfgDate: '2024-05-10', expDate: '2026-05-10', mrp: Math.floor(Math.random() * 500) + 50, quantity: 1500, location: 'MedPlus, Bengaluru', status: 'Near Expiry', lastUpdated: '2026-04-14' },
  { id: 'B12349', name: 'Azithromycin 500mg', manufacturer: 'Mankind', mfgDate: '2023-11-05', expDate: '2025-11-05', mrp: Math.floor(Math.random() * 500) + 50, quantity: 300, location: 'Hyderabad Distributor', status: 'Return Requested', lastUpdated: '2026-04-15' },
  { id: 'B12350', name: 'Vitamin C 500mg', manufacturer: 'Abbott', mfgDate: '2025-02-14', expDate: '2027-02-14', mrp: Math.floor(Math.random() * 500) + 50, quantity: 10000, location: 'Mumbai Central Warehouse', status: 'Active', lastUpdated: '2026-03-01' },
  { id: 'B12351', name: 'Omeprazole 20mg', manufacturer: 'Sun Pharma', mfgDate: '2023-01-10', expDate: '2025-01-10', mrp: Math.floor(Math.random() * 500) + 50, quantity: 1200, location: 'Safe Disposal Facility, Chennai', status: 'Destroyed', lastUpdated: '2025-02-15' },
  { id: 'B12352', name: 'Metformin 500mg', manufacturer: 'Cipla', mfgDate: '2024-08-20', expDate: '2026-08-20', mrp: Math.floor(Math.random() * 500) + 50, quantity: 4500, location: 'In Transit', status: 'In Transit', lastUpdated: '2026-04-16' },
  { id: 'B12353', name: 'Pantoprazole 40mg', manufacturer: 'Dr. Reddy\'s', mfgDate: '2024-01-05', expDate: '2026-01-05', mrp: Math.floor(Math.random() * 500) + 50, quantity: 2500, location: 'Kochi Distributor', status: 'Active', lastUpdated: '2026-02-28' },
  { id: 'B12354', name: 'Dolo 650mg', manufacturer: 'Micro Labs', mfgDate: '2025-03-01', expDate: '2028-03-01', mrp: Math.floor(Math.random() * 500) + 50, quantity: 20000, location: 'Chennai Distributor', status: 'Active', lastUpdated: '2026-04-01' },
  { id: 'B12355', name: 'Cough Syrup 100ml', manufacturer: 'Himalaya', mfgDate: '2023-05-15', expDate: '2025-05-15', mrp: Math.floor(Math.random() * 500) + 50, quantity: 800, location: 'Manufacturer Warehouse', status: 'Awaiting Destruction', lastUpdated: '2026-04-10' },
  { id: 'B12356', name: 'Aspirin 75mg', manufacturer: 'Bayer', mfgDate: '2024-02-10', expDate: '2026-02-10', mrp: Math.floor(Math.random() * 500) + 50, quantity: 3000, location: 'Pune Pharmacy', status: 'Active', lastUpdated: '2026-03-15' },
  { id: 'B12357', name: 'Levocetirizine 5mg', manufacturer: 'Sun Pharma', mfgDate: '2023-12-01', expDate: '2025-12-01', mrp: Math.floor(Math.random() * 500) + 50, quantity: 600, location: 'Delhi Distributor', status: 'Near Expiry', lastUpdated: '2026-04-15' },
  { id: 'B12358', name: 'Diclofenac 50mg', manufacturer: 'Novartis', mfgDate: '2023-06-20', expDate: '2025-06-20', mrp: Math.floor(Math.random() * 500) + 50, quantity: 150, location: 'Authorized Facility', status: 'Destroyed', lastUpdated: '2025-07-10' },
  { id: 'B12359', name: 'Ranitidine 150mg', manufacturer: 'GSK', mfgDate: '2023-09-10', expDate: '2025-09-10', mrp: Math.floor(Math.random() * 500) + 50, quantity: 1000, location: 'Recall Center', status: 'Verified', lastUpdated: '2026-04-12' },
  { id: 'B12360', name: 'Ciprofloxacin 500mg', manufacturer: 'Bayer', mfgDate: '2024-04-05', expDate: '2027-04-05', mrp: Math.floor(Math.random() * 500) + 50, quantity: 4000, location: 'Lucknow Distributor', status: 'Active', lastUpdated: '2026-01-20' },
  { id: 'B12361', name: 'Amlodipine 5mg', manufacturer: 'Pfizer', mfgDate: '2024-07-15', expDate: '2026-07-15', mrp: Math.floor(Math.random() * 500) + 50, quantity: 5500, location: 'Ahmedabad Pharmacy', status: 'Active', lastUpdated: '2026-03-25' },
  { id: 'B12362', name: 'Atorvastatin 10mg', manufacturer: 'Zydus', mfgDate: '2023-08-01', expDate: '2025-08-01', mrp: Math.floor(Math.random() * 500) + 50, quantity: 200, location: 'In Transit', status: 'In Transit', lastUpdated: '2026-04-16' },
  { id: 'B12363', name: 'Montelukast 10mg', manufacturer: 'Cipla', mfgDate: '2024-10-10', expDate: '2026-10-10', mrp: Math.floor(Math.random() * 500) + 50, quantity: 1800, location: 'Jaipur Distributor', status: 'Active', lastUpdated: '2026-02-18' },
  { id: 'B12364', name: 'Losartan 50mg', manufacturer: 'Torrent', mfgDate: '2023-03-25', expDate: '2025-03-25', mrp: Math.floor(Math.random() * 500) + 50, quantity: 0, location: 'Authorized Facility', status: 'Destroyed', lastUpdated: '2025-05-05' },
];

export const mockNotifications = [
  { id: 1, type: 'alert', message: 'Batch B12348 expires in 25 days.', time: '2 hours ago' },
  { id: 2, type: 'logistics', message: 'Return pickup scheduled for B12349 at Hyderabad Distributor.', time: '5 hours ago' },
  { id: 3, type: 'success', message: 'Batch B12351 successfully destroyed. Certificate generated.', time: '1 day ago' },
  { id: 4, type: 'fraud', message: '🚨 Re-entry detected for Destroyed Batch B12351 at Chennai Pharmacy!', time: '10 mins ago' },
];

export const addBatch = (newBatch: Batch) => {
  mockBatches.unshift(newBatch);
};

export const updateBatchQuantity = (id: string, qtyToReduce: number) => {
  const batch = mockBatches.find(b => b.id === id);
  if (batch) {
    batch.quantity = Math.max(0, batch.quantity - qtyToReduce);
  }
};