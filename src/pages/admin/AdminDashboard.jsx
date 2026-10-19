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
  FileCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const { stats, issues, categories } = useIssues();
  const { currentUser } = useAuth();

  const unreviewedIssues = issues
    .filter((i) => ['reported', 'under_review'].includes(i.status))
    .slice(0, 5);

  const urgentHazards = issues
    .filter((i) => i.priority === 'urgent' && i.status !== 'resolved')
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-300">
            <Building2 className="w-3.5 h-3.5" />
            Metropolitan Civic Administration & Triage Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Municipal Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Welcome, {currentUser?.name}. Real-time monitoring of civic reports, vendor assignments, and duplicate detection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            Triage Queue ({stats.reported + stats.underReview})
          </Link>
          <Link
            to="/admin/duplicates"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <CopyCheck className="w-4 h-4 text-amber-400" />
            Duplicate Review
          </Link>
          <Link
            to="/admin/hotspots"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4 text-rose-400" />
            Hotspot Map
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Reports</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
          <span className="text-[10px] text-slate-400">All submissions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-sky-600 block">Reported</span>
          <div className="text-2xl font-extrabold text-sky-600 mt-1">{stats.reported}</div>
          <span className="text-[10px] text-slate-400">Fresh submissions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-indigo-600 block">Under Review</span>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">{stats.underReview}</div>
          <span className="text-[10px] text-slate-400">In triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-purple-600 block">Assigned</span>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{stats.assigned}</div>
          <span className="text-[10px] text-slate-400">Vendor dispatched</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-amber-600 block">In Progress</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.inProgress}</div>
          <span className="text-[10px] text-slate-400">Field work active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase text-emerald-600 block">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{stats.resolutionRate}% success</span>
        </div>
      </div>

      {/* Main Grid: Pending Triage + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 cols): Unreviewed Reports Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Incoming Reports Awaiting Triage & Assignment
            </h2>
            <Link
              to="/admin/reports"
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View Full Master Queue &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {unreviewedIssues.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                All incoming reports have been triaged!
              </div>
            ) : (
              unreviewedIssues.map((issue) => (
                <div key={issue.issue_id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {issue.tracking_code}
                      </span>
                      <PriorityBadge priority={issue.priority} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{issue.category_name}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 truncate">{issue.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{issue.address}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={issue.status} />
                    <Link
                      to={`/issue/${issue.issue_id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                    >
                      Triage &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Category Distribution
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            {categories.map((cat) => {
              const count = issues.filter((i) => i.category_id === cat.id).length;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-500">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Analytics Summary */}
          <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-indigo-300 block">
              SLA Compliance Target
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-200">Average Resolution Time:</span>
              <span className="font-bold text-sm text-white">48 Hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-indigo-200">Contractor Response Rate:</span>
              <span className="font-bold text-sm text-emerald-400">94.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
