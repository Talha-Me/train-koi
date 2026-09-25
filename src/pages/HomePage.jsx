import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { Newspaper } from 'lucide-react';
import { 
  Search, MapPin, Settings, Bell, Navigation, ArrowRightLeft, X, 
  Train, BookOpen, User, Info, MessageSquare, ShieldAlert, 
  Ticket, Mail, LayoutGrid, Map, Clock, ChevronRight, Activity,
  HelpCircle, Radio,
  TrainFront, CreditCard, Gavel
} from 'lucide-react';

const API_BASE_URL = "http://localhost:5001/api";

const HomePage = () => {
  const [searchMode, setSearchMode] = useState('name'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // লাইভ ট্রেন ও কাউন্টার স্টেট
  const [totalLiveCount, setTotalLiveCount] = useState(0);
  const [liveTrainsList, setLiveTrainsList] = useState([]);
  const [onDemandLiveMap, setOnDemandLiveMap] = useState({});

  // মাউস স্ক্রল ফিক্স এবং মোবাইল ডিটেকশন
  useEffect(() => {
    const handleResize = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ব্যাকএন্ড থেকে লাইভ ট্রেনের ডেটা ফেচ (প্রতি ১০ সেকেন্ড পর পর)
  const fetchLiveTrainsData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/live-trains`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setTotalLiveCount(data.totalLive || 0);
          setLiveTrainsList(data.trains || []);
        }
      }
    } catch (err) {
      console.error("Live trains fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLiveTrainsData();
    const interval = setInterval(fetchLiveTrainsData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Back Button Logic for Modal
  const [selectedTrainGroup, setSelectedTrainGroup] = useState(() => {
    const saved = sessionStorage.getItem('lastSelectedTrain');
    return saved ? JSON.parse(saved) : null;
  }); 
  
  const [activeDirectionIndex, setActiveDirectionIndex] = useState(0); 
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeInput, setActiveInput] = useState(null); 

  useEffect(() => {
    if (selectedTrainGroup) {
      window.history.pushState({ modalOpen: true }, '');
    }

    const handlePopState = (event) => {
      if (selectedTrainGroup) {
        setSelectedTrainGroup(null);
        sessionStorage.removeItem('lastSelectedTrain');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedTrainGroup]);

  const closeModal = () => {
    setSelectedTrainGroup(null);
    sessionStorage.removeItem('lastSelectedTrain');
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
  };

  const getSuggestions = (input, type) => {
    if (!input || !showSuggestions) return [];
    const lowInput = input.toLowerCase().trim();
    if (type === 'name') {
      const uniqueNames = Array.from(new Set(trains.map(t => t.name)));
      return uniqueNames.filter(name => name.toLowerCase().includes(lowInput)).slice(0, 5);
    } else {
      const stations = trains.flatMap(t => t.stations.map(s => s.name));
      const uniqueStations = Array.from(new Set(stations));
      return uniqueStations.filter(s => s.toLowerCase().includes(lowInput)).slice(0, 5);
    }
  };

  const isSearching = searchTerm.trim() !== '' || fromCity.trim() !== '' || toCity.trim() !== '';

  const displayTrains = (() => {
    const f = fromCity.toLowerCase().trim();
    const t = toCity.toLowerCase().trim();
    const s = searchTerm.toLowerCase().trim();

    if (isSearching) {
      const filtered = trains.filter(train => {
        if (searchMode === 'name') {
          return train.name.toLowerCase().includes(s) || String(train.id).includes(s);
        } else {
          const stationsNames = train.stations.map(st => st.name.toLowerCase());
          return (f === '' || stationsNames.some(n => n.includes(f))) && 
                 (t === '' || stationsNames.some(n => n.includes(t)));
        }
      });

      const groups = {};
      filtered.forEach(train => {
        if (!groups[train.name]) groups[train.name] = [];
        groups[train.name].push(train);
      });
      return Object.values(groups);
    }

    // একদম লেটেস্ট আপডেটেড ট্রেন অগ্রাধিকার দিয়ে সিরিয়াল অনুযায়ী সাজানো
    const orderedLiveGroups = [];
    const addedTrainNames = new Set();

    if (liveTrainsList && liveTrainsList.length > 0) {
      liveTrainsList.forEach(liveItem => {
        const matchedTrain = trains.find(tr => Number(tr.id) === Number(liveItem.trainId));
        if (matchedTrain && !addedTrainNames.has(matchedTrain.name)) {
          addedTrainNames.add(matchedTrain.name);
          const group = trains.filter(tr => tr.name === matchedTrain.name);
          orderedLiveGroups.push(group);
        }
      });
    }

    if (orderedLiveGroups.length < 4) {
      trains.forEach(train => {
        if (!addedTrainNames.has(train.name)) {
          addedTrainNames.add(train.name);
          const group = trains.filter(tr => tr.name === train.name);
          orderedLiveGroups.push(group);
        }
      });
    }

    return orderedLiveGroups.slice(0, 4);
  })();

  // অন-ডিমান্ড লাইভ চেক: যখন কোনো ট্রেন সার্চ করা হবে, সেটির সব ডিরেকশনের ফ্রেশ লাইভ লোকেশন সরাসরি চেক করা
  useEffect(() => {
    if (!isSearching || displayTrains.length === 0) return;

    let isMounted = true;
    const fetchDirectLiveInfo = async () => {
      const topGroups = displayTrains.slice(0, 3);
      for (const grp of topGroups) {
        for (const tr of grp) {
          try {
            const res = await fetch(`${API_BASE_URL}/train-location/${tr.id}`);
            if (res.ok) {
              const info = await res.json();
              if (info && (info.source === 'EXTERNAL' || info.source === 'LOCAL') && isMounted) {
                const diffSec = Math.max(0, Math.round((Date.now() - new Date(info.updatedAt).getTime()) / 1000));
                const diffMin = Math.floor(diffSec / 60);

                setOnDemandLiveMap(prev => ({
                  ...prev,
                  [tr.id]: {
                    ...info,
                    diffSeconds: diffSec,
                    diffMinutes: diffMin,
                    mode: diffMin <= 10 ? 'LIVE' : 'PREDICTED'
                  }
                }));
              }
            }
          } catch (e) {
            // Ignore error
          }
        }
      }
    };

    fetchDirectLiveInfo();
    return () => { isMounted = false; };
  }, [searchTerm, fromCity, toCity, isSearching]);

  const features = [
    { title: 'রেল সংবাদ', icon: <Newspaper size={24} />, color: '#e67e22', path: '/rail-news' },
    { title: 'লাইভ ট্রেন', icon: <Radio size={24} />, color: '#ef4444', path: '/live-trains', isBlinking: true }, 
    { title: 'ট্রেন ব্লগ', icon: <MessageSquare size={24} />, color: '#2ecc71', path: '/blogs' }, 
    { title: 'ভ্রমণ আইন', icon: <ShieldAlert size={24} />, color: '#e74c3c', path: '/travel-laws' },
    { title: 'আমাদের সম্পর্কে', icon: <Info size={24} />, color: '#34495e', path: '/about' },
    { title: 'যোগাযোগ ও অভিযোগ', icon: <Mail size={24} />, color: '#16a085', path: '/contact' },
    { title: 'ট্রেন শিডিউল', icon: <Clock size={24} />, color: '#006a4e', path: '/schedule' },
    { title: 'প্রশ্ন ও উত্তর', icon: <HelpCircle size={24} />, color: '#f39c12', path: '/faq' },
  ];

  return (
    <div style={{ 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh', 
      width: '100%',
      fontFamily: "'Hind Siliguri', sans-serif", 
      paddingBottom: '100px',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      pointerEvents: 'auto'
    }}>
      <style>{`
        @keyframes pulse-live {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .live-badge-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: pulse-live 1.6s infinite;
        }

        @keyframes icon-blink {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.7; filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8)); }
          100% { transform: scale(1); opacity: 1; }
        }
        .blinking-feature-icon {
          animation: icon-blink 1.4s ease-in-out infinite;
        }

        @keyframes button-glow {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          50% { transform: scale(1.04); box-shadow: 0 0 14px rgba(239, 68, 68, 0.8); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
        }
        .tracking-btn-live {
          animation: button-glow 1.8s ease-in-out infinite;
          background-color: #ef4444 !important;
        }
      `}</style>

      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
        padding: '30px 20px 70px', 
        color: 'white', 
        borderBottomLeftRadius: '40px', 
        borderBottomRightRadius: '40px',
        boxShadow: '0 10px 25px rgba(0, 77, 57, 0.2)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          <div 
            onClick={() => navigate('/settings')} 
            style={{ 
              cursor: 'pointer', 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '10px', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              backdropFilter: 'blur(5px)'
            }}
          >
            <Settings size={22} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ 
              margin: 0, 
              fontWeight: 900, 
              fontSize: '28px', 
              background: 'linear-gradient(to right, #ffffff, #e0e0e0)', 
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ট্রেনকই
            </h2>
            {/* লাইভ ট্র্যাকিং কাউন্টার ব্যাজ */}
            <div 
              onClick={() => navigate('/live-trains')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '4px 12px',
                borderRadius: '20px',
                marginTop: '6px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <span className="live-badge-dot"></span>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fef08a' }}>
                {totalLiveCount > 0 ? `${totalLiveCount}টি ট্রেনের লাইভ লোকেশন সচল` : 'লাইভ ট্র্যাকিং সক্রিয়'}
              </span>
            </div>
          </div>

          <div 
            style={{ 
              cursor: 'pointer', 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '10px', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              position: 'relative', 
              backdropFilter: 'blur(5px)'
            }}
          >
            <Bell size={22} />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ff4b2b',
              borderRadius: '50%',
              border: '2px solid #006a4e'
            }}></span>
          </div>
        </div>
      </div>

      {/* Search Container */}
      <div style={{ margin: '-50px 20px 0', backgroundColor: 'white', borderRadius: '30px', padding: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: 15, padding: 5, marginBottom: 15 }}>
          <button onClick={() => {setSearchMode('name'); setSearchTerm('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'name' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'name' ? '#006a4e' : '#888', cursor: 'pointer' }}>নামে সার্চ</button>
          <button onClick={() => {setSearchMode('route'); setFromCity(''); setToCity('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'route' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'route' ? '#006a4e' : '#888', cursor: 'pointer' }}>রুট সার্চ</button>
        </div>
        
        {searchMode === 'name' ? (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 14, borderRadius: 16, border: '1px solid #eee' }}>
              <Search size={20} color="#006a4e" />
              <input type="text" placeholder="ট্রেনের নাম বা কোড লিখুন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowSuggestions(true); setActiveInput('name');}} onFocus={() => setActiveInput('name')} />
            </div>
            {searchTerm && activeInput === 'name' && showSuggestions && getSuggestions(searchTerm, 'name').length > 0 && (
              <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
                {getSuggestions(searchTerm, 'name').map((item, i) => <div key={i} onClick={() => {setSearchTerm(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 16, border: '1px solid #eee' }}>
                  <MapPin size={18} color="#006a4e" />
                  <input type="text" placeholder="কোথা থেকে..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={fromCity} onChange={(e) => {setFromCity(e.target.value); setShowSuggestions(true); setActiveInput('from');}} onFocus={() => setActiveInput('from')} />
                </div>
                {fromCity && activeInput === 'from' && showSuggestions && getSuggestions(fromCity, 'route').length > 0 && (
                  <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
                    {getSuggestions(fromCity, 'route').map((item, i) => <div key={i} onClick={() => {setFromCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
                  </div>
                )}
            </div>
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 16, border: '1px solid #eee' }}>
                  <ArrowRightLeft size={18} color="#006a4e" />
                  <input type="text" placeholder="কোথায় যাবেন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={toCity} onChange={(e) => {setToCity(e.target.value); setShowSuggestions(true); setActiveInput('to');}} onFocus={() => setActiveInput('to')} />
                </div>
                {toCity && activeInput === 'to' && showSuggestions && getSuggestions(toCity, 'route').length > 0 && (
                  <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
                    {getSuggestions(toCity, 'route').map((item, i) => <div key={i} onClick={() => {setToCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div style={{ padding: '30px 20px 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {features.map((f, i) => (
            <div key={i} onClick={() => f.external ? window.open(f.external, '_blank') : f.path && navigate(f.path)} 
                 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div className={f.isBlinking ? 'blinking-feature-icon' : ''} style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', position: 'relative' }}>
                {f.icon}
                {f.isBlinking && (
                  <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                )}
              </div>
              <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>{f.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* সার্চ রেজাল্ট বা লাইভ ট্রেনের তালিকা */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>
              {isSearching ? `অনুসন্ধানের ফলাফল (${displayTrains.length}টি)` : 'লাইভ ট্রেন'}
            </h4>
            {!isSearching && (
              <span className="live-badge-dot" style={{ display: 'inline-block' }}></span>
            )}
          </div>
          {!isSearching && (
            <span onClick={() => navigate('/live-trains')} style={{ fontSize: '12px', color: '#006a4e', fontWeight: 'bold', cursor: 'pointer' }}>
              সবগুলো দেখুন ➔
            </span>
          )}
        </div>

        {displayTrains.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', textAlign: 'center', color: '#64748b' }}>
            কোনো ট্রেন খুঁজে পাওয়া যায়নি।
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {displayTrains.map((group, idx) => {
              // গ্রুপের সব ডিরেকশনের লাইভ ডেটা বের করা
              const groupIds = group.map(t => Number(t.id));
              
              const matchedItems = [];
              groupIds.forEach(gid => {
                if (onDemandLiveMap[gid]) {
                  matchedItems.push(onDemandLiveMap[gid]);
                } else {
                  const foundInGlobal = liveTrainsList.find(lt => Number(lt.trainId) === gid);
                  if (foundInGlobal) matchedItems.push(foundInGlobal);
                }
              });

              // প্রায়োরিটি ফিল্টারিং:
              // ১. যে ট্রেনের গতি রয়েছে (speed > 0) অথবা স্টেশন অতিক্রম করেছে (index/stopsCleared > 0)
              // ২. যার diffMinutes ১০ মিনিটের ভেতরে রয়েছে (actually live)
              // ৩. সর্বশেষ diffSeconds অনুযায়ী ফ্রেশ
              const activeLiveInfo = matchedItems.length > 0 
                ? [...matchedItems].sort((a, b) => {
                    const aSpeed = Number(a.speed || 0);
                    const bSpeed = Number(b.speed || 0);
                    const aPassedStops = Number(a.index || a.stopsCleared || 0);
                    const bPassedStops = Number(b.index || b.stopsCleared || 0);
                    
                    const aIsMoving = (aSpeed > 0 || aPassedStops > 0) ? 1 : 0;
                    const bIsMoving = (bSpeed > 0 || bPassedStops > 0) ? 1 : 0;

                    if (bIsMoving !== aIsMoving) {
                      return bIsMoving - aIsMoving;
                    }

                    const aFresh = Number(a.diffMinutes || 0) <= 10 ? 1 : 0;
                    const bFresh = Number(b.diffMinutes || 0) <= 10 ? 1 : 0;

                    if (bFresh !== aFresh) {
                      return bFresh - aFresh;
                    }

                    return Number(a.diffSeconds || 0) - Number(b.diffSeconds || 0);
                  })[0] 
                : null;

              const hasData = Boolean(activeLiveInfo);
              const isActuallyLive = hasData && Number(activeLiveInfo.diffMinutes) <= 10;
              const isPredicted = hasData && Number(activeLiveInfo.diffMinutes) > 10;

              // সক্রিয় রানিং ট্রেন আইডি অনুযায়ী গ্রুপের নির্দিষ্ট ডিরেকশন শনাক্তকরণ (৭৯৫ বনাম ৭৯৬)
              const targetDirectionIndex = activeLiveInfo 
                ? group.findIndex(t => Number(t.id) === Number(activeLiveInfo.trainId))
                : 0;
              const initialIndex = targetDirectionIndex >= 0 ? targetDirectionIndex : 0;
              const displayTrainId = activeLiveInfo ? activeLiveInfo.trainId : group[0].id;

              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedTrainGroup(group); 
                    setActiveDirectionIndex(initialIndex); 
                    sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
                  }} 
                  style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '25px', 
                    padding: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '15px', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
                    borderTop: '1px solid #f0f0f0',
                    borderRight: '1px solid #f0f0f0',
                    borderBottom: '1px solid #f0f0f0',
                    borderLeft: `6px solid ${isActuallyLive ? '#ef4444' : (isPredicted ? '#f59e0b' : '#006a4e')}`, 
                    cursor: 'pointer' 
                  }}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f8f9fa', flexShrink: 0 }}>
                    <img src="/homeimg.png" alt={group[0].name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold' }}>
                          কোড: {displayTrainId}
                        </span>
                        {isActuallyLive && (
                          <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span className="live-badge-dot" style={{ width: '5px', height: '5px' }}></span>
                            LIVE • {activeLiveInfo.diffMinutes === 0 ? 'Just now' : `${activeLiveInfo.diffMinutes}m ago`}
                          </span>
                        )}
                        {isPredicted && (
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px' }}>
                            PREDICTED • {activeLiveInfo.diffMinutes}m ago
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: '2px 0', fontSize: '16px', color: '#1e293b', fontWeight: '800' }}>{group[0].name}</h4>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>ছুটি: {group[0].offDay}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        if (isActuallyLive && activeLiveInfo) {
                          navigate(`/track/${activeLiveInfo.trainId}`);
                        } else {
                          setSelectedTrainGroup(group); 
                          setActiveDirectionIndex(initialIndex); 
                          sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
                        }
                      }} 
                      className={isActuallyLive ? 'tracking-btn-live' : ''}
                      style={{ 
                        backgroundColor: isActuallyLive ? '#ef4444' : (isPredicted ? '#f59e0b' : '#006a4e'), 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 14px', 
                        borderRadius: '12px', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s ease' 
                      }}
                    >
                      <Activity size={14} /> Tracking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* App Download Banner */}
      {isMobile && (
        <div style={{ margin: '10px 20px 25px', background: 'linear-gradient(135deg, #005a38 0%, #00331e 100%)', borderRadius: '24px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0, 51, 30, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', opacity: 0.08, color: 'white', transform: 'rotate(-20deg)' }}>
            <TrainFront size={90} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '15px', zIndex: 1 }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '16px', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={22} style={{ transform: 'rotate(180deg)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Official App</span>
              <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '800', lineHeight: '1.4' }}>সব ধরনের আপডেট পেতে এখনই TrainKoi অ্যাপটি ডাউনলোড করে নিন!</span>
            </div>
          </div>
          <a href="https://drive.google.com/file/d/1jZ76l2WU60VgupVeUm7p6U4oyAJCn9R5/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#eab308', color: '#000000', fontWeight: '900', fontSize: '13px', padding: '12px 20px', borderRadius: '14px', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 5px 15px rgba(234, 179, 8, 0.4)', zIndex: 1 }}>ডাউনলোড</a>
        </div>
      )}

      {/* Metro Rail Section */}
      <div style={{ padding: '0 20px 20px' }}>
        <div onClick={() => navigate('/metro-rail')} style={{ background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)', borderRadius: '30px', padding: '25px', color: 'white', boxShadow: '0 15px 30px rgba(0,131,82,0.2)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
          <TrainFront size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}><TrainFront size={24} /></div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Dhaka Metro Rail</span>
            </div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '900' }}>বাংলাদেশ মেট্রো রেল</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', opacity: 0.8, lineHeight: '1.5', maxWidth: '80%' }}>সময়সূচী, ভাড়া, টিকিট ও যাতায়াতের সকল তথ্য এখন এক জায়গায়।</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[{ icon: <Clock size={14} />, text: 'সময়সূচী' }, { icon: <CreditCard size={14} />, text: 'টিকিট কার্ড' }, { icon: <Map size={14} />, text: 'রুট ম্যাপ' }, { icon: <Gavel size={14} />, text: 'আইন-কানুন' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{item.icon} {item.text}</div>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold' }}>বিস্তারিত দেখুন <ChevronRight size={18} /></div>
          </div>
        </div>
      </div>

      {/* Stoppage Modal */}
      {selectedTrainGroup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '25px 20px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h3 style={{ margin: 0, color: '#006a4e' }}>{selectedTrainGroup[activeDirectionIndex].name}</h3>
                <span style={{ fontSize: 12, color: '#999' }}>কোড: {selectedTrainGroup[activeDirectionIndex].id}</span>
              </div>
              <X onClick={closeModal} style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', borderRadius: '50%', padding: 5 }} />
            </div>

            <div style={{ backgroundColor: '#fff5f5', color: '#e53935', fontSize: '12px', fontWeight: 'bold', padding: '10px', borderRadius: '12px', marginBottom: '15px', textAlign: 'center', border: '1px solid #ffebee' }}>
              ট্রেনের লাইভ লোকেশন জানতে দয়া করে সঠিক রুটটি সিলেক্ট করুন
            </div>

            {selectedTrainGroup.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, backgroundColor: '#f5f5f5', padding: 5, borderRadius: 15 }}>
                {selectedTrainGroup.map((t, i) => (
                  <button key={i} onClick={() => setActiveDirectionIndex(i)} style={{ flex: 1, padding: '10px 5px', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 'bold', backgroundColor: activeDirectionIndex === i ? 'white' : 'transparent', color: activeDirectionIndex === i ? '#006a4e' : '#777', cursor: 'pointer' }}>
                    {t.from.split('(')[0]} ➔ {t.to.split('(')[0]}
                  </button>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20, padding: '15px', backgroundColor: '#e8f5e9', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                   <div style={{ fontSize: '10px', color: '#1b5e20', fontWeight: 'bold' }}>সাপ্তাহিক ছুটি</div>
                   <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{selectedTrainGroup[activeDirectionIndex].offDay}</div>
                </div>
                <button onClick={() => navigate(`/track/${selectedTrainGroup[activeDirectionIndex].id}`)} style={{ backgroundColor: '#006a4e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <Navigation size={14} /> লাইভ ট্র্যাকিং
                </button>
            </div>

            <div style={{ padding: '0 10px' }}>
              {selectedTrainGroup[activeDirectionIndex].stations.map((st, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 20, position: 'relative' }}>
                  <div style={{ minWidth: 65, fontSize: '13px', fontWeight: '800', color: '#006a4e', textAlign: 'right' }}>
                    {st.departure !== '--:--' ? st.departure : st.arrival}
                  </div>
                  <div style={{ borderLeft: '2px solid #eee', paddingLeft: 20, position: 'relative', flex: 1 }}>
                    <div style={{ width: 12, height: 12, backgroundColor: 'white', border: '3px solid #006a4e', borderRadius: '50%', position: 'absolute', left: -7, top: 4 }}></div>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{st.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>প্রবেশ: {st.arrival} | ত্যাগ: {st.departure}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;