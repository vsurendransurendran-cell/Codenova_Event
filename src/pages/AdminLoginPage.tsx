import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@eventflow.dev');
  const [password, setPassword] = useState('AdminPass123!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Please provide both administrative identifier and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier.trim(), password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrative credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoCredentials = () => {
    setIdentifier('admin@eventflow.dev');
    setPassword('AdminPass123!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 bg-white border border-stone-200 p-8 rounded-lg shadow-sm">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center rounded-xl mx-auto shadow-lg shadow-blue-500/25">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrator Sign-In
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Protected management portal for CodeNova Event Operations
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-lg text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 flex items-center space-x-1.5">
              <KeyRound className="w-3.5 h-3.5 text-blue-700" />
              <span>Evaluation Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleUseDemoCredentials}
              className="text-[11px] font-semibold text-blue-800 hover:text-blue-950 underline"
            >
              Fill Demo Values
            </button>
          </div>
          <div className="text-stone-700 font-mono text-[11px] space-y-0.5">
            <div>Email: <strong className="text-slate-900">admin@eventflow.dev</strong></div>
            <div>Password: <strong className="text-slate-900">AdminPass123!</strong></div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold uppercase tracking-wide text-stone-700"
            >
              Admin Email or Username
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@eventflow.dev"
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wide text-stone-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In as Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
