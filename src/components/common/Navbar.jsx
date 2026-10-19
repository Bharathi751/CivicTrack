import React, { useState } from 'react';
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
  CopyCheck
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useIssues();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    (n) => n.recipient_user_id === currentUser?.user_id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-4 lg:gap-8 min-w-0">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
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

            {/* Desktop Navigation Links (with whitespace-nowrap and bigger font size) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                to="/"
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                  isActive('/')
                    ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Home
              </Link>

              <Link
                to="/map"
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
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
                className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                  isActive('/track')
                    ? 'text-blue-700 bg-blue-50/90 shadow-xs ring-1 ring-blue-200'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Search className="w-[18px] h-[18px] text-blue-600 shrink-0" />
                Track Code
              </Link>

              {/* Citizen Specific Links */}
              {currentUser?.role === 'citizen' && (
                <>
                  <Link
                    to="/citizen"
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
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
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
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

              {/* Admin Specific Links */}
              {currentUser?.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                      isActive('/admin')
                        ? 'text-indigo-700 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <LayoutDashboard className="w-[18px] h-[18px] text-indigo-600 shrink-0" />
                    Admin Console
                  </Link>
                  <Link
                    to="/admin/reports"
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                      isActive('/admin/reports')
                        ? 'text-indigo-700 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-[18px] h-[18px] text-indigo-600 shrink-0" />
                    Triage & Review
                  </Link>
                  <Link
                    to="/admin/duplicates"
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                      isActive('/admin/duplicates')
                        ? 'text-indigo-700 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CopyCheck className="w-[18px] h-[18px] text-indigo-600 shrink-0" />
                    Duplicates
                  </Link>
                  <Link
                    to="/admin/hotspots"
                    className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                      isActive('/admin/hotspots')
                        ? 'text-indigo-700 bg-indigo-50/90 shadow-xs ring-1 ring-indigo-200'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MapIcon className="w-[18px] h-[18px] text-indigo-600 shrink-0" />
                    Hotspots
                  </Link>
                </>
              )}

              {/* Staff / Vendor Links */}
              {currentUser?.role === 'staff' && (
                <Link
                  to="/staff"
                  className={`whitespace-nowrap inline-flex items-center gap-2 px-3 py-2 xl:px-3.5 xl:py-2.5 rounded-xl text-[15px] font-semibold transition ${
                    isActive('/staff')
                      ? 'text-amber-700 bg-amber-50/90 shadow-xs ring-1 ring-amber-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Wrench className="w-[18px] h-[18px] text-amber-600 shrink-0" />
                  Vendor Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Report Issue CTA Button */}
            <Link
              to="/report"
              className="whitespace-nowrap inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[15px] font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-102"
            >
              <PlusCircle className="w-5 h-5 shrink-0" />
              <span>Report Issue</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
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
                  <div className="px-5 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      Notifications ({userNotifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
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
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                />
                <div className="hidden xl:block text-left">
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-500 block">
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
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
