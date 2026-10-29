import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import IssueCard from '../../components/issues/IssueCard';
import BackButton from '../../components/common/BackButton';
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function MyReports() {
  const { currentUser } = useAuth();
  const { issues } = useIssues();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status') || 'all';
  const [activeTab, setActiveTab] = useState(urlStatus);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setActiveTab(searchParams.get('status') || 'all');
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      const next = new URLSearchParams(searchParams);
      next.delete('status');
      setSearchParams(next);
    } else {
      setSearchParams({ status: tabId });
    }
  };

  const myIssues = issues.filter((i) => i.user_id === currentUser?.user_id);

  const myStats = {
    total: myIssues.length,
    pending: myIssues.filter((i) => ['reported', 'under_review'].includes(i.status)).length,
    inProgress: myIssues.filter((i) => ['assigned', 'in_progress'].includes(i.status)).length,
    resolved: myIssues.filter((i) => i.status === 'resolved').length
  };

  const filtered = myIssues.filter((i) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && ['reported', 'under_review'].includes(i.status)) ||
      (activeTab === 'progress' && ['assigned', 'in_progress'].includes(i.status)) ||
      (activeTab === 'resolved' && i.status === 'resolved');

    const matchesSearch =
      !searchTerm.trim() ||
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.address?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" fallbackPath="/citizen" showDashboardLink={true} />

      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Civic Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track and manage all reports registered under your account ({currentUser?.email})
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Another Issue</span>
        </Link>
      </div>

      {/* KPI Cards (100% Clickable & Filter Dynamic) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submitted */}
        <div
          onClick={() => handleTabChange('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'all'
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
              : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
          }`}
          title="Click to view all your reported issues"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">My Reports</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{myStats.total}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Total submitted</span>
            <span className="text-[10px] text-blue-600 font-bold">
              {activeTab === 'all' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* Awaiting Review */}
        <div
          onClick={() => handleTabChange('pending')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'pending'
              ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-200'
              : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-md'
          }`}
          title="Click to view reports awaiting municipal review"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-indigo-600">Awaiting Review</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-2">{myStats.pending}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Under municipal triage</span>
            <span className="text-[10px] text-indigo-600 font-bold">
              {activeTab === 'pending' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* Active Repair */}
        <div
          onClick={() => handleTabChange('progress')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'progress'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-200'
              : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-md'
          }`}
          title="Click to view reports with active repair crews dispatched"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-600">Active Repair</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{myStats.inProgress}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Crew dispatched</span>
            <span className="text-[10px] text-amber-600 font-bold">
              {activeTab === 'progress' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => handleTabChange('resolved')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'resolved'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md'
          }`}
          title="Click to view verified complete resolutions"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-600">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{myStats.resolved}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Verified complete</span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {activeTab === 'resolved' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {[
            { id: 'all', label: `All Reports (${myStats.total})` },
            { id: 'pending', label: `Under Review (${myStats.pending})` },
            { id: 'progress', label: `In Progress (${myStats.inProgress})` },
            { id: 'resolved', label: `Resolved (${myStats.resolved})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by code, title, street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(activeTab !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                handleTabChange('all');
                setSearchTerm('');
              }}
              title="Reset filters"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer text-xs flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No Reports Found</h3>
          <p className="text-xs text-slate-400">
            {myIssues.length === 0
              ? "You haven't submitted any civic issue reports yet."
              : 'No reports match your selected filter criteria.'}
          </p>
          {(activeTab !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                handleTabChange('all');
                setSearchTerm('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Show All Reports
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((issue) => (
            <IssueCard key={issue.issue_id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
