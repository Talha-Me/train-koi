
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { trains } from '../data/trainData'; 
// import { 
//   ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, Info, Send
// } from 'lucide-react';

// // --- Helper Function: ট্রেনের নাম থেকে ক্লিন ইংরেজি স্ল্যাগ তৈরি করার জন্য ---
// const getCleanSlug = (trainName) => {
//   if (!trainName) return "";
//   // নাম থেকে ব্র্যাকেটের ভেতরের ইংরেজি অংশ খোঁজে (যেমন: "Lalmoni Express")
//   const englishMatch = trainName.match(/\(([^)]+)\)/);
//   const nameToProcess = englishMatch ? englishMatch[1] : trainName;

//   return nameToProcess
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '') // স্পেশাল ক্যারেক্টার রিমুভ করে
//     .replace(/\s+/g, '-');    // স্পেসকে ড্যাশ (-) দিয়ে পরিবর্তন করে
// };

// const TrainSchedule = () => {
//   const navigate = useNavigate();
//   const { trainSlug } = useParams(); 
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTrain, setSelectedTrain] = useState(null);

//   // --- Dynamic SEO Title logic (Strict Fix for Browser Tab) ---
//   useEffect(() => {
//     // আপনার অরিজিনাল র‍্যাঙ্ক করা টাইটেল (Home Page এর জন্য)
//     const originalTitle = "Train Live Location | Train Tracking - TrainKoi";
    
//     let currentTitle = "Train Schedule & Time Table 2026 | TrainKoi";
    
//     if (selectedTrain) {
//       currentTitle = `${selectedTrain.name} Schedule & Time Table 2026 | TrainKoi`;
//     }
    
//     // ব্রাউজার টাইটেল সেট করা
//     document.title = currentTitle;

//     // React Router বা StrictMode এর কারণে ওভাররাইড হওয়া আটকাতে ছোট সেফগার্ড
//     const timer = setTimeout(() => {
//       document.title = currentTitle;
//     }, 150);

//     // ক্লিনিং ফাংশন: এই কম্পোনেন্ট থেকে বের হয়ে গেলে আপনার অরিজিনাল টাইটেল ফিরে আসবে
//     return () => {
//       clearTimeout(timer);
//       document.title = originalTitle;
//     };
//   }, [selectedTrain]);

//   // URL এর স্ল্যাগ অনুযায়ী ট্রেন খুঁজে বের করা
//   useEffect(() => {
//     if (trainSlug) {
//       const train = trains.find(t => getCleanSlug(t.name) === trainSlug);
//       if (train) {
//         setSelectedTrain(train);
//       }
//     } else {
//       setSelectedTrain(null);
//     }
//   }, [trainSlug]);

//   const filteredTrains = trains.filter(t => 
//     t.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ).slice(0, 15);

//   // ট্রেন সিলেক্ট করলে ক্লিন ইউআরএল-এ নেভিগেট করা
//   const handleTrainSelect = (train) => {
//     const slug = getCleanSlug(train.name);
//     navigate(`/schedule/${slug}`);
//     setSelectedTrain(train);
//   };

//   // SEO এর জন্য বর্ণনা তৈরি
//   const generateLongDescription = (train) => {
//     if (!train || !train.stations || train.stations.length === 0) return { summary: "", details: "" };

//     let desc = `${train.name} travels ${train.from} to ${train.to} on every day of the week except ${train.offDay || 'কোন বন্ধের দিন নেই'}. `;
//     desc += `It departs from ${train.from} at ${train.stations[0].departure}, and arrives at ${train.to} at ${train.stations[train.stations.length - 1].arrival}. `;
    
//     let pathDetails = `${train.name} departs from ${train.stations[0].name} at ${train.stations[0].departure} BST. `;
//     train.stations.slice(1).forEach((st) => {
//       pathDetails += `Then it arrives in ${st.name}, at ${st.arrival} BST and then departs at ${st.departure || 'END'}. `;
//     });
    
//     return { summary: desc, details: pathDetails };
//   };

//   return (
//     <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '50px' }}>
      
//       {/* Header */}
//       <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
//         <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
//         <h3 style={{ margin: 0, fontSize: '18px' }}>ট্রেন শিডিউল ও সময়সূচী</h3>
//       </div>

//       <div style={{ padding: '20px' }}>
//         {/* Search Bar */}
//         <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
//           <Search size={20} color="#006a4e" />
//           <input 
//             type="text" 
//             placeholder="ট্রেনের নাম দিয়ে সার্চ করুন..." 
//             style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {!selectedTrain ? (
//           <div>
//             <h4 style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>ট্রেন তালিকা</h4>
//             {filteredTrains.map((train, idx) => (
//               <div key={idx} onClick={() => handleTrainSelect(train)} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #eee' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                   <div style={{ backgroundColor: '#f0f9f4', padding: '10px', borderRadius: '12px' }}><Clock size={20} color="#006a4e" /></div>
//                   <div>
//                     <div style={{ fontWeight: 'bold', color: '#333' }}>{train.name}</div>
//                     <div style={{ fontSize: '11px', color: '#888' }}>{train.from} ➔ {train.to}</div>
//                   </div>
//                 </div>
//                 <ChevronDown size={18} color="#ccc" />
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div style={{ animation: 'fadeIn 0.3s ease' }}>
//             <button onClick={() => { setSelectedTrain(null); navigate('/schedule'); }} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '10px', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>← তালিকায় ফিরে যান</button>
            
//             <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
//               <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Last Updated: March 2026</p>
//               <h1 style={{ fontSize: '26px', color: '#006a4e', marginBottom: '15px', fontWeight: '900' }}>{selectedTrain.name}</h1>
              
//               {/* --- Live Actions Container --- */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
//                 <button 
//                   onClick={() => navigate(`/track/${selectedTrain.id}`)}
//                   style={{ width: '100%', background: '#006a4e', color: 'white', border: 'none', padding: '14px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,106,78,0.2)', cursor: 'pointer' }}
//                 >
//                   <Navigation size={18} /> Live Tracking Map
//                 </button>

//                 <div style={{ backgroundColor: '#f0f7ff', padding: '15px', borderRadius: '15px', borderLeft: '5px solid #007bff', display: 'flex', alignItems: 'center', gap: '15px' }}>
//                    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}><Send size={20} color="#007bff" /></div>
//                    <div>
//                      <h4 style={{ margin: 0, fontSize: '13px', color: '#007bff' }}>SMS Tracking</h4>
//                      <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>Type <span style={{color: '#d63384'}}>TR {selectedTrain.id}</span> and send to <span style={{color: '#d63384'}}>16318</span></p>
//                    </div>
//                 </div>
//               </div>

//               {/* Summary Section */}
//               <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
//                 <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', margin: 0 }}>
//                     <strong>{selectedTrain.name}</strong> travels <strong>{selectedTrain.from} to {selectedTrain.to}</strong> on every day of the week except <strong>{selectedTrain.offDay || 'কোন বন্ধের দিন নেই'}</strong>. 
//                     It departs from <strong>{selectedTrain.from}</strong> at <strong>{selectedTrain.stations[0]?.departure}</strong>, and arrives at <strong>{selectedTrain.to}</strong> at <strong>{selectedTrain.stations[selectedTrain.stations.length - 1]?.arrival}</strong>.
//                 </p>
//               </div>

//               {/* Schedule Table */}
//               <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <MapPin size={20} color="#006a4e" /> Station Wise Schedule
//               </h3>
//               <div style={{ overflowX: 'auto', marginBottom: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                   <thead>
//                     <tr style={{ backgroundColor: '#006a4e', color: 'white' }}>
//                       <th style={{ padding: '12px', textAlign: 'left' }}>Station</th>
//                       <th style={{ padding: '12px', textAlign: 'center' }}>Arrival</th>
//                       <th style={{ padding: '12px', textAlign: 'center' }}>Departure</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {selectedTrain.stations.map((st, i) => (
//                       <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc', borderBottom: '1px solid #eee' }}>
//                         <td style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>{st.name}</td>
//                         <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center' }}>{st.arrival || '-'}</td>
//                         <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', color: '#006a4e', fontWeight: '600' }}>{st.departure || '-'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Detailed SEO Text */}
//               <div style={{ backgroundColor: '#fff8f0', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px dashed #e67e22' }}>
//                 <h3 style={{ fontSize: '16px', color: '#e67e22', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
//                    <Info size={18} /> Detailed Journey Path
//                 </h3>
//                 <p style={{ fontSize: '14px', lineHeight: '2', color: '#555', textAlign: 'justify' }}>
//                   {generateLongDescription(selectedTrain).details}
//                 </p>
//               </div>

//               {/* FAQ Section */}
//               <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
//                 <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>Frequently Asked Questions</h3>
                
//                 <div style={{ marginBottom: '20px' }}>
//                   <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>What are the operating days of {selectedTrain.name}?</p>
//                   <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{selectedTrain.name} operates every day except {selectedTrain.offDay || 'No offday'}.</p>
//                 </div>

//                 <div style={{ marginBottom: '20px' }}>
//                   <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>Where does {selectedTrain.name} start and end?</p>
//                   <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{selectedTrain.name} starts at {selectedTrain.from} and ends at {selectedTrain.to}.</p>
//                 </div>

//                 {selectedTrain.stations.slice(1, 4).map((st, i) => (
//                   <div key={i} style={{ marginBottom: '20px' }}>
//                     <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>When does {selectedTrain.name} arrive at {st.name}?</p>
//                     <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>It arrives at {st.name} at {st.arrival} BST during its journey from {selectedTrain.from} to {selectedTrain.to}.</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TrainSchedule;

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { 
  ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, Info, Send, ArrowRightLeft, Locate
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

  // --- সব স্টেশনের নামের ইউনিক লিস্ট তৈরি (Suggestions এর জন্য) ---
  const allStations = useMemo(() => {
    const stations = new Set();
    trains.forEach(train => {
      train.stations.forEach(st => stations.add(st.name));
    });
    return Array.from(stations).sort();
  }, []);

  useEffect(() => {
    const originalTitle = "Train Live Location | Train Tracking - TrainKoi";
    let currentTitle = "Train Schedule & Time Table 2026 | TrainKoi";
    if (selectedTrain) {
      currentTitle = `${selectedTrain.name} Schedule & Time Table 2026 | TrainKoi`;
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

  // --- উন্নত ফিল্টারিং লজিক (মাঝের স্টেশনসহ) ---
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

  const generateLongDescription = (train) => {
    if (!train || !train.stations || train.stations.length === 0) return { summary: "", details: "" };
    let desc = `${train.name} travels ${train.from} to ${train.to} on every day of the week except ${train.offDay || 'কোন বন্ধের দিন নেই'}. `;
    let pathDetails = `${train.name} departs from ${train.stations[0].name} at ${train.stations[0].departure} BST. `;
    train.stations.slice(1).forEach((st) => {
      pathDetails += `Then it arrives in ${st.name}, at ${st.arrival} BST and then departs at ${st.departure || 'END'}. `;
    });
    return { summary: desc, details: pathDetails };
  };

  // স্টেশনের নাম সাজেশন ফিল্টার (শুধুমাত্র তখনই দেখাবে যখন কিছু টাইপ করা হবে)
  const sourceSuggestions = source.length > 0 
    ? allStations.filter(s => s.toLowerCase().includes(source.toLowerCase()) && s.toLowerCase() !== source.toLowerCase()).slice(0, 5) 
    : [];
    
  const destSuggestions = destination.length > 0 
    ? allStations.filter(s => s.toLowerCase().includes(destination.toLowerCase()) && s.toLowerCase() !== destination.toLowerCase()).slice(0, 5) 
    : [];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
        <h3 style={{ margin: 0, fontSize: '18px' }}>ট্রেন শিডিউল ও সময়সূচী</h3>
      </div>

      <div style={{ padding: '20px' }}>
        
        {!selectedTrain && (
          <div style={{ display: 'flex', backgroundColor: '#e0eadd', borderRadius: '12px', padding: '5px', marginBottom: '15px' }}>
            <button 
              onClick={() => setSearchMode('name')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: searchMode === 'name' ? 'white' : 'transparent', fontWeight: 'bold', fontSize: '14px' }}
            >নাম দিয়ে সার্চ</button>
            <button 
              onClick={() => setSearchMode('route')}
              style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: searchMode === 'route' ? 'white' : 'transparent', fontWeight: 'bold', fontSize: '14px' }}
            >রুট দিয়ে সার্চ</button>
          </div>
        )}

        {!selectedTrain && (
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px', position: 'relative' }}>
            {searchMode === 'name' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Search size={20} color="#006a4e" />
                <input 
                  type="text" 
                  placeholder="ট্রেনের নাম লিখুন..." 
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Source Input */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <Locate size={18} color="#006a4e" />
                    <input 
                      type="text" 
                      placeholder="কোন স্টেশন থেকে..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
                      value={source}
                      onFocus={() => setShowSourceSuggestions(true)}
                      onChange={(e) => setSource(e.target.value)}
                      onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                    />
                  </div>
                  {showSourceSuggestions && sourceSuggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px', marginTop: '5px' }}>
                      {sourceSuggestions.map(s => (
                        <div key={s} onClick={() => { setSource(s); setShowSourceSuggestions(false); }} style={{ padding: '10px 15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '14px' }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Input */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={18} color="#e67e22" />
                    <input 
                      type="text" 
                      placeholder="কোন স্টেশনে যাবেন..." 
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
                      value={destination}
                      onFocus={() => setShowDestSuggestions(true)}
                      onChange={(e) => setDestination(e.target.value)}
                      onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                    />
                  </div>
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px', marginTop: '5px' }}>
                      {destSuggestions.map(s => (
                        <div key={s} onClick={() => { setDestination(s); setShowDestSuggestions(false); }} style={{ padding: '10px 15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '14px' }}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedTrain ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
               <h4 style={{ color: '#666', margin: 0, fontSize: '14px' }}>রেজাল্ট ({filteredTrains.length})</h4>
               {(searchTerm || source || destination) && <button onClick={() => {setSearchTerm(''); setSource(''); setDestination('');}} style={{background: 'none', border: 'none', color: '#006a4e', fontSize: '12px', cursor: 'pointer'}}>মুছে ফেলুন</button>}
            </div>
            
            {filteredTrains.length > 0 ? filteredTrains.map((train, idx) => (
              <div key={idx} onClick={() => handleTrainSelect(train)} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ backgroundColor: '#f0f9f4', padding: '10px', borderRadius: '12px' }}><Clock size={20} color="#006a4e" /></div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{train.name}</div>
                    <div style={{ fontSize: '12px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {train.from} <ArrowRightLeft size={10} /> {train.to}
                    </div>
                  </div>
                </div>
                <ChevronDown size={18} color="#ccc" />
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                <p>কোন ট্রেন পাওয়া যায়নি। অন্য স্টেশন ট্রাই করুন।</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <button onClick={() => { setSelectedTrain(null); navigate('/schedule'); }} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '10px', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>← তালিকায় ফিরে যান</button>
            <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Last Updated: March 2026</p>
              <h1 style={{ fontSize: '24px', color: '#006a4e', marginBottom: '15px', fontWeight: '900' }}>{selectedTrain.name}</h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                <button 
                  onClick={() => navigate(`/track/${selectedTrain.id}`)}
                  style={{ width: '100%', background: '#006a4e', color: 'white', border: 'none', padding: '14px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  <Navigation size={18} /> Live Tracking Map
                </button>
                <div style={{ backgroundColor: '#f0f7ff', padding: '15px', borderRadius: '15px', borderLeft: '5px solid #007bff', display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}><Send size={20} color="#007bff" /></div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '13px', color: '#007bff' }}>SMS Tracking</h4>
                     <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>Type TR {selectedTrain.id} send to 16318</p>
                   </div>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="#006a4e" /> Station Wise Schedule
              </h3>
              <div style={{ overflowX: 'auto', marginBottom: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#006a4e', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Station</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Arrival</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Departure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTrain.stations.map((st, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fcfcfc', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: 'bold' }}>{st.name}</td>
                        <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center' }}>{st.arrival || '-'}</td>
                        <td style={{ padding: '12px', fontSize: '13px', textAlign: 'center', color: '#006a4e', fontWeight: '600' }}>{st.departure || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ backgroundColor: '#fff8f0', padding: '20px', borderRadius: '20px', border: '1px dashed #e67e22' }}>
                <h3 style={{ fontSize: '16px', color: '#e67e22', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} /> Detailed Journey Path
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '2', color: '#555', textAlign: 'justify' }}>
                  {generateLongDescription(selectedTrain).details}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TrainSchedule;