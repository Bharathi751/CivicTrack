import React from 'react';
import { STATUS_CONFIG } from '../../data/categories';
import { Clock, CheckCircle2, AlertCircle, User, Wrench, Shield } from 'lucide-react';

export default function Timeline({ history = [] }) {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
        No status history recorded yet.
      </div>
    );
  }

  const getActorBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <Wrench className="w-3 h-3" /> Vendor / Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            <User className="w-3 h-3" /> Citizen
          </span>
        );
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, idx) => {
          const isLast = idx === history.length - 1;
          const statusInfo = STATUS_CONFIG[item.new_status] || {
            label: item.new_status,
            color: 'bg-slate-100 text-slate-800'
          };

          return (
            <li key={item.history_id || idx}>
              <div className="relative pb-8">
                {/* Connecting vertical line */}
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}

                <div className="relative flex space-x-3">
                  {/* Status Indicator Icon */}
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                        item.new_status === 'resolved'
                          ? 'bg-emerald-500 text-white'
                          : item.new_status === 'rejected'
                          ? 'bg-rose-500 text-white'
                          : item.new_status === 'in_progress'
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {item.new_status === 'resolved' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {statusInfo.label}
                        </span>
                        {item.old_status && (
                          <span className="text-[11px] text-slate-400">
                            (was {item.old_status.replace('_', ' ')})
                          </span>
                        )}
                        {getActorBadge(item.changed_by_role)}
                      </div>

                      <time className="text-[11px] text-slate-400 font-medium">
                        {new Date(item.changed_at).toLocaleDateString()} at{' '}
                        {new Date(item.changed_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {item.note}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-500 font-medium">
                      Recorded by: <span className="text-slate-800">{item.changed_by_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
