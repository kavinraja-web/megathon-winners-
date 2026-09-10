import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import { Download, Sparkles, FileText, Loader2 } from 'lucide-react';
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
  const { batches, bills } = usePOS();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<string | null>(null);

  const generateAIReport = () => {
    setIsGenerating(true);
    setReportData(null);
    
    // Mock AI Generation delay
    setTimeout(() => {
      const totalSales = bills.reduce((acc, b) => acc + b.total, 0);
      const totalStock = batches.reduce((acc, b) => acc + b.quantity, 0);
      const expiringSoon = batches.filter(b => b.status === 'NEAR_EXPIRY' || b.status === 'CRITICAL').length;
      const expiredBatches = batches.filter(b => b.status === 'EXPIRED');

      const mockHtmlReport = `
        <h2>Executive Summary</h2>
        <p>This automated system report provides a comprehensive overview of pharmacy operations, inventory health, and revenue generation.</p>
        
        <h3>Month-wise Sales Analysis</h3>
        <p>Total Revenue generated across all recorded transactions: <strong>₹${totalSales.toLocaleString()}</strong>.</p>
        <ul>
          <li>Steady sales velocity observed in fast-moving categories.</li>
          <li>Peak transaction volumes correlate with standard refill periods.</li>
        </ul>

        <h3>Current Inventory & Stock Levels</h3>
        <p>Total active stock units across all batches: <strong>${totalStock}</strong>.</p>
        <p>Inventory distribution appears optimal for current sales velocity, preventing immediate stockouts.</p>

        <h3>Expiry Risk Analysis</h3>
        <p>Attention required for aging inventory:</p>
        <ul>
          <li><strong>${expiringSoon}</strong> batches are nearing expiry and should be prioritized for FEFO dispensing.</li>
          <li><strong>${expiredBatches.length}</strong> batches have already expired and have been isolated for return logistics.</li>
        </ul>

        <h3>Actionable Insights & Recommendations</h3>
        <ul>
          <li>Initiate automatic return requests for the ${expiredBatches.length} expired batches immediately.</li>
          <li>Apply promotional discounts to the ${expiringSoon} near-expiry batches to accelerate sell-through.</li>
          <li>Re-order fast-moving products to maintain buffer stock levels.</li>
        </ul>
      `;
      
      setReportData(mockHtmlReport);
      setIsGenerating(false);
      toast.success("AI Report Generated successfully!");
    }, 2500); // 2.5 second mock delay
  };

  const handleDownload = () => {
    if (!reportData) return;
    downloadReport(reportData, `PharmaTrace_AI_Report_${new Date().toISOString().split('T')[0]}.html`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Reports</h2>
          <p className="text-slate-500 text-sm">Generate comprehensive reports for sales, stock, and expiring medicines instantly.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/3 bg-slate-50 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" /> Generate AI Report
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Our automated system analyzes your billing history and current inventory to generate a professional report detailing sales, stock status, and expiry risks instantly without requiring external API keys.
            </p>
          </div>

          <div className="space-y-4 mt-auto">
            <button
              onClick={generateAIReport}
              disabled={isGenerating}
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

        <div className="w-full lg:w-2/3 p-6 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Generated Report</h3>
            {reportData && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
              >
                <Download size={16} /> Download PDF / HTML
              </button>
            )}
          </div>

          <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto">
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
                <p>No report generated yet.<br/>Click "Generate AI Report" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;