import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddBatch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    genericName: '',
    type: 'Tablet',
    strength: '',
    mfgDate: '',
    expDate: '',
    mrp: '',
    mfgQuantity: '',
    description: ''
  });
  const [success, setSuccess] = useState('');
  const [newBatchId, setNewBatchId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate basics (browser handles required fields)
    const mDate = new Date(formData.mfgDate);
    const eDate = new Date(formData.expDate);
    if(eDate <= mDate) {
      alert("Expiry date must be after manufacturing date");
      return;
    }

    const generatedBatchId = `BATCH-${formData.medicineName.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 100000)}`;
    setNewBatchId(generatedBatchId);
    setSuccess('Medicine batch registered successfully.');
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white p-8 rounded-xl border border-emerald-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Save size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{success}</h2>
          <p className="text-slate-600 mb-6">Generated Batch Number: <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded">{newBatchId}</span></p>
          
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/manufacturer/batches')} className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
              View Batches
            </button>
            <button onClick={() => navigate(`/manufacturer/qr-generator?batch=${newBatchId}`)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Generate QR
            </button>
            <button onClick={() => { setSuccess(''); setFormData({...formData, medicineName: '', genericName: ''}); }} className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Medicine Batch</h1>
        <p className="text-slate-500">Register a new manufactured batch to the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Medicine Information</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Medicine Name *</label>
            <input required name="medicineName" value={formData.medicineName} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Paracetamol" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Generic Name</label>
            <input name="genericName" value={formData.genericName} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Acetaminophen" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dosage Form</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Tablet</option>
              <option>Capsule</option>
              <option>Syrup</option>
              <option>Injection</option>
              <option>Ointment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Strength</label>
            <input required name="strength" value={formData.strength} onChange={handleChange} type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 500mg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturing Date *</label>
            <input required name="mfgDate" value={formData.mfgDate} onChange={handleChange} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date *</label>
            <input required name="expDate" value={formData.expDate} onChange={handleChange} type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">MRP (₹) *</label>
            <input required name="mrp" value={formData.mrp} onChange={handleChange} type="number" min="0" step="0.01" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturing Quantity *</label>
            <input required name="mfgQuantity" value={formData.mfgQuantity} onChange={handleChange} type="number" min="1" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 10000" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Additional notes..."></textarea>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
          <button type="button" className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <Save size={18} /> Register Batch
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBatch;
