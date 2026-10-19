import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import DemoBanner from './components/common/DemoBanner';

// Public Pages
import Home from './pages/public/Home';
import TrackIssue from './pages/public/TrackIssue';
import PublicMap from './pages/public/PublicMap';
import LoginRegister from './pages/public/LoginRegister';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyReports from './pages/citizen/MyReports';
import IssueDetails from './pages/citizen/IssueDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllReports from './pages/admin/AllReports';
import DuplicateReview from './pages/admin/DuplicateReview';
import HotspotAnalytics from './pages/admin/HotspotAnalytics';

// Staff / Vendor Pages
import StaffDashboard from './pages/staff/StaffDashboard';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
          {/* Top Demo Simulator Bar for instant role-testing & grading */}
          <DemoBanner />

          {/* Sticky Navigation */}
          <Navbar />

          {/* Main View Area */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/track" element={<TrackIssue />} />
              <Route path="/map" element={<PublicMap />} />
              <Route path="/login" element={<LoginRegister />} />

              {/* Citizen Routes */}
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/citizen/my-reports" element={<MyReports />} />
              <Route path="/report" element={<ReportIssue />} />

              {/* Unified Issue Details & History Route */}
              <Route path="/issue/:id" element={<IssueDetails />} />

              {/* Municipal Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AllReports />} />
              <Route path="/admin/duplicates" element={<DuplicateReview />} />
              <Route path="/admin/hotspots" element={<HotspotAnalytics />} />

              {/* Staff & Maintenance Vendor Routes */}
              <Route path="/staff" element={<StaffDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </IssueProvider>
    </AuthProvider>
  );
}
