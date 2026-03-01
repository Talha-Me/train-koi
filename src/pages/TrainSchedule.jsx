// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { trains } from '../data/trainData'; 
// import { 
//   ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, Info, MessageSquare, Send
// } from 'lucide-react';

// const TrainSchedule = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTrain, setSelectedTrain] = useState(null);

//   const filteredTrains = trains.filter(t => 
//     t.name.toLowerCase().includes(searchTerm.toLowerCase())
//   ).slice(0, 10);

//   // Helper function to generate SEO long description
//   const generateLongDescription = (train) => {
//     let desc = `${train.name} travels ${train.from} to ${train.to} on every day of the week except ${train.offDay || 'কোন বন্ধের দিন নেই'}. `;
//     desc += `It departs from ${train.from} at ${train.stations[0].departure}, and arrives at ${train.to} at ${train.stations[train.stations.length - 1].arrival}. `;
    
//     let pathDetails = `${train.name} departs from ${train.stations[0].name} at ${train.stations[0].departure} BST. `;
//     train.stations.slice(1).forEach((st, index) => {
//       pathDetails += `Then it arrives in ${st.name}, at ${st.arrival} BST and then departs at ${st.departure || 'undefined'}. `;
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
//             placeholder="ট্রেনের নাম দিয়ে সার্চ করুন..." 
//             style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {!selectedTrain ? (
//           <div>
//             <h4 style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>ট্রেন তালিকা</h4>
//             {filteredTrains.map((train, idx) => (
//               <div key={idx} onClick={() => setSelectedTrain(train)} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #eee' }}>
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
//             <button onClick={() => setSelectedTrain(null)} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '10px', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold' }}>← তালিকায় ফিরে যান</button>
            
//             <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
//               <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Last Updated: 13th February, 2026</p>
//               <h1 style={{ fontSize: '26px', color: '#006a4e', marginBottom: '15px', fontWeight: '900' }}>{selectedTrain.name}</h1>
              
//               {/* --- Live Actions Container (Tracking & SMS) --- */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
//                 <button 
//                   onClick={() => navigate(`/track/${selectedTrain.id}`)}
//                   style={{ width: '100%', background: '#006a4e', color: 'white', border: 'none', padding: '14px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,106,78,0.2)' }}
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
//                    <strong>{selectedTrain.name}</strong> travels <strong>{selectedTrain.from} to {selectedTrain.to}</strong> on every day of the week except <strong>{selectedTrain.offDay || 'কোন বন্ধের দিন নেই'}</strong>. 
//                    It departs from <strong>{selectedTrain.from}</strong> at <strong>{selectedTrain.stations[0].departure}</strong>, and arrives at <strong>{selectedTrain.to}</strong> at <strong>{selectedTrain.stations[selectedTrain.stations.length - 1].arrival}</strong>.
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

//               {/* Dynamic Journey Path (Detailed SEO Text) */}
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
//     </div>
//   );
// };

// export default TrainSchedule;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trains } from '../data/trainData'; 
import { 
  ChevronLeft, Search, Clock, Navigation, ChevronDown, MapPin, Info, Send
} from 'lucide-react';

// --- Helper Function: ট্রেনের নাম থেকে ক্লিন ইংরেজি স্ল্যাগ তৈরি করার জন্য ---
const getCleanSlug = (trainName) => {
  if (!trainName) return "";
  // নাম থেকে ব্র্যাকেটের ভেতরের ইংরেজি অংশ খোঁজে (যেমন: "Lalmoni Express")
  const englishMatch = trainName.match(/\(([^)]+)\)/);
  const nameToProcess = englishMatch ? englishMatch[1] : trainName;

  return nameToProcess
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // স্পেশাল ক্যারেক্টার রিমুভ করে
    .replace(/\s+/g, '-');    // স্পেসকে ড্যাশ (-) দিয়ে পরিবর্তন করে
};

const TrainSchedule = () => {
  const navigate = useNavigate();
  const { trainSlug } = useParams(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);

  // --- Dynamic SEO Title logic (Strict Fix for Browser Tab) ---
  useEffect(() => {
    // আপনার অরিজিনাল র‍্যাঙ্ক করা টাইটেল (Home Page এর জন্য)
    const originalTitle = "Train Live Location | Train Tracking - TrainKoi";
    
    let currentTitle = "Train Schedule & Time Table 2026 | TrainKoi";
    
    if (selectedTrain) {
      currentTitle = `${selectedTrain.name} Schedule & Time Table 2026 | TrainKoi`;
    }
    
    // ব্রাউজার টাইটেল সেট করা
    document.title = currentTitle;

    // React Router বা StrictMode এর কারণে ওভাররাইড হওয়া আটকাতে ছোট সেফগার্ড
    const timer = setTimeout(() => {
      document.title = currentTitle;
    }, 150);

    // ক্লিনিং ফাংশন: এই কম্পোনেন্ট থেকে বের হয়ে গেলে আপনার অরিজিনাল টাইটেল ফিরে আসবে
    return () => {
      clearTimeout(timer);
      document.title = originalTitle;
    };
  }, [selectedTrain]);

  // URL এর স্ল্যাগ অনুযায়ী ট্রেন খুঁজে বের করা
  useEffect(() => {
    if (trainSlug) {
      const train = trains.find(t => getCleanSlug(t.name) === trainSlug);
      if (train) {
        setSelectedTrain(train);
      }
    } else {
      setSelectedTrain(null);
    }
  }, [trainSlug]);

  const filteredTrains = trains.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 15);

  // ট্রেন সিলেক্ট করলে ক্লিন ইউআরএল-এ নেভিগেট করা
  const handleTrainSelect = (train) => {
    const slug = getCleanSlug(train.name);
    navigate(`/schedule/${slug}`);
    setSelectedTrain(train);
  };

  // SEO এর জন্য বর্ণনা তৈরি
  const generateLongDescription = (train) => {
    if (!train || !train.stations || train.stations.length === 0) return { summary: "", details: "" };

    let desc = `${train.name} travels ${train.from} to ${train.to} on every day of the week except ${train.offDay || 'কোন বন্ধের দিন নেই'}. `;
    desc += `It departs from ${train.from} at ${train.stations[0].departure}, and arrives at ${train.to} at ${train.stations[train.stations.length - 1].arrival}. `;
    
    let pathDetails = `${train.name} departs from ${train.stations[0].name} at ${train.stations[0].departure} BST. `;
    train.stations.slice(1).forEach((st) => {
      pathDetails += `Then it arrives in ${st.name}, at ${st.arrival} BST and then departs at ${st.departure || 'END'}. `;
    });
    
    return { summary: desc, details: pathDetails };
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '50px' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
        <h3 style={{ margin: 0, fontSize: '18px' }}>ট্রেন শিডিউল ও সময়সূচী</h3>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Search Bar */}
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <Search size={20} color="#006a4e" />
          <input 
            type="text" 
            placeholder="ট্রেনের নাম দিয়ে সার্চ করুন..." 
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!selectedTrain ? (
          <div>
            <h4 style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>ট্রেন তালিকা</h4>
            {filteredTrains.map((train, idx) => (
              <div key={idx} onClick={() => handleTrainSelect(train)} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ backgroundColor: '#f0f9f4', padding: '10px', borderRadius: '12px' }}><Clock size={20} color="#006a4e" /></div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{train.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{train.from} ➔ {train.to}</div>
                  </div>
                </div>
                <ChevronDown size={18} color="#ccc" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <button onClick={() => { setSelectedTrain(null); navigate('/schedule'); }} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: '10px', marginBottom: '15px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>← তালিকায় ফিরে যান</button>
            
            <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Last Updated: March 2026</p>
              <h1 style={{ fontSize: '26px', color: '#006a4e', marginBottom: '15px', fontWeight: '900' }}>{selectedTrain.name}</h1>
              
              {/* --- Live Actions Container --- */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
                <button 
                  onClick={() => navigate(`/track/${selectedTrain.id}`)}
                  style={{ width: '100%', background: '#006a4e', color: 'white', border: 'none', padding: '14px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,106,78,0.2)', cursor: 'pointer' }}
                >
                  <Navigation size={18} /> Live Tracking Map
                </button>

                <div style={{ backgroundColor: '#f0f7ff', padding: '15px', borderRadius: '15px', borderLeft: '5px solid #007bff', display: 'flex', alignItems: 'center', gap: '15px' }}>
                   <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}><Send size={20} color="#007bff" /></div>
                   <div>
                     <h4 style={{ margin: 0, fontSize: '13px', color: '#007bff' }}>SMS Tracking</h4>
                     <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>Type <span style={{color: '#d63384'}}>TR {selectedTrain.id}</span> and send to <span style={{color: '#d63384'}}>16318</span></p>
                   </div>
                </div>
              </div>

              {/* Summary Section */}
              <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px' }}>
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#333', margin: 0 }}>
                    <strong>{selectedTrain.name}</strong> travels <strong>{selectedTrain.from} to {selectedTrain.to}</strong> on every day of the week except <strong>{selectedTrain.offDay || 'কোন বন্ধের দিন নেই'}</strong>. 
                    It departs from <strong>{selectedTrain.from}</strong> at <strong>{selectedTrain.stations[0]?.departure}</strong>, and arrives at <strong>{selectedTrain.to}</strong> at <strong>{selectedTrain.stations[selectedTrain.stations.length - 1]?.arrival}</strong>.
                </p>
              </div>

              {/* Schedule Table */}
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

              {/* Detailed SEO Text */}
              <div style={{ backgroundColor: '#fff8f0', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px dashed #e67e22' }}>
                <h3 style={{ fontSize: '16px', color: '#e67e22', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Info size={18} /> Detailed Journey Path
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '2', color: '#555', textAlign: 'justify' }}>
                  {generateLongDescription(selectedTrain).details}
                </p>
              </div>

              {/* FAQ Section */}
              <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>Frequently Asked Questions</h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>What are the operating days of {selectedTrain.name}?</p>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{selectedTrain.name} operates every day except {selectedTrain.offDay || 'No offday'}.</p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>Where does {selectedTrain.name} start and end?</p>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{selectedTrain.name} starts at {selectedTrain.from} and ends at {selectedTrain.to}.</p>
                </div>

                {selectedTrain.stations.slice(1, 4).map((st, i) => (
                  <div key={i} style={{ marginBottom: '20px' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 5px 0' }}>When does {selectedTrain.name} arrive at {st.name}?</p>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>It arrives at {st.name} at {st.arrival} BST during its journey from {selectedTrain.from} to {selectedTrain.to}.</p>
                  </div>
                ))}
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