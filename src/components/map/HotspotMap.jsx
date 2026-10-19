import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistanceInMeters } from '../../utils/duplicateDetector';
import { Flame, AlertTriangle, Layers, Filter } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';
import { Link } from 'react-router-dom';

export default function HotspotMap({ issues = [], categories = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Filter only unresolved issues (reported, under_review, assigned, in_progress, reopened)
  const unresolvedIssues = useMemo(() => {
    return issues.filter((i) => {
      const isUnresolved = !['resolved', 'rejected'].includes(i.status);
      const matchesCat =
        selectedCategory === 'all' || i.category_id === Number(selectedCategory);
      return isUnresolved && matchesCat;
    });
  }, [issues, selectedCategory]);

  // Cluster algorithm: Group nearby unresolved issues (radius <= 400m)
  const clusters = useMemo(() => {
    const list = [...unresolvedIssues];
    const computed = [];
    const visited = new Set();

    list.forEach((issue, idx) => {
      if (visited.has(issue.issue_id)) return;

      const currentGroup = [issue];
      visited.add(issue.issue_id);

      for (let j = idx + 1; j < list.length; j++) {
        const other = list[j];
        if (visited.has(other.issue_id)) continue;

        const dist = calculateDistanceInMeters(
          issue.latitude,
          issue.longitude,
          other.latitude,
          other.longitude
        );

        if (dist <= 450) {
          currentGroup.push(other);
          visited.add(other.issue_id);
        }
      }

      // Compute centroid of cluster
      const avgLat =
        currentGroup.reduce((acc, i) => acc + i.latitude, 0) / currentGroup.length;
      const avgLng =
        currentGroup.reduce((acc, i) => acc + i.longitude, 0) / currentGroup.length;

      computed.push({
        id: `cluster-${issue.issue_id}`,
        center: [avgLat, avgLng],
        count: currentGroup.length,
        issues: currentGroup,
        radius: Math.min(450, 150 + currentGroup.length * 75)
      });
    });

    return computed.sort((a, b) => b.count - a.count);
  }, [unresolvedIssues]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.0827, 80.2707],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      layersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render hotspot circles and custom cluster icons
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    layersGroupRef.current.clearLayers();

    clusters.forEach((cluster) => {
      // Determine intensity color
      const isHighIntensity = cluster.count >= 3;
      const isModerate = cluster.count === 2;
      const circleColor = isHighIntensity ? '#e11d48' : isModerate ? '#f97316' : '#3b82f6';
      const fillColor = isHighIntensity ? '#f43f5e' : isModerate ? '#fb923c' : '#60a5fa';

      // 1. Draw glowing semi-transparent radius circle
      const circle = L.circle(cluster.center, {
        color: circleColor,
        fillColor: fillColor,
        fillOpacity: isHighIntensity ? 0.35 : 0.22,
        radius: cluster.radius,
        weight: isHighIntensity ? 2.5 : 1.5
      });

      circle.addTo(layersGroupRef.current);

      // 2. Add Center Hotspot Badge Marker
      const badgeIcon = L.divIcon({
        html: `
          <div style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: ${circleColor}; color: white; font-weight: bold; font-size: 13px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2.5px solid white; cursor: pointer;">
            ${cluster.count}
          </div>
        `,
        className: 'custom-cluster-badge',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(cluster.center, { icon: badgeIcon });

      marker.on('click', () => {
        setSelectedCluster(cluster);
      });

      circle.on('click', () => {
        setSelectedCluster(cluster);
      });

      marker.addTo(layersGroupRef.current);
    });

    if (clusters.length > 0 && mapInstanceRef.current) {
      const group = L.featureGroup(layersGroupRef.current.getLayers());
      if (group.getLayers().length > 0) {
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }, [clusters]);

  return (
    <div className="space-y-4">
      {/* Controls & Explanation Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              Civic Issue Hotspot Clusters
              <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                {clusters.length} Active Zones
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Concentrations of pending, reported, and in-progress civic reports calculated geographically.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Civic Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map container with side inspection panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-md text-[11px] space-y-1">
            <div className="font-bold text-slate-700 mb-1">Density Legend:</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span className="text-slate-600">High Concentration (3+ issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-slate-600">Medium (2 issues)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-slate-600">Isolated Unresolved (1 issue)</span>
            </div>
          </div>
        </div>

        {/* Cluster Inspector Sidebar */}
        <div className="h-[520px] bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              {selectedCluster
                ? `Hotspot Zone (${selectedCluster.count} issues)`
                : 'Top Priority Hotspot Zones'}
            </span>
            {selectedCluster && (
              <button
                onClick={() => setSelectedCluster(null)}
                className="text-xs text-blue-600 hover:underline"
              >
                View All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 mt-2 space-y-2">
            {selectedCluster ? (
              // Selected Cluster Issues List
              selectedCluster.issues.map((item) => (
                <div key={item.issue_id} className="pt-2 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      {item.tracking_code}
                    </span>
                    <PriorityBadge priority={item.priority} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1 leading-snug">{item.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mb-1.5">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <Link
                      to={`/issue/${item.issue_id}`}
                      className="text-blue-600 font-semibold hover:underline text-[11px]"
                    >
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              ))
            ) : clusters.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No unresolved hotspots found for this filter.
              </div>
            ) : (
              // All Clusters Summary Cards
              clusters.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCluster(c);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo(c.center, 15);
                    }
                  }}
                  className="pt-2.5 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-800">
                      Zone #{idx + 1}: {c.issues[0]?.address.split(',')[0]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      {c.count} Reports
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-1">
                    Categories: {[...new Set(c.issues.map((i) => i.category_name))].join(', ')}
                  </p>
                  <span className="text-[10px] text-blue-600 font-medium">
                    Click to zoom & inspect zone &rarr;
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
