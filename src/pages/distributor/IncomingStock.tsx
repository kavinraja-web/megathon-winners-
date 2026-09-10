import React from 'react';
import { Package, Search, Filter, ArrowDownToLine, Clock } from 'lucide-react';

const mockStock = [
  { id: 'SHP-9001', mfr: 'ABC Pharma', date: '2023-11-10', items: 5000, status: 'Received', value: '₹4,50,000' },
  { id: 'SHP-9002', mfr: 'XYZ Pharmaceuticals', date: '2023-11-12', items: 12000, status: 'In Transit', value: '₹12,80,000' },
  { id: 'SHP-9003', mfr: 'HealthPlus Inc', date: '2023-11-14', items: 3500, status: 'Pending QA', value: '₹3,15,000' },
  { id: 'SHP-9004', mfr: 'ABC Pharma', date: '2023-11-15', items: 8000, status: 'Received', value: '₹7,20,000' },
];

const IncomingStock = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Incoming Stock</h2>
          <p className="text-slate-500 text-sm">Manage shipments received from manufacturers.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <ArrowDownToLine size={16} />
          Receive New Shipment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-slate-50">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 w-full md:w-80">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search shipment ID, manufacturer..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Shipment ID</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Units</th>
                <th className="px-6 py-4">Estimated Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStock.map((stock) => (
                <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold font-mono text-slate-900">{stock.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{stock.mfr}</td>
                  <td className="px-6 py-4">{new Date(stock.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{stock.items.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{stock.value}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      stock.status === 'Received' ? 'bg-emerald-100 text-emerald-700' :
                      stock.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {stock.status === 'In Transit' && <Truck size={12} />}
                      {stock.status === 'Pending QA' && <Clock size={12} />}
                      {stock.status === 'Received' && <Package size={12} />}
                      {stock.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomingStock;
