import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Navigation, Activity, Clock, Gauge, AlertCircle, 
  RefreshCw, Search, ShieldCheck, Zap, Radio, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, Train
} from 'lucide-react';
import Navbar from './components/Navbar';
import { trains } from '../data/trainData';

const API_BASE_URL = typeof window !== 'undefined' && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? "http://localhost:5001/api" 
  : "https://train-koi.onrender.com/api";

// Curated popular trains for quick tracking when crowd pings are sparse
const POPULAR_TRAIN_IDS = [751, 757, 793, 765, 701, 703, 725, 735, 787, 813, 709, 711];

const LiveTrainsPage = () => {
  const [liveTrains, setLiveTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'live', 'popular'
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "সচল ট্রেনসমূহ ও লাইভ জিপিএস ট্র্যাকিং | TrainKoi";
    window.scrollTo(0, 0);
  }, []);

  const fetchLiveTrains = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${API_BASE_URL}/live-trains`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setLiveTrains(data.trains || []);
        }
      }
    } catch (err) {
      console.error("Live trains fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveTrains();
    const interval = setInterval(fetchLiveTrains, 20000);
    return () => clearInterval(interval);
  }, []);

  // Popular trains list from static data
  const popularTrainsList = useMemo(() => {
    return trains.filter(t => POPULAR_TRAIN_IDS.includes(t.id));
  }, []);

  // Filtered live trains
  const filteredLiveTrains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return liveTrains;
    return liveTrains.filter(item => {
      const matched = trains.find(t => t.id === item.trainId);
      const name = matched ? matched.name.toLowerCase() : '';
      const code = String(item.trainId);
      return name.includes(q) || code.includes(q);
    });
  }, [liveTrains, searchQuery]);

  // Filtered popular trains
  const filteredPopularTrains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return popularTrainsList;
    return popularTrainsList.filter(t => 
      t.name.toLowerCase().includes(q) || String(t.id).includes(q)
    );
  }, [popularTrainsList, searchQuery]);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "লাইভ ট্রেন ট্র্যাকিং কীভাবে কাজ করে?",
      a: "ট্রেনকই প্ল্যাটফর্মে যাত্রীদের সক্রিয় জিপিএস শেয়ারিং, রেলওয়ে অফিসিয়াল টাইমটেবিল অ্যালগরিদম এবং ক্রাউডসোর্সড নোডের সমন্বয়ে প্রতিটি ট্রেনের বর্তমান গতি, অবস্থান ও বিলম্ব সেকেন্ডের মধ্যে নিখুঁতভাবে হিসেব করে স্যাটেলাইট ম্যাপে দেখানো হয়।"
    },
    {
      q: "ট্রেনকই কি কোনো চার্জ বা সাবস্ক্রিপশন ফি নেয়?",
      a: "না, ট্রেনকই বাংলাদেশের একমাত্র প্ল্যাটফর্ম যা সাধারণ যাত্রী ও পর্যটকদের জন্য সম্পূর্ণ বিনামূল্যে ও আনলিমিটেড লাইভ ট্র্যাকিং সেবা প্রদান করে থাকে।"
    },
    {
      q: "ইন্টারনেট ছাড়া ট্রেনের লাইভ লোকেশন জানার উপায় কী?",
      a: "ইন্টারনেট না থাকলে সাধারণ মোবাইল ফোনের মেসেজ অপশনে গিয়ে টাইপ করুন TR <ট্রেন নং> (যেমন: TR 751) এবং পাঠিয়ে দিন ১৬৩১৮ নম্বরে। ফিরতি এসএমএসে ট্রেনের সর্বশেষ স্টেশন ও বিলম্ব পেয়ে যাবেন।"
    },
    {
      q: "ট্রেনের গতি ও বিলম্বের তথ্য কতটা নির্ভুল?",
      a: "ট্রেনে অবস্থানরত যাত্রীদের রিয়েল-টাইম জিপিএস ডেটাবেজের কারণে ট্রেনকই-এর লাইভ গতি ও অবস্থান প্রায় ৯৫%+ নির্ভুল। তবে রেলওয়ে সিগন্যাল ও আউটার জ্যামের কারণে কিছু স্টেশনে সাময়িক বিলম্ব পরিবর্তিত হতে পারে।"
    }
  ];

  return (
    <div className="lt-page">
      <style>{`
        .lt-page {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
          color: #0f1f1a;
        }
        .lt-page *, .lt-page *::before, .lt-page *::after {
          box-sizing: border-box;
        }

        /* Live Radar Pulse */
        @keyframes lt-pulse-live {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.18); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .lt-live-dot {
          width: 10px;
          height: 10px;
          background-color: #ef4444;
          border-radius: 50%;
          display: inline-block;
          animation: lt-pulse-live 1.6s infinite;
        }
        @keyframes lt-spin {
          to { transform: rotate(360deg); }
        }
        .lt-spin {
          animation: lt-spin 1s linear infinite;
        }

        /* Mobile Header */
        .lt-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #005a40 0%, #003728 100%);
          padding: 16px 20px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }
        @media (min-width: 769px) {
          .lt-mobile-header {
            display: none;
          }
        }

        /* Main Container */
        .lt-main-wrapper {
          max-width: 1520px;
          width: 95%;
          margin: 0 auto;
          padding: 24px 16px 40px;
        }

        /* Hero Banner */
        .lt-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003728 50%, #00261c 100%);
          border-radius: 28px;
          padding: 36px 32px;
          color: white;
          position: relative;
          overflow: hidden;
          margin-bottom: 28px;
          box-shadow: 0 14px 34px -14px rgba(0, 55, 38, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .lt-hero-banner::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 240px;
          height: 240px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .lt-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.22);
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 14px;
          color: #a7f3d0;
        }
        .lt-hero-title {
          font-size: clamp(24px, 3.5vw, 36px);
          font-weight: 900;
          margin: 0 0 10px;
          line-height: 1.3;
          letter-spacing: -0.4px;
        }
        .lt-hero-desc {
          font-size: 14.5px;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 24px;
          max-width: 650px;
          line-height: 1.65;
        }

        /* Search & Filter Bar */
        .lt-controls-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: white;
          padding: 16px 20px;
          border-radius: 20px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          border: 1px solid #eef2f0;
          margin-bottom: 25px;
        }
        .lt-search-box {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8faf9;
          border: 1.5px solid #e2ebe7;
          border-radius: 14px;
          padding: 10px 16px;
          transition: border-color 0.2s;
        }
        .lt-search-box:focus-within {
          border-color: #006a4e;
          background: white;
        }
        .lt-search-input {
          border: none;
          background: transparent;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          width: 100%;
        }
        .lt-filter-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .lt-chip-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid #e2ebe7;
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .lt-chip-btn:hover {
          border-color: #006a4e;
          color: #006a4e;
        }
        .lt-chip-btn.is-active {
          background: #006a4e;
          border-color: #006a4e;
          color: white;
        }

        /* Trains Grid */
        .lt-trains-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 640px) {
          .lt-trains-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1080px) {
          .lt-trains-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 1400px) {
          .lt-trains-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        /* Live Card */
        .lt-train-card {
          background: white;
          border-radius: 22px;
          padding: 18px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          border: 1px solid #eef2f0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .lt-train-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px -10px rgba(0, 106, 78, 0.2);
          border-color: #10b981;
        }
        .lt-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: #10b981;
        }
        .lt-card-accent.is-live {
          background: #ef4444;
        }

        /* Section Headings */
        .lt-sec-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 36px 0 18px;
        }
        .lt-sec-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f1f1a;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lt-sec-count {
          font-size: 12px;
          font-weight: 800;
          color: #006a4e;
          background: #e3f3ec;
          padding: 4px 12px;
          border-radius: 999px;
        }

        /* Info Guide Cards */
        .lt-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 40px;
        }
        @media (min-width: 860px) {
          .lt-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .lt-info-card {
          background: white;
          padding: 26px;
          border-radius: 24px;
          border: 1px solid #eef2f0;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }

        /* FAQ Accordion */
        .lt-faq-item {
          background: white;
          border-radius: 18px;
          border: 1px solid #eef2f0;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .lt-faq-item.is-open {
          border-color: #006a4e;
        }
        .lt-faq-question {
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          color: #1e293b;
        }
        .lt-faq-answer {
          padding: 0 22px 20px;
          font-size: 14px;
          line-height: 1.8;
          color: #475569;
          border-top: 1px solid #f8faf9;
          padding-top: 14px;
        }
      `}</style>

      {/* Desktop Top Navbar */}
      <Navbar activePage="/live-trains" />

      {/* Mobile Top Header */}
      <header className="lt-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 'bold' }}>সচল ট্রেনসমূহ</h3>
            <span style={{ fontSize: '11px', opacity: 0.85 }}>রিয়েল-টাইম ট্র্যাকিং ড্যাশবোর্ড</span>
          </div>
        </div>

        <button 
          onClick={fetchLiveTrains} 
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            border: 'none', 
            color: 'white', 
            padding: '7px 12px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          <RefreshCw size={13} className={isRefreshing ? 'lt-spin' : ''} /> রিফ্রেশ
        </button>
      </header>

      {/* Main Container */}
      <main className="lt-main-wrapper">
        {/* Hero Banner */}
        <div className="lt-hero-banner">
          <div className="lt-hero-badge">
            <Radio size={13} />
            <span>স্যাটেলাইট জিপিএস ও ক্রাউডসোর্সড নেটওয়ার্ক</span>
          </div>
          <h1 className="lt-hero-title">বর্তমানে সচল ও সক্রিয় ট্রেনসমূহ</h1>
          <p className="lt-hero-desc">
            বাংলাদেশ রেলওয়ের আন্তঃনগর ট্রেনসমূহের রিয়েল-টাইম অবস্থান, বর্তমান গতিবেগ (KM/H), বিলম্বের পূর্বাভাস এবং পরবর্তী স্টেশনের সময়সূচী এক নজরে লাইভ ট্র্যাক করুন।
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.12)', 
              backdropFilter: 'blur(10px)', 
              padding: '10px 18px', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span className="lt-live-dot" />
              <span style={{ fontSize: '14px', fontWeight: '800' }}>
                সক্রিয় সচল ট্রেন: {liveTrains.length}টি
              </span>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.12)', 
              padding: '10px 18px', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}>
              <Clock size={15} />
              <span>প্রতি ২০ সেকেন্ডে স্বয়ংক্রিয় সিঙ্ক</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="lt-controls-bar">
          <div className="lt-search-box">
            <Search size={18} color="#006a4e" />
            <input 
              type="text" 
              placeholder="ট্রেনের নাম বা নম্বর দিয়ে খুঁজুন (যেমন: সুবর্ণ, ৭৭১, কক্সবাজার)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lt-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="lt-filter-chips">
            <button 
              onClick={() => setFilterMode('all')} 
              className={`lt-chip-btn ${filterMode === 'all' ? 'is-active' : ''}`}
            >
              সকল ট্রেন
            </button>
            <button 
              onClick={() => setFilterMode('live')} 
              className={`lt-chip-btn ${filterMode === 'live' ? 'is-active' : ''}`}
            >
              <Radio size={13} color={filterMode === 'live' ? 'white' : '#ef4444'} />
              লাইভ সচল ({liveTrains.length})
            </button>
            <button 
              onClick={() => setFilterMode('popular')} 
              className={`lt-chip-btn ${filterMode === 'popular' ? 'is-active' : ''}`}
            >
              জনপ্রিয় আন্তঃনগর ({popularTrainsList.length})
            </button>
          </div>
        </div>

        {/* Live Active Trains Section */}
        {filterMode !== 'popular' && (
          <div>
            <div className="lt-sec-head">
              <h2 className="lt-sec-title">
                <Radio size={20} color="#ef4444" />
                রিয়েল-টাইম লাইভ ট্রেনসমূহ
              </h2>
              <span className="lt-sec-count">{filteredLiveTrains.length}টি লাইভ</span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: 'white', borderRadius: '24px' }}>
                <span className="lt-live-dot" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontWeight: '700' }}>সচল ট্রেনের স্যাটেলাইট ডাটা লোড হচ্ছে...</p>
              </div>
            ) : filteredLiveTrains.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '24px', padding: '36px 24px', textAlign: 'center', border: '1px solid #eef2f0' }}>
                <AlertCircle size={38} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '18px', fontWeight: '800' }}>
                  এই মুহূর্তে সরাসরি কোনো ট্রেনের ক্রাউড লোকেশন সক্রিয় নেই
                </h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.7' }}>
                  যাত্রীরা ট্রেনে চড়ে লোকেশন শেয়ার করলে অথবা থার্ড-পার্টি সিঙ্ক হওয়া মাত্র এখানে লাইভ স্পিড ও স্ট্যাটাস দৃশ্যমান হবে। নিচের জনপ্রিয় আন্তঃনগর তালিকা থেকে যেকোনো ট্রেনের বিস্তারিত শিডিউল ও ট্র্যাকিং দেখতে পারেন।
                </p>
              </div>
            ) : (
              <div className="lt-trains-grid">
                {filteredLiveTrains.map((item, idx) => {
                  const matchedTrain = trains.find(t => t.id === item.trainId);
                  const trainName = matchedTrain ? matchedTrain.name : `ট্রেন নং ${item.trainId}`;
                  const currentStation = matchedTrain?.stations[item.index]?.name || 'মাঝপথে চলমান';

                  return (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/track/${item.trainId}`)}
                      className="lt-train-card"
                    >
                      <div className={`lt-card-accent ${item.mode === 'LIVE' ? 'is-live' : ''}`} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#006a4e', fontWeight: '800' }}>কোড: {item.trainId}</span>
                            <span style={{ 
                              fontSize: '10px', 
                              fontWeight: '900', 
                              padding: '2px 7px', 
                              borderRadius: '6px',
                              backgroundColor: item.mode === 'LIVE' ? '#fee2e2' : '#fef3c7',
                              color: item.mode === 'LIVE' ? '#ef4444' : '#b45309'
                            }}>
                              {item.mode}
                            </span>
                          </div>
                          <h4 style={{ margin: '5px 0 0', fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                            {trainName}
                          </h4>
                        </div>

                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                          {item.diffMinutes === 0 ? 'এইমাত্র' : `${item.diffMinutes}মি আগে`}
                        </span>
                      </div>

                      <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155' }}>
                          <Gauge size={15} color="#006a4e" />
                          <b>{item.speed} KM/H</b>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: item.delay > 0 ? '#ef4444' : '#10b981' }}>
                          <Clock size={15} />
                          <b>{item.delayText || 'সময়মতো'}</b>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#64748b', maxWidth: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          📍 {currentStation.split('(')[0]}
                        </span>
                        <button 
                          style={{ 
                            background: '#006a4e', 
                            color: 'white', 
                            border: 'none', 
                            padding: '7px 14px', 
                            borderRadius: '10px', 
                            fontSize: '12px', 
                            fontWeight: '800', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          <Navigation size={13} /> লাইভ দেখুন
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Popular Intercity Directory */}
        {filterMode !== 'live' && (
          <div>
            <div className="lt-sec-head">
              <h2 className="lt-sec-title">
                <Train size={22} color="#006a4e" />
                জনপ্রিয় আন্তঃনগর ট্রেনের লাইভ ডিরেক্টরি
              </h2>
              <span className="lt-sec-count">{filteredPopularTrains.length}টি ট্রেন</span>
            </div>

            <div className="lt-trains-grid">
              {filteredPopularTrains.map((train) => {
                const isLive = liveTrains.some(lt => Number(lt.trainId) === Number(train.id));
                const startSt = train.stations[0]?.name || train.from;
                const endSt = train.stations[train.stations.length - 1]?.name || train.to;

                return (
                  <div 
                    key={train.id}
                    onClick={() => navigate(`/track/${train.id}`)}
                    className="lt-train-card"
                  >
                    <div className={`lt-card-accent ${isLive ? 'is-live' : ''}`} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#006a4e', fontWeight: '800' }}>ট্রেন নং: {train.id}</span>
                          {isLive ? (
                            <span style={{ 
                              fontSize: '10px', 
                              fontWeight: '900', 
                              padding: '2px 7px', 
                              borderRadius: '6px',
                              backgroundColor: '#fee2e2',
                              color: '#ef4444'
                            }}>
                              LIVE NOW
                            </span>
                          ) : (
                            <span style={{ 
                              fontSize: '10px', 
                              fontWeight: '700', 
                              padding: '2px 7px', 
                              borderRadius: '6px',
                              backgroundColor: '#e2ece6',
                              color: '#006a4e'
                            }}>
                              আন্তঃনগর
                            </span>
                          )}
                        </div>
                        <h4 style={{ margin: '5px 0 0', fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>
                          {train.name}
                        </h4>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        বন্ধ: {train.offDay || 'নেই'}
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '12px 14px', borderRadius: '14px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <small style={{ color: '#94a3b8', display: 'block', fontSize: '10px', fontWeight: '700' }}>প্রারম্ভিক</small>
                        <b>{startSt.split('(')[0]}</b>
                      </div>
                      <span style={{ color: '#006a4e', fontWeight: '800' }}>➔</span>
                      <div style={{ textAlign: 'right' }}>
                        <small style={{ color: '#94a3b8', display: 'block', fontSize: '10px', fontWeight: '700' }}>গন্তব্য</small>
                        <b>{endSt.split('(')[0]}</b>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        মোট স্টপ: {train.stations?.length || 0}টি
                      </span>
                      <button 
                        style={{ 
                          background: isLive ? '#dc2626' : '#006a4e', 
                          color: 'white', 
                          border: 'none', 
                          padding: '7px 14px', 
                          borderRadius: '10px', 
                          fontSize: '12px', 
                          fontWeight: '800', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        <Navigation size={13} /> লাইভ ট্র্যাক
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informational SEO & Value Section for Google AdSense */}
        <div className="lt-info-grid">
          <div className="lt-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#e3f3ec', padding: '10px', borderRadius: '12px', color: '#006a4e' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f1f1a' }}>
                ট্রেনকই লাইভ ট্র্যাকিং অ্যালগরিদম যেভাবে কাজ করে
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.85', color: '#475569', textAlign: 'justify' }}>
              ট্রেনকই প্ল্যাটফর্মটি ক্রাউডসোর্সড প্যাসেঞ্জার নোডস এবং রেলওয়ে শিডিউল টাইমটেবিল সিঙ্কের মাধ্যমে স্বয়ংক্রিয়ভাবে অবস্থান প্রসেস করে। ট্রেনে থাকা সহযাত্রীদের জিপিএস সিগন্যালের নির্ভুলতার ওপর ভিত্তি করে ট্রেনের তাৎক্ষণিক গতিবেগ, বর্তমান স্টেশন ও বিলম্ব হিসাব করা হয়। এর মাধ্যমে কোনো বাড়তি এসএমএস চার্জ ছাড়াই যে কেউ ট্রেনের আপডেট পেতে পারেন।
            </p>
          </div>

          <div className="lt-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', color: '#2563eb' }}>
                <Send size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f1f1a' }}>
                অফলাইন এসএমএস ট্র্যাকিং বিকল্প (১৬৩১৮)
              </h3>
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '14px', lineHeight: '1.85', color: '#475569', textAlign: 'justify' }}>
              আপনার ফোনে ইন্টারনেট সংযোগ না থাকলে অথবা দুর্গম অঞ্চলে নেটওয়ার্ক বিঘ্নিত হলে বাংলাদেশ রেলওয়ের অফিসিয়াল এসএমএস ট্র্যাকিং ব্যবহার করতে পারেন:
            </p>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', borderLeft: '4px solid #2563eb', fontSize: '13.5px', color: '#1e293b', fontWeight: '700' }}>
              মেসেজ অপশনে লিখুন: <code>TR &lt;ট্রেন কোড&gt;</code> (যেমন: <code>TR 751</code>) এবং পাঠিয়ে দিন <code>16318</code> নম্বরে।
            </div>
          </div>
        </div>

        {/* Live Tracking FAQ Accordion */}
        <div style={{ marginTop: '40px' }}>
          <div className="lt-sec-head">
            <h2 className="lt-sec-title">
              <HelpCircle size={22} color="#006a4e" />
              লাইভ ট্র্যাকিং সংক্রান্ত সচরাচর জিজ্ঞাসা
            </h2>
            <span className="lt-sec-count">৪টি প্রশ্নোত্তর</span>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={`lt-faq-item ${openFaq === idx ? 'is-open' : ''}`}>
                <div className="lt-faq-question" onClick={() => toggleFaq(idx)}>
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} color="#006a4e" /> : <ChevronDown size={18} color="#94a3b8" />}
                </div>
                {openFaq === idx && (
                  <div className="lt-faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTrainsPage;
