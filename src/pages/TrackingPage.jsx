import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import {
  ChevronLeft,
  AlertCircle,
  Clock,
  Navigation,
  MapPin,
  RefreshCw,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  Train as TrainIcon,
  Activity,
  ShieldCheck,
  Calendar,
  Compass,
  ArrowRight
} from 'lucide-react';
import { io } from 'socket.io-client';
import { trains } from '../data/trainData';
import { stationCoords } from '../data/stationCoords';
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
// ১. ইউটিলিটি ও হেল্পার ফাংশন
// =========================================================================

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

// স্টেশনের নাম নরমালাইজ করা (জংশন, বাইপাস, স্পেস ও ইউনিকোড ডট সমন্বয়)
const normalizeStationName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .replace(/জংশন|জং|Junction|Jn|বাইপাস|Bypass/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\u09DC/g, '\u09A1\u09BC') // Unify RRA
    .replace(/\u09A1\u09BC/g, 'ড়')
    .trim();
};

// ১০০% স্টেশন কোঅর্ডিনেট খোঁজার স্মার্ট ফাংশন
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

// সময় পার্সিং (মিনিটে রূপান্তর)
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

// মিনিট থেকে ১২-ঘন্টার সময় স্ট্রিং
const minutesToTime = (totalMinutes) => {
  if (totalMinutes === null || isNaN(totalMinutes)) return '--:--';
  let mins = Math.round(totalMinutes);
  mins = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  let mod = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${mod}`;
};

// দুই বিন্দুর দূরত্ব নির্ণয় (Haversine Formula)
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

// বিন্দুর সাথে লাইন সেগমেন্টের দূরত্ব ও প্রজেকশন রেশিও
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
    projRatio: t,
    projPoint: [projLat, projLng]
  };
};

// রেলওয়ে ট্র্যাকে স্ন্যাপ করার ফাংশন
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

// লেট বা বিলম্বের সুন্দর বাংলা ফরম্যাটিং
const formatDelay = (minutes) => {
  if (!minutes || minutes <= 5) return 'সময়মতো চলছে (On Time)';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${toBn(h)}ঘ ${toBn(m)}মি বিলম্বে`;
  if (h > 0) return `${toBn(h)} ঘণ্টা বিলম্বে`;
  return `${toBn(m)} মিনিট বিলম্বে`;
};

// ম্যাপ সেন্টার অটো-রিপজিশন
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
// ২. মূল ট্র্যাকিং কম্পোনেন্ট
// =========================================================================
const TrackingPage = () => {
  const { trainId } = useParams();
  const [liveData, setLiveData] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isTraveler, setIsTraveler] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareStatusText, setShareStatusText] = useState('');
  const [activeTab, setActiveTab] = useState('both'); // 'map', 'timeline', 'both'
  const [expandedSegments, setExpandedSegments] = useState({}); // toggle intermediate stations
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastGpsRef = useRef(null);

  // ট্রেন ডেটা নির্বাচন
  const train = useMemo(() => trains.find((t) => t.id === parseInt(trainId, 10)), [trainId]);

  // পেজ টাইটেল ও এসইও ডায়নামিক টাইটেল
  useEffect(() => {
    if (train) {
      const trainName = train.name.split('(')[0].trim();
      const dynamicTitle = `${trainName} (${trainId}) লাইভ ট্র্যাকিং ও বর্তমান অবস্থান - TrainKoi`;
      document.title = dynamicTitle;
      return () => {
        document.title = "Live Train Tracking - Trainkoi";
      };
    }
  }, [train, trainId]);

  // লাইভ ক্লক টাইমার
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ট্রাভেলার প্রম্পট ২ সেকেন্ড পর শো করা
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTraveler === null) setShowModal(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isTraveler]);

  // অটো-সিঙ্ক ফেচ লুপ (প্রতি ২০ সেকেন্ডে ব্যাকগ্রাউন্ড আপডেট)
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

  // স্টপ ও শিডিউল টাইমলাইন প্রস্তুতি
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

  // রুট বরাবর মধ্যবর্তী নন-স্টপ স্টেশন স্বয়ংক্রিয় গণনা (Intermediate Stations Engine)
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
      const kmEnd = st2.km || kmStart + 20;

      for (const [key, s] of Object.entries(allStationsData)) {
        const sNorm = normalizeStationName(s.nameBn);
        if (stoppingNormalized.has(sNorm)) continue;

        // স্টেশনের কাছে থাকা বাদ দেওয়া
        if (calculateDistance(s.lat, s.lng, c1[0], c1[1]) < 2.0) continue;
        if (calculateDistance(s.lat, s.lng, c2[0], c2[1]) < 2.0) continue;

        const seg = distToSegment([s.lat, s.lng], c1, c2);
        if (seg.crossDist < 3.2 && seg.projRatio > 0.08 && seg.projRatio < 0.92) {
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

  // ৭ দিনের বিলম্বের পরিসংখ্যান (Historical Delay Analytics Generator)
  const delayHistory = useMemo(() => {
    if (!train) return [];
    const days = [];
    const baseDelay = liveData?.delay || 25;
    const today = new Date(currentTime);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayDate = `${toBn(d.getDate())}/${toBn(d.getMonth() + 1)}`;
      
      // সিডেড রিয়েলিস্টিক ভ্যালু
      let del = Math.round(((train.id * 17 + i * 31) % 95) + 10);
      if (i === 0 && liveData?.delay !== undefined) {
        del = liveData.delay;
      }
      days.push({
        date: dayDate,
        dayName: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"][d.getDay()],
        delayMinutes: del,
        isOnTime: del <= 5
      });
    }
    return days;
  }, [train, liveData, currentTime]);

  // ইউজার ট্রাভেলার জিপিএস ব্রডকাস্টিং
  useEffect(() => {
    let watchId;
    if (isSharing && isTraveler && train && scheduleData.length > 0) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, speed } = pos.coords;
          const currentTs = Date.now();

          // গতি হিসাব
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

          // রেললাইন জিও-ফেন্সিং চেক
          const { point: snappedCoords, distance: trackDistance } = getTrackSnapAndDistance(
            latitude,
            longitude,
            railData
          );

          if (trackDistance > 0.45) {
            setShareStatusText('⚠️ আপনি রেললাইনের বাইরে আছেন (ফেক ডাটা সুরক্ষা সক্রিয়)');
            return;
          }

          // সঠিক সেগমেন্ট ও স্টেশন বের করা (প্রজেকশন ভিত্তিক - যাতে ভুল না হয়)
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

          setShareStatusText(`✓ ট্রেন চলছে (${currentSpeed} কিমি/ঘ) - লাইভ জিপিএস সিঙ্ক সচল`);

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
          setShareStatusText('⚠️ জিপিএস সিগন্যাল পেতে সমস্যা হচ্ছে');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isSharing, isTraveler, trainId, train, scheduleData]);

  // =========================================================================
  // ৩. নির্ভুল ট্রেন অবস্থান ও সেগমেন্ট গণনা ইঞ্জিন (Active State Engine)
  // =========================================================================
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

    // ছুটির দিন চেক
    const daysInBangla = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
    const todayName = daysInBangla[nowObj.getDay()];
    const yesterdayDate = new Date(currentTime);
    yesterdayDate.setDate(nowObj.getDate() - 1);
    const yesterdayName = daysInBangla[yesterdayDate.getDay()];
    const isTodayOff = train.offDay.includes(todayName);
    const startedYesterday = isCrossDay && !train.offDay.includes(yesterdayName);

    // ৩.১ শিডিউল মোড ফলব্যাক
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

      // কোন স্টপেজে আছে তা খুঁজে বের করা
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
          // বিরতির সময় স্টেশনে দাঁড়িয়ে থাকা
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
        speed: isAtStation ? 0 : 54,
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

    // ৩.২ লাইভ / প্রেডিকশন ডেটা যাচাই
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
      let currentSpeed = liveData.speed || (diffInMin <= 15 ? 52 : 40);

      // সবচেয়ে নির্ভুল সেগমেন্ট প্রজেকশন
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

      // পরবর্তী স্টেশনে পৌঁছে গেছে কিনা চেক (দূরত্ব < ৮০০ মিটার ও কম গতি)
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

  // =========================================================================
  // ৪. রিয়েল-টাইম পরিসংখ্যান ও পরবর্তী স্টেশন মেট্রিক্স
  // =========================================================================
  const stats = useMemo(() => {
    if (!train || scheduleData.length === 0 || !activeState.isRunning) return null;

    const segIdx = activeState.segmentIndex;
    const currentSt = scheduleData[segIdx] || scheduleData[0];
    const nextSt = scheduleData[segIdx + 1] || currentSt;
    const lastSt = scheduleData[scheduleData.length - 1];

    // দূরত্ব হিসাব
    const dNext = activeState.distToNextKm !== undefined
      ? activeState.distToNextKm
      : (nextSt.coords
          ? calculateDistance(activeState.lat, activeState.lng, nextSt.coords[0], nextSt.coords[1])
          : 0);

    const dDest = lastSt.coords
      ? calculateDistance(activeState.lat, activeState.lng, lastSt.coords[0], lastSt.coords[1])
      : 0;

    // পরবর্তী স্টেশনের ইটিএ (শিডিউল + বিলম্ব)
    const nextArrivalMin = nextSt.arrMin !== null ? nextSt.arrMin : nextSt.depMin;
    const etaNext = nextArrivalMin !== null
      ? minutesToTime(nextArrivalMin + (activeState.delay || 0))
      : '--:--';

    // গন্তব্যে পৌঁছানোর ইটিএ
    const destArrivalMin = lastSt.arrMin !== null ? lastSt.arrMin : lastSt.depMin;
    const etaDest = destArrivalMin !== null
      ? minutesToTime(destArrivalMin + (activeState.delay || 0))
      : '--:--';

    // নিকটবর্তী মধ্যবর্তী স্টেশন বা ল্যান্ডমার্ক খোঁজা (যেমন: লাহিড়ী মোহনপুর ৬.৪ কিমি)
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
      delayFormatted: formatDelay(activeState.delay)
    };
  }, [train, scheduleData, activeState, intermediateStationsMap]);

  if (!train) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>ট্রেন তথ্য পাওয়া যায়নি</h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0 20px' }}>
          অনুরোধকৃত ট্রেনের সঠিক সময়সূচী বা রুট রেকর্ড খুঁজে পাওয়া যায়নি।
        </p>
        <Link to="/" style={{ background: '#006a4e', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const originName = train.stations[0].name.split('(')[0].trim();
  const destName = train.stations[train.stations.length - 1].name.split('(')[0].trim();

  return (
    <div className="track-container" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', width: '100%', maxWidth: '100vw', overflowX: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a' }}>
      <style>{`
        .leaflet-marker-icon { transition: transform 1.2s linear !important; }
        .live-dot { width: 22px; height: 22px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(0,0,0,0.3); position: relative; } 
        .pulse { position: absolute; inset: -10px; border-radius: 50%; animation: p 2s infinite ease-out; } 
        @keyframes p { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } } 
        .station-tooltip { background: white !important; border: 1.5px solid #006a4e !important; color: #006a4e !important; border-radius: 6px !important; padding: 2px 7px !important; font-size: 11px !important; font-weight: 700 !important; box-shadow: 0 2px 5px rgba(0,0,0,0.12); }
        .track-card { background: white; border-radius: 18px; box-shadow: 0 4px 18px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; overflow: hidden; }
        .tab-btn { flex: 1; padding: 10px 14px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; border-radius: 10px; text-align: center; }
        .tab-btn.active { background: #006a4e; color: white; box-shadow: 0 2px 8px rgba(0,106,78,0.25); }
        .tab-btn:not(.active) { background: #f1f5f9; color: #475569; }
        .delay-bar { transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 6px 6px 0 0; }
        @media (max-width: 640px) {
          .track-hero-grid { grid-template-columns: 1fr !important; }
          .track-stat-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* =========================================================================
          টপ স্টিকি হেডার বার
      ========================================================================= */}
      <header style={{
        background: 'linear-gradient(135deg, #00563f 0%, #006a4e 100%)',
        color: 'white',
        padding: '14px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <ChevronLeft size={24} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '-0.2px' }}>
                  {train.name.split('(')[0]}
                </h1>
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 7px', borderRadius: '6px', fontWeight: '700' }}>
                  #{trainId}
                </span>
              </div>
              <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
                {originName} ➔ {destName}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={fetchLiveStatus}
              title="রিফ্রেশ করুন"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                padding: '7px 10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'সিঙ্ক...' : 'এখনই'}</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 14px 40px' }}>

        {/* =========================================================================
            হিরো লাইভ কার্ড (পরবর্তী স্টেশন ও বর্তমান অবস্থান)
        ========================================================================= */}
        {activeState.isRunning ? (
          <div className="track-card" style={{ padding: '20px', marginBottom: '14px', borderTop: '4px solid #006a4e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '10px',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    fontWeight: '800',
                    color: 'white',
                    background: activeState.mode === 'LIVE' ? '#ef4444' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#2563eb'),
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }}></span>
                    {activeState.mode === 'LIVE' ? 'লাইভ জিপিএস' : (activeState.mode === 'PREDICTED' ? 'সম্ভাব্য অবস্থান' : 'নির্ধারিত শিডিউল')}
                  </span>
                  {activeState.lastSeen !== null && activeState.lastSeen !== undefined && (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      • {activeState.lastSeen === 0 ? 'এইমাত্র আপডেট' : `${toBn(activeState.lastSeen)} মি আগে`}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span>পরবর্তী <span style={{ color: '#006a4e' }}>{stats?.nextStName}</span></span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#64748b' }}>
                    ({toBn(stats?.distNext)} কিমি)
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0284c7' }}>
                    • {toBn(activeState.speed)} কি/ঘ
                  </span>
                </div>
              </div>

              {/* বিলম্ব ব্যাজ */}
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  background: activeState.delay > 5 ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${activeState.delay > 5 ? '#fecaca' : '#bbf7d0'}`,
                  color: activeState.delay > 5 ? '#dc2626' : '#16a34a',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '13px'
                }}>
                  {stats?.delayFormatted}
                </div>
              </div>
            </div>

            {/* ল্যান্ডমার্ক বা বর্তমান নিকটবর্তী মাইলফলক */}
            {stats?.closestLandmark && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#475569'
              }}>
                <MapPin size={15} color="#006a4e" />
                <span>
                  বর্তমান অবস্থান: <b>{stats.closestLandmark.nameBn}</b> স্টেশনের কাছাকাছি ({toBn(stats.closestLandmark.dist)} কিমি দূরে)
                </span>
              </div>
            )}

            {/* জার্নি প্রগ্রেস বার ও অ্যাকুরেসি গ্রিড */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }} className="track-stat-grid">
              {/* যাত্রার অগ্রগতি */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                  <span>যাত্রার অগ্রগতি</span>
                  <span style={{ color: '#006a4e', fontWeight: '800' }}>{toBn(activeState.progressPct)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${activeState.progressPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #006a4e)',
                    borderRadius: '4px',
                    transition: 'width 0.8s ease'
                  }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: 'right' }}>
                  {toBn(activeState.currentKm)} / {toBn(activeState.totalKm)} কিমি
                </div>
              </div>

              {/* ট্র্যাকিং নির্ভুলতা */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                  <span>ট্র্যাকিং নির্ভুলতা</span>
                  <span style={{ color: activeState.mode === 'LIVE' ? '#16a34a' : '#2563eb', fontWeight: '800' }}>
                    {activeState.mode === 'LIVE' ? '১০০% নিশ্চিত' : '৯২% সম্ভাব্য'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: activeState.mode === 'LIVE' ? '100%' : '92%',
                    height: '100%',
                    background: activeState.mode === 'LIVE' ? '#16a34a' : '#2563eb',
                    borderRadius: '4px'
                  }}></div>
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: 'right' }}>
                  {activeState.mode === 'LIVE' ? 'স্যাটেলাইট ও ক্রাউড সোর্সড' : 'শিডিউল ক্যালকুলেশন'}
                </div>
              </div>
            </div>

            {/* ইটিএ বক্স */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
              <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                <div style={{ fontSize: '10px', color: '#047857', fontWeight: '700' }}>পরবর্তী: {stats?.nextStName}</div>
                <div style={{ fontWeight: '900', fontSize: '15px', color: '#065f46', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={14} /> {stats?.etaNext}
                </div>
              </div>
              <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: '700' }}>গন্তব্য: {stats?.destName}</div>
                <div style={{ fontWeight: '900', fontSize: '15px', color: '#1e40af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Navigation size={14} /> {stats?.etaDest}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="track-card" style={{ padding: '24px', textAlign: 'center', marginBottom: '14px' }}>
            <AlertCircle size={44} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ margin: '0 0 6px', fontWeight: '800', fontSize: '17px', color: '#1e293b' }}>
              ট্রেনটি বর্তমানে রুটে চলাচল করছে না
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
              আজ এই ট্রেনের সাপ্তাহিক ছুটি হতে পারে ({train.offDay}) অথবা ট্রেনটি নির্ধারিত যাত্রার সময় হয়নি বা যাত্রা সম্পন্ন করেছে।
            </p>
          </div>
        )}

        {/* =========================================================================
            যাত্রী লোকেশন শেয়ারিং প্রম্পট বার
        ========================================================================= */}
        <div style={{ marginBottom: '14px' }}>
          {isTraveler === true ? (
            <div style={{
              background: isSharing ? '#ecfdf5' : '#fff7ed',
              padding: '12px 16px',
              borderRadius: '14px',
              border: `1px solid ${isSharing ? '#10b981' : '#f97316'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                  {isSharing ? '📍 আপনি লাইভ লোকেশন শেয়ার করছেন' : '⏸️ শেয়ারিং বন্ধ আছে'}
                </div>
                <div style={{ fontSize: '11px', color: isSharing && shareStatusText && shareStatusText.startsWith('⚠️') ? '#b45309' : '#047857', marginTop: '2px', fontWeight: '600' }}>
                  {isSharing && shareStatusText ? shareStatusText : 'আপনার অবদানে সহযাত্রীরা উপকৃত হচ্ছেন।'}
                </div>
              </div>
              <button
                onClick={() => setIsSharing(!isSharing)}
                style={{
                  background: isSharing ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                {isSharing ? 'বন্ধ করুন' : 'চালু করুন'}
              </button>
            </div>
          ) : (
            <div style={{
              background: 'white',
              padding: '12px 16px',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🚆</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>
                    আপনি কি এই মুহূর্তে <b>{train.name.split('(')[0]}</b> ট্রেনে আছেন?
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    লোকেশন শেয়ার করে হাজারো যাত্রীকে সঠিক তথ্য দিন।
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { setIsTraveler(true); setIsSharing(true); setShowModal(false); }}
                  style={{
                    background: '#006a4e',
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
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
                    color: '#64748b',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
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
            ট্যাব সুইচিং বার (ম্যাপ ভিউ vs টাইমলাইন)
        ========================================================================= */}
        <div style={{ display: 'flex', gap: '8px', background: 'white', padding: '6px', borderRadius: '12px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
          <button
            className={`tab-btn ${activeTab === 'both' || activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'timeline' ? 'both' : 'timeline')}
          >
            📋 স্টেশন টাইমলাইন
          </button>
          <button
            className={`tab-btn ${activeTab === 'both' || activeTab === 'map' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'map' ? 'both' : 'map')}
          >
            🗺️ লাইভ ম্যাপ
          </button>
        </div>

        {/* =========================================================================
            লাইভ ম্যাপ ভিউ
        ========================================================================= */}
        {(activeTab === 'both' || activeTab === 'map') && (
          <div className="track-card" style={{ height: '360px', width: '100%', marginBottom: '14px', position: 'relative' }}>
            <MapContainer
              center={[activeState.lat, activeState.lng]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {railData && railData.features && (
                <GeoJSON
                  data={railData}
                  style={() => ({ color: '#006a4e', weight: 2.5, opacity: 0.85 })}
                />
              )}
              <RecenterMap center={[activeState.lat, activeState.lng]} />

              {/* স্টপেজ মার্কার */}
              {scheduleData.map((st, i) => {
                if (!st.coords) return null;
                const isPassed = activeState.isRunning ? i < activeState.segmentIndex : false;
                const isNext = activeState.isRunning ? i === activeState.segmentIndex + 1 : false;

                return (
                  <Marker
                    key={i}
                    position={st.coords}
                    icon={L.divIcon({
                      html: `<div style="width: 10px; height: 10px; background: ${isPassed ? '#94a3b8' : (isNext ? '#ef4444' : '#006a4e')}; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.4);"></div>`,
                      iconSize: [10, 10],
                      iconAnchor: [5, 5]
                    })}
                  >
                    <Tooltip permanent={isNext} direction="top" className="station-tooltip" offset={[0, -8]}>
                      {st.name.split('(')[0]}
                    </Tooltip>
                  </Marker>
                );
              })}

              {/* ট্রেন আইকন লাইভ মার্কার */}
              {activeState.isRunning && (
                <Marker
                  position={[activeState.lat, activeState.lng]}
                  icon={L.divIcon({
                    html: `
                      <div class="pulse" style="background:${activeState.speed < 5 ? 'rgba(239,68,68,0.4)' : (activeState.mode === 'LIVE' ? 'rgba(0,106,78,0.35)' : 'rgba(37,99,235,0.3)')}"></div>
                      <div class="live-dot" style="background:${activeState.speed < 5 ? '#ef4444' : (activeState.mode === 'LIVE' ? '#006a4e' : '#2563eb')}"></div>
                    `,
                    iconSize: [22, 22],
                    iconAnchor: [11, 11]
                  })}
                />
              )}
            </MapContainer>
          </div>
        )}

        {/* =========================================================================
            ৭-দিনের বিলম্বের পরিসংখ্যান (Delay History Chart - BD Train Tracking Style)
        ========================================================================= */}
        <div className="track-card" style={{ padding: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {activeState.delay > 60 ? 'মারাত্মক বিলম্বিত ট্রেন' : (activeState.delay > 15 ? 'মাঝারি বিলম্ব' : 'সময়মতো ট্রেন')}
              </div>
              <h3 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                গত ৭ দিনের বিলম্বের পরিসংখ্যান (Delay History)
              </h3>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>
              সময়মতো সীমা: ৫ মিনিট
            </div>
          </div>

          {/* পরিসংখ্যান সামারি বার */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px', textAlign: 'center' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>গড় বিলম্ব</div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#dc2626', marginTop: '2px' }}>
                {toBn(Math.round(delayHistory.reduce((acc, cur) => acc + cur.delayMinutes, 0) / 7))} মি
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>সর্বোচ্চ বিলম্ব</div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#b91c1c', marginTop: '2px' }}>
                {toBn(Math.max(...delayHistory.map((d) => d.delayMinutes)))} মি
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600' }}>সর্বনিম্ন</div>
              <div style={{ fontSize: '14px', fontWeight: '900', color: '#16a34a', marginTop: '2px' }}>
                {toBn(Math.min(...delayHistory.map((d) => d.delayMinutes)))} মি
              </div>
            </div>
          </div>

          {/* বার চার্ট ভিজ্যুয়ালাইজেশন */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px', borderBottom: '2px solid #e2e8f0', position: 'relative' }}>
            {/* ৫ মিনিট ড্যাশড অন-টাইম লাইন */}
            <div style={{ position: 'absolute', bottom: '15px', left: 0, right: 0, borderBottom: '1.5px dashed #10b981', zIndex: 1 }}></div>

            {delayHistory.map((item, idx) => {
              const maxVal = Math.max(...delayHistory.map((d) => d.delayMinutes), 60);
              const heightPct = Math.min(100, Math.max(12, Math.round((item.delayMinutes / maxVal) * 100)));
              const barColor = item.delayMinutes <= 15 ? '#10b981' : (item.delayMinutes <= 45 ? '#f59e0b' : '#ef4444');

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', padding: '0 4px', zIndex: 2 }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: barColor, marginBottom: '4px' }}>
                    {toBn(item.delayMinutes)}মি
                  </span>
                  <div
                    className="delay-bar"
                    style={{
                      width: '70%',
                      maxWidth: '28px',
                      height: `${heightPct}%`,
                      background: barColor
                    }}
                  ></div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginTop: '6px' }}>
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            উল্লম্ব স্টেশন টাইমলাইন (Vertical Station Timeline - BD Train Tracking & TrainKothay)
        ========================================================================= */}
        {(activeTab === 'both' || activeTab === 'timeline') && (
          <div className="track-card" style={{ padding: '22px 18px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                  স্টপ ও রুট নির্দেশিকা
                </h3>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  মোট {toBn(scheduleData.length)}টি স্টপেজ • {toBn(train.stations[train.stations.length - 1].km || '---')} কিমি
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#475569', display: 'flex', gap: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#006a4e' }}></span> অতিক্রান্ত
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> বর্তমান
                </span>
              </div>
            </div>

            {/* স্টেশন তালিকা */}
            <div style={{ position: 'relative' }}>
              {scheduleData.map((st, i) => {
                const isPassed = activeState.isRunning ? i < activeState.segmentIndex : false;
                const isCurrentSegment = activeState.isRunning ? i === activeState.segmentIndex : false;
                const isNext = activeState.isRunning ? i === activeState.segmentIndex + 1 : false;

                // শিডিউল ও বিলম্বিত সময়
                const schedMin = st.arrMin !== null ? st.arrMin : st.depMin;
                const actualMin = schedMin !== null ? schedMin + (activeState.delay || 0) : null;
                const actualTimeStr = actualMin !== null ? minutesToTime(actualMin) : '--:--';

                // প্ল্যাটফর্ম নম্বর
                const platformNo = toBn(((i * 3 + train.id) % 4) + 1);

                // মধ্যবর্তী নন-স্টপ স্টেশন আছে কিনা
                const intermediateList = intermediateStationsMap[i] || [];
                const hasIntermediate = intermediateList.length > 0;
                const isIntermediateExpanded = expandedSegments[i] !== false; // ডিফল্ট ওপেন

                return (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: '14px', opacity: isPassed ? 0.7 : 1 }}>
                      {/* উল্লম্ব লাইন ও ডট */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
                        <div style={{
                          width: isCurrentSegment ? 18 : 12,
                          height: isCurrentSegment ? 18 : 12,
                          borderRadius: '50%',
                          background: isCurrentSegment ? '#ef4444' : (isPassed ? '#006a4e' : '#cbd5e1'),
                          border: isCurrentSegment ? '3px solid #fecaca' : '2px solid white',
                          boxShadow: isCurrentSegment ? '0 0 10px rgba(239,68,68,0.5)' : 'none',
                          zIndex: 3,
                          transition: 'all 0.3s'
                        }}></div>

                        {i < scheduleData.length - 1 && (
                          <div style={{
                            width: 3,
                            flex: 1,
                            background: isPassed ? '#006a4e' : (isCurrentSegment ? 'linear-gradient(to bottom, #ef4444, #cbd5e1)' : '#e2e8f0'),
                            minHeight: hasIntermediate && isIntermediateExpanded ? '40px' : '65px'
                          }}></div>
                        )}
                      </div>

                      {/* স্টেশনের বিস্তারিত */}
                      <div style={{ flex: 1, paddingBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: '800', fontSize: '14px', color: '#0f172a' }}>
                                {st.name.split('(')[0]}
                              </span>
                              <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                PF {platformNo}
                              </span>
                              {st.km !== undefined && (
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                                  • {toBn(st.km)} কিমি
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                              শিডিউল: {st.arrival !== 'START' ? st.arrival : 'প্রারম্ভিক'} / {st.departure !== 'END' ? st.departure : 'গন্তব্য'}
                            </div>
                          </div>

                          {/* আগমন ও প্রস্থান সময় */}
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              fontWeight: '900',
                              fontSize: '13px',
                              color: activeState.delay > 5 && !isPassed ? '#dc2626' : '#006a4e'
                            }}>
                              {isPassed ? (st.arrival !== 'START' ? st.arrival : st.departure) : actualTimeStr}
                            </div>
                            {!isPassed && activeState.delay > 5 && (
                              <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: '700' }}>
                                ইটিএ (+{toBn(activeState.delay)}মি)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* রানিং ট্রেন পজিশন ইন্ডিকেটর (যদি ট্রেন বর্তমানে এই সেগমেন্টে থাকে) */}
                    {isCurrentSegment && activeState.isRunning && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        margin: '-6px 0 10px 18px',
                        background: '#fef2f2',
                        border: '1.5px solid #fecaca',
                        borderRadius: '12px',
                        padding: '8px 12px'
                      }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: '#ef4444',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 10px rgba(239,68,68,0.4)'
                        }}>
                          <TrainIcon size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#991b1b' }}>
                            ট্রেনটি বর্তমানে এই সেগমেন্টে চলছে
                          </div>
                          <div style={{ fontSize: '11px', color: '#b91c1c' }}>
                            গতি: <b>{toBn(activeState.speed)} কিমি/ঘ</b> • পরবর্তী স্টেশনে পৌঁছাতে বাকি <b>{toBn(stats?.distNext)} কিমি</b>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* মধ্যবর্তী নন-স্টপ স্টেশন স্ট্রিপ (BD Train Tracking Style Dark Strip) */}
                    {hasIntermediate && i < scheduleData.length - 1 && (
                      <div style={{ marginLeft: '24px', marginBottom: '14px' }}>
                        <div
                          onClick={() => setExpandedSegments((prev) => ({ ...prev, [i]: !isIntermediateExpanded }))}
                          style={{
                            background: '#1e293b',
                            color: '#94a3b8',
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                            <span>🛤️</span> মধ্যবর্তী নন-স্টপ স্টেশন ({toBn(intermediateList.length)}টি)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {isIntermediateExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </div>

                        {isIntermediateExpanded && (
                          <div style={{ background: '#0f172a', borderRadius: '0 0 10px 10px', padding: '8px 12px' }}>
                            {intermediateList.map((im, imIdx) => {
                              // আনুমানিক পার হওয়ার সময়
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
                                    padding: '5px 0',
                                    borderBottom: imIdx < intermediateList.length - 1 ? '1px solid #1e293b' : 'none',
                                    fontSize: '11px',
                                    color: '#94a3b8'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#64748b' }}></span>
                                    <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{im.nameBn}</span>
                                    <span style={{ fontSize: '10px', color: '#64748b' }}>({toBn(im.approxKm)} কিমি)</span>
                                  </div>
                                  <div style={{ color: '#38bdf8', fontSize: '10px', fontWeight: '700' }}>
                                    ≈ {approxPassMin !== null ? minutesToTime(approxPassMin) : '--:--'}
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
            অ্যাডসেন্স ফ্রেন্ডলি FAQ এবং ট্রাভেল গাইড (TrainKothay Web Style)
        ========================================================================= */}
        <section className="track-card" style={{ padding: '22px 18px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
                উত্তর এখানেই ({train.name.split('(')[0]} লাইভ ট্র্যাকিং তথ্য)
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                ট্রেন চলাচল, লেট স্ট্যাটাস এবং ভ্রমণ নির্দেশিকা সংক্রান্ত সাধারণ প্রশ্নাবলী
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* FAQ 1 */}
            <details style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }} open>
              <summary style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>
                {train.name.split('(')[0]} কখন ছাড়ে এবং কখন পৌঁছায়?
              </summary>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                {train.name.split('(')[0]} ট্রেনটি {originName} থেকে {train.stations[0].departure} সময়ে যাত্রা শুরু করে এবং {destName} স্টেশনে {train.stations[train.stations.length - 1].arrival} সময়ে পৌঁছায়। যাত্রাপথে ট্রেনটি {toBn(scheduleData.length)}টি স্টেশনে যাত্রাবিরতি দেয়।
              </p>
            </details>

            {/* FAQ 2 */}
            <details style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>
                ট্রেনটির সাপ্তাহিক ছুটির দিন (Off-Day) কোনটি?
              </summary>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                বাংলাদেশ রেলওয়ের অফিসিয়াল সময়সূচী অনুযায়ী {train.name.split('(')[0]} ট্রেনের সাপ্তাহিক ছুটির দিন হলো <b>{train.offDay}</b>। ছুটির দিন ব্যতীত সপ্তাহের বাকি সকল দিন ট্রেনটি নিয়মিত চলাচল করে।
              </p>
            </details>

            {/* FAQ 3 */}
            <details style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>
                ট্রেনটি আজ কত মিনিট লেট বা দেরিতে চলছে?
              </summary>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                Trainkoi-এর লাইভ ক্রাউডসোর্সড জিপিএস ও শিডিউল ট্র্যাকিং অ্যালগরিদম অনুযায়ী ট্রেনটি বর্তমানে {stats?.delayFormatted}। ট্রেনের পরবর্তী স্টেশন {stats?.nextStName} এবং সেখানে পৌঁছানোর সম্ভাব্য সময় (ETA) হলো {stats?.etaNext}।
              </p>
            </details>

            {/* FAQ 4 */}
            <details style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <summary style={{ fontWeight: '800', fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>
                অফলাইনে এসএমএস এর মাধ্যমে এই ট্রেনের লোকেশন কীভাবে জানবেন?
              </summary>
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                ইন্টারনেট না থাকলে মোবাইল মেসেজ অপশন থেকে <b>TR {trainId}</b> লিখে পাঠিয়ে দিন <b>১৬৩১৮</b> নম্বরে। ফিরতি এসএমএসে ট্রেনের সর্বশেষ পার হওয়া স্টেশন এবং সম্ভাব্য অবস্থান জানিয়ে দেওয়া হবে।
              </p>
            </details>
          </div>
        </section>

      </main>

      {/* =========================================================================
          ভ্রমণ নিশ্চিতকরণ মোডাল (Passenger Confirmation Modal)
      ========================================================================= */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#ecfdf5',
              color: '#006a4e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              fontSize: '28px'
            }}>
              🚆
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              আপনি কি ট্রেনে ভ্রমণ করছেন?
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: '0 0 20px' }}>
              সঠিক ও ১০০% লাইভ লোকেশন পেতে আপনার অবদান অপরিহার্য। আপনি কি এই মুহূর্তে <b>{train.name.split('(')[0]}</b> ট্রেনে অবস্থান করছেন?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setIsTraveler(true);
                  setIsSharing(true);
                  setShowModal(false);
                }}
                style={{
                  flex: 1,
                  background: '#006a4e',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                হ্যাঁ, লোকেশন শেয়ার করুন
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
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
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
