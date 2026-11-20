import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { getTrainProfile } from '../data/trainProfiles';
import { 
  ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, 
  Info, Send, ArrowRightLeft, Locate, Radio, AlertCircle, Zap, ShieldCheck, Train,
  Ticket, HelpCircle, Utensils, ExternalLink, Sparkles, ChevronUp, AlertTriangle, Coffee, Compass, PhoneCall, Wind,
  Luggage, RefreshCw
} from 'lucide-react';
import Navbar from './components/Navbar';

const getCleanSlug = (trainName) => {
  if (!trainName) return "";
  const englishMatch = trainName.match(/\(([^)]+)\)/);
  const nameToProcess = englishMatch ? englishMatch[1] : trainName;
  return nameToProcess.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
};

const TrainSchedule = () => {
  const navigate = useNavigate();
  const { trainSlug } = useParams(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [searchMode, setSearchMode] = useState('name'); 
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // লাইভ ট্র্যাকিং স্টেট (রিয়েল-টাইম লাইভ ট্রেন ডেটার জন্য)
  const [liveTrainsMap, setLiveTrainsMap] = useState({});

  // ব্যাকএন্ড API থেকে লাইভ ট্রেনসমূহের স্ট্যাটাস সিঙ্ক
  useEffect(() => {
    let isMounted = true;
    const fetchLiveStatus = async () => {
      try {
        const response = await fetch('/api/live-trains');
        if (response.ok) {
          const data = await response.json();
          if (isMounted && data && data.trains) {
            const map = {};
            data.trains.forEach(t => {
              map[Number(t.trainId)] = t;
            });
            setLiveTrainsMap(map);
          }
        }
      } catch (err) {
        // সাইলেন্ট হ্যান্ডলিং
      }
    };

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // স্টেশনের ইউনিক সাজেশন লিস্ট
  const allStations = useMemo(() => {
    const stations = new Set();
    trains.forEach(train => {
      train.stations.forEach(st => stations.add(st.name));
    });
    return Array.from(stations).sort();
  }, []);

  // SEO ফ্রেন্ডলি ডায়নামিক মেটা টাইটেল
  useEffect(() => {
    const originalTitle = "Train Live Location | Train Tracking - TrainKoi";
    let currentTitle = "বাংলাদেশ রেলওয়ে ট্রেন সময়সূচী ২০২৬ | TrainKoi";
    if (selectedTrain) {
      currentTitle = `${selectedTrain.name} Schedule & Time Table 2026 | TrainKoi - ফ্রি লাইভ ট্র্যাকিং`;
    }
    document.title = currentTitle;
    const timer = setTimeout(() => { document.title = currentTitle; }, 150);
    return () => {
      clearTimeout(timer);
      document.title = originalTitle;
    };
  }, [selectedTrain]);

  useEffect(() => {
    if (trainSlug) {
      const train = trains.find(t => getCleanSlug(t.name) === trainSlug);
      if (train) setSelectedTrain(train);
    } else {
      setSelectedTrain(null);
    }
  }, [trainSlug]);

  // ফিল্টারিং লজিক (নাম ও রুট ভিত্তিক)
  const filteredTrains = trains.filter(t => {
    if (searchMode === 'name') {
      const q = searchTerm.toLowerCase();
      return t.name.toLowerCase().includes(q) || String(t.id).includes(q);
    } else {
      const hasSource = source === "" || t.stations.some(st => st.name.toLowerCase().includes(source.toLowerCase()));
      const hasDest = destination === "" || t.stations.some(st => st.name.toLowerCase().includes(destination.toLowerCase()));
      
      if (source !== "" && destination !== "") {
        const sIdx = t.stations.findIndex(st => st.name.toLowerCase().includes(source.toLowerCase()));
        const dIdx = t.stations.findIndex(st => st.name.toLowerCase().includes(destination.toLowerCase()));
        return sIdx !== -1 && dIdx !== -1 && sIdx < dIdx;
      }
      return hasSource && hasDest;
    }
  }).slice(0, 36);

  const handleTrainSelect = (train) => {
    const slug = getCleanSlug(train.name);
    navigate(`/schedule/${slug}`);
    setSelectedTrain(train);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [openFaq, setOpenFaq] = useState({});
  const toggleFaq = (idx) => {
    setOpenFaq(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // সময় পার্সিং ও মোট যাত্রা সময় ক্যালকুলেটর
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr || timeStr === 'START' || timeStr === 'END') return null;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toLowerCase();
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const calculateJourneyDuration = (startDep, endArr) => {
    const depMin = parseTimeToMinutes(startDep);
    const arrMin = parseTimeToMinutes(endArr);
    if (depMin === null || arrMin === null) return null;
    let diff = arrMin - depMin;
    if (diff <= 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    const minText = mins > 0 ? (mins + ' মিনিট') : '';
    return { 
      hours, 
      mins, 
      text: (hours + ' ঘণ্টা ' + minText).trim() 
    };
  };

  // দূরত্ব ভিত্তিক আনুমানিক ভাড়া ক্যালকুলেটর (বাংলাদেশ রেলওয়ে ফ্রেইমওয়ার্ক)
  const calculateFares = (km) => {
    if (!km || km <= 0) return { shovon: 50, snigdha: 140, acBerth: 240 };
    const shovon = Math.max(50, Math.round((km * 1.15) / 5) * 5);
    const snigdha = Math.max(130, Math.round((km * 2.15 * 1.15) / 5) * 5);
    const acBerth = Math.max(220, Math.round((km * 3.10 * 1.15) / 5) * 5);
    return { shovon, snigdha, acBerth };
  };

  // মধ্যবর্তী প্রধান স্টেশনসমূহ নির্বাচন
  const getMajorIntermediateStops = (train) => {
    if (!train || !train.stations || train.stations.length <= 2) return [];
    const intermediate = train.stations.filter((s, idx) => 
      idx > 0 && idx < train.stations.length - 1 && s.km && s.km > 25
    );
    if (intermediate.length <= 4) return intermediate;
    const step = Math.max(1, Math.floor(intermediate.length / 4));
    const sampled = [];
    for (let i = 0; i < intermediate.length; i += step) {
      if (sampled.length < 4) sampled.push(intermediate[i]);
    }
    return sampled;
  };

  const sourceSuggestions = source.length > 0 
    ? allStations.filter(s => s.toLowerCase().includes(source.toLowerCase()) && s.toLowerCase() !== source.toLowerCase()).slice(0, 5) 
    : [];
    
  const destSuggestions = destination.length > 0 
    ? allStations.filter(s => s.toLowerCase().includes(destination.toLowerCase()) && s.toLowerCase() !== destination.toLowerCase()).slice(0, 5) 
    : [];

  const isSelectedTrainLive = selectedTrain && !!liveTrainsMap[Number(selectedTrain.id)];
  const selectedTrainLiveData = selectedTrain ? liveTrainsMap[Number(selectedTrain.id)] : null;

  return (
    <div className="ts-page">
      <style>{`
        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
          margin: 0;
          padding: 0;
        }

        .ts-page {
          background-color: #f0f4f2;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 95px;
          overflow-x: hidden !important;
          width: 100% !important;
          max-width: 100vw !important;
          box-sizing: border-box;
        }
        .ts-page *, .ts-page *::before, .ts-page *::after {
          box-sizing: border-box;
        }

        /* Mobile Header */
        .ts-mobile-header {
          background: linear-gradient(135deg, #005a43 0%, #003d2d 100%);
          padding: 14px 16px;
          color: white;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
          width: 100%;
          max-width: 100vw;
          overflow: hidden;
        }
        @media (min-width: 769px) {
          .ts-mobile-header {
            display: none;
          }
        }

        /* Container */
        .ts-main-container {
          max-width: 1520px;
          width: 100%;
          margin: 0 auto;
          padding: 20px 16px 40px;
          box-sizing: border-box;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .ts-main-container {
            padding: 12px 10px 40px;
          }
        }

        /* Trains Grid */
        .ts-trains-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .ts-trains-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }
        @media (min-width: 1100px) {
          .ts-trains-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* Train Card */
        .ts-train-card {
          background-color: white;
          padding: 18px;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.03);
          border: 1px solid #eef2f0;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          width: 100%;
          max-width: 100%;
        }
        @media (max-width: 480px) {
          .ts-train-card {
            padding: 14px 12px;
            border-radius: 16px;
          }
        }
        .ts-train-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -10px rgba(0, 106, 78, 0.2);
          border-color: #006a4e;
        }
        .ts-train-card.is-live {
          border-color: #ff4d4f;
          box-shadow: 0 4px 18px rgba(255, 77, 79, 0.12);
        }

        /* Responsive Detail Layout - Critical: minmax(0, 1fr) prevents blowout */
        .ts-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 100%;
        }
        @media (min-width: 992px) {
          .ts-detail-layout {
            grid-template-columns: 380px minmax(0, 1fr);
            align-items: start;
            gap: 24px;
          }
        }

        /* Detail Column */
        .ts-detail-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        /* Content Card */
        .ts-card {
          background-color: white;
          border-radius: 22px;
          padding: 22px;
          border: 1px solid #edf2ef;
          box-shadow: 0 4px 18px rgba(0,0,0,0.03);
          min-width: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .ts-card {
            padding: 16px 14px !important;
            border-radius: 16px !important;
          }
        }

        /* Train Title */
        .ts-train-title {
          font-size: 24px;
          color: #0f1f1a;
          margin: 8px 0 14px;
          font-weight: 900;
          word-break: break-word;
          line-height: 1.3;
        }
        @media (max-width: 640px) {
          .ts-train-title {
            font-size: 18px !important;
            margin: 6px 0 10px !important;
          }
        }

        /* Table Box & Touch Scroll */
        .ts-table-box {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
          border-radius: 14px;
          border: 1px solid #eef2f0;
          width: 100% !important;
          max-width: 100% !important;
          display: block;
        }
        .ts-timetable {
          width: 100%;
          min-width: 460px;
          border-collapse: collapse;
          text-align: left;
        }
        @media (max-width: 640px) {
          .ts-timetable {
            min-width: 390px;
          }
          .ts-timetable th, .ts-timetable td {
            padding: 8px 6px !important;
            font-size: 11.5px !important;
          }
        }

        .ts-inter-table {
          width: 100%;
          min-width: 360px;
          border-collapse: collapse;
          font-size: 13px;
        }
        @media (max-width: 640px) {
          .ts-inter-table {
            min-width: 310px;
            font-size: 11.5px !important;
          }
          .ts-inter-table th, .ts-inter-table td {
            padding: 7px 5px !important;
          }
        }

        /* Responsive Grids */
        .ts-fare-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .ts-fare-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        .ts-amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 640px) {
          .ts-amenities-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        .ts-policy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 8px;
          width: 100%;
        }
        @media (max-width: 500px) {
          .ts-policy-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        .ts-scroll-hint {
          display: none;
        }
        @media (max-width: 640px) {
          .ts-scroll-hint {
            display: inline-block;
            font-size: 11px;
            color: #006a4e;
            background-color: #e8f5ef;
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 700;
            margin-bottom: 8px;
          }
        }

        /* Animation Keyframes */
        @keyframes ts-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ts-pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .ts-pulse-red {
          animation: ts-pulse 1.4s infinite ease-in-out;
        }
        .ts-pulse-white {
          animation: ts-pulse 1.2s infinite ease-in-out;
        }
        .ts-live-dot {
          width: 9px;
          height: 9px;
          background-color: #ff4d4f;
          border-radius: 50%;
          display: inline-block;
          animation: ts-pulse 1.2s infinite ease-in-out;
          box-shadow: 0 0 8px rgba(255, 77, 79, 0.8);
        }
      `}</style>

      {/* Desktop Top Navbar */}
      <Navbar activePage="/schedule" />

      {/* Mobile Header */}
      <header className="ts-mobile-header">
        <button 
          onClick={() => {
            if (selectedTrain) {
              setSelectedTrain(null);
              navigate('/schedule');
            } else {
              navigate(-1);
            }
          }} 
          style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '6px', marginRight: '12px', display: 'flex', alignItems: 'center' }}
          aria-label="Back"
        >
          <ChevronLeft size={26} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', maxWidth: 'calc(100vw - 85px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedTrain ? selectedTrain.name : 'বাংলাদেশ রেলওয়ে ট্রেন শিডিউল'}
          </h1>
          <p style={{ margin: 0, fontSize: '11px', opacity: 0.85 }}>ট্রেনকই • ফ্রি লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম</p>
        </div>
      </header>

      {/* Container */}
      <main className="ts-main-container">
        
        {/* Mode Switcher */}
        {!selectedTrain && (
          <div style={{ display: 'flex', backgroundColor: '#e2ece6', borderRadius: '16px', padding: '5px', marginBottom: '22px', border: '1px solid #d4e5dc', maxWidth: '600px', marginInline: 'auto' }}>
            <button 
              onClick={() => setSearchMode('name')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', backgroundColor: searchMode === 'name' ? 'white' : 'transparent', color: searchMode === 'name' ? '#006a4e' : '#555', fontWeight: '800', fontSize: '14px', transition: 'all 0.2s ease', boxShadow: searchMode === 'name' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}
            >
              নাম দিয়ে খুঁজুন
            </button>
            <button 
              onClick={() => setSearchMode('route')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', backgroundColor: searchMode === 'route' ? 'white' : 'transparent', color: searchMode === 'route' ? '#006a4e' : '#555', fontWeight: '800', fontSize: '14px', transition: 'all 0.2s ease', boxShadow: searchMode === 'route' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}
            >
              রুট দিয়ে খুঁজুন
            </button>
          </div>
        )}

        {/* Search Inputs Card */}
        {!selectedTrain && (
          <div style={{ backgroundColor: 'white', padding: '22px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '25px', position: 'relative', border: '1px solid #eef2f0' }}>
            {searchMode === 'name' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Search size={22} color="#006a4e" />
                <input 
                  type="text" 
                  placeholder="ট্রেনের নাম বা নম্বর লিখুন (যেমন: লালমণি, চিলাহাটি, সুবর্ণ, 751)..." 
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '600', fontFamily: 'inherit' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8faf9', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2ebe7' }}>
                    <Locate size={20} color="#006a4e" />
                    <input 
                      type="text" 
                      placeholder="যাত্রার প্রারম্ভিক স্টেশন..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14.5px', background: 'transparent', fontFamily: 'inherit' }}
                      value={source}
                      onFocus={() => setShowSourceSuggestions(true)}
                      onChange={(e) => setSource(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                    />
                  </div>
                  {showSourceSuggestions && sourceSuggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '14px', marginTop: '6px', overflow: 'hidden' }}>
                      {sourceSuggestions.map(s => (
                        <div key={s} onClick={() => { setSource(s); setShowSourceSuggestions(false); }} style={{ padding: '12px 18px', borderBottom: '1px solid #f8f8f8', cursor: 'pointer', fontSize: '14px' }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8faf9', padding: '12px 16px', borderRadius: '14px', border: '1px solid #e2ebe7' }}>
                    <MapPin size={20} color="#e67e22" />
                    <input 
                      type="text" 
                      placeholder="গন্তব্য স্টেশন..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14.5px', background: 'transparent', fontFamily: 'inherit' }}
                      value={destination}
                      onFocus={() => setShowDestSuggestions(true)}
                      onChange={(e) => setDestination(e.target.value)}
                      onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                    />
                  </div>
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: '14px', marginTop: '6px', overflow: 'hidden' }}>
                      {destSuggestions.map(s => (
                        <div key={s} onClick={() => { setDestination(s); setShowDestSuggestions(false); }} style={{ padding: '12px 18px', borderBottom: '1px solid #f8f8f8', cursor: 'pointer', fontSize: '14px' }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* লিস্ট ভিউ (লিস্টের ট্রেনের কার্ডসমূহ) */}
        {!selectedTrain ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
               <h2 style={{ color: '#1e293b', margin: 0, fontSize: '17px', fontWeight: '800' }}>
                 উপলব্ধ ট্রেনের সময়সূচী ({filteredTrains.length}টি)
               </h2>
               {(searchTerm || source || destination) && (
                 <button onClick={() => {setSearchTerm(''); setSource(''); setDestination('');}} style={{background: 'none', border: 'none', color: '#006a4e', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'}}>ক্লিয়ার করুন</button>
               )}
            </div>
            
            <div className="ts-trains-grid">
              {filteredTrains.length > 0 ? filteredTrains.map((train, idx) => {
                const isLive = !!liveTrainsMap[Number(train.id)];
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleTrainSelect(train)} 
                    className={`ts-train-card ${isLive ? 'is-live' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ 
                        backgroundColor: isLive ? '#fff1f0' : '#f0f9f4', 
                        padding: '12px', 
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isLive ? (
                          <Radio size={22} className="ts-pulse-red" color="#ff4d4f" />
                        ) : (
                          <Clock size={22} color="#006a4e" />
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '15.5px', color: '#1e293b' }}>{train.name}</span>
                          {isLive && (
                            <span style={{ backgroundColor: '#ff4d4f', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '6px' }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span>{train.from}</span> <ArrowRightLeft size={11} /> <span>{train.to}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={18} color="#94a3b8" />
                  </div>
                );
              }) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#888', backgroundColor: 'white', borderRadius: '24px' }}>
                  <AlertCircle size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>কোনো ট্রেন খুঁজে পাওয়া যায়নি। নাম বা স্টেশন পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                </div>
              )}
            </div>

            {/* এসইও ব্র্যান্ডিং সেকশন */}
            <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '28px', borderRadius: '24px', border: '1px solid #e5ece8', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f5ef', color: '#006a4e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
                <Zap size={16} fill="#006a4e" /> ট্রেনকই (TrainKoi) এর প্রতিশ্রুতি
              </div>
              <h3 style={{ margin: '6px 0 10px 0', fontSize: '19px', color: '#111', fontWeight: '900' }}>
                যাত্রীদের সুবিধার্থে ট্রেনের লাইভ লোকেশন ও সময়সূচী সেবা সম্পূর্ণ ফ্রিতে!
              </h3>
              <p style={{ margin: 0, fontSize: '14.5px', color: '#555', lineHeight: '1.8', maxWidth: '800px', marginInline: 'auto' }}>
                কোনো হিডেন চার্জ বা সাবস্ক্রিপশন ছাড়াই দেশের যেকোনো প্রান্ত থেকে আন্তঃনগর, মেইল ও কমিউটার ট্রেনের সঠিক সময়সূচী, বর্তমান অবস্থান এবং প্ল্যাটফর্ম তথ্য জেনে নিন নিমেষেই।
              </p>
            </div>
          </div>
        ) : (
          /* ডিটেইলড শিডিউল ও লাইভ ট্র্যাকিং ইন্টারফেস (2-Column Desktop Layout) */
          <div style={{ animation: 'ts-fade 0.3s ease' }}>
            <button 
              onClick={() => { setSelectedTrain(null); navigate('/schedule'); }} 
              style={{ background: '#e2ede7', color: '#006a4e', border: 'none', padding: '10px 18px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              ← সময়সূচী তালিকায় ফিরে যান
            </button>
            
            <div className="ts-detail-layout">
              {/* Left Column (Train Info, Actions, SMS) */}
              <div className="ts-detail-col">
                
                {/* Train Card Header */}
                <div className="ts-card">
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TRAIN #{selectedTrain.id} • বন্ধের দিন: {selectedTrain.offDay || 'কোন সাপ্তাহিক বন্ধ নেই'}
                  </div>
                  <h1 className="ts-train-title">
                    {selectedTrain.name}
                  </h1>

                  {isSelectedTrainLive ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff1f0', border: '1.5px solid #ff4d4f', color: '#cf1322', padding: '7px 14px', borderRadius: '30px', fontSize: '12.5px', fontWeight: '800' }}>
                      <span className="ts-live-dot"></span> ট্রেনটি এখন লাইভ চলছে
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0f9f4', border: '1px solid #b7eb8f', color: '#006a4e', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>
                      <Clock size={15} /> নির্ধারিত সময়সূচী মোড
                    </div>
                  )}

                  {/* লাইভ ট্র্যাকিং বাটন */}
                  <div style={{ marginTop: '20px' }}>
                    <button 
                      onClick={() => navigate(`/track/${selectedTrain.id}`)}
                      style={{ 
                        width: '100%', 
                        background: isSelectedTrainLive 
                          ? 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)' 
                          : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
                        color: 'white', 
                        border: 'none', 
                        padding: '16px 20px', 
                        borderRadius: '16px', 
                        fontWeight: '900', 
                        fontSize: '15px',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '10px', 
                        cursor: 'pointer',
                        boxShadow: isSelectedTrainLive 
                          ? '0 8px 25px rgba(229,57,53,0.35)' 
                          : '0 8px 22px rgba(0,106,78,0.25)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isSelectedTrainLive ? (
                        <>
                          <Radio size={20} className="ts-pulse-white" />
                          <span>লাইভ লোকেশন ও ম্যাপ দেখুন</span>
                        </>
                      ) : (
                        <>
                          <Navigation size={20} />
                          <span>লাইভ লোকেশন ট্র্যাকিং</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* লাইভ স্পিড ও বিলম্ব */}
                  {isSelectedTrainLive && selectedTrainLiveData && (
                    <div style={{ backgroundColor: '#fff2f0', padding: '12px 16px', borderRadius: '14px', borderLeft: '4px solid #ff4d4f', marginTop: '14px', fontSize: '13.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#444' }}>স্পিড: <b>{selectedTrainLiveData.speed || 0} KM/H</b></span>
                      <span style={{ color: '#cf1322', fontWeight: 'bold' }}>{selectedTrainLiveData.delayText || 'সময়মতো'}</span>
                    </div>
                  )}
                </div>

                {/* এসএমএস ট্র্যাকিং সুবিধা */}
                <div style={{ backgroundColor: '#f0f7ff', padding: '18px 20px', borderRadius: '20px', borderLeft: '5px solid #007bff', display: 'flex', alignItems: 'center', gap: '14px' }}>
                   <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,123,255,0.1)' }}>
                     <Send size={22} color="#007bff" />
                   </div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '13px', color: '#007bff', fontWeight: 'bold' }}>অফলাইন এসএমএস ট্র্যাকিং</h4>
                     <p style={{ margin: '3px 0 0 0', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
                       TR {selectedTrain.id} লিখে পাঠিয়ে দিন ১৬৩১৮ নম্বরে
                     </p>
                   </div>
                </div>

                {/* কুইক ফ্যাক্টস */}
                {(() => {
                  const startSt = selectedTrain.stations[0];
                  const endSt = selectedTrain.stations[selectedTrain.stations.length - 1];
                  const duration = calculateJourneyDuration(startSt?.departure, endSt?.arrival);
                  const totalKm = endSt?.km || 0;

                  return (
                    <div className="ts-card">
                      <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#006a4e', fontWeight: '800' }}>
                        ট্রেন তথ্যের সারসংক্ষেপ
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>মোট স্টপ:</span>
                          <b style={{ textAlign: 'right' }}>{selectedTrain.stations.length}টি স্টেশন</b>
                        </div>
                        {totalKm > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                            <span style={{ flexShrink: 0 }}>রেল দূরত্ব:</span>
                            <b style={{ textAlign: 'right' }}>{totalKm} কিমি</b>
                          </div>
                        )}
                        {duration && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                            <span style={{ flexShrink: 0 }}>গড় ভ্রমণ সময়:</span>
                            <b style={{ color: '#006a4e', textAlign: 'right' }}>{duration.text}</b>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>প্রারম্ভিক:</span>
                          <b style={{ textAlign: 'right' }}>{startSt?.name.split('(')[0]}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>গন্তব্য:</span>
                          <b style={{ textAlign: 'right' }}>{endSt?.name.split('(')[0]}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>সাপ্তাহিক বন্ধ:</span>
                          <b style={{ textAlign: 'right' }}>{selectedTrain.offDay || 'নেই'}</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>ফ্রি লাগেজ সীমা:</span>
                          <b style={{ color: '#166534', textAlign: 'right' }}>৩৭.৫ — ৫৬ কেজি</b>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
                          <span style={{ flexShrink: 0 }}>রেলওয়ে হেল্পলাইন:</span>
                          <b style={{ color: '#006a4e', textAlign: 'right' }}>১৬৪৫৯</b>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Right Column (Timetable, Editorial Guide, Fare Table, FAQ & Advisory) */}
              <div className="ts-detail-col">
                
                {/* ১. স্টেশনভিত্তিক অফিসিয়াল সময়সূচী টেবিল */}
                <div className="ts-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                      <MapPin size={20} color="#006a4e" /> স্টেশনভিত্তিক অফিসিয়াল সময়সূচী
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', backgroundColor: '#e8f5ef', color: '#006a4e', padding: '4px 10px', borderRadius: '20px', fontWeight: '800' }}>
                        মোট {selectedTrain.stations.length}টি স্টপেজ
                      </span>
                      {selectedTrain.stations[selectedTrain.stations.length - 1]?.km > 0 && (
                        <span style={{ fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>
                          দূরত্ব: {selectedTrain.stations[selectedTrain.stations.length - 1].km} কিমি
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="ts-scroll-hint">← ডানে-বামে স্ক্রোল করে সময়সূচী দেখুন →</span>
                  <div className="ts-table-box">
                    <table className="ts-timetable">
                      <thead>
                        <tr style={{ backgroundColor: '#005a43', color: 'white' }}>
                          <th style={{ padding: '12px 14px', fontSize: '13.5px' }}>#</th>
                          <th style={{ padding: '12px 16px', fontSize: '13.5px' }}>স্টেশনের নাম</th>
                          <th style={{ padding: '12px 14px', fontSize: '13px', textAlign: 'center' }}>দূরত্ব</th>
                          <th style={{ padding: '12px 16px', fontSize: '13.5px', textAlign: 'center' }}>পৌঁছানোর সময়</th>
                          <th style={{ padding: '12px 16px', fontSize: '13.5px', textAlign: 'center' }}>ছাড়ার সময়</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTrain.stations.map((st, i) => (
                          <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fbfdfc', borderBottom: '1px solid #f0f3f1' }}>
                            <td style={{ padding: '12px 14px', fontSize: '12.5px', color: '#94a3b8', fontWeight: 'bold' }}>{i + 1}</td>
                            <td style={{ padding: '12px 16px', fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
                              {st.name}
                              {i === 0 && <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px' }}>প্রারম্ভিক</span>}
                              {i === selectedTrain.stations.length - 1 && <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px' }}>গন্তব্য</span>}
                            </td>
                            <td style={{ padding: '12px 14px', fontSize: '12.5px', textAlign: 'center', color: '#64748b' }}>
                              {st.km !== undefined ? `${st.km} কিমি` : '-'}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: '#64748b' }}>{st.arrival || '-'}</td>
                            <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', color: '#006a4e', fontWeight: '800' }}>{st.departure || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ২. ট্রেন পরিচিতি ও ভ্রমণ নির্দেশিকা (Editorial Guide) */}
                {(() => {
                  const profile = getTrainProfile(selectedTrain);
                  const startSt = selectedTrain.stations[0];
                  const endSt = selectedTrain.stations[selectedTrain.stations.length - 1];
                  const duration = calculateJourneyDuration(startSt?.departure, endSt?.arrival);
                  const totalKm = endSt?.km || 0;
                  const offDayDisplay = selectedTrain.offDay && selectedTrain.offDay !== 'None' && selectedTrain.offDay !== 'নাই (None)'
                    ? selectedTrain.offDay
                    : 'কোনো সাপ্তাহিক বন্ধ নেই (সপ্তাহের ৭ দিনই চলাচল করে)';

                  return (
                    <div className="ts-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                        <div style={{ backgroundColor: '#e6f4ee', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                          <Sparkles size={22} color="#006a4e" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '19px', color: '#0f1f1a', margin: 0, fontWeight: '900' }}>
                            {selectedTrain.name} — পরিচিতি ও ভ্রমণ নির্দেশিকা
                          </h3>
                          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                            অফিশিয়াল রুট প্রোফাইল ও যাত্রী সহায়ক তথ্য
                          </span>
                        </div>
                      </div>

                      {profile ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14.5px', lineHeight: '1.85', color: '#334155' }}>
                          <div>
                            <h4 style={{ fontSize: '15px', color: '#006a4e', margin: '0 0 6px', fontWeight: '800' }}>
                              ঐতিহাসিক প্রেক্ষাপট ও রুট পরিচিতি:
                            </h4>
                            <p style={{ margin: 0, textAlign: 'justify' }}>{profile.history}</p>
                          </div>

                          <div>
                            <h4 style={{ fontSize: '15px', color: '#006a4e', margin: '0 0 6px', fontWeight: '800' }}>
                              যাত্রীদের জন্য গুরুত্ব ও ভূমিকা:
                            </h4>
                            <p style={{ margin: 0, textAlign: 'justify' }}>{profile.importance}</p>
                          </div>

                          {profile.scenery && (
                            <div>
                              <h4 style={{ fontSize: '15px', color: '#006a4e', margin: '0 0 6px', fontWeight: '800' }}>
                                যাত্রাপথের প্রাকৃতিক দৃশ্যপট:
                              </h4>
                              <p style={{ margin: 0, textAlign: 'justify' }}>{profile.scenery}</p>
                            </div>
                          )}

                          {profile.catering && (
                            <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '14px', borderLeft: '4px solid #006a4e' }}>
                              <h5 style={{ fontSize: '14px', color: '#1e293b', margin: '0 0 4px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Utensils size={16} color="#006a4e" /> অন-বোর্ড খাবার ও ক্যাটারিং সুবিধা:
                              </h5>
                              <p style={{ margin: 0, fontSize: '13.5px', color: '#475569' }}>{profile.catering}</p>
                            </div>
                          )}

                          {profile.travelTips && (
                            <div style={{ backgroundColor: '#fffbf5', padding: '14px 18px', borderRadius: '14px', borderLeft: '4px solid #f59e0b' }}>
                              <h5 style={{ fontSize: '14px', color: '#b45309', margin: '0 0 4px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Compass size={16} color="#b45309" /> অভিজ্ঞ ভ্রমণ পরামর্শ:
                              </h5>
                              <p style={{ margin: 0, fontSize: '13.5px', color: '#78350f' }}>{profile.travelTips}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: '1.8', color: '#334155' }}>
                          <div style={{ backgroundColor: '#f0fdf4', padding: '16px 20px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                            <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#166534', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Train size={18} color="#166534" /> মেইল / কমিউটার সার্ভিস ক্যাটাগরি ও যাত্রী সুবিধা
                            </h4>
                            <p style={{ margin: 0, color: '#14532d', fontSize: '13.5px' }}>
                              <strong>{selectedTrain.name}</strong> বাংলাদেশ রেলওয়ের নিয়মিত পরিচালিত মেইল/কমিউটার লোকাল সার্ভিস। দৈনন্দিন অফিসগামী যাত্রী, সাধারণ শ্রমজীবী, ব্যবসায়ী ও শিক্ষার্থীদের স্বল্প খরচে জেলা ও উপজেলার মধ্যবর্তী স্টেশনে সহজে যাতায়াতের জন্য এই সেবা পরিচালিত হয়।
                            </p>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <h5 style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#006a4e', fontWeight: '800' }}>
                                কাউন্টার টিকিট ও স্ট্যান্ডিং নিয়ম:
                              </h5>
                              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                                এই সার্ভিসের টিকিট অনলাইনে বিক্রি হয় না। যাত্রার দিন স্ব-স্ব স্টেশনের জেনারেল টিকিট কাউন্টার থেকে সরাসরি সংগ্রহ করতে হয়।
                              </p>
                            </div>

                            <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <h5 style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#006a4e', fontWeight: '800' }}>
                                আসন বিন্যাস ও সিটিং ব্যবস্থা:
                              </h5>
                              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                                সাধারণ দ্বিতীয় শ্রেণি বা শোভন আসন রয়েছে। 'আগে আসলে আগে বসার' ভিত্তিতে আসন গ্রহণ করতে হয়।
                              </p>
                            </div>

                            <div style={{ backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <h5 style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#006a4e', fontWeight: '800' }}>
                                সাশ্রয়ী লোকাল ভাড়া সুবিধা:
                              </h5>
                              <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b' }}>
                                এক্সপ্রেস ও আন্তঃনগর ট্রেনের তুলনায় মেইল ও কমিউটার ট্রেনের ভাড়া বহুলাংশে সাশ্রয়ী ও স্বল্পব্যয়ী।
                              </p>
                            </div>
                          </div>

                          <div style={{ backgroundColor: '#fffbf5', padding: '14px 18px', borderRadius: '14px', borderLeft: '4px solid #f59e0b', fontSize: '13px', color: '#78350f' }}>
                            <strong>যাত্রী পরামর্শ:</strong> কমিউটার ট্রেনে নিয়মিত প্রচুর যাত্রী পরিবহন করা হয়, তাই ভিড় এড়াতে ট্রেন ছাড়ার অন্তত ১৫–২০ মিনিট পূর্বে স্টেশনের প্ল্যাটফর্মে উপস্থিত থাকা এবং নিজের টিকিট ও মালামাল সাবধানে রাখা বাঞ্ছনীয়।
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* ৩. টিকিটের আনুমানিক ভাড়া তালিকা (Ticket Fare Table) */}
                {(() => {
                  const endSt = selectedTrain.stations[selectedTrain.stations.length - 1];
                  const totalKm = endSt?.km || 0;
                  const fares = calculateFares(totalKm);
                  const intermediateStops = getMajorIntermediateStops(selectedTrain);

                  return (
                    <div className="ts-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                            <Ticket size={20} color="#006a4e" /> টিকিটের আনুমানিক মূল্য তালিকা (Ticket Fare)
                          </h3>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            প্রারম্ভিক স্টেশন {selectedTrain.stations[0]?.name.split('(')[0]} হতে গন্তব্য স্টেশন পর্যন্ত
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                          রেলওয়ে নীতিমালা অনুযায়ী
                        </span>
                      </div>

                      {/* ক্লাস ভিত্তিক মূল ভাড়া কার্ড */}
                      <div className="ts-fare-grid">
                        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>শোভন চেয়ার (S_CHAIR)</span>
                          <div style={{ fontSize: '22px', fontWeight: '900', color: '#006a4e', margin: '4px 0' }}>
                            ৳{fares.shovon}
                          </div>
                          <p style={{ margin: 0, fontSize: '11.5px', color: '#64748b' }}>নন-এসি আরামদায়ক আসন, নিয়মিত ভ্রমণকারীদের প্রথম পছন্দ</p>
                        </div>

                        <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>স্নিগ্ধা এসি (SNIGDHA)</span>
                          <div style={{ fontSize: '22px', fontWeight: '900', color: '#15803d', margin: '4px 0' }}>
                            ৳{fares.snigdha}
                          </div>
                          <p style={{ margin: 0, fontSize: '11.5px', color: '#166534' }}>সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত আধুনিক চেয়ার কার (১৫% ভ্যাট অন্তর্ভুক্ত)</p>
                        </div>

                        <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                          <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: '700' }}>এসি সিট / বার্থ (AC_B)</span>
                          <div style={{ fontSize: '22px', fontWeight: '900', color: '#1d4ed8', margin: '4px 0' }}>
                            ৳{fares.acBerth}
                          </div>
                          <p style={{ margin: 0, fontSize: '11.5px', color: '#1e40af' }}>শীতাতপ নিয়ন্ত্রিত স্লিপার বার্থ ও আরামদায়ক কেবিন সুবিধা</p>
                        </div>
                      </div>

                      {/* মধ্যবর্তী প্রধান স্টেশনসমূহের ভাড়া তালিকা */}
                      {intermediateStops.length > 0 && (
                        <div style={{ marginBottom: '18px' }}>
                          <h4 style={{ fontSize: '14px', color: '#334155', margin: '0 0 10px', fontWeight: '800' }}>
                            {selectedTrain.stations[0]?.name.split('(')[0]} থেকে প্রধান মধ্যবর্তী স্টেশনসমূহের আনুমানিক ভাড়া:
                          </h4>
                          <div className="ts-table-box">
                            <table className="ts-inter-table">
                              <thead>
                                <tr style={{ backgroundColor: '#f8fafc', color: '#475569', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                  <th style={{ padding: '10px 14px' }}>গন্তব্য স্টেশন</th>
                                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>দূরত্ব</th>
                                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>শোভন চেয়ার</th>
                                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>স্নিগ্ধা (এসি)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {intermediateStops.map((st, idx) => {
                                  const stFares = calculateFares(st.km);
                                  return (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: idx % 2 === 0 ? '#fff' : '#fcfdfd' }}>
                                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#1e293b' }}>
                                        {st.name.split('(')[0]}
                                      </td>
                                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#64748b' }}>
                                        {st.km} কিমি
                                      </td>
                                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#006a4e', fontWeight: '700' }}>
                                        ৳{stFares.shovon}
                                      </td>
                                      <td style={{ padding: '10px 14px', textAlign: 'center', color: '#15803d', fontWeight: '700' }}>
                                        ৳{stFares.snigdha}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* অফিসিয়াল টিকিট সংগ্রহের গাইড */}
                      <div style={{ backgroundColor: '#fffbf5', padding: '16px 20px', borderRadius: '16px', border: '1px dashed #fcd34d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ flex: '1 1 300px' }}>
                          <h5 style={{ margin: '0 0 4px', fontSize: '13.5px', color: '#92400e', fontWeight: '800' }}>
                            অনলাইনে ট্রেনের টিকিট কাটার নিয়ম:
                          </h5>
                          <p style={{ margin: 0, fontSize: '12.5px', color: '#78350f', lineHeight: '1.6' }}>
                            বাংলাদেশ রেলওয়ের নিয়ম অনুযায়ী যাত্রার ১০ দিন পূর্বে সকাল ৮:০০ টা (পশ্চিমাঞ্চল) এবং দুপুর ২:০০ টা (পূর্বাঞ্চল) থেকে অফিশিয়াল ওয়েবসাইটে অগ্রিম টিকিট উন্মুক্ত হয়।
                          </p>
                        </div>
                        <a 
                          href="https://eticket.railway.gov.bd/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ backgroundColor: '#006a4e', color: 'white', padding: '10px 18px', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span>ই-টিকেট পোর্টাল</span>
                          <ExternalLink size={15} />
                        </a>
                      </div>

                      {/* অফিসিয়াল টিকিট বাতিল ও রিফান্ড নীতি */}
                      <div style={{ marginTop: '16px', backgroundColor: '#f8fafc', padding: '16px 18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <RefreshCw size={17} color="#006a4e" />
                          <h5 style={{ margin: 0, fontSize: '13.5px', color: '#1e293b', fontWeight: '800' }}>
                            বাংলাদেশ রেলওয়ে টিকিট বাতিল ও অনলাইন রিফান্ড নীতি:
                          </h5>
                        </div>
                        <div className="ts-policy-grid">
                          <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #eef2f0' }}>
                            <strong style={{ color: '#15803d' }}>যাত্রার ৪৮+ ঘণ্টা পূর্বে:</strong>
                            <p style={{ margin: '2px 0 0', color: '#64748b' }}>মাত্র ২৫% বা শ্রেণি অনুযায়ী সার্ভিস চার্জ কর্তন হয়।</p>
                          </div>
                          <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #eef2f0' }}>
                            <strong style={{ color: '#d97706' }}>যাত্রার ৪৮–২৪ ঘণ্টা পূর্বে:</strong>
                            <p style={{ margin: '2px 0 0', color: '#64748b' }}>মূল ভাড়ার ৫০% কর্তন করে বাকি অর্থ ফেরত দেওয়া হয়।</p>
                          </div>
                          <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #eef2f0' }}>
                            <strong style={{ color: '#b91c1c' }}>যাত্রার ২৪–১২ ঘণ্টা পূর্বে:</strong>
                            <p style={{ margin: '2px 0 0', color: '#64748b' }}>মূল ভাড়ার ৭৫% কর্তন করে বাকি ২৫% ফেরতযোগ্য।</p>
                          </div>
                          <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #eef2f0' }}>
                            <strong style={{ color: '#64748b' }}>যাত্রার ১২ ঘণ্টার কম সময়ে:</strong>
                            <p style={{ margin: '2px 0 0', color: '#64748b' }}>কোনো প্রকার অর্থ ফেরত বা রিফান্ড প্রযোজ্য নয়।</p>
                          </div>
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: '#64748b', fontStyle: 'italic' }}>
                          * অনলাইন টিকেটের ক্ষেত্রে অফিসিয়াল সাইটের 'Purchase History' থেকে সহজেই সেলফ-রিফান্ড আবেদন করা যায়।
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* ৪. ট্রেনের সুযোগ-সুবিধা ও কোচ গাইড */}
                <div className="ts-card">
                  <h3 style={{ fontSize: '18px', color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                    <Train size={20} color="#006a4e" /> ট্রেনের বগির ধরন ও সুযোগ-সুবিধাসমূহ
                  </h3>
                  <div className="ts-amenities-grid">
                    <div style={{ backgroundColor: '#fbfcfb', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Compass size={18} color="#006a4e" />
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#0f1f1a', fontWeight: '800' }}>শোভন চেয়ার (S_CHAIR)</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                        আরামদায়ক নন-এসি কুশন চেয়ার, প্রশস্ত লেগরুম এবং জানালার পাশে প্রাকৃতিক দৃশ্য উপভোগের সুবিধা।
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#fbfcfb', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Wind size={18} color="#006a4e" />
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#0f1f1a', fontWeight: '800' }}>স্নিগ্ধা ও এসি বগি</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                        উন্নত শীতাতপ নিয়ন্ত্রিত আধুনিক পরিবেশ, মোবাইল চার্জিং আউটলেট এবং শব্দহীন আরামদায়ক ভ্রমণ।
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#fbfcfb', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Utensils size={18} color="#006a4e" />
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#0f1f1a', fontWeight: '800' }}>অন-বোর্ড খাবার ব্যবস্থা</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                        ট্রেনে সংযুক্ত খাবার বগিতে চা, কফি, কাটলেট, ডিম খিচুড়ি এবং বোতলজাত পানির সহজলভ্য সুবিধা।
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#fbfcfb', padding: '16px', borderRadius: '16px', border: '1px solid #eef2f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <ShieldCheck size={18} color="#006a4e" />
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#0f1f1a', fontWeight: '800' }}>নিরাপত্তা ও বায়ো-টয়লেট</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#64748b', lineHeight: '1.6' }}>
                        পরিবেশবান্ধব বায়ো-টয়লেট, জিআরপি রেল পুলিশ নিরাপত্তা ও সার্বক্ষণিক ট্রেনকই লাইভ ট্র্যাকিং।
                      </p>
                    </div>
                  </div>

                  {/* লাগেজ ও মালামাল পরিবহন নীতিমালা */}
                  <div style={{ marginTop: '18px', backgroundColor: '#f0fdf4', padding: '16px 18px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <Luggage size={18} color="#006a4e" />
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#006a4e', fontWeight: '800' }}>
                        বিনা খরচে মালামাল ও লাগেজ বহনের অনুমোদন সীমা (Luggage Allowance):
                      </h4>
                    </div>
                    <div className="ts-policy-grid">
                      <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
                        <span style={{ color: '#166534', fontWeight: 'bold' }}>শোভন / শোভন চেয়ার:</span>
                        <p style={{ margin: '3px 0 0', color: '#475569' }}>একজন পূর্ণবয়স্ক যাত্রী সর্বোচ্চ <strong>৩৭.৫ কেজি</strong> মালামাল কোনো মাশুল ছাড়াই বহন করতে পারেন।</p>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
                        <span style={{ color: '#166534', fontWeight: 'bold' }}>স্নিগ্ধা ও এসি চেয়ার:</span>
                        <p style={{ margin: '3px 0 0', color: '#475569' }}>যাত্রীপ্রতি সর্বোচ্চ <strong>৫৬ কেজি</strong> মালামাল ফ্রি বহনের সুযোগ রয়েছে।</p>
                      </div>
                      <div style={{ backgroundColor: 'white', padding: '10px 12px', borderRadius: '10px', border: '1px solid #dcfce7' }}>
                        <span style={{ color: '#166534', fontWeight: 'bold' }}>অতিরিক্ত লাগেজ ও পার্সেল:</span>
                        <p style={{ margin: '3px 0 0', color: '#475569' }}>অনুমোদিত ওজনের বেশি মালামাল থাকলে স্টেশনের লাগেজ ভ্যানে বুকিং করতে হবে।</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ৫. ট্রেনভিত্তিক সাধারণ প্রশ্নোত্তর (Train-Specific FAQ Accordion) */}
                {(() => {
                  const startSt = selectedTrain.stations[0];
                  const endSt = selectedTrain.stations[selectedTrain.stations.length - 1];
                  const duration = calculateJourneyDuration(startSt?.departure, endSt?.arrival);
                  const offDayDisplay = selectedTrain.offDay && selectedTrain.offDay !== 'None' && selectedTrain.offDay !== 'নাই (None)'
                    ? selectedTrain.offDay
                    : 'কোনো সাপ্তাহিক বন্ধ নেই (সপ্তাহের ৭ দিনই চলাচল করে)';
                  const stopsList = selectedTrain.stations.slice(1, -1).slice(0, 4).map(s => s.name.split('(')[0].trim()).join(', ');
                  const isWestZone = selectedTrain.id >= 751;

                  const faqs = [
                    {
                      q: `${selectedTrain.name}-এর সাপ্তাহিক বন্ধের দিন কোনটি?`,
                      a: `${selectedTrain.name} ট্রেনের সাপ্তাহিক বন্ধের দিন হচ্ছে ${offDayDisplay}। অফ-ডে ব্যতীত সপ্তাহের অন্যান্য সব কার্যদিবসে ট্রেনটি তার নির্ধারিত অফিশিয়াল সময়সূচী অনুযায়ী চলাচল করে থাকে।`
                    },
                    {
                      q: `${startSt?.name.split('(')[0]} থেকে ${endSt?.name.split('(')[0]} পৌঁছাতে ট্রেনটির কত সময় লাগে?`,
                      a: `বাংলাদেশ রেলওয়ের সময়সূচী অনুযায়ী ${startSt?.name.split('(')[0]} থেকে ${endSt?.name.split('(')[0]} পর্যন্ত মোট ভ্রমণ সময় আনুমানিক ${duration ? duration.text : 'সময়সূচী অনুযায়ী নির্ধারিত'}। ট্রেনটির ছাড়ার সময় ${startSt?.departure || 'সময়মতো'} এবং গন্তব্যে পৌঁছানোর সময় ${endSt?.arrival || 'সময়মতো'}।`
                    },
                    {
                      q: `যাত্রাপথে ট্রেনটি কোন কোন প্রধান স্টেশনে যাত্রাবিরতি দেয়?`,
                      a: `সম্পূর্ণ রুটে ${selectedTrain.name} সর্বমোট ${selectedTrain.stations.length}টি স্টেশনে যাত্রাবিরতি প্রদান করে${stopsList ? ` যার মধ্যে ${stopsList} অন্যতম` : ''}। প্রতিটি স্টপেজের সঠিক আগমন ও প্রস্থান সময় জানতে উপরের স্টেশনভিত্তিক সময়সূচী টেবিলটি দেখুন।`
                    },
                    {
                      q: `ট্রেনটির বর্তমান লাইভ লোকেশন ও প্ল্যাটফর্ম তথ্য কীভাবে জানা যায়?`,
                      a: `ট্রেনকই (TrainKoi) ওয়েবসাইটে এই পেজের 'লাইভ লোকেশন ট্র্যাকিং' বাটনে ক্লিক করলেই স্যাটেলাইট ম্যাপে ট্রেনটির রিয়েল-টাইম অবস্থান, বর্তমান গতি এবং বিলম্বের তথ্য দেখা যায়। এছাড়া ইন্টারনেট সংযোগ না থাকলে মোবাইলের মেসেজ অপশনে গিয়ে TR ${selectedTrain.id} লিখে ১৬৩১৮ নম্বরে এসএমএস করেও অবস্থান জানা যায়।`
                    },
                    {
                      q: `${selectedTrain.name}-এর অনলাইন টিকিট কীভাবে ও কখন কাটা যায়?`,
                      a: `বাংলাদেশ রেলওয়ের অফিসিয়াল ই-টিকেট ওয়েবসাইট (eticket.railway.gov.bd) বা 'Rail Sheba' মোবাইল অ্যাপ থেকে যাত্রার ১০ দিন পূর্বে অগ্রিম টিকিট সংগ্রহ করা যায়। ${isWestZone ? 'পশ্চিমাঞ্চলের ট্রেনের টিকিট প্রতিদিন সকাল ৮:০০ টায়' : 'পূর্বাঞ্চলের ট্রেনের টিকিট প্রতিদিন দুপুর ২:০০ টায়'} উন্মুক্ত করা হয়।`
                    }
                  ];

                  return (
                    <div className="ts-card">
                      <h3 style={{ fontSize: '18px', color: '#1e293b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                        <HelpCircle size={20} color="#006a4e" /> {selectedTrain.name} — সাধারণ প্রশ্নোত্তর (FAQ)
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {faqs.map((faq, idx) => {
                          const isOpen = !!openFaq[idx];
                          return (
                            <div 
                              key={idx}
                              style={{ 
                                borderRadius: '16px', 
                                border: isOpen ? '1px solid #bbf7d0' : '1px solid #eef2f0',
                                backgroundColor: isOpen ? '#fcfdfd' : '#fff',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <button
                                onClick={() => toggleFaq(idx)}
                                style={{
                                  width: '100%',
                                  padding: '16px 20px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                              >
                                <span style={{ fontSize: '14.5px', fontWeight: '800', color: isOpen ? '#006a4e' : '#1e293b' }}>
                                  {faq.q}
                                </span>
                                {isOpen ? <ChevronUp size={18} color="#006a4e" /> : <ChevronDown size={18} color="#94a3b8" />}
                              </button>
                              {isOpen && (
                                <div style={{ padding: '0 20px 16px', fontSize: '13.5px', color: '#475569', lineHeight: '1.75', borderTop: '1px solid #f0fdf4' }}>
                                  {faq.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* ৬. যাত্রী নিরাপত্তা ও রেলওয়ে জরুরি সহায়তা */}
                <div style={{ backgroundColor: '#f0fdf4', padding: '22px 24px', borderRadius: '24px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ backgroundColor: '#006a4e', padding: '12px', borderRadius: '14px', color: 'white', display: 'flex' }}>
                      <PhoneCall size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#006a4e', fontWeight: '900' }}>
                        বাংলাদেশ রেলওয়ে জরুরি হেল্পলাইন: ১৬৪৫৯
                      </h4>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#166534' }}>
                        যাত্রী সেবা, অভিযোগ বা জরুরি সহায়তার জন্য যেকোনো মোবাইল থেকে কল করুন ১৬৪৫৯ নম্বরে।
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#006a4e', fontWeight: '700', backgroundColor: 'white', padding: '6px 14px', borderRadius: '20px', border: '1px solid #86efac' }}>
                    ট্রেনকই — নির্ভুল ও উন্মুক্ত ট্রেন তথ্য
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default TrainSchedule;
