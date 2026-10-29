import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProfileSettingsModal from './components/common/ProfileSettingsModal';
import ScrollToTop from './components/common/ScrollToTop';

// Layouts with Side Navigation
import AdminLayout from './components/admin/AdminLayout';
import StaffLayout from './components/staff/StaffLayout';

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
import VendorManagement from './pages/admin/VendorManagement';
import DuplicateReview from './pages/admin/DuplicateReview';
import HotspotAnalytics from './pages/admin/HotspotAnalytics';

// Staff / Vendor Pages
import StaffDashboard from './pages/staff/StaffDashboard';

export default function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        {/* Automatic Scroll Restoration & Top Reset */}
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">
          {/* Main Sticky Navigation */}
          <Navbar />

          {/* Global Profile & Account Settings Modal */}
          <ProfileSettingsModal />

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

              {/* Municipal Admin Routes (Protected with Admin Sidebar Navigation) */}
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminLayout>
                    <AllReports />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/vendors"
                element={
                  <AdminLayout>
                    <VendorManagement />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/duplicates"
                element={
                  <AdminLayout>
                    <DuplicateReview />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/hotspots"
                element={
                  <AdminLayout>
                    <HotspotAnalytics />
                  </AdminLayout>
                }
              />

              {/* Staff & Maintenance Vendor Routes (Protected with Vendor Sidebar Navigation) */}
              <Route
                path="/staff"
                element={
                  <StaffLayout>
                    <StaffDashboard />
                  </StaffLayout>
                }
              />

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
