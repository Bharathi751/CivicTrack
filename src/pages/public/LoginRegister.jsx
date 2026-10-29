import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/common/BackButton';
import {
  MapPin,
  User,
  Shield,
  Wrench,
  Lock,
  Mail,
  Phone,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginRegister() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin = (userRole) => {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'staff') navigate('/staff');
    else navigate('/citizen');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = login(email, password);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = register({ name, email, password, role, phone, address });
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to fill credentials into the form so user can submit
  const handleAutoFill = (fillEmail, fillPassword) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-4">
        {/* Back Navigation Bar */}
        <BackButton label="Back to previous page" fallbackPath="/" showDashboardLink={false} />

        {/* Main Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <MapPin className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRegister ? 'Create Your Account' : 'CivicTrack Single Sign In'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              {isRegister
                ? 'Join CivicTrack as a citizen, municipal official, or maintenance contractor'
                : 'One unified login portal for Citizens, Municipal Administrators, and Field Contractors'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Unified Sign In Form */}
          {!isRegister ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@civic.gov or citizen@civic.org"
                    className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Default: password123 / admin123</span>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 focus:outline-none transition"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  Full Name / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar or Apex Maintenance Corp"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  Account Type / Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                >
                  <option value="citizen">Citizen (General Public & Residents)</option>
                  <option value="staff">Field Staff / Maintenance Vendor Contractor</option>
                  <option value="admin">Municipal Corporation Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 focus:outline-none transition"
                      title={showRegisterPassword ? 'Hide password' : 'Show password'}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-md transition cursor-pointer mt-2"
              >
                {loading ? 'Creating Account...' : 'Complete Registration & Sign In'}
              </button>
            </form>
          )}
        </div>

        {/* Demo Credentials Guide Box (Click to Auto-fill form) */}
        {!isRegister && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <KeyRound className="w-4 h-4 text-amber-500" />
              <span>Available Accounts (Click any to auto-fill form):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Admin Card */}
              <div
                onClick={() => handleAutoFill('admin@civic.gov', 'admin123')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-102 ${
                  email === 'admin@civic.gov'
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 uppercase">
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </span>
                  {email === 'admin@civic.gov' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 truncate">admin@civic.gov</div>
                <div className="text-[11px] text-slate-500">Pass: <strong>admin123</strong></div>
                <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
                  &rarr; Click to Fill
                </span>
              </div>

              {/* Citizen Card */}
              <div
                onClick={() => handleAutoFill('citizen@civic.org', 'password123')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-102 ${
                  email === 'citizen@civic.org'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 uppercase">
                    <User className="w-3.5 h-3.5" /> Citizen
                  </span>
                  {email === 'citizen@civic.org' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 truncate">citizen@civic.org</div>
                <div className="text-[11px] text-slate-500">Pass: <strong>password123</strong></div>
                <span className="text-[10px] text-blue-600 font-semibold block mt-1">
                  &rarr; Click to Fill
                </span>
              </div>

              {/* Vendor Card */}
              <div
                onClick={() => handleAutoFill('vendor@roadworks.com', 'vendor123')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all hover:scale-102 ${
                  email === 'vendor@roadworks.com'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 uppercase">
                    <Wrench className="w-3.5 h-3.5" /> Vendor / Staff
                  </span>
                  {email === 'vendor@roadworks.com' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <div className="font-mono text-xs font-bold text-slate-800 truncate">vendor@roadworks.com</div>
                <div className="text-[11px] text-slate-500">Pass: <strong>vendor123</strong></div>
                <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                  &rarr; Click to Fill
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
