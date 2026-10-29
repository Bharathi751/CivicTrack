import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import BackButton from '../../components/common/BackButton';
import {
  Search,
  Filter,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  UserCheck,
  X,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export default function AllReports() {
  const { issues, categories, stats, updateIssueStatus, assignIssueToStaff } = useIssues();
  const { staffMembers } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL query parameters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [selectedPriority, setSelectedPriority] = useState(searchParams.get('priority') || 'all');

  // React to URL changes dynamically
  useEffect(() => {
    const urlStatus = searchParams.get('status') || 'all';
    const urlCategory = searchParams.get('category') || 'all';
    const urlPriority = searchParams.get('priority') || 'all';
    const urlQ = searchParams.get('q') || '';

    setSelectedStatus(urlStatus);
    setSelectedCategory(urlCategory);
    setSelectedPriority(urlPriority);
    setSearchTerm(urlQ);
  }, [searchParams]);

  // Synchronize state changes to URL query parameters
  const updateFilterParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };

  const handleStatusTabClick = (statusValue) => {
    setSelectedStatus(statusValue);
    updateFilterParam('status', statusValue);
  };

  const handleClearFilters = () => {
    setSelectedStatus('all');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSearchTerm('');
    setSearchParams({});
  };

  // Quick Action Modal states
  const [activeIssue, setActiveIssue] = useState(null);
  const [modalType, setModalType] = useState(null); // 'assign' | 'status'
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.user_id || '');
  const [assignNote, setAssignNote] = useState('');
  const [newStatus, setNewStatus] = useState('under_review');
  const [statusNote, setStatusNote] = useState('');

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const matchCat =
        selectedCategory === 'all' || i.category_id === Number(selectedCategory);
      const matchStatus = selectedStatus === 'all' || i.status === selectedStatus;
      const matchPriority = selectedPriority === 'all' || i.priority === selectedPriority;
      const matchSearch =
        !searchTerm.trim() ||
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCat && matchStatus && matchPriority && matchSearch;
    });
  }, [issues, selectedCategory, selectedStatus, selectedPriority, searchTerm]);

  const handleOpenAssign = (issue) => {
    setActiveIssue(issue);
    setSelectedStaffId(staffMembers[0]?.user_id || '');
    setAssignNote('');
    setModalType('assign');
  };

  const handleOpenStatus = (issue) => {
    setActiveIssue(issue);
    setNewStatus(issue.status);
    setStatusNote('');
    setModalType('status');
  };

  const handleAssignConfirm = (e) => {
    e.preventDefault();
    const staff = staffMembers.find((s) => s.user_id === Number(selectedStaffId));
    if (staff && activeIssue) {
      assignIssueToStaff(activeIssue.issue_id, staff, assignNote);
      setModalType(null);
      setActiveIssue(null);
    }
  };

  const handleStatusConfirm = (e) => {
    e.preventDefault();
    if (activeIssue) {
      updateIssueStatus(activeIssue.issue_id, newStatus, statusNote);
      setModalType(null);
      setActiveIssue(null);
    }
  };

  const hasActiveFilters =
    selectedStatus !== 'all' ||
    selectedCategory !== 'all' ||
    selectedPriority !== 'all' ||
    searchTerm.trim() !== '';

  const activeCategoryObj = categories.find((c) => c.id === Number(selectedCategory));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-6">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" fallbackPath="/admin" showDashboardLink={true} />

      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Master Triage & Reports Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review incoming citizen complaints, allocate maintenance vendors, and track status transitions in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/vendors"
            className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Manage Vendors ({staffMembers.length})</span>
          </Link>
          <Link
            to="/admin/duplicates"
            className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Review Duplicates &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Interactive Quick Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => handleStatusTabClick('all')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Reports ({issues.length})
        </button>

        <button
          onClick={() => handleStatusTabClick('reported')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'reported'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
          }`}
        >
          Reported ({stats.reported})
        </button>

        <button
          onClick={() => handleStatusTabClick('under_review')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'under_review'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700'
          }`}
        >
          Under Review ({stats.underReview})
        </button>

        <button
          onClick={() => handleStatusTabClick('assigned')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'assigned'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50 hover:text-purple-700'
          }`}
        >
          Assigned ({stats.assigned})
        </button>

        <button
          onClick={() => handleStatusTabClick('in_progress')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'in_progress'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          In Progress ({stats.inProgress})
        </button>

        <button
          onClick={() => handleStatusTabClick('resolved')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
            selectedStatus === 'resolved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          Resolved ({stats.resolved})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, title, citizen..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateFilterParam('q', e.target.value);
              }}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                updateFilterParam('category', e.target.value);
              }}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                updateFilterParam('status', e.target.value);
              }}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="reopened">Reopened</option>
            </select>
          </div>

          <div>
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                updateFilterParam('priority', e.target.value);
              }}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🚨 Urgent Hazards</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-500">Active Filters:</span>
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  Status: {selectedStatus}
                  <button
                    onClick={() => handleStatusTabClick('all')}
                    className="hover:text-indigo-900 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && activeCategoryObj && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Category: {activeCategoryObj.name}
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      updateFilterParam('category', 'all');
                    }}
                    className="hover:text-blue-900 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  Priority: {selectedPriority}
                  <button
                    onClick={() => {
                      setSelectedPriority('all');
                      updateFilterParam('priority', 'all');
                    }}
                    className="hover:text-amber-900 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      updateFilterParam('q', '');
                    }}
                    className="hover:text-slate-900 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Master Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Vendor</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-400 space-y-2">
                    <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-sm">No complaints match your active filters.</p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear All Filters</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((issue) => (
                  <tr
                    key={issue.issue_id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <Link
                        to={`/issue/${issue.issue_id}`}
                        className="hover:underline flex items-center gap-1 cursor-pointer"
                        title="Click to view full issue details"
                      >
                        {issue.tracking_code}
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/issue/${issue.issue_id}`}
                        className="block cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1 transition-colors">
                          {issue.title}
                        </div>
                        <div className="text-slate-500 text-[11px] line-clamp-1">{issue.address}</div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                      {issue.category_name}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={issue.priority} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {issue.assigned_to_name ? (
                        <span className="text-purple-800 font-medium flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span className="truncate max-w-[140px] font-semibold">
                            {issue.assigned_to_name}
                          </span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenAssign(issue)}
                          className="text-amber-700 hover:text-amber-800 font-semibold text-xs flex items-center gap-1 cursor-pointer bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
                        >
                          <span>+ Assign</span>
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleOpenAssign(issue)}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs transition cursor-pointer"
                        title="Assign to maintenance vendor"
                      >
                        Assign
                      </button>

                      <button
                        onClick={() => handleOpenStatus(issue)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs transition cursor-pointer"
                        title="Update report status"
                      >
                        Status
                      </button>

                      <Link
                        to={`/issue/${issue.issue_id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs transition inline-block cursor-pointer"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Assign Modal */}
      {modalType === 'assign' && activeIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Wrench className="w-4 h-4" />
                <span>Assign Issue to Contractor</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-1">
              <div className="font-mono text-xs font-bold text-blue-700">
                {activeIssue.tracking_code}
              </div>
              <h3 className="font-bold text-xs text-slate-900 truncate">{activeIssue.title}</h3>
              <p className="text-[11px] text-slate-500">{activeIssue.address}</p>
            </div>

            <form onSubmit={handleAssignConfirm} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">
                    Select Maintenance Contractor *
                  </label>
                  <Link
                    to="/admin/vendors"
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    + Add New Vendor
                  </Link>
                </div>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white cursor-pointer"
                >
                  {staffMembers.map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {staff.name} — {staff.department} ({staff.contractorCode || 'VND'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Dispatcher Instructions / Special Directives
                </label>
                <textarea
                  rows={3}
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  placeholder="e.g. High priority hot-mix required. Inspect nearby water main before laying asphalt."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Dispatch Contractor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Status Modal */}
      {modalType === 'status' && activeIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Update Official Status</span>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-1">
              <div className="font-mono text-xs font-bold text-blue-700">
                {activeIssue.tracking_code}
              </div>
              <h3 className="font-bold text-xs text-slate-900 truncate">{activeIssue.title}</h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Current Status:</span>
                <StatusBadge status={activeIssue.status} />
              </div>
            </div>

            <form onSubmit={handleStatusConfirm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Target Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white cursor-pointer"
                >
                  <option value="under_review">Under Review (Acknowledged & In Triage)</option>
                  <option value="assigned">Assigned (Contractor Dispatched)</option>
                  <option value="in_progress">In Progress (Active Field Work)</option>
                  <option value="resolved">Resolved (Completed & Verified)</option>
                  <option value="rejected">Rejected (Invalid / Non-Jurisdiction)</option>
                  <option value="reopened">Reopened (Citizen Dispute)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Official Audit Note (Logged in Public Timeline) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Inspected on-site by Ward Engineer. Approved for immediate asphalt patch."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-md"
                >
                  Confirm Status Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
