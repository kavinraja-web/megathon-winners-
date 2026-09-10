import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, QrCode, AlertTriangle, 
  RefreshCw, Truck, FileText, 
  History, BarChart3, Bell, Search, User, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  
  const userRole = profile?.role || 'pharmacy';
  const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const basePath = `/${userRole}`;
  
  const navItems = [
    { name: 'Dashboard', path: `${basePath}/dashboard`, icon: LayoutDashboard },
    { name: 'Medicine Batches', path: `${basePath}/batches`, icon: Package },
    { name: 'QR Scanner', path: `${basePath}/scanner`, icon: QrCode },
    { name: 'Expiry Alerts', path: `${basePath}/expiry`, icon: AlertTriangle },
    { name: 'Return Requests', path: `${basePath}/returns`, icon: RefreshCw },
    { name: 'Reverse Logistics', path: `${basePath}/logistics`, icon: Truck },
    { name: 'Audit Trail', path: `${basePath}/audit`, icon: History },
    { name: 'Billing POS', path: `${basePath}/billing`, icon: FileText },
    { name: 'Analytics', path: `${basePath}/analytics`, icon: BarChart3 },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'pharmacy') {
      return ['Dashboard', 'QR Scanner', 'Billing POS', 'Medicine Batches', 'Return Requests', 'Expiry Alerts'].includes(item.name);
    }
    if (userRole === 'distributor') {
      return ['Dashboard', 'Medicine Batches', 'QR Scanner', 'Reverse Logistics', 'Expiry Alerts'].includes(item.name);
    }
    return true;
  });

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="bg-emerald-500 p-2 rounded-lg">
          <RefreshCw size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">PHARMA TRACE</h1>
          <p className="text-xs text-emerald-400 font-medium">Safe & Secure</p>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <div className="text-xs uppercase text-slate-500 font-semibold mb-2 ml-2">Menu</div>
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto p-4">
        <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name || roleName}</p>
              <p className="text-xs text-slate-400 truncate">{roleName} Role</p>
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
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-600">System Online</span>
        </div>
        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

const Layout = () => {
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

export default Layout;