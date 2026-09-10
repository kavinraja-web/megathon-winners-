export const MOCK_MEDICINES = [
  {
    id: 'MED-001',
    name: 'Paracetamol 500mg',
    category: 'Analgesic',
    manufacturer: 'ABC Pharmaceuticals',
    totalBatches: 120,
    stock: 500000,
    status: 'ACTIVE'
  },
  {
    id: 'MED-002',
    name: 'Amoxicillin 500mg',
    category: 'Antibiotic',
    manufacturer: 'ABC Pharmaceuticals',
    totalBatches: 85,
    stock: 120000,
    status: 'ACTIVE'
  },
  {
    id: 'MED-003',
    name: 'Cetirizine 10mg',
    category: 'Antihistamine',
    manufacturer: 'ABC Pharmaceuticals',
    totalBatches: 137,
    stock: 800000,
    status: 'ACTIVE'
  }
];

export const MOCK_BATCHES = [
  // Valid demo batch
  {
    id: 'PHM-BATCH-00452',
    medicineId: 'MED-001',
    medicineName: 'Paracetamol 500mg',
    batchNumber: 'PCT-001',
    manufacturingDate: '2025-05-20',
    expiryDate: '2028-05-20',
    mrp: 25,
    quantity: 50000,
    remainingQuantity: 20000,
    status: 'ACTIVE',
    qrCode: 'PHM-BATCH-00452',
    manufacturer: 'ABC Pharmaceuticals'
  },
  // Expired demo batch
  {
    id: 'PHM-BATCH-00899',
    medicineId: 'MED-002',
    medicineName: 'Amoxicillin 500mg',
    batchNumber: 'AMX-002',
    manufacturingDate: '2023-09-01',
    expiryDate: '2026-09-01',
    mrp: 120,
    quantity: 10000,
    remainingQuantity: 500,
    status: 'EXPIRED',
    qrCode: 'PHM-BATCH-00899',
    manufacturer: 'ABC Pharmaceuticals'
  },
  // Valid demo batch 2
  {
    id: 'PHM-BATCH-00901',
    medicineId: 'MED-003',
    medicineName: 'Cetirizine 10mg',
    batchNumber: 'CTZ-003',
    manufacturingDate: '2025-12-15',
    expiryDate: '2027-12-15',
    mrp: 45,
    quantity: 20000,
    remainingQuantity: 15000,
    status: 'ACTIVE',
    qrCode: 'PHM-BATCH-00901',
    manufacturer: 'ABC Pharmaceuticals'
  }
];

export const MOCK_SALES = [
  {
    id: 'DIST-001',
    medicine: 'Paracetamol 500mg',
    batch: 'PCT-001',
    pharmacy: 'Apollo Pharmacy, Sector 12',
    quantity: 500,
    date: '2026-09-09',
    status: 'Delivered'
  },
  {
    id: 'DIST-002',
    medicine: 'Amoxicillin 500mg',
    batch: 'AMX-002',
    pharmacy: 'MedPlus, MG Road',
    quantity: 200,
    date: '2026-08-15',
    status: 'Delivered'
  }
];

export const MOCK_ALERTS = [
  { id: 1, type: 'warning', message: 'Batch PCT-00452 expires in 20 days.', date: '2 hours ago' },
  { id: 2, type: 'error', message: 'Batch AMX-002 has expired.', date: '1 day ago' },
  { id: 3, type: 'critical', message: 'Batch CTZ-001 has been recalled.', date: '2 days ago' },
  { id: 4, type: 'success', message: 'New pharmacy verification request.', date: '3 days ago' },
];
