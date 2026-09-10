import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Users, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export interface CustomerData {
  id: string;
  type: 'Distributor' | 'Pharmacy';
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
}

const AddCustomer = () => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mfr_customers');
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setCustomers([
        { id: 'CUST-001', type: 'Distributor', name: 'Global Pharma Distributors', contact: 'John Doe', email: 'john@globalpharma.com', phone: '+1 234 567 890', location: 'New York, USA' }
      ]);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('mfr_customers', JSON.stringify(customers));
    toast.success('Customer data saved successfully');
  };

  const addRow = () => {
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers([
      ...customers,
      { id: newId, type: 'Distributor', name: '', contact: '', email: '', phone: '', location: '' }
    ]);
  };

  const updateCell = (index: number, field: keyof CustomerData, value: string) => {
    const updated = [...customers];
    updated[index] = { ...updated[index], [field]: value };
    setCustomers(updated);
  };

  const removeRow = (index: number) => {
    const updated = customers.filter((_, i) => i !== index);
    setCustomers(updated);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users size={24} className="text-blue-600" />
            Add Customer
          </h1>
          <p className="text-slate-500">Manage distributors and direct pharmacies in a spreadsheet format.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Save size={18} /> Save Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-16 text-center">#</th>
                <th className="px-4 py-3 w-32">ID</th>
                <th className="px-4 py-3 w-40">Type</th>
                <th className="px-4 py-3 min-w-[200px]">Customer Name</th>
                <th className="px-4 py-3 min-w-[150px]">Contact Person</th>
                <th className="px-4 py-3 min-w-[200px]">Email</th>
                <th className="px-4 py-3 min-w-[150px]">Phone</th>
                <th className="px-4 py-3 min-w-[200px]">Location</th>
                <th className="px-4 py-3 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((cust, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2 text-center text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-2 font-mono text-xs text-slate-500">
                    {cust.id}
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {cust.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={cust.name} 
                      placeholder="e.g. Global Pharma"
                      onChange={(e) => updateCell(idx, 'name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-md px-3 py-1.5 outline-none shadow-sm transition-colors"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={cust.contact} 
                      placeholder="e.g. Jane Doe"
                      onChange={(e) => updateCell(idx, 'contact', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-md px-3 py-1.5 outline-none shadow-sm transition-colors"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={cust.email} 
                      placeholder="email@example.com"
                      onChange={(e) => updateCell(idx, 'email', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-md px-3 py-1.5 outline-none shadow-sm transition-colors"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={cust.phone} 
                      placeholder="+1 234 567 890"
                      onChange={(e) => updateCell(idx, 'phone', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-md px-3 py-1.5 outline-none shadow-sm transition-colors"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input 
                      type="text" 
                      value={cust.location} 
                      placeholder="City, Country"
                      onChange={(e) => updateCell(idx, 'location', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-md px-3 py-1.5 outline-none shadow-sm transition-colors"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={() => removeRow(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center">
          <button 
            onClick={addRow}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus size={16} /> Add New Row
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
