import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import {
  Wrench,
  Clock,
  CheckCircle2,
  MapPin,
  Search,
  LogOut,
  X,
  HardHat,
  ShieldCheck,
  AlertTriangle,
  Camera,
  Edit3
} from 'lucide-react';

export default function StaffSidebar({ mobileOpen, setMobileOpen }) {
  const { currentUser, logout, openProfileModal } = useAuth();
  const { issues } = useIssues();
  const navigate = useNavigate();
  const location = useLocation();

  // Tasks assigned to this vendor
  const assignedIssues = issues.filter(
    (i) => i.assigned_to === currentUser?.user_id || (!i.assigned_to && i.status === 'assigned')
  );

  const activeCount = assignedIssues.filter((i) =>
    ['assigned', 'in_progress', 'reopened'].includes(i.status)
  ).length;

  const completedCount = assignedIssues.filter((i) => i.status === 'resolved').length;
  const urgentCount = assignedIssues.filter(
    (i) => i.priority === 'urgent' && i.status !== 'resolved'
  ).length;

  const navItems = [
    {
      to: '/staff',
      label: 'Vendor Dashboard',
      icon: Wrench,
      badge: null,
      exact: true
    },
    {
      to: '/staff?tab=active',
      label: 'Active Work Orders',
      icon: Clock,
      badge: activeCount,
      badgeColor: 'bg-amber-500 text-slate-950 font-black'
    },
    {
      to: '/staff?tab=resolved',
      label: 'Completed Jobs',
      icon: CheckCircle2,
      badge: completedCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
    },
    {
      divider: true,
      title: 'FIELD TOOLS'
    },
    {
      to: '/map',
      label: 'Incident Map',
      icon: MapPin,
      badge: null
    },
    {
      to: '/track',
      label: 'Verify Tracking Code',
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white leading-tight">
              Vendor Portal
            </h2>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Field Operations
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

      {/* Urgent Warning if any */}
      {urgentCount > 0 && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold">
            {urgentCount} High Priority Urgent Job{urgentCount > 1 ? 's' : ''} Pending!
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Work Orders & Maintenance
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
          const isCurrent = item.to.includes('?tab=')
            ? location.pathname + location.search === item.to
            : location.pathname === item.to && !location.search;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={() => `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                isCurrent
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isCurrent ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'
                  }`}
                />
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

      {/* Contractor Info & Logout Footer */}
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
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-inner group-hover:ring-2 group-hover:ring-amber-500 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-inner">
                  {currentUser?.name ? currentUser.name.charAt(0) : 'V'}
                </div>
              )}
              <span className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>{currentUser?.name || 'Contractor'}</span>
                <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded">
                  {currentUser?.contractorCode || 'VND-STAFF'}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-400 transition-colors font-medium">
                  &bull; Edit
                </span>
              </div>
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
