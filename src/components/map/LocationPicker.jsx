import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Crosshair, Check } from 'lucide-react';

const PRESET_LANDMARKS = [
  { name: 'Anna Salai Metro Station Exit 2', lat: 13.0827, lng: 80.2707, addr: 'Anna Salai Metro Gate 2, Thousand Lights' },
  { name: 'St. Joseph School, 4th Cross Road', lat: 13.0850, lng: 80.2740, addr: 'Near St. Joseph Primary School, 4th Cross Rd' },
  { name: 'Gandhi Nagar 7th Avenue Corner', lat: 13.0780, lng: 80.2650, addr: '7th Avenue Junction, Gandhi Nagar' },
  { name: 'Community Hall, 2nd Main Road', lat: 13.0910, lng: 80.2800, addr: 'Opposite Community Hall, 2nd Main Road' },
  { name: 'Central Library, 1st Cross Street', lat: 13.0835, lng: 80.2715, addr: 'Near Central Public Library, 1st Cross Street' },
  { name: 'Fish Market Lane Junction', lat: 13.0862, lng: 80.2770, addr: 'Corner of Fish Market Lane, Ward 12' }
];

export default function LocationPicker({
  latitude,
  longitude,
  address,
  onChange,
  height = '320px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [currentCoords, setCurrentCoords] = useState({
    lat: latitude || 13.0827,
    lng: longitude || 80.2707
  });

  const pinIcon = L.divIcon({
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <span style="background: #2563eb; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-bottom: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); white-space: nowrap;">
          Selected Spot
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0px 3px 5px rgba(0,0,0,0.4));">
          <path fill="#2563eb" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
        </svg>
      </div>
    `,
    className: 'custom-picker-pin',
    iconSize: [80, 56],
    iconAnchor: [40, 56]
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 14
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: pinIcon,
        draggable: true
      }).addTo(map);

      // On marker drag
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        handleLocationSelect(lat, lng);
      });

      // On map click
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleLocationSelect(lat, lng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocationSelect = (lat, lng, presetAddr = null) => {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));

    setCurrentCoords({ lat: roundedLat, lng: roundedLng });

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([roundedLat, roundedLng]);
      mapInstanceRef.current.panTo([roundedLat, roundedLng]);
    }

    const calculatedAddress =
      presetAddr ||
      `Ward 8, Near Latitude ${roundedLat.toFixed(4)}, Longitude ${roundedLng.toFixed(4)}`;

    onChange({
      latitude: roundedLat,
      longitude: roundedLng,
      address: presetAddr || address || calculatedAddress
    });
  };

  const handlePresetClick = (landmark) => {
    handleLocationSelect(landmark.lat, landmark.lng, landmark.addr);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to center
          handleLocationSelect(13.0827, 80.2707);
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Top helper & presets */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
          <Crosshair className="w-3.5 h-3.5 text-blue-600" />
          Click on the map or drag the pin to mark the exact civic issue location
        </span>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition"
        >
          <Navigation className="w-3 h-3" />
          Use My GPS Location
        </button>
      </div>

      {/* Map display */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Preset landmarks buttons */}
      <div>
        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
          Quick Landmark Presets:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_LANDMARKS.map((lm, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(lm)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 transition"
            >
              📍 {lm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinate & Address feedback */}
      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
        <div>
          <span className="font-semibold text-slate-700">Coordinates: </span>
          <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-blue-700 font-mono text-[11px]">
            {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
          </code>
        </div>
        <div className="text-emerald-700 font-medium flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          Geotagged
        </div>
      </div>
    </div>
  );
}
