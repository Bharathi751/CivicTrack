import React from 'react';
import { PRIORITY_CONFIG } from '../../data/categories';

export default function PriorityBadge({ priority = 'medium', className = '' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-[13px] font-bold uppercase tracking-wider border ${config.color} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dot} ${priority === 'urgent' ? 'animate-ping' : ''}`} />
      {config.label}
    </span>
  );
}
