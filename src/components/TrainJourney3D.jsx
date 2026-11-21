import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// Vite-এ MapLibre Web Worker URL সেট করা যাতে সব ব্রাউজার ও ডিভাইসে GeoJSON ট্র্যাক রেন্ডার হয়
maplibregl.setWorkerUrl(maplibreWorkerUrl);

import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Compass,
  Layers,
  MessageCircle,
  FileText,
  Navigation,
  Crosshair
} from 'lucide-react';
import railSegmentsData from '../data/railSegments.json';

// =========================================================================
// ১. ম্যাপ স্টাইলসমূহ (স্যাটেলাইট ও ওপেনস্ট্রিটম্যাপ)
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
          attribution: 'Powered by Esri • © OpenStreetMap contributors'
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
// ২. নিখুঁত ভেক্টর ট্র্যাক স্ন্যাপিং (Snapping + Forward Travel Orientation)
// =========================================================================
function snapToRailTrack(lat, lng, destLat, destLng, segments) {
  if (!segments || !segments.length) {
    return {
      lat,
      lng,
      bearing: 45,
      segIdx: 0,
      t: 0,
      p1: [lat, lng],
      p2: [lat + 0.001, lng + 0.001]
    };
  }

  let minDistanceSq = Infinity;
  let bestIdx = 0;
  let bestT = 0;
  let bestLat = lat;
  let bestLng = lng;
  let bestP1 = [segments[0][0], segments[0][1]];
  let bestP2 = [segments[0][2], segments[0][3]];

  for (let i = 0; i < segments.length; i++) {
    const [slat, slng, elat, elng] = segments[i];

    // ফার্স্ট পাস বাউন্ডিং বক্স ফিল্টার (দ্রুততার জন্য)
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
      bestP1 = [slat, slng];
      bestP2 = [elat, elng];
    }
  }

  // গন্তব্য স্টেশন অনুযায়ী সেগমেন্টের ডিরেকশন ওরিয়েন্টেড করা
  let finalP1 = bestP1;
  let finalP2 = bestP2;
  let finalT = bestT;

  if (destLat !== undefined && destLng !== undefined) {
    const vDx = bestP2[1] - bestP1[1];
    const vDy = bestP2[0] - bestP1[0];
    const dDx = destLng - bestLng;
    const dDy = destLat - bestLat;

    const dot = vDx * dDx + vDy * dDy;
    if (dot < 0) {
      // সেগমেন্টটি গন্তব্যের বিপরীত দিকে মুখ করে ছিল, তাই রিভার্স করা হলো
      finalP1 = bestP2;
      finalP2 = bestP1;
      finalT = 1 - bestT;
    }
  }

  const fDx = finalP2[1] - finalP1[1];
  const fDy = finalP2[0] - finalP1[0];
  const bearing = ((Math.atan2(fDx, fDy) * 180) / Math.PI + 360) % 360;

  return {
    lat: bestLat,
    lng: bestLng,
    bearing,
    segIdx: bestIdx,
    t: finalT,
    p1: finalP1,
    p2: finalP2
  };
}

// =========================================================================
// ৩. ট্রেনের হুইল সাউন্ড সিন্থেসাইজার (Web Audio API)
// =========================================================================
class TrainAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
  }

  start() {
    if (this.isPlaying) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.isPlaying = true;

      // রিদমিক হুইল-ক্লিক সাউন্ড (ছিক ছিক ছিক...)
      this.intervalId = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') {
          this.ctx?.resume();
        }
        this.playChug();
      }, 380);
    } catch {
      // Audio context may require user interaction
    }
  }

  playChug() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio play catch
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
    }
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
  const aheadStationMarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioSynthRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [is2DMode, setIs2DMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // কাঁচা জিপিএস পজিশন
  const rawLat = activeState?.lat || 24.2346;
  const rawLng = activeState?.lng || 89.9213;
  const speed = Math.round(activeState?.speed || 45); // কিমি/ঘণ্টা (পূর্ণসংখ্যা)

  // বর্তমান ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0] || { name: 'Dhaka' };
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1] || { name: 'Mirzapur' };
  const originStation = scheduleData[0] || { name: 'Dhaka' };
  const destStation = scheduleData[scheduleData.length - 1] || { name: 'Chapainawabganj' };

  // গন্তব্য স্থানাঙ্ক
  const destCoords = nextStation?.coords || [24.2346, 89.9213];

  // ট্র্যাকে নিখুঁত স্ন্যাপ করা প্রাথমিক স্থানাঙ্ক ও হেডিং
  const initialSnap = useMemo(() => {
    return snapToRailTrack(rawLat, rawLng, destCoords[0], destCoords[1], railSegmentsData);
  }, [rawLat, rawLng, destCoords]);

  // রিয়েলটাইম ট্র্যাকিং স্টেট
  const trainStateRef = useRef({
    lat: initialSnap.lat,
    lng: initialSnap.lng,
    bearing: initialSnap.bearing,
    segIdx: initialSnap.segIdx,
    t: initialSnap.t,
    p1: initialSnap.p1,
    p2: initialSnap.p2
  });

  const distanceToNext = useMemo(() => {
    if (activeState?.distToNextKm !== undefined) return Math.round(activeState.distToNextKm);
    if (activeState?.distanceToNext !== undefined) return Math.round(activeState.distanceToNext);
    return 14;
  }, [activeState]);

  const etaMinutes = useMemo(() => {
    const s = Math.max(20, speed);
    return Math.round((distanceToNext / s) * 60) || 15;
  }, [distanceToNext, speed]);

  const progressPercent = useMemo(() => {
    if (activeState?.progressPct !== undefined) return Math.round(activeState.progressPct);
    if (activeState?.progress !== undefined) return Math.round(activeState.progress);
    if (scheduleData.length > 1) {
      return Math.round((currentIdx / (scheduleData.length - 1)) * 100) || 20;
    }
    return 20;
  }, [activeState, currentIdx, scheduleData]);

  // সাউন্ড টগল
  const toggleSound = () => {
    if (isMuted) {
      if (!audioSynthRef.current) {
        audioSynthRef.current = new TrainAudioSynthesizer();
      }
      audioSynthRef.current.start();
      setIsMuted(false);
    } else {
      audioSynthRef.current?.stop();
      setIsMuted(true);
    }
  };

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

  // ফলো টগল বা 'ট্রেনের সাথে চলুন'
  const toggleFollow = () => {
    const nextFollow = !isFollowing;
    setIsFollowing(nextFollow);
    if (nextFollow && mapRef.current) {
      mapRef.current.easeTo({
        center: [trainStateRef.current.lng, trainStateRef.current.lat],
        pitch: is2DMode ? 0 : 58,
        bearing: is2DMode ? 0 : trainStateRef.current.bearing,
        zoom: is2DMode ? 14 : 16,
        duration: 800
      });
    }
  };

  // শুরুর ভিউ (রিসেট ক্যামেরা)
  const resetView = () => {
    setIsFollowing(true);
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: [trainStateRef.current.lng, trainStateRef.current.lat],
        pitch: is2DMode ? 0 : 58,
        bearing: is2DMode ? 0 : trainStateRef.current.bearing,
        zoom: 16,
        duration: 900
      });
    }
  };

  // =========================================================================
  // ৫. ম্যাপ ও বাস্তবসম্মত ৩ডি রেললাইন লেয়ার
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style,
      center: [initialSnap.lng, initialSnap.lat],
      zoom: is2DMode ? 14 : 16,
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
      // ১. সম্পূর্ণ বাংলাদেশের ৬,০১০টি হাই-প্রিসিশন রেললাইন একসাথে রেন্ডার করা
      const allRailGeoJson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: railSegmentsData.map((s) => [
                [s[1], s[0]], // [slng, slat]
                [s[3], s[2]]  // [elng, elat]
              ])
            },
            properties: {}
          }
        ]
      };

      map.addSource('all-bangladesh-railway', {
        type: 'geojson',
        data: allRailGeoJson
      });

      // লেয়ার ০: রেলওয়ে এমব্যাঙ্কমেন্ট বা গ্রিন করিডোর বেস (Railway Embankment Corridor)
      // স্যাটেলাইট ম্যাপে সবুজ ফসলি জমি বা শহরের মাঝে ৩ডি ট্র্যাকে প্রাকৃতিক বাঁধ তৈরি করে
      map.addLayer({
        id: 'rail-embankment',
        type: 'line',
        source: 'all-bangladesh-railway',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#365314',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, 16, 16, 26, 18, 38],
          'line-opacity': 0.85
        }
      });

      // লেয়ার ১: ঘাসের হালকা শোল্ডার বর্ডার (Green Ballast Verge)
      map.addLayer({
        id: 'rail-shoulder',
        type: 'line',
        source: 'all-bangladesh-railway',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#65a30d',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2.5, 14, 13, 16, 22, 18, 32],
          'line-opacity': 0.75
        }
      });

      // লেয়ার ২: উজ্জ্বল লাইট-ধূসর ব্যালাস্ট পাথর বেড (Light Stone Ballast Bed)
      map.addLayer({
        id: 'rail-ballast-bed',
        type: 'line',
        source: 'all-bangladesh-railway',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#e2e8f0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 14, 10, 16, 18, 18, 26],
          'line-opacity': 0.98
        }
      });

      // লেয়ার ৩: স্লিপার টাই (Sleeper Ties with dasharray)
      map.addLayer({
        id: 'rail-sleepers',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#1e293b',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.8, 14, 8, 16, 14, 18, 20],
          'line-dasharray': [0.25, 0.75],
          'line-opacity': 0.95
        }
      });

      // লেয়ার ৪: স্টিলের রূপালী টুইন রেললাইন (Twin Steel Rails)
      map.addLayer({
        id: 'rail-steel-outer',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#0f172a',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 14, 4, 16, 6.5, 18, 9],
          'line-opacity': 0.98
        }
      });

      // লেয়ার ৫: রেলের মধ্যবর্তী খাঁজ (Center gap between rails)
      map.addLayer({
        id: 'rail-steel-inner',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#e2e8f0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 2, 16, 3.5, 18, 5],
          'line-opacity': 0.98
        }
      });

      // ২. স্ক্রিনশটের হুবহু বাস্তবসম্মত ৩ডি ট্রেন (লাল ইঞ্জিন + সবুজ বগি + শেষ বগি পিল)
      const trainEl = document.createElement('div');
      trainEl.className = 'clean-train-3d-model';

      // ৮টি স্ট্যান্ডার্ড আন্তঃনগর বগির নিখুঁত রেন্ডারিং
      const coachesHtml = Array.from({ length: 8 })
        .map(
          (_, cIdx) => `
        <div style="
          width: 13px;
          height: 16px;
          background: #006a4e;
          border-radius: 2px;
          position: relative;
          box-shadow: 2px 3px 6px rgba(0,0,0,0.45);
          overflow: hidden;
          margin-bottom: 2px;
        ">
          <!-- সিলভার-হোয়াইট মেটাল ছাদ -->
          <div style="position: absolute; top: 1px; bottom: 1px; left: 2px; right: 2px; background: #f8fafc; border-radius: 1px;"></div>
          <!-- উজ্জ্বল লাল কোচ বেল্ট -->
          <div style="position: absolute; top: 6px; left: 0; right: 0; height: 3px; background: #dc2626;"></div>
          <!-- যাত্রী জানালা -->
          <div style="position: absolute; top: 3px; left: 0; width: 1px; height: 10px; background: #0f172a;"></div>
          <div style="position: absolute; top: 3px; right: 0; width: 1px; height: 10px; background: #0f172a;"></div>
        </div>
        <div style="width: 4px; height: 2px; background: #0f172a; margin-bottom: 2px;"></div>
      `
        )
        .join('');

      trainEl.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.6));
          position: relative;
        ">
          <!-- লাল লোকোমোটিভ ইঞ্জিন -->
          <div style="
            width: 14px;
            height: 22px;
            background: linear-gradient(180deg, #ef4444 0%, #dc2626 55%, #991b1b 100%);
            border-radius: 5px 5px 2px 2px;
            border: 1px solid #ffffff;
            position: relative;
            box-shadow: 2px 4px 8px rgba(0,0,0,0.55);
            margin-bottom: 2px;
          ">
            <!-- উইন্ডশিল্ড গ্লাস -->
            <div style="position: absolute; top: 3px; left: 2px; right: 2px; height: 4px; background: #38bdf8; border-radius: 1px;"></div>
            <!-- টুইন হেডলাইট -->
            <div style="position: absolute; top: 1px; left: 1.5px; width: 2.5px; height: 2.5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 5px #fef08a;"></div>
            <div style="position: absolute; top: 1px; right: 1.5px; width: 2.5px; height: 2.5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 5px #fef08a;"></div>
          </div>
          <div style="width: 4px; height: 2px; background: #0f172a; margin-bottom: 2px;"></div>

          <!-- ৮টি প্যাসেঞ্জার বগি -->
          ${coachesHtml}

          <!-- শেষ বগি নির্দেশক পিল (হুবহু স্ক্রিনশট ১ এর মতো) -->
          <div style="
            position: absolute;
            bottom: -28px;
            left: -48px;
            background: #ffffff;
            color: #0f172a;
            border-radius: 14px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            pointer-events: none;
          ">
            <span style="color: #be185d;">↑</span>
            <span style="background: #be185d; color: #fff; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; font-size: 9px;">ক</span>
            <span>শেষ বগি</span>
          </div>
        </div>
      `;

      // MapLibre Marker তৈরি ও সেট রোটেশন
      const marker = new maplibregl.Marker({
        element: trainEl,
        rotationAlignment: 'map',
        pitchAlignment: 'map',
        anchor: 'top',
        rotation: initialSnap.bearing
      })
        .setLngLat([initialSnap.lng, initialSnap.lat])
        .addTo(map);

      trainMarkerRef.current = marker;

      // ৩. পরবর্তী স্টেশনের ভাসমান নির্দেশক মার্কার (হুবহু স্ক্রিনশট ১: ↑ ঈশ্বরদী বাইপাস ২৪ কি)
      const aheadEl = document.createElement('div');
      aheadEl.className = 'floating-ahead-marker';
      aheadEl.style.cssText = `
        background: #ffffff;
        color: #0f172a;
        border-radius: 16px;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        white-space: nowrap;
        pointer-events: none;
      `;
      aheadEl.innerHTML = `
        <span style="color: #be185d; font-size: 14px; font-weight: 900;">↑</span>
        <span>${nextStation?.name?.split('(')[0] || 'গন্তব্য'} ${toBangla(distanceToNext)} কি</span>
      `;

      // ট্রেনের ২০০-৩০০ মিটার সামনের সেগমেন্টে ভাসমান মার্কার বসানো
      const aheadLat = initialSnap.p2[0];
      const aheadLng = initialSnap.p2[1];

      const aheadMarker = new maplibregl.Marker({
        element: aheadEl,
        anchor: 'bottom'
      })
        .setLngLat([aheadLng, aheadLat])
        .addTo(map);

      aheadStationMarkerRef.current = aheadMarker;
    });

    return () => {
      if (trainMarkerRef.current) trainMarkerRef.current.remove();
      if (aheadStationMarkerRef.current) aheadStationMarkerRef.current.remove();
      if (audioSynthRef.current) audioSynthRef.current.stop();
      map.remove();
    };
  }, [currentStyle]);

  // =========================================================================
  // ৬. স্মুথ ডেড-রেকনিং অ্যানিমেশন লুপ (রেললাইনের ঠিক ওপর দিয়ে ট্রেন মসৃণভাবে চলবে)
  // "দুই হালনাগাদের মাঝে ট্রেনটি সর্বশেষ জানা গতিতে সোজা এগোবে"
  // =========================================================================
  useEffect(() => {
    let lastTime = performance.now();

    const animateTrainAlongTrack = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const st = trainStateRef.current;
      const segs = railSegmentsData;

      if (segs && st.p1 && st.p2) {
        const [slat, slng] = st.p1;
        const [elat, elng] = st.p2;
        const segDistMeters = Math.hypot(elat - slat, elng - slng) * 111000;

        if (segDistMeters > 0) {
          const metersPerSec = Math.max(8, (speed * 1000) / 3600);
          const dtMeters = metersPerSec * dt;
          st.t += dtMeters / segDistMeters;

          // সেগমেন্ট শেষ হলে সংযুক্ত পরবর্তী সেগমেন্টে ট্রানজিশন
          if (st.t >= 1) {
            st.t = 0;
            const curDx = elng - slng;
            const curDy = elat - slat;

            let nextP1 = [elat, elng];
            let nextP2 = [elat + curDy * 0.1, elng + curDx * 0.1];
            let bestDot = -Infinity;
            let nextIdx = st.segIdx;

            // সংযুক্ত সেগমেন্ট খোঁজা (যেটি একই লাইনে সামনের দিকে এগিয়ে যায়)
            for (let k = 0; k < segs.length; k++) {
              const cand = segs[k];
              const dStart = Math.hypot(cand[0] - elat, cand[1] - elng);
              const dEnd = Math.hypot(cand[2] - elat, cand[3] - elng);

              if (dStart < 0.001) {
                // স্টার্ট পয়েন্ট সংযুক্ত
                const cdx = cand[3] - cand[1];
                const cdy = cand[2] - cand[0];
                const dot = curDx * cdx + curDy * cdy;
                if (dot > bestDot) {
                  bestDot = dot;
                  nextIdx = k;
                  nextP1 = [cand[0], cand[1]];
                  nextP2 = [cand[2], cand[3]];
                }
              } else if (dEnd < 0.001) {
                // এন্ড পয়েন্ট সংযুক্ত (রিভার্স ওরিয়েন্টেশন)
                const cdx = cand[1] - cand[3];
                const cdy = cand[0] - cand[2];
                const dot = curDx * cdx + curDy * cdy;
                if (dot > bestDot) {
                  bestDot = dot;
                  nextIdx = k;
                  nextP1 = [cand[2], cand[3]];
                  nextP2 = [cand[0], cand[1]];
                }
              }
            }

            st.segIdx = nextIdx;
            st.p1 = nextP1;
            st.p2 = nextP2;
          }

          // বর্তমান পজিশন গণনা (রেললাইনের ঠিক ওপরে)
          st.lat = st.p1[0] + st.t * (st.p2[0] - st.p1[0]);
          st.lng = st.p1[1] + st.t * (st.p2[1] - st.p1[1]);

          const dx = st.p2[1] - st.p1[1];
          const dy = st.p2[0] - st.p1[0];
          st.bearing = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
        }

        // MapLibre মার্কার আপডেট (setLngLat & setRotation)
        if (trainMarkerRef.current) {
          trainMarkerRef.current.setLngLat([st.lng, st.lat]);
          trainMarkerRef.current.setRotation(st.bearing);
        }

        // ক্যামেরা ফলোইং
        if (isFollowing && mapRef.current) {
          mapRef.current.easeTo({
            center: [st.lng, st.lat],
            bearing: is2DMode ? 0 : st.bearing,
            duration: 0
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animateTrainAlongTrack);
    };

    animFrameRef.current = requestAnimationFrame(animateTrainAlongTrack);

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
          ১. টপ-লেফট ক্যাপসুল (হুবহু ইমেজ ১: দ্রুতযান এক্সপ্রেস ৭৪৫ পঞ্চগড় - ঢাকা)
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
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ffffff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
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
            padding: '6px 16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.22)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              {train?.name?.split('(')[0]?.trim() || 'দ্রুতযান এক্সপ্রেস'}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '12px',
                background: '#fce7f3',
                color: '#be185d'
              }}
            >
              {toBangla(train?.id || train?.number || '৭৪৫')}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            {originStation?.name?.split('(')[0]} - {destStation?.name?.split('(')[0]}
          </div>
        </div>
      </div>

      {/* =====================================================================
          ২. রাইট-সাইড ফ্লোটিং কন্ট্রোলস (হুবহু ইমেজ ১: শব্দ বন্ধ, শুরুর ভিউ, মানচিত্র, 2D)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          top: '140px',
          right: '16px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        {/* সাউন্ড টগল বাটন */}
        <button
          onClick={toggleSound}
          style={{
            width: '46px',
            height: '46px',
            background: '#ffffff',
            color: isMuted ? '#64748b' : '#be185d',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title={isMuted ? 'শব্দ চালু' : 'শব্দ বন্ধ'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>
            {isMuted ? 'শব্দ বন্ধ' : 'শব্দ চালু'}
          </span>
        </button>

        {/* শুরুর ভিউ (রিসেট ক্যামেরা) বাটন */}
        <button
          onClick={resetView}
          style={{
            width: '46px',
            height: '46px',
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="শুরুর ভিউ"
        >
          <RotateCcw size={18} />
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>শুরুর ভিউ</span>
        </button>

        {/* মানচিত্র / স্যাটেলাইট সুইচ বাটন */}
        <button
          onClick={() => setCurrentStyle(currentStyle === 'satellite' ? 'streets' : 'satellite')}
          style={{
            width: '46px',
            height: '46px',
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="মানচিত্র"
        >
          <Layers size={18} />
          <span style={{ fontSize: '9px', fontWeight: '800', marginTop: '2px' }}>
            {MAP_STYLES[currentStyle].name}
          </span>
        </button>

        {/* ২ডি / ৩ডি বাটন */}
        <button
          onClick={toggle2DMode}
          style={{
            width: '46px',
            height: '46px',
            background: '#ffffff',
            color: '#0f172a',
            border: 'none',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '900',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          title="2D / 3D মোড"
        >
          {is2DMode ? '3D' : '2D'}
        </button>
      </div>

      {/* =====================================================================
          ৩. সেন্টার ফ্লোটিং বাটন: '⊕ ট্রেনের সাথে চলুন' (হুবহু ইমেজ ১ এর মতো)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '235px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={toggleFollow}
          style={{
            background: '#be185d',
            color: '#ffffff',
            border: 'none',
            borderRadius: '28px',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(190, 24, 93, 0.45)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            opacity: isFollowing ? 0.92 : 1
          }}
        >
          <Crosshair size={18} strokeWidth={2.5} />
          <span>{isFollowing ? 'ট্রেন অনুসরণ চলছে' : 'ট্রেনের সাথে চলুন'}</span>
        </button>
      </div>

      {/* =====================================================================
          ৪. মূল ৩ডি ম্যাপ কন্টেইনার
      ===================================================================== */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* =====================================================================
          ৫. নিচের কার্ড (হুবহু স্ক্রিনশট ১: পরবর্তী স্টেশন, বিলম্ব, গতি, প্রোগ্রেস ও বাটন)
      ===================================================================== */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '12px',
          right: '12px',
          maxWidth: '540px',
          margin: '0 auto',
          background: '#ffffff',
          borderRadius: '24px',
          padding: '16px 18px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.28)',
          zIndex: 100,
          color: '#0f172a'
        }}
      >
        {/* টপ রো: পরবর্তী স্টেশন ও স্পিড ব্যাজ */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              পরবর্তী{' '}
              <span style={{ fontWeight: '900', color: '#0f172a' }}>
                {nextStation?.name?.split('(')[0] || 'ঈশ্বরদী বাইপাস'}
              </span>{' '}
              <span style={{ color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
                ({toBangla(distanceToNext)} কি)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              <span
                style={{
                  color: activeState?.delayMinutes > 5 ? '#dc2626' : '#15803d'
                }}
              >
                {activeState?.delayMinutes > 5
                  ? `${toBangla(activeState.delayMinutes)} মিনিট বিলম্বে`
                  : 'সঠিক সময়ে (অন টাইম)'}
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#16a34a',
                    display: 'inline-block'
                  }}
                ></span>
                লাইভ
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: '#64748b' }}>১ মি আগে</span>
            </div>
          </div>

          {/* স্পিড ব্যাজ (হুবহু স্ক্রিনশট ১ এর মতো রাউন্ডেড বক্স) */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '6px 14px',
              textAlign: 'center',
              minWidth: '58px'
            }}
          >
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: 1.1 }}>
              {toBangla(speed)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748b', marginTop: '1px' }}>
              কি/ঘ
            </div>
          </div>
        </div>

        {/* প্রোগ্রেস স্লাইডার বার (স্টেশন টাইমলাইন) */}
        <div style={{ margin: '14px 0 16px 0', position: 'relative' }}>
          <div
            style={{
              height: '4px',
              background: '#e2e8f0',
              borderRadius: '2px',
              position: 'relative'
            }}
          >
            {/* কমপ্লিটেড পিঙ্ক লাইন */}
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: '#be185d',
                borderRadius: '2px'
              }}
            ></div>

            {/* ট্রেনের আইকন (চলমান পিঙ্ক সার্কেল) */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#be185d',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(190, 24, 93, 0.5)',
                fontSize: '12px'
              }}
            >
              🚆
            </div>
          </div>

          {/* স্টেশন নামসমূহ */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: '700',
              marginTop: '10px'
            }}
          >
            <span>{prevStation?.name?.split('(')[0] || 'পূর্ববর্তী'}</span>
            <span style={{ color: '#be185d', fontWeight: '800' }}>
              {nextStation?.name?.split('(')[0]} {toBangla(distanceToNext)} কি
            </span>
            <span style={{ color: '#be185d' }}>{destStation?.name?.split('(')[0] || 'গন্তব্য'}</span>
          </div>
        </div>

        {/* বটম অ্যাকশন বাটনসমূহ (বিস্তারিত ও চ্যাট) */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: '800',
              color: '#be185d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} />
            <span>বিস্তারিত</span>
          </button>

          <button
            onClick={() => alert('লাইভ চ্যাট শীঘ্রই চালু হচ্ছে!')}
            style={{
              flex: 1,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: '800',
              color: '#be185d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} />
            <span>চ্যাট</span>
          </button>
        </div>

        {/* ফুটার অ্যাট্রিবিউশন */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '9px',
            color: '#94a3b8',
            marginTop: '8px'
          }}
        >
          রেললাইন © OpenStreetMap • Powered by Esri Imagery
        </div>
      </div>
    </div>
  );
}
