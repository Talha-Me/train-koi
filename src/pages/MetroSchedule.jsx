import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, TrainFront, Info, CalendarX } from 'lucide-react';

const MetroSchedule = () => {
  const navigate = useNavigate();

  const scheduleData = [
    { direction: 'উত্তরা উত্তর ➔ মতিঝিল', firstTrain: '০৭:১০ AM', lastTrain: '০৮:৩৩ PM', peak: '০৭:৩১ AM - ১১:৩৬ AM' },
    { direction: 'মতিঝিল ➔ উত্তরা উত্তর', firstTrain: '০৭:৩০ AM', lastTrain: '০৯:১২ PM', peak: '০২:০১ PM - ০৮:০০ PM' },
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)', 
        padding: '20px', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button 
          onClick={() => navigate('/metro-rail')}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '8px', color: 'white' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>মেট্রো সময়সূচী</h1>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Weekly Off-Day Alert */}
        <div style={{ 
          backgroundColor: '#fff5f5', 
          border: '1px solid #feb2b2', 
          padding: '15px', 
          borderRadius: '16px', 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '20px' 
        }}>
          <CalendarX size={24} color="#e53e3e" />
          <div>
            <span style={{ fontWeight: 'bold', color: '#c53030', display: 'block', fontSize: '14px' }}>শুক্রবার বন্ধ</span>
            <span style={{ color: '#c53030', fontSize: '12px' }}>মেট্রো রেল প্রতি শুক্রবার সাপ্তাহিক রক্ষণাবেক্ষণের জন্য বন্ধ থাকে।</span>
          </div>
        </div>

        {/* Quick Summary Cards */}
        {scheduleData.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            borderRadius: '24px', 
            padding: '20px', 
            marginBottom: '20px', 
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            border: '1px solid #edf2f7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <TrainFront size={20} color="#008352" />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#2d3748' }}>{item.direction}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ backgroundColor: '#f0fff4', padding: '12px', borderRadius: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#2f855a', fontWeight: 'bold', display: 'block' }}>প্রথম ট্রেন</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#22543d' }}>{item.firstTrain}</span>
              </div>
              <div style={{ backgroundColor: '#fffaf0', padding: '12px', borderRadius: '15px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#c05621', fontWeight: 'bold', display: 'block' }}>শেষ ট্রেন</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#7b341e' }}>{item.lastTrain}</span>
              </div>
            </div>

            <div style={{ marginTop: '15px', padding: '10px', borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} color="#718096" />
                <span style={{ fontSize: '12px', color: '#718096' }}>পিক আওয়ার:</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2d3748' }}>{item.peak}</span>
            </div>
          </div>
        ))}

        {/* Headway Info */}
        <div style={{ 
          backgroundColor: '#ebf8ff', 
          borderRadius: '20px', 
          padding: '15px', 
          display: 'flex', 
          gap: '12px' 
        }}>
          <Info size={24} color="#3182ce" />
          <div style={{ fontSize: '13px', color: '#2a4365', lineHeight: '1.5' }}>
            <strong>ট্রেন আসার ব্যবধান:</strong><br />
            পিক আওয়ারে প্রতি <b>৮ মিনিট</b> পরপর এবং অফ-পিক আওয়ারে প্রতি <b>১০-১২ মিনিট</b> পরপর ট্রেন পাওয়া যায়।
          </div>
        </div>

        {/* SEO Text Section */}
        <div style={{ marginTop: '30px', padding: '10px', textAlign: 'justify' }}>
          <h4 style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>ঢাকা মেট্রো রেল সময়সূচী সম্পর্কে বিস্তারিত:</h4>
          <p style={{ fontSize: '12px', color: '#718096', lineHeight: '1.6', margin: 0 }}>
            বর্তমানে ঢাকা মেট্রো রেল (MRT Line-6) উত্তরা উত্তর থেকে মতিঝিল পর্যন্ত ১৬টি স্টেশনে বিরতি দিয়ে নিয়মিত চলাচল করছে। 
            ভোরে চলাচলের শুরু থেকে রাত পর্যন্ত নির্দিষ্ট সময় পরপর ট্রেন ছেড়ে যায়। সরকারি ছুটির দিনগুলোতে সময়সূচী কিছুটা পরিবর্তিত হতে পারে।
          </p>
        </div>

      </div>
    </div>
  );
};

export default MetroSchedule;