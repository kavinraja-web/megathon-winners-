export interface Product {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  category: string;
  barcode: string;
}

export interface BatchRecord {
  id: string;
  productId: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  mrp: number;
  purchasePrice: number;
  sellingPrice: number;
  supplier: string;
  status: string; // ACTIVE, NEAR_EXPIRY, CRITICAL, EXPIRED, PERMANENTLY_CLOSED
}

export interface BillItem {
  productId: string;
  batchId: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  total: number;
  expiryDate: string;
}

export interface BillRecord {
  id: string;
  billNumber: string;
  date: string;
  items: BillItem[];
  total: number;
  status: string;
}

export interface ReverseChainRecord {
  id: string;
  batchId: string;
  batchNumber: string;
  product: string;
  quantity: number;
  pharmacy: string;
  status: string;
}

export interface DestructionRecord {
  batchId: string;
  batchNumber: string;
  product: string;
  quantity: number;
  destructionDate: string;
  destructionFacility: string;
  certificateNumber: string;
  status: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Paracetamol 500mg', genericName: 'Paracetamol', manufacturer: 'ABC Pharma', category: 'Tablet', barcode: '8901234567890' },
  { id: 'P002', name: 'Azithromycin 500mg', genericName: 'Azithromycin', manufacturer: 'MediCare Labs', category: 'Tablet', barcode: '8901234567891' },
  { id: 'P003', name: 'Cetirizine 10mg', genericName: 'Cetirizine', manufacturer: 'HealthFirst Pharma', category: 'Tablet', barcode: '8901234567892' }
];

const INITIAL_BATCHES: BatchRecord[] = [
  { id: 'B001', productId: 'P001', batchNumber: 'PCM2026A', manufacturingDate: '2026-01-15', expiryDate: '2026-09-15', quantity: 4, mrp: 50, purchasePrice: 35, sellingPrice: 48, supplier: 'ABC Pharma Distributors', status: 'ACTIVE' },
  { id: 'B002', productId: 'P001', batchNumber: 'PCM2025X', manufacturingDate: '2025-08-10', expiryDate: '2026-09-05', quantity: 3, mrp: 50, purchasePrice: 34, sellingPrice: 47, supplier: 'ABC Pharma Distributors', status: 'EXPIRED' },
  { id: 'B003', productId: 'P002', batchNumber: 'AZM2026B', manufacturingDate: '2026-02-20', expiryDate: '2027-02-20', quantity: 20, mrp: 120, purchasePrice: 85, sellingPrice: 110, supplier: 'MediCare Distribution', status: 'ACTIVE' },
  { id: 'B004', productId: 'P003', batchNumber: 'CTZ2026C', manufacturingDate: '2026-03-10', expiryDate: '2026-10-01', quantity: 10, mrp: 40, purchasePrice: 25, sellingPrice: 36, supplier: 'HealthFirst Distributors', status: 'NEAR_EXPIRY' },
  { id: 'B005', productId: 'P001', batchNumber: 'OLD2025Z', manufacturingDate: '2025-01-10', expiryDate: '2026-01-10', quantity: 15, mrp: 50, purchasePrice: 34, sellingPrice: 47, supplier: 'ABC Pharma Distributors', status: 'PERMANENTLY_CLOSED' }
];

const INITIAL_DESTRUCTION_RECORDS: DestructionRecord[] = [
  { batchId: 'B005', batchNumber: 'OLD2025Z', product: 'Paracetamol 500mg', quantity: 15, destructionDate: '2026-08-20', destructionFacility: 'Authorized Biomedical Waste Facility', certificateNumber: 'DC-2026-00891', status: 'PERMANENTLY_CLOSED' }
];

export const initDB = () => {
  if (!localStorage.getItem('PHARMAX_PRODUCTS')) {
    localStorage.setItem('PHARMAX_PRODUCTS', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('PHARMAX_BATCHES')) {
    localStorage.setItem('PHARMAX_BATCHES', JSON.stringify(INITIAL_BATCHES));
  }
  if (!localStorage.getItem('PHARMAX_BILLS')) {
    localStorage.setItem('PHARMAX_BILLS', JSON.stringify([]));
  }
  if (!localStorage.getItem('PHARMAX_REVERSE_CHAIN')) {
    localStorage.setItem('PHARMAX_REVERSE_CHAIN', JSON.stringify([]));
  }
  if (!localStorage.getItem('PHARMAX_DESTRUCTION_RECORDS')) {
    localStorage.setItem('PHARMAX_DESTRUCTION_RECORDS', JSON.stringify(INITIAL_DESTRUCTION_RECORDS));
  }
};

export const resetDB = () => {
  localStorage.setItem('PHARMAX_PRODUCTS', JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem('PHARMAX_BATCHES', JSON.stringify(INITIAL_BATCHES));
  localStorage.setItem('PHARMAX_BILLS', JSON.stringify([]));
  localStorage.setItem('PHARMAX_REVERSE_CHAIN', JSON.stringify([]));
  localStorage.setItem('PHARMAX_DESTRUCTION_RECORDS', JSON.stringify(INITIAL_DESTRUCTION_RECORDS));
};

export const getProducts = (): Product[] => JSON.parse(localStorage.getItem('PHARMAX_PRODUCTS') || '[]');
export const getBatches = (): BatchRecord[] => JSON.parse(localStorage.getItem('PHARMAX_BATCHES') || '[]');
export const getBills = (): BillRecord[] => JSON.parse(localStorage.getItem('PHARMAX_BILLS') || '[]');
export const getReverseChain = (): ReverseChainRecord[] => JSON.parse(localStorage.getItem('PHARMAX_REVERSE_CHAIN') || '[]');
export const getDestructionRecords = (): DestructionRecord[] => JSON.parse(localStorage.getItem('PHARMAX_DESTRUCTION_RECORDS') || '[]');

export const saveBatches = (batches: BatchRecord[]) => localStorage.setItem('PHARMAX_BATCHES', JSON.stringify(batches));
export const saveBills = (bills: BillRecord[]) => localStorage.setItem('PHARMAX_BILLS', JSON.stringify(bills));
export const saveReverseChain = (records: ReverseChainRecord[]) => localStorage.setItem('PHARMAX_REVERSE_CHAIN', JSON.stringify(records));
