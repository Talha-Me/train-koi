import React, { useState, useEffect, useRef } from 'react';

// বাংলা সংখ্যা কনভার্টার
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

/**
 * ওয়েব অডিও এপিআই দিয়ে অ্যালার্ম সাউন্ড জেনারেটর (কোনো এক্সটার্নাল ফাইলের প্রয়োজন নেই)
 */
class AlarmAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.intervalId = null;
    this.isPlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playChime() {
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // তিন-টোন মিষ্টি রেলওয়ে কাইম (D5 -> F#5 -> A5)
    const notes = [587.33, 739.99, 880.00];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.6);
    });
  }

  startRinging() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.playChime();
    this.intervalId = setInterval(() => {
      this.playChime();
    }, 1800);
  }

  stopRinging() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isPlaying = false;
  }
}

export const alarmAudioPlayer = new AlarmAudioPlayer();

/**
 * StationAlarmModal
 * Inspired by BD Train Tracking's StationAlarmSheet & StationAlarmRingActivity.
 */
const StationAlarmModal = ({
  isOpen,
  onClose,
  scheduleData = [],
  currentAlarm,
  onSaveAlarm,
  onCancelAlarm,
  isRinging = false,
  onDismissRing,
  onSnoozeRing,
  currentDistanceKm = null
}) => {
  const defaultStation = scheduleData.length > 0 
    ? (scheduleData[scheduleData.length - 1]?.name || scheduleData[scheduleData.length - 1]?.station || '')
    : '';

  const [selectedStation, setSelectedStation] = useState(
    currentAlarm?.stationName || defaultStation
  );
  const [leadDistanceKm, setLeadDistanceKm] = useState(currentAlarm?.leadDistanceKm || 10);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);

  // অটো-সিলেক্ট যদি কোনো অ্যালার্ম সক্রিয় না থাকে
  useEffect(() => {
    if (!currentAlarm && scheduleData.length > 0 && !selectedStation) {
      const last = scheduleData[scheduleData.length - 1];
      setSelectedStation(last.name || last.station || '');
    }
  }, [scheduleData, currentAlarm]);

  // ওয়েক লক হ্যান্ডলিং
  useEffect(() => {
    if (currentAlarm && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(lock => {
        wakeLockRef.current = lock;
        setWakeLockActive(true);
      }).catch(err => {
        console.warn('Screen WakeLock error:', err);
      });
    }

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
        setWakeLockActive(false);
      }
    };
  }, [currentAlarm]);

  if (!isOpen && !isRinging) return null;

  // টেস্ট সাউন্ড বাজানোর ফাংশন
  const handleTestSound = () => {
    alarmAudioPlayer.playChime();
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleSave = () => {
    if (!selectedStation) return;
    alarmAudioPlayer.init(); // ইউজার ইন্টারেকশনে অডিও কনটেক্সট সক্রিয় করা

    // ব্যাকগ্রাউন্ড নোটিফিকেশন পারমিশন
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        Notification.requestPermission();
      } catch (e) {}
    }

    const matchedStop = scheduleData.find(s => (s.name || s.station) === selectedStation);

    onSaveAlarm({
      stationName: selectedStation,
      leadDistanceKm: Number(leadDistanceKm),
      coords: matchedStop?.coords || null,
      createdAt: Date.now()
    });
    onClose();
  };

  // =========================================================================
  // অ্যালার্ম বাজার স্ক্রিন (Full-Screen Alarm Ringing View)
  // =========================================================================
  if (isRinging) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle, #b91c1c 0%, #7f1d1d 100%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#ffffff',
        textAlign: 'center',
        animation: 'pulseBg 1.5s infinite alternate'
      }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          marginBottom: '20px',
          boxShadow: '0 0 35px rgba(255, 255, 255, 0.4)',
          animation: 'bounce 0.8s infinite alternate'
        }}>
          ⏰
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          ঘুম থেকে উঠুন!
        </h2>
        <p style={{ fontSize: '18px', color: '#fecaca', margin: '0 0 24px', fontWeight: '700' }}>
          আপনি গন্তব্য স্টেশন <span style={{ color: '#ffffff', textDecoration: 'underline' }}>{currentAlarm?.stationName}</span>-এর সন্নিকটে এসে পড়েছেন!
        </p>

        {currentDistanceKm !== null && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '12px 24px',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: '800',
            marginBottom: '32px'
          }}>
            📍 অবশিষ্ট দূরত্ব: প্রায় {toBn(Math.round(currentDistanceKm))} কিমি
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
          <button
            onClick={onDismissRing}
            style={{
              background: '#ffffff',
              color: '#991b1b',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              transition: 'transform 0.15s ease'
            }}
          >
            ✓ অ্যালার্ম বন্ধ করুন
          </button>

          <button
            onClick={onSnoozeRing}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              padding: '14px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            💤 ৫ মিনিট পর আবার বাজান (স্নুজ)
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-12px); }
          }
          @keyframes pulseBg {
            from { opacity: 0.96; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // =========================================================================
  // অ্যালার্ম কনফিগারেশন মডাল (Setup Modal)
  // =========================================================================
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* মডাল হেডার */}
        <div style={{
          background: 'linear-gradient(135deg, #006a4e 0%, #004d38 100%)',
          color: '#ffffff',
          padding: '20px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>⏰</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#ffffff' }}>
                স্টেশন অ্যালার্ম (Wake-up Alarm)
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#a7f3d0' }}>
                গন্তব্যে পৌঁছানোর পূর্বে সময়মতো সতর্কবার্তা পান
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* কনফিগারেশন ফর্ম */}
        <div style={{ padding: '22px' }}>
          {/* স্টেশন বাছাই */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#334155', marginBottom: '8px' }}>
              📍 কোন স্টেশনের জন্য অ্যালার্ম বাজবে?
            </label>
            <select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                fontSize: '15px',
                fontWeight: '700',
                color: '#0f172a',
                outline: 'none',
                background: '#f8fafc'
              }}
            >
              {scheduleData.map((stop, idx) => {
                const stName = stop.name || stop.station || '';
                const cleanName = stName.split('(')[0].trim();
                const isFinal = idx === scheduleData.length - 1;
                return (
                  <option key={idx} value={stName}>
                    {isFinal ? `🏁 ${cleanName} (সর্বশেষ গন্তব্য)` : `${toBn(idx + 1)}. ${cleanName}`}
                  </option>
                );
              })}
            </select>
          </div>

          {/* দূরত্বের সীমানা */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: '#334155', marginBottom: '8px' }}>
              📏 কত দূরত্ব পূর্বে সতর্কবার্তা চান?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { label: '৫ কিমি পূর্বে', val: 5 },
                { label: '১০ কিমি পূর্বে', val: 10 },
                { label: '১৫ কিমি পূর্বে', val: 15 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setLeadDistanceKm(opt.val)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '10px',
                    border: leadDistanceKm === opt.val ? '2px solid #006a4e' : '1.5px solid #e2e8f0',
                    background: leadDistanceKm === opt.val ? '#ecfdf5' : '#ffffff',
                    color: leadDistanceKm === opt.val ? '#006a4e' : '#475569',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ডিভাইস টেস্ট ও ইনফো বক্স */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#334155' }}>
                🔊 সাউন্ড ও ভাইব্রেশন টেস্ট
              </span>
              <button
                type="button"
                onClick={handleTestSound}
                style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                টেস্ট বাজান 🔔
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
              অ্যালার্ম কার্যকর রাখতে ফোনের ভলিউম বাড়িয়ে রাখুন এবং ট্র্যাকিং পেজটি সচল রাখুন।
            </p>
          </div>

          {/* অ্যাকশন বাটনসমূহ */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {currentAlarm && (
              <button
                type="button"
                onClick={() => {
                  onCancelAlarm();
                  onClose();
                }}
                style={{
                  flex: 1,
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                অ্যালার্ম মুছুন
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              style={{
                flex: 2,
                background: '#006a4e',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 106, 78, 0.3)'
              }}
            >
              {currentAlarm ? 'অ্যালার্ম আপডেট করুন' : '⏰ অ্যালার্ম সেট করুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationAlarmModal;
