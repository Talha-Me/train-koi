import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, MessageCircle, Layers, Compass, Crosshair } from 'lucide-react';
import railSegmentsData from '../data/railSegments.json';

// =========================================================================
// ১. ম্যাপ স্টাইলসমূহ (Esri Satellite & OpenStreetMap/Carto)
// =========================================================================
const MAP_STYLES = {
  satellite: {
    name: 'মানচিত্র',
    style: {
      version: 8,
      sources: {
        'esri-imagery': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Powered by Esri - Esri, Maxar, Earthstar Geographics, and the GIS User Community • © OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'satellite-tiles',
          type: 'raster',
          source: 'esri-imagery',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  streets: {
    name: 'স্যাটেলাইট',
    style: {
      version: 8,
      sources: {
        'carto-voyager': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap, © CARTO'
        }
      },
      layers: [
        {
          id: 'street-tiles',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  }
};

// বাংলা সংখ্যা কনভার্টার
const toBangla = (num) => {
  if (num === null || num === undefined) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bn[parseInt(d, 10)]);
};

// =========================================================================
// ২. হাই-প্রিসিশন ট্র্যাক স্ন্যাপিং ও সেগমেন্ট ট্র্যাকার
// =========================================================================
function snapToRailTrack(lat, lng, destLat, destLng, segments) {
  if (!segments || !segments.length) {
    return { lat, lng, bearing: 45, segmentIndex: 0, t: 0 };
  }

  let minDistanceSq = Infinity;
  let bestLat = lat;
  let bestLng = lng;
  let bestBearing = 45;
  let bestIdx = 0;
  let bestT = 0;

  for (let i = 0; i < segments.length; i++) {
    const [slat, slng, elat, elng] = segments[i];

    if (Math.abs(lat - slat) > 0.08 && Math.abs(lat - elat) > 0.08) continue;
    if (Math.abs(lng - slng) > 0.08 && Math.abs(lng - elng) > 0.08) continue;

    const dx = elng - slng;
    const dy = elat - slat;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) continue;

    const t = Math.max(0, Math.min(1, ((lng - slng) * dx + (lat - slat) * dy) / lenSq));
    const projLng = slng + t * dx;
    const projLat = slat + t * dy;

    const dLng = lng - projLng;
    const dLat = lat - projLat;
    const distSq = dLng * dLng + dLat * dLat;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      bestLat = projLat;
      bestLng = projLng;
      bestIdx = i;
      bestT = t;

      const rad = Math.atan2(dx, dy);
      let brng = (rad * 180) / Math.PI;
      bestBearing = (brng + 360) % 360;
    }
  }

  // গন্তব্য স্টেশন অনুযায়ী ট্রেনের মুখ সামনের দিকে অ্যালাইন করা
  if (destLat !== undefined && destLng !== undefined) {
    const destDx = destLng - bestLng;
    const destDy = destLat - bestLat;
    const destAngle = ((Math.atan2(destDx, destDy) * 180) / Math.PI + 360) % 360;

    let diff = Math.abs(bestBearing - destAngle);
    if (diff > 180) diff = 360 - diff;
    if (diff > 90) {
      bestBearing = (bestBearing + 180) % 360;
    }
  }

  return {
    lat: bestLat,
    lng: bestLng,
    bearing: bestBearing,
    segmentIndex: bestIdx,
    t: bestT
  };
}

// =========================================================================
// ৩. মূল ৩ডি জার্নি ভিউ কম্পোনেন্ট
// =========================================================================
export default function TrainJourney3D({
  train,
  activeState,
  scheduleData = [],
  railData = null,
  onClose
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const trainMarkerRef = useRef(null);
  const animFrameRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [is2DMode, setIs2DMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  // কাঁচা জিপিএস পজিশন
  const rawLat = activeState?.lat || 25.7439;
  const rawLng = activeState?.lng || 89.2752;
  const speed = activeState?.speed || 31; // কিমি/ঘণ্টা

  // বর্তমান ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0] || { name: 'Parbatipur Jn' };
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1] || { name: 'Rangpur' };
  const originStation = scheduleData[0] || { name: 'Parbatipur Jn' };
  const destStation = scheduleData[scheduleData.length - 1] || { name: 'Bonarpara Jn' };

  // পরবর্তী স্টেশনের দূরত্ব ও আনুমানিক সময়
  const distanceToNext = useMemo(() => {
    if (activeState?.distanceToNext) return Math.round(activeState.distanceToNext);
    return 10;
  }, [activeState]);

  const etaMinutes = useMemo(() => {
    const s = Math.max(15, speed);
    return Math.round((distanceToNext / s) * 60) || 18;
  }, [distanceToNext, speed]);

  // প্রোগ্রেস পার্সেন্টেজ
  const progressPercent = useMemo(() => {
    if (activeState?.progress) return Math.round(activeState.progress);
    if (scheduleData.length > 1) {
      return Math.round((currentIdx / (scheduleData.length - 1)) * 100) || 22;
    }
    return 22;
  }, [activeState, currentIdx, scheduleData]);

  // গন্তব্য স্থানাঙ্ক
  const destCoords = nextStation?.coords || [25.7439, 89.2752];

  // ট্র্যাকে স্ন্যাপ করা প্রাথমিক স্থানাঙ্ক
  const initialSnap = useMemo(() => {
    return snapToRailTrack(rawLat, rawLng, destCoords[0], destCoords[1], railSegmentsData);
  }, [rawLat, rawLng, destCoords]);

  // রিয়েলটাইম ট্র্যাকিং স্টেট (মুভিং ট্রেন)
  const trainStateRef = useRef({
    lat: initialSnap.lat,
    lng: initialSnap.lng,
    bearing: initialSnap.bearing,
    segIdx: initialSnap.segmentIndex,
    t: initialSnap.t
  });

  // ২ডি / ৩ডি টগল
  const toggle2DMode = () => {
    const next2D = !is2DMode;
    setIs2DMode(next2D);
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      pitch: next2D ? 0 : 58,
      bearing: next2D ? 0 : trainStateRef.current.bearing,
      duration: 800
    });
  };

  // ফলো টগল
  const toggleFollow = () => {
    const nextFollow = !isFollowing;
    setIsFollowing(nextFollow);
    if (nextFollow && mapRef.current) {
      mapRef.current.easeTo({
        center: [trainStateRef.current.lng, trainStateRef.current.lat],
        pitch: is2DMode ? 0 : 58,
        bearing: is2DMode ? 0 : trainStateRef.current.bearing,
        zoom: is2DMode ? 14 : 15.2,
        duration: 900
      });
    }
  };

  // =========================================================================
  // ৪. ম্যাপ ইনিশিয়ালাইজেশন
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style,
      center: [initialSnap.lng, initialSnap.lat],
      zoom: is2DMode ? 14 : 15.2,
      pitch: is2DMode ? 0 : 58,
      bearing: is2DMode ? 0 : initialSnap.bearing,
      maxPitch: 75,
      antialias: true
    });

    mapRef.current = map;

    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    map.on('load', () => {
      // ১. সম্পূর্ণ নিখুঁত ৩ডি রেলওয়ে ট্র্যাক লেয়ার (ব্যালাস্ট, স্লিপার ও রেললাইন)
      const trackFeatures = railSegmentsData.map((seg, idx) => ({
        type: 'Feature',
        id: idx,
        geometry: {
          type: 'LineString',
          coordinates: [
            [seg[1], seg[0]],
            [seg[3], seg[2]]
          ]
        }
      }));

      map.addSource('real-rail-track', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: trackFeatures
        }
      });

      // লেয়ার ১: উজ্জ্বল লাইট-ধূসর ব্যালাস্ট পাথর বেড (Light Stone Ballast Bed)
      // স্যাটেলাইট ম্যাপে সবুজ মাঠের মাঝে পরিষ্কার স্পষ্ট দৃশ্যমান
      map.addLayer({
        id: 'rail-ballast-bed',
        type: 'line',
        source: 'real-rail-track',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#d1d5db',
          'line-width': 12,
          'line-opacity': 0.95
        }
      });

      // লেয়ার ২: কাঠের স্লিপার টাই (Sleeper Ties with dasharray)
      map.addLayer({
        id: 'rail-sleepers',
        type: 'line',
        source: 'real-rail-track',
        paint: {
          'line-color': '#475569',
          'line-width': 10,
          'line-dasharray': [0.25, 0.75],
          'line-opacity': 0.9
        }
      });

      // লেয়ার ৩: রূপালী স্টিল রেল ট্র্যাক (Steel Parallel Rails)
      map.addLayer({
        id: 'rail-steel-outer',
        type: 'line',
        source: 'real-rail-track',
        paint: {
          'line-color': '#1e293b',
          'line-width': 5,
          'line-opacity': 0.95
        }
      });

      // লেয়ার ৪: রেলের ভেতরের খাঁজ (Center gap between rails)
      map.addLayer({
        id: 'rail-steel-inner',
        type: 'line',
        source: 'real-rail-track',
        paint: {
          'line-color': '#e2e8f0',
          'line-width': 2.8,
          'line-opacity': 0.95
        }
      });

      // ২. স্ক্রিনশটের হুবহু বাস্তবসম্মত ৩ডি ট্রেন (লাল ইঞ্জিন + সবুজ বগি)
      const trainEl = document.createElement('div');
      trainEl.className = 'real-train-3d-asset';
      trainEl.style.transformOrigin = 'top center';
      trainEl.style.transform = `rotate(${initialSnap.bearing}deg)`;

      // ৭-৮টি কোচের নিখুঁত ভেক্টর মডেল (লাল ইঞ্জিন + সবুজ বগি)
      const coachesSvg = Array.from({ length: 8 }).map((_, i) => `
        <g transform="translate(0, ${22 + i * 18})">
          <!-- বগি বডি শ্যাডো -->
          <rect x="-0.5" y="1" width="11" height="15" rx="1.5" fill="rgba(0,0,0,0.5)" />
          <!-- সবুজ বডি (Bangladesh Railway Green) -->
          <rect x="0" y="0" width="10" height="15" rx="1.5" fill="#006a4e" />
          <!-- লাল স্ট্রাইপ লাইন -->
          <rect x="0" y="4" width="10" height="3" fill="#dc2626" />
          <!-- সাদা কার্ভড ছাদ -->
          <rect x="1.5" y="0" width="7" height="15" rx="1" fill="#f8fafc" />
          <!-- জানালা -->
          <rect x="0.5" y="5" width="1" height="1.5" fill="#0f172a" />
          <rect x="0.5" y="8" width="1" height="1.5" fill="#0f172a" />
          <rect x="0.5" y="11" width="1" height="1.5" fill="#0f172a" />
          <rect x="8.5" y="5" width="1" height="1.5" fill="#0f172a" />
          <rect x="8.5" y="8" width="1" height="1.5" fill="#0f172a" />
          <rect x="8.5" y="11" width="1" height="1.5" fill="#0f172a" />
          <!-- কাপলার গ্যাংওয়ে -->
          <rect x="3" y="15" width="4" height="3" fill="#1e293b" />
        </g>
      `).join('');

      trainEl.innerHTML = `
        <div style="position: relative; width: 40px; display: flex; flex-direction: column; align-items: center;">
          <svg width="30" height="200" viewBox="-10 0 30 200" style="overflow: visible;">
            <!-- লোকোমোটিভ লাল ইঞ্জিন (Red Engine) -->
            <g transform="translate(0, 0)">
              <rect x="-0.5" y="1" width="11" height="19" rx="3" fill="rgba(0,0,0,0.55)" />
              <path d="M 0.5 5 Q 5 0 9.5 5 L 9.5 19 L 0.5 19 Z" fill="#dc2626" stroke="#ffffff" stroke-width="0.4" />
              <!-- উইন্ডশিল্ড -->
              <path d="M 2 5 Q 5 2 8 5 L 8 7 L 2 7 Z" fill="#38bdf8" />
              <!-- হেডলাইট জোড়া -->
              <circle cx="2" cy="3.5" r="0.8" fill="#ffffff" />
              <circle cx="8" cy="3.5" r="0.8" fill="#ffffff" />
              <!-- কাপলার -->
              <rect x="3" y="19" width="4" height="3" fill="#1e293b" />
            </g>

            <!-- প্যাসেঞ্জার বগিসমূহ -->
            ${coachesSvg}
          </svg>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: trainEl,
        rotationAlignment: 'map',
        pitchAlignment: 'map',
        anchor: 'top'
      })
        .setLngLat([initialSnap.lng, initialSnap.lat])
        .addTo(map);

      trainMarkerRef.current = marker;
    });

    return () => {
      if (trainMarkerRef.current) trainMarkerRef.current.remove();
      map.remove();
    };
  }, [currentStyle]);

  // =========================================================================
  // ৫. স্মুথ ডেড-রেকনিং অ্যানিমেশন লুপ (দুই আপডেটের মাঝে ট্রেন ট্র্যাক ধরে চলে)
  // "দুই হালনাগাদের মাঝে ট্রেনটি সর্বশেষ জানা গতিতে সোজা এগোবে"
  // =========================================================================
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animateTrainOnTrack = (now) => {
      const dt = (now - lastTimestamp) / 1000; // সেকেন্ডে সময়
      lastTimestamp = now;

      const st = trainStateRef.current;
      const segs = railSegmentsData;

      if (segs && segs[st.segIdx]) {
        const [slat, slng, elat, elng] = segs[st.segIdx];
        const segDistMeters = Math.hypot(elat - slat, elng - slng) * 111000;

        if (segDistMeters > 0) {
          // গতি অনুযায়ী t বৃদ্ধি (speed km/h -> m/s)
          const metersPerSec = Math.max(8, (speed * 1000) / 3600);
          const dtMeters = metersPerSec * dt;
          st.t += dtMeters / segDistMeters;

          // সেগমেন্ট শেষ হলে পরবর্তী সেগমেন্টে মসৃণ ট্রানজিশন
          if (st.t >= 1) {
            st.t = 0;
            // পরবর্তী সংলগ্ন সেগমেন্ট খোঁজা
            let nextSegIdx = (st.segIdx + 1) % segs.length;
            for (let k = 0; k < segs.length; k++) {
              const cand = segs[k];
              if (Math.abs(cand[0] - elat) < 0.0005 && Math.abs(cand[1] - elng) < 0.0005) {
                nextSegIdx = k;
                break;
              }
            }
            st.segIdx = nextSegIdx;
          }

          // বর্তমান পজিশন ও হেডিং আপডেট
          const currSeg = segs[st.segIdx];
          st.lat = currSeg[0] + st.t * (currSeg[2] - currSeg[0]);
          st.lng = currSeg[1] + st.t * (currSeg[3] - currSeg[1]);

          const dx = currSeg[3] - currSeg[1];
          const dy = currSeg[2] - currSeg[0];
          st.bearing = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
        }

        // মার্কার পজিশন ও রোটেশন আপডেট
        if (trainMarkerRef.current) {
          trainMarkerRef.current.setLngLat([st.lng, st.lat]);
          const el = trainMarkerRef.current.getElement();
          if (el) el.style.transform = `rotate(${st.bearing}deg)`;
        }

        // ক্যামেরা ফলোইং (অনুসরণ চলছে)
        if (isFollowing && mapRef.current) {
          mapRef.current.easeTo({
            center: [st.lng, st.lat],
            bearing: is2DMode ? 0 : st.bearing,
            duration: 0
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animateTrainOnTrack);
    };

    animFrameRef.current = requestAnimationFrame(animateTrainOnTrack);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [speed, isFollowing, is2DMode]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0f1d',
        fontFamily: "'Hind Siliguri', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* =====================================================================
          ১. টপ-লেফট ক্যাপসুল (Ramsagar #60 8m দেরী)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            cursor: 'pointer',
            color: '#0f172a'
          }}
          title="ফিরে যান"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
            {train?.name?.split('(')[0]?.trim() || 'Ramsagar'} #{train?.number || '60'}
          </span>
          <span style={{ fontSize: '12px', color: '#d97706', fontWeight: '700' }}>
            {activeState?.delayMinutes > 0 ? `${activeState.delayMinutes}m দেরী` : 'অন টাইম'}
          </span>
        </div>
      </div>

      {/* =====================================================================
          ২. টপ-রাইট অ্যাকশন বাটনসমূহ (অনুসরণ চলছে, ২ডি, মানচিত্র, চ্যাট)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'flex-end'
        }}
      >
        {/* অনুসরণ বাটন (গ্রিন পিল) */}
        <button
          onClick={toggleFollow}
          style={{
            background: isFollowing ? '#006a4e' : '#475569',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <Crosshair size={14} />
          <span>{isFollowing ? 'অনুসরণ চলছে' : 'অনুসরণ বন্ধ'}</span>
        </button>

        {/* ২ডি / ৩ডি বাটন */}
        <button
          onClick={toggle2DMode}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        >
          <Compass size={14} />
          <span>{is2DMode ? '৩ডি' : '২ডি'}</span>
        </button>

        {/* মানচিত্র / স্যাটেলাইট সুইচ বাটন */}
        <button
          onClick={() => setCurrentStyle(currentStyle === 'satellite' ? 'streets' : 'satellite')}
          style={{
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        >
          <Layers size={14} />
          <span>{MAP_STYLES[currentStyle].name}</span>
        </button>

        {/* চ্যাট বাটন */}
        <button
          onClick={() => alert('লাইভ চ্যাট শীঘ্রই চালু হচ্ছে!')}
          style={{
            background: '#006a4e',
            color: '#ffffff',
            border: 'none',
            borderRadius: '20px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
        >
          <MessageCircle size={14} />
          <span>চ্যাট</span>
        </button>
      </div>

      {/* =====================================================================
          ৩. মূল ৩ডি ম্যাপ কন্টেইনার
      ===================================================================== */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* =====================================================================
          ৪. নিচের কার্ড (হুবহু স্ক্রিনশটের মতো হোয়াইট কার্ড)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          maxWidth: '560px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          zIndex: 100,
          color: '#0f172a'
        }}
      >
        {/* ৩টি কলাম: গতি | পরবর্তী স্টেশন | আনুমানিক পৌঁছানো */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>গতি</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {speed}{' '}
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>কিমি/ঘণ্টা</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>পরবর্তী স্টেশন</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              {nextStation?.name?.split('(')[0] || 'Rangpur'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              {distanceToNext} কিমি দূরে
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>আনুমানিক পৌঁছানো</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {etaMinutes}{' '}
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>মিনিট</span>
            </div>
          </div>
        </div>

        {/* প্রোগ্রেস বার (স্টেশন টু স্টেশন) */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>
            <span>{originStation?.name?.split('(')[0] || 'Parbatipur Jn'}</span>
            <span style={{ color: '#006a4e', fontWeight: '800' }}>{progressPercent}%</span>
            <span>{destStation?.name?.split('(')[0] || 'Bonarpara Jn'}</span>
          </div>

          <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: '#006a4e',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            ></div>
          </div>
        </div>

        {/* ফুটার নোট ও অ্যাট্রিবিউশন */}
        <div style={{ fontSize: '10px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px', lineHeight: 1.4 }}>
          <div>
            হালনাগাদ <span style={{ fontWeight: '700', color: '#0f172a' }}>Just now</span> • দুই হালনাগাদের মাঝে ট্রেনটি সর্বশেষ জানা গতিতে সোজা এগোবে এবং অবস্থান আপডেট করবে।
          </div>
          <div style={{ opacity: 0.75, marginTop: '2px', fontSize: '9px' }}>
            Powered by Esri • © OpenStreetMap contributors
          </div>
        </div>
      </div>
    </div>
  );
}
