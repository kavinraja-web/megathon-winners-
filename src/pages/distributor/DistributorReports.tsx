import React, { useState } from 'react';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { getBatches, getProducts } from '../../data/db';

const DistributorReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Combine batches with their corresponding products
  const products = getProducts();
  const allBatches = getBatches();
  
  // Mock data for pharmacy supplies based on active batches
  // In a real app, this would be a separate "Supplies" or "Dispatches" table in the DB
  const suppliedMedicines = allBatches.map(batch => {
    const product = products.find(p => p.id === batch.productId);
    
    // Generating some mock supply data to pharmacy locations
    const pharmacies = ['Apollo Pharmacy, Coimbatore', 'MedPlus, Chennai', 'City Meds, Madurai', 'Wellness Care, Salem'];
    const randomPharmacy = pharmacies[Math.floor(Math.random() * pharmacies.length)];
    
    // Generating random past dates for when it was supplied
    const supplyDate = new Date();
    supplyDate.setDate(supplyDate.getDate() - Math.floor(Math.random() * 30));
    
    return {
      id: `SUP-${batch.id}`,
      batchNumber: batch.batchNumber,
      medicineName: product ? product.name : 'Unknown Medicine',
      category: product ? product.category : 'N/A',
      quantitySupplied: Math.max(1, Math.floor(batch.quantity / 2)),
      pharmacy: randomPharmacy,
      date: supplyDate.toISOString().split('T')[0],
      status: Math.random() > 0.2 ? 'Delivered' : 'In Transit'
    };
  });

  const filteredReports = suppliedMedicines.filter(item => 
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Supply ID", "Date", "Medicine Name", "Batch Number", "Destination Pharmacy", "Quantity Supplied", "Status"];
    
    const csvRows = [
      headers.join(','), // Header row
      ...filteredReports.map(report => 
        [
          report.id,
          report.date,
          `"${report.medicineName}"`, // Enclose in quotes in case of commas
          report.batchNumber,
          `"${report.pharmacy}"`,
          report.quantitySupplied,
          report.status
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Supply_Reports_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Supply Reports</h2>
          <p className="text-slate-500">Track and report all medicines dispatched to pharmacies.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by medicine, pharmacy, or batch..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Supply ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Medicine & Batch</th>
                <th className="p-4 font-semibold">Destination Pharmacy</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-900">{report.id}</td>
                  <td className="p-4 text-sm text-slate-600">{report.date}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-900">{report.medicineName}</p>
                    <p className="text-xs text-slate-500">Batch: {report.batchNumber}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-700">{report.pharmacy}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{report.quantitySupplied}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>No supply records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DistributorReports;
