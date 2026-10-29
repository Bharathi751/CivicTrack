import React from 'react';
import { useIssues } from '../../context/IssueContext';
import HotspotMap from '../../components/map/HotspotMap';
import BackButton from '../../components/common/BackButton';
import { Flame, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HotspotAnalytics() {
  const { issues, categories } = useIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" fallbackPath="/admin" showDashboardLink={true} />

      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4" />
          Municipal Geospatial Intelligence (Section 18)
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Civic Hotspots & Concentration Analytics
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Visualizes geographic clusters where multiple unresolved citizen complaints overlap within a 450-meter radius. Helps allocate emergency contractors and prioritize ward-level public works.
        </p>

        {/* Section 18 Note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Analytical Interpretation (Section 18):</strong> A hotspot represents a concentration of submitted reports. Reporting activity, population density, and mobile access can affect results; on-site inspection is recommended before major budget allocation.
          </span>
        </div>
      </div>

      {/* Hotspot Interactive Map & Cluster Inspector */}
      <HotspotMap issues={issues} categories={categories} />
    </div>
  );
}
