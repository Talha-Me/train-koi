// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { trains } from '../data/trainData'; 

// import {
//   Search, MapPin, Settings, Bell, Navigation, ArrowRightLeft, X,
//   Train, BookOpen, User, Info, MessageSquare, ShieldAlert,
//   Ticket, Mail, LayoutGrid, Map as MapIcon, Clock, ChevronRight, Activity,
//   HelpCircle, Radio, Newspaper,
//   TrainFront, CreditCard, Gavel
// } from 'lucide-react';

// const BACKEND_URL = window.location.hostname === "localhost" 
//   ? "http://localhost:5001" 
//   : "https://train-koi.onrender.com";

// const API_BASE_URL = `${BACKEND_URL}/api`;

// const HomePage = () => {
//   const [searchMode, setSearchMode] = useState('name'); 
//   const [searchTerm, setSearchTerm] = useState('');
//   const [fromCity, setFromCity] = useState('');
//   const [toCity, setToCity] = useState('');
//   const [isMobile, setIsMobile] = useState(false);
//   const navigate = useNavigate();

//   // লাইভ ট্রেন ও কাউন্টার স্টেট
//   const [totalLiveCount, setTotalLiveCount] = useState(0);
//   const [liveTrainsList, setLiveTrainsList] = useState([]);
//   const [onDemandLiveMap, setOnDemandLiveMap] = useState({});

//   // মাউস স্ক্রল ফিক্স এবং মোবাইল ডিটেকশন
//   useEffect(() => {
//     const handleResize = () => {
//       const userAgent = navigator.userAgent || navigator.vendor || window.opera;
//       const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
//       const isSmallScreen = window.innerWidth <= 768;
//       setIsMobile(isMobileDevice || isSmallScreen);
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // ব্যাকএন্ড থেকে লাইভ ট্রেনের ডেটা ফেচ (প্রতি ১০ সেকেন্ড পর পর)
//   const fetchLiveTrainsData = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/live-trains`);
//       if (res.ok) {
//         const data = await res.json();
//         if (data && data.success) {
//           setTotalLiveCount(data.totalLive || 0);
//           setLiveTrainsList(data.trains || []);
//         }
//       }
//     } catch (err) {
//       console.error("Live trains fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLiveTrainsData();
//     const interval = setInterval(fetchLiveTrainsData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // Back Button Logic for Modal
//   const [selectedTrainGroup, setSelectedTrainGroup] = useState(() => {
//     const saved = sessionStorage.getItem('lastSelectedTrain');
//     return saved ? JSON.parse(saved) : null;
//   }); 
  
//   const [activeDirectionIndex, setActiveDirectionIndex] = useState(0); 
//   const [showSuggestions, setShowSuggestions] = useState(true);
//   const [activeInput, setActiveInput] = useState(null); 

//   useEffect(() => {
//     if (selectedTrainGroup) {
//       window.history.pushState({ modalOpen: true }, '');
//     }

//     const handlePopState = (event) => {
//       if (selectedTrainGroup) {
//         setSelectedTrainGroup(null);
//         sessionStorage.removeItem('lastSelectedTrain');
//       }
//     };

//     window.addEventListener('popstate', handlePopState);
//     return () => window.removeEventListener('popstate', handlePopState);
//   }, [selectedTrainGroup]);

//   const closeModal = () => {
//     setSelectedTrainGroup(null);
//     sessionStorage.removeItem('lastSelectedTrain');
//     if (window.history.state?.modalOpen) {
//       window.history.back();
//     }
//   };

//   const getSuggestions = (input, type) => {
//     if (!input || !showSuggestions) return [];
//     const lowInput = input.toLowerCase().trim();
//     if (type === 'name') {
//       const uniqueNames = Array.from(new Set(trains.map(t => t.name)));
//       return uniqueNames.filter(name => name.toLowerCase().includes(lowInput)).slice(0, 5);
//     } else {
//       const stations = trains.flatMap(t => t.stations.map(s => s.name));
//       const uniqueStations = Array.from(new Set(stations));
//       return uniqueStations.filter(s => s.toLowerCase().includes(lowInput)).slice(0, 5);
//     }
//   };

//   const isSearching = searchTerm.trim() !== '' || fromCity.trim() !== '' || toCity.trim() !== '';

//   const displayTrains = (() => {
//     const f = fromCity.toLowerCase().trim();
//     const t = toCity.toLowerCase().trim();
//     const s = searchTerm.toLowerCase().trim();

//     if (isSearching) {
//       const filtered = trains.filter(train => {
//         if (searchMode === 'name') {
//           return train.name.toLowerCase().includes(s) || String(train.id).includes(s);
//         } else {
//           const stationsNames = train.stations.map(st => st.name.toLowerCase());
//           return (f === '' || stationsNames.some(n => n.includes(f))) && 
//                  (t === '' || stationsNames.some(n => n.includes(t)));
//         }
//       });

//       const groups = {};
//       filtered.forEach(train => {
//         if (!groups[train.name]) groups[train.name] = [];
//         groups[train.name].push(train);
//       });
//       return Object.values(groups);
//     }

//     // একদম লেটেস্ট আপডেটেড ট্রেন অগ্রাধিকার দিয়ে সিরিয়াল অনুযায়ী সাজানো
//     const orderedLiveGroups = [];
//     const addedTrainNames = new Set();

//     if (liveTrainsList && liveTrainsList.length > 0) {
//       liveTrainsList.forEach(liveItem => {
//         const matchedTrain = trains.find(tr => Number(tr.id) === Number(liveItem.trainId));
//         if (matchedTrain && !addedTrainNames.has(matchedTrain.name)) {
//           addedTrainNames.add(matchedTrain.name);
//           const group = trains.filter(tr => tr.name === matchedTrain.name);
//           orderedLiveGroups.push(group);
//         }
//       });
//     }

//     if (orderedLiveGroups.length < 4) {
//       trains.forEach(train => {
//         if (!addedTrainNames.has(train.name)) {
//           addedTrainNames.add(train.name);
//           const group = trains.filter(tr => tr.name === train.name);
//           orderedLiveGroups.push(group);
//         }
//       });
//     }

//     return orderedLiveGroups.slice(0, 4);
//   })();

//   // অন-ডিমান্ড লাইভ চেক: যখন কোনো ট্রেন সার্চ করা হবে, সেটির সব ডিরেকশনের ফ্রেশ লাইভ লোকেশন সরাসরি চেক করা
//   useEffect(() => {
//     if (!isSearching || displayTrains.length === 0) return;

//     let isMounted = true;
//     const fetchDirectLiveInfo = async () => {
//       const topGroups = displayTrains.slice(0, 3);
//       for (const grp of topGroups) {
//         for (const tr of grp) {
//           try {
//             const res = await fetch(`${API_BASE_URL}/train-location/${tr.id}`);
//             if (res.ok) {
//               const info = await res.json();
//               if (info && (info.source === 'EXTERNAL' || info.source === 'LOCAL') && isMounted) {
//                 const diffSec = Math.max(0, Math.round((Date.now() - new Date(info.updatedAt).getTime()) / 1000));
//                 const diffMin = Math.floor(diffSec / 60);

//                 setOnDemandLiveMap(prev => ({
//                   ...prev,
//                   [tr.id]: {
//                     ...info,
//                     diffSeconds: diffSec,
//                     diffMinutes: diffMin,
//                     mode: diffMin <= 10 ? 'LIVE' : 'PREDICTED'
//                   }
//                 }));
//               }
//             }
//           } catch (e) {
//             // Ignore error
//           }
//         }
//       }
//     };

//     fetchDirectLiveInfo();
//     return () => { isMounted = false; };
//   }, [searchTerm, fromCity, toCity, isSearching]);

//   const features = [
//     { title: 'রেল সংবাদ', icon: <Newspaper size={24} />, color: '#e67e22', path: '/rail-news' },
//     { title: 'লাইভ ট্রেন', icon: <Radio size={24} />, color: '#ef4444', path: '/live-trains', isBlinking: true }, 
//     { title: 'ট্রেন ব্লগ', icon: <MessageSquare size={24} />, color: '#2ecc71', path: '/blogs' }, 
//     { title: 'ভ্রমণ আইন', icon: <ShieldAlert size={24} />, color: '#e74c3c', path: '/travel-laws' },
//     { title: 'আমাদের সম্পর্কে', icon: <Info size={24} />, color: '#34495e', path: '/about' },
//     { title: 'যোগাযোগ ও অভিযোগ', icon: <Mail size={24} />, color: '#16a085', path: '/contact' },
//     { title: 'ট্রেন শিডিউল', icon: <Clock size={24} />, color: '#006a4e', path: '/schedule' },
//     { title: 'প্রশ্ন ও উত্তর', icon: <HelpCircle size={24} />, color: '#f39c12', path: '/faq' },
//   ];

//   return (
//     <div style={{ 
//       backgroundColor: '#f4f7f6', 
//       minHeight: '100vh', 
//       width: '100%',
//       fontFamily: "'Hind Siliguri', sans-serif", 
//       paddingBottom: '100px',
//       overflowX: 'hidden',
//       overflowY: 'auto',
//       position: 'relative',
//       pointerEvents: 'auto'
//     }}>
//       <style>{`
//         @keyframes pulse-live {
//           0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
//           70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
//           100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
//         }
//         .live-badge-dot {
//           width: 8px;
//           height: 8px;
//           background-color: #ef4444;
//           border-radius: 50%;
//           animation: pulse-live 1.6s infinite;
//         }

//         @keyframes icon-blink {
//           0% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.12); opacity: 0.7; filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.8)); }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .blinking-feature-icon {
//           animation: icon-blink 1.4s ease-in-out infinite;
//         }

//         @keyframes button-glow {
//           0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
//           50% { transform: scale(1.04); box-shadow: 0 0 14px rgba(239, 68, 68, 0.8); }
//           100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
//         }
//         .tracking-btn-live {
//           animation: button-glow 1.8s ease-in-out infinite;
//           background-color: #ef4444 !important;
//         }
//       `}</style>

//       {/* Header Section */}
//       <div style={{ 
//         background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
//         padding: '30px 20px 70px', 
//         color: 'white', 
//         borderBottomLeftRadius: '40px', 
//         borderBottomRightRadius: '40px', 
//         boxShadow: '0 10px 25px rgba(0, 77, 57, 0.2)'
//       }}>
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center', 
//           maxWidth: '1200px', 
//           margin: '0 auto' 
//         }}>
//           <div 
//             onClick={() => navigate('/settings')} 
//             style={{ 
//               cursor: 'pointer', 
//               background: 'rgba(255, 255, 255, 0.15)', 
//               padding: '10px', 
//               borderRadius: '15px', 
//               display: 'flex', 
//               alignItems: 'center', 
//               backdropFilter: 'blur(5px)'
//             }}
//           >
//             <Settings size={22} />
//           </div>

//           <div style={{ textAlign: 'center' }}>
//             <h2 style={{ 
//               margin: 0, 
//               fontWeight: 900, 
//               fontSize: '28px', 
//               background: 'linear-gradient(to right, #ffffff, #e0e0e0)', 
//               WebkitBackgroundClip: 'text', 
//               WebkitTextFillColor: 'transparent', 
//             }}>
//               ট্রেনকই
//             </h2>
//             {/* লাইভ ট্র্যাকিং কাউন্টার ব্যাজ */}
//             <div 
//               onClick={() => navigate('/live-trains')}
//               style={{
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 gap: '6px',
//                 background: 'rgba(0, 0, 0, 0.25)',
//                 padding: '4px 12px',
//                 borderRadius: '20px',
//                 marginTop: '6px',
//                 cursor: 'pointer',
//                 border: '1px solid rgba(255, 255, 255, 0.2)'
//               }}
//             >
//               <span className="live-badge-dot"></span>
//               <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fef08a' }}>
//                 {totalLiveCount > 0 ? `${totalLiveCount}টি ট্রেনের লাইভ লোকেশন সচল` : 'লাইভ ট্র্যাকিং সক্রিয়'}
//               </span>
//             </div>
//           </div>

//           <div 
//             style={{ 
//               cursor: 'pointer', 
//               background: 'rgba(255, 255, 255, 0.15)', 
//               padding: '10px', 
//               borderRadius: '15px', 
//               display: 'flex', 
//               alignItems: 'center', 
//               position: 'relative', 
//               backdropFilter: 'blur(5px)'
//             }}
//           >
//             <Bell size={22} />
//             <span style={{
//               position: 'absolute',
//               top: '8px',
//               right: '8px',
//               width: '8px',
//               height: '8px',
//               backgroundColor: '#ff4b2b',
//               borderRadius: '50%',
//               border: '2px solid #006a4e'
//             }}></span>
//           </div>
//         </div>
//       </div>

//       {/* Search Container */}
//       <div style={{ margin: '-50px 20px 0', backgroundColor: 'white', borderRadius: '30px', padding: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', position: 'relative', zIndex: 10 }}>
//         <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: 15, padding: 5, marginBottom: 15 }}>
//           <button onClick={() => {setSearchMode('name'); setSearchTerm('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'name' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'name' ? '#006a4e' : '#888', cursor: 'pointer' }}>নামে সার্চ</button>
//           <button onClick={() => {setSearchMode('route'); setFromCity(''); setToCity('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'route' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'route' ? '#006a4e' : '#888', cursor: 'pointer' }}>রুট সার্চ</button>
//         </div>
        
//         {searchMode === 'name' ? (
//           <div style={{ position: 'relative' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 14, borderRadius: 16, border: '1px solid #eee' }}>
//               <Search size={20} color="#006a4e" />
//               <input type="text" placeholder="ট্রেনের নাম বা কোড লিখুন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowSuggestions(true); setActiveInput('name');}} onFocus={() => setActiveInput('name')} />
//             </div>
//             {searchTerm && activeInput === 'name' && showSuggestions && getSuggestions(searchTerm, 'name').length > 0 && (
//               <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
//                 {getSuggestions(searchTerm, 'name').map((item, i) => <div key={i} onClick={() => {setSearchTerm(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//             <div style={{ position: 'relative' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 16, border: '1px solid #eee' }}>
//                   <MapPin size={18} color="#006a4e" />
//                   <input type="text" placeholder="কোথা থেকে..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={fromCity} onChange={(e) => {setFromCity(e.target.value); setShowSuggestions(true); setActiveInput('from');}} onFocus={() => setActiveInput('from')} />
//                 </div>
//                 {fromCity && activeInput === 'from' && showSuggestions && getSuggestions(fromCity, 'route').length > 0 && (
//                   <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
//                     {getSuggestions(fromCity, 'route').map((item, i) => <div key={i} onClick={() => {setFromCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
//                   </div>
//                 )}
//             </div>
//             <div style={{ position: 'relative' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 16, border: '1px solid #eee' }}>
//                   <ArrowRightLeft size={18} color="#006a4e" />
//                   <input type="text" placeholder="কোথায় যাবেন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={toCity} onChange={(e) => {setToCity(e.target.value); setShowSuggestions(true); setActiveInput('to');}} onFocus={() => setActiveInput('to')} />
//                 </div>
//                 {toCity && activeInput === 'to' && showSuggestions && getSuggestions(toCity, 'route').length > 0 && (
//                   <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
//                     {getSuggestions(toCity, 'route').map((item, i) => <div key={i} onClick={() => {setToCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
//                   </div>
//                 )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Features Grid */}
//       <div style={{ padding: '30px 20px 10px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
//           {features.map((f, i) => (
//             <div key={i} onClick={() => f.external ? window.open(f.external, '_blank') : f.path && navigate(f.path)} 
//                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
//               <div className={f.isBlinking ? 'blinking-feature-icon' : ''} style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', position: 'relative' }}>
//                 {f.icon}
//                 {f.isBlinking && (
//                   <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
//                 )}
//               </div>
//               <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>{f.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* সার্চ রেজাল্ট বা লাইভ ট্রেনের তালিকা */}
//       <div style={{ padding: '20px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <h4 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>
//               {isSearching ? `অনুসন্ধানের ফলাফল (${displayTrains.length}টি)` : 'লাইভ ট্রেন'}
//             </h4>
//             {!isSearching && (
//               <span className="live-badge-dot" style={{ display: 'inline-block' }}></span>
//             )}
//           </div>
//           {!isSearching && (
//             <span onClick={() => navigate('/live-trains')} style={{ fontSize: '12px', color: '#006a4e', fontWeight: 'bold', cursor: 'pointer' }}>
//               সবগুলো দেখুন ➔
//             </span>
//           )}
//         </div>

//         {displayTrains.length === 0 ? (
//           <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '30px', textAlign: 'center', color: '#64748b' }}>
//             কোনো ট্রেন খুঁজে পাওয়া যায়নি।
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//             {displayTrains.map((group, idx) => {
//               // গ্রুপের সব ডিরেকশনের লাইভ ডেটা বের করা
//               const groupIds = group.map(t => Number(t.id));
              
//               const matchedItems = [];
//               groupIds.forEach(gid => {
//                 if (onDemandLiveMap[gid]) {
//                   matchedItems.push(onDemandLiveMap[gid]);
//                 } else {
//                   const foundInGlobal = liveTrainsList.find(lt => Number(lt.trainId) === gid);
//                   if (foundInGlobal) matchedItems.push(foundInGlobal);
//                 }
//               });

//               // প্রায়োরিটি ফিল্টারিং:
//               // ১. যে ট্রেনের গতি রয়েছে (speed > 0) অথবা স্টেশন অতিক্রম করেছে (index/stopsCleared > 0)
//               // ২. যার diffMinutes ১০ মিনিটের ভেতরে রয়েছে (actually live)
//               // ৩. সর্বশেষ diffSeconds অনুযায়ী ফ্রেশ
//               const activeLiveInfo = matchedItems.length > 0 
//                 ? [...matchedItems].sort((a, b) => {
//                     const aSpeed = Number(a.speed || 0);
//                     const bSpeed = Number(b.speed || 0);
//                     const aPassedStops = Number(a.index || a.stopsCleared || 0);
//                     const bPassedStops = Number(b.index || b.stopsCleared || 0);
                    
//                     const aIsMoving = (aSpeed > 0 || aPassedStops > 0) ? 1 : 0;
//                     const bIsMoving = (bSpeed > 0 || bPassedStops > 0) ? 1 : 0;

//                     if (bIsMoving !== aIsMoving) {
//                       return bIsMoving - aIsMoving;
//                     }

//                     const aFresh = Number(a.diffMinutes || 0) <= 10 ? 1 : 0;
//                     const bFresh = Number(b.diffMinutes || 0) <= 10 ? 1 : 0;

//                     if (bFresh !== aFresh) {
//                       return bFresh - aFresh;
//                     }

//                     return Number(a.diffSeconds || 0) - Number(b.diffSeconds || 0);
//                   })[0] 
//                 : null;

//               const hasData = Boolean(activeLiveInfo);
//               const isActuallyLive = hasData && Number(activeLiveInfo.diffMinutes) <= 10;
//               const isPredicted = hasData && Number(activeLiveInfo.diffMinutes) > 10;

//               // সক্রিয় রানিং ট্রেন আইডি অনুযায়ী গ্রুপের নির্দিষ্ট ডিরেকশন শনাক্তকরণ (৭৯৫ বনাম ৭৯৬)
//               const targetDirectionIndex = activeLiveInfo 
//                 ? group.findIndex(t => Number(t.id) === Number(activeLiveInfo.trainId))
//                 : 0;
//               const initialIndex = targetDirectionIndex >= 0 ? targetDirectionIndex : 0;
//               const displayTrainId = activeLiveInfo ? activeLiveInfo.trainId : group[0].id;

//               return (
//                 <div 
//                   key={idx} 
//                   onClick={() => {
//                     setSelectedTrainGroup(group); 
//                     setActiveDirectionIndex(initialIndex); 
//                     sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
//                   }} 
//                   style={{ 
//                     backgroundColor: 'white', 
//                     borderRadius: '25px', 
//                     padding: '16px', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: '15px', 
//                     boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
//                     borderTop: '1px solid #f0f0f0', 
//                     borderRight: '1px solid #f0f0f0', 
//                     borderBottom: '1px solid #f0f0f0', 
//                     borderLeft: `6px solid ${isActuallyLive ? '#ef4444' : (isPredicted ? '#f59e0b' : '#006a4e')}`, 
//                     cursor: 'pointer' 
//                   }}
//                 >
//                   <div style={{ width: '70px', height: '70px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f8f9fa', flexShrink: 0 }}>
//                     <img src="/homeimg.png" alt={group[0].name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//                   </div>
//                   <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//                         <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold' }}>
//                           কোড: {displayTrainId}
//                         </span>
//                         {isActuallyLive && (
//                           <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
//                             <span className="live-badge-dot" style={{ width: '5px', height: '5px' }}></span>
//                             LIVE • {activeLiveInfo.diffMinutes === 0 ? 'Just now' : `${activeLiveInfo.diffMinutes}m ago`}
//                           </span>
//                         )}
//                         {isPredicted && (
//                           <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '9px', fontWeight: 'bold', padding: '1px 6px', borderRadius: '4px' }}>
//                             PREDICTED • {activeLiveInfo.diffMinutes}m ago
//                           </span>
//                         )}
//                       </div>
//                       <h4 style={{ margin: '2px 0', fontSize: '16px', color: '#1e293b', fontWeight: '800' }}>{group[0].name}</h4>
//                       <span style={{ fontSize: '11px', color: '#94a3b8' }}>ছুটি: {group[0].offDay}</span>
//                     </div>
//                     <button 
//                       onClick={(e) => {
//                         e.stopPropagation(); 
//                         if (isActuallyLive && activeLiveInfo) {
//                           navigate(`/track/${activeLiveInfo.trainId}`);
//                         } else {
//                           setSelectedTrainGroup(group); 
//                           setActiveDirectionIndex(initialIndex); 
//                           sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
//                         }
//                       }} 
//                       className={isActuallyLive ? 'tracking-btn-live' : ''}
//                       style={{ 
//                         backgroundColor: isActuallyLive ? '#ef4444' : (isPredicted ? '#f59e0b' : '#006a4e'), 
//                         color: 'white', 
//                         border: 'none', 
//                         padding: '10px 14px', 
//                         borderRadius: '12px', 
//                         fontSize: '11px', 
//                         fontWeight: 'bold', 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         gap: '5px', 
//                         cursor: 'pointer', 
//                         transition: 'all 0.3s ease' 
//                       }}
//                     >
//                       <Activity size={14} /> Tracking
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* App Download Banner */}
//       {isMobile && (
//         <div style={{ margin: '10px 20px 25px', background: 'linear-gradient(135deg, #005a38 0%, #00331e 100%)', borderRadius: '24px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0, 51, 30, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
//           <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', opacity: 0.08, color: 'white', transform: 'rotate(-20deg)' }}>
//             <TrainFront size={90} />
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '15px', zIndex: 1 }}>
//             <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: '10px', borderRadius: '16px', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//               <HelpCircle size={22} style={{ transform: 'rotate(180deg)' }} />
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
//               <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>Official App</span>
//               <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '800', lineHeight: '1.4' }}>সব ধরনের আপডেট পেতে এখনই TrainKoi অ্যাপটি ডাউনলোড করে নিন!</span>
//             </div>
//           </div>
//           <a href="https://drive.google.com/file/d/1jZ76l2WU60VgupVeUm7p6U4oyAJCn9R5/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#eab308', color: '#000000', fontWeight: '900', fontSize: '13px', padding: '12px 20px', borderRadius: '14px', textDecoration: 'none', whiteSpace: 'nowrap', boxShadow: '0 5px 15px rgba(234, 179, 8, 0.4)', zIndex: 1 }}>ডাউনলোড</a>
//         </div>
//       )}
// {/* Metro Rail Section */}
//       <div style={{ padding: '0 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
//         <div 
//           onClick={() => navigate('/metro-rail')} 
//           style={{ 
//             background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)', 
//             borderRadius: '25px', 
//             padding: '24px', 
//             color: 'white', 
//             boxShadow: '0 12px 25px rgba(0,131,82,0.18)', 
//             position: 'relative', 
//             overflow: 'hidden', 
//             cursor: 'pointer' 
//           }}
//         >
//           <TrainFront size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />
//           <div style={{ position: 'relative', zIndex: 1 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
//               <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 <TrainFront size={20} />
//               </div>
//               <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>
//                 Dhaka Metro Rail (MRT Line-6)
//               </span>
//             </div>
            
//             <h2 style={{ margin: '0 0 6px 0', fontSize: '22px', fontWeight: '900' }}>বাংলাদেশ মেট্রো রেল গাইড</h2>
//             <p style={{ margin: '0 0 18px 0', fontSize: '13px', opacity: 0.85, lineHeight: '1.6', maxWidth: '90%' }}>
//               উত্তরা উত্তর থেকে মতিঝিল ও কমলাপুর রুটের সময়সূচী, ভাড়া তালিকা, এমআরটি পাস রিচার্জ ও বিধিনিষেধের পূর্ণাঙ্গ তথ্য।
//             </p>
            
//             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
//               {[
//   { icon: <Clock size={15} />, text: 'সময়সূচী ও হেডওয়ে' },
//   { icon: <CreditCard size={15} />, text: 'র‌্যাপিড ও এমআরটি পাস' },
//   { icon: <MapIcon size={15} />, text: 'স্টেশন রুট ম্যাপ' },
//   { icon: <Gavel size={15} />, text: 'ভ্রমণ নির্দেশিকা' }
// ].map((item, i) => (
//   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '9px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(5px)' }}>
//     {item.icon} {item.text}
//   </div>
// ))}
//             </div>

//             <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold' }}>
//               বিস্তারিত তথ্য দেখুন <ChevronRight size={16} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* SEO & AdSense High-Value Content Block (Clean Card Format) */}
//       <div style={{ padding: '0 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
//         <div style={{ 
//           backgroundColor: 'white', 
//           borderRadius: '25px', 
//           padding: '24px', 
//           boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
//           borderTop: '1px solid #f0f0f0', 
//           borderRight: '1px solid #f0f0f0', 
//           borderBottom: '1px solid #f0f0f0', 
//           borderLeft: '6px solid #006a4e',
//           color: '#334155'
//         }}>
          
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
//             <div style={{ backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006a4e' }}>
//               <Train size={20} />
//             </div>
//             <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#006a4e' }}>
//               ট্রেনকই – বাংলাদেশ রেলওয়ের স্মার্ট ট্র্যাকিং ও সময়সূচী প্ল্যাটফর্ম
//             </h2>
//           </div>

//           <p style={{ fontSize: '13px', lineHeight: '1.8', marginBottom: '20px', textAlign: 'justify', color: '#475569' }}>
//             বাংলাদেশ রেলওয়ের নেটওয়ার্ক দেশের লাখো মানুষের দৈনন্দিন যোগাযোগের অন্যতম প্রধান মাধ্যম। কিন্তু দূরপাল্লার ট্রেনগুলোতে ভ্রমণ করার ক্ষেত্রে সময়ানুবর্তিতা, ট্রেনের বিলম্ব (Delay), সঠিক প্ল্যাটফর্ম ও লাইভ লোকেশন জানা যাত্রীদের জন্য একটি বড় চ্যালেঞ্জ। সাধারণ যাত্রী, পর্যটক এবং নিয়মিত ট্রাভেলারদের এই ভোগান্তি কমাতে <strong>ট্রেনকই</strong> তৈরি করেছে একটি স্বয়ংসম্পূর্ণ ডিজিটাল গাইডলাইন। আমাদের লক্ষ্য হলো যাত্রীদের হাতে সরাসরি রিয়েল-টাইম তথ্য পৌঁছে দেওয়া, যাতে ভ্রমণের পরিকল্পনা হয় সহজ ও স্বাচ্ছন্দ্যময়।
//           </p>

//           <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', marginBottom: '12px' }}>
//             প্ল্যাটফর্মের প্রধান বৈশিষ্ট্য ও সেবাসমূহ:
//           </h3>
          
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '22px' }}>
            
//             <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
//               <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800', color: '#006a4e' }}>
//                 ১. ক্রাউডসোর্সড লাইভ ট্র্যাকিং
//               </h4>
//               <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: '#64748b' }}>
//                 ট্রেনে অবস্থানরত যাত্রীদের শেয়ার করা রিয়েল-টাইম জিপিএস এবং স্মার্ট অ্যালগরিদমের সমন্বয়ে ট্রেনের সঠিক গতি ও পরবর্তী স্টেশনের দূরত্ব প্রদর্শন করা হয়।
//               </p>
//             </div>

//             <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
//               <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800', color: '#006a4e' }}>
//                 ২. আন্তঃনগর ট্রেনের সময়সূচী
//               </h4>
//               <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: '#64748b' }}>
//                 ঢাকা, চট্টগ্রাম, রাজশাহী, সিলেট ও উত্তরবঙ্গসহ সারাদেশের সকল ট্রেনের রুট, স্টপেজ লিস্ট, যাত্রা শুরুর সময় এবং সাপ্তাহিক ছুটির দিনের হালনাগাদ তথ্য।
//               </p>
//             </div>

//             <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
//               <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800', color: '#006a4e' }}>
//                 ৩. ঢাকা মেট্রো রেল পূর্ণাঙ্গ গাইড
//               </h4>
//               <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: '#64748b' }}>
//                 এমআরটি লাইন-৬ এর পিক ও অফ-পিক আওয়ারের ট্রেনের শিডিউল, সর্বনিম্ন ২০ টাকা থেকে সর্বোচ্চ ১০০ টাকার পূর্ণাঙ্গ ভাড়া তালিকা এবং ভ্রমণ নির্দেশিকা।
//               </p>
//             </div>

//             <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
//               <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '800', color: '#006a4e' }}>
//                 ৪. টিকিট ও রিফান্ড নীতি সহায়তা
//               </h4>
//               <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: '#64748b' }}>
//                 অনলাইনে বাংলাদেশ রেলওয়ের ই-টিকেট পোর্টালে একাউন্ট খোলা, টিকিট বুকিং নিয়ম, যাত্রা বাতিলের শর্ত এবং রিফান্ড পাওয়ার আইনি নির্দেশিকা।
//               </p>
//             </div>

//           </div>

//           <div style={{ backgroundColor: '#f0fdf4', padding: '14px 18px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #dcfce7' }}>
//             <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '800', color: '#166534' }}>
//               সচেতনতা ও দায়িত্বশীল ব্যবহার
//             </h4>
//             <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.7', color: '#15803d' }}>
//               ট্রেনের আনুমানিক সময়সূচী ট্রাফিক কন্ডিশন, আবহাওয়া ও লাইনের সিগন্যালিং ব্যবস্থার কারণে পরিবর্তিত হতে পারে। যাত্রীদের অনুরোধ করা হচ্ছে স্টেশনে পৌঁছানোর জন্য সর্বদা নির্ধারিত শিডিউলের কিছুটা আগে উপস্থিতি নিশ্চিত করতে।
//             </p>
//           </div>

//           <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
//             <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#94a3b8', margin: 0 }}>
//               <strong>দায়মুক্তি ও ঘোষণা (Disclaimer):</strong> ট্রেনকই একটি স্বাধীন, কমিউনিটি-চালিত তথ্য ও ট্র্যাকিং প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ে (BR) কিংবা ঢাকা ম্যাস ট্রানজিট কোম্পানি লিমিটেড (DMTCL)-এর কোনো আনুষ্ঠানিক সরকারি অঙ্গপ্রতিষ্ঠান নয়। সকল তথ্য কেবলমাত্র সাধারণ যাত্রীদের সহযোগিতার স্বার্থে উন্মুক্ত উৎস ও শিডিউল পর্যালোচনা করে পরিবেশন করা হয়েছে।
//             </p>
//           </div>

//         </div>
//       </div>

  

//       {/* Stoppage Modal */}
//       {selectedTrainGroup && (
//         <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
//           <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '25px 20px', maxHeight: '85vh', overflowY: 'auto' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
//               <div>
//                 <h3 style={{ margin: 0, color: '#006a4e' }}>{selectedTrainGroup[activeDirectionIndex].name}</h3>
//                 <span style={{ fontSize: 12, color: '#999' }}>কোড: {selectedTrainGroup[activeDirectionIndex].id}</span>
//               </div>
//               <X onClick={closeModal} style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', borderRadius: '50%', padding: 5 }} />
//             </div>

//             <div style={{ backgroundColor: '#fff5f5', color: '#e53935', fontSize: '12px', fontWeight: 'bold', padding: '10px', borderRadius: '12px', marginBottom: '15px', textAlign: 'center', border: '1px solid #ffebee' }}>
//               ট্রেনের লাইভ লোকেশন জানতে দয়া করে সঠিক রুটটি সিলেক্ট করুন
//             </div>

//             {selectedTrainGroup.length > 1 && (
//               <div style={{ display: 'flex', gap: 10, marginBottom: 20, backgroundColor: '#f5f5f5', padding: 5, borderRadius: 15 }}>
//                 {selectedTrainGroup.map((t, i) => (
//                   <button key={i} onClick={() => setActiveDirectionIndex(i)} style={{ flex: 1, padding: '10px 5px', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 'bold', backgroundColor: activeDirectionIndex === i ? 'white' : 'transparent', color: activeDirectionIndex === i ? '#006a4e' : '#777', cursor: 'pointer' }}>
//                     {t.from.split('(')[0]} ➔ {t.to.split('(')[0]}
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div style={{ marginBottom: 20, padding: '15px', backgroundColor: '#e8f5e9', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>
//                    <div style={{ fontSize: '10px', color: '#1b5e20', fontWeight: 'bold' }}>সাপ্তাহিক ছুটি</div>
//                    <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{selectedTrainGroup[activeDirectionIndex].offDay}</div>
//                 </div>
//                 <button onClick={() => navigate(`/track/${selectedTrainGroup[activeDirectionIndex].id}`)} style={{ backgroundColor: '#006a4e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
//                   <Navigation size={14} /> লাইভ ট্র্যাকিং
//                 </button>
//             </div>

//             <div style={{ padding: '0 10px' }}>
//               {selectedTrainGroup[activeDirectionIndex].stations.map((st, i) => (
//                 <div key={i} style={{ display: 'flex', gap: 20, marginBottom: 20, position: 'relative' }}>
//                   <div style={{ minWidth: 65, fontSize: '13px', fontWeight: '800', color: '#006a4e', textAlign: 'right' }}>
//                     {st.departure !== '--:--' ? st.departure : st.arrival}
//                   </div>
//                   <div style={{ borderLeft: '2px solid #eee', paddingLeft: 20, position: 'relative', flex: 1 }}>
//                     <div style={{ width: 12, height: 12, backgroundColor: 'white', border: '3px solid #006a4e', borderRadius: '50%', position: 'absolute', left: -7, top: 4 }}></div>
//                     <div style={{ fontWeight: '700', fontSize: '15px' }}>{st.name}</div>
//                     <div style={{ fontSize: '11px', color: '#888' }}>প্রবেশ: {st.arrival} | ত্যাগ: {st.departure}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trains } from '../data/trainData'; 

import {
  Search, MapPin, Settings, Bell, Navigation, ArrowRightLeft, X,
  Train, BookOpen, User, Info, MessageSquare, ShieldAlert,
  Ticket, Mail, LayoutGrid, Map as MapIcon, Clock, ChevronRight, Activity,
  HelpCircle, Radio, Newspaper,
  TrainFront, CreditCard, Gavel
} from 'lucide-react';

const BACKEND_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001" 
  : "https://train-koi.onrender.com";

const API_BASE_URL = `${BACKEND_URL}/api`;

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

    // একদম লেটেস্ট আপডেটেড ট্রেন অগ্রাধিকার দিয়ে সিরিয়াল অনুযায়ী সাজানো
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

  // মেট্রো কার্ডের চিপ
  const metroChips = [
    { icon: <Clock size={14} />, text: 'সময়সূচী ও হেডওয়ে' },
    { icon: <CreditCard size={14} />, text: 'র‌্যাপিড ও এমআরটি পাস' },
    { icon: <MapIcon size={14} />, text: 'স্টেশন রুট ম্যাপ' },
    { icon: <Gavel size={14} />, text: 'ভ্রমণ নির্দেশিকা' },
  ];

  // প্ল্যাটফর্মের সেবাসমূহ
  const platformServices = [
    {
      n: '১',
      title: 'ক্রাউডসোর্সড লাইভ ট্র্যাকিং',
      text: 'ট্রেনে অবস্থানরত যাত্রীদের শেয়ার করা রিয়েল-টাইম জিপিএস এবং স্মার্ট অ্যালগরিদমের সমন্বয়ে ট্রেনের সঠিক গতি ও পরবর্তী স্টেশনের দূরত্ব প্রদর্শন করা হয়।'
    },
    {
      n: '২',
      title: 'আন্তঃনগর ট্রেনের সময়সূচী',
      text: 'ঢাকা, চট্টগ্রাম, রাজশাহী, সিলেট ও উত্তরবঙ্গসহ সারাদেশের সকল ট্রেনের রুট, স্টপেজ লিস্ট, যাত্রা শুরুর সময় এবং সাপ্তাহিক ছুটির দিনের হালনাগাদ তথ্য।'
    },
    {
      n: '৩',
      title: 'ঢাকা মেট্রো রেল পূর্ণাঙ্গ গাইড',
      text: 'এমআরটি লাইন-৬ এর পিক ও অফ-পিক আওয়ারের ট্রেনের শিডিউল, সর্বনিম্ন ২০ টাকা থেকে সর্বোচ্চ ১০০ টাকার পূর্ণাঙ্গ ভাড়া তালিকা এবং ভ্রমণ নির্দেশিকা।'
    },
    {
      n: '৪',
      title: 'টিকিট ও রিফান্ড নীতি সহায়তা',
      text: 'অনলাইনে বাংলাদেশ রেলওয়ের ই-টিকেট পোর্টালে একাউন্ট খোলা, টিকিট বুকিং নিয়ম, যাত্রা বাতিলের শর্ত এবং রিফান্ড পাওয়ার আইনি নির্দেশিকা।'
    },
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

        /* মেট্রো ও তথ্য সেকশন */
        .hp-metro-card { transition: transform .2s ease, box-shadow .2s ease; }
        .hp-metro-card:hover { transform: translateY(-2px); box-shadow: 0 16px 30px rgba(0,131,82,0.28) !important; }
        .hp-metro-card:active { transform: scale(0.99); }
        .hp-service-card { transition: border-color .2s ease, box-shadow .2s ease; }
        .hp-service-card:hover { border-color: #b7e4d0 !important; box-shadow: 0 10px 22px -16px rgba(0,106,78,0.45); }
        @media (max-width: 640px) {
          .hp-metro-btn { width: 100%; justify-content: center; }
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
                {totalLiveCount > 0 ? `${totalLiveCount}টি ট্রেনের লাইভ লোকেশন সচল` : 'লাইভ ট্র্যাকিং সক্রিয়'}
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

              // প্রায়োরিটি ফিল্টারিং:
              // ১. যে ট্রেনের গতি রয়েছে (speed > 0) অথবা স্টেশন অতিক্রম করেছে (index/stopsCleared > 0)
              // ২. যার diffMinutes ১০ মিনিটের ভেতরে রয়েছে (actually live)
              // ৩. সর্বশেষ diffSeconds অনুযায়ী ফ্রেশ
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

              // সক্রিয় রানিং ট্রেন আইডি অনুযায়ী গ্রুপের নির্দিষ্ট ডিরেকশন শনাক্তকরণ (৭৯৫ বনাম ৭৯৬)
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

      {/* ================= Metro Rail Section ================= */}
      <div style={{ padding: '10px 20px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>ঢাকা মেট্রো রেল</h4>
          <span onClick={() => navigate('/metro-rail')} style={{ fontSize: '12px', color: '#006a4e', fontWeight: 'bold', cursor: 'pointer' }}>
            সবগুলো দেখুন ➔
          </span>
        </div>

        <div
          className="hp-metro-card"
          onClick={() => navigate('/metro-rail')}
          style={{
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '15px',
            padding: '16px',
            color: 'white',
            borderRadius: '25px',
            background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)',
            boxShadow: '0 12px 25px rgba(0,131,82,0.18)',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            borderRight: '1px solid rgba(255,255,255,0.12)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            borderLeft: '6px solid #6ee7b7'
          }}
        >
          <TrainFront size={130} style={{ position: 'absolute', right: '-18px', bottom: '-28px', opacity: 0.08, transform: 'rotate(-15deg)', pointerEvents: 'none' }} />

          {/* আইকন টাইল (উপরের ট্রেন কার্ডের ছবির মতো) */}
          <div style={{ width: '70px', height: '70px', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <TrainFront size={34} />
          </div>

          <div style={{ flex: '1 1 240px', minWidth: 0, position: 'relative', zIndex: 1 }}>
            <span style={{ color: '#a7f3d0', fontSize: '10px', fontWeight: 'bold' }}>
              এমআরটি লাইন-৬ • উত্তরা উত্তর – মতিঝিল – কমলাপুর
            </span>
            <h3 style={{ margin: '2px 0 4px', fontSize: '16px', fontWeight: '800', color: '#fff' }}>
              বাংলাদেশ মেট্রো রেল গাইড
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: '12px', lineHeight: '1.65', color: 'rgba(255,255,255,0.82)' }}>
              সময়সূচী, ভাড়া তালিকা, এমআরটি পাস রিচার্জ ও বিধিনিষেধের পূর্ণাঙ্গ তথ্য।
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {metroChips.map((chip, i) => (
                <span
                  key={i}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.18)' }}
                >
                  {chip.icon} {chip.text}
                </span>
              ))}
            </div>
          </div>

          <button
            className="hp-metro-btn"
            onClick={(e) => { e.stopPropagation(); navigate('/metro-rail'); }}
            style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 14px', border: 'none', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#005a38', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            বিস্তারিত দেখুন <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ================= SEO & AdSense Content Section ================= */}
<div style={{ padding: '10px 20px 20px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
    <h4 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>ট্রেনকই সম্পর্কে</h4>
  </div>

  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '25px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
      borderTop: '1px solid #f0f0f0',
      borderRight: '1px solid #f0f0f0',
      borderBottom: '1px solid #f0f0f0',
      borderLeft: '6px solid #006a4e',
      color: '#334155'
    }}
  >
    {/* শিরোনাম */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '14px' }}>
      <div style={{ width: '70px', height: '70px', borderRadius: '15px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#006a4e', flexShrink: 0 }}>
        <Train size={32} />
      </div>

      <div style={{ minWidth: 0 }}>
        <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold' }}>
          বাংলাদেশ রেলওয়ে ট্রেন ট্র্যাকিং ও সময়সূচী
        </span>

        <h2 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: '800', color: '#1e293b', lineHeight: '1.5' }}>
          ট্রেনকই – বাংলাদেশ রেলওয়ের স্মার্ট ট্র্যাকিং ও সময়সূচী প্ল্যাটফর্ম
        </h2>
      </div>
    </div>

    {/* Intro */}
    <p style={{ margin: '0 0 16px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      বাংলাদেশে প্রতিদিন হাজার হাজার যাত্রী আন্তঃনগর, মেইল ও কমিউটার ট্রেনে এক জেলা থেকে অন্য জেলায় যাতায়াত করেন। 
      ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, সিলেট, রংপুর, ময়মনসিংহসহ দেশের বিভিন্ন গুরুত্বপূর্ণ শহর ও অঞ্চলের মানুষের জন্য 
      বাংলাদেশ রেলওয়ে একটি গুরুত্বপূর্ণ ও তুলনামূলকভাবে সাশ্রয়ী পরিবহন ব্যবস্থা। তবে ট্রেনে ভ্রমণের আগে 
      ট্রেনের সময়সূচী, বর্তমান অবস্থান, সম্ভাব্য বিলম্ব এবং কোন স্টেশনের দিকে ট্রেনটি যাচ্ছে—এসব তথ্য দ্রুত জানা 
      অনেক সময় কঠিন হয়ে পড়ে।
    </p>

    <p style={{ margin: '0 0 22px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      এই সমস্যা কিছুটা সহজ করার উদ্দেশ্যেই <strong style={{ color: '#006a4e' }}>ট্রেনকই</strong> তৈরি করা হয়েছে। 
      এটি একটি স্বাধীন অনলাইন ট্রেন তথ্য ও লাইভ ট্র্যাকিং প্ল্যাটফর্ম, যেখানে যাত্রীরা বাংলাদেশ রেলওয়ের 
      বিভিন্ন ট্রেনের সময়সূচী, রুট, স্টেশন এবং উপলব্ধ ট্র্যাকিং তথ্য এক জায়গা থেকে দেখতে পারেন। 
      আমাদের লক্ষ্য হলো জটিল তথ্যকে সহজভাবে উপস্থাপন করা, যাতে একজন সাধারণ যাত্রীও মোবাইল ফোন থেকেই 
      তার কাঙ্ক্ষিত ট্রেন সম্পর্কে প্রয়োজনীয় তথ্য খুঁজে নিতে পারেন।
    </p>

    {/* কেন ট্রেনকই */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      ট্রেনকই কেন তৈরি করা হয়েছে?
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ট্রেনে যাত্রা করার সময় শুধু নির্ধারিত সময়সূচী জানাই সবসময় যথেষ্ট নয়। কোনো ট্রেন নির্ধারিত সময়ের 
      তুলনায় দেরিতে চলতে পারে, কোনো স্টেশনে বেশি সময় অপেক্ষা করতে পারে অথবা রুটের বিভিন্ন কারণে 
      যাত্রার সময় পরিবর্তিত হতে পারে। বিশেষ করে দীর্ঘ দূরত্বের যাত্রায় ট্রেনের বর্তমান অবস্থান সম্পর্কে 
      ধারণা থাকলে যাত্রীরা স্টেশনে অপেক্ষা করার সময় এবং যাত্রার পরিকল্পনা আরও ভালোভাবে করতে পারেন।
    </p>

    <p style={{ margin: '0 0 22px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ট্রেনকই এমন একটি সহজ ও ব্যবহারবান্ধব প্ল্যাটফর্ম তৈরি করতে চায় যেখানে ট্রেনের তথ্য খুঁজে পাওয়ার জন্য 
      যাত্রীকে একাধিক জায়গায় যেতে না হয়। ট্রেনের নাম বা নম্বর নির্বাচন করে রুট, স্টেশন এবং উপলব্ধ 
      ট্র্যাকিং তথ্য দেখা যায়। প্ল্যাটফর্মটির মূল উদ্দেশ্য কোনো সরকারি সেবা প্রতিস্থাপন করা নয়; বরং 
      সাধারণ যাত্রীদের জন্য রেল ভ্রমণ-সংক্রান্ত তথ্যকে আরও সহজলভ্য ও বোধগম্য করে তোলা।
    </p>

    {/* প্রধান বৈশিষ্ট্য */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      ট্রেনকই-এর প্রধান বৈশিষ্ট্য ও সেবাসমূহ
    </h3>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
      {platformServices.map((s) => (
        <div
          key={s.n}
          className="hp-service-card"
          style={{
            display: 'flex',
            gap: '12px',
            padding: '14px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '18px',
            border: '1px solid #f1f5f9'
          }}
        >
          <span
            style={{
              flexShrink: 0,
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '800',
              color: '#006a4e',
              backgroundColor: '#e8f5e9'
            }}
          >
            {s.n}
          </span>

          <div style={{ minWidth: 0 }}>
            <h4
              style={{
                margin: '0 0 5px',
                fontSize: '14px',
                fontWeight: '800',
                color: '#1e293b',
                lineHeight: '1.45'
              }}
            >
              {s.title}
            </h4>

            <p
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: '1.7',
                color: '#64748b'
              }}
            >
              {s.text}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* ট্রেন ট্র্যাকিং সম্পর্কে */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      বাংলাদেশ রেলওয়ে ট্রেন ট্র্যাকিং কীভাবে কাজে আসে?
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ট্রেন ট্র্যাকিংয়ের মাধ্যমে একজন যাত্রী তার ট্রেনের চলমান অবস্থান সম্পর্কে ধারণা পেতে পারেন। 
      উদাহরণস্বরূপ, কোনো আন্তঃনগর ট্রেন নির্ধারিত সময়ে স্টেশনে না পৌঁছালে যাত্রী ট্রেনের বর্তমান 
      অবস্থান এবং সম্ভাব্য অগ্রগতির তথ্য দেখে অপেক্ষার সময় সম্পর্কে একটি বাস্তবসম্মত ধারণা নিতে পারেন। 
      পরিবারের সদস্যরা কোনো যাত্রীর ট্রেন কোথায় আছে সে সম্পর্কেও ধারণা পেতে পারেন।
    </p>

    <p style={{ margin: '0 0 22px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      তবে ট্রেনের লাইভ অবস্থান বা বিলম্বের তথ্যকে সবসময় আনুমানিক তথ্য হিসেবে বিবেচনা করা উচিত। 
      রেলপথের সিগন্যাল, স্টেশন ব্যবস্থাপনা, ট্রেনের ক্রসিং, আবহাওয়া, যান্ত্রিক সমস্যা এবং অন্যান্য 
      পরিচালনাগত কারণে ট্রেনের অবস্থান ও সময় পরিবর্তিত হতে পারে।
    </p>

    {/* সময়সূচী */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      ট্রেনের সময়সূচী ও রুট তথ্য
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ভ্রমণের পরিকল্পনা করার সময় সঠিক ট্রেন নির্বাচন করা অত্যন্ত গুরুত্বপূর্ণ। একটি ট্রেন কোন স্টেশন 
      থেকে ছাড়ে, কোন কোন স্টেশনে থামে, গন্তব্যে কখন পৌঁছানোর কথা এবং সপ্তাহের কোন দিনে ট্রেনটি 
      চলাচল করে—এসব তথ্য যাত্রার প্রস্তুতিতে গুরুত্বপূর্ণ ভূমিকা রাখে। ট্রেনকই-এর মাধ্যমে এসব 
      তথ্যকে সহজভাবে খুঁজে দেখার সুযোগ দেওয়ার চেষ্টা করা হয়েছে।
    </p>

    <p style={{ margin: '0 0 22px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      বিশেষ করে যারা নিয়মিত ঢাকা থেকে চট্টগ্রাম, ঢাকা থেকে রাজশাহী, ঢাকা থেকে খুলনা, ঢাকা থেকে সিলেট, 
      ঢাকা থেকে রংপুর বা দেশের অন্যান্য রুটে যাতায়াত করেন, তাদের জন্য ট্রেনের সময়সূচী আগে থেকে 
      দেখে নেওয়া ভ্রমণ পরিকল্পনাকে আরও সহজ করতে পারে।
    </p>

    {/* কারা ব্যবহার করতে পারেন */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      কারা ট্রেনকই ব্যবহার করতে পারেন?
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ট্রেনকই মূলত বাংলাদেশ রেলওয়ের যাত্রীদের জন্য তৈরি। নিয়মিত অফিসগামী যাত্রী, শিক্ষার্থী, 
      চাকরিপ্রার্থী, পর্যটক, ব্যবসায়িক কাজে ভ্রমণকারী এবং দূরপাল্লার ট্রেনের যাত্রী—যে কেউ 
      ট্রেনের সময়সূচী ও উপলব্ধ ট্র্যাকিং তথ্য খুঁজতে এই প্ল্যাটফর্ম ব্যবহার করতে পারেন। 
      যারা প্রথমবার কোনো নির্দিষ্ট রুটে ট্রেনে ভ্রমণ করছেন, তারাও ট্রেনের রুট ও স্টেশন সম্পর্কিত 
      তথ্য দেখে নিজেদের যাত্রা সম্পর্কে ধারণা নিতে পারেন।
    </p>

    {/* তথ্যের ব্যবহার */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      ভ্রমণের আগে যে বিষয়গুলো মনে রাখা উচিত
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      অনলাইনে পাওয়া ট্রেনের তথ্য ব্যবহার করার সময় যাত্রীদের কয়েকটি বিষয় মনে রাখা গুরুত্বপূর্ণ। 
      নির্ধারিত সময়সূচী এবং বাস্তব চলাচলের সময় সবসময় এক নাও হতে পারে। তাই গুরুত্বপূর্ণ যাত্রার ক্ষেত্রে 
      পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছানো, টিকিটের তথ্য যাচাই করা এবং প্রয়োজনে বাংলাদেশ রেলওয়ের 
      সংশ্লিষ্ট স্টেশন বা অফিসিয়াল উৎস থেকে সর্বশেষ তথ্য নিশ্চিত করা ভালো।
    </p>

    <p style={{ margin: '0 0 22px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      ট্রেনকই যাত্রীদের তথ্য খোঁজার প্রক্রিয়াকে সহজ করার একটি সহায়ক প্ল্যাটফর্ম। এটি টিকিট বিক্রি, 
      টিকিট পরিবর্তন, রিফান্ড, ট্রেন পরিচালনা বা রেলওয়ের কোনো প্রশাসনিক সিদ্ধান্তের জন্য দায়ী নয়।
    </p>

    {/* Awareness */}
    <div style={{ backgroundColor: '#f0fdf4', padding: '14px 18px', borderRadius: '18px', marginBottom: '16px', border: '1px solid #dcfce7' }}>
      <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '800', color: '#166534' }}>
        সচেতনতা ও দায়িত্বশীল ব্যবহার
      </h4>

      <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.75', color: '#15803d' }}>
        ট্রেনের সময়সূচী ও আনুমানিক অবস্থান ট্রাফিক কন্ডিশন, আবহাওয়া, সিগন্যালিং, স্টেশন ব্যবস্থাপনা,
        ট্রেনের বিলম্ব এবং অন্যান্য পরিচালনাগত কারণে পরিবর্তিত হতে পারে। কোনো গুরুত্বপূর্ণ যাত্রার ক্ষেত্রে
        যাত্রীদের নির্ধারিত সময়ের কিছুটা আগে স্টেশনে উপস্থিত হওয়া এবং প্রয়োজন হলে সংশ্লিষ্ট
        বাংলাদেশ রেলওয়ে কর্তৃপক্ষের কাছ থেকে সর্বশেষ তথ্য যাচাই করার পরামর্শ দেওয়া হচ্ছে।
      </p>
    </div>

    {/* Platform Vision */}
    <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>
      ট্রেনকই-এর উদ্দেশ্য
    </h3>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      প্রযুক্তির মাধ্যমে দৈনন্দিন যাতায়াতকে আরও সহজ করাই ট্রেনকই-এর মূল উদ্দেশ্য। বাংলাদেশে রেলভ্রমণ 
      আরও তথ্যনির্ভর ও সুবিধাজনক করার জন্য ভবিষ্যতে ট্রেন, স্টেশন, রুট এবং রেলভ্রমণ সম্পর্কিত আরও 
      দরকারি তথ্য এক জায়গায় আনার লক্ষ্য রয়েছে। ব্যবহারকারীদের প্রয়োজন অনুযায়ী প্ল্যাটফর্মের 
      তথ্য ও সুবিধাগুলো ধীরে ধীরে উন্নত করা হচ্ছে।
    </p>

    <p style={{ margin: '0 0 18px', fontSize: '12.5px', lineHeight: '1.9', color: '#64748b' }}>
      আমাদের বিশ্বাস, সহজ ভাষায় সঠিক তথ্য উপস্থাপন করা হলে একজন যাত্রী তার যাত্রা আরও ভালোভাবে 
      পরিকল্পনা করতে পারেন। তাই ট্রেনকই শুধু ট্রেনের অবস্থান দেখানোর একটি ওয়েবসাইট নয়; এটি 
      বাংলাদেশে রেলভ্রমণ সম্পর্কিত তথ্য সহজে খুঁজে পাওয়ার জন্য একটি সহায়ক ডিজিটাল প্ল্যাটফর্ম 
      হিসেবে কাজ করার চেষ্টা করছে।
    </p>

    {/* Disclaimer */}
    <div style={{ borderTop: '1.5px dashed #e2e8f0', paddingTop: '12px' }}>
      <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.7', color: '#94a3b8' }}>
        <strong>দায়মুক্তি ও ঘোষণা (Disclaimer):</strong> ট্রেনকই একটি স্বাধীন ও কমিউনিটি-চালিত তথ্য,
        সময়সূচী এবং ট্রেন ট্র্যাকিং প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ে (BR), রেলপথ মন্ত্রণালয় অথবা
        ঢাকা ম্যাস ট্রানজিট কোম্পানি লিমিটেড (DMTCL)-এর কোনো আনুষ্ঠানিক সরকারি অঙ্গপ্রতিষ্ঠান নয়।
        প্ল্যাটফর্মে প্রদর্শিত তথ্য উন্মুক্ত উৎস, প্রকাশিত সময়সূচী এবং উপলব্ধ ট্র্যাকিং ডেটার ভিত্তিতে
        উপস্থাপন করা হয়। তথ্যের পরিবর্তন, বিলম্ব বা ত্রুটির কারণে কোনো অসুবিধা হলে ব্যবহারকারীদের
        সংশ্লিষ্ট সরকারি বা রেলওয়ে কর্তৃপক্ষের সর্বশেষ তথ্য যাচাই করার পরামর্শ দেওয়া হচ্ছে।
      </p>
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
