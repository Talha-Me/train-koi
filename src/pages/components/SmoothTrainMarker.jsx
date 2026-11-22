import React, { useEffect, useRef } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { lerp } from '../utils/trainLogic';

/**
 * SmoothTrainMarker
 * High-performance 60fps animated train marker for Leaflet.
 * Uses requestAnimationFrame and direct Leaflet DOM manipulation to glide
 * smoothly between coordinates without React re-render lag.
 */
const SmoothTrainMarker = ({
  targetLat,
  targetLng,
  bearing = 0,
  speed = 0,
  mode = 'LIVE',
  trainName = 'ট্রেন'
}) => {
  const markerRef = useRef(null);
  const currentPosRef = useRef([targetLat, targetLng]);
  const currentBearingRef = useRef(bearing);
  const animFrameRef = useRef(null);

  // Mode-specific color styling
  const isLive = mode === 'LIVE';
  const isPredicted = mode === 'PREDICTED';
  const badgeBg = isLive ? '#006a4e' : isPredicted ? '#d97706' : '#0284c7';
  const arrowColor = isLive ? '#10b981' : isPredicted ? '#f59e0b' : '#38bdf8';
  const radarColor = isLive ? 'rgba(16, 185, 129, 0.4)' : isPredicted ? 'rgba(245, 158, 11, 0.4)' : 'rgba(2, 132, 199, 0.4)';

  // Build custom DivIcon with directional indicator and pulse glow
  const customIcon = L.divIcon({
    className: 'trainkoi-smooth-train-icon',
    html: `
      <div class="train-koi-marker" style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
        <div class="train-radar-ping" style="position: absolute; inset: -6px; border-radius: 50%; background: ${radarColor}; animation: liveRadarPing 1.8s infinite ease-out;"></div>
        <div class="train-marker-rotate" style="transform: rotate(${bearing}deg); transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <div style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: ${badgeBg}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
            <!-- Directional forward nose -->
            <div style="position: absolute; top: -7px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 7px solid ${arrowColor}; filter: drop-shadow(0 -1px 2px rgba(0,0,0,0.25));"></div>
            <!-- Locomotive Icon -->
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="3" width="16" height="16" rx="2"></rect>
              <path d="M4 11h16"></path>
              <path d="M12 3v8"></path>
              <path d="m8 19-2 3"></path>
              <path d="m16 19 2 3"></path>
              <circle cx="8" cy="15" r="1.2" fill="#ffffff"></circle>
              <circle cx="16" cy="15" r="1.2" fill="#ffffff"></circle>
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });

  // 60 FPS Smooth Interpolation Loop
  useEffect(() => {
    if (!markerRef.current) return;

    // Check if jump distance is very large (e.g. train switch)
    const distLat = Math.abs(targetLat - currentPosRef.current[0]);
    const distLng = Math.abs(targetLng - currentPosRef.current[1]);
    if (distLat > 0.5 || distLng > 0.5) {
      // Teleport directly
      currentPosRef.current = [targetLat, targetLng];
      markerRef.current.setLatLng([targetLat, targetLng]);
      return;
    }

    const LERP_FACTOR = 0.08; // Smooth dampening factor
    let isCancelled = false;

    const animate = () => {
      if (isCancelled || !markerRef.current) return;

      const [curLat, curLng] = currentPosRef.current;
      const dLat = targetLat - curLat;
      const dLng = targetLng - curLng;

      // Check if close enough to rest
      if (Math.abs(dLat) < 0.000002 && Math.abs(dLng) < 0.000002) {
        currentPosRef.current = [targetLat, targetLng];
        markerRef.current.setLatLng([targetLat, targetLng]);
        return;
      }

      // Smooth step
      const nextLat = curLat + dLat * LERP_FACTOR;
      const nextLng = curLng + dLng * LERP_FACTOR;
      currentPosRef.current = [nextLat, nextLng];

      markerRef.current.setLatLng([nextLat, nextLng]);

      // Request next frame
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetLat, targetLng]);

  // Update bearing rotation smoothly in DOM
  useEffect(() => {
    if (!markerRef.current) return;
    const el = markerRef.current.getElement();
    if (el) {
      const rotateEl = el.querySelector('.train-marker-rotate');
      if (rotateEl) {
        // Find shortest angular rotation distance
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
      zIndexOffset={1000}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
        <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }}>
          <div>{trainName}</div>
          <div style={{ fontSize: '11px', color: '#16a34a' }}>
            {speed > 0 ? `গতি: ${speed} কিমি/ঘণ্টা` : 'স্টেশনে অবস্থান করছে'}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
};

export default React.memo(SmoothTrainMarker);
