import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { 
  ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, 
  Info, Send, ArrowRightLeft, Locate, Radio, AlertCircle, Zap, ShieldCheck
} from 'lucide-react';

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

  // ব্যাকএন্ড API থেকে লাইভ ট্রেনসমূহের স্ট্যাটাস সিঙ্ক (Native Fetch API)
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
    const interval = setInterval(fetchLiveStatus, 15000); // প্রতি ১৫ সেকেন্ড পর পর লাইভ রিফ্রেশ
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
    let currentTitle = "Train Schedule & Time Table 2026 | TrainKoi";
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
      return t.name.toLowerCase().includes(searchTerm.toLowerCase());
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
  }).slice(0, 20);

  const handleTrainSelect = (train) => {
    const slug = getCleanSlug(train.name);
    navigate(`/schedule/${slug}`);
    setSelectedTrain(train);
  };

  // SEO ফ্রেন্ডলি এবং ট্রেনকই ব্র্যান্ডেড বিস্তারিত ডেসক্রিপশন
  const generateLongDescription = (train) => {
    if (!train || !train.stations || train.stations.length === 0) return { summary: "", details: "" };
    
    const startStation = train.stations[0];
    const endStation = train.stations[train.stations.length - 1];
    const totalStops = train.stations.length;
    const offDayInfo = train.offDay && train.offDay !== 'None' ? train.offDay : 'কোনো সাপ্তাহিক বন্ধের দিন নেই';
    const trainCode = train.id || 'N/A';
    
    const hash = (train.id ? parseInt(train.id, 10) : train.name.length) || 1;
    const styleVariation = hash % 4;
    const middleStationsList = train.stations.slice(1, -1).slice(0, 4).map(s => s.name).join(', ');

    let summaryText = `${train.name} (ট্রেন নং: ${trainCode}) বাংলাদেশ রেলওয়ের নিয়মিত ট্রেন। এটি ${train.from || startStation.name} থেকে ${train.to || endStation.name} রুটে যাতায়াত করে।`;
    let detailsText = "";

    if (styleVariation === 0) {
      detailsText = `
        ${train.name} (ট্রেন নং: ${trainCode}) বাংলাদেশ রেলওয়ের অধীনে পরিচালিত একটি জনপ্রিয় ও নির্ভরযোগ্য আন্তঃনগর ট্রেন। এটি মূলত ${train.from || startStation.name} থেকে শুরু করে চূড়ান্ত গন্তব্য ${train.to || endStation.name} পর্যন্ত যাত্রীদের নিরাপদ সেবা প্রদান করে আসছে। 

        সময়সূচী ও যাত্রা বিবরণ: ট্রেনটি প্রারম্ভিক স্টেশন ${startStation.name} থেকে নির্ধারিত সময় ${startStation.departure || 'সময়মতো'} মিনিটে যাত্রা শুরু করে। দীর্ঘ যাত্রাপথ অতিক্রম করে ট্রেনটি গন্তব্য স্টেশন ${endStation.name}-এ আনুমানিক ${endStation.arrival || 'সময়মতো'} মিনিটে পৌঁছায়। যাত্রাপথে ট্রেনটি সর্বমোট ${totalStops}টি গুরুত্বপূর্ণ স্টেশনে যাত্রাবিরতি দেয়${middleStationsList ? ` যার মধ্যে ${middleStationsList} অন্যতম` : ''}।

        লাইভ ট্র্যাকিং ও ট্রেনকই সেবা: ট্রেনকই (TrainKoi) বাংলাদেশের একমাত্র আধুনিক প্ল্যাটফর্ম যেখানে আপনি কোনো রকম সাবস্ক্রিপশন ফি ছাড়াই সম্পূর্ণ ফ্রিতে ট্রেনের লাইভ লোকেশন, বর্তমান গতি ও বিলম্বের তথ্য সরাসরি স্যাটেলাইট ম্যাপে দেখতে পারবেন। ট্রেনটির নিয়মিত সাপ্তাহিক ছুটির দিন হচ্ছে ${offDayInfo}। এসএমএসের মাধ্যমে অবস্থান জানতে TR ${trainCode} লিখে ১৬৩১৮ নম্বরে এসএমএস করুন।
      `;
    } else if (styleVariation === 1) {
      detailsText = `
        বাংলাদেশ রেলওয়ের সময়ানুবর্তী আন্তঃনগর ট্রেনসমূহের মধ্যে ${train.name} অন্যতম। যাত্রীদের আরামদায়ক ও নিরাপদ গন্তব্যে পৌঁছে দিতে এই ট্রেনটি ${train.from || startStation.name} থেকে ${train.to || endStation.name} রেলপথে নিয়মিত চলাচল করে।

        স্টপেজ ও সময় ব্যবস্থাপনা: এই ট্রেনটি প্রারম্ভিক স্টেশন ${startStation.name} থেকে প্রস্থান করে ${startStation.departure || 'সময়মতো'} মিনিটে এবং যাত্রা সমাপ্ত করে ${endStation.name} স্টেশনে প্রায় ${endStation.arrival || 'সময়মতো'} মিনিটে। সম্পূর্ণ রুটে এটি ${totalStops}টি স্টেশনে যাত্রাবিরতি কার্যকর করে যাত্রী ওঠানামার সুবিধা দেয়। 

        ভ্রমণ প্রস্তুতি ও ট্রেনকই প্ল্যাটফর্ম: ট্রেনটির সাপ্তাহিক বন্ধের দিন ${offDayInfo}। যেকোনো অনাকাঙ্ক্ষিত বিলম্ব বা ট্রেনের অবস্থান তাৎক্ষণিক যাচাই করতে ব্যবহার করুন ট্রেনকই — বাংলাদেশের একমাত্র সম্পূর্ণ ফ্রি ট্র্যাকিং সেবা। এছাড়া যেকোনো সময় এসএমএস কোড TR ${trainCode} লিখে ১৬৩১৮ নম্বরে পাঠিয়েও অবস্থান নিশ্চিত হতে পারেন।
      `;
    } else if (styleVariation === 2) {
      detailsText = `
        ${train.from || startStation.name} ও ${train.to || endStation.name} স্টেশনের মধ্যে সংযোগকারী গুরুত্বপূর্ণ পরিবহন হলো ${train.name} (কোড: ${trainCode})। নিয়মিত যাত্রী ও পর্যটকদের জন্য এই ট্রেনের সেবা অত্যন্ত কার্যকর।

        রুট বিবরণ ও স্টপ কাউন্ট: যাত্রাপথে ট্রেনটি সর্বমোট ${totalStops}টি স্টপেজ কভার করে। এটি যাত্রা শুরু করে ${startStation.name} থেকে ${startStation.departure || 'নির্ধারিত সময়ে'} এবং সর্বশেষ স্টেশন ${endStation.name}-এ পৌঁছানোর আনুমানিক সময় ${endStation.arrival || 'সময়মতো'}। 

        জরুরি ট্রাভেল গাইড: ${train.name}-এর সাপ্তাহিক বন্ধ ${offDayInfo}। ট্রেন ভ্রমণের সময় সঠিক টিকিট সঙ্গে রাখুন। ট্রেনের বর্তমান স্টেশন ও রিয়েল-টাইম লাইভ লোকেশন কোনো চার্জ ছাড়াই দেখতে ভিজিট করুন ট্রেনকই (TrainKoi)। এসএমএস-এর মাধ্যমে অবস্থান জানতে টাইপ করুন TR ${trainCode} এবং পাঠিয়ে দিন ১৬৩১৮ নম্বরে।
      `;
    } else {
      detailsText = `
        দৈনন্দিন যাতায়াত ও দূরপাল্লার ভ্রমণের জন্য ${train.name} বাংলাদেশ রেলওয়ের একটি সুপরিচিত ট্রেন। এটি ${train.from || startStation.name} থেকে যাত্রা করে নির্ধারিত গন্তব্য ${train.to || endStation.name} স্টেশনে পৌঁছে থাকে।

        চলাচলের রূপরেখা: ট্রেনটির ছাড়ার সময় ${startStation.departure || 'সময়সূচী অনুযায়ী'} (${startStation.name}) এবং গন্তব্যে পৌঁছানোর সময় ${endStation.arrival || 'সময়সূচী অনুযায়ী'} (${endStation.name})। পুরো যাত্রায় এটি ${totalStops}টি মধ্যবর্তী স্টেশনে বিরতি প্রদান করে যাত্রীদের সেবা নিশ্চিত করে।

        টিপস ও সতর্কতা: ট্রেনের সাপ্তাহিক অফ-ডে: ${offDayInfo}। আপনার যাত্রা নির্বিঘ্ন করতে ট্রেনকই লাইভ লোকেশন ট্র্যাকার ও স্টেশনভিত্তিক সময়সূচী আগে থেকেই দেখে নিন। ট্রেনকই বাংলাদেশের একমাত্র নির্ভরযোগ্য ফ্রন্ট-লাইন সেবা যা সাধারণ মানুষকে ট্রেনের নিখুঁত স্যাটেলাইট লোকেশন সম্পূর্ণ ফ্রিতে প্রদান করে থাকে।
      `;
    }

    return { summary: summaryText, details: detailsText.trim() };
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
    <div style={{ backgroundColor: '#f0f4f2', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '70px' }}>
      
      {/* হেডার সেকশন */}
      <header style={{ 
        background: 'linear-gradient(135deg, #005a43 0%, #003d2d 100%)', 
        padding: '16px 20px', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
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
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedTrain ? selectedTrain.name : 'বাংলাদেশ রেলওয়ে ট্রেন শিডিউল'}
            </h1>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.85 }}>ট্রেনকই • ফ্রি লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম</p>
          </div>
        </div>
      </header>

      {/* কনটেইনার */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 16px' }}>
        
        {!selectedTrain && (
          <div style={{ display: 'flex', backgroundColor: '#e2ece6', borderRadius: '16px', padding: '5px', marginBottom: '22px', border: '1px solid #d4e5dc' }}>
            <button 
              onClick={() => setSearchMode('name')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', backgroundColor: searchMode === 'name' ? 'white' : 'transparent', color: searchMode === 'name' ? '#006a4e' : '#555', fontWeight: '800', fontSize: '14px', transition: 'all 0.2s ease', boxShadow: searchMode === 'name' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}
            >নাম দিয়ে খুঁজুন</button>
            <button 
              onClick={() => setSearchMode('route')}
              style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', backgroundColor: searchMode === 'route' ? 'white' : 'transparent', color: searchMode === 'route' ? '#006a4e' : '#555', fontWeight: '800', fontSize: '14px', transition: 'all 0.2s ease', boxShadow: searchMode === 'route' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none' }}
            >রুট দিয়ে খুঁজুন</button>
          </div>
        )}

        {!selectedTrain && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '25px', position: 'relative', border: '1px solid #eef2f0' }}>
            {searchMode === 'name' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Search size={22} color="#006a4e" />
                <input 
                  type="text" 
                  placeholder="ট্রেনের নাম বা নম্বর লিখুন (যেমন: লালমণি, চিলাহাটি, 751)..." 
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px', fontWeight: '500' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                    <Locate size={20} color="#006a4e" />
                    <input 
                      type="text" 
                      placeholder="যাত্রার প্রারম্ভিক স্টেশন লিখুন..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MapPin size={20} color="#e67e22" />
                    <input 
                      type="text" 
                      placeholder="গন্তব্য স্টেশন লিখুন..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
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

        {/* লিস্ট ভিউ */}
        {!selectedTrain ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
               <h2 style={{ color: '#555', margin: 0, fontSize: '15px', fontWeight: '800' }}>উপলব্ধ ট্রেনের সময়সূচী ({filteredTrains.length})</h2>
               {(searchTerm || source || destination) && (
                 <button onClick={() => {setSearchTerm(''); setSource(''); setDestination('');}} style={{background: 'none', border: 'none', color: '#006a4e', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'}}>ক্লিয়ার করুন</button>
               )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {filteredTrains.length > 0 ? filteredTrains.map((train, idx) => {
                const isLive = !!liveTrainsMap[Number(train.id)];
                return (
                  <div 
                    key={idx} 
                    onClick={() => handleTrainSelect(train)} 
                    style={{ 
                      backgroundColor: 'white', 
                      padding: '18px', 
                      borderRadius: '20px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer', 
                      boxShadow: '0 3px 12px rgba(0,0,0,0.03)',
                      border: isLive ? '1.5px solid #ff4d4f' : '1px solid #eef2f0',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
                          <Radio size={22} className="pulse-red" color="#ff4d4f" />
                        ) : (
                          <Clock size={22} color="#006a4e" />
                        )}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>{train.name}</span>
                          {isLive && (
                            <span style={{ backgroundColor: '#ff4d4f', color: 'white', fontSize: '10px', fontWeight: '900', padding: '2px 7px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '13px', color: '#777', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span>{train.from}</span> <ArrowRightLeft size={11} /> <span>{train.to}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown size={18} color="#bbb" />
                  </div>
                );
              }) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', color: '#888', backgroundColor: 'white', borderRadius: '22px' }}>
                  <AlertCircle size={40} color="#bbb" style={{ marginBottom: '12px' }} />
                  <p style={{ margin: 0, fontSize: '15px' }}>কোন ট্রেন খুঁজে পাওয়া যায়নি। নাম বা স্টেশন পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
                </div>
              )}
            </div>

            {/* এসইও ব্র্যান্ডিং সেকশন */}
            <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '24px', borderRadius: '22px', border: '1px solid #e5ece8', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f5ef', color: '#006a4e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
                <Zap size={16} fill="#006a4e" /> ট্রেনকই (TrainKoi) এর প্রতিশ্রুতি
              </div>
              <h3 style={{ margin: '6px 0 10px 0', fontSize: '18px', color: '#111', fontWeight: '800' }}>
                বাংলাদেশের একমাত্র প্ল্যাটফর্ম যেখানে ট্রেনের লাইভ লোকেশন দেখা যায় সম্পূর্ণ ফ্রিতে!
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.7', maxWidth: '750px', marginInline: 'auto' }}>
                কোনো হিডেন চার্জ বা সাবস্ক্রিপশন ছাড়াই দেশের যেকোনো প্রান্ত থেকে আন্তঃনগর, মেইল ও কমিউটার ট্রেনের সঠিক সময়সূচী, বর্তমান অবস্থান এবং প্ল্যাটফর্ম তথ্য জেনে নিন নিমেষেই।
              </p>
            </div>
          </div>
        ) : (
          /* ডিটেইলড শিডিউল ও লাইভ ট্র্যাকিং ইন্টারফেস */
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <button 
              onClick={() => { setSelectedTrain(null); navigate('/schedule'); }} 
              style={{ background: '#e2ede7', color: '#006a4e', border: 'none', padding: '10px 18px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              ← সময়সূচী তালিকায় ফিরে যান
            </button>
            
            <div style={{ backgroundColor: 'white', borderRadius: '28px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #edf2ef' }}>
              
              {/* ট্রেনের নাম ও লাইভ ব্যাজ */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    TRAIN #{selectedTrain.id} • বন্ধের দিন: {selectedTrain.offDay || 'কোন সাপ্তাহিক বন্ধ নেই'}
                  </div>
                  <h1 style={{ fontSize: '26px', color: '#111', margin: '6px 0 0 0', fontWeight: '900' }}>{selectedTrain.name}</h1>
                </div>

                {isSelectedTrainLive ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff1f0', border: '1.5px solid #ff4d4f', color: '#cf1322', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '800' }}>
                    <span className="live-dot-pulse"></span> ট্রেনটি এখন লাইভ চলছে
                  </div>
                ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0f9f4', border: '1px solid #b7eb8f', color: '#006a4e', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>
                    <Clock size={15} /> নির্ধারিত সময়সূচী মোড
                  </div>
                )}
              </div>

              {/* ট্র্যাকিং অ্যাকশন সেকশন (লাইভ থাকলে লাল পালসিং বাটন হবে) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '22px 0 30px 0' }}>
                
                <button 
                  onClick={() => navigate(`/track/${selectedTrain.id}`)}
                  style={{ 
                    width: '100%', 
                    background: isSelectedTrainLive 
                      ? 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)' 
                      : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '18px 24px', 
                    borderRadius: '18px', 
                    fontWeight: '900', 
                    fontSize: '16px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    cursor: 'pointer',
                    boxShadow: isSelectedTrainLive 
                      ? '0 8px 25px rgba(229,57,53,0.4)' 
                      : '0 8px 22px rgba(0,106,78,0.25)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  {isSelectedTrainLive ? (
                    <>
                      <Radio size={22} className="pulse-white" />
                      <span>লাইভ লোকেশন ও রিয়েল-টাইম ম্যাপ দেখুন</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={22} />
                      <span>লাইভ লোকেশন ও ম্যাপ ট্র্যাকিং</span>
                    </>
                  )}
                </button>

                {/* ট্রেন লাইভ থাকলে চলমান গতি ও বিলম্বের নোটিশ */}
                {isSelectedTrainLive && selectedTrainLiveData && (
                  <div style={{ backgroundColor: '#fff2f0', padding: '14px 18px', borderRadius: '16px', borderLeft: '5px solid #ff4d4f', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ color: '#444' }}>বর্তমান লাইভ স্পিড: <b style={{ color: '#111' }}>{selectedTrainLiveData.speed || 0} KM/H</b></span>
                    <span style={{ color: '#cf1322', fontWeight: 'bold' }}>বিলম্ব স্ট্যাটাস: {selectedTrainLiveData.delayText || 'সময়মতো'}</span>
                  </div>
                )}

                {/* এসএমএস ট্র্যাকিং সুবিধা */}
                <div style={{ backgroundColor: '#f0f7ff', padding: '16px 20px', borderRadius: '18px', borderLeft: '5px solid #007bff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,123,255,0.1)' }}>
                     <Send size={22} color="#007bff" />
                   </div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '13px', color: '#007bff', fontWeight: 'bold' }}>অফলাইন এসএমএস ট্র্যাকিং</h4>
                     <p style={{ margin: '3px 0 0 0', fontSize: '15px', fontWeight: '800', color: '#222' }}>
                       TR {selectedTrain.id} লিখে পাঠিয়ে দিন ১৬৩১৮ নম্বরে
                     </p>
                   </div>
                </div>

              </div>

              {/* স্টেশনভিত্তিক সময়সূচী টেবিল */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '18px', color: '#222', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
                  <MapPin size={20} color="#006a4e" /> স্টেশনভিত্তিক অফিসিয়াল সময়সূচী
                </h3>
                <span style={{ fontSize: '12px', color: '#888' }}>মোট স্টপ: {selectedTrain.stations.length}টি</span>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '32px', borderRadius: '18px', border: '1px solid #eef2f0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#005a43', color: 'white' }}>
                      <th style={{ padding: '14px 18px', fontSize: '14px' }}>স্টেশনের নাম</th>
                      <th style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'center' }}>পৌঁছানোর সময়</th>
                      <th style={{ padding: '14px 18px', fontSize: '14px', textAlign: 'center' }}>ছাড়ার সময়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTrain.stations.map((st, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fbfdfc', borderBottom: '1px solid #f0f3f1' }}>
                        <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '700', color: '#333' }}>{st.name}</td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', textAlign: 'center', color: '#666' }}>{st.arrival || '-'}</td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', textAlign: 'center', color: '#006a4e', fontWeight: '700' }}>{st.departure || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* বিস্তারিত ভ্রমণ তথ্য ও ট্রেনকই এসইও সেকশন */}
              <div style={{ backgroundColor: '#fffaf3', padding: '24px', borderRadius: '22px', border: '1px solid #ffe8cc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Info size={20} color="#d97706" />
                  <h3 style={{ fontSize: '17px', color: '#b45309', margin: 0, fontWeight: '800' }}>
                    ভ্রমণ গাইড ও লাইভ ট্র্যাকিং তথ্য
                  </h3>
                </div>
                <div style={{ fontSize: '14px', lineHeight: '2', color: '#555', textAlign: 'justify', whiteSpace: 'pre-line' }}>
                  {generateLongDescription(selectedTrain).details}
                </div>
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px dashed #fcd34d', display: 'flex', alignItems: 'center', gap: '8px', color: '#006a4e', fontSize: '13px', fontWeight: 'bold' }}>
                  <ShieldCheck size={18} />
                  <span>ট্রেনকই (TrainKoi) — সম্পূর্ণ বিনামূল্যে ট্রেনের লাইভ আপডেট দেওয়ার জন্য প্রতিশ্রুতিবদ্ধ।</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* অ্যানিমেশন ও সিএসএস স্টাইল */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .pulse-red {
          animation: pulse 1.4s infinite ease-in-out;
        }
        .pulse-white {
          animation: pulse 1.2s infinite ease-in-out;
        }
        .live-dot-pulse {
          width: 9px;
          height: 9px;
          background-color: #ff4d4f;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.2s infinite ease-in-out;
          box-shadow: 0 0 8px rgba(255, 77, 79, 0.8);
        }
      `}</style>
    </div>
  );
};

export default TrainSchedule;