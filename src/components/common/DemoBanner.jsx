import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { resetToSeedData } from '../../utils/storage';
import { Shield, User, Wrench, RefreshCw, Sparkles } from 'lucide-react';

export default function DemoBanner() {
  const { currentUser, switchUserById } = useAuth();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 sm:px-6 lg:px-8 shadow-inner border-b border-indigo-800/40 sticky top-0 z-50">
      <div className="max-w-[1536px] mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide text-indigo-200 uppercase text-xs sm:text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Active Role Simulator:
          </span>
          <span className="bg-indigo-900/90 px-2.5 py-1 rounded-md text-indigo-100 font-semibold text-xs sm:text-sm border border-indigo-700/60 shadow-xs">
            {currentUser?.name || 'Guest'} ({currentUser?.role?.toUpperCase() || 'PUBLIC'})
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="text-slate-400 text-xs sm:text-sm hidden sm:inline mr-1 font-medium">Switch View:</span>
          
          <button
            onClick={() => switchUserById(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-semibold cursor-pointer ${
              currentUser?.user_id === 1
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to Citizen Arun Kumar"
          >
            <User className="w-4 h-4" />
            Citizen (User)
          </button>

          <button
            onClick={() => switchUserById(3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-semibold cursor-pointer ${
              currentUser?.user_id === 3
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to Admin Commissioner"
          >
            <Shield className="w-4 h-4" />
            Municipal Admin
          </button>

          <button
            onClick={() => switchUserById(4)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-semibold cursor-pointer ${
              currentUser?.user_id === 4
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="Switch to Apex Roadworks Contractor / Vendor"
          >
            <Wrench className="w-4 h-4" />
            Vendor / Field Staff
          </button>

          <button
            onClick={resetToSeedData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-300 hover:bg-slate-700 transition ml-1 border border-slate-700 text-xs sm:text-sm font-medium cursor-pointer"
            title="Reset sample database to fresh seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
