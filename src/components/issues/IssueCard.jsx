import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { MapPin, Calendar, ArrowRight, UserCheck } from 'lucide-react';

export default function IssueCard({ issue, showActions = true, onActionClick = null }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Thumbnail with overlay tags */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={issue.images?.[0] || '/images/issues/broken-road-mud.jpg'}
          alt={issue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded shadow">
            {issue.tracking_code}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5">
          <PriorityBadge priority={issue.priority} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
              {issue.category_name}
            </span>
            <StatusBadge status={issue.status} />
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition">
            {issue.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {issue.description}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{issue.address}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(issue.created_at).toLocaleDateString()}</span>
            </div>

            {issue.assigned_to_name && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate max-w-[120px]">{issue.assigned_to_name.split(' ')[0]}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer Link / Action */}
        {showActions && (
          <div className="pt-2">
            <Link
              to={`/issue/${issue.issue_id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition border border-slate-200/80 hover:border-blue-200"
            >
              <span>View Details & Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
