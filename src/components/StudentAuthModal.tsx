import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Mail, Phone, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { User, ClassLevel } from '../types';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    classLevel: 'Class X' as ClassLevel,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const classes: ClassLevel[] = [
    'Class III',
    'Class IV',
    'Class V',
    'Class VI',
    'Class VII',
    'Class VIII',
    'Class IX',
    'Class X',
    'Class XI',
    'Class XII',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!formData.name.trim() || !formData.phone.trim() || !formData.password.trim()) {
          throw new Error('Please fill in Name, Phone, and Password.');
        }

        const res = await api.registerStudent(formData);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const identifier = formData.email.trim() || formData.phone.trim();
        if (!identifier || !formData.password.trim()) {
          throw new Error('Please enter your Email or Phone and Password.');
        }

        const res = await api.loginStudent(identifier, formData.password);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="student-auth-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {isRegisterMode ? 'Create Student Account' : 'Student Portal Login'}
            </h3>
            <p className="text-xs text-zinc-400">
              {isRegisterMode
                ? 'Register to access personalized tests & study notes'
                : 'Welcome back! Access your class materials'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-reg-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Student's Name"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              {isRegisterMode ? 'Email Address (Optional)' : 'Email or Mobile Number'} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="student-auth-email"
                type="text"
                required={!isRegisterMode}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isRegisterMode ? 'student@example.com' : 'e.g. 7004995470 or email'}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="student-reg-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Your Class
                </label>
                <select
                  id="student-reg-class"
                  value={formData.classLevel}
                  onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as ClassLevel })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls} className="bg-[#121622] text-white">
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="student-auth-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <button
            id="student-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-950/60 border border-red-400/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegisterMode ? 'Create Student Account' : 'Sign In to Student Portal'}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(null);
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            {isRegisterMode
              ? 'Already registered? Click here to Log In'
              : 'New Student? Create an account here'}
          </button>
        </div>
      </div>
    </div>
  );
};
