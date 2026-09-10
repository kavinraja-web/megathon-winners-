import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, Store, Truck, ArrowRight, UserPlus, LogIn, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, profile } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(() => localStorage.getItem('last_login_email') || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [selectedRole, setSelectedRole] = useState('pharmacy');
  const [loading, setLoading] = useState(false);

  // If already authenticated and profile is loaded, redirect
  React.useEffect(() => {
    if (session && profile) {
      if (profile.role === 'manufacturer') navigate('/manufacturer/dashboard');
      else if (profile.role === 'distributor') navigate('/distributor/dashboard');
      else if (profile.role === 'pharmacy') navigate('/pharmacy/dashboard');
    }
  }, [session, profile, navigate]);

  const roles = [
    { id: 'pharmacy', title: 'Pharmacy', desc: 'Medical Shop & Retail', icon: Store },
    { id: 'distributor', title: 'Distributor', desc: 'Wholesaler & Logistics', icon: Truck },
    { id: 'manufacturer', title: 'Manufacturer', desc: 'Brand Owner & Production', icon: Building2 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem('last_login_email', email);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              user_id: data.user.id,
              role: selectedRole,
              full_name: fullName,
              email: email,
              organization_name: organization || null,
            }
          ]);
          if (profileError) throw profileError;
          toast.success('Account created successfully!');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium">
        <Home size={20} />
        <span>Home</span>
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {isLogin ? 'Welcome back to Pharma Trace' : 'Join the Pharma Trace network'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="John Doe" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label key={role.id} className="relative flex cursor-pointer rounded-xl border border-slate-200 bg-white p-3 shadow-sm focus:outline-none hover:border-emerald-500 has-[:checked]:border-emerald-500 has-[:checked]:ring-1 has-[:checked]:ring-emerald-500 transition-all">
                        <input type="radio" name="role" value={role.id} className="sr-only" checked={selectedRole === role.id} onChange={(e) => setSelectedRole(e.target.value)} />
                        <span className="flex flex-1 items-center gap-3">
                          <role.icon size={20} className={selectedRole === role.id ? "text-emerald-600" : "text-slate-400"} />
                          <span className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{role.title}</span>
                          </span>
                        </span>
                        <span className="pointer-events-none absolute -inset-px rounded-xl border-2 border-transparent has-[:checked]:border-emerald-500" aria-hidden="true"></span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedRole === 'pharmacy' ? 'Pharmacy Name' : 'Organization Name'}
                  </label>
                  <input required type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="ABC Corp" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} className="mr-2" /> Sign In</> : <><UserPlus size={18} className="mr-2" /> Create Account</>)}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
