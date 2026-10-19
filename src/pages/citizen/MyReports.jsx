import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import IssueCard from '../../components/issues/IssueCard';
import { PlusCircle, Search, Filter, FileText } from 'lucide-react';

export default function MyReports() {
  const { currentUser } = useAuth();
  const { issues } = useIssues();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const myIssues = issues.filter((i) => i.user_id === currentUser?.user_id);

  const filtered = myIssues.filter((i) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && ['reported', 'under_review'].includes(i.status)) ||
      (activeTab === 'progress' && ['assigned', 'in_progress'].includes(i.status)) ||
      (activeTab === 'resolved' && i.status === 'resolved');

    const matchesSearch =
      !searchTerm.trim() ||
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Report Another Issue
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'all', label: `All (${myIssues.length})` },
            { id: 'pending', label: 'Under Review' },
            { id: 'progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search my reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
          />
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((issue) => (
            <IssueCard key={issue.issue_id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
