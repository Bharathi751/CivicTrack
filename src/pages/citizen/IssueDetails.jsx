import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/issues/Timeline';
import LeafletMap from '../../components/map/LeafletMap';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Wrench,
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Check,
  Edit3
} from 'lucide-react';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    issues,
    getIssueHistory,
    updateIssueStatus,
    assignIssueToStaff,
    submitVendorWorkUpdate,
    reopenIssue
  } = useIssues();
  const { currentUser, staffMembers } = useAuth();

  const issue = issues.find((i) => i.issue_id === Number(id));
  const history = issue ? getIssueHistory(issue.issue_id) : [];

  // Modals state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.user_id || '');
  const [assignmentNote, setAssignmentNote] = useState('');

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('under_review');
  const [statusNote, setStatusNote] = useState('');

  const [vendorUpdateOpen, setVendorUpdateOpen] = useState(false);
  const [vendorNotes, setVendorNotes] = useState('');
  const [vendorStatus, setVendorStatus] = useState('in_progress');
  const [vendorPhoto, setVendorPhoto] = useState(
    'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
  );

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  const [copied, setCopied] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Issue Report Not Found</h2>
        <p className="text-xs text-slate-500">The report you are looking for may have been removed or does not exist.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
          Return to Portal Home
        </Link>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(issue.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const staff = staffMembers.find((s) => s.user_id === Number(selectedStaffId));
    if (staff) {
      assignIssueToStaff(issue.issue_id, staff, assignmentNote);
      setAssignModalOpen(false);
      setAssignmentNote('');
    }
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateIssueStatus(issue.issue_id, newStatus, statusNote);
    setStatusModalOpen(false);
    setStatusNote('');
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    submitVendorWorkUpdate(issue.issue_id, {
      newStatus: vendorStatus,
      workNotes: vendorNotes,
      completionImage: vendorStatus === 'resolved' ? vendorPhoto : null
    });
    setVendorUpdateOpen(false);
    setVendorNotes('');
  };

  const handleReopenSubmit = (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    reopenIssue(issue.issue_id, reopenReason.trim());
    setReopenModalOpen(false);
    setReopenReason('');
  };

  const isOwner = currentUser?.user_id === issue.user_id;
  const isAdmin = currentUser?.role === 'admin';
  const isAssignedStaff = currentUser?.role === 'staff' && (issue.assigned_to === currentUser?.user_id || !issue.assigned_to);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button & tracking bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Code Copied!' : `Tracking: ${issue.tracking_code}`}</span>
          </button>
        </div>
      </div>

      {/* Role Action Banners */}
      {isAdmin && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-700" />
            <div>
              <span className="font-bold text-xs text-indigo-900 block">Municipal Administrator Controls</span>
              <span className="text-[11px] text-indigo-700">You can triage, change status, or assign this complaint to maintenance contractors.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssignModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition"
            >
              Assign Vendor / Staff
            </button>
            <button
              onClick={() => setStatusModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-semibold text-xs transition"
            >
              Change Status
            </button>
          </div>
        </div>
      )}

      {isAssignedStaff && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-700" />
            <div>
              <span className="font-bold text-xs text-amber-900 block">Vendor & Field Worker Controls</span>
              <span className="text-[11px] text-amber-700">Update active on-site progress, add field notes, or upload completion photos to resolve.</span>
            </div>
          </div>
          <button
            onClick={() => setVendorUpdateOpen(true)}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Submit Work Progress / Close Repair
          </button>
        </div>
      )}

      {/* Main Grid: Details + Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Details, Media, Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  {issue.category_name}
                </span>
                <PriorityBadge priority={issue.priority} />
              </div>
              <StatusBadge status={issue.status} />
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {issue.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                {issue.address}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(issue.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-slate-400" />
                Reporter: {issue.citizen_name}
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Problem Description
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {issue.description}
              </p>
            </div>

            {/* Photos */}
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Photographic Evidence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Initial Report Photo
                  </span>
                  <img
                    src={issue.images?.[0]}
                    alt="Initial report"
                    className="w-full h-52 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                </div>

                {issue.completion_image && (
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-600 block mb-1">
                      ✓ After-Repair Proof of Resolution
                    </span>
                    <img
                      src={issue.completion_image}
                      alt="Completed work"
                      className="w-full h-52 object-cover rounded-xl border-2 border-emerald-400 shadow-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Citizen Reopen Option */}
            {issue.status === 'resolved' && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-wrap items-center justify-between gap-3 mt-4">
                <div>
                  <span className="font-bold text-xs text-orange-900 block">
                    Has the problem returned or was it incomplete?
                  </span>
                  <span className="text-[11px] text-orange-700">
                    You can request to reopen this ticket for municipal reinspection.
                  </span>
                </div>
                <button
                  onClick={() => setReopenModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reopen Issue
                </button>
              </div>
            )}
          </div>

          {/* Assigned Vendor Details Card */}
          {issue.assigned_to_name && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-purple-600" />
                Assigned Municipal Contractor / Department
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{issue.assigned_to_name}</h4>
                  <span className="text-xs text-slate-500">
                    Assigned on {new Date(issue.assigned_at || issue.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  Active Vendor Order
                </span>
              </div>
              {issue.work_notes && (
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Contractor Work Log:</span>
                  <p className="text-slate-600 leading-relaxed">{issue.work_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Map Pin & Status History Timeline */}
        <div className="space-y-6">
          {/* Mini Leaflet Map */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Geographic Location Pin
            </h3>
            <LeafletMap
              issues={[issue]}
              center={[issue.latitude, issue.longitude]}
              zoom={15}
              height="220px"
            />
            <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-200">
              GPS: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
            </div>
          </div>

          {/* Complete Status History Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-4 h-4 text-blue-600" />
              Audit & Transition Log
            </h3>
            <Timeline history={history} />
          </div>
        </div>
      </div>

      {/* Admin Assign Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Assign Issue to Maintenance Vendor
            </h3>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Contractor / Department</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Instructions / Notes</label>
                <textarea
                  rows={3}
                  value={assignmentNote}
                  onChange={(e) => setAssignmentNote(e.target.value)}
                  placeholder="e.g. Please dispatch the patch crew by tomorrow 10am..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
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

      {/* Admin Status Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Change Workflow Status</h3>
            <form onSubmit={handleStatusSubmit} className="space-y-3">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Municipal Justification Note</label>
                <textarea
                  required={newStatus === 'rejected'}
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={newStatus === 'rejected' ? 'Mandatory reason for rejection...' : 'Optional comment...'}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Work Progress Modal */}
      {vendorUpdateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              Vendor Field Progress & Completion Update
            </h3>
            <form onSubmit={handleVendorSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={vendorStatus}
                  onChange={(e) => setVendorStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="in_progress">Work In Progress (Active on site)</option>
                  <option value="resolved">Work Completed & Resolved (With Photo)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Work Notes</label>
                <textarea
                  required
                  rows={3}
                  value={vendorNotes}
                  onChange={(e) => setVendorNotes(e.target.value)}
                  placeholder="Detail materials used, team on site, or completion confirmation..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {vendorStatus === 'resolved' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Proof of Completion Photo
                  </label>
                  <img
                    src={vendorPhoto}
                    alt="After repair preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200 mb-2"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    ✓ Verified resolution photo ready to attach
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVendorUpdateOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Submit Field Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Citizen Reopen Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-600" />
              Reopen Civic Report
            </h3>
            <p className="text-xs text-slate-600">
              State why this repair is unsatisfactory or incomplete for municipal re-evaluation.
            </p>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. Patch broke again within 24 hours..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReopenModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReopenSubmit}
                disabled={!reopenReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm Reopen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
