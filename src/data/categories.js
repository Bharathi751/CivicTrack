export const ISSUE_CATEGORIES = [
  {
    id: 1,
    name: 'Roads & Potholes',
    description: 'Cratered roads, dangerous potholes, broken pavement, asphalt damage',
    icon: 'Hammer',
    color: 'orange',
    slaDays: 3,
    department: 'Roads & Highway Maintenance'
  },
  {
    id: 2,
    name: 'Garbage & Sanitation',
    description: 'Overflowing public bins, illegal garbage dumping, uncollected waste',
    icon: 'Trash2',
    color: 'amber',
    slaDays: 1,
    department: 'Sanitation & Solid Waste'
  },
  {
    id: 3,
    name: 'Street Lighting',
    description: 'Non-functional streetlights, damaged lamp poles, flickering dark spots',
    icon: 'Lightbulb',
    color: 'yellow',
    slaDays: 2,
    department: 'Electrical & Street Lighting'
  },
  {
    id: 4,
    name: 'Water Supply & Leakage',
    description: 'Burst main pipelines, clean water wastage, low pressure or contaminated supply',
    icon: 'Droplet',
    color: 'blue',
    slaDays: 2,
    department: 'Municipal Water Board'
  },
  {
    id: 5,
    name: 'Drainage & Sewage',
    description: 'Clogged stormwater drains, overflowing sewage, stagnating dirty water',
    icon: 'Waves',
    color: 'emerald',
    slaDays: 3,
    department: 'Drainage & Flood Management'
  },
  {
    id: 6,
    name: 'Public Safety & Hazards',
    description: 'Open manholes, fallen electrical wires, dangerous trees, missing covers',
    icon: 'AlertTriangle',
    color: 'red',
    slaDays: 1,
    department: 'Disaster & Emergency Services'
  }
];

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  medium: { label: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  high: { label: 'High', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  urgent: { label: 'Urgent', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-600' }
};

export const STATUS_CONFIG = {
  reported: {
    label: 'Reported',
    desc: 'Citizen submitted the issue. Awaiting municipal triage.',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    step: 1
  },
  under_review: {
    label: 'Under Review',
    desc: 'Administrator is verifying details and checking duplicates.',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    step: 2
  },
  assigned: {
    label: 'Assigned',
    desc: 'Issue assigned to field department / vendor contractor.',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    step: 3
  },
  in_progress: {
    label: 'In Progress',
    desc: 'Maintenance crew or vendor is actively working on-site.',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    step: 4
  },
  resolved: {
    label: 'Resolved',
    desc: 'Work completed, verified with proof of resolution.',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    step: 5
  },
  rejected: {
    label: 'Rejected',
    desc: 'Report rejected with recorded municipal justification.',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    step: 0
  },
  reopened: {
    label: 'Reopened',
    desc: 'Citizen or inspector flagged that the issue requires further work.',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    step: 2
  }
};
