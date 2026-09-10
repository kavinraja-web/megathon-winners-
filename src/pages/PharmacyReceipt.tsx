import React, { useState } from 'react';
import { Upload, Camera, FileText, CheckCircle, Loader2, Plus, RefreshCw, Save } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ExtractedRecord {
  serialNumber: string;
  medicineNumber: string;
  medicineName: string;
  quantity: string;
}

const PharmacyReceipt = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [records, setRecords] = useState<ExtractedRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setRecords([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceipt = async () => {
    if (!image) return;
    if (!apiKey) {
      setError('Please enter your Gemini API Key below to use the AI extraction feature.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const base64Data = image.split(',')[1];
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Analyze this pharmacy receipt or handwritten prescription/receipt.
        Extract the list of medicines. For each medicine, find or infer:
        - serialNumber (if missing, generate a short logical one like S01)
        - medicineNumber (if missing, infer or use a generic ID)
        - medicineName (exact name of the tablet/medicine)
        - quantity (the exact quantity)

        Return ONLY a raw JSON array of objects. Do not include markdown formatting like \`\`\`json.
        Example:
        [
          {
            "serialNumber": "1",
            "medicineNumber": "M101",
            "medicineName": "Paracetamol 500mg",
            "quantity": "20"
          }
        ]
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const text = result.response.text();
      try {
        const cleanedText = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
        const parsed = JSON.parse(cleanedText);
        setRecords(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (parseErr) {
        console.error('Failed to parse JSON:', text);
        setError('Failed to parse AI response perfectly. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during AI processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setRecords([]);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="text-emerald-500" /> Pharmacy Receipt Scanner
          </h2>
          <p className="text-slate-500">
            Upload or capture an image of a receipt to automatically extract medicine details.
          </p>
        </div>
        {records.length > 0 && (
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Save size={18} /> Save Records
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Camera size={18} className="text-slate-400" /> Image Source
            </h3>

            {!image ? (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                <Upload size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700 mb-1">Click to upload receipt</p>
                <p className="text-xs text-slate-500 mb-4">PNG, JPG up to 10MB</p>
                <label className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer transition-colors shadow-sm inline-block">
                  Choose File
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[3/4]">
                  <img src={image} alt="Receipt Preview" className="w-full h-full object-contain" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={clearImage}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear
                  </button>
                  <button 
                    onClick={processReceipt}
                    disabled={isProcessing}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {isProcessing ? 'Extracting...' : 'Extract Data'}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle size={18} className={records.length > 0 ? "text-emerald-500" : "text-slate-400"} /> 
                Extracted Records
              </h3>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {records.length} items
              </span>
            </div>

            <div className="flex-1 p-0 overflow-x-auto">
              {records.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[300px]">
                  <FileText size={48} className="text-slate-200 mb-4" />
                  <p>No data extracted yet.</p>
                  <p className="text-sm mt-1">Upload a receipt and click "Extract Data" to see results.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">S.No</th>
                      <th className="px-6 py-4">Medicine Number</th>
                      <th className="px-6 py-4">Medicine Name</th>
                      <th className="px-6 py-4 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500">{record.serialNumber}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{record.medicineNumber}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{record.medicineName}</td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600">{record.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            {records.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
                <span>AI extraction might contain minor errors. Please verify data before saving.</span>
                <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                  <Plus size={14} /> Add Row Manually
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyReceipt;
