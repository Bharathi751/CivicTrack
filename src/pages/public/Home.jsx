import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import {
  MapPin,
  Search,
  CheckCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Building2,
  Users,
  Wrench
} from 'lucide-react';
import IssueCard from '../../components/issues/IssueCard';

export default function Home() {
  const { stats, issues, categories } = useIssues();
  const [trackInput, setTrackInput] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/track?code=${encodeURIComponent(trackInput.trim())}`);
    }
  };

  const recentResolved = issues.filter((i) => i.status === 'resolved').slice(0, 3);
  const urgentIssues = issues.filter((i) => i.priority === 'urgent' && i.status !== 'resolved').slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Civic Issue Reporting & Municipal Response Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Transforming Local Civic Complaints into <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Actionable Solutions</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Report potholes, broken streetlights, sewage overflows, and garbage dumps with real-time GPS tagging. Transparently track municipal triage, contractor assignment, and resolution.
          </p>

          {/* Quick Track Input in Hero */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleTrackSubmit} className="flex rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-300" />
                <input
                  type="text"
                  placeholder="Enter Tracking ID (e.g. TRK-2026-101)..."
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  className="w-full bg-transparent border-0 px-3 py-2 text-white placeholder-slate-400 focus:outline-hidden text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 font-semibold text-sm transition text-white shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                Track Now
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
              <span>Try sample code:</span>
              <button
                type="button"
                onClick={() => navigate('/track?code=TRK-2026-101')}
                className="underline hover:text-white font-mono text-[11px]"
              >
                TRK-2026-101
              </button>
              <span>or</span>
              <button
                type="button"
                onClick={() => navigate('/track?code=TRK-2026-104')}
                className="underline hover:text-white font-mono text-[11px]"
              >
                TRK-2026-104
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Report a Civic Issue Now
            </Link>

            <Link
              to="/map"
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-sm border border-slate-700 transition flex items-center gap-2"
            >
              Explore Public Civic Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live Statistics Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/map"
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-blue-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
            title="Click to explore all civic reports on the interactive public map"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-700 transition-colors">
                  Total Registered
                </span>
                <Building2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500">Across all municipal wards</span>
              <span className="text-[10px] text-blue-600 font-bold group-hover:underline">Explore map &rarr;</span>
            </div>
          </Link>

          <Link
            to="/map"
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-amber-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
            title="Click to view active repair operations on the map"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  In Active Repair
                </span>
                <Clock className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-extrabold text-amber-600 mt-2">
                {stats.inProgress + stats.assigned}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500">Vendors & crews on site</span>
              <span className="text-[10px] text-amber-600 font-bold group-hover:underline">View live &rarr;</span>
            </div>
          </Link>

          <Link
            to="/map"
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-emerald-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
            title="Click to view resolved community fixes on map"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Resolved & Closed
                </span>
                <CheckCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-2">{stats.resolved}</div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500">{stats.resolutionRate}% success</span>
              <span className="text-[10px] text-emerald-600 font-bold group-hover:underline">View on map &rarr;</span>
            </div>
          </Link>

          <Link
            to="/map"
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:shadow-xl hover:border-rose-400 hover:scale-102 transition-all cursor-pointer group flex flex-col justify-between"
            title="Click to view emergency hazard hotspots on map"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Urgent Safety Flags
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-3xl font-extrabold text-rose-600 mt-2">{stats.urgentCount}</div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
              <span className="text-xs text-slate-500">Priority dispatch alerts</span>
              <span className="text-[10px] text-rose-600 font-bold group-hover:underline">Track on map &rarr;</span>
            </div>
          </Link>
        </div>
      </section>

      {/* How it Works Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Transparent 4-Step Resolution Lifecycle
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every complaint passes through an auditable workflow enforced with timestamps, vendor updates, and proof photos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Spot & Geotag</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Citizens capture photos, select category, pin GPS coordinates, and receive a unique Tracking ID.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Admin Triage</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Municipal desk verifies authenticity, runs duplicate matching algorithm, and assigns priority.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Vendor Action</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Contracted repair crew receives work orders, provides live field progress logs, and completes repairs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Proof & Verify</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Completion photograph is posted for public verification. Citizens can review and reopen if unsatisfied.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Supported Civic Categories</h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose a category to inspect reported public issues across the metropolitan area.
            </p>
          </div>
          <Link
            to="/report"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Report an issue in any category &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const catCount = issues.filter((i) => i.category_id === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/map?category=${cat.id}`}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-blue-600 font-bold mb-3 transition">
                  <Wrench className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {catCount} {catCount === 1 ? 'Report' : 'Reports'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Urgent Issues Alert Section */}
      {urgentIssues.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900">Urgent Priority Civic Hazards</h2>
              </div>
              <Link
                to="/map"
                className="text-xs font-bold text-rose-700 hover:underline"
              >
                View on Public Map &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {urgentIssues.map((issue) => (
                <IssueCard key={issue.issue_id} issue={issue} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Resolved Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recently Resolved Works</h2>
            <p className="text-xs text-slate-500 mt-1">Verified community repairs completed with after-repair photographs</p>
          </div>
          <Link to="/map" className="text-xs font-bold text-blue-600 hover:underline">
            Browse all solved issues &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentResolved.map((issue) => (
            <IssueCard key={issue.issue_id} issue={issue} />
          ))}
        </div>
      </section>
    </div>
  );
}
