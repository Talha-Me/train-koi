import React, { useState } from 'react';

// বাংলা সংখ্যা কনভার্টার
const toBn = (num) => {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => bnDigits[parseInt(d, 10)]);
};

/**
 * ডিফল্ট কোচ রেক জেনারেটর (বাংলাদেশ রেলওয়ের ইন্টারসিটি ট্রেনের স্ট্যান্ডার্ড ফর্মেশন)
 */
const getTrainRakeComposition = (trainId, trainProfile) => {
  // যদি প্রোফাইলে সুনির্দিষ্ট তালিকা থাকে, সেটা অনুযায়ী বা সাধারণ স্ট্যান্ডার্ড ১৬-বগির ফরমেশন তৈরি
  const baseCoaches = [
    { code: 'ENG', name: 'ইঞ্জিন (Loco)', type: 'engine', class: 'লোকোমোটিভ', seats: null, position: 'ইঞ্জিন প্রান্ত' },
    { code: 'PWR', name: 'পাওয়ার কার', type: 'power', class: 'বিদ্যুৎ জেনারেটর ও লাগেজ', seats: null, position: 'ইঞ্জিন সংলগ্ন' },
    { code: 'ক', name: 'বগি: ক', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'প্ল্যাটফর্মের সামনের দিক' },
    { code: 'খ', name: 'বগি: খ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'প্ল্যাটফর্মের সামনের দিক' },
    { code: 'গ', name: 'বগি: গ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'প্ল্যাটফর্মের মাঝামাঝি' },
    { code: 'ঘ', name: 'বগি: ঘ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'প্ল্যাটফর্মের মাঝামাঝি' },
    { code: 'ঙ', name: 'বগি: ঙ (খাবার বগি)', type: 'buffet', class: 'শোভন চেয়ার ও ক্যাটারিং', seats: 60, layout: '3x2', ac: false, position: 'মাঝামাঝি অংশ (খাবার বগি)' },
    { code: 'চ', name: 'বগি: চ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'প্ল্যাটফর্মের মাঝামাঝি' },
    { code: 'ছ', name: 'বগি: ছ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'মাঝামাঝি থেকে পেছনের দিক' },
    { code: 'জ', name: 'বগি: জ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'প্ল্যাটফর্মের পেছনের দিক' },
    { code: 'ঝ', name: 'বগি: ঝ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'প্ল্যাটফর্মের পেছনের দিক' },
    { code: 'ঞ', name: 'বগি: ঞ', type: 'ac_cabin', class: 'এসি বার্থ / কেবিন', seats: 48, layout: 'বার্থ', ac: true, position: 'প্ল্যাটফর্মের পেছনের দিক' },
    { code: 'ট', name: 'বগি: ট', type: 'guard', class: 'শোভন ও গার্ড ভ্যান', seats: 60, layout: '3x2', ac: false, position: 'ট্রেনের একদম শেষ প্রান্ত' }
  ];

  // সুবর্ণ (701/702) ও সোনার বাংলা (787/788) সম্পূর্ণ এসি ও প্রিমিয়াম শোভন চেয়ার
  if (trainId === 701 || trainId === 702 || trainId === 787 || trainId === 788) {
    return [
      { code: 'ENG', name: 'ইঞ্জিন (WDP-4B)', type: 'engine', class: 'উচ্চগতির ব্রডগেজ লোকোমোটিভ', seats: null, position: 'ইঞ্জিন প্রান্ত' },
      { code: 'PWR', name: 'পাওয়ার কার', type: 'power', class: 'জেনারেটর ভ্যান', seats: null, position: 'ইঞ্জিন সংলগ্ন' },
      { code: 'ক', name: 'বগি: ক', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'সামনের অংশ' },
      { code: 'খ', name: 'বগি: খ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'সামনের অংশ' },
      { code: 'গ', name: 'বগি: গ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'সামনের অংশ' },
      { code: 'ঘ', name: 'বগি: ঘ', type: 'snigdha', class: 'স্নিগ্ধা (এসি চেয়ার)', seats: 75, layout: '2x2', ac: true, position: 'মাঝামাঝি অংশ' },
      { code: 'ঙ', name: 'বগি: ঙ (প্যান্ট্রি)', type: 'buffet', class: 'খাবার বগি ও কিচেন', seats: 40, layout: '2x2', ac: true, position: 'মাঝামাঝি অংশ' },
      { code: 'চ', name: 'বগি: চ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'মাঝামাঝি অংশ' },
      { code: 'ছ', name: 'বগি: ছ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'পেছনের দিক' },
      { code: 'জ', name: 'বগি: জ', type: 'shovon', class: 'শোভন চেয়ার', seats: 105, layout: '3x2', ac: false, position: 'পেছনের দিক' },
      { code: 'ঝ', name: 'বগি: ঝ', type: 'guard', class: 'গার্ড ব্রেক ভ্যান', seats: 50, layout: '3x2', ac: false, position: 'শেষ প্রান্ত' }
    ];
  }

  return baseCoaches;
};

const CoachPositionView = ({ train, profile }) => {
  const coaches = getTrainRakeComposition(train?.id, profile);
  const [selectedCoach, setSelectedCoach] = useState(coaches.find(c => c.type !== 'engine') || coaches[1]);

  const getTypeStyle = (type, isSelected) => {
    switch (type) {
      case 'engine':
        return {
          bg: isSelected ? '#1e293b' : '#334155',
          border: '#0f172a',
          text: '#ffffff',
          badge: '#475569'
        };
      case 'power':
        return {
          bg: isSelected ? '#e0f2fe' : '#f0f9ff',
          border: '#0284c7',
          text: '#0369a1',
          badge: '#bae6fd'
        };
      case 'snigdha':
        return {
          bg: isSelected ? '#ecfdf5' : '#f0fdf4',
          border: '#059669',
          text: '#065f46',
          badge: '#a7f3d0'
        };
      case 'ac_cabin':
        return {
          bg: isSelected ? '#faf5ff' : '#f5f3ff',
          border: '#7c3aed',
          text: '#5b21b6',
          badge: '#ddd6fe'
        };
      case 'buffet':
        return {
          bg: isSelected ? '#fff7ed' : '#fffbeb',
          border: '#d97706',
          text: '#b45309',
          badge: '#fde68a'
        };
      case 'guard':
        return {
          bg: isSelected ? '#f1f5f9' : '#f8fafc',
          border: '#64748b',
          text: '#334155',
          badge: '#e2e8f0'
        };
      default: // shovon
        return {
          bg: isSelected ? '#eff6ff' : '#f8fafc',
          border: '#2563eb',
          text: '#1e40af',
          badge: '#bfdbfe'
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* শীর্ষ হেডার ও ব্রিফিং */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '20px 22px',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>
              রেলওয়ে প্ল্যাটফর্ম বগি অবস্থান নির্দেশিকা
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '900', color: '#ffffff' }}>
              {train?.name?.split('(')[0]} ট্রেনের বগি বিন্যাস
            </h3>
          </div>
          <span style={{
            background: 'rgba(255, 255, 255, 0.12)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: '700',
            backdropFilter: 'blur(8px)'
          }}>
            মোট {toBn(coaches.length)}টি ইউনিট
          </span>
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
          স্টেশনে ট্রেন প্রবেশের পর আপনার বগিটি প্ল্যাটফর্মের কোন প্রান্তে পড়বে তা দেখে আগে থেকেই সুবিধাজনক স্থানে দাঁড়ান।
        </p>
      </div>

      {/* অনুভূমিক ট্রেন রেক স্লাইডার (Horizontal Train Rake) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '18px',
        padding: '20px 16px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 6px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🚂 ইঞ্জিন প্রান্ত (সামনে)</span>
            <span style={{ color: '#cbd5e1' }}>──────►</span>
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
            বগিতে ট্যাপ করে বিস্তারিত দেখুন
          </span>
        </div>

        {/* ট্রেন রেক ক্যারোসেল */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '14px',
          paddingTop: '6px',
          paddingLeft: '4px',
          paddingRight: '4px',
          scrollbarWidth: 'thin'
        }}>
          {coaches.map((coach, idx) => {
            const isSelected = selectedCoach?.code === coach.code;
            const style = getTypeStyle(coach.type, isSelected);

            return (
              <button
                key={idx}
                onClick={() => setSelectedCoach(coach)}
                style={{
                  minWidth: coach.type === 'engine' ? '110px' : '82px',
                  height: '76px',
                  borderRadius: '12px',
                  border: isSelected ? `2.5px solid ${style.border}` : '1.5px solid #cbd5e1',
                  background: style.bg,
                  color: style.text,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  boxShadow: isSelected ? '0 8px 16px rgba(0, 0, 0, 0.12)' : '0 2px 4px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* কোড ব্যাজ */}
                <span style={{
                  fontSize: coach.type === 'engine' ? '18px' : '17px',
                  fontWeight: '900',
                  lineHeight: '1.2'
                }}>
                  {coach.code === 'ENG' ? '🚂 ENG' : coach.code}
                </span>

                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  marginTop: '4px',
                  opacity: 0.9,
                  maxWidth: '74px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {coach.type === 'engine' ? 'লোকোমোটিভ' : coach.class.split(' ')[0]}
                </span>

                {/* কাপলার বা চাকা ভিজ্যুয়ালাইজেশন */}
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: '14px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#64748b'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-5px',
                  right: '14px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#64748b'
                }}></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* নির্বাচিত বগির পূর্ণাঙ্গ বিবরণ কার্ড */}
      {selectedCoach && (
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1.5px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: selectedCoach.ac ? '#059669' : '#0284c7',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}>
                  {selectedCoach.code === 'ENG' ? 'লোকোমোটিভ' : `কোচ ${selectedCoach.code}`}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>
                  {selectedCoach.class}
                </span>
              </div>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>
                {selectedCoach.name}
              </h4>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: '12px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>প্ল্যাটফর্মে অবস্থান</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                📍 {selectedCoach.position}
              </div>
            </div>
          </div>

          {/* স্পেসিফিকেশন গ্রিড */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>আসন বিন্যাস</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                {selectedCoach.layout ? `${selectedCoach.layout} সিটিং` : 'প্রযোজ্য নয়'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>মোট সিট সংখ্যা</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginTop: '2px' }}>
                {selectedCoach.seats ? `${toBn(selectedCoach.seats)} টি আসন` : 'ক্যাব/পাওয়ার'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>শীতাতপ নিয়ন্ত্রণ (AC)</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: selectedCoach.ac ? '#059669' : '#475569', marginTop: '2px' }}>
                {selectedCoach.ac ? '❄️ সেন্ট্রাল এসি' : '💨 ফ্যান ও ভেন্টিলেশন'}
              </div>
            </div>
          </div>

          {/* অনবোর্ড সুযোগ সুবিধা ব্যাজ */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#334155', marginBottom: '8px' }}>
              এই বগিতে প্রাপ্ত সুবিধাসমূহ:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                🔌 মোবাইল চার্জিং সকেট
              </span>
              <span style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                🚻 আধুনিক বায়ো-টয়লেট
              </span>
              <span style={{ background: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                🧳 লাগেজ র‍্যাক
              </span>
              {selectedCoach.type === 'buffet' && (
                <span style={{ background: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                  ☕ ক্যাটারিং ও চা-নাস্তা কাউন্টার
                </span>
              )}
              {selectedCoach.ac && (
                <span style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                  🪟 অটো টিন্টেড গ্লাস উইন্ডো
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachPositionView;
