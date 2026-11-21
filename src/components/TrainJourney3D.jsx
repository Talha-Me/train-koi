import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Volume2, VolumeX, RotateCcw, Map, Layers, Navigation, ArrowLeft, Crosshair, MessageCircle, Info } from 'lucide-react';

// =========================================================================
// ১. হাই-রেজোলিউশন ম্যাপ স্টাইলসমূহ (স্যাটেলাইট ও সাধারণ মানচিত্র)
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

// =========================================================================
// ২. বেয়ারিং / হেডিং ক্যালকুলেটর (ট্র্যাক বরাবর কোণ)
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

// বাংলা সংখ্যা কনভার্টার
const toBangla = (num) => {
  if (num === null || num === undefined) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bn[parseInt(d, 10)]);
};

// =========================================================================
// ৩. ট্রেনের হুইসেল ও বাস্তব ট্র্যাক সাউন্ড (Web Audio API)
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

// ট্রেনের চাকা ও ট্র্যাকের ক্লিক-ক্ল্যাক সাউন্ড
function startTrackAmbientSound() {
  const ctx = getAudioContext();
  if (!ctx || chugInterval) return;

  chugInterval = setInterval(() => {
    try {
      const now = ctx.currentTime;
      // মৃদু ক্লিক-ক্ল্যাক নয়েজ
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
      gain.gain.setValueAtTime(0.04, now);
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
// ৪. বাস্তবসম্মত ট্রেন কম্পোনেন্ট (Engine + 12 Coaches)
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

  const [currentStyle, setCurrentStyle] = useState('satellite'); // 'satellite' | 'streets'
  const [is2DMode, setIs2DMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);

  const trainLat = activeState?.lat || 23.8103;
  const trainLng = activeState?.lng || 90.4125;
  const speed = activeState?.speed || 50;

  // আগের ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0];
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1];

  // পরবর্তী স্টেশনের দূরত্ব
  const distanceToNext = useMemo(() => {
    if (activeState?.distanceToNext) return Math.round(activeState.distanceToNext);
    if (nextStation?.distance && prevStation?.distance) {
      return Math.max(1, Math.round(nextStation.distance - prevStation.distance));
    }
    return 24;
  }, [activeState, nextStation, prevStation]);

  // বেয়ারিং / হেডিং
  const bearing = useMemo(() => {
    if (nextStation && nextStation.coords) {
      return calculateBearing(trainLat, trainLng, nextStation.coords[0], nextStation.coords[1]);
    }
    return 42; // ডিফল্ট উত্তর-পূর্ব কোণ
  }, [trainLat, trainLng, nextStation]);

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
      duration: 1400
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
  // ম্যাপ ইনিশিয়ালাইজেশন
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
      // ১. বাস্তবসম্মত ৩ডি রেলওয়ে ট্র্যাক ড্রয়িং
      if (railData) {
        if (!map.getSource('rail-network')) {
          map.addSource('rail-network', {
            type: 'geojson',
            data: railData
          });

          // লেয়ার ১: সবুজ এমব্যাংকমেন্ট / মাটির বাঁধ (Green Embankment Bed)
          map.addLayer({
            id: 'track-embankment',
            type: 'line',
            source: 'rail-network',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#1b381e',
              'line-width': 22,
              'line-opacity': 0.85
            }
          });

          // লেয়ার ২: গ্রে ব্যালাস্ট পাথর বেড (Ballast Gravel Layer)
          map.addLayer({
            id: 'track-ballast',
            type: 'line',
            source: 'rail-network',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': '#78716c',
              'line-width': 14,
              'line-opacity': 0.95
            }
          });

          // লেয়ার ৩: রেল স্লিপার কাঠের টাই (Sleeper Ties with dasharray)
          map.addLayer({
            id: 'track-sleepers',
            type: 'line',
            source: 'rail-network',
            paint: {
              'line-color': '#292524',
              'line-width': 10,
              'line-dasharray': [0.25, 0.75],
              'line-opacity': 0.9
            }
          });

          // লেয়ার ৪: স্টিল রেললাইন জোড়া (Silver Steel Rail Tracks)
          map.addLayer({
            id: 'track-rails',
            type: 'line',
            source: 'rail-network',
            paint: {
              'line-color': '#e2e8f0',
              'line-width': 5.5,
              'line-opacity': 0.95
            }
          });

          // লেয়ার ৫: রেললাইনের মাঝের ফাঁক (Center separation)
          map.addLayer({
            id: 'track-center-gap',
            type: 'line',
            source: 'rail-network',
            paint: {
              'line-color': '#44403c',
              'line-width': 2.8,
              'line-opacity': 0.95
            }
          });
        }
      }

      // ২. ১২টি বগি সহ বাস্তব লাল-সবুজ ট্রেন মডেল তৈরি
      const trainEl = document.createElement('div');
      trainEl.className = 'real-train-3d-wrapper';
      trainEl.style.transformOrigin = 'center center';
      trainEl.style.transform = `rotate(${bearing}deg)`;
      trainEl.style.transition = 'transform 0.4s ease';

      // ১০-১২টি বগি ডাইনামিক রেন্ডারিং
      const coachesHtml = Array.from({ length: 11 }).map((_, i) => `
        <!-- বগি ${i + 1} -->
        <div style="
          position: relative;
          width: 14px;
          height: 30px;
          background: linear-gradient(90deg, #f8fafc 0%, #e2e8f0 40%, #ffffff 70%, #cbd5e1 100%);
          border-radius: 2px;
          border-left: 2px solid #006a4e;
          border-right: 2px solid #006a4e;
          box-shadow: 0 4px 8px rgba(0,0,0,0.45);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2px 0;
          overflow: hidden;
        ">
          <!-- লাল ব্যান্ড স্ট্রাইপ (Red Belt) -->
          <div style="position: absolute; top: 0; bottom: 0; left: 1px; right: 1px; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 3px;">
            <div style="height: 3px; background: #dc2626; width: 100%;"></div>
            <div style="height: 2px; background: #006a4e; width: 100%;"></div>
          </div>
          <!-- জানালা সারি -->
          <div style="position: absolute; top: 3px; bottom: 3px; left: 2px; right: 2px; display: flex; flex-direction: column; justify-content: space-around;">
            <div style="height: 3px; background: #1e293b; border-radius: 1px; opacity: 0.85;"></div>
            <div style="height: 3px; background: #1e293b; border-radius: 1px; opacity: 0.85;"></div>
            <div style="height: 3px; background: #1e293b; border-radius: 1px; opacity: 0.85;"></div>
            <div style="height: 3px; background: #1e293b; border-radius: 1px; opacity: 0.85;"></div>
          </div>
        </div>
        <!-- বগির সংযোগকারী কালো গ্যাংওয়ে (Gangway Bellows) -->
        <div style="width: 8px; height: 3px; background: #1e293b; border-radius: 1px;"></div>
      `).join('');

      trainEl.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          
          <!-- লোকোমোটিভ লাল ইঞ্জিন (Front Engine) -->
          <div style="
            width: 15px;
            height: 34px;
            background: linear-gradient(180deg, #dc2626 0%, #b91c1c 45%, #991b1b 100%);
            border-radius: 6px 6px 2px 2px;
            border: 1px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.6);
            position: relative;
            overflow: hidden;
          ">
            <!-- কেবিন গ্লাস -->
            <div style="position: absolute; top: 3px; left: 2px; right: 2px; height: 5px; background: #38bdf8; border-radius: 1px;"></div>
            <!-- হেডলাইট জোড়া -->
            <div style="position: absolute; top: 1px; left: 2px; width: 3px; height: 3px; background: #fff; border-radius: 50%; box-shadow: 0 0 6px #fef08a;"></div>
            <div style="position: absolute; top: 1px; right: 2px; width: 3px; height: 3px; background: #fff; border-radius: 50%; box-shadow: 0 0 6px #fef08a;"></div>
            <!-- ছাদের বিকন -->
            <div style="position: absolute; top: 13px; left: 50%; transform: translateX(-50%); width: 3px; height: 3px; background: #ef4444; border-radius: 50%;"></div>
          </div>
          <div style="width: 8px; height: 3px; background: #1e293b;"></div>

          <!-- প্যাসেঞ্জার কোচ সারি -->
          ${coachesHtml}

          <!-- শেষ বগি ট্যাগ (Floating Pill: ↑ ক শেষ বগি) -->
          <div style="
            position: absolute;
            bottom: -32px;
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
        anchor: 'center'
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

        // ট্রেনের সামনে সামান্য দূরে পিন প্লেস করা
        const aheadLat = trainLat + (nextStation.coords ? (nextStation.coords[0] - trainLat) * 0.15 : 0.005);
        const aheadLng = trainLng + (nextStation.coords ? (nextStation.coords[1] - trainLng) * 0.15 : 0.005);

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

  // পজিশন আপডেট হলে মার্কার সরানো
  useEffect(() => {
    if (trainMarkerRef.current) {
      trainMarkerRef.current.setLngLat([trainLng, trainLat]);
      const el = trainMarkerRef.current.getElement();
      if (el) el.style.transform = `rotate(${bearing}deg)`;
    }

    if (isFollowing && mapRef.current) {
      mapRef.current.easeTo({
        center: [trainLng, trainLat],
        duration: 800
      });
    }
  }, [trainLat, trainLng, bearing, isFollowing]);

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
        {/* ব্যাক বাটন */}
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

        {/* ট্রেন টাইটেল ও নম্বর ক্যাপসুল */}
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
              {train?.name?.split('(')[0]?.trim() || 'ট্রেন'}
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
            {train?.origin || 'প্রারম্ভিক'} - {train?.destination || 'গন্তব্য'}
          </span>
        </div>
      </div>

      {/* =====================================================================
          ২. মূল ৩ডি ম্যাপ কন্টেইনার
      ===================================================================== */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* =====================================================================
          ৩. ডানদিকের ফ্ল্যাটিং বাটনসমূহ (হুবহু স্ক্রিনশটের মতো)
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
              পরবর্তী <span style={{ color: '#0f172a' }}>{nextStation?.name?.split('(')[0] || 'স্টেশন'}</span>{' '}
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
                {activeState?.currentStationName || prevStation?.name?.split('(')[0] || 'স্টেশন'} • ৩.৯ কি
              </span>
            </div>

            {/* শেষ ডট */}
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#be185d', border: '2px solid #fff' }}></div>
          </div>

          {/* স্টেশন নামসমূহ (নিচে) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            <span>{prevStation?.name?.split('(')[0] || ''}</span>
            <span style={{ color: '#be185d', fontWeight: '700' }}>
              {nextStation?.name?.split('(')[0] || ''}
            </span>
          </div>
        </div>

        {/* তৃতীয় সারি: দুটি অ্যাকশন বাটন (বিস্তারিত ও চ্যাট) */}
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
