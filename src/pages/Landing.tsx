import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Recycle, Activity, ArrowRight, QrCode, RefreshCw, Trash2 } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Recycle size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">PHARMA TRACE</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          <a href="#impact" className="hover:text-emerald-600 transition-colors">Impact</a>
        </div>
        <div className="flex gap-4">
          <Link to="/app/scanner" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <QrCode size={18} />
            Scan Medicine
          </Link>
          <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="container mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Enterprise Traceability
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
            From Shelf to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Safe Disposal
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            End-to-end medicine traceability, automated reverse logistics, and AI-powered fraud-resistant destruction verification.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-medium flex items-center gap-2 transition-transform hover:scale-105">
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link to="/app/dashboard" className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-medium transition-colors shadow-sm">
              Explore Platform
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 backdrop-blur-sm bg-white/90">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-slate-900">Live Batch Lifecycle</h3>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Batch B12345</span>
            </div>
            
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>
              
              {[
                { title: 'Manufacturer', status: 'Completed', time: 'Jan 10, 2026' },
                { title: 'Distributor', status: 'Completed', time: 'Jan 15, 2026' },
                { title: 'Pharmacy', status: 'Completed', time: 'Jan 18, 2026' },
                { title: 'Return Request', status: 'Completed', time: 'Apr 10, 2026', alert: true },
                { title: 'Destruction Facility', status: 'In Transit', time: 'Pending' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.status === 'Completed' ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-300 text-slate-400'}`}>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 text-sm flex items-center gap-2">
                      {step.title}
                      {step.alert && <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Expired</span>}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{step.time} • {step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Value Prop */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Lifecycle Control</h2>
            <p className="text-slate-400">Our platform ensures zero leakage of expired or damaged medicines back into the supply chain.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Activity, title: 'TRACE', desc: 'Know where every batch is in real-time with full history.' },
              { icon: RefreshCw, title: 'RETURN', desc: 'Automate expired and unsafe medicine returns instantly.' },
              { icon: Trash2, title: 'DESTROY', desc: 'Verify safe and compliant destruction digitally.' },
              { icon: ShieldCheck, title: 'PROTECT', desc: 'Prevent destroyed medicines from re-entering the market.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
                <f.icon size={32} className="text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Final Section */}
      <footer className="bg-slate-50 pt-24 pb-12 border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Responsible Medicines for a Healthier Tomorrow</h2>
          <div className="flex flex-col md:flex-row justify-center gap-12 mb-16">
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900">PEOPLE</h4>
              <p className="text-slate-600 mt-2">Safer Medicines for everyone.</p>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900">PLANET</h4>
              <p className="text-slate-600 mt-2">Cleaner Environment via proper disposal.</p>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-900">PROGRESS</h4>
              <p className="text-slate-600 mt-2">Stronger India with digital traceability.</p>
            </div>
          </div>
          
          <div className="text-slate-400 text-sm font-medium">
            "Track Today | Return Responsibly | Protect Lives"
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;