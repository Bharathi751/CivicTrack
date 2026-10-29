import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  CopyCheck,
  Flame,
  MapPin,
  Search,
  LogOut,
  ChevronRight,
  Menu,
  X,
  HardHat,
  Building2,
  ExternalLink,
  Camera,
  Edit3
} from 'lucide-react';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, staffMembers, logout, openProfileModal } = useAuth();
  const { stats, issues, dismissedDuplicates } = useIssues();
  const navigate = useNavigate();
  const location = useLocation();

  const unreviewedCount = stats.reported + stats.underReview;

  // Approximate duplicate count
  const potentialDupesCount = Math.max(
    0,
    issues.filter((i) => i.duplicate_of_id).length
  );

  const navItems = [
    {
      to: '/admin',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
      badge: null,
      exact: true
    },
    {
      to: '/admin/reports',
      label: 'Triage & Review',
      icon: ShieldAlert,
      badge: unreviewedCount > 0 ? unreviewedCount : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      to: '/admin/vendors',
      label: 'Vendors & Staff',
      icon: HardHat,
      badge: staffMembers.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
    },
    {
      to: '/admin/duplicates',
      label: 'Duplicate Review',
      icon: CopyCheck,
      badge: potentialDupesCount > 0 ? potentialDupesCount : null,
      badgeColor: 'bg-indigo-500/30 text-indigo-300'
    },
    {
      to: '/admin/hotspots',
      label: 'Hotspot Analytics',
      icon: Flame,
      badge: null
    },
    {
      divider: true,
      title: 'PUBLIC VIEWS'
    },
    {
      to: '/map',
      label: 'Live Incident Map',
      icon: MapPin,
      badge: null
    },
    {
      to: '/track',
      label: 'Track by Code',
      icon: Search,
      badge: null
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white leading-tight">
              Admin Console
            </h2>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
              Municipal Corp
            </span>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Management & Triage
        </div>

        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={idx} className="pt-5 pb-2 px-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {item.title}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive: linkActive }) => {
                const active = item.exact ? location.pathname === item.to : linkActive;
                return `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`;
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
          {/* Clickable Profile Card -> Opens Profile Settings */}
          <button
            type="button"
            onClick={openProfileModal}
            className="group flex items-center gap-2.5 min-w-0 text-left cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to edit profile name & photo"
          >
            <div className="relative shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-inner group-hover:ring-2 group-hover:ring-indigo-500 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-inner">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
                </div>
              )}
              <span className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                <span>{currentUser?.name || 'Administrator'}</span>
                <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <span className="inline-block text-[10px] font-semibold text-indigo-400 uppercase tracking-wide group-hover:underline">
                Edit Profile Settings
              </span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] z-30">
        <NavContent />
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
