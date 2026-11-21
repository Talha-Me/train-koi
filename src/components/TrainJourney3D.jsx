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

// মিটার দূরত্ব গণনা
function getDistanceMeters(p1, p2) {
  // p: [lng, lat]
  const R = 6371000;
  const dLat = ((p2[1] - p1[1]) * Math.PI) / 180;
  const dLng = ((p2[0] - p1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[1] * Math.PI) / 180) *
      Math.cos((p2[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// =========================================================================
// ২. সংযুক্ত রেললাইন পাথ ট্রেসার (Continuous Track Polyline Tracer)
// কোনো অবস্থাতেই ট্রেন লাইন থেকে বের হবে না এবং সব বাঁক নিখুঁতভাবে ফলো করবে
// =========================================================================
function buildContinuousTrackPath(startLat, startLng, destLat, destLng, segments) {
  if (!segments || !segments.length) {
    return [[startLng, startLat], [destLng || startLng + 0.01, destLat || startLat + 0.01]];
  }

  // ১. নিকটবর্তী সেগমেন্ট অনুসন্ধান
  let minDistanceSq = Infinity;
  let bestIdx = 0;
  let bestT = 0;

  for (let i = 0; i < segments.length; i++) {
    const [slat, slng, elat, elng] = segments[i];
    if (Math.abs(startLat - slat) > 0.1 && Math.abs(startLat - elat) > 0.1) continue;
    if (Math.abs(startLng - slng) > 0.1 && Math.abs(startLng - elng) > 0.1) continue;

    const dx = elng - slng;
    const dy = elat - slat;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) continue;

    const t = Math.max(0, Math.min(1, ((startLng - slng) * dx + (startLat - slat) * dy) / lenSq));
    const projLng = slng + t * dx;
    const projLat = slat + t * dy;
    const distSq = (startLng - projLng) ** 2 + (startLat - projLat) ** 2;

    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      bestIdx = i;
      bestT = t;
    }
  }

  // ২. গন্তব্য স্টেশন অনুযায়ী সেগমেন্টের ডিরেকশন ওরিয়েন্টেড করা
  const firstSeg = segments[bestIdx];
  const pA = [firstSeg[1], firstSeg[0]]; // [lng, lat]
  const pB = [firstSeg[3], firstSeg[2]]; // [lng, lat]

  const vDx = pB[0] - pA[0];
  const vDy = pB[1] - pA[1];
  const dDx = (destLng || pB[0]) - pA[0];
  const dDy = (destLat || pB[1]) - pA[1];

  let forwardSeg;
  let initPoint;
  if (vDx * dDx + vDy * dDy >= 0) {
    forwardSeg = { p1: pA, p2: pB, idx: bestIdx };
    initPoint = [pA[0] + bestT * (pB[0] - pA[0]), pA[1] + bestT * (pB[1] - pA[1])];
  } else {
    forwardSeg = { p1: pB, p2: pA, idx: bestIdx };
    initPoint = [pB[0] + (1 - bestT) * (pA[0] - pB[0]), pB[1] + (1 - bestT) * (pA[1] - pB[1])];
  }

  // ৩. সামনের দিকে সংযুক্ত ২০০টি সেগমেন্ট ট্রেস করা (বাঁক অনুযায়ী)
  const polyline = [forwardSeg.p1, forwardSeg.p2];
  const used = new Set([bestIdx]);
  let currEnd = forwardSeg.p2;
  let currVec = [forwardSeg.p2[0] - forwardSeg.p1[0], forwardSeg.p2[1] - forwardSeg.p1[1]];

  for (let step = 0; step < 200; step++) {
    let bestCand = null;
    let bestDot = -Infinity;

    for (let i = 0; i < segments.length; i++) {
      if (used.has(i)) continue;
      const s = segments[i];

      const d1 = Math.hypot(s[1] - currEnd[0], s[0] - currEnd[1]);
      const d2 = Math.hypot(s[3] - currEnd[0], s[2] - currEnd[1]);

      if (d1 < 0.003) {
        const cdx = s[3] - s[1];
        const cdy = s[2] - s[0];
        const dot = currVec[0] * cdx + currVec[1] * cdy;
        if (dot > bestDot) {
          bestDot = dot;
          bestCand = { p1: [s[1], s[0]], p2: [s[3], s[2]], idx: i, vec: [cdx, cdy] };
        }
      } else if (d2 < 0.003) {
        const cdx = s[1] - s[3];
        const cdy = s[0] - s[2];
        const dot = currVec[0] * cdx + currVec[1] * cdy;
        if (dot > bestDot) {
          bestDot = dot;
          bestCand = { p1: [s[3], s[2]], p2: [s[1], s[0]], idx: i, vec: [cdx, cdy] };
        }
      }
    }

    if (bestCand && bestDot > -0.5) {
      used.add(bestCand.idx);
      polyline.push(bestCand.p2);
      currEnd = bestCand.p2;
      currVec = bestCand.vec;
    } else {
      break;
    }
  }

  // ৪. পেছনের দিকে সংযুক্ত ৩০টি সেগমেন্ট ট্রেস করা (যাতে পেছনের বগি ট্র্যাকে থাকে)
  const backwardUsed = new Set([bestIdx]);
  let currStart = forwardSeg.p1;
  let currBackVec = [forwardSeg.p1[0] - forwardSeg.p2[0], forwardSeg.p1[1] - forwardSeg.p2[1]];

  for (let step = 0; step < 30; step++) {
    let bestCand = null;
    let bestDot = -Infinity;

    for (let i = 0; i < segments.length; i++) {
      if (used.has(i) || backwardUsed.has(i)) continue;
      const s = segments[i];

      const d1 = Math.hypot(s[1] - currStart[0], s[0] - currStart[1]);
      const d2 = Math.hypot(s[3] - currStart[0], s[2] - currStart[1]);

      if (d1 < 0.003) {
        const cdx = s[3] - s[1];
        const cdy = s[2] - s[0];
        const dot = currBackVec[0] * cdx + currBackVec[1] * cdy;
        if (dot > bestDot) {
          bestDot = dot;
          bestCand = { pNext: [s[3], s[2]], idx: i, vec: [cdx, cdy] };
        }
      } else if (d2 < 0.003) {
        const cdx = s[1] - s[3];
        const cdy = s[0] - s[2];
        const dot = currBackVec[0] * cdx + currBackVec[1] * cdy;
        if (dot > bestDot) {
          bestDot = dot;
          bestCand = { pNext: [s[1], s[0]], idx: i, vec: [cdx, cdy] };
        }
      }
    }

    if (bestCand && bestDot > -0.5) {
      backwardUsed.add(bestCand.idx);
      polyline.unshift(bestCand.pNext);
      currStart = bestCand.pNext;
      currBackVec = bestCand.vec;
    } else {
      break;
    }
  }

  return { polyline, initPoint };
}

// পলিলিনের নির্দিষ্ট দূরত্বের সাব-স্লাইস তৈরি (ট্রেন বডি বাঁকানোর জন্য)
function sliceTrackPolyline(points, cumDists, headDist, trainLength) {
  const totalDist = cumDists[cumDists.length - 1];
  const clampedHead = Math.max(0, Math.min(totalDist, headDist));
  const clampedTail = Math.max(0, clampedHead - trainLength);

  function getPointAt(d) {
    if (d <= 0) return points[0];
    if (d >= totalDist) return points[points.length - 1];

    for (let i = 1; i < cumDists.length; i++) {
      if (cumDists[i] >= d) {
        const segLen = cumDists[i] - cumDists[i - 1];
        const fraction = segLen > 0 ? (d - cumDists[i - 1]) / segLen : 0;
        const pA = points[i - 1];
        const pB = points[i];
        return [
          pA[0] + fraction * (pB[0] - pA[0]),
          pA[1] + fraction * (pB[1] - pA[1])
        ];
      }
    }
    return points[points.length - 1];
  }

  const result = [getPointAt(clampedTail)];

  for (let i = 0; i < points.length; i++) {
    if (cumDists[i] > clampedTail && cumDists[i] < clampedHead) {
      result.push(points[i]);
    }
  }

  result.push(getPointAt(clampedHead));
  return {
    slice: result,
    head: getPointAt(clampedHead),
    tail: getPointAt(clampedTail),
    getPointAt
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

      this.intervalId = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') {
          this.ctx?.resume();
        }
        this.playChug();
      }, 380);
    } catch {
      // Audio autoplay catch
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
      // catch
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
  const aheadStationMarkerRef = useRef(null);
  const tailCoachMarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioSynthRef = useRef(null);

  const [currentStyle, setCurrentStyle] = useState('satellite');
  const [is2DMode, setIs2DMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // কাঁচা জিপিএস পজিশন
  const rawLat = activeState?.lat || 24.5826;
  const rawLng = activeState?.lng || 90.3947;
  const speed = Math.round(activeState?.speed || 48); // কিমি/ঘণ্টা

  // বর্তমান ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0] || { name: 'ঢাকা' };
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1] || { name: 'ময়মনসিংহ' };
  const originStation = scheduleData[0] || { name: 'ঢাকা কমলাপুর' };
  const destStation = scheduleData[scheduleData.length - 1] || { name: 'দেওয়ানগঞ্জ বাজার' };

  // গন্তব্য স্থানাঙ্ক
  const destCoords = nextStation?.coords || [24.75, 90.40];

  // ট্রেনের সংযুক্ত রুট পলিলিন বিল্ড করা
  const routeData = useMemo(() => {
    return buildContinuousTrackPath(rawLat, rawLng, destCoords[0], destCoords[1], railSegmentsData);
  }, [rawLat, rawLng, destCoords]);

  // পলিলিনের কিউমুলেটিভ ডিসটেন্স তৈরি
  const cumDists = useMemo(() => {
    const pts = routeData.polyline;
    const d = [0];
    for (let i = 1; i < pts.length; i++) {
      d.push(d[i - 1] + getDistanceMeters(pts[i - 1], pts[i]));
    }
    return d;
  }, [routeData]);

  // প্রারম্ভিক ট্রেন অবস্থান (পলিলিনে)
  const initialDist = useMemo(() => {
    const pts = routeData.polyline;
    const pInit = routeData.initPoint;
    let minD = Infinity;
    let bestIdx = 0;

    for (let i = 0; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pInit[0], pts[i][1] - pInit[1]);
      if (d < minD) {
        minD = d;
        bestIdx = i;
      }
    }
    return Math.max(180, cumDists[bestIdx] || 180);
  }, [routeData, cumDists]);

  // রিয়েলটাইম ডিস্ট্যান্স স্টেট (Dead-reckoning)
  const trainDistRef = useRef(initialDist);

  const distanceToNext = useMemo(() => {
    if (activeState?.distToNextKm !== undefined) return Math.round(activeState.distToNextKm);
    if (activeState?.distanceToNext !== undefined) return Math.round(activeState.distanceToNext);
    return 19;
  }, [activeState]);

  const etaMinutes = useMemo(() => {
    const s = Math.max(20, speed);
    return Math.round((distanceToNext / s) * 60) || 24;
  }, [distanceToNext, speed]);

  const progressPercent = useMemo(() => {
    if (activeState?.progressPct !== undefined) return Math.round(activeState.progressPct);
    if (activeState?.progress !== undefined) return Math.round(activeState.progress);
    if (scheduleData.length > 1) {
      return Math.round((currentIdx / (scheduleData.length - 1)) * 100) || 49;
    }
    return 49;
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
      duration: 800
    });
  };

  // ফলো টগল বা 'ট্রেনের সাথে চলুন'
  const toggleFollow = () => {
    const nextFollow = !isFollowing;
    setIsFollowing(nextFollow);
    if (nextFollow && mapRef.current) {
      const pts = routeData.polyline;
      const { head, getPointAt } = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 160);
      const aheadPt = getPointAt(trainDistRef.current + 30);
      const dx = aheadPt[0] - head[0];
      const dy = aheadPt[1] - head[1];
      const bearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

      mapRef.current.easeTo({
        center: head,
        pitch: is2DMode ? 0 : 58,
        bearing: is2DMode ? 0 : bearing,
        zoom: is2DMode ? 14 : 16.5,
        duration: 800
      });
    }
  };

  // শুরুর ভিউ (রিসেট ক্যামেরা)
  const resetView = () => {
    setIsFollowing(true);
    if (mapRef.current) {
      const pts = routeData.polyline;
      const { head, getPointAt } = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 160);
      const aheadPt = getPointAt(trainDistRef.current + 30);
      const dx = aheadPt[0] - head[0];
      const dy = aheadPt[1] - head[1];
      const bearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

      mapRef.current.easeTo({
        center: head,
        pitch: is2DMode ? 0 : 58,
        bearing: is2DMode ? 0 : bearing,
        zoom: 16.5,
        duration: 900
      });
    }
  };

  // =========================================================================
  // ৫. ম্যাপ ও বাস্তবসম্মত ৩ডি রেললাইন এবং ৩ডি বাঁকা ট্রেন লেয়ারসমূহ
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const pts = routeData.polyline;
    const initialSlice = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 160);
    const initialLoco = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 24);

    const aheadPt = initialSlice.getPointAt(trainDistRef.current + 30);
    const dx = aheadPt[0] - initialSlice.head[0];
    const dy = aheadPt[1] - initialSlice.head[1];
    const initialBearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style,
      center: initialSlice.head,
      zoom: is2DMode ? 14 : 16.5,
      pitch: is2DMode ? 0 : 58,
      bearing: is2DMode ? 0 : initialBearing,
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

      // =====================================================================
      // ৩ডি কার্ভড ট্রেন লেয়ারসমূহ (রেললাইনের বাঁক অনুযায়ী নিখুঁতভাবে বাঁক নেয়)
      // =====================================================================
      // ১. ট্রেনের সম্পূর্ণ বডি সোর্স (পেছনের ১৬০ মিটার)
      map.addSource('train-body-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: initialSlice.slice }
        }
      });

      // ২. ট্রেনের লাল লোকোমোটিভ সোর্স (সামনের ২৪ মিটার)
      map.addSource('train-loco-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: initialLoco.slice }
        }
      });

      // ৩. ট্রেনের হেডলাইট সোর্স (ইঞ্জিনের সম্মুখভাগ)
      map.addSource('train-headlight-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: initialSlice.head }
        }
      });

      // লেয়ার ৬: ট্রেনের শ্যাডো (Soft Drop Shadow beneath coaches)
      map.addLayer({
        id: 'train-shadow',
        type: 'line',
        source: 'train-body-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': 'rgba(0, 0, 0, 0.45)',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 4, 15, 10, 16.5, 14, 18, 18],
          'line-offset': 2
        }
      });

      // লেয়ার ৭: বাংলাদেশ রেলওয়ে সবুজ কোচ বডি (BR Green Coaches)
      map.addLayer({
        id: 'train-body-green',
        type: 'line',
        source: 'train-body-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#006a4e',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3.5, 15, 8.5, 16.5, 12, 18, 16]
        }
      });

      // লেয়ার ৮: কোচের রূপালী/সাদা মেটাল ছাদ (Silver-White Roof)
      map.addLayer({
        id: 'train-roof-white',
        type: 'line',
        source: 'train-body-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f8fafc',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 2.2, 15, 5.2, 16.5, 7.5, 18, 10]
        }
      });

      // লেয়ার ৯: কোচের লাল ব্যান্ড স্ট্রাইপ (Red Coach Stripe)
      map.addLayer({
        id: 'train-stripe-red',
        type: 'line',
        source: 'train-body-src',
        paint: {
          'line-color': '#dc2626',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.8, 15, 1.8, 16.5, 2.5, 18, 3.5]
        }
      });

      // লেয়ার ১০: লাল লোকোমোটিভ ইঞ্জিন (Vibrant Red Locomotive Head)
      map.addLayer({
        id: 'train-loco-red',
        type: 'line',
        source: 'train-loco-src',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ef4444',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 4, 15, 9.5, 16.5, 13, 18, 17]
        }
      });

      // লেয়ার ১১: লোকোমোটিভ উইন্ডশিল্ড (Sky-blue Windshield)
      map.addLayer({
        id: 'train-loco-windshield',
        type: 'line',
        source: 'train-loco-src',
        paint: {
          'line-color': '#38bdf8',
          'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 15, 3.5, 16.5, 5, 18, 7]
        }
      });

      // লেয়ার ১২: উজ্জ্বল হেডলাইট গ্লো (Glowing Yellow Headlight)
      map.addLayer({
        id: 'train-headlight-glow',
        type: 'circle',
        source: 'train-headlight-src',
        paint: {
          'circle-color': '#fef08a',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 2.5, 15, 5, 16.5, 7, 18, 9],
          'circle-blur': 0.35,
          'circle-opacity': 0.95
        }
      });

      // =====================================================================
      // ভাসমান নির্দেশক মার্কারসমূহ (পরবর্তী স্টেশন ও শেষ বগি)
      // =====================================================================
      // ট্রেনের সামনের স্টেশন মার্কার: ↑ ময়মনসিংহ ১৯ কি
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

      const aheadPtPos = initialSlice.getPointAt(trainDistRef.current + 250);
      const aheadMarker = new maplibregl.Marker({
        element: aheadEl,
        anchor: 'bottom'
      })
        .setLngLat(aheadPtPos)
        .addTo(map);

      aheadStationMarkerRef.current = aheadMarker;

      // ট্রেনের পেছনের শেষ বগি মার্কার: ↑ ক শেষ বগি
      const tailEl = document.createElement('div');
      tailEl.className = 'floating-tail-marker';
      tailEl.style.cssText = `
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
      `;
      tailEl.innerHTML = `
        <span style="color: #be185d;">↑</span>
        <span style="background: #be185d; color: #fff; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; font-size: 9px;">ক</span>
        <span>শেষ বগি</span>
      `;

      const tailMarker = new maplibregl.Marker({
        element: tailEl,
        anchor: 'top'
      })
        .setLngLat(initialSlice.tail)
        .addTo(map);

      tailCoachMarkerRef.current = tailMarker;
    });

    return () => {
      if (aheadStationMarkerRef.current) aheadStationMarkerRef.current.remove();
      if (tailCoachMarkerRef.current) tailCoachMarkerRef.current.remove();
      if (audioSynthRef.current) audioSynthRef.current.stop();
      map.remove();
    };
  }, [currentStyle, routeData]);

  // =========================================================================
  // ৬. রিয়েলটাইম ডেড-রেকনিং অ্যানিমেশন লুপ (লাইন ধরে ট্রেন বাঁক নিয়ে চলে)
  // "দুই হালনাগাদের মাঝে ট্রেনটি সর্বশেষ জানা গতিতে সোজা এগোবে"
  // =========================================================================
  useEffect(() => {
    let lastTime = performance.now();
    const pts = routeData.polyline;
    const totalDist = cumDists[cumDists.length - 1];

    const animateTrainAlongCurve = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const metersPerSec = Math.max(8, (speed * 1000) / 3600);
      trainDistRef.current += metersPerSec * dt;

      // পলিলিনের শেষ প্রান্তে পৌঁছালে লুপ
      if (trainDistRef.current >= totalDist - 50) {
        trainDistRef.current = 180;
      }

      if (mapRef.current && mapRef.current.getSource('train-body-src')) {
        const trainSlice = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 160);
        const locoSlice = sliceTrackPolyline(pts, cumDists, trainDistRef.current, 24);

        // ১. ট্রেনের সম্পূর্ণ বডি আপডেট (বাঁক অনুযায়ী রেন্ডার হয়)
        mapRef.current.getSource('train-body-src').setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: trainSlice.slice }
        });

        // ২. ট্রেনের লাল ইঞ্জিন আপডেট
        mapRef.current.getSource('train-loco-src').setData({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: locoSlice.slice }
        });

        // ৩. হেডলাইট আপডেট
        mapRef.current.getSource('train-headlight-src').setData({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: trainSlice.head }
        });

        // ৪. শেষ বগি মার্কার পজিশন আপডেট
        if (tailCoachMarkerRef.current) {
          tailCoachMarkerRef.current.setLngLat(trainSlice.tail);
        }

        // ৫. ক্যামেরা ট্রেনের পেছনের এঙ্গেল বজায় রেখে ফলো করে
        if (isFollowing) {
          const aheadPt = trainSlice.getPointAt(trainDistRef.current + 35);
          const dx = aheadPt[0] - trainSlice.head[0];
          const dy = aheadPt[1] - trainSlice.head[1];
          const bearing = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

          mapRef.current.easeTo({
            center: trainSlice.head,
            bearing: is2DMode ? 0 : bearing,
            duration: 0
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(animateTrainAlongCurve);
    };

    animFrameRef.current = requestAnimationFrame(animateTrainAlongCurve);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [speed, isFollowing, is2DMode, routeData, cumDists]);

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
          ১. টপ-লেফট ক্যাপসুল (হুবহু স্ক্রিনশট ১: তিস্তা এক্সপ্রেস ৭০৭ পঞ্চগড় - ঢাকা)
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
              {train?.name?.split('(')[0]?.trim() || 'তিস্তা এক্সপ্রেস'}
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
              {toBangla(train?.id || train?.number || '৭০৭')}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
            {originStation?.name?.split('(')[0]} - {destStation?.name?.split('(')[0]}
          </div>
        </div>
      </div>

      {/* =====================================================================
          ২. রাইট-সাইড ফ্লোটিং কন্ট্রোলস (শব্দ বন্ধ, শুরুর ভিউ, মানচিত্র, 2D)
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
          ৩. সেন্টার ফ্লোটিং বাটন: '⊕ ট্রেনের সাথে চলুন'
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
          ৫. নিচের কার্ড (পরবর্তী স্টেশন, বিলম্ব, গতি, প্রোগ্রেস ও বাটন)
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
                {nextStation?.name?.split('(')[0] || 'ময়মনসিংহ'}
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
                  color: activeState?.delay > 5 ? '#dc2626' : '#15803d'
                }}
              >
                {activeState?.delay > 5
                  ? `${toBangla(activeState.delay)} মিনিট বিলম্বে`
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

          {/* স্পিড ব্যাজ */}
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
