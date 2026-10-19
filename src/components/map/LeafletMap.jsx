import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icon URL issues in Vite
const getMarkerIcon = (priority = 'medium', status = 'reported') => {
  let color = '#3b82f6'; // default blue
  if (status === 'resolved') color = '#10b981'; // green
  else if (status === 'rejected') color = '#ef4444'; // red
  else if (priority === 'urgent') color = '#e11d48'; // crimson
  else if (priority === 'high') color = '#f59e0b'; // amber
  else if (status === 'in_progress') color = '#8b5cf6'; // purple

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.3));">
      <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

export default function LeafletMap({
  issues = [],
  center = [13.0827, 80.2707],
  zoom = 13,
  height = '500px',
  onMarkerClick = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Clean up map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers whenever issues array changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const validIssues = issues.filter(
      (i) => typeof i.latitude === 'number' && typeof i.longitude === 'number'
    );

    validIssues.forEach((issue) => {
      const icon = getMarkerIcon(issue.priority, issue.status);
      const marker = L.marker([issue.latitude, issue.longitude], { icon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-slate-800 text-xs max-w-xs';
      popupContent.innerHTML = `
        <div class="font-bold text-sm text-slate-900 mb-1 leading-tight">${issue.title}</div>
        <div class="flex items-center gap-1.5 mb-2">
          <span class="px-2 py-0.5 rounded font-semibold text-[10px] uppercase bg-slate-100 text-slate-700">${issue.category_name}</span>
          <span class="px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
            issue.status === 'resolved'
              ? 'bg-emerald-100 text-emerald-800'
              : issue.status === 'in_progress'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-amber-100 text-amber-800'
          }">${issue.status.replace('_', ' ')}</span>
        </div>
        <p class="text-slate-600 line-clamp-2 text-xs mb-2">${issue.description}</p>
        <div class="text-[11px] text-slate-500 mb-2 font-medium">📍 ${issue.address}</div>
        <button id="view-issue-${issue.issue_id}" class="w-full text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs transition cursor-pointer">
          View Tracking Details &rarr;
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-issue-${issue.issue_id}`);
        if (btn) {
          btn.onclick = () => {
            if (onMarkerClick) {
              onMarkerClick(issue);
            } else {
              navigate(`/issue/${issue.issue_id}`);
            }
          };
        }
      });

      marker.addTo(markersLayerRef.current);
    });

    if (validIssues.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(markersLayerRef.current.getLayers());
      if (group.getLayers().length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
      }
    }
  }, [issues]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
