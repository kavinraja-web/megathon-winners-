import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, PlusCircle, QrCode, 
  Layers, Truck, ScanLine, AlertTriangle, 
  Activity, BarChart3, Bell, Building2, Settings, User, LogOut, Search, FileText, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/manufacturer/dashboard', icon: LayoutDashboard },
    { name: 'Medicine Batches', path: '/manufacturer/batches', icon: Package },
    { name: 'Add Medicine Batch', path: '/manufacturer/add-batch', icon: PlusCircle },
    { name: 'Add Customer', path: '/manufacturer/add-customer', icon: Users },
    { name: 'Reports', path: '/manufacturer/reports', icon: FileText },
    { name: 'QR / Barcode Generator', path: '/manufacturer/qr-generator', icon: QrCode },
    { name: 'Inventory & Stock', path: '/manufacturer/inventory', icon: Layers },
    { name: 'Expiry & Alerts', path: '/manufacturer/expiry-alerts', icon: AlertTriangle },
    { name: 'Notifications', path: '/manufacturer/notifications', icon: Bell },
    { name: 'Company Profile', path: '/manufacturer/profile', icon: Building2 },
    { name: 'Settings', path: '/manufacturer/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Building2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">ABC Pharma</h1>
          <p className="text-xs text-blue-400 font-medium">Manufacturer Portal</p>
        </div>
      </div>
      
      <div className="px-4 py-2 mb-20">
        <div className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-2">Menu</div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-500/10 text-blue-400 font-medium' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto p-4 fixed bottom-0 w-64 bg-slate-900 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || 'Manufacturer'}</p>
              <p className="text-xs text-slate-400 truncate">Manufacturer</p>
            </div>
          </div>
          <button onClick={signOut} className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 mt-2 py-2 bg-slate-700/50 rounded-lg transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-slate-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search batches, QR codes..." 
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-600">Manufacturer System Online</span>
        </div>
        <Link to="/manufacturer/notifications" className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Link>
      </div>
    </header>
  );
};

const ManufacturerLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManufacturerLayout;
