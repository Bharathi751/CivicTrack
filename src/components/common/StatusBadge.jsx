import React from 'react';
import { STATUS_CONFIG } from '../../data/categories';

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold border ${config.color} ${className}`}
    >
      <span className="w-2 h-2 rounded-full mr-2 bg-current opacity-90" />
      {config.label}
    </span>
  );
}
