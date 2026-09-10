import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Download, Sparkles, FileText, Loader2, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const downloadReport = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: 'text/html'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const Analytics = () => {
  const { products, batches, bills } = usePOS();
  
  const [apiKey, setApiKey] = useState(import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);

  const calculateTotalSales = () => bills.reduce((acc, bill) => acc + bill.total, 0);
  const calculateTotalStock = () => batches.reduce((acc, batch) => acc + batch.quantity, 0);
  const calculateExpiringSoon = () => batches.filter(b => b.status === 'NEAR_EXPIRY' || b.status === 'CRITICAL').length;

  const generateAIReport = async () => {
    if (!apiKey) {
      toast.error("Please enter a Gemini API Key to generate the AI report.");
      return;
    }

    setIsGenerating(true);
    setReportData(null);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are an expert pharmaceutical supply chain analyst. 
I have the following data from my pharmacy tracking app. 

CURRENT INVENTORY BATCHES (Stock):
${JSON.stringify(batches.map(b => ({ id: b.id, batchNo: b.batchNumber, qty: b.quantity, exp: b.expiryDate, status: b.status, price: b.sellingPrice })), null, 2)}

RECENT BILLS (Sales):
${JSON.stringify(bills.map(b => ({ date: b.date, total: b.total, items: b.items.map(i => ({ name: i.productName, qty: i.quantity, price: i.unitPrice })) })), null, 2)}

Please write a comprehensive, professional report. The data spans across time, so please aggregate and analyze the sales and expiry data **month-wise** (e.g. "January 2026", "February 2026").
Include the following sections:
1. Executive Summary
2. Month-wise Sales Analysis (amount of medicines sold, total revenue broken down by month)
3. Current Inventory & Stock Levels (amount of stock currently available)
4. Month-wise Expiry Risk Analysis (which items are expiring in upcoming months)
5. Actionable Insights & Recommendations for distributors/pharmacists

Format the response ENTIRELY in clean, semantic HTML. Use <h2>, <h3>, <p>, <ul>, <li>, and <strong> tags. Do not include markdown like \`\`\`html or **bold**. Just output raw HTML tags that I can inject directly into a div. Make sure the insights are derived exactly from the provided JSON data.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanHtml = text.replace(/```html/g, '').replace(/```/g, '');
      setReportData(cleanHtml);
      toast.success("AI Report Generated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to generate report. " + (error.message || ""));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!reportData) return;
    downloadReport(reportData, `PharmaTrace_AI_Report_${new Date().toISOString().split('T')[0]}.html`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-500 text-sm">Generate comprehensive reports for sales, stock, and expiring medicines.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-900">₹{calculateTotalSales().toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Stock Items</p>
            <p className="text-2xl font-bold text-slate-900">{calculateTotalStock()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-xl bg-orange-50 text-orange-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Expiring Soon</p>
            <p className="text-2xl font-bold text-slate-900">{calculateExpiringSoon()} batches</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" /> Generate AI Report
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Our AI analyzes your billing history and current inventory to generate a month-wise professional report detailing sales, stock status, and expiry risks.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={generateAIReport}
              disabled={isGenerating || !apiKey}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> Analyzing Data...</>
              ) : (
                <><Sparkles size={18} /> Generate AI Report</>
              )}
            </button>
          </div>
        </div>

        <div className="w-full lg:w-2/3 p-6 flex flex-col bg-white min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Generated Report</h3>
            {reportData && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
              >
                <Download size={16} /> Download Report
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto max-h-[600px]">
            <style>{`
              .report-content h2 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 1.5rem; margin-bottom: 0.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
              .report-content h3 { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin-top: 1.25rem; margin-bottom: 0.5rem; }
              .report-content p { color: #334155; margin-bottom: 1rem; line-height: 1.6; }
              .report-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; color: #334155; }
              .report-content li { margin-bottom: 0.25rem; }
              .report-content strong { color: #0f172a; font-weight: 600; }
            `}</style>
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20">
                <Loader2 size={40} className="animate-spin text-indigo-400" />
                <p>Reading databases and writing report...</p>
              </div>
            ) : reportData ? (
              <div className="report-content" dangerouslySetInnerHTML={{ __html: reportData }} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 py-20 text-center px-8">
                <FileText size={48} className="text-slate-200" />
                <p>No report generated yet.<br/>Enter your API key and click "Generate AI Report" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;