import React, { useEffect, useState } from 'react';
import { getBatches, getProducts, BatchRecord, Product } from '../data/db';
import { AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExpiryNotificationBanner = () => {
  const [expiringBatches, setExpiringBatches] = useState<{batch: BatchRecord, product: Product | undefined, daysLeft: number}[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      const batches = getBatches();
      const products = getProducts();
      
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const alerts = batches
        .filter(b => b.status === 'ACTIVE' || b.status === 'NEAR_EXPIRY')
        .map(b => {
          const expDate = new Date(b.expiryDate);
          const timeDiff = expDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          return {
            batch: b,
            product: products.find(p => p.id === b.productId),
            daysLeft
          };
        })
        .filter(item => item.daysLeft > 0 && item.daysLeft <= 60)
        .sort((a, b) => a.daysLeft - b.daysLeft);

      setExpiringBatches(alerts);
    } catch (error) {
      console.error("Failed to load batches for notification", error);
    }
  }, []);

  if (!isVisible || expiringBatches.length === 0) return null;

  return (
    <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between shadow-md relative z-50">
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="animate-pulse text-orange-100" />
        <div className="text-sm font-medium">
          <strong>Attention:</strong> You have {expiringBatches.length} medicine batch{expiringBatches.length > 1 ? 'es' : ''} expiring soon. 
          <span className="hidden md:inline ml-1">
            Nearest expiry: {expiringBatches[0].product?.name || expiringBatches[0].batch.batchNumber} (in {expiringBatches[0].daysLeft} days).
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link 
          to="/app/expiry" 
          className="text-xs bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded border border-orange-400 transition-colors font-semibold"
        >
          View Details
        </Link>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-orange-200 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ExpiryNotificationBanner;
