import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, Building2, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';

export default function AdminLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const { stats } = useIssues();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Sub-Bar for Admin (Toggles Sidebar) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-20 z-20">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-800 text-indigo-400 hover:text-white flex items-center gap-2 text-xs font-bold cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Admin Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-300">Triage Queue:</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
            {stats.reported + stats.underReview}
          </span>
        </div>
      </div>

      {/* Admin Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Admin Page Content */}
      <div className="flex-1 min-w-0 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
