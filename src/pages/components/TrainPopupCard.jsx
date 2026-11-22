import React from 'react';
import { useNavigate } from 'react-router-dom';

// বাংলা সংখ্যা কনভার্টার
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

/**
 * TrainPopupCard
 * Inspired by BD Train Tracking's showTrainPopup.
 * Interactive details sheet shown on the map when a crossing/opposite train is tapped.
 */
const TrainPopupCard = ({
  train,
  trainState,
  distanceFromUserTrainKm = null,
  isOpposite = false,
  onClose
}) => {
  const navigate = useNavigate();
  if (!train) return null;

  const trainName = train.name.split('(')[0].trim();
  const speed = trainState?.speed || 0;
  const isMoving = speed > 5;
  const lastSeenText = trainState?.lastSeen !== undefined && trainState?.lastSeen !== null
    ? (trainState.lastSeen === 0 ? 'এইমাত্র লাইভ' : `${toBn(trainState.lastSeen)} মিনিট আগে`)
    : 'সময়সূচী অনুযায়ী সচল';

  const handleTrackClick = () => {
    navigate(`/track/${train.id}`);
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        maxWidth: '430px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '18px',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.08)',
        border: isOpposite ? '2px solid #ea580c' : '2px solid #4f46e5',
        zIndex: 1100,
        padding: '16px 18px',
        animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto'
      }}
    >
      {/* হেডার: নাম, ব্যাজ ও ক্লোজ বাটন */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px' }}>🚆</span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>
              {trainName}
            </span>
            <span style={{
              background: isOpposite ? '#ffedd5' : '#e0e7ff',
              color: isOpposite ? '#c2410c' : '#4338ca',
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '8px',
              border: `1px solid ${isOpposite ? '#fdba74' : '#a5b4fc'}`
            }}>
              {isOpposite ? '🔄 বিপরীত অভিমুখ' : '🚆 সচল ট্রেন'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#64748b' }}>
              ({toBn(train.id)})
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px', fontWeight: '600' }}>
            {train.from} ➔ {train.to}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#64748b',
            flexShrink: 0
          }}
          title="বন্ধ করুন"
        >
          ✕
        </button>
      </div>

      {/* ইনফো গ্রিড */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '10px 12px',
        marginBottom: '14px',
        border: '1px solid #e2e8f0'
      }}>
        {/* গতি */}
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>বর্তমান গতি</div>
          <div style={{ fontSize: '13.5px', fontWeight: '900', color: isMoving ? '#16a34a' : '#64748b', marginTop: '2px' }}>
            {isMoving ? `${toBn(speed)} কিমি/ঘ` : 'স্টপ/হল্ট'}
          </div>
        </div>

        {/* আপেক্ষিক দূরত্ব */}
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>আপনার থেকে</div>
          <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
            {distanceFromUserTrainKm !== null ? `${toBn(Math.round(distanceFromUserTrainKm))} কিমি` : '—'}
          </div>
        </div>

        {/* স্ট্যাটাস বা লাস্ট সিন */}
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>তথ্য আপডেট</div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#0284c7', marginTop: '2px' }}>
            {lastSeenText}
          </div>
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={handleTrackClick}
          style={{
            flex: 1,
            background: isOpposite ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span>🔍 এই ট্রেনটি সরাসরি ট্র্যাক করুন</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(TrainPopupCard);
