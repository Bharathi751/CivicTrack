import React, { useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LeafletMap from '../../components/map/LeafletMap';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  Edit3,
  Calendar,
  Navigation,
  FileCheck
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const COMPLETION_PHOTOS = [
  {
    name: 'Asphalt Patch Reinstated',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Sanitation Cleaned & Cleared',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Streetlight LED Replaced',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  }
];

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const { issues, submitVendorWorkUpdate } = useIssues();

  // Find issues assigned to this vendor/staff (or all if unassigned for demo purposes)
  const assignedIssues = issues.filter(
    (i) => i.assigned_to === currentUser?.user_id || (!i.assigned_to && i.status === 'assigned')
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab') || 'active';
  const activeTab = currentTabParam;

  const setActiveTab = (newTab) => {
    setSearchParams({ tab: newTab });
  };

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // Form states inside modal
  const [targetStatus, setTargetStatus] = useState('in_progress');
  const [workNotes, setWorkNotes] = useState('');
  const [completionImage, setCompletionImage] = useState(COMPLETION_PHOTOS[0].url);

  const filteredIssues = assignedIssues.filter((i) => {
    if (activeTab === 'active') return ['assigned', 'in_progress', 'reopened'].includes(i.status);
    if (activeTab === 'resolved') return i.status === 'resolved';
    if (activeTab === 'urgent') return i.priority === 'urgent' && i.status !== 'resolved';
    return true;
  });

  const vendorStats = {
    totalAssigned: assignedIssues.length,
    activeWork: assignedIssues.filter((i) => ['assigned', 'in_progress'].includes(i.status)).length,
    completed: assignedIssues.filter((i) => i.status === 'resolved').length,
    urgent: assignedIssues.filter((i) => i.priority === 'urgent' && i.status !== 'resolved').length
  };

  const handleOpenUpdate = (issue) => {
    setSelectedIssue(issue);
    setTargetStatus(issue.status === 'assigned' ? 'in_progress' : 'resolved');
    setWorkNotes(issue.work_notes || '');
    setCompletionImage(issue.completion_image || COMPLETION_PHOTOS[0].url);
    setUpdateModalOpen(true);
  };

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    submitVendorWorkUpdate(selectedIssue.issue_id, {
      newStatus: targetStatus,
      workNotes: workNotes.trim(),
      completionImage: targetStatus === 'resolved' ? completionImage : null
    });

    setUpdateModalOpen(false);
    setSelectedIssue(null);
    setWorkNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Vendor Profile Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-xs font-semibold text-amber-200">
            <Wrench className="w-3.5 h-3.5" />
            Field Maintenance & Contractor Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100">
            Department: <strong>{currentUser?.department || 'Roads & Infrastructure'}</strong> • Contractor Code: <strong>{currentUser?.contractorCode || 'VND-RD-402'}</strong>
          </p>
        </div>

        <div className="bg-amber-900/60 border border-amber-600/40 p-4 rounded-xl text-center min-w-[160px]">
          <span className="text-xs text-amber-200 block uppercase font-bold tracking-wider">
            Active Jobs
          </span>
          <span className="text-3xl font-extrabold text-white mt-1 block">
            {vendorStats.activeWork}
          </span>
        </div>
      </div>

      {/* KPI Cards (100% Clickable & Tab Dynamic) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'all'
              ? 'bg-slate-50 border-slate-600 ring-2 ring-slate-300'
              : 'bg-white border-slate-200/90 hover:border-slate-400 hover:scale-102 hover:shadow-md'
          }`}
          title="Click to view all work orders"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Assigned</span>
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{vendorStats.totalAssigned}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Total work orders</span>
            <span className="text-[10px] text-slate-700 font-bold">
              {activeTab === 'all' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* In Active Progress */}
        <div
          onClick={() => setActiveTab('active')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'active'
              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-200'
              : 'bg-white border-slate-200/90 hover:border-amber-400 hover:scale-102 hover:shadow-md'
          }`}
          title="Click to view work orders in active progress"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-600">In Active Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{vendorStats.activeWork}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Crews currently on-site</span>
            <span className="text-[10px] text-amber-600 font-bold">
              {activeTab === 'active' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* Completed & Verified */}
        <div
          onClick={() => setActiveTab('resolved')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'resolved'
              ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200'
              : 'bg-white border-slate-200/90 hover:border-emerald-400 hover:scale-102 hover:shadow-md'
          }`}
          title="Click to view completed and verified jobs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-600">Completed & Verified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{vendorStats.completed}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-emerald-600 font-semibold">Repairs closed</span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {activeTab === 'resolved' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>

        {/* Urgent Hazards */}
        <div
          onClick={() => setActiveTab('urgent')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-xs flex flex-col justify-between ${
            activeTab === 'urgent'
              ? 'bg-rose-50/70 border-rose-500 ring-2 ring-rose-200'
              : 'bg-white border-slate-200/90 hover:border-rose-400 hover:scale-102 hover:shadow-md'
          }`}
          title="Click to view urgent hazards"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-rose-600">Urgent Hazards</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{vendorStats.urgent}</div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Immediate attention</span>
            <span className="text-[10px] text-rose-600 font-bold">
              {activeTab === 'urgent' ? '● Active' : 'Filter &rarr;'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Assigned Tasks + Field Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 cols): Tasks Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-600" />
              Work Order Queue
            </h2>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({vendorStats.activeWork})
              </button>
              <button
                onClick={() => setActiveTab('resolved')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'resolved'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({vendorStats.completed})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({vendorStats.totalAssigned})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredIssues.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 shadow-xs">
                No work orders found in this view.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.issue_id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:shadow-md transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {issue.tracking_code}
                      </span>
                      <PriorityBadge priority={issue.priority} />
                      <span className="text-xs font-bold text-slate-500 uppercase">{issue.category_name}</span>
                    </div>
                    <StatusBadge status={issue.status} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-1">
                      <img
                        src={issue.images?.[0]}
                        alt={issue.title}
                        className="w-full h-28 object-cover rounded-xl border border-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-3 space-y-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{issue.address}</span>
                      </div>
                    </div>
                  </div>

                  {issue.work_notes && (
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">Latest Work Progress Note:</span>
                      <p className="text-amber-800">{issue.work_notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Get GPS Route Navigation
                    </a>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/issue/${issue.issue_id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                      >
                        Inspect Details
                      </Link>

                      {issue.status !== 'resolved' && (
                        <button
                          onClick={() => handleOpenUpdate(issue)}
                          className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update Work / Close Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right (1 col): Field Navigation Map */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Field Job Locations
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <LeafletMap
              issues={assignedIssues}
              height="380px"
              zoom={13}
            />
            <span className="text-[11px] text-slate-400 block text-center">
              All assigned locations for {currentUser?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Vendor Update Modal */}
      {updateModalOpen && selectedIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                Submit Field Work Update
              </h3>
              <span className="font-mono text-xs font-bold text-blue-700">
                {selectedIssue.tracking_code}
              </span>
            </div>

            <form onSubmit={handleSubmitUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Update Work Order Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('in_progress')}
                    className={`p-2.5 rounded-xl border text-center transition font-semibold text-xs cursor-pointer ${
                      targetStatus === 'in_progress'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 ring-1 ring-amber-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🛠️ Work In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('resolved')}
                    className={`p-2.5 rounded-xl border text-center transition font-semibold text-xs cursor-pointer ${
                      targetStatus === 'resolved'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ✓ Work Completed (Resolved)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  On-Site Work Notes & Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="Detail materials used, team members on site, test results, or completion confirmation..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {targetStatus === 'resolved' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Attach Proof of Completion Photograph (After-Repair)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COMPLETION_PHOTOS.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCompletionImage(photo.url)}
                        className={`p-1 rounded-lg border text-left overflow-hidden transition cursor-pointer ${
                          completionImage === photo.url
                            ? 'ring-2 ring-emerald-600 border-emerald-600'
                            : 'border-slate-200'
                        }`}
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-16 object-cover rounded"
                        />
                        <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
                          {photo.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition"
                >
                  Publish Field Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
