import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import {
  User,
  Camera,
  Upload,
  Check,
  X,
  Shield,
  Wrench,
  MapPin,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Building2,
  HardHat,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    id: 'admin_male',
    label: 'Municipal Commissioner',
    roleTag: 'Admin / Executive',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'admin_female',
    label: 'Corporation Director',
    roleTag: 'Admin / Director',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'citizen_male',
    label: 'Citizen Resident (Arun)',
    roleTag: 'Citizen',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'citizen_female',
    label: 'Citizen Resident (Priya)',
    roleTag: 'Citizen',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'vendor_lead',
    label: 'Field Lead Contractor',
    roleTag: 'Vendor / Staff',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'young_citizen',
    label: 'Youth Ward Rep',
    roleTag: 'Community',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  }
];

export default function ProfileSettingsModal() {
  const { currentUser, profileModalOpen, closeProfileModal, updateProfile } = useAuth();
  const { syncUserIssues } = useIssues();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state whenever modal opens or currentUser changes
  useEffect(() => {
    if (currentUser && profileModalOpen) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setDepartment(currentUser.department || '');
      setPassword(currentUser.password || '');
      setError('');
      setSuccess('');
      setShowUrlField(false);
      setCustomUrlInput('');
    }
  }, [currentUser, profileModalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && profileModalOpen) {
        closeProfileModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profileModalOpen, closeProfileModal]);

  if (!profileModalOpen || !currentUser) return null;

  // Handle uploading custom photo file from local device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Selected image is too large (max 5MB). Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result);
        setError('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setAvatar(customUrlInput.trim());
    setShowUrlField(false);
    setCustomUrlInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Display name cannot be empty.');
      return;
    }

    setSaving(true);

    try {
      const updatedFields = {
        name: name.trim(),
        avatar: avatar.trim() || currentUser.avatar,
        phone: phone.trim(),
        ...(currentUser.role === 'citizen' ? { address: address.trim() } : { department: department.trim() }),
        ...(password.trim() ? { password: password.trim() } : {})
      };

      const updatedUser = updateProfile(updatedFields);
      if (syncUserIssues) {
        syncUserIssues(updatedUser);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        closeProfileModal();
      }, 850);
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-7 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Account & Identity Management
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Profile & Settings
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Update your display name, photo, phone, and role jurisdiction across all CivicTrack portals.
              </p>
            </div>

            <button
              onClick={closeProfileModal}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              title="Close modal"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6">
          {/* Alerts */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Section 1: Avatar / Profile Picture */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Profile Picture / Avatar
            </label>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar Live Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar || currentUser.avatar}
                  alt={name || currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-indigo-200"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px] font-bold gap-1"
                  title="Upload new image"
                >
                  <Camera className="w-5 h-5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Action Buttons for Avatar */}
              <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload from Device</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Paste Image URL</span>
                  </button>
                </div>

                {/* Optional Custom URL Field */}
                {showUrlField && (
                  <div className="flex gap-2 pt-1 animate-in fade-in">
                    <input
                      type="url"
                      placeholder="https://example.com/my-photo.jpg"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Quick Presets Carousel / Grid */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Or select an authentic representative avatar preset:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatar(preset.url)}
                          className={`relative group shrink-0 rounded-xl p-0.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105'
                              : 'opacity-70 hover:opacity-100 hover:scale-102'
                          }`}
                          title={`${preset.label} (${preset.roleTag})`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Display Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commissioner Rajesh V."
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                This name appears on the header bar, tickets, triage history, and assigned work orders.
              </span>
            </div>

            {/* Email (Read-only reference) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98400 12345"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Role-Specific Field: Department / Jurisdiction OR Address */}
            {currentUser.role === 'citizen' ? (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Residential Ward / Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Sector 4, Gandhi Nagar, Thousand Lights"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentUser.role === 'admin' ? 'Municipal Department / Office' : 'Contractor Jurisdiction'}
                </label>
                <div className="relative">
                  {currentUser.role === 'admin' ? (
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  ) : (
                    <HardHat className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  )}
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder={
                      currentUser.role === 'admin'
                        ? 'Municipal Corporation Headquarters'
                        : 'Roads & Highway Maintenance'
                    }
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Password Update */}
            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter updated password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Current Role Indicator Pill */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Active Role Authorization:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase ${
                  currentUser.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : currentUser.role === 'staff'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              User ID #{currentUser.user_id}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeProfileModal}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
