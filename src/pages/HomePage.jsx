
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { trains } from '../data/trainData'; 
// import { 
//   Search, MapPin, Settings, Bell, Navigation, ArrowRightLeft, X, 
//   Train, BookOpen, User, Info, MessageSquare, ShieldAlert, 
//   Ticket, Mail, LayoutGrid, Map, Clock, ChevronRight, Activity,
//   HelpCircle // <--- এটি যোগ করা হয়েছে
// } from 'lucide-react';

// const HomePage = () => {
//   const [searchMode, setSearchMode] = useState('name'); 
//   const [searchTerm, setSearchTerm] = useState('');
//   const [fromCity, setFromCity] = useState('');
//   const [toCity, setToCity] = useState('');
  
//   // ব্যাক করলে ডাটা মনে রাখার লজিক
//   const [selectedTrainGroup, setSelectedTrainGroup] = useState(() => {
//     const saved = sessionStorage.getItem('lastSelectedTrain');
//     return saved ? JSON.parse(saved) : null;
//   }); 
  
//   const [activeDirectionIndex, setActiveDirectionIndex] = useState(0); 
//   const [showSuggestions, setShowSuggestions] = useState(true);
//   const [activeInput, setActiveInput] = useState(null); 
//   const navigate = useNavigate();

//   // ১. Suggestion Generator
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

//   // ২. Filter & Grouping Logic
//   const isSearching = searchTerm.trim() !== '' || fromCity.trim() !== '' || toCity.trim() !== '';
//   const displayTrains = (() => {
//     const f = fromCity.toLowerCase().trim();
//     const t = toCity.toLowerCase().trim();
//     const s = searchTerm.toLowerCase().trim();

//     let filtered = trains;
//     if (isSearching) {
//       filtered = trains.filter(train => {
//         if (searchMode === 'name') {
//           return train.name.toLowerCase().includes(s);
//         } else {
//           const stationsNames = train.stations.map(st => st.name.toLowerCase());
//           return (f === '' || stationsNames.some(n => n.includes(f))) && 
//                  (t === '' || stationsNames.some(n => n.includes(t)));
//         }
//       });
//     } else {
//       filtered = trains;
//     }

//     const groups = {};
//     filtered.forEach(train => {
//       if (!groups[train.name]) groups[train.name] = [];
//       groups[train.name].push(train);
//     });

//     const result = Object.values(groups);
//     return isSearching ? result : result.slice(0, 4);
//   })();

//   const features = [
//     { title: 'বই পড়ুন', icon: <BookOpen size={24} />, color: '#9b59b6', path: '/books' }, 
//     { title: 'ট্রেন টিকিট', icon: <Ticket size={24} />, color: '#e67e22', external: 'https://eticket.railway.gov.bd/' }, 
//     { title: 'ট্রেন ব্লগ', icon: <MessageSquare size={24} />, color: '#2ecc71', path: '/blogs' }, 
//     { title: 'ভ্রমণ আইন', icon: <ShieldAlert size={24} />, color: '#e74c3c', path: '/travel-laws' },
//     { title: 'আমাদের সম্পর্কে', icon: <Info size={24} />, color: '#34495e', path: '/about' },
//     { title: 'যোগাযোগ ও অভিযোগ', icon: <Mail size={24} />, color: '#16a085', path: '/contact' },
//     { title: 'ট্রেন শিডিউল', icon: <Clock size={24} />, color: '#006a4e', path: '/schedule' },
//     { title: 'প্রশ্ন ও উত্তর', icon: <HelpCircle size={24} />, color: '#f39c12', path: '/faq' },
//   ];

//   return (
//     <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '100px' }}>
      
//      <div style={{ 
//     background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
//     padding: '30px 20px 70px', 
//     color: 'white', 
//     borderBottomLeftRadius: '40px', 
//     borderBottomRightRadius: '40px',
//     boxShadow: '0 10px 25px rgba(0, 77, 57, 0.2)' // নিচের দিকে হালকা শ্যাডো
//   }}>
//     <div style={{ 
//       display: 'flex', 
//       justifyContent: 'space-between', 
//       alignItems: 'center',
//       maxWidth: '1200px', // পিসি ভিউতে কন্টেন্ট মাঝখানে রাখার জন্য
//       margin: '0 auto' 
//     }}>
      
//       {/* Settings Icon Button */}
//       <div 
//         onClick={() => navigate('/settings')} 
//         style={{ 
//           cursor: 'pointer', 
//           background: 'rgba(255, 255, 255, 0.15)', // হালকা সাদাটে ব্যাকগ্রাউন্ড
//           padding: '10px', 
//           borderRadius: '15px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           transition: 'all 0.3s ease',
//           backdropFilter: 'blur(5px)' // গ্লাস ইফেক্ট
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
//         onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
//       >
//         <Settings size={22} style={{ opacity: 1 }} />
//       </div>

//       {/* Logo / Title */}
// <h2 style={{ 
//   margin: 0, 
//   fontWeight: 900, 
//   fontSize: '28px', 
//   letterSpacing: '-0.5px', // টেক্সটটি আরও টাইট এবং আধুনিক দেখাবে
//   background: 'linear-gradient(to right, #ffffff, #e0e0e0)', // হালকা গ্রেডিয়েন্ট
//   WebkitBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '2px'
// }}>
//   ট্রেনকই
// </h2>

//       {/* Notification Icon Button */}
//       <div 
//         style={{ 
//           cursor: 'pointer', 
//           background: 'rgba(255, 255, 255, 0.15)', 
//           padding: '10px', 
//           borderRadius: '15px', 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           transition: 'all 0.3s ease',
//           backdropFilter: 'blur(5px)',
//           position: 'relative' // নোটিফিকেশন ডটের জন্য
//         }}
//         onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
//         onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
//       >
//         <Bell size={22} style={{ opacity: 1 }} />
//         {/* ছোট্ট একটা নোটিফিকেশন ডট (লাল) */}
//         <span style={{
//           position: 'absolute',
//           top: '8px',
//           right: '8px',
//           width: '8px',
//           height: '8px',
//           backgroundColor: '#ff4b2b',
//           borderRadius: '50%',
//           border: '2px solid #006a4e'
//         }}></span>
//       </div>

//     </div>
//   </div>

//       {/* Search Container */}
//       <div style={{ margin: '-50px 20px 0', backgroundColor: 'white', borderRadius: '30px', padding: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', position: 'relative', zIndex: 100 }}>
//         <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: 15, padding: 5, marginBottom: 15 }}>
//           <button onClick={() => {setSearchMode('name'); setSearchTerm('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'name' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'name' ? '#006a4e' : '#888' }}>নামে সার্চ</button>
//           <button onClick={() => {setSearchMode('route'); setFromCity(''); setToCity('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'route' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'route' ? '#006a4e' : '#888' }}>রুট সার্চ</button>
//         </div>
        
//         {searchMode === 'name' ? (
//           <div style={{ position: 'relative' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 14, borderRadius: 16, border: '1px solid #eee' }}>
//               <Search size={20} color="#006a4e" />
//               <input type="text" placeholder="ট্রেনের নাম লিখুন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowSuggestions(true); setActiveInput('name');}} onFocus={() => setActiveInput('name')} />
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
//                 <MapPin size={18} color="#006a4e" />
//                 <input type="text" placeholder="কোথা থেকে..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={fromCity} onChange={(e) => {setFromCity(e.target.value); setShowSuggestions(true); setActiveInput('from');}} onFocus={() => setActiveInput('from')} />
//                 </div>
//                 {fromCity && activeInput === 'from' && showSuggestions && getSuggestions(fromCity, 'route').length > 0 && (
//                 <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
//                     {getSuggestions(fromCity, 'route').map((item, i) => <div key={i} onClick={() => {setFromCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
//                 </div>
//                 )}
//             </div>

//             <div style={{ position: 'relative' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 16, border: '1px solid #eee' }}>
//                 <ArrowRightLeft size={18} color="#006a4e" />
//                 <input type="text" placeholder="কোথায় যাবেন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={toCity} onChange={(e) => {setToCity(e.target.value); setShowSuggestions(true); setActiveInput('to');}} onFocus={() => setActiveInput('to')} />
//                 </div>
//                 {toCity && activeInput === 'to' && showSuggestions && getSuggestions(toCity, 'route').length > 0 && (
//                 <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 110 }}>
//                     {getSuggestions(toCity, 'route').map((item, i) => <div key={i} onClick={() => {setToCity(item); setShowSuggestions(false);}} style={{ padding: '12px 15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' }}>{item}</div>)}
//                 </div>
//                 )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Features grid */}
//       <div style={{ padding: '30px 20px 10px' }}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
//           {features.map((f, i) => (
//             <div 
//               key={i} 
//               onClick={() => {
//                 if (f.external) {
//                   window.open(f.external, '_blank');
//                 } else if (f.path) {
//                   navigate(f.path);
//                 }
//               }}
//               style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: (f.path || f.external) ? 'pointer' : 'default' }}
//             >
//               <div style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{f.icon}</div>
//               <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>{f.title}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Popular Train List - Stacked Layout for better spacing */}
//       <div style={{ padding: '20px' }}>
//         <h4 style={{ margin: '0 0 15px 5px', color: '#333', fontWeight: 'bold' }}>জনপ্রিয় ট্রেন</h4>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//           {displayTrains.map((group, idx) => (
//             <div 
//               key={idx} 
//               onClick={() => {
//                 setSelectedTrainGroup(group); 
//                 setActiveDirectionIndex(0);
//                 sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
//               }} 
//               style={{ 
//                 backgroundColor: 'white', 
//                 borderRadius: '25px', 
//                 padding: '16px', 
//                 display: 'flex', 
//                 alignItems: 'center',
//                 gap: '15px', 
//                 boxShadow: '0 4px 15px rgba(0,0,0,0.04)', 
//                 borderLeft: '6px solid #006a4e',
//                 border: '1px solid #f0f0f0',
//                 cursor: 'pointer'
//               }}
//             >
//               {/* Train Image */}
//               <div style={{ width: '70px', height: '70px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f8f9fa', flexShrink: 0 }}>
//                 <img src="/homeimg.png" alt={group[0].name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
//               </div>

//               {/* Train Info & Button Side-by-Side */}
//               <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ flex: 1 }}>
//                   <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>কোড: {group[0].id}</span>
//                   <h4 style={{ margin: '2px 0', fontSize: '16px', color: '#1e293b', fontWeight: '800' }}>{group[0].name}</h4>
//                   <span style={{ fontSize: '11px', color: '#94a3b8' }}>ছুটি: {group[0].offDay}</span>
//                 </div>

//                 {/* Live Tracking Button - Centered in right side */}
//                 <button 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedTrainGroup(group); 
//                     setActiveDirectionIndex(0);
//                     sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
//                   }}
//                   style={{ 
//                     backgroundColor: '#006a4e', 
//                     color: 'white', 
//                     border: 'none', 
//                     padding: '10px 12px', 
//                     borderRadius: '12px', 
//                     fontSize: '11px', 
//                     fontWeight: 'bold', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: '5px',
//                     boxShadow: '0 4px 8px rgba(0,106,78,0.15)',
//                     whiteSpace: 'nowrap'
//                   }}
//                 >
//                   <Activity size={14} /> Tracking
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

// {/* Stoppage Modal */}
// {selectedTrainGroup && (
//   <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
//     <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '25px 20px', maxHeight: '85vh', overflowY: 'auto' }}>
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
//         <div>
//           <h3 style={{ margin: 0, color: '#006a4e' }}>{selectedTrainGroup[activeDirectionIndex].name}</h3>
//           <span style={{ fontSize: 12, color: '#999' }}>কোড: {selectedTrainGroup[activeDirectionIndex].id}</span>
//         </div>
//         <X onClick={() => {setSelectedTrainGroup(null); sessionStorage.removeItem('lastSelectedTrain');}} style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', borderRadius: '50%', padding: 5 }} />
//       </div>

//       {/* লাল রঙের সতর্কবার্তা - এখানে যোগ করা হয়েছে */}
//       <div style={{ 
//         backgroundColor: '#fff5f5', 
//         color: '#e53935', 
//         fontSize: '12px', 
//         fontWeight: 'bold', 
//         padding: '10px', 
//         borderRadius: '12px', 
//         marginBottom: '15px', 
//         textAlign: 'center',
//         border: '1px solid #ffebee'
//       }}>
//           ট্রেনের লাইভ লোকেশন জানতে দয়া করে সঠিক রুটটি সিলেক্ট করুন
//       </div>

//       {selectedTrainGroup.length > 1 && (
//         <div style={{ display: 'flex', gap: 10, marginBottom: 20, backgroundColor: '#f5f5f5', padding: 5, borderRadius: 15 }}>
//           {selectedTrainGroup.map((t, i) => (
//             <button key={i} onClick={() => setActiveDirectionIndex(i)} style={{ flex: 1, padding: '10px 5px', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 'bold', backgroundColor: activeDirectionIndex === i ? 'white' : 'transparent', color: activeDirectionIndex === i ? '#006a4e' : '#777' }}>
//               {t.from.split('(')[0]} ➔ {t.to.split('(')[0]}
//             </button>
//           ))}
//         </div>
//             )}

//             <div style={{ marginBottom: 20, padding: '15px', backgroundColor: '#e8f5e9', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div>
//                    <div style={{ fontSize: '10px', color: '#1b5e20', fontWeight: 'bold' }}>সাপ্তাহিক ছুটি</div>
//                    <div style={{ fontSize: '14px', color: '#2e7d32', fontWeight: 'bold' }}>{selectedTrainGroup[activeDirectionIndex].offDay}</div>
//                 </div>
//                 <button onClick={() => navigate(`/track/${selectedTrainGroup[activeDirectionIndex].id}`)} style={{ backgroundColor: '#006a4e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { 
  Search, MapPin, Settings, Bell, Navigation, ArrowRightLeft, X, 
  Train, BookOpen, User, Info, MessageSquare, ShieldAlert, 
  Ticket, Mail, LayoutGrid, Map, Clock, ChevronRight, Activity,
  HelpCircle, // <--- এটি যোগ করা হয়েছে
  TrainFront, CreditCard, Gavel // মেট্রো সেকশনের জন্য নতুন আইকন
} from 'lucide-react';

const HomePage = () => {
  const [searchMode, setSearchMode] = useState('name'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  
  // ব্যাক করলে ডাটা মনে রাখার লজিক
  const [selectedTrainGroup, setSelectedTrainGroup] = useState(() => {
    const saved = sessionStorage.getItem('lastSelectedTrain');
    return saved ? JSON.parse(saved) : null;
  }); 
  
  const [activeDirectionIndex, setActiveDirectionIndex] = useState(0); 
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeInput, setActiveInput] = useState(null); 
  const navigate = useNavigate();

  // ১. Suggestion Generator
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

  // ২. Filter & Grouping Logic
  const isSearching = searchTerm.trim() !== '' || fromCity.trim() !== '' || toCity.trim() !== '';
  const displayTrains = (() => {
    const f = fromCity.toLowerCase().trim();
    const t = toCity.toLowerCase().trim();
    const s = searchTerm.toLowerCase().trim();

    let filtered = trains;
    if (isSearching) {
      filtered = trains.filter(train => {
        if (searchMode === 'name') {
          return train.name.toLowerCase().includes(s);
        } else {
          const stationsNames = train.stations.map(st => st.name.toLowerCase());
          return (f === '' || stationsNames.some(n => n.includes(f))) && 
                 (t === '' || stationsNames.some(n => n.includes(t)));
        }
      });
    } else {
      filtered = trains;
    }

    const groups = {};
    filtered.forEach(train => {
      if (!groups[train.name]) groups[train.name] = [];
      groups[train.name].push(train);
    });

    const result = Object.values(groups);
    return isSearching ? result : result.slice(0, 4);
  })();

  const features = [
    { title: 'বই পড়ুন', icon: <BookOpen size={24} />, color: '#9b59b6', path: '/books' }, 
    { title: 'ট্রেন টিকিট', icon: <Ticket size={24} />, color: '#e67e22', external: 'https://eticket.railway.gov.bd/' }, 
    { title: 'ট্রেন ব্লগ', icon: <MessageSquare size={24} />, color: '#2ecc71', path: '/blogs' }, 
    { title: 'ভ্রমণ আইন', icon: <ShieldAlert size={24} />, color: '#e74c3c', path: '/travel-laws' },
    { title: 'আমাদের সম্পর্কে', icon: <Info size={24} />, color: '#34495e', path: '/about' },
    { title: 'যোগাযোগ ও অভিযোগ', icon: <Mail size={24} />, color: '#16a085', path: '/contact' },
    { title: 'ট্রেন শিডিউল', icon: <Clock size={24} />, color: '#006a4e', path: '/schedule' },
    { title: 'প্রশ্ন ও উত্তর', icon: <HelpCircle size={24} />, color: '#f39c12', path: '/faq' },
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '100px' }}>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
        padding: '30px 20px 70px', 
        color: 'white', 
        borderBottomLeftRadius: '40px', 
        borderBottomRightRadius: '40px',
        boxShadow: '0 10px 25px rgba(0, 77, 57, 0.2)' // নিচের দিকে হালকা শ্যাডো
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px', // পিসি ভিউতে কন্টেন্ট মাঝখানে রাখার জন্য
          margin: '0 auto' 
        }}>
          
          {/* Settings Icon Button */}
          <div 
            onClick={() => navigate('/settings')} 
            style={{ 
              cursor: 'pointer', 
              background: 'rgba(255, 255, 255, 0.15)', // হালকা সাদাটে ব্যাকগ্রাউন্ড
              padding: '10px', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)' // গ্লাস ইফেক্ট
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <Settings size={22} style={{ opacity: 1 }} />
          </div>

          {/* Logo / Title */}
          <h2 style={{ 
            margin: 0, 
            fontWeight: 900, 
            fontSize: '28px', 
            letterSpacing: '-0.5px', // টেক্সটটি আরও টাইট এবং আধুনিক দেখাবে
            background: 'linear-gradient(to right, #ffffff, #e0e0e0)', // হালকা গ্রেডিয়েন্ট
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            ট্রেনকই
          </h2>

          {/* Notification Icon Button */}
          <div 
            style={{ 
              cursor: 'pointer', 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '10px', 
              borderRadius: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(5px)',
              position: 'relative' // নোটিফিকেশন ডটের জন্য
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            <Bell size={22} style={{ opacity: 1 }} />
            {/* ছোট্ট একটা নোটিফিকেশন ডট (লাল) */}
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
      <div style={{ margin: '-50px 20px 0', backgroundColor: 'white', borderRadius: '30px', padding: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', position: 'relative', zIndex: 100 }}>
        <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: 15, padding: 5, marginBottom: 15 }}>
          <button onClick={() => {setSearchMode('name'); setSearchTerm('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'name' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'name' ? '#006a4e' : '#888' }}>নামে সার্চ</button>
          <button onClick={() => {setSearchMode('route'); setFromCity(''); setToCity('');}} style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, backgroundColor: searchMode === 'route' ? 'white' : 'transparent', fontWeight: 'bold', color: searchMode === 'route' ? '#006a4e' : '#888' }}>রুট সার্চ</button>
        </div>
        
        {searchMode === 'name' ? (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f9f9f9', padding: 14, borderRadius: 16, border: '1px solid #eee' }}>
              <Search size={20} color="#006a4e" />
              <input type="text" placeholder="ট্রেনের নাম লিখুন..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setShowSuggestions(true); setActiveInput('name');}} onFocus={() => setActiveInput('name')} />
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

      {/* Features grid */}
      <div style={{ padding: '30px 20px 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          {features.map((f, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (f.external) {
                  window.open(f.external, '_blank');
                } else if (f.path) {
                  navigate(f.path);
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: (f.path || f.external) ? 'pointer' : 'default' }}
            >
              <div style={{ width: '50px', height: '50px', backgroundColor: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{f.icon}</div>
              <span style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>{f.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Train List - Stacked Layout for better spacing */}
      <div style={{ padding: '20px' }}>
        <h4 style={{ margin: '0 0 15px 5px', color: '#333', fontWeight: 'bold' }}>জনপ্রিয় ট্রেন</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {displayTrains.map((group, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                setSelectedTrainGroup(group); 
                setActiveDirectionIndex(0);
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
                borderLeft: '6px solid #006a4e',
                border: '1px solid #f0f0f0',
                cursor: 'pointer'
              }}
            >
              {/* Train Image */}
              <div style={{ width: '70px', height: '70px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f8f9fa', flexShrink: 0 }}>
                <img src="/homeimg.png" alt={group[0].name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              {/* Train Info & Button Side-by-Side */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>কোড: {group[0].id}</span>
                  <h4 style={{ margin: '2px 0', fontSize: '16px', color: '#1e293b', fontWeight: '800' }}>{group[0].name}</h4>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>ছুটি: {group[0].offDay}</span>
                </div>

                {/* Live Tracking Button - Centered in right side */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTrainGroup(group); 
                    setActiveDirectionIndex(0);
                    sessionStorage.setItem('lastSelectedTrain', JSON.stringify(group));
                  }}
                  style={{ 
                    backgroundColor: '#006a4e', 
                    color: 'white', 
                    border: 'none', 
                    padding: '10px 12px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    boxShadow: '0 4px 8px rgba(0,106,78,0.15)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Activity size={14} /> Tracking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Bangladesh Metro Rail Section (NEW) --- */}
      <div style={{ padding: '0 20px 20px' }}>
        <div 
          onClick={() => navigate('/metro-rail')}
          style={{ 
            background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)', 
            borderRadius: '30px', 
            padding: '25px', 
            color: 'white', 
            boxShadow: '0 15px 30px rgba(0,131,82,0.2)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          {/* Background Decorative Icon */}
          <TrainFront size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                <TrainFront size={24} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>Dhaka Metro Rail</span>
            </div>
            
            <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '900' }}>বাংলাদেশ মেট্রো রেল</h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', opacity: 0.8, lineHeight: '1.5', maxWidth: '80%' }}>
              সময়সূচী, ভাড়া, টিকিট ও যাতায়াতের সকল তথ্য এখন এক জায়গায়।
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { icon: <Clock size={14} />, text: 'সময়সূচী' },
                { icon: <CreditCard size={14} />, text: 'টিকিট কার্ড' },
                { icon: <Map size={14} />, text: 'রুট ম্যাপ' },
                { icon: <Gavel size={14} />, text: 'আইন-কানুন' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                  {item.icon} {item.text}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              বিস্তারিত দেখুন <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
      {/* --- End Metro Rail Section --- */}

      {/* Stoppage Modal */}
      {selectedTrainGroup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: '25px 20px', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <div>
                <h3 style={{ margin: 0, color: '#006a4e' }}>{selectedTrainGroup[activeDirectionIndex].name}</h3>
                <span style={{ fontSize: 12, color: '#999' }}>কোড: {selectedTrainGroup[activeDirectionIndex].id}</span>
              </div>
              <X onClick={() => {setSelectedTrainGroup(null); sessionStorage.removeItem('lastSelectedTrain');}} style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', borderRadius: '50%', padding: 5 }} />
            </div>

            {/* লাল রঙের সতর্কবার্তা - এখানে যোগ করা হয়েছে */}
            <div style={{ 
              backgroundColor: '#fff5f5', 
              color: '#e53935', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              padding: '10px', 
              borderRadius: '12px', 
              marginBottom: '15px', 
              textAlign: 'center',
              border: '1px solid #ffebee'
            }}>
                ট্রেনের লাইভ লোকেশন জানতে দয়া করে সঠিক রুটটি সিলেক্ট করুন
            </div>

            {selectedTrainGroup.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 20, backgroundColor: '#f5f5f5', padding: 5, borderRadius: 15 }}>
                {selectedTrainGroup.map((t, i) => (
                  <button key={i} onClick={() => setActiveDirectionIndex(i)} style={{ flex: 1, padding: '10px 5px', border: 'none', borderRadius: 10, fontSize: 11, fontWeight: 'bold', backgroundColor: activeDirectionIndex === i ? 'white' : 'transparent', color: activeDirectionIndex === i ? '#006a4e' : '#777' }}>
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
                <button onClick={() => navigate(`/track/${selectedTrainGroup[activeDirectionIndex].id}`)} style={{ backgroundColor: '#006a4e', color: 'white', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
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