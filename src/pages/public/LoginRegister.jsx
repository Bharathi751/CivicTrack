import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, User, Shield, Wrench, Lock, Mail, Phone, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginRegister() {
  const { login, register, switchUserById } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const redirectAfterLogin = (userRole) => {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'staff') navigate('/staff');
    else navigate('/citizen');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = login(email, password);
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = register({ name, email, password, role, phone, address });
      redirectAfterLogin(user.role);
    } catch (err) {
      setError(err.message);
    }
  };

  // Quick 1-click Demo Account Logins
  const handleQuickDemo = (userId, targetRole) => {
    switchUserById(userId);
    redirectAfterLogin(targetRole);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isRegister ? 'Join CivicTrack Platform' : 'Welcome to CivicTrack'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Create your citizen, vendor, or official account'
              : 'Sign in to access your dashboard, reports, or field orders'}
          </p>
        </div>

        {/* 1-Click Demo Profiles Box */}
        {!isRegister && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instant 1-Click Demo Logins:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo(1, 'citizen')}
                className="p-2 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-center transition flex flex-col items-center gap-1 group cursor-pointer"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-700">
                  Citizen
                </span>
                <span className="text-[9px] text-slate-400">Arun Kumar</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(3, 'admin')}
                className="p-2 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-center transition flex flex-col items-center gap-1 group cursor-pointer"
              >
                <Shield className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-700">
                  Admin
                </span>
                <span className="text-[9px] text-slate-400">Commissioner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo(4, 'staff')}
                className="p-2 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-center transition flex flex-col items-center gap-1 group cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700">
                  Vendor
                </span>
                <span className="text-[9px] text-slate-400">Apex Roadworks</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition ${
              !isRegister
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition ${
              isRegister
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Register Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. arun@citizen.org"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Sign In to CivicTrack
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name / Organization
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar or Zenith Cleaners"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
              >
                <option value="citizen">Citizen (General Public)</option>
                <option value="staff">Staff Member / Vendor Contractor</option>
                <option value="admin">Municipal Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@domain.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98401 00000"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer mt-2"
            >
              Complete Registration & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
