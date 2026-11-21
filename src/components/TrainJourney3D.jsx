import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Volume2, VolumeX, Eye, Compass, Navigation, Layers, X, Sparkles, FastForward } from 'lucide-react';

// =========================================================================
// ১. ম্যাপ স্টাইলসমূহ (সম্পূর্ণ ফ্রি এবং ওপেন, কোনো এপিআই কী ছাড়া)
// =========================================================================
const MAP_STYLES = {
  satellite: {
    name: 'স্যাটেলাইট 3D',
    icon: '🛰️',
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
  dark: {
    name: 'নাইট / ডার্ক 3D',
    icon: '🌃',
    style: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap, © CARTO'
        }
      },
      layers: [
        {
          id: 'dark-tiles',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  streets: {
    name: 'ডে / স্ট্রিট 3D',
    icon: '🗺️',
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

// =========================================================================
// ২. বেয়ারিং / হেডিং ক্যালকুলেশন (ট্রেন কোন দিকে মুখ করে চলছে)
// =========================================================================
function calculateBearing(startLat, startLng, destLat, destLng) {
  const startLatRad = (startLat * Math.PI) / 180;
  const startLngRad = (startLng * Math.PI) / 180;
  const destLatRad = (destLat * Math.PI) / 180;
  const destLngRad = (destLng * Math.PI) / 180;

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// =========================================================================
// ৩. ট্রেনের বাস্তবসম্মত হুইসেল / হর্ন সিন্থেসাইজার (Web Audio API)
// =========================================================================
function playRealisticTrainHorn() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // বাংলাদেশ রেলওয়ের ডিজেল-ইলেকট্রিক ট্রেনের ক্লাসিক ডুয়াল-টোন হর্ন
    const freqs = [311.13, 370.0, 466.16]; // Eb4, F#4, Bb4
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // বাস্তব ট্রেনের কম্পন ভাইব্রেশন
      osc.frequency.linearRampToValueAtTime(freq * 1.015, now + 0.15);
      osc.frequency.linearRampToValueAtTime(freq * 0.99, now + 0.5);
      osc.frequency.linearRampToValueAtTime(freq, now + 1.1);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08); // attack
      gain.gain.setValueAtTime(0.18, now + 0.85); // sustain
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4); // release

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.45);
    });
  } catch (err) {
    console.error('Train horn error:', err);
  }
}

// =========================================================================
// ৪. মূল ৩ডি ভিউ কম্পোনেন্ট
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
  const stationMarkersRef = useRef([]);

  const [currentStyleKey, setCurrentStyleKey] = useState('satellite');
  const [cameraMode, setCameraMode] = useState('chase'); // 'chase' | 'drone' | 'free'
  const [isHornActive, setIsHornActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  // ট্রেনটির বর্তমান অবস্থান
  const trainLat = activeState?.lat || 23.8103;
  const trainLng = activeState?.lng || 90.4125;
  const speed = activeState?.speed || 50;

  // পরবর্তী স্টেশন ও দিক (Bearing) নির্ধারণ
  const nextStation = useMemo(() => {
    if (!scheduleData.length) return null;
    const nextIdx = (activeState?.segmentIndex ?? 0) + 1;
    return scheduleData[nextIdx] || scheduleData[scheduleData.length - 1];
  }, [scheduleData, activeState?.segmentIndex]);

  const bearing = useMemo(() => {
    if (nextStation && nextStation.coords) {
      return calculateBearing(trainLat, trainLng, nextStation.coords[0], nextStation.coords[1]);
    }
    return 45; // Default heading northeast
  }, [trainLat, trainLng, nextStation]);

  // হর্ন বাজানো
  const handleHornPress = () => {
    setIsHornActive(true);
    if (soundEnabled) {
      playRealisticTrainHorn();
    }
    setTimeout(() => setIsHornActive(false), 1200);
  };

  // =========================================================================
  // ম্যাপ ইনিশিয়ালাইজেশন
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialPitch = cameraMode === 'chase' ? 65 : cameraMode === 'drone' ? 45 : 0;
    const initialZoom = cameraMode === 'chase' ? 16 : cameraMode === 'drone' ? 14 : 12;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyleKey].style,
      center: [trainLng, trainLat],
      zoom: initialZoom,
      pitch: initialPitch,
      bearing: cameraMode === 'free' ? 0 : bearing,
      maxPitch: 75,
      antialias: true
    });

    mapRef.current = map;

    map.on('load', () => {
      // ১. রেলওয়ে লাইন 3D তে যোগ করা
      if (railData) {
        if (!map.getSource('rail-network')) {
          map.addSource('rail-network', {
            type: 'geojson',
            data: railData
          });

          // গ্লোয়িং রেললাইন শ্যাডো / আউটার গ্লো
          map.addLayer({
            id: 'rail-glow',
            type: 'line',
            source: 'rail-network',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#10b981',
              'line-width': 8,
              'line-opacity': 0.4,
              'line-blur': 4
            }
          });

          // মূল রেলওয়ে লাইন
          map.addLayer({
            id: 'rail-line',
            type: 'line',
            source: 'rail-network',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#22c55e',
              'line-width': 4,
              'line-opacity': 0.95
            }
          });

          // স্লিপার / রেল স্লিপার ড্যাশ লাইন এফেক্ট
          map.addLayer({
            id: 'rail-ties',
            type: 'line',
            source: 'rail-network',
            paint: {
              'line-color': '#ffffff',
              'line-width': 2,
              'line-dasharray': [0.5, 1.5],
              'line-opacity': 0.8
            }
          });
        }
      }

      // ২. ৩ডি কাস্টম ট্রেন মার্কার তৈরি
      const trainEl = document.createElement('div');
      trainEl.className = 'train-3d-model-wrapper';
      trainEl.innerHTML = `
        <div style="
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center center;
          transform: rotate(${bearing}deg);
          transition: transform 0.4s ease;
        ">
          <!-- সামনে প্রজেক্টেড হেডলাইট বিম (Headlight Cone) -->
          <div style="
            position: absolute;
            top: -120px;
            left: 50%;
            transform: translateX(-50%);
            width: 90px;
            height: 130px;
            background: radial-gradient(ellipse at 50% 100%, rgba(254, 240, 138, 0.65) 0%, rgba(253, 224, 71, 0.25) 50%, rgba(250, 204, 21, 0) 100%);
            clip-path: polygon(40% 100%, 60% 100%, 100% 0%, 0% 0%);
            pointer-events: none;
            filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.7));
          "></div>

          <!-- ইঞ্জিন গ্রাউন্ড শ্যাডো -->
          <div style="
            position: absolute;
            width: 32px;
            height: 60px;
            background: rgba(0,0,0,0.5);
            border-radius: 8px;
            filter: blur(5px);
            transform: translateY(4px);
          "></div>

          <!-- মূল ৩ডি ট্রেন মডেল (লোকোমোটিভ ও বগি) -->
          <div style="
            position: relative;
            width: 28px;
            height: 64px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          ">
            <!-- লোকোমোটিভ ইঞ্জিন (Engine Head) -->
            <div style="
              width: 24px;
              height: 32px;
              background: linear-gradient(180deg, #dc2626 0%, #991b1b 30%, #006a4e 35%, #064e3b 100%);
              border-radius: 6px 6px 3px 3px;
              border: 1.5px solid #ffffff;
              box-shadow: 0 4px 10px rgba(0,0,0,0.6);
              position: relative;
              overflow: hidden;
            ">
              <!-- ফ্রন্ট কেবিন উইন্ডশিল্ড -->
              <div style="
                position: absolute;
                top: 4px;
                left: 3px;
                right: 3px;
                height: 6px;
                background: #38bdf8;
                border-radius: 2px;
                box-shadow: inset 0 0 3px rgba(255,255,255,0.8);
              "></div>
              <!-- হেডলাইট জোড়া -->
              <div style="
                position: absolute;
                top: 1px;
                left: 4px;
                width: 3px;
                height: 3px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 6px #fef08a;
              "></div>
              <div style="
                position: absolute;
                top: 1px;
                right: 4px;
                width: 3px;
                height: 3px;
                background: #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 6px #fef08a;
              "></div>
              <!-- ছাদের লাল-সবুজ পালসিং বিকন -->
              <div style="
                position: absolute;
                top: 14px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background: #ef4444;
                border-radius: 50%;
                box-shadow: 0 0 8px #ef4444;
              "></div>
            </div>

            <!-- বগি ১ (Passenger Coach 1) -->
            <div style="
              width: 20px;
              height: 24px;
              background: linear-gradient(180deg, #006a4e, #047857);
              border-radius: 2px;
              border: 1px solid rgba(255,255,255,0.6);
              box-shadow: 0 2px 5px rgba(0,0,0,0.4);
              position: relative;
            ">
              <!-- প্যাসেঞ্জার জানালা -->
              <div style="
                position: absolute;
                top: 3px;
                left: 2px;
                right: 2px;
                height: 4px;
                background: #fef08a;
                border-radius: 1px;
                opacity: 0.85;
              "></div>
            </div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({
        element: trainEl,
        rotationAlignment: 'map',
        pitchAlignment: 'map',
        anchor: 'center'
      })
        .setLngLat([trainLng, trainLat])
        .addTo(map);

      trainMarkerRef.current = marker;

      // ৩. স্টেশনসমূহ ৩ডি পিন হিসেবে ম্যাপে সেট করা (আপরাইট বিলবোর্ড পার্সপেক্টিভ)
      scheduleData.forEach((st, idx) => {
        if (!st.coords) return;
        const isNext = nextStation?.name === st.name;
        const isPassed = activeState?.segmentIndex !== undefined ? idx < activeState.segmentIndex : false;

        const stEl = document.createElement('div');
        stEl.className = 'station-3d-billboard';
        stEl.style.transformOrigin = 'bottom center';
        stEl.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));
          ">
            <!-- স্টেশন ফ্লোটিং বিলবোর্ড ট্যাগ -->
            <div style="
              background: ${isNext ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : (isPassed ? '#334155' : 'rgba(15, 23, 42, 0.85)')};
              color: #ffffff;
              border: 1.5px solid ${isNext ? '#fecaca' : 'rgba(255,255,255,0.25)'};
              padding: 4px 9px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              letter-spacing: 0.3px;
              display: flex;
              align-items: center;
              gap: 5px;
              backdrop-filter: blur(6px);
              ${isNext ? 'animation: bounce 1.5s infinite;' : ''}
            ">
              <span>${isNext ? '📍 পরবর্তী: ' : '🚉 '}${st.name.split('(')[0]}</span>
              ${st.distance ? `<span style="font-size: 9px; opacity: 0.8; background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 4px;">${st.distance} কিমি</span>` : ''}
            </div>
            <!-- কানেক্টিং পিন লাইন -->
            <div style="width: 2px; height: 16px; background: ${isNext ? '#ef4444' : '#ffffff'}; opacity: 0.9;"></div>
            <!-- ট্র্যাকে পয়েন্ট ডট -->
            <div style="width: 8px; height: 8px; background: ${isNext ? '#ef4444' : '#ffffff'}; border-radius: 50%; box-shadow: 0 0 6px ${isNext ? '#ef4444' : '#fff'};"></div>
          </div>
        `;

        const stMarker = new maplibregl.Marker({
          element: stEl,
          anchor: 'bottom',
          pitchAlignment: 'viewport',
          rotationAlignment: 'viewport'
        })
          .setLngLat([st.coords[1], st.coords[0]])
          .addTo(map);

        stationMarkersRef.current.push(stMarker);
      });
    });

    return () => {
      stationMarkersRef.current.forEach(m => m.remove());
      stationMarkersRef.current = [];
      if (trainMarkerRef.current) trainMarkerRef.current.remove();
      map.remove();
    };
  }, [currentStyleKey]);

  // =========================================================================
  // ক্যামেরা মোড ও ভিউ নিয়ন্ত্রণ
  // =========================================================================
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (cameraMode === 'chase') {
      // ট্রেনের ঠিক পেছনে ড্রাইভ ভিউতে লক
      map.easeTo({
        center: [trainLng, trainLat],
        pitch: 65,
        bearing: bearing,
        zoom: 16,
        duration: 1200
      });
    } else if (cameraMode === 'drone') {
      // ড্রোন / টপ-ডাউন এঙ্গেল
      map.easeTo({
        center: [trainLng, trainLat],
        pitch: 45,
        bearing: bearing,
        zoom: 14.5,
        duration: 1200
      });
    } else if (cameraMode === 'free') {
      // ফ্রি মোড: ব্যবহারকারী নিজেই নিজের মতো ঘুরাবে
      map.easeTo({
        pitch: 50,
        duration: 800
      });
    }
  }, [cameraMode, trainLng, trainLat, bearing]);

  // লাইভ ট্রেন পজিশন আপডেট হলে মার্কার সরানো
  useEffect(() => {
    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([trainLng, trainLat]);
      const el = trainMarkerRef.current.getElement();
      if (el) {
        const inner = el.querySelector('div');
        if (inner) inner.style.transform = `rotate(${bearing}deg)`;
      }
    }
  }, [trainLat, trainLng, bearing]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0a0f1d',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Hind Siliguri', system-ui, sans-serif"
      }}
    >
      {/* =====================================================================
          ১. টপ নেভিগেশন ও ককপিট বার
      ===================================================================== */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '12px 16px',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.7) 70%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #006a4e, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 106, 78, 0.5)'
            }}
          >
            <span style={{ fontSize: '20px' }}>🚆</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
                {train?.name || 'ট্রেন'} #{train?.number || ''}
              </h2>
              <span
                style={{
                  background: '#22c55e',
                  color: '#064e3b',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#064e3b', animation: 'ping 1.5s infinite' }}></span>
                3D LIVE
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
              {train?.origin || ''} ➔ {train?.destination || ''} • গতি {speed} কিমি/ঘ
            </p>
          </div>
        </div>

        {/* ডানদিকের ক্লোজ ও সাউন্ড বাটন */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* সাউন্ড টগল */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: soundEnabled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: soundEnabled ? '#4ade80' : '#94a3b8',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={soundEnabled ? 'সাউন্ড চালু' : 'সাউন্ড বন্ধ'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* প্রস্থান বাটন */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
            <span>বন্ধ করুন</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          ২. ৩ডি ম্যাপ কন্টেইনার
      ===================================================================== */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* =====================================================================
          ৩. ফ্লোটিং কন্ট্রোলস (ক্যামেরা মোড, হর্ন ও লেয়ার সুইচ)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          right: '16px',
          top: '80px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* চেইস ক্যামেরা মোড */}
        <button
          onClick={() => setCameraMode('chase')}
          style={{
            background: cameraMode === 'chase' ? '#22c55e' : 'rgba(15, 23, 42, 0.85)',
            color: cameraMode === 'chase' ? '#064e3b' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Navigation size={16} />
          <span>চেইস ভিউ</span>
        </button>

        {/* ড্রোন ভিউ মোড */}
        <button
          onClick={() => setCameraMode('drone')}
          style={{
            background: cameraMode === 'drone' ? '#38bdf8' : 'rgba(15, 23, 42, 0.85)',
            color: cameraMode === 'drone' ? '#082f49' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Eye size={16} />
          <span>ড্রোন ভিউ</span>
        </button>

        {/* ফ্রি রোটেট ভিউ */}
        <button
          onClick={() => setCameraMode('free')}
          style={{
            background: cameraMode === 'free' ? '#f59e0b' : 'rgba(15, 23, 42, 0.85)',
            color: cameraMode === 'free' ? '#451a03' : '#ffffff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Compass size={16} />
          <span>ফ্রি রোটেট</span>
        </button>

        {/* ম্যাপ লেয়ার মেনু */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              width: '100%'
            }}
          >
            <Layers size={16} />
            <span>লেয়ার</span>
          </button>

          {showStyleMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                minWidth: '150px'
              }}
            >
              {Object.entries(MAP_STYLES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentStyleKey(key);
                    setShowStyleMenu(false);
                  }}
                  style={{
                    background: currentStyleKey === key ? 'rgba(34, 197, 94, 0.25)' : 'transparent',
                    color: currentStyleKey === key ? '#4ade80' : '#e2e8f0',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================================
          ৪. সেন্ট্রাল হুইসেল / হর্ন বাটন (বাস্তব ট্রেনের মতো বাজবে)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          right: '16px',
          zIndex: 10
        }}
      >
        <button
          onClick={handleHornPress}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isHornActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
            border: '3px solid #ffffff',
            boxShadow: isHornActive ? '0 0 25px #f59e0b' : '0 6px 20px rgba(239, 68, 68, 0.6)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            transform: isHornActive ? 'scale(1.12)' : 'scale(1)'
          }}
          title="ট্রেনের হর্ন বাজান"
        >
          <Volume2 size={22} />
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>হর্ন</span>
        </button>
      </div>

      {/* =====================================================================
          ৫. নিচের হরাইজন্টাল স্টেশন স্ট্রিপ (BD Train Tracking এর মতো StopStripView)
      ===================================================================== */}
      <footer
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'linear-gradient(0deg, rgba(10, 15, 29, 0.98) 0%, rgba(15, 23, 42, 0.85) 80%, transparent 100%)',
          padding: '16px 16px 20px',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🚉 পরবর্তী স্টপেজসমূহ (লাইভ ট্র্যাকিং)
          </span>
          {nextStation && (
            <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '700' }}>
              পরবর্তী: {nextStation.name.split('(')[0]}
            </span>
          )}
        </div>

        {/* অনুভূমিক স্ক্রলিং স্টেশন কার্ডসমূহ */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {scheduleData.map((st, idx) => {
            const isNext = nextStation?.name === st.name;
            const isPassed = activeState?.segmentIndex !== undefined ? idx < activeState.segmentIndex : false;

            return (
              <div
                key={idx}
                style={{
                  minWidth: '130px',
                  background: isNext ? 'rgba(220, 38, 38, 0.25)' : (isPassed ? 'rgba(51, 65, 85, 0.3)' : 'rgba(30, 41, 59, 0.6)'),
                  border: isNext ? '1.5px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isNext && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '8px',
                      fontWeight: '800',
                      padding: '1px 5px',
                      borderRadius: '0 0 0 6px'
                    }}
                  >
                    NEXT
                  </div>
                )}
                <div style={{ fontSize: '12px', fontWeight: '800', color: isPassed ? '#94a3b8' : '#f8fafc' }}>
                  {st.name.split('(')[0]}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{st.distance ? `${st.distance} কিমি` : '০ কিমি'}</span>
                  <span>{st.departure || st.arrival || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
