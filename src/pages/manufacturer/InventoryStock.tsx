import React, { useState, useEffect } from 'react';
import { getMfrBatches } from '../../data/manufacturerData';

const InventoryStock = () => {
  // Aggregate data by medicine
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    const agg: Record<string, any> = {};
    getMfrBatches().forEach(b => {
      const key = `${b.medicineName} ${b.strength}`;
      if (!agg[key]) {
        agg[key] = {
          name: key,
          mfgQuantity: 0,
          distributedQuantity: 0,
          remainingQuantity: 0,
          batches: 0
        };
      }
      agg[key].mfgQuantity += b.mfgQuantity;
      agg[key].distributedQuantity += b.distributedQuantity;
      agg[key].remainingQuantity += b.remainingQuantity;
      agg[key].batches += 1;
    });
    setInventory(Object.values(agg));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory & Stock</h1>
        <p className="text-slate-500">Monitor manufactured vs distributed quantities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {inventory.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.batches} active batches</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Manufactured</span>
                  <span className="font-semibold text-slate-900">{item.mfgQuantity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Distributed</span>
                  <span className="font-semibold text-indigo-600">{item.distributedQuantity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${(item.distributedQuantity / item.mfgQuantity) * 100}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-semibold text-emerald-600">{item.remainingQuantity.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(item.remainingQuantity / item.mfgQuantity) * 100}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryStock;
