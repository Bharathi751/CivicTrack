import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import {
  Search,
  Filter,
  ShieldAlert,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export default function AllReports() {
  const { issues, categories, updateIssueStatus, assignIssueToStaff } = useIssues();
  const { staffMembers } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            Master Triage & Reports Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming citizen complaints, allocate maintenance vendors, and track status transitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/duplicates"
            className="px-3.5 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition"
          >
            Review Potential Duplicates &rarr;
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, title, citizen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
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
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
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
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🚨 Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Master Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Title & Description</th>
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
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((issue) => (
                  <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {issue.tracking_code}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{issue.title}</div>
                      <div className="text-slate-500 text-[11px] line-clamp-1">{issue.address}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {issue.category_name}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={issue.priority} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {issue.assigned_to_name ? (
                        <span className="text-purple-800 font-medium flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span className="truncate max-w-[140px]">{issue.assigned_to_name.split(' ')[0]}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleOpenAssign(issue)}
                        className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition"
                        title="Assign to maintenance vendor"
                      >
                        Assign
                      </button>

                      <button
                        onClick={() => handleOpenStatus(issue)}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold transition"
                        title="Update report status"
                      >
                        Status
                      </button>

                      <Link
                        to={`/issue/${issue.issue_id}`}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition inline-block"
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

      {/* Assign Modal */}
      {modalType === 'assign' && activeIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              Assign {activeIssue.tracking_code} to Maintenance Vendor
            </h3>
            <form onSubmit={handleAssignConfirm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Vendor / Contractor</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {staffMembers.map((staff) => (
                    <option key={staff.user_id} value={staff.user_id}>
                      {staff.name} ({staff.department || 'Vendor'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Instructions</label>
                <textarea
                  rows={3}
                  value={assignNote}
                  onChange={(e) => setAssignNote(e.target.value)}
                  placeholder="e.g. High priority patch work before evening traffic rush..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {modalType === 'status' && activeIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Update Status for {activeIssue.tracking_code}
            </h3>
            <form onSubmit={handleStatusConfirm} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="reported">Reported</option>
                  <option value="under_review">Under Review</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected (With Reason)</option>
                  <option value="reopened">Reopened</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Audit Log Note</label>
                <textarea
                  required={newStatus === 'rejected'}
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={newStatus === 'rejected' ? 'Mandatory reason for rejection...' : 'Optional triage remarks...'}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Apply Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
