import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, TrainFront, Info, CalendarX, Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import Navbar from './components/Navbar';

const MetroSchedule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল সময়সূচী ২০২৬ (MRT Line 6) | ট্রেনকই";
    window.scrollTo(0, 0);
  }, []);

  const scheduleData = [
    { 
      direction: 'উত্তরা উত্তর ➔ মতিঝিল', 
      from: 'উত্তরা উত্তর (দিয়াবাড়ি)', 
      to: 'মতিঝিল',
      firstTrain: '০৭:১০ AM', 
      lastTrain: '০৮:৩৩ PM', 
      peak: '০৭:৩১ AM - ১১:৩৬ AM',
      offPeak: '১১:৩৭ AM - ০২:০০ PM',
      color: '#008352'
    },
    { 
      direction: 'মতিঝিল ➔ উত্তরা উত্তর', 
      from: 'মতিঝিল', 
      to: 'উত্তরা উত্তর (দিয়াবাড়ি)',
      firstTrain: '০৭:৩০ AM', 
      lastTrain: '০৯:১২ PM', 
      peak: '০২:০১ PM - ০৮:০০ PM',
      offPeak: '০৮:০১ PM - ০৯:১২ PM',
      color: '#0284c7'
    },
  ];

  const intervals = [
    { type: 'পিক আওয়ার (Peak Hour)', time: 'সকাল ৭:৩১ - বেলা ১১:৩৬ & দুপুর ২:০১ - রাত ৮:০০', interval: 'প্রতি ৮ মিনিট পর পর' },
    { type: 'অফ-পিক আওয়ার (Off-Peak Hour)', time: 'বেলা ১১:৩৭ - দুপুর ২:০০ & রাত ৮:০১ - শেষ ট্রেন', interval: 'প্রতি ১০-১২ মিনিট পর পর' },
    { type: 'শনিবার ও ছুটির দিন', time: 'সারাদিন নিয়মিত সূচি অনুযায়ী', interval: 'প্রতি ১০-১২ মিনিট পর পর' },
  ];

  return (
    <div className="ms-root">
      <Navbar activePage="/metro-rail" />

      {/* Mobile Top Header */}
      <div className="ms-mobile-header">
        <div className="ms-mobile-header-in">
          <button 
            onClick={() => navigate('/metro-rail')}
            className="ms-back-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="ms-mobile-title">মেট্রো সময়সূচী ২০২৬</h1>
        </div>
      </div>

      <div className="ms-container">
        {/* Desktop Hero Banner */}
        <div className="ms-hero-banner">
          <div className="ms-hero-badge">
            <Sparkles size={16} />
            <span>ঢাকা এমআরটি লাইন-৬ (MRT Line-6) অফিসিয়াল সময়সূচী</span>
          </div>
          <h1 className="ms-hero-title">ঢাকা মেট্রো রেলের দৈনিক সময়সূচী ২০২৬</h1>
          <p className="ms-hero-desc">
            উত্তরা উত্তর (দিয়াবাড়ি) থেকে মতিঝিল পর্যন্ত ১৬টি স্টেশনে নিয়মিত বিরতিতে চলাচল করছে আধুনিক বিদ্যুৎচালিত মেট্রো ট্রেন।
          </p>
        </div>

        {/* Friday Alert */}
        <div className="ms-alert-box">
          <CalendarX size={26} color="#e53e3e" style={{ flexShrink: 0 }} />
          <div>
            <span className="ms-alert-head">সাপ্তাহিক ছুটির দিন: শুক্রবার মেট্রো রেল চলাচল বন্ধ থাকে</span>
            <span className="ms-alert-desc">মেট্রো রেল ট্র্যাক ও বৈদ্যুতিক সাবস্টেশন সাপ্তাহিক নিয়মিত রক্ষণাবেক্ষণের জন্য প্রতি শুক্রবার সম্পূর্ণ বন্ধ থাকে। শনিবার থেকে বৃহস্পতিবার যথারীতি চলাচল করে।</span>
          </div>
        </div>

        {/* 2 Main Route Direction Cards */}
        <div className="ms-route-grid">
          {scheduleData.map((item, index) => (
            <div key={index} className="ms-card">
              <div className="ms-card-header">
                <div className="ms-train-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <TrainFront size={24} />
                </div>
                <div>
                  <h3 className="ms-route-name">{item.direction}</h3>
                  <p className="ms-route-sub">{item.from} হতে {item.to}</p>
                </div>
              </div>

              <div className="ms-time-grid">
                <div className="ms-time-box ms-first-train">
                  <span className="ms-tb-label">প্রথম ট্রেনের সময়</span>
                  <span className="ms-tb-val">{item.firstTrain}</span>
                </div>
                <div className="ms-time-box ms-last-train">
                  <span className="ms-tb-label">শেষ ট্রেনের সময়</span>
                  <span className="ms-tb-val">{item.lastTrain}</span>
                </div>
              </div>

              <div className="ms-peak-row">
                <div className="ms-peak-left">
                  <Clock size={16} color="#008352" />
                  <span>পিক আওয়ার (Peak Hours):</span>
                </div>
                <span className="ms-peak-val">{item.peak}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Headway & Interval Section */}
        <div className="ms-interval-card">
          <h3 className="ms-sec-title">
            <Clock size={20} color="#008352" />
            ট্রেন আসা-যাওয়ার সময় ব্যবধান (Train Frequency & Headway)
          </h3>
          <div className="ms-table-wrap">
            <table className="ms-table">
              <thead>
                <tr>
                  <th>সময় পর্ব (Time Category)</th>
                  <th>কার্যকরী সময়সীমা</th>
                  <th>ট্রেন আসার ব্যবধান</th>
                </tr>
              </thead>
              <tbody>
                {intervals.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.type}</strong></td>
                    <td>{row.time}</td>
                    <td><span className="ms-badge-green">{row.interval}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful Quick Links */}
        <div className="ms-quick-links">
          <div className="ms-ql-card" onClick={() => navigate('/metro/fare')}>
            <div>
              <h4>মেট্রো ভাড়া তালিকা দেখুন</h4>
              <p>উত্তরা থেকে মতিঝিল পর্যন্ত স্টেশনভিত্তিক সঠিক ভাড়া</p>
            </div>
            <ArrowRight size={20} color="#008352" />
          </div>
          <div className="ms-ql-card" onClick={() => navigate('/metro/map')}>
            <div>
              <h4>মেট্রো রুট ম্যাপ ও স্টেশন তালিকা</h4>
              <p>১৬টি স্টেশনের অবস্থান, ইন্টারচেঞ্জ পয়েন্ট ও আনুমানিক সময়</p>
            </div>
            <ArrowRight size={20} color="#008352" />
          </div>
          <div className="ms-ql-card" onClick={() => navigate('/metro/rules')}>
            <div>
              <h4>ভ্রমণ নির্দেশিকা ও নিয়মাবলী</h4>
              <p>এমআরটি পাস, সিঙ্গেল জার্নি টিকিট ও স্টেশনের আচরণবিধি</p>
            </div>
            <ArrowRight size={20} color="#008352" />
          </div>
        </div>

      </div>

      <style>{`
        .ms-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
        }

        .ms-mobile-header {
          display: none;
          background: linear-gradient(135deg, #008352 0%, #005a38 100%);
          padding: 16px 20px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .ms-mobile-header {
            display: block;
          }
        }
        .ms-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .ms-back-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 12px;
          padding: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .ms-mobile-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .ms-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .ms-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003726 100%);
          border-radius: 24px;
          padding: 36px 32px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(0, 55, 38, 0.15);
        }
        .ms-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(110, 231, 183, 0.18);
          border: 1px solid rgba(110, 231, 183, 0.35);
          color: #6ee7b7;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .ms-hero-title {
          margin: 0 0 10px;
          font-size: 28px;
          font-weight: 800;
        }
        .ms-hero-desc {
          margin: 0;
          font-size: 15px;
          color: #d1fae5;
          line-height: 1.6;
        }

        .ms-alert-box {
          background-color: #fff5f5;
          border: 1.5px solid #feb2b2;
          padding: 18px 22px;
          border-radius: 18px;
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 28px;
        }
        .ms-alert-head {
          font-weight: 800;
          color: #c53030;
          display: block;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .ms-alert-desc {
          color: #9b2c2c;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .ms-route-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 28px;
        }
        @media (max-width: 480px) {
          .ms-route-grid {
            grid-template-columns: 1fr;
          }
        }

        .ms-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ms-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .ms-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .ms-train-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ms-route-name {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: #1e293b;
        }
        .ms-route-sub {
          margin: 3px 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .ms-time-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 18px;
        }
        .ms-time-box {
          padding: 16px;
          border-radius: 16px;
          text-align: center;
        }
        .ms-first-train {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        .ms-last-train {
          background: #fffbeb;
          border: 1px solid #fde68a;
        }
        .ms-tb-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 4px;
        }
        .ms-tb-val {
          font-size: 20px;
          font-weight: 900;
          color: #1e293b;
        }

        .ms-peak-row {
          padding-top: 14px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ms-peak-left {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          color: #475569;
          font-weight: 600;
        }
        .ms-peak-val {
          font-size: 13.5px;
          font-weight: 800;
          color: #006a4e;
        }

        .ms-interval-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          margin-bottom: 28px;
        }
        .ms-sec-title {
          margin: 0 0 18px;
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ms-table-wrap {
          overflow-x: auto;
        }
        .ms-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .ms-table th {
          background: #f8fafc;
          padding: 12px 16px;
          text-align: left;
          font-weight: 800;
          color: #334155;
          border-bottom: 1.5px solid #e2e8f0;
        }
        .ms-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
        }
        .ms-badge-green {
          background: #ecfdf5;
          color: #059669;
          padding: 4px 12px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12.5px;
        }

        .ms-quick-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }
        .ms-ql-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #e2ebe7;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ms-ql-card:hover {
          border-color: #008352;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.05);
        }
        .ms-ql-card h4 {
          margin: 0 0 4px;
          font-size: 15.5px;
          font-weight: 800;
          color: #1e293b;
        }
        .ms-ql-card p {
          margin: 0;
          font-size: 12.5px;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default MetroSchedule;
