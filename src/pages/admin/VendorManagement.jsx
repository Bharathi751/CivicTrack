import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useIssues } from '../../context/IssueContext';
import BackButton from '../../components/common/BackButton';
import {
  HardHat,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  MapPin,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Sparkles,
  ArrowRight,
  UserCheck,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function VendorManagement() {
  const { staffMembers, addVendorStaff, updateVendorStaff, deleteVendorStaff, switchUserById } = useAuth();
  const { issues, categories } = useIssues();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [showVendorPassword, setShowVendorPassword] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'vendor123',
    department: 'Roads & Highway Maintenance',
    contractorCode: '',
    phone: '',
    ward: 'Zone 5 - Central Ward 112'
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Pre-fill / open modal
  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      email: '',
      password: 'vendor123',
      department: categories[0]?.name || 'Roads & Potholes',
      contractorCode: `VND-${Math.floor(100 + Math.random() * 900)}`,
      phone: '+91 94440 ' + Math.floor(10000 + Math.random() * 90000),
      ward: 'Ward ' + Math.floor(100 + Math.random() * 90) + ' Central'
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      password: vendor.password || 'vendor123',
      department: vendor.department || 'General Maintenance',
      contractorCode: vendor.contractorCode || `VND-${vendor.user_id}`,
      phone: vendor.phone || '',
      ward: vendor.ward || 'Zone Central'
    });
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      if (editingVendor) {
        updateVendorStaff(editingVendor.user_id, formData);
        setFormSuccess(`Vendor "${formData.name}" updated successfully.`);
      } else {
        addVendorStaff(formData);
        setFormSuccess(`New Vendor "${formData.name}" registered successfully!`);
      }
      setTimeout(() => {
        setModalOpen(false);
      }, 700);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please try again.');
    }
  };

  const handleDelete = (vendor) => {
    if (window.confirm(`Are you sure you want to remove contractor "${vendor.name}"?`)) {
      deleteVendorStaff(vendor.user_id);
    }
  };

  const handleSwitchToVendor = (vendor) => {
    switchUserById(vendor.user_id);
    navigate('/staff');
  };

  // Vendor Workload Statistics calculation
  const vendorWorkloads = useMemo(() => {
    const map = {};
    staffMembers.forEach((v) => {
      const assigned = issues.filter((i) => i.assigned_to === v.user_id);
      const active = assigned.filter((i) => ['assigned', 'in_progress', 'reopened'].includes(i.status)).length;
      const resolved = assigned.filter((i) => i.status === 'resolved').length;
      map[v.user_id] = { total: assigned.length, active, resolved };
    });
    return map;
  }, [staffMembers, issues]);

  // Filter vendors
  const filteredVendors = staffMembers.filter((v) => {
    const matchSearch =
      !searchTerm.trim() ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contractorCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept = selectedDept === 'all' || v.department === selectedDept;
    return matchSearch && matchDept;
  });

  const totalActiveJobs = Object.values(vendorWorkloads).reduce((acc, curr) => acc + curr.active, 0);
  const totalCompletedJobs = Object.values(vendorWorkloads).reduce((acc, curr) => acc + curr.resolved, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-6">
      {/* Back Navigation Bar */}
      <BackButton label="Back to previous page" fallbackPath="/admin" showDashboardLink={true} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <HardHat className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Vendor & Maintenance Staff Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Enroll external contracting partners, allocate departmental jurisdiction, and monitor field work order performance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor / Staff</span>
        </button>
      </div>

      {/* KPI Stats Row (100% Clickable & Navigate) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={handleOpenAdd}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:scale-102 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to register a new maintenance contractor"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-500 group-hover:text-indigo-600 block transition-colors">
              Contractors Enrolled
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {staffMembers.length}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[10px] text-indigo-600 font-semibold">Active in Corporation</span>
            <span className="text-[10px] text-indigo-600 font-bold group-hover:underline">+ Add New &rarr;</span>
          </div>
        </div>

        <Link
          to="/admin/reports?status=in_progress"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-400 hover:scale-102 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to inspect active work orders in master triage"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-600 block">
              Active Work Orders
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {totalActiveJobs}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">Currently in execution</span>
            <span className="text-[10px] text-amber-600 font-bold group-hover:underline">View queue &rarr;</span>
          </div>
        </Link>

        <Link
          to="/admin/reports?status=resolved"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:scale-102 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to view resolved field jobs in master triage"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-600 block">
              Completed Field Jobs
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {totalCompletedJobs}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[10px] text-emerald-600 font-semibold">Verified resolutions</span>
            <span className="text-[10px] text-emerald-600 font-bold group-hover:underline">View list &rarr;</span>
          </div>
        </Link>

        <div
          onClick={() => setSelectedDept('all')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:scale-102 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          title="Click to show all departments"
        >
          <div>
            <span className="text-[11px] font-bold uppercase text-blue-600 block">
              Departments Covered
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">
              {new Set(staffMembers.map((s) => s.department)).size}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
            <span className="text-[10px] text-slate-400">Roads, Sanitation, Lights</span>
            <span className="text-[10px] text-blue-600 font-bold group-hover:underline">Show all &rarr;</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor by name, email, code, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Specializations</option>
            {Array.from(new Set(staffMembers.map((s) => s.department).filter(Boolean))).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
            <HardHat className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No vendors found matching your filter criteria.</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Add First Contractor
            </button>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const workload = vendorWorkloads[vendor.user_id] || { total: 0, active: 0, resolved: 0 };

            return (
              <div
                key={vendor.user_id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Header Card */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        {vendor.avatar ? (
                          <img
                            src={vendor.avatar}
                            alt={vendor.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          vendor.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                          {vendor.name}
                        </h3>
                        <span className="inline-block font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 mt-0.5">
                          {vendor.contractorCode || `VND-${vendor.user_id}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(vendor)}
                        title="Edit Vendor"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor)}
                        title="Delete Vendor"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Department & Ward Tag */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-800">{vendor.department || 'General Maintenance'}</span>
                    </div>

                    {vendor.ward && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{vendor.ward}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-500 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </div>

                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Workload Indicator Pills */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Jobs</span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-800">{workload.total}</span>
                    </div>
                    <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-600 block uppercase">Active</span>
                      <span className="text-xs sm:text-sm font-extrabold text-amber-700">{workload.active}</span>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-600 block uppercase">Resolved</span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-700">{workload.resolved}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/admin/reports`}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                  >
                    <span>Assign Work Orders</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleSwitchToVendor(vendor)}
                    title="Switch session to this vendor to test their view"
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View Workspace</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingVendor ? 'Edit Vendor / Contractor' : 'Register New Vendor / Staff'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Creates login credentials and activates assignment in triage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contractor / Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Road Works & Paving Co."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingVendor}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vendor@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Login Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showVendorPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="vendor123"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVendorPassword(!showVendorPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5 focus:outline-none transition"
                      title={showVendorPassword ? 'Hide password' : 'Show password'}
                      aria-label={showVendorPassword ? 'Hide password' : 'Show password'}
                    >
                      {showVendorPassword ? (
                        <EyeOff className="w-4 h-4 text-slate-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Specialized Department / Category *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="General Field Maintenance">General Field Maintenance</option>
                    <option value="Emergency Disaster Response">Emergency Disaster Response</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contractor Code ID
                  </label>
                  <input
                    type="text"
                    value={formData.contractorCode}
                    onChange={(e) => setFormData({ ...formData, contractorCode: e.target.value })}
                    placeholder="e.g. VND-RD-402"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 94440 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Ward / Zone
                  </label>
                  <input
                    type="text"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Zone 5 - Ward 112"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700 transition cursor-pointer"
                >
                  {editingVendor ? 'Save Changes' : 'Register Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
