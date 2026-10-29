import React from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  CopyCheck,
  Flame,
  ArrowRight,
  TrendingUp,
  FileCheck,
  HardHat,
  Plus,
  Activity,
  Check,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { stats, issues, categories } = useIssues();
  const { currentUser, staffMembers } = useAuth();

  const unreviewedIssues = issues
    .filter((i) => ['reported', 'under_review'].includes(i.status))
    .slice(0, 5);

  const urgentHazards = issues
    .filter((i) => i.priority === 'urgent' && i.status !== 'resolved')
    .slice(0, 5);

  // Vendor workload summary
  const vendorWorkloads = staffMembers.map((v) => {
    const assigned = issues.filter((i) => i.assigned_to === v.user_id);
    const active = assigned.filter((i) => ['assigned', 'in_progress', 'reopened'].includes(i.status)).length;
    return {
      ...v,
      totalAssigned: assigned.length,
      activeJobs: active
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Building2 className="w-3.5 h-3.5" />
            Metropolitan Civic Administration & Triage Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Welcome, {currentUser?.name}. Click any metric card or category below to immediately filter and inspect complaints in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/vendors"
            className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <HardHat className="w-4 h-4" />
            <span>Vendors & Staff ({staffMembers.length})</span>
          </Link>
          <Link
            to="/admin/reports"
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Triage Queue ({stats.reported + stats.underReview})</span>
          </Link>
          <Link
            to="/admin/duplicates"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <CopyCheck className="w-4 h-4 text-amber-400" />
            <span>Duplicates</span>
          </Link>
          <Link
            to="/admin/hotspots"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            <span>Hotspots</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards (100% Clickable & Dynamic Link Filters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Reports */}
        <Link
          to="/admin/reports"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view all submissions"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 group-hover:text-indigo-600 block">
              Total Reports
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.total}
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-2">
            <span>View all queue</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        {/* Reported */}
        <Link
          to="/admin/reports?status=reported"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to filter new unassigned complaints"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-sky-600 block">
              Reported
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-600 mt-1">
              {stats.reported}
            </div>
          </div>
          <span className="text-[10px] text-sky-600 font-bold flex items-center gap-0.5 mt-2">
            <span>Filter new &rarr;</span>
          </span>
        </Link>

        {/* Under Review */}
        <Link
          to="/admin/reports?status=under_review"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view complaints under official review"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-indigo-600 block">
              Under Review
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">
              {stats.underReview}
            </div>
          </div>
          <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 mt-2">
            <span>Filter review &rarr;</span>
          </span>
        </Link>

        {/* Assigned */}
        <Link
          to="/admin/reports?status=assigned"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view work orders assigned to contractors"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-purple-600 block">
              Assigned
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-1">
              {stats.assigned}
            </div>
          </div>
          <span className="text-[10px] text-purple-600 font-bold flex items-center gap-0.5 mt-2">
            <span>Filter assigned &rarr;</span>
          </span>
        </Link>

        {/* In Progress */}
        <Link
          to="/admin/reports?status=in_progress"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view field operations currently in progress"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-600 block">
              In Progress
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {stats.inProgress}
            </div>
          </div>
          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 mt-2">
            <span>Filter active &rarr;</span>
          </span>
        </Link>

        {/* Resolved */}
        <Link
          to="/admin/reports?status=resolved"
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view completed resolutions"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-600 block">
              Resolved
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.resolved}
            </div>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-2">
            <span>{stats.resolutionRate}% success &rarr;</span>
          </span>
        </Link>
      </div>

      {/* Urgent Hazard Alert (if any active) */}
      {urgentHazards.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-rose-900">
                Critical Hazards Requiring Immediate Municipal Intervention ({urgentHazards.length})
              </h2>
            </div>
            <Link
              to="/admin/reports?priority=urgent"
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Urgent Hazards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentHazards.slice(0, 2).map((h) => (
              <Link
                key={h.issue_id}
                to={`/issue/${h.issue_id}`}
                className="bg-white p-3.5 rounded-xl border border-rose-200/80 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md hover:border-rose-400 transition cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      {h.tracking_code}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{h.category_name}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 truncate mt-1 group-hover:text-rose-700">
                    {h.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">{h.address}</p>
                </div>
                <span className="px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-700 text-white text-xs font-bold shrink-0 transition flex items-center gap-1">
                  <span>Dispatch</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mid Section: Triage Queue + Vendor Workload Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left (2 cols): Unreviewed Reports Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Incoming Reports Awaiting Triage & Assignment
            </h2>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Master Queue</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs divide-y divide-slate-100">
            {unreviewedIssues.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                All incoming citizen reports have been reviewed!
              </div>
            ) : (
              unreviewedIssues.map((issue) => (
                <div
                  key={issue.issue_id}
                  className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-4 group"
                >
                  <Link
                    to={`/issue/${issue.issue_id}`}
                    className="space-y-1 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {issue.tracking_code}
                      </span>
                      <PriorityBadge priority={issue.priority} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{issue.category_name}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">{issue.address}</p>
                  </Link>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={issue.status} />
                    <Link
                      to={`/issue/${issue.issue_id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Triage</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vendor Workload Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Enrolled Maintenance Contractors Workload
                </h3>
              </div>
              <Link
                to="/admin/vendors"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add / Manage Vendors</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vendorWorkloads.map((vendor) => (
                <Link
                  key={vendor.user_id}
                  to="/admin/vendors"
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-amber-50/40 hover:border-amber-300 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  title="Click to manage vendor details and work orders"
                >
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-800 truncate">
                      {vendor.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block truncate">{vendor.department}</span>
                    <span className="font-mono text-[10px] text-amber-700 font-semibold">{vendor.contractorCode}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      {vendor.activeJobs} Active Jobs
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right (1 col): Category Distribution & SLAs (Clickable Category Links) */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Category Distribution
              </h2>
              <span className="text-[11px] text-slate-400">Click to filter</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
              {categories.map((cat) => {
                const count = issues.filter((i) => i.category_id === cat.id).length;
                const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <Link
                    key={cat.id}
                    to={`/admin/reports?category=${cat.id}`}
                    className="block p-2 rounded-xl hover:bg-indigo-50/60 transition-all cursor-pointer group"
                    title={`Click to filter only ${cat.name} reports in triage`}
                  >
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 group-hover:text-indigo-700 group-hover:font-bold">
                        {cat.name}
                      </span>
                      <span className="text-slate-500 group-hover:text-indigo-600">
                        {count} ({percent}%) &rarr;
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 group-hover:bg-indigo-700 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Analytics Summary (Clickable to filtered views) */}
          <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3.5">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 block">
              SLA Compliance Target
            </span>
            <Link
              to="/admin/reports?status=resolved"
              className="flex items-center justify-between text-xs hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
            >
              <span className="text-indigo-200">Average Resolution Time:</span>
              <span className="font-bold text-white">48 Hours &rarr;</span>
            </Link>
            <Link
              to="/admin/reports?status=in_progress"
              className="flex items-center justify-between text-xs hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
            >
              <span className="text-indigo-200">Contractor Response Rate:</span>
              <span className="font-bold text-emerald-400">94.2% &rarr;</span>
            </Link>
            <div className="flex items-center justify-between text-xs p-1.5">
              <span className="text-indigo-200">Citizen Satisfaction Score:</span>
              <span className="font-bold text-amber-300">4.8 / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
