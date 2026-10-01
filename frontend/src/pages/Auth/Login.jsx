import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result && result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-glow-600 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to access your DM-GLOWCART account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@glowcart.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-glow-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-glow-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-glow-600 to-rose-600 hover:from-glow-700 hover:to-rose-700 text-white font-bold py-3.5 rounded-xl shadow-glow transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-60"
          >
            <span>{submitting ? 'Signing In...' : 'SIGN IN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Quick Paste Helper */}
        <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-100 text-[11px] space-y-1">
          <span className="font-bold text-slate-800 block">Demo Accounts:</span>
          <div className="flex justify-between items-center text-slate-600">
            <span>User: <strong>user@glowcart.com</strong> / User@123</span>
            <button onClick={() => { setEmail('user@glowcart.com'); setPassword('User@123'); }} className="text-glow-600 font-bold hover:underline">Use</button>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Admin: <strong>admin@glowcart.com</strong> / Admin@123</span>
            <button onClick={() => { setEmail('admin@glowcart.com'); setPassword('Admin@123'); }} className="text-glow-600 font-bold hover:underline">Use</button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-glow-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
