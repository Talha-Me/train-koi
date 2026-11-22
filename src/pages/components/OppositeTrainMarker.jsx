import React, { useEffect, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// বাংলা সংখ্যা কনভার্টার
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

/**
 * OppositeTrainMarker
 * High-performance 60fps animated marker for opposite/crossing trains.
 * Distinct amber/indigo styling with train code badge and directional arrow.
 */
const OppositeTrainMarker = ({
  targetLat,
  targetLng,
  bearing = 0,
  speed = 0,
  trainId,
  trainName = 'বিপরীত ট্রেন',
  mode = 'LIVE',
  isOppositePair = true,
  onClick
}) => {
  const markerRef = useRef(null);
  const currentPosRef = useRef([targetLat, targetLng]);
  const currentBearingRef = useRef(bearing);
  const animFrameRef = useRef(null);

  // কালার থিমিং (বিপরীত ট্রেনের জন্য আকর্ষণীয় অ্যাম্বার/রয়েল ইন্ডিগো থিম)
  const badgeBg = isOppositePair ? '#ea580c' : '#4f46e5'; // Orange-600 / Indigo-600
  const arrowColor = isOppositePair ? '#f97316' : '#6366f1';
  const radarColor = isOppositePair ? 'rgba(234, 88, 12, 0.45)' : 'rgba(79, 70, 229, 0.45)';

  const customIcon = L.divIcon({
    className: 'trainkoi-opposite-train-icon',
    html: `
      <div class="opposite-koi-marker" style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div class="opposite-radar-ping" style="position: absolute; inset: -5px; border-radius: 50%; background: ${radarColor}; animation: liveRadarPing 1.8s infinite ease-out;"></div>
        <div class="opposite-marker-rotate" style="transform: rotate(${bearing}deg); transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
          <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; background: ${badgeBg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.38); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff;">
            <!-- Directional forward nose -->
            <div style="position: absolute; top: -7px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 7px solid ${arrowColor}; filter: drop-shadow(0 -1px 2px rgba(0,0,0,0.3));"></div>
            <!-- Train code -->
            <span style="font-size: 10px; font-weight: 900; line-height: 1; letter-spacing: -0.2px;">${toBn(trainId)}</span>
            <span style="font-size: 7.5px; font-weight: 700; opacity: 0.9; margin-top: 1px;">${isOppositePair ? 'বিপরীত' : 'সচল'}</span>
          </div>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

  // ৬০fps স্মুথ ইন্টারপোলেশন
  useEffect(() => {
    if (!markerRef.current) return;

    const distLat = Math.abs(targetLat - currentPosRef.current[0]);
    const distLng = Math.abs(targetLng - currentPosRef.current[1]);
    if (distLat > 0.5 || distLng > 0.5) {
      currentPosRef.current = [targetLat, targetLng];
      markerRef.current.setLatLng([targetLat, targetLng]);
      return;
    }

    const LERP_FACTOR = 0.08;
    let isCancelled = false;

    const animate = () => {
      if (isCancelled || !markerRef.current) return;

      const [curLat, curLng] = currentPosRef.current;
      const dLat = targetLat - curLat;
      const dLng = targetLng - curLng;

      if (Math.abs(dLat) < 0.000002 && Math.abs(dLng) < 0.000002) {
        currentPosRef.current = [targetLat, targetLng];
        markerRef.current.setLatLng([targetLat, targetLng]);
        return;
      }

      const nextLat = curLat + dLat * LERP_FACTOR;
      const nextLng = curLng + dLng * LERP_FACTOR;
      currentPosRef.current = [nextLat, nextLng];

      markerRef.current.setLatLng([nextLat, nextLng]);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetLat, targetLng]);

  // দিক বা অরিয়েন্টেশন রোটেশন
  useEffect(() => {
    if (!markerRef.current) return;
    const el = markerRef.current.getElement();
    if (el) {
      const rotateEl = el.querySelector('.opposite-marker-rotate');
      if (rotateEl) {
        let cur = currentBearingRef.current;
        let diff = (bearing - cur) % 360;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        const newBearing = cur + diff;
        currentBearingRef.current = newBearing;
        rotateEl.style.transform = `rotate(${newBearing}deg)`;
      }
    }
  }, [bearing]);

  return (
    <Marker
      ref={markerRef}
      position={[targetLat, targetLng]}
      icon={customIcon}
      zIndexOffset={850}
      eventHandlers={{
        click: () => {
          if (onClick) onClick();
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -22]} opacity={0.95}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
          <div style={{ color: isOppositePair ? '#ea580c' : '#4f46e5' }}>
            {isOppositePair ? '🔄 বিপরীত ট্রেন' : '🚆 সচল ট্রেন'}
          </div>
          <div style={{ fontSize: '13px' }}>{trainName} ({toBn(trainId)})</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            {speed > 0 ? `গতি: ${toBn(speed)} কিমি/ঘণ্টা` : 'স্টেশনে অবস্থান করছে'}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default React.memo(OppositeTrainMarker);
