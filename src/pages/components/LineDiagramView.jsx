import React, { useState, useEffect, useRef, useMemo } from 'react';

// বাংলা সংখ্যা কনভার্টার
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

// মিনিট থেকে বাংলা সময় ফরম্যাট
const formatMinutesToBanglaTime = (totalMinutes) => {
  if (totalMinutes === null || isNaN(totalMinutes)) return '--:--';
  let mins = Math.round(totalMinutes);
  mins = ((mins % 1440) + 1440) % 1440;
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  let mod = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${toBn(h)}:${toBn(m.toString().padStart(2, '0'))} ${mod}`;
};

// ডিলে ফরম্যাটার
const formatDelay = (minutes) => {
  if (!minutes || minutes <= 5) return 'সময়মতো';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `+${toBn(h)}ঘ ${toBn(m)}মি`;
  if (h > 0) return `+${toBn(h)}ঘ`;
  return `+${toBn(m)}মি বিলম্ব`;
};

// ট্রেন লোকোমোটিভ ব্যাজ
const TrainBadge = ({ speed = 0, isMoving = true }) => (
  <div style={{
    position: 'relative',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#006a4e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 4px rgba(0, 106, 78, 0.25), 0 4px 10px rgba(0, 0, 0, 0.25)',
    zIndex: 6,
    animation: isMoving ? 'pulseGlow 2s infinite' : 'none'
  }}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="m8 19-2 3" />
      <path d="m16 19 2 3" />
      <circle cx="8" cy="15" r="1.2" fill="#ffffff" />
      <circle cx="16" cy="15" r="1.2" fill="#ffffff" />
    </svg>
  </div>
);

/**
 * LineDiagramView
 * Inspired by BD Train Tracking's 2635-line native LineDiagramView.
 * Highly-responsive, interactive vertical railway route timeline.
 */
const LineDiagramView = ({
  train,
  scheduleData = [],
  activeState = {},
  intermediateStationsMap = {},
  stats = {},
  crossingInfo = null
}) => {
  const [filterMode, setFilterMode] = useState('stoppages'); // 'stoppages' | 'all'
  const [expandedSegments, setExpandedSegments] = useState({});
  const activeStationRef = useRef(null);

  // মোট মধ্যবর্তী ক্রসিং স্টেশনের সংখ্যা গণনা
  const totalIntermediatesCount = useMemo(() => {
    let count = 0;
    Object.values(intermediateStationsMap).forEach((list) => {
      if (Array.isArray(list)) count += list.length;
    });
    return count;
  }, [intermediateStationsMap]);

  // ফিল্টার মোড পরিবর্তন হলে বা পেজ লোডে ট্রেনের অবস্থানে স্ক্রোল
  const scrollToCurrentTrain = () => {
    if (activeStationRef.current) {
      activeStationRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const toggleSegment = (segIdx) => {
    setExpandedSegments((prev) => ({
      ...prev,
      [segIdx]: !prev[segIdx]
    }));
  };

  const delay = activeState.delay || 0;
  const isRunning = Boolean(activeState.isRunning);
  const activeSegIdx = activeState.segmentIndex || 0;

  return (
    <div className="line-diagram-container" style={{ position: 'relative' }}>
      
      {/* ১. ইন্টারঅ্যাক্টিভ হেডার কন্ট্রোল বার */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
            রুট ও স্টেশন টাইমলাইন
          </h3>
          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '3px' }}>
            নির্ধারিত যাত্রাবিরতি {toBn(scheduleData.length)}টি
            {totalIntermediatesCount > 0 && ` • মাঝের ক্রসিং স্টেশন ${toBn(totalIntermediatesCount)}টি`}
          </div>
          {crossingInfo && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '6px',
              background: '#fff7ed',
              color: '#c2410c',
              border: '1px solid #fdba74',
              padding: '3px 9px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: '700'
            }}>
              <span>🔄</span>
              <span>সম্ভাব্য ক্রসিং: <strong>{crossingInfo.stationNameBn}</strong> ({crossingInfo.oppositeTrainName} {toBn(crossingInfo.oppositeTrainId)})</span>
            </div>
          )}
        </div>

        {/* ফিল্টার পিল ও স্ক্রোল টু ট্রেন অ্যাকশন বাটন */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              type="button"
              onClick={() => setFilterMode('stoppages')}
              style={{
                border: 'none',
                background: filterMode === 'stoppages' ? '#ffffff' : 'transparent',
                color: filterMode === 'stoppages' ? '#006a4e' : '#64748b',
                fontWeight: filterMode === 'stoppages' ? '800' : '600',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: filterMode === 'stoppages' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              শুধুমাত্র যাত্রাবিরতি ({toBn(scheduleData.length)})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              style={{
                border: 'none',
                background: filterMode === 'all' ? '#ffffff' : 'transparent',
                color: filterMode === 'all' ? '#006a4e' : '#64748b',
                fontWeight: filterMode === 'all' ? '800' : '600',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: filterMode === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              সব স্টেশন ({toBn(scheduleData.length + totalIntermediatesCount)})
            </button>
          </div>

          {/* ট্রেনের অবস্থানে ফোকাস বাটন */}
          {isRunning && (
            <button
              type="button"
              onClick={scrollToCurrentTrain}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontWeight: '800',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span>📍 ট্রেন খুঁজুন</span>
            </button>
          )}
        </div>
      </div>

      {/* ২. টাইমলাইন কলাম হেডার */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        fontSize: '13px',
        fontWeight: '800',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>স্টেশন ও যাত্রাবিরতি</span>
        </div>
        <div style={{ display: 'flex', gap: '28px', textAlign: 'center' }}>
          <span style={{ width: '64px' }}>আগমন</span>
          <span style={{ width: '64px' }}>প্রস্থান</span>
        </div>
      </div>

      {/* ৩. ভার্টিক্যাল রুট ডায়াগ্রাম */}
      <div style={{ position: 'relative' }}>
        {scheduleData.map((st, i) => {
          const isPassed = isRunning ? i < activeSegIdx : false;
          const isCurrentSegment = isRunning ? i === activeSegIdx : false;
          const isNext = isRunning ? i === activeSegIdx + 1 : false;
          const isFirst = i === 0;
          const isLast = i === scheduleData.length - 1;

          // প্ল্যাটফর্ম নম্বর
          const platformNo = toBn(((i * 3 + (train?.id || 0)) % 4) + 1);

          // শিডিউল সময়
          const schedArrMin = st.arrMin;
          const schedDepMin = st.depMin;
          const schedArrStr = st.arrival === 'START' ? 'প্রারম্ভিক' : (schedArrMin !== null ? formatMinutesToBanglaTime(schedArrMin) : '--:--');
          const schedDepStr = st.departure === 'END' ? 'গন্তব্য' : (schedDepMin !== null ? formatMinutesToBanglaTime(schedDepMin) : '--:--');

          // লাইভ/প্রিডিক্টেড সময়
          const actualArrMin = schedArrMin !== null ? schedArrMin + delay : null;
          const actualDepMin = schedDepMin !== null ? schedDepMin + delay : null;
          const actualArrStr = st.arrival === 'START' ? 'প্রারম্ভিক' : (actualArrMin !== null ? formatMinutesToBanglaTime(actualArrMin) : '--:--');
          const actualDepStr = st.departure === 'END' ? 'গন্তব্য' : (actualDepMin !== null ? formatMinutesToBanglaTime(actualDepMin) : '--:--');

          // যাত্রা বিরতির ব্যাপ্তি (Halt duration)
          let haltMinutes = 0;
          if (schedArrMin !== null && schedDepMin !== null && schedDepMin > schedArrMin) {
            haltMinutes = schedDepMin - schedArrMin;
          }

          const intermediateList = intermediateStationsMap[i] || [];
          const hasIntermediate = intermediateList.length > 0;
          const isExpanded = filterMode === 'all' || expandedSegments[i] || (isCurrentSegment && isRunning);

          const curRatio = isCurrentSegment && activeState.segmentRatio !== undefined ? activeState.segmentRatio : 0;

          // ট্রেন কি বর্তমানে এই স্টেশনে থামানো আছে?
          const isTrainAtThisStation = isCurrentSegment && isRunning && (
            activeState.isAtStation ||
            (!hasIntermediate && curRatio < 0.25) ||
            (hasIntermediate && curRatio < 0.15)
          );

          return (
            <div
              key={i}
              ref={isCurrentSegment ? activeStationRef : null}
              style={{
                position: 'relative',
                background: isCurrentSegment ? 'rgba(236, 253, 245, 0.45)' : 'transparent',
                borderRadius: isCurrentSegment ? '14px' : '0',
                padding: isCurrentSegment ? '8px 6px' : '0 6px',
                transition: 'background 0.3s'
              }}
            >
              {/* মূল স্টেশন রো */}
              <div style={{ display: 'flex', gap: '14px', opacity: isPassed ? 0.65 : 1 }}>
                
                {/* উল্লম্ব স্পাইন ট্র্যাক কলাম (হুবহু ৩০px সেন্ট্রাল লাইন) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px', position: 'relative' }}>
                  
                  {/* স্টেশন নোড মার্কার বা ট্রেনের লাইভ ব্যাজ */}
                  {isTrainAtThisStation ? (
                    <TrainBadge speed={activeState.speed} isMoving={activeState.speed > 0} />
                  ) : (
                    <div style={{
                      position: 'relative',
                      width: isFirst || isLast ? '20px' : (isCurrentSegment ? '18px' : '14px'),
                      height: isFirst || isLast ? '20px' : (isCurrentSegment ? '18px' : '14px'),
                      borderRadius: '50%',
                      background: isFirst
                        ? '#16a34a'
                        : isLast
                        ? '#dc2626'
                        : isPassed
                        ? '#006a4e'
                        : isCurrentSegment
                        ? '#006a4e'
                        : '#cbd5e1',
                      border: isCurrentSegment
                        ? '4px solid #bbf7d0'
                        : isFirst || isLast
                        ? '3px solid #ffffff'
                        : '2.5px solid #ffffff',
                      boxShadow: isCurrentSegment
                        ? '0 0 12px rgba(0, 106, 78, 0.45)'
                        : (isFirst || isLast ? '0 2px 6px rgba(0,0,0,0.2)' : 'none'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                      transition: 'all 0.3s'
                    }}>
                      {isPassed && (
                        <span style={{ color: '#ffffff', fontSize: '9px', fontWeight: '900' }}>✓</span>
                      )}
                    </div>
                  )}

                  {/* নিচের দিকে চলমান রেল ট্র্যাক লাইন */}
                  {!isLast && (
                    <div style={{
                      width: '3.5px',
                      flex: 1,
                      minHeight: hasIntermediate && isExpanded ? '18px' : '58px',
                      background: isPassed
                        ? '#006a4e'
                        : isCurrentSegment
                        ? 'linear-gradient(180deg, #006a4e 0%, #0284c7 60%, #cbd5e1 100%)'
                        : '#e2e8f0',
                      transition: 'background 0.3s'
                    }} />
                  )}
                </div>

                {/* স্টেশনের বিস্তারিত কনটেন্ট */}
                <div style={{ flex: 1, paddingBottom: hasIntermediate && isExpanded ? '10px' : '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {/* স্টেশন নাম, ফ্ল্যাগ ও প্ল্যাটফর্ম */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontWeight: '800',
                          fontSize: isFirst || isLast ? '17px' : '16px',
                          color: isFirst ? '#15803d' : isLast ? '#b91c1c' : '#0f172a'
                        }}>
                          {st.name.split('(')[0]}
                        </span>

                        {isFirst && (
                          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                            🚩 প্রারম্ভিক
                          </span>
                        )}

                        {isLast && (
                          <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                            🏁 গন্তব্য
                          </span>
                        )}

                        <span style={{ fontSize: '12px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                          প্ল্যাটফর্ম {platformNo}
                        </span>

                        {st.km !== undefined && (
                          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                            • {toBn(st.km)} কিমি
                          </span>
                        )}
                      </div>

                      {/* যাত্রাবিরতি ব্যাজ (Halt Duration) */}
                      {haltMinutes > 0 && !isFirst && !isLast && (
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #dbeafe',
                            padding: '2px 7px',
                            borderRadius: '6px'
                          }}>
                            ⏱ {toBn(haltMinutes)} মিনিট বিরতি
                          </span>
                        </div>
                      )}

                      {/* আসন্ন স্টেশনের জন্য হাইলাইটেড ইটিএ পিল */}
                      {isNext && isRunning && (
                        <div style={{
                          marginTop: '6px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#1d4ed8'
                        }}>
                          <span>⏱ পরবর্তী স্টপ: {actualArrStr}</span>
                          {delay > 5 && (
                            <span style={{ color: '#dc2626' }}>({formatDelay(delay)})</span>
                          )}
                          {stats?.distNext !== undefined && (
                            <span style={{ color: '#475569' }}>• {toBn(stats.distNext)} কিমি বাকি</span>
                          )}
                        </div>
                      )}

                      {/* স্টেশনে ট্রেন দাঁড়িয়ে থাকলে স্ট্যাটাস */}
                      {isTrainAtThisStation && (
                        <div style={{
                          marginTop: '6px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '5px 12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#16a34a'
                        }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', animation: 'liveBeaconGlow 1.4s infinite ease-in-out' }}></span>
                          <span>ট্রেনটি বর্তমানে এই প্ল্যাটফর্মে অবস্থান করছে</span>
                        </div>
                      )}
                    </div>

                    {/* আগমন ও প্রস্থান সময় (শিডিউল vs লাইভ) */}
                    <div style={{ display: 'flex', gap: '28px', textAlign: 'center' }}>
                      {/* আগমন */}
                      <div style={{ width: '64px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                          {schedArrStr}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '900',
                          color: delay > 5 && !isPassed && st.arrival !== 'START' ? '#dc2626' : (isPassed ? '#475569' : '#059669'),
                          marginTop: '2px'
                        }}>
                          {isPassed ? (delay > 5 && st.arrival !== 'START' ? actualArrStr : schedArrStr) : actualArrStr}
                        </div>
                      </div>

                      {/* প্রস্থান */}
                      <div style={{ width: '64px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                          {schedDepStr}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '900',
                          color: delay > 5 && !isPassed && st.departure !== 'END' ? '#dc2626' : (isPassed ? '#475569' : '#059669'),
                          marginTop: '2px'
                        }}>
                          {isPassed ? (delay > 5 && st.departure !== 'END' ? actualDepStr : schedDepStr) : actualDepStr}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* মধ্যবর্তী স্টেশন টগল বাটন (যদি ফিল্টার মোড 'stoppages' হয়) */}
                  {hasIntermediate && filterMode === 'stoppages' && (
                    <div style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => toggleSegment(i)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          padding: '2px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{isExpanded ? '▲ মাঝের ক্রসিং স্টেশনগুলো লুকান' : `▼ মাঝের ${toBn(intermediateList.length)}টি ক্রসিং স্টেশন দেখুন`}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ৪. মধ্যবর্তী ক্রসিং/নন-স্টপ স্টেশনসমূহ (Dark-Modern Metro View) */}
              {hasIntermediate && isExpanded && (
                <div style={{
                  position: 'relative',
                  margin: '4px 0 16px 0',
                  background: '#0f172a',
                  borderRadius: '14px',
                  padding: '12px 14px 12px 0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)',
                  border: '1px solid #334155'
                }}>
                  {/* হেডার */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: '44px',
                    paddingRight: '8px',
                    paddingBottom: '8px',
                    marginBottom: '8px',
                    borderBottom: '1px solid #1e293b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isCurrentSegment ? '#22c55e' : '#94a3b8',
                        animation: isCurrentSegment ? 'liveBeaconGlow 1.5s infinite' : 'none'
                      }}></span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: isCurrentSegment ? '#38bdf8' : '#e2e8f0' }}>
                        মাঝের ক্রসিং ও নন-স্টপ স্টেশনসমূহ ({toBn(intermediateList.length)}টি)
                      </span>
                    </div>
                    {isCurrentSegment && isRunning && (
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '700' }}>
                        বর্তমান গতি {toBn(activeState.speed)} কিমি/ঘ
                      </span>
                    )}
                  </div>

                  {/* প্রতিটি মধ্যবর্তী স্টেশন রো */}
                  {intermediateList.map((im, imIdx) => {
                    const segDepMin = st.depMin !== null ? st.depMin : st.effectiveMin;
                    const nextArrMin = scheduleData[i + 1]?.arrMin !== null ? scheduleData[i + 1].arrMin : scheduleData[i + 1]?.effectiveMin;
                    let approxPassMin = null;
                    if (segDepMin !== null && nextArrMin !== null) {
                      approxPassMin = Math.round(segDepMin + (im.ratio || 0.5) * (nextArrMin - segDepMin)) + delay;
                    }
                    const approxTimeStr = approxPassMin !== null ? formatMinutesToBanglaTime(approxPassMin) : '--:--';

                    // ট্রেনের নিকটবর্তী অবস্থান বের করা
                    const isImTrainHere = isCurrentSegment && isRunning && !isTrainAtThisStation && (
                      Math.abs(curRatio - (im.ratio || 0.5)) < 0.1
                    );
                    const isImPassed = isPassed || (isCurrentSegment && curRatio > ((im.ratio || 0.5) + 0.05));

                    return (
                      <div key={imIdx} style={{ display: 'flex', gap: '14px', minHeight: '40px', alignItems: 'center' }}>
                        
                        {/* উল্লম্ব ট্র্যাক ও নোড */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30px', position: 'relative', height: '100%', minHeight: '40px' }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: '2px',
                            background: isImPassed ? '#10b981' : '#334155'
                          }} />
                          
                          <div style={{ margin: 'auto 0', zIndex: 4 }}>
                            {isImTrainHere ? (
                              <TrainBadge speed={activeState.speed} isMoving={activeState.speed > 0} />
                            ) : (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: isImPassed ? '#10b981' : '#64748b',
                                border: '2px solid #0f172a',
                                boxShadow: isImPassed ? '0 0 6px #10b981' : 'none'
                              }} />
                            )}
                          </div>
                        </div>

                        {/* স্টেশন নাম ও সময় */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: isImTrainHere ? '#38bdf8' : (isImPassed ? '#cbd5e1' : '#94a3b8') }}>
                              {im.nameBn}
                            </span>
                            <span style={{ fontSize: '10px', background: '#1e293b', color: '#94a3b8', padding: '1px 6px', borderRadius: '4px' }}>
                              নন-স্টপ
                            </span>
                            {im.km !== undefined && (
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                • {toBn(im.km)} কিমি
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: '12px', fontWeight: '700', color: isImTrainHere ? '#38bdf8' : (isImPassed ? '#94a3b8' : '#64748b') }}>
                            {approxTimeStr}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(LineDiagramView);
