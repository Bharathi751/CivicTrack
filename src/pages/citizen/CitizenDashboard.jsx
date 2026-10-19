import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import IssueCard from '../../components/issues/IssueCard';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function CitizenDashboard() {
  const { currentUser } = useAuth();
  const { issues, notifications } = useIssues();

  const myIssues = issues.filter((i) => i.user_id === currentUser?.user_id);

  const myStats = {
    total: myIssues.length,
    inProgress: myIssues.filter((i) => ['assigned', 'in_progress'].includes(i.status)).length,
    resolved: myIssues.filter((i) => i.status === 'resolved').length,
    pending: myIssues.filter((i) => ['reported', 'under_review'].includes(i.status)).length
  };

  const userNotifications = notifications
    .filter((n) => n.recipient_user_id === currentUser?.user_id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Quick Report Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Citizen Self-Service Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Report local potholes, broken street lamps, or sanitation hazards in your ward and track their real-time resolution by municipal crews.
          </p>
        </div>

        <Link
          to="/report"
          className="px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-blue-600" />
          Report New Issue
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">My Reports</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{myStats.total}</div>
          <span className="text-[11px] text-slate-400">Total submitted</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Awaiting Review</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{myStats.pending}</div>
          <span className="text-[11px] text-slate-400">Under municipal triage</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Active Repair</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">{myStats.inProgress}</div>
          <span className="text-[11px] text-slate-400">Crew dispatched</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{myStats.resolved}</div>
          <span className="text-[11px] text-slate-400">Verified complete</span>
        </div>
      </div>

      {/* Main Content: Recent Reports + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: My Reported Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My Recent Submissions</h2>
            <Link
              to="/citizen/my-reports"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              View all ({myIssues.length}) &rarr;
            </Link>
          </div>

          {myIssues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700 text-sm">No Reports Submitted Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Spotted a pothole, broken streetlight or overflowing waste container? Report it to get it fixed!
              </p>
              <Link
                to="/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shadow hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4" />
                Report First Issue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myIssues.slice(0, 4).map((issue) => (
                <IssueCard key={issue.issue_id} issue={issue} />
              ))}
            </div>
          )}
        </div>

        {/* Right: In-App Updates Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Status Updates</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 divide-y divide-slate-100 shadow-xs">
            {userNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No recent activity.
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div key={notif.notification_id} className="py-3 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">{notif.title}</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block">
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
      </div>
    </div>
  );
}
