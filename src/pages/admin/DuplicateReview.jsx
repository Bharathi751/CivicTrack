import React, { useMemo, useState } from 'react';
import { useIssues } from '../../context/IssueContext';
import { computeDuplicateScore } from '../../utils/duplicateDetector';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import {
  CopyCheck,
  Check,
  X,
  AlertTriangle,
  MapPin,
  FileText,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DuplicateReview() {
  const {
    issues,
    dismissedDuplicates,
    confirmDuplicate,
    dismissDuplicateCandidate
  } = useIssues();

  // Find all pairs with candidate duplicate score >= 45%
  const candidatePairs = useMemo(() => {
    const pairs = [];
    const active = issues.filter((i) => i.status !== 'rejected');

    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const issueA = active[i];
        const issueB = active[j];
        const pairKey = `${Math.min(issueA.issue_id, issueB.issue_id)}_${Math.max(
          issueA.issue_id,
          issueB.issue_id
        )}`;

        if (dismissedDuplicates.includes(pairKey)) continue;

        const match = computeDuplicateScore(issueA, issueB);
        if (match.isCandidate) {
          // Identify earlier issue as Master, later issue as Candidate
          const [master, candidate] =
            new Date(issueA.created_at) <= new Date(issueB.created_at)
              ? [issueA, issueB]
              : [issueB, issueA];

          pairs.push({
            pairKey,
            master,
            candidate,
            ...match
          });
        }
      }
    }

    return pairs.sort((a, b) => b.scorePercent - a.scorePercent);
  }, [issues, dismissedDuplicates]);

  const [confirmModalPair, setConfirmModalPair] = useState(null);

  const handleConfirm = () => {
    if (!confirmModalPair) return;
    confirmDuplicate(confirmModalPair.candidate.issue_id, confirmModalPair.master.issue_id);
    setConfirmModalPair(null);
  };

  const handleDismiss = (pairKey) => {
    dismissDuplicateCandidate(pairKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CopyCheck className="w-6 h-6 text-indigo-600" />
              Duplicate Detection & Deduplication Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Automated multi-factor algorithm comparing location distance (0.4), category match (0.3), and description keywords (0.3).
            </p>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {candidatePairs.length} Candidate Pair{candidatePairs.length === 1 ? '' : 's'} Identified
          </div>
        </div>

        {/* Algorithm Formula Banner as specified in PDF Section 17 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800">Section 17 Formula Implementation: </strong>
            <code className="text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
              Duplicate Score = 0.4 × Location Sim + 0.3 × Category Sim + 0.3 × Text Sim
            </code>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Administrators review candidates manually. Do not merge reports solely based on proximity without verifying description details.
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Pairs List */}
      {candidatePairs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3 shadow-xs">
          <CopyCheck className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">No Duplicate Candidates Pending</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All current civic reports appear to be distinct incidents or have already been reviewed and resolved.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {candidatePairs.map((pair) => (
            <div
              key={pair.pairKey}
              className="bg-white rounded-2xl border-2 border-slate-200 shadow-md p-6 space-y-6"
            >
              {/* Score header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-extrabold flex flex-col items-center justify-center text-sm shadow">
                    <span>{pair.scorePercent}%</span>
                    <span className="text-[9px] uppercase font-normal opacity-90">Match</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Potential Duplicate Conflict Detected
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>Distance: <strong className="text-slate-800">{pair.distanceMeters}m</strong> apart</span>
                      <span>•</span>
                      <span>Category Sim: <strong className="text-slate-800">{pair.catSim}%</strong></span>
                      <span>•</span>
                      <span>Text Overlap: <strong className="text-slate-800">{pair.textSim}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDismiss(pair.pairKey)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    Dismiss (Distinct Issue)
                  </button>
                  <button
                    onClick={() => setConfirmModalPair(pair)}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirm Duplicate & Merge
                  </button>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Master Report */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Primary Master Report (Older)
                    </span>
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {pair.master.tracking_code}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{pair.master.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {pair.master.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {pair.master.address}
                    </span>
                    <StatusBadge status={pair.master.status} />
                  </div>
                </div>

                {/* Candidate Duplicate Report */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                      Candidate Duplicate (Newer)
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-800">
                      {pair.candidate.tracking_code}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{pair.candidate.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {pair.candidate.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-amber-200">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {pair.candidate.address}
                    </span>
                    <StatusBadge status={pair.candidate.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalPair && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-600" />
              Confirm Duplicate Linking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Confirming this duplicate will link report{' '}
              <strong className="text-slate-900">{confirmModalPair.candidate.tracking_code}</strong> to Master Report{' '}
              <strong className="text-blue-700">{confirmModalPair.master.tracking_code}</strong>.
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              The candidate will be marked as duplicate and its reporter will receive an in-app notification linking them to the master complaint's resolution progress.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalPair(null)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Confirm & Link Reports
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
