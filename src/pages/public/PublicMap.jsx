import React, { useState, useMemo } from 'react';
import { useIssues } from '../../context/IssueContext';
import LeafletMap from '../../components/map/LeafletMap';
import IssueCard from '../../components/issues/IssueCard';
import BackButton from '../../components/common/BackButton';
import { Filter, Layers, MapPin, Search } from 'lucide-react';

export default function PublicMap() {
  const { issues, categories } = useIssues();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIssue, setFocusedIssue] = useState(null);

  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      const matchCat =
        selectedCategory === 'all' || i.category_id === Number(selectedCategory);
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active'
          ? !['resolved', 'rejected'].includes(i.status)
          : i.status === selectedStatus);
      const matchUrgent = !urgentOnly || i.priority === 'urgent';
      const matchSearch =
        !searchTerm.trim() ||
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.tracking_code.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchStatus && matchUrgent && matchSearch;
    });
  }, [issues, selectedCategory, selectedStatus, urgentOnly, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" showDashboardLink={true} />

      {/* Header and Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Public Civic Issues Map
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore geotagged community issues, field worker assignments, and resolved repairs across the city.
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Showing {filteredIssues.length} of {issues.length} Issues
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by title, street or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (Unresolved Only)</option>
              <option value="reported">Reported</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Urgent Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 w-full hover:bg-slate-100">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="text-rose-700">🚨 Urgent Hazards Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Map & Side List View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeafletMap
            issues={filteredIssues}
            height="580px"
            onMarkerClick={(issue) => setFocusedIssue(issue)}
          />
        </div>

        {/* Side issues list */}
        <div className="h-[580px] bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col p-4">
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Issues List ({filteredIssues.length})
            </span>
            {focusedIssue && (
              <button
                onClick={() => setFocusedIssue(null)}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear Focus
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mt-3 pr-1">
            {focusedIssue ? (
              <div className="space-y-3">
                <div className="p-2 bg-blue-50 text-blue-800 text-xs rounded-lg font-medium">
                  Focused Marker from Map:
                </div>
                <IssueCard issue={focusedIssue} />
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No civic issues match your current filters.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.issue_id}
                  onClick={() => setFocusedIssue(issue)}
                  className="cursor-pointer"
                >
                  <IssueCard issue={issue} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
