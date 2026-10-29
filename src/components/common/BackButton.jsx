import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Universal Back Navigation Component
 * Provides seamless navigate(-1) with session history check and role-based fallback.
 */
export default function BackButton({
  fallbackPath,
  label = 'Back to previous page',
  showDashboardLink = true,
  className = ''
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleBack = () => {
    // Ensure immediate top scroll
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    // If the browser session has an active back history state
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else if (currentUser?.role === 'admin') {
      navigate('/admin');
    } else if (currentUser?.role === 'staff') {
      navigate('/staff');
    } else if (currentUser) {
      navigate('/citizen');
    } else {
      navigate('/');
    }
  };

  const getDashboardTarget = () => {
    if (currentUser?.role === 'admin') return { to: '/admin', text: 'Admin Command Center' };
    if (currentUser?.role === 'staff') return { to: '/staff', text: 'Vendor Field Portal' };
    if (currentUser) return { to: '/citizen', text: 'Citizen Dashboard' };
    return { to: '/', text: 'Portal Home' };
  };

  const dashboard = getDashboardTarget();

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <button
        onClick={handleBack}
        type="button"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs font-semibold text-xs transition-all cursor-pointer group"
        title="Go to previous page"
      >
        <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
        <span>{label}</span>
      </button>

      {showDashboardLink && (
        <Link
          to={fallbackPath || dashboard.to}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
        >
          <span>Return to {dashboard.text}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
