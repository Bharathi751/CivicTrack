import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/issues/Timeline';
import BackButton from '../../components/common/BackButton';
import {
  Search,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  Wrench,
  AlertCircle,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

export default function TrackIssue() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryCode = new URLSearchParams(search).get('code') || '';
  const [searchInput, setSearchInput] = useState(queryCode);
  const [searchedCode, setSearchedCode] = useState(queryCode);

  const { issues, getIssueHistory, reopenIssue } = useIssues();
  const { currentUser } = useAuth();

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');

  useEffect(() => {
    if (queryCode) {
      setSearchInput(queryCode);
      setSearchedCode(queryCode);
    }
  }, [queryCode]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchedCode(searchInput.trim());
      navigate(`/track?code=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const matchedIssue = issues.find(
    (i) => i.tracking_code?.toLowerCase() === searchedCode.trim().toLowerCase()
  );

  const history = matchedIssue ? getIssueHistory(matchedIssue.issue_id) : [];

  const maskName = (name) => {
    if (!name) return 'Anonymous Citizen';
    const parts = name.split(' ');
    return parts.map((p) => p[0] + '***').join(' ');
  };

  const handleReopenSubmit = (e) => {
    e.preventDefault();
    if (!reopenReason.trim() || !matchedIssue) return;
    reopenIssue(matchedIssue.issue_id, reopenReason.trim());
    setReopenModalOpen(false);
    setReopenReason('');
  };

  // Status step calculation
  const getStepProgress = (status) => {
    switch (status) {
      case 'reported':
        return 1;
      case 'under_review':
        return 2;
      case 'assigned':
        return 3;
      case 'in_progress':
        return 4;
      case 'resolved':
        return 5;
      case 'rejected':
        return 0;
      default:
        return 2;
    }
  };

  const currentStep = matchedIssue ? getStepProgress(matchedIssue.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" showDashboardLink={true} />

      {/* Search Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Issue Tracking Portal
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Enter your unique Tracking Code to check live municipal status, assigned vendor, and timeline logs.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2">
          <div className="flex rounded-xl bg-white border-2 border-blue-600 p-1 shadow-sm">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. TRK-2026-101"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent border-0 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-hidden text-sm uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      {searchedCode && !matchedIssue && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Report Found for "{searchedCode}"</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Please verify the tracking code. Try sample codes:
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setSearchInput('TRK-2026-101');
                setSearchedCode('TRK-2026-101');
              }}
              className="px-3 py-1 bg-white rounded border border-amber-300 text-xs font-mono text-blue-700 font-bold"
            >
              TRK-2026-101
            </button>
            <button
              onClick={() => {
                setSearchInput('TRK-2026-104');
                setSearchedCode('TRK-2026-104');
              }}
              className="px-3 py-1 bg-white rounded border border-amber-300 text-xs font-mono text-blue-700 font-bold"
            >
              TRK-2026-104
            </button>
          </div>
        </div>
      )}

      {matchedIssue && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-blue-500/30 border border-blue-400/40 text-blue-200 font-bold tracking-wider">
                  {matchedIssue.tracking_code}
                </span>
                <span className="text-xs font-medium text-slate-300">
                  Category: {matchedIssue.category_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={matchedIssue.priority} />
                <StatusBadge status={matchedIssue.status} />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              {matchedIssue.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {matchedIssue.address}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Reported {new Date(matchedIssue.created_at).toLocaleDateString()}
              </span>
              <span className="text-slate-400">
                Reporter: {maskName(matchedIssue.citizen_name)} (Privacy Protected)
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {matchedIssue.status !== 'rejected' && (
            <div className="px-6 py-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4">
                Resolution Workflow Stage:
              </span>
              <div className="grid grid-cols-5 gap-2 text-center">
                {[
                  { label: 'Reported', step: 1 },
                  { label: 'Under Review', step: 2 },
                  { label: 'Assigned', step: 3 },
                  { label: 'In Progress', step: 4 },
                  { label: 'Resolved', step: 5 }
                ].map((s) => {
                  const isComplete = currentStep >= s.step;
                  const isCurrent = currentStep === s.step;
                  return (
                    <div key={s.step} className="space-y-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isComplete ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-semibold block ${
                          isCurrent
                            ? 'text-blue-600'
                            : isComplete
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description & Contractor Notes */}
          <div className="px-6 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Issue Description
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {matchedIssue.description}
              </p>
            </div>

            {matchedIssue.assigned_to_name && (
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                <Wrench className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-purple-900 block">
                    Assigned Maintenance Contractor / Vendor
                  </span>
                  <p className="text-xs text-purple-800 font-medium">
                    {matchedIssue.assigned_to_name}
                  </p>
                  {matchedIssue.work_notes && (
                    <p className="text-xs text-purple-700 mt-2 bg-white/80 p-2.5 rounded border border-purple-200">
                      <strong>Vendor Progress Note:</strong> {matchedIssue.work_notes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Photo Gallery (Before & After) */}
          <div className="px-6 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Photographic Evidence
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Reported Issue Photo (Initial)
                </span>
                <img
                  src={matchedIssue.images?.[0]}
                  alt="Initial Issue"
                  className="w-full h-48 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
              </div>

              {matchedIssue.completion_image && (
                <div>
                  <span className="text-[11px] font-semibold text-emerald-600 block mb-1">
                    ✓ Verified Resolution Photo (After Repair)
                  </span>
                  <img
                    src={matchedIssue.completion_image}
                    alt="After repair proof"
                    className="w-full h-48 rounded-xl object-cover border-2 border-emerald-300 shadow-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reopen Action for Citizen */}
          {matchedIssue.status === 'resolved' && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-xs text-slate-900 block">
                  Problem Still Not Fixed?
                </span>
                <span className="text-xs text-slate-500">
                  Citizens can reopen an issue within 7 days if the problem reoccurs.
                </span>
              </div>
              <button
                onClick={() => setReopenModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Request Issue Reopen
              </button>
            </div>
          )}

          {/* Status History Timeline */}
          <div className="p-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Complete Municipal Audit & Status Timeline
            </h4>
            <Timeline history={history} />
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {reopenModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-orange-600" />
              Reopen Civic Issue Report
            </h3>
            <p className="text-xs text-slate-600">
              Please specify why this work is incomplete or why the problem reoccurred. A municipal administrator will review and reassign.
            </p>
            <textarea
              rows={3}
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. The pothole was only filled with gravel and washed away with yesterday's rain..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReopenModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReopenSubmit}
                disabled={!reopenReason.trim()}
                className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold disabled:opacity-50"
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
