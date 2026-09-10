import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Store, Truck, Trash2, Shield, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('manufacturer');

  const roles = [
    { id: 'manufacturer', title: 'Manufacturer', desc: 'Brand Owner & Production', icon: Building2 },
    { id: 'distributor', title: 'Dealer', desc: 'Wholesaler & Logistics', icon: Truck },
    { id: 'pharmacy', title: 'Pharmacist', desc: 'Medical Shop & Retail', icon: Store },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const roleFromForm = formData.get('role') || selectedRole;
    if (roleFromForm) {
      localStorage.setItem('USER_ROLE', roleFromForm as string);
    }
    
    if (roleFromForm === 'manufacturer') {
      navigate('/manufacturer/dashboard');
    } else if (roleFromForm === 'distributor') {
      navigate('/distributor/dashboard');
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select your role to continue to Pharma Trace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className="relative flex cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm focus:outline-none hover:border-emerald-500 has-[:checked]:border-emerald-500 has-[:checked]:ring-1 has-[:checked]:ring-emerald-500 transition-all">
                    <input 
                      type="radio" 
                      name="role" 
                      value={role.id} 
                      className="sr-only" 
                      checked={selectedRole === role.id}
                      onChange={(e) => setSelectedRole(e.target.value)} 
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <role.icon size={16} className="text-slate-500" />
                          {role.title}
                        </span>
                        <span className="mt-1 text-xs text-gray-500 ml-6">{role.desc}</span>
                      </span>
                    </span>
                    <span className="pointer-events-none absolute -inset-px rounded-xl border-2 border-transparent has-[:checked]:border-emerald-500" aria-hidden="true"></span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Continue to Dashboard <ArrowRight size={16} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
