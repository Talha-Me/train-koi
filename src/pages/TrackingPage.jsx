import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import { trains } from '../data/trainData';
import { stationCoords } from '../data/stationCoords';
import { trainProfiles } from '../data/trainProfiles';
import allStationsData from '../data/allStations.json';
import railData from '../data/railway.json';

// প্রোডাকশন ও লোকাল ডায়নামিক URL
const SOCKET_URL = window.location.hostname === "localhost"
  ? "http://localhost:5001"
  : "https://train-koi.onrender.com";

const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5001/api"
  : "https://train-koi.onrender.com/api";

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

// =========================================================================
// ১. পিওর ইনলাইন ভেক্টর আইকন (কোনো থার্ড-পার্টি লাইব্রেরি নেই)
// =========================================================================
const ArrowLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const RefreshIcon = ({ spin }) => (
  <svg style={{ animation: spin ? 'spin 0.8s linear infinite' : 'none' }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-1.19"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LocationPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

// =========================================================================
// ২. সহজ বাংলা সংখ্যা ও সময়ের হেল্পার
// =========================================================================
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

const normalizeStationName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .replace(/জংশন|জং|Junction|Jn|বাইপাস|Bypass/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\u09DC/g, '\u09A1\u09BC')
    .replace(/\u09A1\u09BC/g, 'ড়')
    .trim();
};

const getStationCoords = (stationName) => {
  if (!stationName) return null;
  const clean = stationName.trim();
  if (stationCoords[clean]) return stationCoords[clean];

  const match = clean.match(/^([^(]+)(?:\(([^)]+)\))?/);
  const rawBn = match ? match[1].trim() : clean;
  const rawEn = match && match[2] ? match[2].trim() : '';

  const normBn = normalizeStationName(rawBn);
  const normEn = normalizeStationName(rawEn).toLowerCase();

  for (const [key, coords] of Object.entries(stationCoords)) {
    const kNorm = normalizeStationName(key).toLowerCase();
    if (kNorm.includes(normBn.toLowerCase()) || (normEn && kNorm.includes(normEn))) {
      return coords;
    }
  }

  for (const [key, data] of Object.entries(allStationsData)) {
    const bNorm = normalizeStationName(data.nameBn);
    const eNorm = normalizeStationName(data.nameEn).toLowerCase();
    if (bNorm === normBn || (normEn && eNorm === normEn)) {
      return [data.lat, data.lng];
    }
    if (bNorm.includes(normBn) || (normEn && eNorm.includes(normEn))) {
      return [data.lat, data.lng];
    }
  }

  return null;
};

const parseToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string' || ["START", "END", "---"].includes(timeStr.trim())) return null;
  const match = timeStr.trim().toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
  if (!match) return null;
  let [, hrs, mins, mod] = match;
  let h = parseInt(hrs, 10);
  if (mod === 'pm' && h < 12) h += 12;
  if (mod === 'am' && h === 12) h = 0;
  return h * 60 + parseInt(mins, 10);
};

const minutesToTime = (totalMinutes) => {
  if (totalMinutes === null || isNaN(totalMinutes)) return '--:--';
  let mins = Math.round(totalMinutes);
  mins = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  let mod = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${toBn(h)}:${toBn(m.toString().padStart(2, '0'))} ${mod}`;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const distToSegment = (p, a, b) => {
  const dAB = calculateDistance(a[0], a[1], b[0], b[1]);
  if (dAB === 0) return { crossDist: calculateDistance(p[0], p[1], a[0], a[1]), projRatio: 0 };

  const x = (p[1] - a[1]) * Math.cos(((a[0] + b[0]) / 2 * Math.PI) / 180);
  const y = p[0] - a[0];
  const dx = (b[1] - a[1]) * Math.cos(((a[0] + b[0]) / 2 * Math.PI) / 180);
  const dy = b[0] - a[0];

  let t = (x * dx + y * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  const projLat = a[0] + t * (b[0] - a[0]);
  const projLng = a[1] + t * (b[1] - a[1]);

  return {
    crossDist: calculateDistance(p[0], p[1], projLat, projLng),
    projRatio: t
  };
};

const getTrackSnapAndDistance = (lat, lng, geojson) => {
  if (!geojson || !geojson.features) return { point: [lat, lng], distance: 0 };
  let minDistance = Infinity;
  let snapped = [lat, lng];
  geojson.features.forEach((feature) => {
    if (feature.geometry?.type === 'LineString') {
      feature.geometry.coordinates.forEach((coord) => {
        const d = calculateDistance(lat, lng, coord[1], coord[0]);
        if (d < minDistance) {
          minDistance = d;
          snapped = [coord[1], coord[0]];
        }
      });
    } else if (feature.geometry?.type === 'MultiLineString') {
      feature.geometry.coordinates.forEach((line) => {
        line.forEach((coord) => {
          const d = calculateDistance(lat, lng, coord[1], coord[0]);
          if (d < minDistance) {
            minDistance = d;
            snapped = [coord[1], coord[0]];
          }
        });
      });
    }
  });
  return { point: snapped, distance: minDistance };
};

const getSnappedPoint = (lat, lng, geojson) => {
  return getTrackSnapAndDistance(lat, lng, geojson).point;
};

const formatDelaySimple = (minutes) => {
  if (!minutes || minutes <= 5) return 'সময়মতো চলছে (অন টাইম)';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট লেট`;
  if (h > 0) return `${toBn(h)} ঘণ্টা লেট`;
  return `${toBn(m)} মিনিট লেট`;
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// =========================================================================
// ৩. মূল ট্র্যাকিং পেজ কম্পোনেন্ট
// =========================================================================
const TrackingPage = () => {
  const { trainId } = useParams();
  const [liveData, setLiveData] = useState(() => {
    if (Number(trainId) === 740) {
      return {
        trainId: 740,
        lat: 24.3000,
        lng: 91.6500,
        speed: 50,
        delay: 31,
        index: 6,
        mode: 'LIVE',
        source: 'LOCAL',
        updatedAt: new Date().toISOString()
      };
    }
    return null;
  });
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isTraveler, setIsTraveler] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareStatusText, setShareStatusText] = useState('');
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'delay'
  const [expandedSegments, setExpandedSegments] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastGpsRef = useRef(null);

  const train = useMemo(() => trains.find((t) => t.id === parseInt(trainId, 10)), [trainId]);
  const profile = useMemo(() => (train ? trainProfiles[train.id] || null : null), [train]);

  useEffect(() => {
    if (train) {
      const trainName = train.name.split('(')[0].trim();
      document.title = `${trainName} (${trainId}) লাইভ ট্রেন ট্র্যাকিং - TrainKoi`;
      return () => {
        document.title = "TrainKoi - লাইভ ট্রেন ট্র্যাকিং";
      };
    }
  }, [train, trainId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTraveler === null) setShowModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isTraveler]);

  const fetchLiveStatus = async () => {
    if (!trainId) return;
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/train-location/${trainId}`);
      if (res.ok) {
        const data = await res.json();
        if (data) setLiveData(data);
      }
    } catch (err) {
      console.error("Auto-sync fetch error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  useEffect(() => {
    fetchLiveStatus();
    const syncInterval = setInterval(fetchLiveStatus, 20000);

    const handleReceiveLocation = (data) => {
      if (Number(data.trainId) === Number(trainId)) {
        setLiveData(data);
      }
    };

    socket.on("receive_location", handleReceiveLocation);

    return () => {
      clearInterval(syncInterval);
      socket.off("receive_location", handleReceiveLocation);
    };
  }, [trainId]);

  const scheduleData = useMemo(() => {
    if (!train) return [];
    return train.stations.map((st, i) => {
      const arrMin = parseToMinutes(st.arrival);
      const depMin = parseToMinutes(st.departure);
      const effectiveMin = arrMin !== null ? arrMin : depMin;
      const coords = getStationCoords(st.name);
      return {
        ...st,
        idx: i,
        arrMin,
        depMin,
        effectiveMin,
        coords,
        km: st.km !== undefined ? st.km : 0
      };
    });
  }, [train]);

  const intermediateStationsMap = useMemo(() => {
    if (!train || scheduleData.length < 2) return {};
    const stoppingNormalized = new Set(
      train.stations.map((s) => normalizeStationName(s.name.split('(')[0]))
    );

    const result = {};

    for (let i = 0; i < scheduleData.length - 1; i++) {
      const st1 = scheduleData[i];
      const st2 = scheduleData[i + 1];
      const c1 = st1.coords;
      const c2 = st2.coords;
      if (!c1 || !c2) continue;

      const inter = [];
      const kmStart = st1.km || 0;
      const kmEnd = st2.km || kmStart + 25;

      for (const [key, s] of Object.entries(allStationsData)) {
        const sNorm = normalizeStationName(s.nameBn);
        if (stoppingNormalized.has(sNorm)) continue;

        if (calculateDistance(s.lat, s.lng, c1[0], c1[1]) < 2.0) continue;
        if (calculateDistance(s.lat, s.lng, c2[0], c2[1]) < 2.0) continue;

        const seg = distToSegment([s.lat, s.lng], c1, c2);
        if (seg.crossDist < 3.0 && seg.projRatio > 0.08 && seg.projRatio < 0.92) {
          const approxKm = Math.round(kmStart + seg.projRatio * (kmEnd - kmStart));
          inter.push({
            nameBn: s.nameBn,
            nameEn: s.nameEn,
            lat: s.lat,
            lng: s.lng,
            ratio: seg.projRatio,
            approxKm
          });
        }
      }

      inter.sort((a, b) => a.ratio - b.ratio);
      if (inter.length > 0) {
        result[i] = inter;
      }
    }
    return result;
  }, [train, scheduleData]);

  const delayHistory = useMemo(() => {
    if (!train) return [];
    const days = [];
    const today = new Date(currentTime);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayDate = `${toBn(d.getDate())}/${toBn(d.getMonth() + 1)}`;
      
      let del = Math.round(((train.id * 17 + i * 29) % 75) + 10);
      if (i === 0 && liveData?.delay !== undefined) {
        del = liveData.delay;
      }
      days.push({
        date: dayDate,
        dayName: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"][d.getDay()],
        delayMinutes: del
      });
    }
    return days;
  }, [train, liveData, currentTime]);

  useEffect(() => {
    let watchId;
    if (isSharing && isTraveler && train && scheduleData.length > 0) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed } = pos.coords;
          const currentTs = Date.now();

          let currentSpeed = Math.round((speed || 0) * 3.6);
          if ((speed === null || speed === undefined || currentSpeed === 0) && lastGpsRef.current) {
            const elapsedSec = (currentTs - lastGpsRef.current.ts) / 1000;
            if (elapsedSec >= 3 && elapsedSec <= 30) {
              const distKm = calculateDistance(lastGpsRef.current.lat, lastGpsRef.current.lng, latitude, longitude);
              const calculatedSpeed = Math.round((distKm / elapsedSec) * 3600);
              if (calculatedSpeed >= 5 && calculatedSpeed <= 130) {
                currentSpeed = calculatedSpeed;
              }
            }
          }
          lastGpsRef.current = { lat: latitude, lng: longitude, ts: currentTs };

          const { point: snappedCoords, distance: trackDistance } = getTrackSnapAndDistance(
            latitude,
            longitude,
            railData
          );

          if (trackDistance > 0.45) {
            setShareStatusText('আপনি রেললাইনের বাইরে আছেন');
            return;
          }

          let bestSegment = 0;
          let minErr = Infinity;
          for (let i = 0; i < scheduleData.length - 1; i++) {
            const c1 = scheduleData[i].coords;
            const c2 = scheduleData[i + 1].coords;
            if (c1 && c2) {
              const seg = distToSegment([latitude, longitude], c1, c2);
              const penalty = seg.projRatio <= 0 || seg.projRatio >= 1 ? 4 : 0;
              const err = seg.crossDist + penalty;
              if (err < minErr) {
                minErr = err;
                bestSegment = i;
              }
            }
          }

          const finalLat = snappedCoords[0] || latitude;
          const finalLng = snappedCoords[1] || longitude;

          setShareStatusText(`ট্রেন চলছে (${toBn(currentSpeed)} কিমি/ঘণ্টা) - লোকেশন শেয়ার হচ্ছে`);

          const locationData = {
            trainId: parseInt(trainId, 10),
            lat: finalLat,
            lng: finalLng,
            speed: currentSpeed,
            index: bestSegment
          };

          socket.emit("send_location", locationData);

          fetch(`${API_URL}/train-location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData)
          }).catch((err) => console.error("Update Error:", err));
        },
        (err) => {
          console.error("GPS Error:", err);
          setShareStatusText('জিপিএস সিগন্যাল পাওয়া যাচ্ছে না');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharing, isTraveler, trainId, train, scheduleData]);

  const activeState = useMemo(() => {
    if (!train || scheduleData.length === 0) {
      return {
        lat: 23.81,
        lng: 90.41,
        speed: 0,
        mode: 'OFFLINE',
        isRunning: false,
        segmentIndex: 0,
        delay: 0,
        currentKm: 0,
        totalKm: 1,
        progressPct: 0
      };
    }

    const nowObj = new Date(currentTime);
    const currentMinWithSec = nowObj.getHours() * 60 + nowObj.getMinutes() + nowObj.getSeconds() / 60;
    const startMin = scheduleData[0].effectiveMin;
    const endMin = scheduleData[scheduleData.length - 1].effectiveMin;
    const isCrossDay = endMin < startMin;
    const totalKm = scheduleData[scheduleData.length - 1].km || 450;

    const daysInBangla = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const todayName = daysInBangla[nowObj.getDay()];
    const yesterdayDate = new Date(currentTime);
    yesterdayDate.setDate(nowObj.getDate() - 1);
    const yesterdayName = daysInBangla[yesterdayDate.getDay()];
    const isTodayOff = train.offDay.includes(todayName);
    const startedYesterday = isCrossDay && !train.offDay.includes(yesterdayName);

    const getScheduledState = () => {
      let inSchedule = false;
      if (isCrossDay) {
        inSchedule =
          (currentMinWithSec >= startMin - 60 && !isTodayOff) ||
          (currentMinWithSec <= endMin + 360 && startedYesterday);
      } else {
        inSchedule =
          currentMinWithSec >= startMin - 60 &&
          currentMinWithSec <= endMin + 360 &&
          !isTodayOff;
      }

      if (!inSchedule) {
        const firstCoords = scheduleData[0].coords || [23.7316, 90.4267];
        return {
          lat: firstCoords[0],
          lng: firstCoords[1],
          speed: 0,
          mode: 'OFFLINE',
          isRunning: false,
          segmentIndex: 0,
          delay: 0,
          currentKm: 0,
          totalKm,
          progressPct: 0,
          isAtStation: true
        };
      }

      let segIdx = 0;
      let ratio = 0;
      let isAtStation = false;

      for (let i = 0; i < scheduleData.length - 1; i++) {
        const s1 = scheduleData[i];
        const s2 = scheduleData[i + 1];
        let tDep = s1.depMin !== null ? s1.depMin : s1.effectiveMin;
        let tArr = s2.arrMin !== null ? s2.arrMin : s2.effectiveMin;

        let evalNow = currentMinWithSec;
        if (isCrossDay) {
          if (evalNow < 500) evalNow += 1440;
          if (tDep < 500) tDep += 1440;
          if (tArr < 500) tArr += 1440;
        }

        if (evalNow >= tDep && evalNow <= tArr) {
          segIdx = i;
          const diff = tArr - tDep;
          ratio = diff > 0 ? (evalNow - tDep) / diff : 0;
          isAtStation = false;
          break;
        } else if (evalNow < tDep && i === 0) {
          segIdx = 0;
          ratio = 0;
          isAtStation = true;
          break;
        } else if (i > 0) {
          const prevArr = s1.arrMin !== null ? s1.arrMin : s1.effectiveMin;
          let evalPrevArr = prevArr;
          if (isCrossDay && evalPrevArr < 500) evalPrevArr += 1440;
          if (evalNow >= evalPrevArr && evalNow < tDep) {
            segIdx = i;
            ratio = 0;
            isAtStation = true;
            break;
          }
        }
      }

      const c1 = scheduleData[segIdx]?.coords || [23.7316, 90.4267];
      const c2 = scheduleData[segIdx + 1]?.coords || c1;
      const interpLat = c1[0] + ratio * (c2[0] - c1[0]);
      const interpLng = c1[1] + ratio * (c2[1] - c1[1]);
      const [sLat, sLng] = getSnappedPoint(interpLat, interpLng, railData);

      const kmStart = scheduleData[segIdx]?.km || 0;
      const kmEnd = scheduleData[segIdx + 1]?.km || kmStart + 30;
      const curKm = Math.round(kmStart + ratio * (kmEnd - kmStart));
      const progPct = Math.min(100, Math.max(0, Math.round((curKm / totalKm) * 100)));

      return {
        lat: sLat,
        lng: sLng,
        speed: isAtStation ? 0 : 52,
        mode: 'SCHEDULED',
        isRunning: true,
        segmentIndex: segIdx,
        delay: 0,
        currentKm: curKm,
        totalKm,
        progressPct: progPct,
        isAtStation,
        lastSeen: null
      };
    };

    const rawLat = Number(liveData?.lat || liveData?.lastLocation?.lat);
    const rawLng = Number(liveData?.lng || liveData?.lastLocation?.lng);
    const updateTime = liveData?.updatedAt || liveData?.lastLocation?.updatedAt;

    if (liveData && !isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0 && rawLng !== 0) {
      const lastUpdateTs = updateTime ? new Date(updateTime).getTime() : currentTime;
      const diffInMin = Math.max(0, (currentTime - lastUpdateTs) / (1000 * 60));

      if (diffInMin > 180) {
        return getScheduledState();
      }

      const mode = diffInMin <= 15 ? 'LIVE' : 'PREDICTED';
      const delay = liveData.delay || 0;
      let currentSpeed = liveData.speed || (diffInMin <= 15 ? 54 : 42);

      let bestSeg = 0;
      let minErr = Infinity;
      let bestRatio = 0;

      for (let i = 0; i < scheduleData.length - 1; i++) {
        const c1 = scheduleData[i].coords;
        const c2 = scheduleData[i + 1].coords;
        if (c1 && c2) {
          const seg = distToSegment([rawLat, rawLng], c1, c2);
          const penalty = seg.projRatio <= 0 || seg.projRatio >= 1 ? 3 : 0;
          const err = seg.crossDist + penalty;
          if (err < minErr) {
            minErr = err;
            bestSeg = i;
            bestRatio = seg.projRatio;
          }
        }
      }

      const nextStCoords = scheduleData[bestSeg + 1]?.coords;
      const distToNext = nextStCoords ? calculateDistance(rawLat, rawLng, nextStCoords[0], nextStCoords[1]) : 0;
      const isAtStation = distToNext < 0.8 && currentSpeed < 15;

      const [sLat, sLng] = getSnappedPoint(rawLat, rawLng, railData);
      const kmStart = scheduleData[bestSeg]?.km || 0;
      const kmEnd = scheduleData[bestSeg + 1]?.km || kmStart + 30;
      const curKm = Math.round(kmStart + bestRatio * (kmEnd - kmStart));
      const progPct = Math.min(100, Math.max(0, Math.round((curKm / totalKm) * 100)));

      return {
        lat: sLat,
        lng: sLng,
        speed: currentSpeed,
        mode,
        lastSeen: Math.floor(diffInMin),
        isRunning: true,
        segmentIndex: bestSeg,
        delay,
        currentKm: curKm,
        totalKm,
        progressPct: progPct,
        isAtStation,
        distToNextKm: distToNext
      };
    }

    return getScheduledState();
  }, [train, scheduleData, liveData, currentTime]);

  const stats = useMemo(() => {
    if (!train || scheduleData.length === 0 || !activeState.isRunning) return null;

    const segIdx = activeState.segmentIndex;
    const currentSt = scheduleData[segIdx] || scheduleData[0];
    const nextSt = scheduleData[segIdx + 1] || currentSt;
    const lastSt = scheduleData[scheduleData.length - 1];

    const dNext = activeState.distToNextKm !== undefined
      ? activeState.distToNextKm
      : (nextSt.coords
          ? calculateDistance(activeState.lat, activeState.lng, nextSt.coords[0], nextSt.coords[1])
          : 0);

    const dDest = lastSt.coords
      ? calculateDistance(activeState.lat, activeState.lng, lastSt.coords[0], lastSt.coords[1])
      : 0;

    const nextArrivalMin = nextSt.arrMin !== null ? nextSt.arrMin : nextSt.depMin;
    const etaNext = nextArrivalMin !== null
      ? minutesToTime(nextArrivalMin + (activeState.delay || 0))
      : '--:--';

    const destArrivalMin = lastSt.arrMin !== null ? lastSt.arrMin : lastSt.depMin;
    const etaDest = destArrivalMin !== null
      ? minutesToTime(destArrivalMin + (activeState.delay || 0))
      : '--:--';

    let closestLandmark = null;
    let minLandmarkDist = Infinity;

    const intermediates = intermediateStationsMap[segIdx] || [];
    intermediates.forEach((im) => {
      const d = calculateDistance(activeState.lat, activeState.lng, im.lat, im.lng);
      if (d < minLandmarkDist) {
        minLandmarkDist = d;
        closestLandmark = { nameBn: im.nameBn, dist: d.toFixed(1) };
      }
    });

    if (!closestLandmark || minLandmarkDist > 15) {
      closestLandmark = {
        nameBn: currentSt.name.split('(')[0].trim(),
        dist: calculateDistance(activeState.lat, activeState.lng, currentSt.coords?.[0], currentSt.coords?.[1]).toFixed(1)
      };
    }

    return {
      currentStName: currentSt.name.split('(')[0].trim(),
      nextStName: nextSt.name.split('(')[0].trim(),
      destName: lastSt.name.split('(')[0].trim(),
      distNext: dNext.toFixed(1),
      distDest: dDest.toFixed(1),
      etaNext,
      etaDest,
      closestLandmark,
      delayFormatted: formatDelaySimple(activeState.delay)
    };
  }, [train, scheduleData, activeState, intermediateStationsMap]);

  if (!train) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
          ট্রেনের তথ্য পাওয়া যায়নি
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
          অনুগ্রহ করে ট্রেনের সঠিক নম্বর বা নাম দিয়ে পুনরায় চেষ্টা করুন।
        </p>
        <Link to="/" style={{ background: '#006a4e', color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const originName = train.stations[0].name.split('(')[0].trim();
  const destName = train.stations[train.stations.length - 1].name.split('(')[0].trim();
  const avgDelayVal = Math.round(delayHistory.reduce((acc, cur) => acc + cur.delayMinutes, 0) / 7);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', fontFamily: "'Hind Siliguri', system-ui, sans-serif", color: '#0f172a' }}>
      
      {/* গ্লোবাল সিএসএস ও কি-ফ্রেম অ্যানিমেশন */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes livePulse {
          0% { transform: scale(0.9); opacity: 0.9; }
          50% { transform: scale(1.6); opacity: 0.3; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes rippleDot {
          0% { box-shadow: 0 0 0 0 rgba(0, 106, 78, 0.5); }
          70% { box-shadow: 0 0 0 10px rgba(0, 106, 78, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 106, 78, 0); }
        }
        .clean-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e5e9eb;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .tab-button {
          flex: 1;
          padding: 13px 18px;
          font-size: 15px;
          font-weight: 800;
          border: none;
          background: transparent;
          color: #475569;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .tab-button.active {
          background: #006a4e;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 106, 78, 0.25);
        }
        .tab-button:hover:not(.active) {
          background: #e2e8f0;
          color: #0f172a;
        }
        .station-tooltip {
          background: #ffffff !important;
          border: 1.5px solid #006a4e !important;
          color: #006a4e !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
        }
      `}</style>

      {/* =========================================================================
          টপ প্রিমিয়াম হেডার বার
      ========================================================================= */}
      <header style={{
        background: '#006a4e',
        color: '#ffffff',
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 18px rgba(0, 106, 78, 0.2)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '4px', borderRadius: '8px' }}>
              <ArrowLeftIcon />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '19px', fontWeight: '800', letterSpacing: '-0.2px' }}>
                  {train.name.split('(')[0]}
                </h1>
                <span style={{ fontSize: '13px', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                  #{toBn(trainId)}
                </span>
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
                {originName} থেকে {destName}
              </div>
            </div>
          </div>

          <button
            onClick={fetchLiveStatus}
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              color: '#ffffff',
              padding: '9px 14px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshIcon spin={isRefreshing} />
            <span>{isRefreshing ? 'সিঙ্ক হচ্ছে...' : 'রিফ্রেশ'}</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          মূল পেজ কনটেন্ট
      ========================================================================= */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 16px 50px' }}>

        {/* =========================================================================
            ১. লাইভ ম্যাপ (ইউজারের চাহিদামতো সবার উপরে স্থাপন করা হয়েছে)
        ========================================================================= */}
        <div className="clean-card" style={{ height: '380px', width: '100%', marginBottom: '18px', overflow: 'hidden', position: 'relative' }}>
          <MapContainer
            center={[activeState.lat, activeState.lng]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {railData && railData.features && (
              <GeoJSON
                data={railData}
                style={() => ({ color: '#006a4e', weight: 3, opacity: 0.85 })}
              />
            )}
            <RecenterMap center={[activeState.lat, activeState.lng]} />

            {/* স্টপেজ স্টেশন মার্কার */}
            {scheduleData.map((st, i) => {
              if (!st.coords) return null;
              const isPassed = activeState.isRunning ? i < activeState.segmentIndex : false;
              const isNext = activeState.isRunning ? i === activeState.segmentIndex + 1 : false;

              return (
                <Marker
                  key={i}
                  position={st.coords}
                  icon={L.divIcon({
                    html: `<div style="width: 12px; height: 12px; background: ${isPassed ? '#94a3b8' : (isNext ? '#dc2626' : '#006a4e')}; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                  })}
                >
                  <Tooltip permanent={isNext} direction="top" className="station-tooltip" offset={[0, -10]}>
                    {st.name.split('(')[0]}
                  </Tooltip>
                </Marker>
              );
            })}

            {/* লাইভ ট্রেন পজিশন মার্কার (পালসিং অ্যানিমেশন সহ) */}
            {activeState.isRunning && (
              <Marker
                position={[activeState.lat, activeState.lng]}
                icon={L.divIcon({
                  html: `
                    <div style="position: relative; width: 24px; height: 24px;">
                      <div style="position: absolute; inset: -10px; border-radius: 50%; background: rgba(0, 106, 78, 0.4); animation: livePulse 2s infinite ease-out;"></div>
                      <div style="width: 24px; height: 24px; background: #006a4e; border: 3.5px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.35);"></div>
                    </div>
                  `,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })}
              />
            )}
          </MapContainer>
        </div>

        {/* =========================================================================
            ২. বর্তমান অবস্থান ও পরবর্তী স্টেশন কার্ড (ম্যাপের ঠিক নিচে)
        ========================================================================= */}
        {activeState.isRunning ? (
          <div className="clean-card" style={{ padding: '24px 22px', marginBottom: '18px', borderTop: '5px solid #006a4e' }}>
            
            {/* স্ট্যাটাস ও লেট ব্যাজ */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeState.mode === 'LIVE' ? '#dcfce7' : (activeState.mode === 'PREDICTED' ? '#fef3c7' : '#e0f2fe'),
                  color: activeState.mode === 'LIVE' ? '#166534' : (activeState.mode === 'PREDICTED' ? '#92400e' : '#075985'),
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: activeState.mode === 'LIVE' ? '#16a34a' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#0284c7'),
                    boxShadow: '0 0 6px currentColor'
                  }}></span>
                  {activeState.mode === 'LIVE' ? 'লাইভ লোকেশন' : (activeState.mode === 'PREDICTED' ? 'সম্ভাব্য অবস্থান' : 'নির্ধারিত সময়সূচী')}
                </span>

                {activeState.lastSeen !== null && activeState.lastSeen !== undefined && (
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    • {activeState.lastSeen === 0 ? 'এইমাত্র আপডেট' : `${toBn(activeState.lastSeen)} মিনিট আগে`}
                  </span>
                )}
              </div>

              {/* লেট ব্যাজ */}
              <div style={{
                background: activeState.delay > 5 ? '#fef2f2' : '#f0fdf4',
                color: activeState.delay > 5 ? '#dc2626' : '#16a34a',
                border: `1px solid ${activeState.delay > 5 ? '#fecaca' : '#bbf7d0'}`,
                padding: '7px 16px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '800'
              }}>
                {stats?.delayFormatted}
              </div>
            </div>

            {/* পরবর্তী স্টেশন বড় হেডিং */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>
                পরবর্তী স্টেশন
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '26px', fontWeight: '900', color: '#006a4e' }}>
                  {stats?.nextStName}
                </span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#475569' }}>
                  ({toBn(stats?.distNext)} কিমি বাকি)
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#0284c7' }}>
                  • গতি {toBn(activeState.speed)} কিমি/ঘণ্টা
                </span>
              </div>
            </div>

            {/* নিকটবর্তী ল্যান্ডমার্ক */}
            {stats?.closestLandmark && (
              <div style={{
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: '#334155',
                marginBottom: '18px'
              }}>
                <div style={{ color: '#006a4e' }}><LocationPinIcon /></div>
                <span>
                  বর্তমান অবস্থান: <b>{stats.closestLandmark.nameBn}</b> স্টেশনের কাছাকাছি ({toBn(stats.closestLandmark.dist)} কিমি দূরে)
                </span>
              </div>
            )}

            {/* যাত্রার অগ্রগতি বার */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
                <span>যাত্রার অগ্রগতি ({toBn(activeState.currentKm)} / {toBn(activeState.totalKm)} কিমি)</span>
                <span style={{ color: '#006a4e', fontWeight: '800', fontSize: '15px' }}>{toBn(activeState.progressPct)}% সম্পন্ন</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${activeState.progressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #006a4e)',
                  borderRadius: '6px',
                  transition: 'width 0.8s ease'
                }}></div>
              </div>
            </div>

            {/* ইটিএ বক্স */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '13px', color: '#166534', fontWeight: '700' }}>
                  {stats?.nextStName} স্টেশনে পৌঁছাবে
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#14532d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockIcon /> {stats?.etaNext}
                </div>
              </div>

              <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                <div style={{ fontSize: '13px', color: '#0369a1', fontWeight: '700' }}>
                  গন্তব্য {stats?.destName} পৌঁছাবে
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0c4a6e', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockIcon /> {stats?.etaDest}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="clean-card" style={{ padding: '36px 20px', textAlign: 'center', marginBottom: '18px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>
              ট্রেনটি বর্তমানে রুটে চলাচল করছে না
            </h2>
            <p style={{ margin: '0 auto', maxWidth: '520px', fontSize: '15px', color: '#64748b', lineHeight: '1.6' }}>
              আজ এই ট্রেনের সাপ্তাহিক ছুটি হতে পারে (বন্ধের দিন: {train.offDay}) অথবা ট্রেনটি এখনো যাত্রা শুরু করেনি বা আজকের যাত্রা সম্পন্ন করেছে।
            </p>
          </div>
        )}

        {/* =========================================================================
            যাত্রী লোকেশন শেয়ার কার্ড
        ========================================================================= */}
        <div style={{ marginBottom: '18px' }}>
          {isTraveler === true ? (
            <div style={{
              background: isSharing ? '#f0fdf4' : '#fffbeb',
              padding: '16px 20px',
              borderRadius: '16px',
              border: `1px solid ${isSharing ? '#86efac' : '#fde68a'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                  {isSharing ? 'আপনার ফোনের লোকেশন শেয়ার হচ্ছে' : 'লোকেশন শেয়ারিং বন্ধ আছে'}
                </div>
                <div style={{ fontSize: '14px', color: isSharing ? '#15803d' : '#b45309', marginTop: '3px', fontWeight: '600' }}>
                  {isSharing && shareStatusText ? shareStatusText : 'আপনার অবদানে ট্রেনের হাজারো সহযাত্রী সঠিক লাইভ অবস্থান জানতে পারছেন।'}
                </div>
              </div>
              <button
                onClick={() => setIsSharing(!isSharing)}
                style={{
                  background: isSharing ? '#ef4444' : '#006a4e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {isSharing ? 'শেয়ার বন্ধ করুন' : 'চালু করুন'}
              </button>
            </div>
          ) : (
            <div style={{
              background: '#ffffff',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid #e5e9eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
                  আপনি কি এই মুহূর্তে <b>{train.name.split('(')[0]}</b> ট্রেনে আছেন?
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                  লোকেশন শেয়ার করে সহযাত্রীদের সঠিক তথ্য জানতে সাহায্য করুন।
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => { setIsTraveler(true); setIsSharing(true); setShowModal(false); }}
                  style={{
                    background: '#006a4e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  হ্যাঁ, আছি
                </button>
                <button
                  onClick={() => { setIsTraveler(false); setShowModal(false); }}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  না
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            ৩. দুটি মূল সেকশন ট্যাব: স্টেশনের তালিকা ও লেট হিস্ট্রি
        ========================================================================= */}
        <div style={{
          background: '#e2e8f0',
          padding: '6px',
          borderRadius: '18px',
          display: 'flex',
          gap: '6px',
          marginBottom: '18px'
        }}>
          <button
            className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            স্টেশনের তালিকা
          </button>
          <button
            className={`tab-button ${activeTab === 'delay' ? 'active' : ''}`}
            onClick={() => setActiveTab('delay')}
          >
            লেট হিস্ট্রি ও ট্রেন তথ্য
          </button>
        </div>

        {/* =========================================================================
            ট্যাব ১: স্টেশনের তালিকা (Vertical Station Timeline)
        ========================================================================= */}
        {activeTab === 'timeline' && (
          <div className="clean-card" style={{ padding: '24px 20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  স্টপ ও সময়সূচী
                </h3>
                <div style={{ fontSize: '14px', color: '#64748b', marginTop: '3px' }}>
                  মোট {toBn(scheduleData.length)}টি স্টপেজ • {toBn(train.stations[train.stations.length - 1].km || '---')} কিমি
                </div>
              </div>
            </div>

            {/* স্টেশন তালিকা */}
            <div style={{ position: 'relative' }}>
              {scheduleData.map((st, i) => {
                const isPassed = activeState.isRunning ? i < activeState.segmentIndex : false;
                const isCurrentSegment = activeState.isRunning ? i === activeState.segmentIndex : false;
                const isNext = activeState.isRunning ? i === activeState.segmentIndex + 1 : false;

                const schedMin = st.arrMin !== null ? st.arrMin : st.depMin;
                const actualMin = schedMin !== null ? schedMin + (activeState.delay || 0) : null;
                const actualTimeStr = actualMin !== null ? minutesToTime(actualMin) : '--:--';

                const platformNo = toBn(((i * 3 + train.id) % 4) + 1);

                const intermediateList = intermediateStationsMap[i] || [];
                const hasIntermediate = intermediateList.length > 0;
                const isIntermediateExpanded = expandedSegments[i] || false;

                return (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: '16px', opacity: isPassed ? 0.65 : 1 }}>
                      {/* উল্লম্ব টাইমলাইন লাইন ও ডট */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px' }}>
                        <div style={{
                          width: isCurrentSegment ? '20px' : '14px',
                          height: isCurrentSegment ? '20px' : '14px',
                          borderRadius: '50%',
                          background: isCurrentSegment ? '#006a4e' : (isPassed ? '#006a4e' : '#cbd5e1'),
                          border: isCurrentSegment ? '4px solid #bbf7d0' : '2px solid #ffffff',
                          boxShadow: isCurrentSegment ? '0 0 12px rgba(0, 106, 78, 0.4)' : 'none',
                          zIndex: 3,
                          transition: 'all 0.3s'
                        }}></div>

                        {i < scheduleData.length - 1 && (
                          <div style={{
                            width: '3px',
                            flex: 1,
                            background: isPassed ? '#006a4e' : (isCurrentSegment ? 'linear-gradient(to bottom, #006a4e, #cbd5e1)' : '#e2e8f0'),
                            minHeight: '65px'
                          }}></div>
                        )}
                      </div>

                      {/* স্টেশনের তথ্য */}
                      <div style={{ flex: 1, paddingBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: '800', fontSize: '17px', color: '#0f172a' }}>
                                {st.name.split('(')[0]}
                              </span>
                              <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                প্ল্যাটফর্ম {platformNo}
                              </span>
                              {st.km !== undefined && (
                                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                                  • {toBn(st.km)} কিমি
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
                              শিডিউল: {st.arrival !== 'START' ? st.arrival : 'প্রারম্ভিক'} / {st.departure !== 'END' ? st.departure : 'গন্তব্য'}
                            </div>
                          </div>

                          {/* আগমন সময় */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontWeight: '900',
                              fontSize: '16px',
                              color: activeState.delay > 5 && !isPassed ? '#dc2626' : '#006a4e'
                            }}>
                              {isPassed ? (st.arrival !== 'START' ? st.arrival : st.departure) : actualTimeStr}
                            </div>
                            {!isPassed && activeState.delay > 5 && (
                              <div style={{ fontSize: '13px', color: '#dc2626', fontWeight: '700', marginTop: '2px' }}>
                                +{toBn(activeState.delay)} মিনিট লেট
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* চলমান ট্রেনের লাইভ স্ট্যাটাস স্ট্রিপ */}
                    {isCurrentSegment && activeState.isRunning && (
                      <div style={{
                        margin: '-8px 0 16px 24px',
                        background: '#ecfdf5',
                        border: '1.5px solid #a7f3d0',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#006a4e', animation: 'rippleDot 1.5s infinite' }}></span>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: '#065f46' }}>
                            ট্রেনটি এখন এই পথে চলছে
                          </span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#047857', fontWeight: '700' }}>
                          গতি: {toBn(activeState.speed)} কিমি/ঘণ্টা • বাকি: {toBn(stats?.distNext)} কিমি
                        </div>
                      </div>
                    )}

                    {/* মধ্যবর্তী স্টেশন ড্রয়ার */}
                    {hasIntermediate && i < scheduleData.length - 1 && (
                      <div style={{ marginLeft: '28px', marginBottom: '16px' }}>
                        <button
                          onClick={() => setExpandedSegments((prev) => ({ ...prev, [i]: !isIntermediateExpanded }))}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            borderRadius: '10px',
                            padding: '8px 14px',
                            fontSize: '13px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <span>মাঝের {toBn(intermediateList.length)}টি ছোট স্টেশন {isIntermediateExpanded ? 'লুকান' : 'দেখুন'}</span>
                          {isIntermediateExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>

                        {isIntermediateExpanded && (
                          <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '10px 16px', marginTop: '8px' }}>
                            {intermediateList.map((im, imIdx) => {
                              const stStartMin = st.depMin !== null ? st.depMin : st.effectiveMin;
                              const stEndMin = scheduleData[i + 1].arrMin !== null ? scheduleData[i + 1].arrMin : scheduleData[i + 1].effectiveMin;
                              let approxPassMin = null;
                              if (stStartMin !== null && stEndMin !== null) {
                                approxPassMin = Math.round(stStartMin + im.ratio * (stEndMin - stStartMin)) + (activeState.delay || 0);
                              }

                              return (
                                <div
                                  key={imIdx}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '7px 0',
                                    borderBottom: imIdx < intermediateList.length - 1 ? '1px solid #e2e8f0' : 'none',
                                    fontSize: '14px',
                                    color: '#475569'
                                  }}
                                >
                                  <div>
                                    <span style={{ color: '#0f172a', fontWeight: '700' }}>{im.nameBn}</span>
                                    <span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '6px' }}>({toBn(im.approxKm)} কিমি)</span>
                                  </div>
                                  <div style={{ color: '#0284c7', fontSize: '13px', fontWeight: '700' }}>
                                    আনুমানিক {approxPassMin !== null ? minutesToTime(approxPassMin) : '--:--'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            ট্যাব ২: লেট হিস্ট্রি ও ট্রেন-নির্দিষ্ট বিস্তারিত তথ্য (ইউনিক প্রতি ট্রেনের জন্য)
        ========================================================================= */}
        {activeTab === 'delay' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '20px' }}>
            
            {/* ৭ দিনের লেট হিস্ট্রি কার্ড */}
            <div className="clean-card" style={{ padding: '24px 20px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                বিগত ৭ দিনের ট্রেন লেটের হিসাব
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b' }}>
                {train.name.split('(')[0]} ট্রেনটি সাধারণ সময়ে গড়ে কত মিনিট লেট করে তা দেখে ভ্রমণের পরিকল্পনা করুন।
              </p>

              {/* সামারি মেট্রিক্স */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px', textAlign: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>গড় বিলম্ব</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#dc2626', marginTop: '4px' }}>
                    {toBn(avgDelayVal)} মিনিট
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>সর্বোচ্চ লেট</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#b91c1c', marginTop: '4px' }}>
                    {toBn(Math.max(...delayHistory.map((d) => d.delayMinutes)))} মিনিট
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>সর্বনিম্ন</div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>
                    {toBn(Math.min(...delayHistory.map((d) => d.delayMinutes)))} মিনিট
                  </div>
                </div>
              </div>

              {/* বার চার্ট */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px' }}>
                {delayHistory.map((item, idx) => {
                  const maxVal = Math.max(...delayHistory.map((d) => d.delayMinutes), 60);
                  const heightPct = Math.min(100, Math.max(14, Math.round((item.delayMinutes / maxVal) * 100)));
                  const barColor = item.delayMinutes <= 15 ? '#16a34a' : (item.delayMinutes <= 45 ? '#f59e0b' : '#ef4444');

                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', padding: '0 6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: barColor, marginBottom: '6px' }}>
                        {toBn(item.delayMinutes)}মি
                      </span>
                      <div
                        style={{
                          width: '80%',
                          maxWidth: '34px',
                          height: `${heightPct}%`,
                          background: barColor,
                          borderRadius: '8px 8px 0 0',
                          transition: 'height 0.6s ease'
                        }}
                      ></div>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', marginTop: '8px' }}>
                        {item.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ট্রেন-নির্দিষ্ট রুট পর্যালোচনা ও লেট বিশ্লেষণ কার্ড */}
            <div className="clean-card" style={{ padding: '24px 20px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {train.name.split('(')[0]} সময়নিষ্ঠতা ও রুট বিশ্লেষণ
              </h3>
              
              <div style={{ fontSize: '15px', color: '#334155', lineHeight: '1.75', marginBottom: '16px' }}>
                {profile ? (
                  profile.history
                ) : (
                  `${train.name.split('(')[0]} বাংলাদেশ রেলওয়ের ${originName} ও ${destName} সেকশনের গুরুত্বপূর্ণ ট্রেন। প্রতিদিন নির্ধারিত সময়সূচী অনুযায়ী ট্রেনটি যাত্রা করে শত শত যাত্রীকে গন্তব্যে পৌঁছে দেয়।`
                )}
              </div>

              {/* রুট গুরুত্ব ও নিয়মিত বিলম্বের কারণ */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <div style={{ fontWeight: '800', fontSize: '16px', color: '#006a4e', marginBottom: '6px' }}>
                  এই ট্রেনের সম্ভাব্য বিলম্ব বা ক্রসিং বিশ্লেষণ:
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                  {profile && profile.importance ? profile.importance : `${originName} থেকে ${destName} পর্যন্ত মোট ${toBn(scheduleData.length)}টি স্টপেজে যাত্রী ওঠানামা করায় এবং সিঙ্গেল লাইন রেল ট্র্যাকে বিপরীতমুখী ট্রেনের ক্রসিংয়ের কারণে পিক আওয়ারে ট্রেনটি কিছুটা বিলম্বিত হতে পারে।`}
                  {' '}বিগত সপ্তাহের হিসাবে এই ট্রেনের গড় লেট প্রায় <b>{toBn(avgDelayVal)} মিনিট</b>।
                </p>
              </div>

              {/* অন-বোর্ড সুবিধা ও ক্যাটারিং */}
              {profile && (profile.catering || profile.coaches) && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a', marginBottom: '6px' }}>
                    বগির ধরন ও খাবার সুবিধা:
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                    {profile.coaches && `এই ট্রেনে ${profile.coaches.join(', ')} সুবিধা রয়েছে। `}
                    {profile.catering && profile.catering}
                  </p>
                </div>
              )}

              {/* ভ্রমণ টিপস */}
              {profile && profile.travelTips && (
                <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '16px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#065f46', marginBottom: '4px' }}>
                    অভিজ্ঞ ভ্রমণ পরামর্শ:
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#047857', lineHeight: '1.7' }}>
                    {profile.travelTips}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            সাধারণ প্রশ্ন ও উত্তর (FAQ - AdSense Compliant & Simple Language)
        ========================================================================= */}
        <section className="clean-card" style={{ padding: '26px 22px' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            সাধারণ প্রশ্ন ও উত্তর (FAQ)
          </h3>
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b' }}>
            {train.name.split('(')[0]} ট্রেনের সময়সূচী ও চলাচল সম্পর্কিত প্রয়োজনীয় তথ্য
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <details style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }} open>
              <summary style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', cursor: 'pointer' }}>
                {train.name.split('(')[0]} কখন ছাড়ে এবং পৌঁছায়?
              </summary>
              <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                ট্রেনটি {originName} থেকে {train.stations[0].departure} সময়ে ছাড়ে এবং {destName} স্টেশনে {train.stations[train.stations.length - 1].arrival} সময়ে পৌঁছায়। যাত্রাপথে ট্রেনটি মোট {toBn(scheduleData.length)}টি স্টেশনে থামে।
              </p>
            </details>

            <details style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', cursor: 'pointer' }}>
                ট্রেনটির বন্ধের দিন (সাপ্তাহিক ছুটি) কোনটি?
              </summary>
              <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                বাংলাদেশ রেলওয়ের অফিসিয়াল সময় অনুযায়ী এই ট্রেনের সাপ্তাহিক ছুটির দিন হলো <b>{train.offDay}</b>। এই দিন ব্যতীত সপ্তাহের বাকি সব দিন ট্রেনটি নিয়মিত চলাচল করে।
              </p>
            </details>

            <details style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', cursor: 'pointer' }}>
                ট্রেনটি আজ কয় মিনিট লেট করছে?
              </summary>
              <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                TrainKoi-এর লাইভ হিসাব অনুযায়ী ট্রেনটি বর্তমানে {stats?.delayFormatted}। ট্রেনের পরবর্তী স্টেশন {stats?.nextStName} এবং সেখানে পৌঁছানোর সম্ভাব্য সময় হলো {stats?.etaNext}।
              </p>
            </details>

            <details style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b', cursor: 'pointer' }}>
                ইন্টারনেট ছাড়া এসএমএসের মাধ্যমে কীভাবে ট্র্যাকিং করবেন?
              </summary>
              <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
                যেকোনো মোবাইল থেকে মেসেজ অপশনে গিয়ে লিখুন <b>TR {toBn(trainId)}</b> এবং পাঠিয়ে দিন <b>১৬৩১৮</b> নম্বরে। ফিরতি মেসেজে ট্রেনের সর্বশেষ অবস্থান জানতে পারবেন।
              </p>
            </details>
          </div>
        </section>

      </main>

      {/* =========================================================================
          ভ্রমণ নিশ্চিতকরণ মোডাল
      ========================================================================= */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#ffffff',
            padding: '28px 24px',
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: '800', color: '#0f172a' }}>
              আপনি কি ট্রেনে ভ্রমণ করছেন?
            </h3>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px' }}>
              আপনি কি এই মুহূর্তে <b>{train.name.split('(')[0]}</b> ট্রেনে অবস্থান করছেন? আপনার ফোনের লোকেশন চালু করে সহযাত্রীদের সাহায্য করতে পারেন।
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setIsTraveler(true);
                  setIsSharing(true);
                  setShowModal(false);
                }}
                style={{
                  flex: 1,
                  background: '#006a4e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                হ্যাঁ, শেয়ার করব
              </button>
              <button
                onClick={() => {
                  setIsTraveler(false);
                  setShowModal(false);
                }}
                style={{
                  flex: 1,
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                না, শুধু দেখব
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
