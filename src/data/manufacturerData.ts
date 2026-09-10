export type MfrBatchStatus = 'ACTIVE' | 'NEAR EXPIRY' | 'EXPIRED' | 'FULLY DISTRIBUTED';

export interface ManufacturerBatch {
  id: string; // Internal ID
  tabletId: string;
  tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: string;
  medicineName: string;
  genericName: string;
  type: string;
  strength: string;
  mfgDate: string;
  expDate: string;
  mrp: number;
  manufacturer: string;
  mfgQuantity: number;
  distributedQuantity: number;
  remainingQuantity: number;
  status: MfrBatchStatus;
}

export const initialMfrBatches: ManufacturerBatch[] = [
  {
    id: 'MED-000101',
    tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: 'PCT-24051',
    medicineName: 'Paracetamol',
    genericName: 'Acetaminophen',
    type: 'Tablet',
    strength: '500mg',
    mfgDate: '2025-10-01',
    expDate: '2027-10-01',
    mrp: 25,
    mfgQuantity: 10000,
    distributedQuantity: 7500,
    remainingQuantity: 2500,
    status: 'ACTIVE',
  },
  {
    id: 'MED-000102',
    tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: 'AMX-24031',
    medicineName: 'Amoxicillin',
    genericName: 'Amoxicillin Trihydrate',
    type: 'Capsule',
    strength: '500mg',
    mfgDate: '2025-08-15',
    expDate: '2027-08-15',
    mrp: 120,
    mfgQuantity: 5000,
    distributedQuantity: 5000,
    remainingQuantity: 0,
    status: 'FULLY DISTRIBUTED',
  },
  {
    id: 'MED-000103',
    tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: 'CET-23102',
    medicineName: 'Cetirizine',
    genericName: 'Cetirizine Hydrochloride',
    type: 'Tablet',
    strength: '10mg',
    mfgDate: '2023-10-01',
    expDate: '2025-10-01',
    mrp: 35,
    mfgQuantity: 20000,
    distributedQuantity: 19500,
    remainingQuantity: 500,
    status: 'EXPIRED',
  },
  {
    id: 'MED-000104',
    tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: 'AZI-24091',
    medicineName: 'Azithromycin',
    genericName: 'Azithromycin Dihydrate',
    type: 'Tablet',
    strength: '500mg',
    mfgDate: '2024-10-15',
    expDate: '2026-10-15', // Near expiry depending on current date, let's set to near future
    mrp: 110,
    mfgQuantity: 8000,
    distributedQuantity: 4000,
    remainingQuantity: 4000,
    status: 'NEAR EXPIRY',
  },
  {
    id: 'MED-000105',
    tabletId: "TAB-000000",
    manufacturer: "ABC Pharmaceuticals Ltd.",
    batchNumber: 'IBU-25011',
    medicineName: 'Ibuprofen',
    genericName: 'Ibuprofen',
    type: 'Tablet',
    strength: '400mg',
    mfgDate: '2025-01-10',
    expDate: '2028-01-10',
    mrp: 45,
    mfgQuantity: 15000,
    distributedQuantity: 2000,
    remainingQuantity: 13000,
    status: 'ACTIVE',
  }
];

export const updateBatchesBasedOnDate = (batches: ManufacturerBatch[]) => {
  const now = new Date();
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(now.getDate() + 90);

  return batches.map(batch => {
    const expDate = new Date(batch.expDate);
    if (batch.remainingQuantity === 0) {
      return { ...batch, status: 'FULLY DISTRIBUTED' as MfrBatchStatus };
    }
    if (expDate < now) {
      return { ...batch, status: 'EXPIRED' as MfrBatchStatus };
    }
    if (expDate <= ninetyDaysFromNow) {
      return { ...batch, status: 'NEAR EXPIRY' as MfrBatchStatus };
    }
    return { ...batch, status: 'ACTIVE' as MfrBatchStatus };
  });
};

