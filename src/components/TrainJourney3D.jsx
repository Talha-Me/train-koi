import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, MessageCircle, Layers, Compass, Crosshair } from 'lucide-react';
import railSegmentsData from '../data/railSegments.json';

// =========================================================================
// ১. ম্যাপ স্টাইলসমূহ (Esri Satellite & OpenStreetMap)
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
          attribution: 'Powered by Esri - Esri, Maxar, Earthstar Geographics • © OpenStreetMap contributors'
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
// ২. হাই-প্রিসিশন ট্র্যাক স্ন্যাপিং অ্যালগরিদম (রেললাইনের ঠিক ওপর বসানো)
// =========================================================================
function snapToRailTrack(lat, lng, destLat, destLng, segments) {
  if (!segments || !segments.length) {
    return { lat, lng, bearing: 45, segIdx: 0, t: 0 };
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

      const brng = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
      bestBearing = brng;
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
    segIdx: bestIdx,
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
  const rawLat = activeState?.lat || 24.2346;
  const rawLng = activeState?.lng || 89.9213;
  const speed = activeState?.speed || 42; // কিমি/ঘণ্টা

  // বর্তমান ও পরবর্তী স্টেশন
  const currentIdx = activeState?.segmentIndex ?? 0;
  const prevStation = scheduleData[currentIdx] || scheduleData[0] || { name: 'Dhaka' };
  const nextStation = scheduleData[currentIdx + 1] || scheduleData[scheduleData.length - 1] || { name: 'Mirzapur' };
  const originStation = scheduleData[0] || { name: 'Dhaka' };
  const destStation = scheduleData[scheduleData.length - 1] || { name: 'Chapainawabganj' };

  // গন্তব্য স্থানাঙ্ক
  const destCoords = nextStation?.coords || [24.2346, 89.9213];

  // ট্র্যাকে স্ন্যাপ করা প্রাথমিক স্থানাঙ্ক ও হেডিং
  const initialSnap = useMemo(() => {
    return snapToRailTrack(rawLat, rawLng, destCoords[0], destCoords[1], railSegmentsData);
  }, [rawLat, rawLng, destCoords]);

  // রিয়েলটাইম ট্র্যাকিং স্টেট (মুভিং ট্রেন)
  const trainStateRef = useRef({
    lat: initialSnap.lat,
    lng: initialSnap.lng,
    bearing: initialSnap.bearing,
    segIdx: initialSnap.segIdx,
    t: initialSnap.t
  });

  const distanceToNext = useMemo(() => {
    if (activeState?.distanceToNext) return Math.round(activeState.distanceToNext);
    return 8;
  }, [activeState]);

  const etaMinutes = useMemo(() => {
    const s = Math.max(15, speed);
    return Math.round((distanceToNext / s) * 60) || 12;
  }, [distanceToNext, speed]);

  const progressPercent = useMemo(() => {
    if (activeState?.progress) return Math.round(activeState.progress);
    if (scheduleData.length > 1) {
      return Math.round((currentIdx / (scheduleData.length - 1)) * 100) || 19;
    }
    return 19;
  }, [activeState, currentIdx, scheduleData]);

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
  // ৪. ম্যাপ ও বাস্তবসম্মত ৩ডি রেললাইন লেয়ার
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
      // ১. সম্পূর্ণ বাংলাদেশের ৬,০১০টি হাই-প্রিসিশন রেললাইন একসাথে রেন্ডার করা
      const allRailGeoJson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'MultiLineString',
              coordinates: railSegmentsData.map(s => [
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

      // লেয়ার ১: উজ্জ্বল লাইট-ধূসর ব্যালাস্ট পাথর বেড (Light Stone Ballast Bed)
      // স্যাটেলাইট ম্যাপে সবুজ ফসলি জমির মাঝে উজ্জ্বল ও স্পষ্ট দেখা যাবে (স্ক্রিনশটের হুবহু)
      map.addLayer({
        id: 'rail-ballast-bed',
        type: 'line',
        source: 'all-bangladesh-railway',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#e2e8f0',
          'line-width': 18,
          'line-opacity': 0.98
        }
      });

      // লেয়ার ২: কাঠের ড্যাশ স্লিপার টাই (Sleeper Ties with dasharray)
      map.addLayer({
        id: 'rail-sleepers',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#334155',
          'line-width': 14,
          'line-dasharray': [0.25, 0.75],
          'line-opacity': 0.95
        }
      });

      // লেয়ার ৩: স্টিলের রূপালী ডাবল রেললাইন (Steel Rails)
      map.addLayer({
        id: 'rail-steel-outer',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#0f172a',
          'line-width': 5.5,
          'line-opacity': 0.98
        }
      });

      // লেয়ার ৪: রেলের ভেতরের খাঁজ (Center gap between rails)
      map.addLayer({
        id: 'rail-steel-inner',
        type: 'line',
        source: 'all-bangladesh-railway',
        paint: {
          'line-color': '#e2e8f0',
          'line-width': 2.8,
          'line-opacity': 0.98
        }
      });

      // ২. স্ক্রিনশটের হুবহু বাস্তবসম্মত ৩ডি ট্রেন (লাল ইঞ্জিন + ১২টি সবুজ বগি)
      const trainEl = document.createElement('div');
      trainEl.className = 'clean-train-3d-model';
      trainEl.style.transformOrigin = 'top center';
      trainEl.style.transform = `rotate(${initialSnap.bearing}deg)`;

      // ১২টি কোচের নিখুঁত ভেক্টর মডেল (লাল ইঞ্জিন + সবুজ বগি)
      const coachesHtml = Array.from({ length: 12 }).map(() => `
        <div style="
          width: 14px;
          height: 18px;
          background: #006a4e;
          border-radius: 2px;
          position: relative;
          box-shadow: 0 3px 6px rgba(0,0,0,0.5);
          overflow: hidden;
          margin-bottom: 2px;
        ">
          <!-- সিলভার-হোয়াইট ছাদ -->
          <div style="position: absolute; top: 1px; bottom: 1px; left: 2px; right: 2px; background: #f8fafc; border-radius: 1px;"></div>
          <!-- লাল ব্যান্ড বেল্ট -->
          <div style="position: absolute; top: 7px; left: 0; right: 0; height: 3px; background: #dc2626;"></div>
        </div>
        <div style="width: 5px; height: 2px; background: #1e293b; margin-bottom: 2px;"></div>
      `).join('');

      trainEl.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(0 4px 10px rgba(0,0,0,0.65));
        ">
          <!-- লোকোমোটিভ লাল ইঞ্জিন -->
          <div style="
            width: 15px;
            height: 24px;
            background: linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #991b1b 100%);
            border-radius: 6px 6px 2px 2px;
            border: 1px solid #ffffff;
            position: relative;
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            margin-bottom: 2px;
          ">
            <!-- উইন্ডশিল্ড -->
            <div style="position: absolute; top: 3px; left: 2px; right: 2px; height: 5px; background: #38bdf8; border-radius: 1px;"></div>
            <!-- হেডলাইট জোড়া -->
            <div style="position: absolute; top: 1px; left: 2px; width: 2.5px; height: 2.5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 6px #fef08a;"></div>
            <div style="position: absolute; top: 1px; right: 2px; width: 2.5px; height: 2.5px; background: #ffffff; border-radius: 50%; box-shadow: 0 0 6px #fef08a;"></div>
          </div>
          <div style="width: 5px; height: 2px; background: #1e293b; margin-bottom: 2px;"></div>

          <!-- ১২টি প্যাসেঞ্জার বগি -->
          ${coachesHtml}
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
  // ৫. স্মুথ ডেড-রেকনিং অ্যানিমেশন লুপ (রেললাইন ধরে ট্রেন সামনে মসৃণভাবে চলে)
  // "দুই হালনাগাদের মাঝে ট্রেনটি সর্বশেষ জানা গতিতে সোজা এগোবে"
  // =========================================================================
  useEffect(() => {
    let lastTime = performance.now();

    const animateTrainAlongTrack = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const st = trainStateRef.current;
      const segs = railSegmentsData;

      if (segs && segs[st.segIdx]) {
        const [slat, slng, elat, elng] = segs[st.segIdx];
        const segDistMeters = Math.hypot(elat - slat, elng - slng) * 111000;

        if (segDistMeters > 0) {
          const metersPerSec = Math.max(8, (speed * 1000) / 3600);
          const dtMeters = metersPerSec * dt;
          st.t += dtMeters / segDistMeters;

          // সেগমেন্ট শেষ হলে সংযুক্ত পরবর্তী সেগমেন্টে ট্রানজিশন
          if (st.t >= 1) {
            st.t = 0;
            const dx = elng - slng;
            const dy = elat - slat;

            let nextIdx = (st.segIdx + 1) % segs.length;
            let bestDot = -Infinity;

            for (let k = 0; k < segs.length; k++) {
              const cand = segs[k];
              if (Math.hypot(cand[0] - elat, cand[1] - elng) < 0.001) {
                const cdx = cand[3] - cand[1];
                const cdy = cand[2] - cand[0];
                const dot = dx * cdx + dy * cdy;
                if (dot > bestDot) {
                  bestDot = dot;
                  nextIdx = k;
                }
              }
            }
            st.segIdx = nextIdx;
          }

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
          ১. টপ-লেফট ক্যাপসুল (Rajshahi Com Up #5 2h 49m দেরী)
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
            {train?.name?.split('(')[0]?.trim() || 'Rajshahi Com Up'} #{train?.number || '5'}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '12px',
              background: activeState?.delayMinutes > 5 ? '#fef3c7' : '#dcfce7',
              color: activeState?.delayMinutes > 5 ? '#b45309' : '#15803d'
            }}
          >
            {activeState?.delayMinutes > 5 ? `${toBangla(activeState.delayMinutes)} মিনিট লেট` : 'অন টাইম'}
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
              {toBangla(speed)}{' '}
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>কিমি/ঘণ্টা</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>পরবর্তী স্টেশন</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
              {nextStation?.name?.split('(')[0] || 'Mirzapur'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
              {toBangla(distanceToNext)} কিমি দূরে
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>আনুমানিক পৌঁছানো</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {toBangla(etaMinutes)}{' '}
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>মিনিট</span>
            </div>
          </div>
        </div>

        {/* প্রোগ্রেস বার (স্টেশন টু স্টেশন) */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: '700', marginBottom: '4px' }}>
            <span>{originStation?.name?.split('(')[0] || 'Dhaka'}</span>
            <span style={{ color: '#006a4e', fontWeight: '800' }}>{toBangla(progressPercent)}%</span>
            <span>{destStation?.name?.split('(')[0] || 'Chapainawabganj'}</span>
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
