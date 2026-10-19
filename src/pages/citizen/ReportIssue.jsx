import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useIssues } from '../../context/IssueContext';
import { useAuth } from '../../context/AuthContext';
import LocationPicker from '../../components/map/LocationPicker';
import { findDuplicateCandidates } from '../../utils/duplicateDetector';
import {
  MapPin,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Camera,
  ArrowRight,
  FileText
} from 'lucide-react';

const SAMPLE_PHOTO_PRESETS = [
  {
    name: 'Potholes & Waterlogged Road',
    url: '/images/issues/broken-road-mud.jpg'
  },
  {
    name: 'Roadside Garbage Dump',
    url: '/images/issues/garbage-dump.jpg'
  },
  {
    name: 'Collapsed Streetlight Pole',
    url: '/images/issues/bent-streetlight.jpg'
  },
  {
    name: 'Drainage Sewage Overflow',
    url: '/images/issues/sewage-drainage.jpg'
  },
  {
    name: 'Water Tank Valve Leak',
    url: '/images/issues/water-leakage.jpg'
  }
];

export default function ReportIssue() {
  const { categories, submitIssue, issues } = useIssues();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [latitude, setLatitude] = useState(13.0827);
  const [longitude, setLongitude] = useState(80.2707);
  const [address, setAddress] = useState('Anna Salai Metro Gate 2, Thousand Lights');
  const [imagePreview, setImagePreview] = useState(SAMPLE_PHOTO_PRESETS[0].url);
  const [submitting, setSubmitting] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  // Live duplicate detection warning as user fills the form
  const potentialDuplicates = useMemo(() => {
    if (!title || title.trim().length < 5) return [];
    const tempIssue = {
      issue_id: 0,
      title,
      description,
      category_id: Number(categoryId),
      latitude,
      longitude
    };
    return findDuplicateCandidates(tempIssue, issues).slice(0, 2);
  }, [title, description, categoryId, latitude, longitude, issues]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const issue = submitIssue({
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId,
        latitude,
        longitude,
        address,
        priority,
        images: [imagePreview]
      });

      setCreatedIssue(issue);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          Civic Complaint Registration (FR-02 to FR-06)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Local Civic Problem
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide detailed information, pinpoint the location on the map, and attach photographic proof to accelerate municipal action.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Step 1: Issue Title & Category */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
            Issue Details & Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Issue Summary / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep crater pothole near bus terminal entrance"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Civic Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Description & Problem Context *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the severity, when it started, hazards to pedestrians or motorists, and any specific landmarks nearby..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assessed Severity / Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'low', label: 'Low', desc: 'Minor cosmetic defect' },
                { id: 'medium', label: 'Medium', desc: 'Noticeable inconvenience' },
                { id: 'high', label: 'High', desc: 'Impacting daily traffic/hygiene' },
                { id: 'urgent', label: 'Urgent', desc: 'Critical public hazard' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                    priority === p.id
                      ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs capitalize block">{p.label}</span>
                  <span className="text-[10px] text-slate-500">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Duplicate Warning (Section 17) */}
        {potentialDuplicates.length > 0 && (
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-xl p-4 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Smart Duplicate Advisory (Similarity Score: {potentialDuplicates[0].scorePercent}%)</span>
            </div>
            <p className="text-xs text-amber-800">
              A very similar complaint has already been reported near this location:
            </p>
            {potentialDuplicates.map((dup) => (
              <div key={dup.candidate.issue_id} className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mr-2">
                    {dup.candidate.tracking_code}
                  </span>
                  <span className="font-semibold text-slate-800">{dup.candidate.title}</span>
                  <span className="text-slate-500 ml-2 text-[11px]">({dup.distanceMeters}m away)</span>
                </div>
                <Link
                  to={`/issue/${dup.candidate.issue_id}`}
                  target="_blank"
                  className="text-blue-600 font-bold hover:underline shrink-0 text-xs"
                >
                  Inspect Existing Report &rarr;
                </Link>
              </div>
            ))}
            <span className="text-[11px] text-slate-500 block pt-1">
              You can still proceed if your complaint is an independent or distinct incident.
            </span>
          </div>
        )}

        {/* Step 2: Interactive Location Picker */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
            Geotag Location & Address Pin (FR-05)
          </h2>

          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            address={address}
            onChange={(loc) => {
              setLatitude(loc.latitude);
              setLongitude(loc.longitude);
              setAddress(loc.address);
            }}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Street Address / Landmark Description *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Opposite Metro Gate 2, Thousand Lights, Anna Salai"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Step 3: Photo Attachment */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
            Photograph Evidence (FR-04)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Upload Custom Photo
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition bg-slate-50">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <label className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer hover:bg-blue-700 inline-block mb-1">
                  Browse Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-slate-400 block">
                  PNG, JPG, or WEBP up to 5MB
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Or Select Realistic Demo Photo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImagePreview(preset.url)}
                    className={`p-1 rounded-lg border text-left overflow-hidden transition cursor-pointer ${
                      imagePreview === preset.url
                        ? 'ring-2 ring-blue-600 border-blue-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-16 object-cover rounded"
                    />
                    <span className="text-[10px] font-bold text-slate-700 block truncate mt-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Preview */}
          {imagePreview && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Selected Preview"
                className="w-20 h-20 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Photo Attached</span>
                <span className="text-slate-500 text-[11px]">
                  This image will be stored with your report and visible to municipal inspectors and repair vendors.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Registering Report...' : 'Submit Civic Report'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {createdIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Report Successfully Submitted!
            </h3>

            <p className="text-xs text-slate-600">
              Your civic report has been queued for municipal verification. Your official tracking code is:
            </p>

            <div className="bg-blue-50 border-2 border-dashed border-blue-400 p-4 rounded-xl">
              <span className="font-mono text-2xl font-black text-blue-700 tracking-wider">
                {createdIssue.tracking_code}
              </span>
              <p className="text-[11px] text-blue-600 mt-1 font-medium">
                Save this code to check progress publicly at any time.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to={`/issue/${createdIssue.issue_id}`}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
              >
                View Full Tracking Details & Timeline
              </Link>
              <Link
                to="/citizen"
                className="w-full py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
