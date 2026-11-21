import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Volume2, VolumeX, RotateCcw, Map, ArrowLeft, Crosshair, MessageCircle } from 'lucide-react';
import railSegmentsData from '../data/railSegments.json';

// =========================================================================
// ১. হাই-রেজোলিউশন ম্যাপ স্টাইলসমূহ (স্যাটেলাইট ও মানচিত্র)
// =========================================================================
const MAP_STYLES = {
  satellite: {
    name: 'স্যাটেলাইট',
    style: {
      version: 8,
      sources: {
        'esri-imagery': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri, Maxar, Earthstar Geographics'
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
    name: 'মানচিত্র',
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
// ২. হাই-প্রিসিশন ট্র্যাক স্ন্যাপিং ও বিয়ারিং অ্যালগরিদম
// =========================================================================
function snapToRailTrack(lat, lng, destLat, destLng, segments) {
  if (!segments || !segments.length) {
    return { lat, lng, bearing: 45, distanceMeters: 0 };
  }

  let minDistanceSq = Infinity;
  let bestLat = lat;
  let bestLng = lng;
  let bestBearing = 45;

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

      const rad = Math.atan2(dx, dy);
      let brng = (rad * 180) / Math.PI;
      bestBearing = (brng + 360) % 360;
    }
  }

  // গন্তব্য স্টেশন অনুযায়ী ট্রেনের মুখ সামনের দিকে ঘোরানো
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
    distanceMeters: Math.sqrt(minDistanceSq) * 111000
  };
}

// =========================================================================
// ৩. ট্রেনের হুইসেল ও ট্র্যাক সাউন্ড (Web Audio API)
// =========================================================================
let audioCtx = null;
let chugInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTrainHorn() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const freqs = [311.13, 370.0, 466.16]; // Eb4, F#4, Bb4

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(freq * 1.015, now + 0.15);
    osc.frequency.linearRampToValueAtTime(freq * 0.99, now + 0.5);
    osc.frequency.linearRampToValueAtTime(freq, now + 1.1);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.setValueAtTime(0.18, now + 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.45);
  });
}

function startTrackAmbientSound() {
  const ctx = getAudioContext();
  if (!ctx || chugInterval) return;

  chugInterval = setInterval(() => {
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.08);
    } catch (_) {}
  }, 380);
}

function stopTrackAmbientSound() {
  if (chugInterval) {
    clearInterval(chugInterval);
    chugInterval = null;
  }
}

// =========================================================================
// ৪. মূল ৩ডি জার্নি ভিউ কম্পোনেন্ট
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
  const aheadMarkerRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [is2DMode, setIs2DMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  // কাঁচা জিপিএস পজিশন
  const rawLat = activeState?.lat || 24.3622;
  const rawLng = activeState?.lng || 88.9639;
  const speed = activeState?.speed || 50;

  // বর্তমান ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0];
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1];

  // গন্তব্য স্টেশনের স্থানাঙ্ক (হেডিং ঠিক রাখার জন্য)
  const destCoords = nextStation?.coords || [24.1568, 89.0558];

  // রেল ট্র্যাকে ম্যাথমেটিক্যাল স্ন্যাপ ও সঠিক বিয়ারিং
  const snapped = useMemo(() => {
    return snapToRailTrack(rawLat, rawLng, destCoords[0], destCoords[1], railSegmentsData);
  }, [rawLat, rawLng, destCoords]);

  const trainLat = snapped.lat;
  const trainLng = snapped.lng;
  const bearing = snapped.bearing;

  // পরবর্তী স্টেশনের দূরত্ব
  const distanceToNext = useMemo(() => {
    if (activeState?.distanceToNext) return Math.round(activeState.distanceToNext);
    if (nextStation?.distance && prevStation?.distance) {
      return Math.max(1, Math.round(nextStation.distance - prevStation.distance));
    }
    return 24;
  }, [activeState, nextStation, prevStation]);

  // সাউন্ড টগল
  const toggleSound = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      playTrainHorn();
      startTrackAmbientSound();
    } else {
      setSoundEnabled(false);
      stopTrackAmbientSound();
    }
  };

  useEffect(() => {
    return () => {
      stopTrackAmbientSound();
    };
  }, []);

  // ট্রেনের সাথে চলুন (Recenter Camera)
  const handleFollowTrain = () => {
    setIsFollowing(true);
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      center: [trainLng, trainLat],
      pitch: is2DMode ? 0 : 68,
      bearing: is2DMode ? 0 : bearing,
      zoom: is2DMode ? 14 : 17,
      duration: 1000
    });
  };

  // শুরুর ভিউ (Reset View)
  const handleResetView = () => {
    setIsFollowing(true);
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [trainLng, trainLat],
      pitch: 68,
      bearing: bearing,
      zoom: 17,
      duration: 1200
    });
  };

  // 2D / 3D মোড টগল
  const toggle2DMode = () => {
    const next2D = !is2DMode;
    setIs2DMode(next2D);
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      pitch: next2D ? 0 : 68,
      bearing: next2D ? 0 : bearing,
      duration: 900
    });
  };

  // =========================================================================
  // ৫. ম্যাপ ইনিশিয়ালাইজেশন
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style,
      center: [trainLng, trainLat],
      zoom: is2DMode ? 14 : 17,
      pitch: is2DMode ? 0 : 68,
      bearing: is2DMode ? 0 : bearing,
      maxPitch: 75,
      antialias: true
    });

    mapRef.current = map;

    map.on('dragstart', () => {
      setIsFollowing(false);
    });

    map.on('load', () => {
      // ১. হাই-প্রিসিশন রেলওয়ে ট্র্যাক লেয়ার
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

      map.addSource('high-precision-rail', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: trackFeatures
        }
      });

      // সবুজ বাঁধের কিনারা (Embankment)
      map.addLayer({
        id: 'track-embankment',
        type: 'line',
        source: 'high-precision-rail',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#16331a',
          'line-width': 18,
          'line-opacity': 0.85
        }
      });

      // ধূসর পাথরের ব্যালাস্ট বেড (Ballast Gravel Bed)
      map.addLayer({
        id: 'track-ballast',
        type: 'line',
        source: 'high-precision-rail',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#78716c',
          'line-width': 12,
          'line-opacity': 0.95
        }
      });

      // কাঠের রেল স্লিপার টাই (Sleepers Ties)
      map.addLayer({
        id: 'track-sleepers',
        type: 'line',
        source: 'high-precision-rail',
        paint: {
          'line-color': '#292524',
          'line-width': 9,
          'line-dasharray': [0.25, 0.75],
          'line-opacity': 0.95
        }
      });

      // রূপালী স্টিল রেল ট্র্যাক (Steel Rails)
      map.addLayer({
        id: 'track-rails',
        type: 'line',
        source: 'high-precision-rail',
        paint: {
          'line-color': '#e2e8f0',
          'line-width': 4.5,
          'line-opacity': 0.98
        }
      });

      // রেলের মাঝের খাঁজ (Inner gap)
      map.addLayer({
        id: 'track-center-gap',
        type: 'line',
        source: 'high-precision-rail',
        paint: {
          'line-color': '#44403c',
          'line-width': 2.2,
          'line-opacity': 0.98
        }
      });

      // ২. ১২টি বগি বিশিষ্ট বাস্তবসম্মত ট্রেন (SVG ভেক্টর - ট্র্যাকে নিখুঁতভাবে বসা)
      const trainEl = document.createElement('div');
      trainEl.className = 'real-train-3d-model';
      trainEl.style.transformOrigin = 'top center';
      trainEl.style.transform = `rotate(${bearing}deg)`;
      trainEl.style.transition = 'transform 0.4s ease';

      // ১০-১২টি কোচের বাস্তবসম্মত SVG লুক
      const coachesSvg = Array.from({ length: 11 }).map((_, i) => `
        <!-- বগি ${i + 1} -->
        <g transform="translate(0, ${28 + i * 24})">
          <!-- ড্রপ শ্যাডো -->
          <rect x="-1" y="1" width="14" height="20" rx="2" fill="rgba(0,0,0,0.5)" filter="blur(1px)" />
          <!-- বডি বেস (সবুজ) -->
          <rect x="0" y="0" width="12" height="20" rx="2" fill="#006a4e" />
          <!-- লাল স্ট্রাইপ বেল্ট -->
          <rect x="0" y="5" width="12" height="4" fill="#dc2626" />
          <!-- সাদা কার্ভড ছাদ -->
          <rect x="1.5" y="0" width="9" height="20" rx="1.5" fill="url(#roofGrad)" />
          <!-- কালো কাচের জানালা সারি -->
          <rect x="0.5" y="6" width="1" height="2" fill="#0f172a" />
          <rect x="0.5" y="10" width="1" height="2" fill="#0f172a" />
          <rect x="0.5" y="14" width="1" height="2" fill="#0f172a" />
          <rect x="10.5" y="6" width="1" height="2" fill="#0f172a" />
          <rect x="10.5" y="10" width="1" height="2" fill="#0f172a" />
          <rect x="10.5" y="14" width="1" height="2" fill="#0f172a" />
          <!-- কালো গ্যাংওয়ে সংযোগকারী -->
          <rect x="3.5" y="20" width="5" height="4" fill="#1e293b" />
        </g>
      `).join('');

      trainEl.innerHTML = `
        <div style="position: relative; width: 60px; display: flex; flex-direction: column; align-items: center;">
          
          <!-- ৩ডি ট্রেন SVG মডেল (ইঞ্জিন + ১১টি বগি) -->
          <svg width="40" height="310" viewBox="-14 0 40 310" style="overflow: visible;">
            <defs>
              <!-- ছাদের সিলভার-সাদা কার্ভড গ্রেডিয়েন্ট -->
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#cbd5e1" />
                <stop offset="35%" stop-color="#ffffff" />
                <stop offset="70%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#94a3b8" />
              </linearGradient>
              <!-- ইঞ্জিনের লাল গ্রেডিয়েন্ট -->
              <linearGradient id="engineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="50%" stop-color="#dc2626" />
                <stop offset="100%" stop-color="#991b1b" />
              </linearGradient>
            </defs>

            <!-- লোকোমোটিভ ইঞ্জিন (Engine Head) -->
            <g transform="translate(0, 0)">
              <!-- ইঞ্জিন গ্রাউন্ড শ্যাডো -->
              <rect x="-1" y="2" width="14" height="24" rx="4" fill="rgba(0,0,0,0.6)" />
              <!-- ইঞ্জিন বডি -->
              <path d="M 1 6 Q 6 0 11 6 L 11 24 L 1 24 Z" fill="url(#engineGrad)" stroke="#ffffff" stroke-width="0.5" />
              <!-- ফ্রন্ট কেবিন উইন্ডশিল্ড -->
              <path d="M 2.5 6 Q 6 2 9.5 6 L 9.5 9 L 2.5 9 Z" fill="#38bdf8" />
              <!-- হেডলাইট জোড়া -->
              <circle cx="2.5" cy="4" r="1" fill="#ffffff" />
              <circle cx="9.5" cy="4" r="1" fill="#ffffff" />
              <!-- ছাদের বিকন লাইট -->
              <circle cx="6" cy="13" r="1" fill="#fef08a" />
              <!-- গ্যাংওয়ে কাপলার -->
              <rect x="3.5" y="24" width="5" height="4" fill="#1e293b" />
            </g>

            <!-- বগি সারি -->
            ${coachesSvg}
          </svg>

          <!-- শেষ বগি ট্যাগ (Floating Pill: ↑ ক শেষ বগি) -->
          <div style="
            position: absolute;
            bottom: -22px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            color: #1e293b;
            border-radius: 20px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            white-space: nowrap;
            pointer-events: none;
            z-index: 50;
          ">
            <span style="color: #be185d; font-size: 12px;">↑</span>
            <span style="
              width: 16px;
              height: 16px;
              background: #be185d;
              color: #ffffff;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: 800;
            ">ক</span>
            <span>শেষ বগি</span>
          </div>

        </div>
      `;

      const marker = new maplibregl.Marker({
        element: trainEl,
        rotationAlignment: 'map',
        pitchAlignment: 'map',
        anchor: 'top' // ট্রেনের ইঞ্জিন থাকবে স্ন্যাপ করা পয়েন্টে
      })
        .setLngLat([trainLng, trainLat])
        .addTo(map);

      trainMarkerRef.current = marker;

      // ৩. ট্রেনের সামনে পরবর্তী স্টেশন ফ্লোটিং পিন (↑ ঈশ্বরদী বাইপাস ২৪ কি)
      if (nextStation) {
        const aheadEl = document.createElement('div');
        aheadEl.className = 'ahead-station-pill';
        aheadEl.innerHTML = `
          <div style="
            background: #ffffff;
            color: #be185d;
            border-radius: 20px;
            padding: 5px 12px;
            font-size: 12px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.35);
            white-space: nowrap;
            cursor: pointer;
          ">
            <span style="font-size: 14px;">↑</span>
            <span style="color: #be185d;">${nextStation.name.split('(')[0]}</span>
            <span style="color: #64748b; font-weight: 600;">${toBangla(distanceToNext)} কি</span>
          </div>
        `;

        // ট্রেনের সামনে ট্র্যাকে কিছুটা দূরে পিন প্লেস করা
        const rad = (bearing * Math.PI) / 180;
        const forwardOffset = 0.004; // ~400 মিটার সামনে
        const aheadLat = trainLat + Math.cos(rad) * forwardOffset;
        const aheadLng = trainLng + Math.sin(rad) * forwardOffset;

        const aheadMarker = new maplibregl.Marker({
          element: aheadEl,
          anchor: 'bottom',
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport'
        })
          .setLngLat([aheadLng, aheadLat])
          .addTo(map);

        aheadMarkerRef.current = aheadMarker;
      }
    });

    return () => {
      if (trainMarkerRef.current) trainMarkerRef.current.remove();
      if (aheadMarkerRef.current) aheadMarkerRef.current.remove();
      map.remove();
    };
  }, [currentStyle]);

  // পজিশন ও বিয়ারিং আপডেট হলে ট্রেন মার্কার আপডেট করা
  useEffect(() => {
    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([trainLng, trainLat]);
      const el = trainMarkerRef.current.getElement();
      if (el) el.style.transform = `rotate(${bearing}deg)`;
    }

    if (isFollowing && mapRef.current) {
      mapRef.current.easeTo({
        center: [trainLng, trainLat],
        bearing: is2DMode ? 0 : bearing,
        duration: 800
      });
    }
  }, [trainLat, trainLng, bearing, isFollowing, is2DMode]);

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
          ১. টপ হেডার ক্যাপসুল (হুবহু স্ক্রিনশটের মতো)
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
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            cursor: 'pointer',
            color: '#be185d'
          }}
          title="ফিরে যান"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '7px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              {train?.name?.split('(')[0]?.trim() || 'দ্রুতযান এক্সপ্রেস'}
            </span>
            <span
              style={{
                background: '#fce7f3',
                color: '#be185d',
                fontSize: '11px',
                fontWeight: '800',
                padding: '1px 7px',
                borderRadius: '10px'
              }}
            >
              {toBangla(train?.number || '৭৫৩')}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            {train?.origin || 'পঞ্চগড়'} - {train?.destination || 'ঢাকা'}
          </span>
        </div>
      </div>

      {/* =====================================================================
          ২. মূল ৩ডি ম্যাপ কন্টেইনার
      ===================================================================== */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* =====================================================================
          ৩. ডানদিকের ফ্ল্যাটিং বাটনসমূহ
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '220px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        {/* ১. সাউন্ড টগল */}
        <button
          onClick={toggleSound}
          style={{
            width: '48px',
            height: '48px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            color: soundEnabled ? '#be185d' : '#475569',
            padding: '4px'
          }}
          title={soundEnabled ? 'শব্দ বন্ধ করুন' : 'শব্দ চালু করুন'}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span style={{ fontSize: '9px', fontWeight: '700', marginTop: '2px' }}>
            {soundEnabled ? 'শব্দ চালু' : 'শব্দ বন্ধ'}
          </span>
        </button>

        {/* ২. শুরুর ভিউ */}
        <button
          onClick={handleResetView}
          style={{
            width: '48px',
            height: '48px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            color: '#be185d',
            padding: '4px'
          }}
          title="শুরুর ভিউতে রিসেট করুন"
        >
          <RotateCcw size={18} />
          <span style={{ fontSize: '9px', fontWeight: '700', marginTop: '2px', color: '#475569' }}>
            শুরুর ভিউ
          </span>
        </button>

        {/* ৩. মানচিত্র লেয়ার সুইচ */}
        <button
          onClick={() => setCurrentStyle(currentStyle === 'satellite' ? 'streets' : 'satellite')}
          style={{
            width: '48px',
            height: '48px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            color: '#0284c7',
            padding: '4px'
          }}
          title="মানচিত্র মোড পরিবর্তন"
        >
          <Map size={18} />
          <span style={{ fontSize: '9px', fontWeight: '700', marginTop: '2px', color: '#475569' }}>
            {currentStyle === 'satellite' ? 'মানচিত্র' : 'স্যাটেলাইট'}
          </span>
        </button>

        {/* ৪. 2D / 3D টগল */}
        <button
          onClick={toggle2DMode}
          style={{
            width: '48px',
            height: '48px',
            background: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            color: '#0f172a',
            fontWeight: '800',
            fontSize: '13px'
          }}
          title="2D বা 3D তে পরিবর্তন করুন"
        >
          {is2DMode ? '3D' : '2D'}
        </button>
      </div>

      {/* =====================================================================
          ৪. মাঝখানের ফ্লোটিং বাটন: "ট্রেনের সাথে চলুন" (Follow Train)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '185px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100
        }}
      >
        <button
          onClick={handleFollowTrain}
          style={{
            background: '#be185d',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(190, 24, 93, 0.45)',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
        >
          <Crosshair size={16} />
          <span>ট্রেনের সাথে চলুন</span>
        </button>
      </div>

      {/* =====================================================================
          ৫. নিচের তথ্য কার্ড (হুবহু স্ক্রিনশটের মতো হোয়াইট কার্ড)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          maxWidth: '520px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '16px 18px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.22)',
          zIndex: 100,
          color: '#0f172a'
        }}
      >
        {/* প্রথম সারি: পরবর্তী স্টেশন ও স্পিড ব্যাজ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              পরবর্তী <span style={{ color: '#0f172a' }}>{nextStation?.name?.split('(')[0] || 'ঈশ্বরদী বাইপাস'}</span>{' '}
              <span style={{ color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                ({toBangla(distanceToNext)} কি)
              </span>
            </div>
            {/* ডিলে ও লাইভ স্ট্যাটাস */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '12px' }}>
              <span style={{ color: '#be185d', fontWeight: '800' }}>
                {activeState?.delayMinutes > 0
                  ? `${toBangla(Math.floor(activeState.delayMinutes / 60) > 0 ? `${Math.floor(activeState.delayMinutes / 60)}ঘ ` : '')}${toBangla(activeState.delayMinutes % 60)}মি বিলম্বে`
                  : 'সময়মতো চলছে'}
              </span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: '700' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }}></span>
                লাইভ
              </span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#64748b' }}>১ মি আগে</span>
            </div>
          </div>

          {/* স্পিডোমিটার ব্যাজ */}
          <div
            style={{
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: '55px'
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>
              {toBangla(speed)}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', marginTop: '2px' }}>
              কি/ঘ
            </div>
          </div>
        </div>

        {/* দ্বিতীয় সারি: সেগমেন্ট টাইমলাইন প্রোগ্রেস লাইন */}
        <div style={{ marginTop: '14px', marginBottom: '14px', position: 'relative' }}>
          {/* ট্র্যাক লাইন */}
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: '45%',
                background: '#be185d',
                borderRadius: '2px'
              }}
            ></div>
          </div>

          {/* স্টেশন ডটস ও ট্রেন আইকন */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {/* শুরু ডট */}
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#be185d', border: '2px solid #fff' }}></div>

            {/* মধ্যবর্তী ট্রেনের অবস্থান ব্যাজ */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: 'translateY(-2px)'
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#be185d',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(190, 24, 93, 0.4)',
                  fontSize: '13px'
                }}
              >
                🚆
              </div>
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#475569', marginTop: '4px', whiteSpace: 'nowrap' }}>
                {activeState?.currentStationName || prevStation?.name?.split('(')[0] || 'মালঞ্চি'} • ৩.৯ কি
              </span>
            </div>

            {/* শেষ ডট */}
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#be185d', border: '2px solid #fff' }}></div>
          </div>

          {/* স্টেশন নামসমূহ (নিচে) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            <span>{prevStation?.name?.split('(')[0] || 'নাটোর'}</span>
            <span style={{ color: '#be185d', fontWeight: '700' }}>
              {nextStation?.name?.split('(')[0] || 'ঈশ্বরদী বাইপাস'}
            </span>
          </div>
        </div>

        {/* তৃতীয় সারি: দুটি অ্যাকশন বাটন */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '800',
              color: '#0f172a',
              cursor: 'pointer'
            }}
          >
            <span style={{ color: '#be185d' }}>🚆</span>
            <span>বিস্তারিত</span>
          </button>

          <button
            onClick={() => alert('ট্রেন চ্যাট ফিচারটি শীঘ্রই আসছে!')}
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '800',
              color: '#0f172a',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} color="#be185d" />
            <span>চ্যাট</span>
          </button>
        </div>
      </div>
    </div>
  );
}
