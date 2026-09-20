import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('mathsfact.99@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!password.trim()) {
        throw new Error('Please enter the administrator password.');
      }

      const res = await api.loginAdmin(email, password);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(
        err.message ||
          'Invalid credentials. If this is your first time, you can set the password in the admin setup.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="admin-login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-red-900/50 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-red-950 border border-red-600/50 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Admin Management Portal</h3>
            <p className="text-xs text-zinc-400">Restricted to Maths Fact Institute Administration</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Admin Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mathsfact.99@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (e.g. 06111999@mf)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              Administrator password: <code className="text-amber-400 font-mono">06111999@mf</code>. You can change this inside the dashboard anytime.
            </p>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying Admin Credentials...</span>
            ) : (
              <>
                <span>Access Institute Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Official: mathsfact.99@gmail.com</span>
          <span className="text-amber-400">Secure PBKDF2 Session</span>
        </div>
      </div>
    </div>
  );
};
