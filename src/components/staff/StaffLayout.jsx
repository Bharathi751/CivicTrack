import React, { useState } from 'react';
import StaffSidebar from './StaffSidebar';
import { Menu, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';

export default function StaffLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { currentUser } = useAuth();
  const { issues } = useIssues();

  const assignedIssues = issues.filter(
    (i) => i.assigned_to === currentUser?.user_id || (!i.assigned_to && i.status === 'assigned')
  );
  const activeCount = assignedIssues.filter((i) =>
    ['assigned', 'in_progress', 'reopened'].includes(i.status)
  ).length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top Sub-Bar for Staff/Vendor (Toggles Sidebar) */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-20 z-20">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:text-white flex items-center gap-2 text-xs font-bold cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>Vendor Menu</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-300">Active Jobs:</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px]">
            {activeCount}
          </span>
        </div>
      </div>

      {/* Staff Sidebar */}
      <StaffSidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Staff Page Content */}
      <div className="flex-1 min-w-0 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
