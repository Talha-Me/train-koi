import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Navigation, Activity, Clock, Gauge, AlertCircle, RefreshCw } from 'lucide-react';
import { trains } from '../data/trainData';

const API_BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001/api" 
  : "https://train-koi.onrender.com/api";

const LiveTrainsPage = () => {
  const [liveTrains, setLiveTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '60px' }}>
      <style>{`
        @keyframes pulse-live {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: pulse-live 1.6s infinite;
        }
      `}</style>

      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
        padding: '20px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>বর্তমানে সচল ট্রেনসমূহ</h3>
            <span style={{ fontSize: '11px', opacity: 0.85 }}>রিয়েল-টাইম ট্র্যাকিং ড্যাশবোর্ড</span>
          </div>
        </div>

        <button 
          onClick={fetchLiveTrains} 
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            border: 'none', 
            color: 'white', 
            padding: '8px 12px', 
            borderRadius: '12px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> রিফ্রেশ
        </button>
      </div>

      {/* Status Bar */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: '12px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot"></span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#065f46' }}>
              মোট সচল ট্রেন: {liveTrains.length}টি
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#047857' }}>প্রতি ২০ সেকেন্ডে অটো-আপডেট</span>
        </div>
      </div>

      {/* Trains Grid */}
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <div className="live-dot" style={{ margin: '0 auto 12px' }}></div>
            সচল ট্রেনের তথ্য লোড হচ্ছে...
          </div>
        ) : liveTrains.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <AlertCircle size={40} color="#f59e0b" style={{ margin: '0 auto 10px' }} />
            <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>এই মুহূর্তে কোনো ট্রেনের লাইভ লোকেশন নেই</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>যাত্রীরা লোকেশন শেয়ার করলে অথবা থার্ড-পার্টি সিঙ্ক হলে এখানে স্বয়ংক্রিয়ভাবে ভেসে উঠবে।</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
            {liveTrains.map((item, idx) => {
              const matchedTrain = trains.find(t => t.id === item.trainId);
              const trainName = matchedTrain ? matchedTrain.name : `ট্রেন নং ${item.trainId}`;
              const currentStation = matchedTrain?.stations[item.index]?.name || 'মাঝপথে চলমান';

              return (
                <div 
                  key={idx} 
                  onClick={() => navigate(`/track/${item.trainId}`)}
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '20px', 
                    padding: '16px', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
                    border: '1px solid #eee',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: item.mode === 'LIVE' ? '#ef4444' : '#f59e0b' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: '#006a4e', fontWeight: 'bold' }}>কোড: {item.trainId}</span>
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: 'bold', 
                          padding: '1px 6px', 
                          borderRadius: '4px',
                          backgroundColor: item.mode === 'LIVE' ? '#fee2e2' : '#fef3c7',
                          color: item.mode === 'LIVE' ? '#ef4444' : '#b45309'
                        }}>
                          {item.mode}
                        </span>
                      </div>
                      <h4 style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{trainName}</h4>
                    </div>

                    <span style={{ fontSize: '10px', color: '#64748b' }}>
                      {item.diffMinutes === 0 ? 'Just now' : `${item.diffMinutes}m ago`}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#475569' }}>
                      <Gauge size={14} color="#006a4e" />
                      <b>{item.speed} KM/H</b>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: item.delay > 0 ? '#ef4444' : '#10b981' }}>
                      <Clock size={14} />
                      <b>{item.delayText || 'On Time'}</b>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#64748b', maxWidth: '65%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📍 {currentStation.split('(')[0]}
                    </span>
                    <button 
                      style={{ 
                        background: '#006a4e', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '8px', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px' 
                      }}
                    >
                      <Navigation size={12} /> ট্র্যাক দেখুন
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTrainsPage;