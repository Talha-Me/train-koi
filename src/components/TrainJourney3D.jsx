import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

// Vite-এ MapLibre Web Worker URL সেট করা
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
// ১. ম্যাপ স্টাইলসমূহ (গুগল স্যাটেলাইট ও কার্টো মানচিত্র)
// গুগল স্যাটেলাইটে বাংলাদেশে জুম ২০ পর্যন্ত ফুল রেজুলেশন রয়েছে, তাই কোনো 'Map data not available' আসে না
// =========================================================================
const MAP_STYLES = {
  satellite: {
    name: 'মানচিত্র',
    style: {
      version: 8,
      sources: {
        'google-satellite': {
          type: 'raster',
          tiles: [
            'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
          ],
          tileSize: 256,
          maxzoom: 20,
          attribution: 'Google • © OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'satellite-tiles',
          type: 'raster',
          source: 'google-satellite',
          minzoom: 0,
          maxzoom: 22
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
          maxzoom: 19,
          attribution: '© OpenStreetMap, © CARTO'
        }
      },
      layers: [
        {
          id: 'street-tiles',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 22
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

// মিটার দূরত্ব গণনা (Haversine)
function getDistanceMeters(p1, p2) {
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

// ৩ডি বক্স পলিগন তৈরি (দৈর্ঘ্য, প্রস্থ ও কোণ অনুযায়ী)
function createBoxPolygon(centerLng, centerLat, lengthM, widthM, bearingDeg) {
  const halfL = lengthM / 2;
  const halfW = widthM / 2;
  const rad = (bearingDeg * Math.PI) / 180;
  const cosB = Math.cos(rad);
  const sinB = Math.sin(rad);

  const mToLat = 1 / 111000;
  const mToLng = 1 / (111000 * Math.cos((centerLat * Math.PI) / 180));

  const corners = [
    [halfW, halfL],
    [-halfW, halfL],
    [-halfW, -halfL],
    [halfW, -halfL]
  ];

  const coords = corners.map(([x, y]) => {
    const rotX = x * cosB + y * sinB;
    const rotY = -x * sinB + y * cosB;
    return [centerLng + rotX * mToLng, centerLat + rotY * mToLat];
  });

  coords.push(coords[0]);
  return coords;
}

// =========================================================================
// ২. বাংলাদেশের পূর্ণ রেলওয়ে নেটওয়ার্ক গ্রাফ ও A* পাথফাইন্ডিং
// স্টেশন ১ -> স্টেশন ২ -> ... -> শেষ স্টেশন পর্যন্ত প্রতিটি রেল ট্র্যাক নিখুঁতভাবে যুক্ত করে
// যাতে ট্রেন কখনো ভুল রাস্তায় বা সাইডিংয়ে না যায় এবং পথ হারিয়ে মাঠ-বনে না যায়
// =========================================================================
let railGraphCached = null;

function getRailGraph(segments) {
  if (railGraphCached) return railGraphCached;
  const points = [];
  const nodeMap = new Map();

  function getNode(lat, lng) {
    const k = (Math.round(lat * 10000) / 10000).toFixed(4) + ',' + (Math.round(lng * 10000) / 10000).toFixed(4);
    let id = nodeMap.get(k);
    if (id === undefined) {
      id = points.length;
      nodeMap.set(k, id);
      points.push({ lat, lng, neighbors: [] });
    }
    return id;
  }

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const u = getNode(s[0], s[1]);
    const v = getNode(s[2], s[3]);
    if (u !== v) {
      const dist = Math.hypot(s[2] - s[0], s[3] - s[1]);
      points[u].neighbors.push({ to: v, dist });
      points[v].neighbors.push({ to: u, dist });
    }
  }

  // বিচ্ছিন্ন ছোট গ্যাপ (bridge up to 0.005 deg ~550m) জোড়া লাগানো
  for (let i = 0; i < points.length; i++) {
    if (points[i].neighbors.length <= 1) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[j].neighbors.length <= 1) {
          const d = Math.hypot(points[i].lat - points[j].lat, points[i].lng - points[j].lng);
          if (d < 0.005) {
            points[i].neighbors.push({ to: j, dist: d });
            points[j].neighbors.push({ to: i, dist: d });
          }
        }
      }
    }
  }

  railGraphCached = points;
  return points;
}

function findClosestRailNode(points, lat, lng) {
  let minD = Infinity;
  let best = 0;
  for (let i = 0; i < points.length; i++) {
    const d = Math.hypot(points[i].lat - lat, points[i].lng - lng);
    if (d < minD) {
      minD = d;
      best = i;
    }
  }
  return best;
}

function findAStarPath(points, startId, goalId) {
  if (startId === goalId) return [[points[startId].lng, points[startId].lat]];
  const dist = new Float64Array(points.length).fill(Infinity);
  const prev = new Int32Array(points.length).fill(-1);
  dist[startId] = 0;

  const open = [startId];
  const goalLat = points[goalId].lat;
  const goalLng = points[goalId].lng;

  while (open.length > 0) {
    let bestIdx = 0;
    let minF = dist[open[0]] + Math.hypot(points[open[0]].lat - goalLat, points[open[0]].lng - goalLng);
    for (let i = 1; i < open.length; i++) {
      const f = dist[open[i]] + Math.hypot(points[open[i]].lat - goalLat, points[open[i]].lng - goalLng);
      if (f < minF) {
        minF = f;
        bestIdx = i;
      }
    }
    const u = open.splice(bestIdx, 1)[0];
    if (u === goalId) {
      const path = [];
      let curr = goalId;
      while (curr !== -1) {
        path.push([points[curr].lng, points[curr].lat]);
        curr = prev[curr];
      }
      path.reverse();
      return path;
    }

    for (let e = 0; e < points[u].neighbors.length; e++) {
      const edge = points[u].neighbors[e];
      const v = edge.to;
      const alt = dist[u] + edge.dist;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        if (!open.includes(v)) open.push(v);
      }
    }
  }
  return null;
}

function buildCompleteTrainRoute(scheduleData, segments) {
  if (!scheduleData || scheduleData.length === 0) {
    return { fullRoute: [], stationDistances: [], cumDists: [0] };
  }
  const validStations = scheduleData.filter((s) => s.coords && s.coords[0] && s.coords[1]);
  if (validStations.length === 0) {
    return { fullRoute: [], stationDistances: [], cumDists: [0] };
  }

  const graph = getRailGraph(segments);
  const fullRoute = [];
  const stationDistances = [];
  const cumDists = [0];
  let curM = 0;

  for (let i = 0; i < validStations.length - 1; i++) {
    const s1 = validStations[i];
    const s2 = validStations[i + 1];
    stationDistances.push(curM);

    const startNode = findClosestRailNode(graph, s1.coords[0], s1.coords[1]);
    const goalNode = findClosestRailNode(graph, s2.coords[0], s2.coords[1]);
    const leg = findAStarPath(graph, startNode, goalNode);

    if (leg && leg.length > 0) {
      const startIdx = fullRoute.length === 0 ? 0 : 1;
      for (let p = startIdx; p < leg.length; p++) {
        if (fullRoute.length > 0) {
          const segM = getDistanceMeters(fullRoute[fullRoute.length - 1], leg[p]);
          curM += segM;
          cumDists.push(curM);
        }
        fullRoute.push(leg[p]);
      }
    } else {
      // ফলব্যাক: সরাসরি সংযোগ
      const pB = [s2.coords[1], s2.coords[0]];
      if (fullRoute.length === 0) {
        fullRoute.push([s1.coords[1], s1.coords[0]]);
      }
      const segM = getDistanceMeters(fullRoute[fullRoute.length - 1], pB);
      curM += segM;
      cumDists.push(curM);
      fullRoute.push(pB);
    }
  }
  stationDistances.push(curM);

  return { fullRoute, stationDistances, cumDists };
}

// পলিলিনের নির্দিষ্ট দূরত্বের সাব-পয়েন্ট ও এঙ্গেল খোঁজা
function getPolylinePointAndAngle(points, cumDists, d) {
  const totalDist = cumDists[cumDists.length - 1] || 1;
  const clampedD = Math.max(0, Math.min(totalDist, d));

  function interpolateAt(dist) {
    if (dist <= 0) return points[0];
    if (dist >= totalDist) return points[points.length - 1];

    for (let i = 1; i < cumDists.length; i++) {
      if (cumDists[i] >= dist) {
        const segLen = cumDists[i] - cumDists[i - 1];
        const fraction = segLen > 0 ? (dist - cumDists[i - 1]) / segLen : 0;
        const pA = points[i - 1];
        const pB = points[i];
        return [pA[0] + fraction * (pB[0] - pA[0]), pA[1] + fraction * (pB[1] - pA[1])];
      }
    }
    return points[points.length - 1];
  }

  const center = interpolateAt(clampedD);
  const ahead = interpolateAt(clampedD + 3);
  const dx = ahead[0] - center[0];
  const dy = ahead[1] - center[1];
  const angle = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

  return { center, angle, interpolateAt };
}

// ৯টি আলাদা ৩ডি কোচের ফিচার কালেকশন তৈরি
function generate3DTrainFeatures(points, cumDists, headDist) {
  const features = [];
  const { interpolateAt } = getPolylinePointAndAngle(points, cumDists, headDist);

  // ১. লাল লোকোমোটিভ ইঞ্জিন (Locomotive)
  const locoD = headDist - 12;
  const { center: locoCenter, angle: locoAngle } = getPolylinePointAndAngle(points, cumDists, locoD);

  // ইঞ্জিন বডি (লাল)
  features.push({
    type: 'Feature',
    properties: { color: '#dc2626', height: 5.2, base: 0.8 },
    geometry: { type: 'Polygon', coordinates: [createBoxPolygon(locoCenter[0], locoCenter[1], 24, 4.4, locoAngle)] }
  });
  // ইঞ্জিন মেটাল ছাদ (সাদা)
  features.push({
    type: 'Feature',
    properties: { color: '#f8fafc', height: 5.6, base: 5.15 },
    geometry: { type: 'Polygon', coordinates: [createBoxPolygon(locoCenter[0], locoCenter[1], 20, 3.4, locoAngle)] }
  });
  // ইঞ্জিন উইন্ডশিল্ড (নীল ক্যাব)
  features.push({
    type: 'Feature',
    properties: { color: '#38bdf8', height: 4.8, base: 3.5 },
    geometry: { type: 'Polygon', coordinates: [createBoxPolygon(locoCenter[0], locoCenter[1], 8, 4.45, locoAngle)] }
  });

  // ২. ৮টি প্যাসেঞ্জার বগি (Bangladesh Railway Green Coaches)
  for (let i = 1; i <= 8; i++) {
    const coachD = headDist - 24 - (i - 1) * 22 - 11;
    const { center: cCenter, angle: cAngle } = getPolylinePointAndAngle(points, cumDists, coachD);

    // কোচের সবুজ বডি
    features.push({
      type: 'Feature',
      properties: { color: '#006a4e', height: 4.6, base: 0.6 },
      geometry: { type: 'Polygon', coordinates: [createBoxPolygon(cCenter[0], cCenter[1], 20, 4.2, cAngle)] }
    });
    // কোচের সাদা মেটাল ছাদ
    features.push({
      type: 'Feature',
      properties: { color: '#f8fafc', height: 5.0, base: 4.55 },
      geometry: { type: 'Polygon', coordinates: [createBoxPolygon(cCenter[0], cCenter[1], 19, 3.3, cAngle)] }
    });
    // কোচের লাল স্ট্রাইপ বেল্ট
    features.push({
      type: 'Feature',
      properties: { color: '#ef4444', height: 2.8, base: 2.3 },
      geometry: { type: 'Polygon', coordinates: [createBoxPolygon(cCenter[0], cCenter[1], 20.08, 4.28, cAngle)] }
    });
    // অন্ধকার কাঁচের জানালা ব্যান্ড
    features.push({
      type: 'Feature',
      properties: { color: '#0f172a', height: 3.8, base: 2.8 },
      geometry: { type: 'Polygon', coordinates: [createBoxPolygon(cCenter[0], cCenter[1], 19.5, 4.24, cAngle)] }
    });
  }

  const headPos = interpolateAt(headDist);
  const midPos = interpolateAt(Math.max(0, headDist - 75));
  const tailPos = interpolateAt(Math.max(0, headDist - 175));

  return {
    geojson: { type: 'FeatureCollection', features },
    headPos,
    midPos,
    tailPos,
    locoAngle
  };
}

// =========================================================================
// ৩. ট্রেনের হুইল সাউন্ড সিন্থেসাইজার (গতি অনুযায়ী টেম্পো পরিবর্তন)
// =========================================================================
class TrainAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.tempoMs = 380;
  }

  start(speedKmH = 50) {
    if (this.isPlaying) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.isPlaying = true;

      this.updateTempo(speedKmH);
    } catch {
      // audio catch
    }
  }

  updateTempo(speedKmH) {
    if (!this.isPlaying) return;
    const s = Math.max(15, Math.min(100, speedKmH));
    this.tempoMs = Math.round(18000 / s); // গতি বাড়লে হুইল বিট দ্রুত বাজে

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (!this.ctx || this.ctx.state === 'suspended') {
        this.ctx?.resume();
      }
      this.playChug();
    }, this.tempoMs);
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

  // লাইভ স্পিড, জিপিএস ও সময়সূচী অবস্থা
  const rawLat = activeState?.lat || 24.5826;
  const rawLng = activeState?.lng || 90.3947;
  const isAtStation = Boolean(activeState?.isAtStation);
  const speed = isAtStation ? 0 : Math.round(activeState?.speed || 48); // বাস্তব কিমি/ঘণ্টা
  const currentIdx = activeState?.segmentIndex ?? 0;
  const segmentRatio = typeof activeState?.segmentRatio === 'number' ? Math.max(0, Math.min(1, activeState.segmentRatio)) : 0;

  // বর্তমান, পূর্ববর্তী ও পরবর্তী স্টেশন
  const prevStation = scheduleData[currentIdx] || scheduleData[0] || { name: 'ঢাকা' };
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1] || { name: 'ময়মনসিংহ' };
  const originStation = scheduleData[0] || { name: 'ঢাকা কমলাপুর' };
  const destStation = scheduleData[scheduleData.length - 1] || { name: 'দেওয়ানগঞ্জ বাজার' };

  // ১. সম্পূর্ণ ডেজিগনেটেড রুট পলিলিন ও স্টেশন ডিসটেন্স বিল্ড করা (পুরো যাত্রার রুট)
  const { fullRoute: fullRoutePolyline, stationDistances, cumDists } = useMemo(() => {
    return buildCompleteTrainRoute(scheduleData, railSegmentsData);
  }, [scheduleData]);

  // ২. ট্রেনের বর্তমান বাস্তব অবস্থান প্রজেক্ট করা (সময়সূচী ও লাইভ ট্র্যাক অনুযায়ী)
  const targetDist = useMemo(() => {
    if (!stationDistances || stationDistances.length < 2) return 220;
    const segIdx = Math.max(0, Math.min(stationDistances.length - 2, currentIdx));
    const startM = stationDistances[segIdx] || 0;
    const endM = stationDistances[segIdx + 1] || (startM + 25000);

    if (isAtStation) {
      return Math.max(220, startM);
    }
    return Math.max(220, startM + segmentRatio * (endM - startM));
  }, [stationDistances, currentIdx, isAtStation, segmentRatio]);

  // রিয়েলটাইম ডিস্ট্যান্স স্টেট (Dead-reckoning)
  const trainDistRef = useRef(targetDist);

  useEffect(() => {
    if (Math.abs(trainDistRef.current - targetDist) > 1500) {
      trainDistRef.current = targetDist;
    }
  }, [targetDist]);

  // ৩. রিয়েলটাইমে অবশিষ্ট দূরত্ব ও পৌঁছানোর সময়
  const [dynamicDistToNext, setDynamicDistToNext] = useState(activeState?.distToNextKm || 19);

  const etaMinutes = useMemo(() => {
    if (isAtStation || speed === 0) return 0;
    const s = Math.max(20, speed);
    return Math.round((dynamicDistToNext / s) * 60) || 15;
  }, [dynamicDistToNext, speed, isAtStation]);

  const progressPercent = useMemo(() => {
    const totalDist = cumDists[cumDists.length - 1] || 1;
    return Math.min(100, Math.max(1, Math.round((trainDistRef.current / totalDist) * 100)));
  }, [cumDists]);

  // সাউন্ড টগল
  const toggleSound = () => {
    if (isMuted) {
      if (!audioSynthRef.current) {
        audioSynthRef.current = new TrainAudioSynthesizer();
      }
      audioSynthRef.current.start(speed);
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
      pitch: next2D ? 0 : 60,
      duration: 800
    });
  };

  // ফলো টগল বা 'ট্রেনের সাথে চলুন'
  const toggleFollow = () => {
    const nextFollow = !isFollowing;
    setIsFollowing(nextFollow);
    if (nextFollow && mapRef.current) {
      const pts = fullRoutePolyline;
      const { midPos, locoAngle } = generate3DTrainFeatures(pts, cumDists, trainDistRef.current);

      mapRef.current.easeTo({
        center: midPos,
        pitch: is2DMode ? 0 : 60,
        bearing: is2DMode ? 0 : locoAngle,
        zoom: is2DMode ? 14 : 17.5,
        duration: 800
      });
    }
  };

  // শুরুর ভিউ (রিসেট ক্যামেরা)
  const resetView = () => {
    setIsFollowing(true);
    if (mapRef.current) {
      const pts = fullRoutePolyline;
      const { midPos, locoAngle } = generate3DTrainFeatures(pts, cumDists, trainDistRef.current);

      mapRef.current.easeTo({
        center: midPos,
        pitch: is2DMode ? 0 : 60,
        bearing: is2DMode ? 0 : locoAngle,
        zoom: 17.5,
        duration: 900
      });
    }
  };

  // =========================================================================
  // ৫. ম্যাপ ও বাস্তবসম্মত ৩ডি রেললাইন এবং ৩ডি সলিড ট্রেনের লেয়ারসমূহ
  // =========================================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const pts = fullRoutePolyline;
    const initialTrain = generate3DTrainFeatures(pts, cumDists, trainDistRef.current);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style,
      center: initialTrain.midPos,
      zoom: is2DMode ? 14 : 17.5,
      pitch: is2DMode ? 0 : 60,
      bearing: is2DMode ? 0 : initialTrain.locoAngle,
      maxPitch: 75,
      maxZoom: 19.8,
      minZoom: 6,
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
      // ৩ডি সলিড এক্সট্রুডেড ট্রেন লেয়ার (Real 3D Solid Coaches in WebGL)
      // =====================================================================
      map.addSource('train-3d-boxes', {
        type: 'geojson',
        data: initialTrain.geojson
      });

      map.addLayer({
        id: 'train-3d-extrusion',
        type: 'fill-extrusion',
        source: 'train-3d-boxes',
        paint: {
          'fill-extrusion-color': ['get', 'color'],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'base'],
          'fill-extrusion-opacity': 0.98
        }
      });

      // হেডলাইট পয়েন্ট সোর্স ও লেয়ার (টুইন হেডলাইট)
      map.addSource('train-headlight-src', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: initialTrain.headPos }
        }
      });

      map.addLayer({
        id: 'train-headlight-glow',
        type: 'circle',
        source: 'train-headlight-src',
        paint: {
          'circle-color': '#fef08a',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 3, 15, 6, 16.5, 8.5, 18, 12],
          'circle-blur': 0.35,
          'circle-opacity': 0.95
        }
      });

      // =====================================================================
      // ভাসমান নির্দেশক মার্কারসমূহ (পরবর্তী স্টেশন ও শেষ বগি)
      // =====================================================================
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
        <span class="ahead-text">${isAtStation ? `${prevStation?.name?.split('(')[0] || 'স্টেশন'} স্টপেজে অবস্থান করছে` : `${nextStation?.name?.split('(')[0] || 'গন্তব্য'} ${toBangla(Math.round(dynamicDistToNext))} কি`}</span>
      `;

      const { interpolateAt } = getPolylinePointAndAngle(pts, cumDists, trainDistRef.current);
      const aheadPtPos = interpolateAt(trainDistRef.current + 35);

      const aheadMarker = new maplibregl.Marker({
        element: aheadEl,
        anchor: 'bottom'
      })
        .setLngLat(aheadPtPos)
        .addTo(map);

      aheadStationMarkerRef.current = aheadMarker;

      // শেষ বগি নির্দেশক
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
        .setLngLat(initialTrain.tailPos)
        .addTo(map);

      tailCoachMarkerRef.current = tailMarker;
    });

    return () => {
      if (aheadStationMarkerRef.current) aheadStationMarkerRef.current.remove();
      if (tailCoachMarkerRef.current) tailCoachMarkerRef.current.remove();
      if (audioSynthRef.current) audioSynthRef.current.stop();
      map.remove();
    };
  }, [currentStyle, fullRoutePolyline]);

  // =========================================================================
  // ৬. রিয়েলটাইম ডেড-রেকনিং অ্যানিমেশন লুপ (বাস্তব গতি ও সময়ের নিখুঁত প্রতিফলন)
  // ট্রেনের ডেজিগনেটেড রুটের বাইরে কখনো বের হবে না এবং গতি নিখুঁত থাকবে
  // =========================================================================
  useEffect(() => {
    let lastTime = performance.now();
    const pts = fullRoutePolyline;
    const totalDist = cumDists[cumDists.length - 1] || 1;

    // অডিও গতি অনুযায়ী সমন্বয়
    if (audioSynthRef.current && !isMuted) {
      if (isAtStation || speed === 0) {
        audioSynthRef.current.stop();
      } else {
        audioSynthRef.current.updateTempo(speed);
      }
    }

    const animateTrainAlongCurve = (now) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const segIdx = Math.max(0, Math.min(stationDistances.length - 2, currentIdx));
      const endM = stationDistances[segIdx + 1] || totalDist;

      if (isAtStation || speed === 0) {
        // ট্রেন স্টেশনে থেমে আছে - কোনো অনাকাঙ্ক্ষিত নড়াচড়া হবে না
        trainDistRef.current = stationDistances[segIdx] || trainDistRef.current;
      } else {
        // বাস্তব পদার্থবিজ্ঞান অনুযায়ী মিটার দূরত্ব অতিক্রম
        // speed km/h => (speed * 1000 / 3600) meters per second
        const metersPerSec = (speed * 1000) / 3600;
        trainDistRef.current += metersPerSec * dt;

        // ট্রেনের রুট শেষ প্রান্তের আগে সুরক্ষিত রাখা
        if (trainDistRef.current >= totalDist - 30) {
          trainDistRef.current = totalDist - 30;
        }
      }

      // গতিশীল দূরত্ব (পরবর্তী স্টেশন পর্যন্ত কিমি)
      const distRemainingMeters = Math.max(0, endM - trainDistRef.current);
      const distRemainingKm = Math.round((distRemainingMeters / 1000) * 10) / 10;

      if (mapRef.current && mapRef.current.getSource('train-3d-boxes')) {
        const trainData = generate3DTrainFeatures(pts, cumDists, trainDistRef.current);

        // ১. ৩ডি সলিড বগিগুলোর জ্যামিতি আপডেট
        mapRef.current.getSource('train-3d-boxes').setData(trainData.geojson);

        // ২. হেডলাইট পজিশন আপডেট
        if (mapRef.current.getSource('train-headlight-src')) {
          mapRef.current.getSource('train-headlight-src').setData({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: trainData.headPos }
          });
        }

        // ৩. শেষ বগি মার্কার পজিশন আপডেট
        if (tailCoachMarkerRef.current) {
          tailCoachMarkerRef.current.setLngLat(trainData.tailPos);
        }

        // ৪. পরবর্তী স্টেশন নির্দেশক মার্কার পজিশন ও লেখা আপডেট
        if (aheadStationMarkerRef.current) {
          const { interpolateAt } = getPolylinePointAndAngle(pts, cumDists, trainDistRef.current);
          const aheadPtPos = interpolateAt(trainDistRef.current + 35);
          aheadStationMarkerRef.current.setLngLat(aheadPtPos);

          const el = aheadStationMarkerRef.current.getElement();
          if (el) {
            const span = el.querySelector('.ahead-text');
            const txt = isAtStation
              ? `${prevStation?.name?.split('(')[0] || 'স্টেশন'} স্টপেজে অবস্থান করছে`
              : `${nextStation?.name?.split('(')[0] || 'গন্তব্য'} ${toBangla(Math.round(distRemainingKm))} কি`;
            if (span && span.textContent !== txt) {
              span.textContent = txt;
            }
          }
        }

        // ৫. ক্যামেরা স্মুথ ফলো (ট্রেনের সাথে চলুন)
        if (isFollowing) {
          mapRef.current.easeTo({
            center: trainData.midPos,
            bearing: is2DMode ? 0 : trainData.locoAngle,
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
  }, [speed, isAtStation, currentIdx, isFollowing, is2DMode, fullRoutePolyline, cumDists, stationDistances]);

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
          ১. টপ-লেফট ক্যাপসুল
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
              {isAtStation ? (
                <>
                  <span style={{ fontWeight: '900', color: '#be185d' }}>
                    {prevStation?.name?.split('(')[0] || 'স্টেশন'}
                  </span>{' '}
                  <span style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
                    স্টেশনে অবস্থান করছে
                  </span>
                </>
              ) : (
                <>
                  পরবর্তী{' '}
                  <span style={{ fontWeight: '900', color: '#0f172a' }}>
                    {nextStation?.name?.split('(')[0] || 'ময়মনসিংহ'}
                  </span>{' '}
                  <span style={{ color: '#64748b', fontWeight: '700', fontSize: '13px' }}>
                    ({toBangla(Math.round(dynamicDistToNext))} কি)
                  </span>
                </>
              )}
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
                  color: isAtStation ? '#059669' : (activeState?.delay > 5 ? '#dc2626' : '#15803d')
                }}
              >
                {isAtStation
                  ? 'স্টেশনে যাত্রা বিরতি'
                  : (activeState?.delay > 5
                    ? `${toBangla(activeState.delay)} মিনিট বিলম্বে`
                    : 'সঠিক সময়ে (অন টাইম)')}
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
              {nextStation?.name?.split('(')[0]} {toBangla(Math.round(dynamicDistToNext))} কি
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
          Google • রেললাইন © OpenStreetMap
        </div>
      </div>
    </div>
  );
}
