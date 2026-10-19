import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, PhoneCall, AlertCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CivicTrack</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A transparent, centralized platform empowering citizens to report community issues and enabling municipal administrators & maintenance vendors to resolve them faster.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Civic Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">Portal Home</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-blue-400 transition">Submit New Issue</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-blue-400 transition">Track Issue by Code</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-blue-400 transition">Public Map Explorer</Link>
              </li>
            </ul>
          </div>

          {/* Roles & Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/citizen" className="hover:text-blue-400 transition">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-400 transition">Municipal Admin Console</Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-blue-400 transition">Vendor & Staff Field Work</Link>
              </li>
              <li>
                <Link to="/admin/hotspots" className="hover:text-blue-400 transition">Civic Hotspots Heatmap</Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              Emergency Helplines
            </h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Municipal Control:</span>
                <span className="font-semibold text-white">1913</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Water Board:</span>
                <span className="font-semibold text-white">044-4567 4567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Disaster Helpline:</span>
                <span className="font-semibold text-rose-400">1077</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Scope Note from PDF */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 max-w-2xl text-left">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Student Prototype Specification:</strong> Uses sample data and simulated vendor workflow. Does not claim to submit reports directly to live municipal authorities unless an authorized departmental integration is implemented.
            </span>
          </p>
          <p className="text-[11px] text-slate-400">
            React + Vite + Tailwind CSS + LocalStorage
          </p>
        </div>
      </div>
    </footer>
  );
}
