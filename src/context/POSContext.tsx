import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  initDB, getProducts, getBatches, getBills, getReverseChain, 
  saveBatches, saveBills, saveReverseChain, saveProducts, resetDB,
  Product, BatchRecord, BillRecord, ReverseChainRecord, BillItem 
} from '../data/db';
import { differenceInDays, isBefore } from 'date-fns';
import toast from 'react-hot-toast';

interface POSContextType {
  products: Product[];
  batches: BatchRecord[];
  bills: BillRecord[];
  currentBill: BillItem[];
  addToBill: (batch: BatchRecord, product: Product, quantity: number) => boolean;
  removeFromBill: (batchId: string) => void;
  updateQuantity: (batchId: string, quantity: number) => void;
  clearBill: () => void;
  generateBill: () => BillRecord | null;
  checkExpiryStatus: (expiryDate: string) => string;
  calculateDaysRemaining: (expiryDate: string) => number;
  findProductByBarcode: (barcode: string) => Product | undefined;
  getBatchesForProduct: (productId: string) => BatchRecord[];
  createReturnRequest: (batch: BatchRecord, product: Product) => void;
  addInventoryItem: (productData: Partial<Product>, batchData: Partial<BatchRecord>) => { product: Product, batch: BatchRecord };
  resetDemoData: () => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<BatchRecord[]>([]);
  const [bills, setBills] = useState<BillRecord[]>([]);
  const [currentBill, setCurrentBill] = useState<BillItem[]>([]);

  const loadData = () => {
    initDB();
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
    
    // Calculate fresh status for active batches
    const rawBatches = getBatches();
    const reverseChain = getReverseChain();
    let madeChanges = false;
    let autoReturns = 0;
    
    const updatedBatches = rawBatches.map(b => {
      if (b.status === 'PERMANENTLY_CLOSED' || b.status === 'RETURN_REQUESTED') return b;
      
      const newStatus = calculateExpiryStatus(b.expiryDate);
      if (newStatus === 'EXPIRED') {
        // Automatically create return request
        const product = loadedProducts.find(p => p.id === b.productId);
        if (product) {
          const newRecord: ReverseChainRecord = {
            id: `RC${String(Date.now()).slice(-4)}-AUTO`,
            batchId: b.id,
            batchNumber: b.batchNumber,
            product: product.name,
            quantity: b.quantity,
            pharmacy: 'PharmaX Demo Pharmacy',
            status: 'RETURN_REQUESTED'
          };
          reverseChain.push(newRecord);
          madeChanges = true;
          autoReturns++;
          return { ...b, status: 'RETURN_REQUESTED' };
        }
      }
      return { ...b, status: newStatus };
    });

    if (madeChanges) {
      saveReverseChain(reverseChain);
      saveBatches(updatedBatches);
    }

    setBatches(updatedBatches);
    setBills(getBills());
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetDemoData = () => {
    resetDB();
    loadData();
    setCurrentBill([]);
    toast.success('Demo data reset successfully.');
  };

  const calculateDaysRemaining = (expiryDate: string): number => {
    return differenceInDays(new Date(expiryDate), new Date());
  };

  const calculateExpiryStatus = (expiryDate: string): string => {
    const days = calculateDaysRemaining(expiryDate);
    if (days < 0) return 'EXPIRED';
    if (days <= 30) return 'CRITICAL';
    if (days <= 90) return 'NEAR_EXPIRY';
    return 'ACTIVE';
  };

  const findProductByBarcode = (barcode: string) => {
    return products.find(p => p.barcode === barcode);
  };

  const getBatchesForProduct = (productId: string) => {
    const productBatches = batches.filter(b => b.productId === productId);
    // Sort by FEFO (First Expiry First Out)
    return productBatches.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  };

  const validateBatchForSale = (batch: BatchRecord, requestedQty: number) => {
    if (batch.status === 'PERMANENTLY_CLOSED') {
      toast.error(`🚨 RE-ENTRY FRAUD DETECTED\nBatch: ${batch.batchNumber}\nThis batch was previously recorded as destroyed and must not re-enter the pharmaceutical supply chain.`, { duration: 6000 });
      return false;
    }
    if (batch.status === 'EXPIRED' || batch.status === 'RETURN_REQUESTED') {
      toast.error('⚠️ This medicine batch has expired or was automatically returned and cannot be sold.');
      return false;
    }
    if (batch.quantity === 0) {
      toast.error('Out of stock.');
      return false;
    }
    
    const existingInCart = currentBill.find(i => i.batchId === batch.id)?.quantity || 0;
    if (requestedQty + existingInCart > batch.quantity) {
      toast.error(`Insufficient stock. Available quantity: ${batch.quantity - existingInCart}`);
      return false;
    }
    return true;
  };

  const addToBill = (batch: BatchRecord, product: Product, quantity: number) => {
    if (!validateBatchForSale(batch, quantity)) return false;

    setCurrentBill(prev => {
      const existing = prev.find(item => item.batchId === batch.id);
      if (existing) {
        return prev.map(item => item.batchId === batch.id 
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unitPrice }
          : item
        );
      }
      return [...prev, {
        productId: product.id,
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        productName: product.name,
        quantity,
        unitPrice: batch.sellingPrice,
        total: quantity * batch.sellingPrice,
        expiryDate: batch.expiryDate
      } as any]; // Extended BillItem to include productName for UI
    });
    
    toast.success('Added to bill');
    return true;
  };

  const removeFromBill = (batchId: string) => {
    setCurrentBill(prev => prev.filter(item => item.batchId !== batchId));
  };

  const updateQuantity = (batchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBill(batchId);
      return;
    }
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    if (quantity > batch.quantity) {
      toast.error(`Insufficient stock. Available quantity: ${batch.quantity}`);
      return;
    }

    setCurrentBill(prev => prev.map(item => 
      item.batchId === batchId 
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const clearBill = () => setCurrentBill([]);

  const generateBill = () => {
    if (currentBill.length === 0) return null;

    // Validate one last time
    for (const item of currentBill) {
      const batch = batches.find(b => b.id === item.batchId);
      if (!batch || batch.quantity < item.quantity || batch.status === 'EXPIRED' || batch.status === 'PERMANENTLY_CLOSED') {
        toast.error(`Validation failed for ${item.batchNumber}`);
        return null;
      }
    }

    const billNumber = `PHX-${String(bills.length + 1).padStart(4, '0')}`;
    const total = currentBill.reduce((sum, item) => sum + item.total, 0);

    const newBill: BillRecord = {
      id: `INV${String(Date.now()).slice(-6)}`,
      billNumber,
      date: new Date().toISOString(),
      items: [...currentBill],
      total,
      status: 'COMPLETED'
    };

    // Update stock ONLY after successful bill
    const updatedBatches = batches.map(batch => {
      const billedItem = currentBill.find(item => item.batchId === batch.id);
      if (billedItem) {
        return { ...batch, quantity: batch.quantity - billedItem.quantity };
      }
      return batch;
    });

    setBatches(updatedBatches);
    saveBatches(updatedBatches);
    
    const newBills = [newBill, ...bills];
    setBills(newBills);
    saveBills(newBills);
    
    setCurrentBill([]);
    toast.success('✅ BILL GENERATED');
    return newBill;
  };

  const createReturnRequest = (batch: BatchRecord, product: Product) => {
    const newRecord: ReverseChainRecord = {
      id: `RC${String(Date.now()).slice(-4)}`,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      product: product.name,
      quantity: batch.quantity,
      pharmacy: 'PharmaX Demo Pharmacy',
      status: 'RETURN_REQUESTED'
    };

    const reverseChain = getReverseChain();
    saveReverseChain([...reverseChain, newRecord]);

    const updatedBatches = batches.map(b => b.id === batch.id ? { ...b, status: 'RETURN_REQUESTED' } : b);
    setBatches(updatedBatches);
    saveBatches(updatedBatches);

    toast.success('Return Request Created Successfully');
  };

  const addInventoryItem = (productData: Partial<Product>, batchData: Partial<BatchRecord>) => {
    let product = products.find(p => p.name === productData.name || (productData.barcode && p.barcode === productData.barcode));
    
    let updatedProducts = [...products];
    if (!product) {
      product = {
        id: `P${String(Date.now()).slice(-4)}`,
        name: productData.name || 'Unknown',
        genericName: productData.genericName || 'Unknown',
        manufacturer: productData.manufacturer || 'Unknown',
        category: productData.category || 'Medicine',
        barcode: productData.barcode || `BC-${Date.now()}`
      };
      updatedProducts = [...products, product];
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }

    let initialStatus = calculateExpiryStatus(batchData.expiryDate || new Date().toISOString());
    let autoReturned = false;
    
    if (initialStatus === 'EXPIRED') {
      initialStatus = 'RETURN_REQUESTED';
      autoReturned = true;
    }

    const batch: BatchRecord = {
      id: `B${String(Date.now()).slice(-4)}`,
      productId: product.id,
      batchNumber: batchData.batchNumber || `BN-${Date.now()}`,
      manufacturingDate: batchData.manufacturingDate || new Date().toISOString(),
      expiryDate: batchData.expiryDate || new Date().toISOString(),
      quantity: batchData.quantity || 0,
      mrp: batchData.mrp || 0,
      purchasePrice: batchData.purchasePrice || 0,
      sellingPrice: batchData.sellingPrice || 0,
      supplier: batchData.supplier || 'Direct',
      status: initialStatus
    };

    const newBatches = [...batches, batch];
    setBatches(newBatches);
    saveBatches(newBatches);

    if (autoReturned) {
      const newRecord: ReverseChainRecord = {
        id: `RC${String(Date.now()).slice(-4)}-AUTO`,
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        product: product.name,
        quantity: batch.quantity,
        pharmacy: 'PharmaX Demo Pharmacy',
        status: 'RETURN_REQUESTED'
      };
      const reverseChain = getReverseChain();
      saveReverseChain([...reverseChain, newRecord]);
      toast.success('Product is already expired. Auto-returned to distributor.');
    } else {
      toast.success('Product and Batch added to inventory successfully');
    }
    
    return { product, batch };
  };

  return (
    <POSContext.Provider value={{
      products, batches, bills, currentBill,
      addToBill, removeFromBill, updateQuantity, clearBill, generateBill,
      checkExpiryStatus: calculateExpiryStatus, calculateDaysRemaining,
      findProductByBarcode, getBatchesForProduct, createReturnRequest, addInventoryItem, resetDemoData
    }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) throw new Error('usePOS must be used within POSProvider');
  return context;
};
