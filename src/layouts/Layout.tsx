import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Package,
  QrCode,
  ClockAlert,
  Boxes,
  Truck,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  User
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Medicines', path: '/app/medicines', icon: Pill },
  { name: 'Batch Management', path: '/app/batches', icon: Package },
  { name: 'QR / Barcode', path: '/app/qrcode', icon: QrCode },
  { name: 'Expiry Monitor', path: '/app/expiry', icon: ClockAlert },
  { name: 'Inventory', path: '/app/inventory', icon: Boxes },
  { name: 'Sales & Distribution', path: '/app/sales', icon: Truck },
  { name: 'Reports & Analytics', path: '/app/reports', icon: BarChart3 },
  { name: 'Alerts', path: '/app/alerts', icon: Bell },
  { name: 'Profile & Settings', path: '/app/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-teal-600">
              <Pill className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">PharmaTrack</span>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <HelpCircle className="h-5 w-5 text-gray-400" />
            Help & Support
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search batches, medicines, or pharmacies..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-gray-700">ABC Pharma</p>
                <p className="text-gray-500 text-xs">Manufacturer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}