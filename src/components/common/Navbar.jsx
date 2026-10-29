import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import {
  MapPin,
  Bell,
  PlusCircle,
  LayoutDashboard,
  ShieldAlert,
  Wrench,
  Search,
  Map as MapIcon,
  LogOut,
  Menu,
  X,
  FileText,
  CopyCheck,
  HardHat,
  Camera,
  Edit3,
  Settings
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, openProfileModal } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useIssues();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setNotifDropdownOpen(false);
      }
    }

    if (notifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    (n) => n.recipient_user_id === currentUser?.user_id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="leading-tight">
              <span className="text-2xl sm:text-[26px] font-black tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 bg-clip-text text-transparent block">
                CivicTrack
              </span>
              <span className="hidden sm:block text-xs font-bold uppercase tracking-wider text-slate-500">
                Municipal Issue Portal
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links (Role-Aware & Non-Colliding) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 min-w-0">
            {/* Admin Header Indicator (Navigation is in AdminSidebar) */}
            {currentUser?.role === 'admin' ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-indigo-900 tracking-wide">
                  Municipal Administration Console
                </span>
              </div>
            ) : currentUser?.role === 'staff' ? (
              /* Staff Header Indicator (Navigation is in StaffSidebar) */
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-900 tracking-wide">
                  Field Maintenance Contractor Portal &bull; {currentUser?.department || 'Operations'}
                </span>
              </div>
            ) : (
              /* Citizen & Public Visitor Links */
              <>
                <Link
                  to="/"
                  className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-[15px] font-semibold transition ${
                    isActive('/')
                      ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/map"
                  className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-[15px] font-semibold transition ${
                    isActive('/map')
                      ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MapIcon className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                  Public Map
                </Link>

                <Link
                  to="/track"
                  className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-[15px] font-semibold transition ${
                    isActive('/track')
                      ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                  Track Code
                </Link>

                {currentUser?.role === 'citizen' && (
                  <>
                    <Link
                      to="/citizen"
                      className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-[15px] font-semibold transition ${
                        isActive('/citizen')
                          ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <LayoutDashboard className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                      Dashboard
                    </Link>
                    <Link
                      to="/citizen/my-reports"
                      className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm xl:text-[15px] font-semibold transition ${
                        isActive('/citizen/my-reports')
                          ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <FileText className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                      My Reports
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 ml-auto">
            {/* Show "Report Issue" CTA button for Citizens and Public Visitors */}
            {currentUser?.role !== 'admin' && (
              <Link
                to="/report"
                className="whitespace-nowrap inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm xl:text-[15px] font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-102"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Report Issue</span>
              </Link>
            )}

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Notifications ({userNotifications.length})
                    </span>
                    <div className="flex items-center gap-2.5">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => setNotifDropdownOpen(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Close notifications"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-8 text-center text-sm text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.notification_id}
                          onClick={() => {
                            markNotificationRead(notif.notification_id);
                            if (notif.issue_id) {
                              navigate(`/issue/${notif.issue_id}`);
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-4 cursor-pointer hover:bg-slate-50 transition ${
                            !notif.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
                            {new Date(notif.created_at).toLocaleDateString()} at{' '}
                            {new Date(notif.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 shrink-0">
                {/* Clickable Profile Card -> Opens Edit Profile Settings Modal */}
                <button
                  type="button"
                  onClick={openProfileModal}
                  className="group flex items-center gap-2 sm:gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-2xl hover:bg-slate-100 active:bg-slate-200 border border-transparent hover:border-slate-200/90 transition-all cursor-pointer text-left shrink-0"
                  title="Click to edit profile name, photo & settings"
                >
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-slate-200 shadow-xs group-hover:ring-2 group-hover:ring-indigo-500 transition-all"
                    />
                    <span className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="hidden sm:block text-left max-w-[160px] min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
                        {currentUser.name}
                      </span>
                      <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[11px] uppercase font-bold text-indigo-600 truncate">
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-semibold transition-colors">
                        &bull; Edit
                      </span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-bold transition cursor-pointer shrink-0"
                  title="Sign out of account"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-5 pt-3 pb-6 space-y-2 shadow-lg">
          {currentUser && (
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                openProfileModal();
              }}
              className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition"
              title="Edit Profile Settings"
            >
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">{currentUser.name}</span>
                  <span className="text-[11px] text-indigo-600 font-bold uppercase">{currentUser.role} &bull; Tap to edit profile</span>
                </div>
              </div>
              <Camera className="w-4 h-4 text-slate-400" />
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-base font-bold text-blue-700 bg-blue-50"
          >
            + Report New Issue
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Public Map
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Track by Code
          </Link>

          {currentUser?.role === 'citizen' && (
            <>
              <Link
                to="/citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Citizen Dashboard
              </Link>
              <Link
                to="/citizen/my-reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                My Reported Issues
              </Link>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-bold text-indigo-700 hover:bg-indigo-50"
              >
                Admin Console
              </Link>
              <Link
                to="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Triage & All Reports
              </Link>
              <Link
                to="/admin/vendors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Vendors & Field Staff
              </Link>
              <Link
                to="/admin/duplicates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Duplicate Review
              </Link>
              <Link
                to="/admin/hotspots"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50"
              >
                Hotspot Analytics
              </Link>
            </>
          )}

          {currentUser?.role === 'staff' && (
            <Link
              to="/staff"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-base font-bold text-amber-700 hover:bg-amber-50"
            >
              Vendor Field Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
