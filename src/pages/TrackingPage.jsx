// //  main code
// import React, { useState, useMemo, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { MapContainer, TileLayer, Marker, Tooltip, useMap, GeoJSON } from 'react-leaflet';
// import L from 'leaflet';
// import { ChevronLeft, AlertCircle, Clock, MapPin, Navigation } from 'lucide-react';
// import { io } from 'socket.io-client';
// import { trains } from '../data/trainData';
// import { stationCoords } from '../data/stationCoords';

// // --- src/data/railway.json ইমপোর্ট ---
// import railData from '../data/railway.json';

// const SOCKET_URL = "https://train-koi.onrender.com"; 
// const API_URL = "https://train-koi.onrender.com/api"; // এখানে /api যোগ করা হয়েছে 
// const socket = io(SOCKET_URL, { transports: ['websocket'] });

// // --- Helpers ---
// const parseToMinutes = (timeStr) => {
//   if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
//   const match = timeStr.toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
//   if (!match) return null;
//   let [ , hrs, mins, mod] = match;
//   let h = parseInt(hrs);
//   if (mod === 'pm' && h < 12) h += 12;
//   if (mod === 'am' && h === 12) h = 0;
//   return h * 60 + parseInt(mins);
// };

// const minutesToTime = (totalMinutes) => {
//   let mins = Math.round(totalMinutes);
//   mins = ((mins % 1440) + 1440) % 1440; 
//   let h = Math.floor(mins / 60);
//   let m = mins % 60;
//   let mod = h >= 12 ? 'PM' : 'AM';
//   h = h % 12 || 12;
//   return `${h}:${m.toString().padStart(2, '0')} ${mod}`;
// };

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
//   const R = 6371; 
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
//   return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
// };

// const getSnappedPoint = (lat, lng, geojson) => {
//   if (!geojson || !geojson.features) return [lat, lng];
//   let minDistance = Infinity;
//   let snapped = [lat, lng];
//   geojson.features.forEach(feature => {
//     if (feature.geometry.type === 'LineString') {
//       feature.geometry.coordinates.forEach(coord => {
//         const d = calculateDistance(lat, lng, coord[1], coord[0]);
//         if (d < minDistance) {
//           minDistance = d;
//           snapped = [coord[1], coord[0]];
//         }
//       });
//     }
//   });
//   return snapped;
// };

// const RecenterMap = ({ center }) => {
//   const map = useMap();
//   useEffect(() => { if (center) map.setView(center, map.getZoom()); }, [center]);
//   return null;
// };

// const TrackingPage = () => {
//   const { trainId } = useParams();
//   const [liveData, setLiveData] = useState(null);
//   const [currentTime, setCurrentTime] = useState(Date.now());
//   const [isTraveler, setIsTraveler] = useState(null); 
//   const [isSharing, setIsSharing] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const train = useMemo(() => trains.find(t => t.id === parseInt(trainId)), [trainId]);

//   // --- Train title change korar code ---
// useEffect(() => {
//   const originalTitle = "Train Live Location | Train Tracking - TrainKoi";
//   let currentTitle = "Live Train Tracking & Location | TrainKoi";
  
//   if (train) {
//     currentTitle = `${train.name} Live Location & Tracking | TrainKoi`;
//   }
  
//   document.title = currentTitle;

//   const timer = setTimeout(() => {
//     document.title = currentTitle;
//   }, 150);

//   return () => {
//     clearTimeout(timer);
//     document.title = originalTitle;
//   };
// }, [train, trainId]);

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => { if (isTraveler === null) setShowModal(true); }, 2000);
//     return () => clearTimeout(timer);
//   }, [isTraveler]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const res = await fetch(`${API_URL}/train-location/${trainId}`);
//         if (res.ok) {
//           const data = await res.json();
//           setLiveData(data);
//         }
//       } catch (err) {}
//     };
//     fetchInitialData();
//     socket.on("receive_location", (data) => {
//       if (Number(data.trainId) === Number(trainId)) setLiveData(data);
//     });
//     return () => socket.off("receive_location");
//   }, [trainId]);

//   const scheduleData = useMemo(() => {
//     if (!train) return [];
//     return train.stations.map((st, i) => ({
//       ...st,
//       absMin: parseToMinutes(st.arrival === "START" ? st.departure : st.arrival),
//       idx: i
//     })).filter(s => s.absMin !== null);
//   }, [train]);

//   useEffect(() => {
//     let watchId;
//     if (isSharing && isTraveler && train && scheduleData.length > 0) {
//       watchId = navigator.geolocation.watchPosition((pos) => {
//         const { latitude, longitude, speed } = pos.coords;
//         const currentSpeed = Math.round((speed || 0) * 3.6);
        
//         // ১. নতুন লজিক: গতি ৫ কিমি/ঘণ্টার বেশি হতে হবে
//         const isMoving = currentSpeed >= 5;

//         // ২. নতুন টাইম লজিক: রাত ১২টা পার হলেও যেন ট্র্যাকিং কাজ করে
//         const now = new Date();
//         const currentMin = now.getHours() * 60 + now.getMinutes();
//         const startMin = scheduleData[0].absMin;
//         const endMin = scheduleData[scheduleData.length - 1].absMin;
//         const isCrossDay = endMin < startMin;

//         let isWithinTime = false;
//         if (isCrossDay) {
//           // রাত ১২টার পর এবং যাত্রা শুরুর ১০ ঘণ্টা পর্যন্ত বাফার রাখা হয়েছে
//           isWithinTime = (currentMin >= (startMin - 60) || currentMin <= (endMin + 600));
//         } else {
//           isWithinTime = (currentMin >= (startMin - 60) && currentMin <= (endMin + 600));
//         }

//         if (isMoving && isWithinTime) {
//           const locationData = { trainId: parseInt(trainId), lat: latitude, lng: longitude, speed: currentSpeed };
          
//           // সকেটে পাঠানো
//           socket.emit("send_location", locationData);

//           // ব্যাকএন্ড API-তে পার্মানেন্ট সেভ করা
//           fetch(`${API_URL}/train-location/update`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(locationData)
//           }).catch(err => console.error("Update Error:", err));
//         }
//       }, (err) => {
//         console.error("GPS Error:", err);
//       }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
//     }
//     return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
//   }, [isSharing, isTraveler, trainId, train, scheduleData]);

//   const activeState = useMemo(() => {
//     if (!train || scheduleData.length === 0) return { lat: 23.81, lng: 90.41, speed: 0, mode: 'OFFLINE', isRunning: false };
    
//     const nowObj = new Date(currentTime);
//     const currentMinWithSec = nowObj.getHours() * 60 + nowObj.getMinutes() + (nowObj.getSeconds() / 60);

//     const getScheduledState = () => {
//       const startMin = scheduleData[0].absMin;
//       const endMin = scheduleData[scheduleData.length - 1].absMin;
//       const isCrossDay = endMin < startMin;

//       const daysInBangla = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
//       const todayName = daysInBangla[nowObj.getDay()];
      
//       const yesterdayDate = new Date(currentTime);
//       yesterdayDate.setDate(nowObj.getDate() - 1);
//       const yesterdayName = daysInBangla[yesterdayDate.getDay()];

//       const canStartToday = !train.offDay.includes(todayName);
//       const startedYesterday = isCrossDay && !train.offDay.includes(yesterdayName);

//       let inSchedule = false;
//       if (isCrossDay) {
//         // ৬০০ মিনিট (সকাল ১০টা) বাফার রাখা হয়েছে গতকালের ট্রিপ শেষ করার জন্য
//         inSchedule = (currentMinWithSec >= (startMin - 60) && canStartToday) || 
//                      (currentMinWithSec <= (endMin + 600) && startedYesterday);
//       } else {
//         inSchedule = (currentMinWithSec >= (startMin - 60) && currentMinWithSec <= (endMin + 600) && canStartToday);
//       }

//       if (inSchedule) {
//         let currentIndex = 0;
//         let lat, lng;
//         for (let i = 0; i < scheduleData.length - 1; i++) {
//           let stMin = scheduleData[i].absMin;
//           let nextStMin = scheduleData[i+1].absMin;
//           let normalizedCurrent = currentMinWithSec;
//           let currSt = stMin;
//           let nextSt = nextStMin;
          
//           if (isCrossDay) {
//               if (currentMinWithSec < 600) normalizedCurrent += 1440;
//               if (stMin < 600) currSt += 1440;
//               if (nextStMin < 600) nextSt += 1440;
//           }
          
//           if (normalizedCurrent >= currSt && normalizedCurrent < nextSt) {
//             currentIndex = scheduleData[i].idx;
//             const c1 = stationCoords[train.stations[i].name.trim()];
//             const c2 = stationCoords[train.stations[i+1].name.trim()];
//             if (c1 && c2) {
//               const timeDiff = nextSt - currSt;
//               const progress = (normalizedCurrent - currSt) / timeDiff;
//               lat = c1[0] + (c2[0] - c1[0]) * progress;
//               lng = c1[1] + (c2[1] - c1[1]) * progress;
//             }
//             break;
//           }
//         }
//         if (!lat) {
//           const lastStIdx = scheduleData.length - 1;
//           currentIndex = scheduleData[lastStIdx].idx;
//           const coords = stationCoords[train.stations[currentIndex].name.trim()];
//           lat = coords[0]; lng = coords[1];
//         }
//         const [sLat, sLng] = getSnappedPoint(lat, lng, railData);
//         return { lat: sLat, lng: sLng, speed: 45, mode: 'SCHEDULED', isRunning: true, index: currentIndex, delay: 0 };
//       }
//       return { mode: 'OFFLINE', isRunning: false, index: 0, delay: 0, lat: 23.81, lng: 90.41 };
//     };

//     if (liveData && (liveData.lat || liveData.lastLocation?.lat)) {
//       const rawLat = Number(liveData.lat || liveData.lastLocation?.lat);
//       const rawLng = Number(liveData.lng || liveData.lastLocation?.lng);
//       const updateTime = liveData.updatedAt || liveData.lastLocation?.updatedAt;
//       const lastUpdateTs = new Date(updateTime).getTime();
      
//       const diffInSec = (currentTime - lastUpdateTs) / 1000;
//       const diffInMin = diffInSec / 60; 
      
//       let baseSpeed = liveData.speed || 0; 
//       let currentSpeed = baseSpeed;
//       let mode = 'LIVE';

//       if (diffInMin <= 20) {
//         mode = 'LIVE';
//         currentSpeed = baseSpeed;
//       } else if (diffInMin <= 120) {
//         mode = 'PREDICTED';
//         if (diffInMin > 60) {
//           const reductionProgress = (diffInMin - 60) / 60; 
//           currentSpeed = Math.max(15, baseSpeed - (baseSpeed - 15) * reductionProgress);
//         }
//       } else {
//         return getScheduledState();
//       }

//       const delay = liveData.delay || 0;
//       const distanceMoved = (currentSpeed / 3600) * Math.max(0, diffInSec); 

//       let matchedIdx = 0; let minD = Infinity;
//       scheduleData.forEach((st) => {
//         const coords = stationCoords[st.name.trim()];
//         if (coords) {
//           const d = calculateDistance(rawLat, rawLng, coords[0], coords[1]);
//           if (d < minD) { minD = d; matchedIdx = st.idx; }
//         }
//       });

//       let nextStation = train.stations[matchedIdx + 1] || train.stations[matchedIdx];
//       let nextCoords = stationCoords[nextStation.name.trim()];
      
//       let lat = rawLat;
//       let lng = rawLng;

//       if (nextCoords && distanceMoved > 0) {
//           const totalDistToNext = calculateDistance(rawLat, rawLng, nextCoords[0], nextCoords[1]);
//           const ratio = Math.min(distanceMoved / totalDistToNext, 0.999); 
//           lat = rawLat + (nextCoords[0] - rawLat) * ratio;
//           lng = rawLng + (nextCoords[1] - rawLng) * ratio;
//       }

//       const [finalLat, finalLng] = getSnappedPoint(lat, lng, railData);
//       return { 
//         lat: finalLat, 
//         lng: finalLng, 
//         speed: Math.round(currentSpeed), 
//         mode, 
//         lastSeen: Math.floor(diffInMin), 
//         isRunning: true, 
//         index: matchedIdx, 
//         delay 
//       };
//     }

//     return getScheduledState();
//   }, [train, liveData, currentTime, scheduleData]);

//   const stats = useMemo(() => {
//     if (!activeState || !activeState.isRunning) return null;
//     const nextSt = train.stations[activeState.index + 1] || train.stations[activeState.index];
//     const lastSt = train.stations[train.stations.length - 1];
    
//     const nextCoords = stationCoords[nextSt.name.trim()];
//     const destCoords = stationCoords[lastSt.name.trim()];
    
//     const dNext = calculateDistance(activeState.lat, activeState.lng, nextCoords?.[0], nextCoords?.[1]);
//     const dDest = calculateDistance(activeState.lat, activeState.lng, destCoords?.[0], destCoords?.[1]);
    
//     const calcSpeed = activeState.speed > 5 ? activeState.speed : 25;
    
//     const nextArrivalMin = parseToMinutes(nextSt.arrival === 'START' ? nextSt.departure : nextSt.arrival);

//     return {
//       nextStName: nextSt.name.split('(')[0],
//       destName: lastSt.name.split('(')[0],
//       distNext: dNext.toFixed(2), 
//       distDest: dDest.toFixed(2),
//       etaNext: minutesToTime(nextArrivalMin + activeState.delay),
//       etaDest: minutesToTime(parseToMinutes(lastSt.arrival) + activeState.delay)
//     };
//   }, [activeState, train, currentTime]);

//   if (!train) return null;

//   return (
//     <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
//       <style>{`
//         .leaflet-marker-icon { transition: transform 1s linear !important; }
//         .live-dot { width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(0,0,0,0.2); position: relative; } 
//         .pulse { position: absolute; inset: -10px; border-radius: 50%; animation: p 2s infinite; } 
//         @keyframes p { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } } 
//         .station-tooltip { background: white !important; border: 1.5px solid #006a4e !important; color: #006a4e !important; border-radius: 6px !important; padding: 3px 8px !important; font-size: 11px !important; font-weight: 800 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
//       `}</style>

//       <div style={{ 
//   background: '#006a4e', 
//   color: 'white', 
//   padding: '16px', 
//   display: 'flex', 
//   flexDirection: 'column', 
//   position: 'sticky', 
//   top: 0, 
//   zIndex: 1000,
//   boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
// }}>
//   <div style={{ display: 'flex', alignItems: 'center' }}>
//     <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
//       <ChevronLeft size={24} />
//     </Link>
    
//     <div style={{ flex: 1, marginLeft: '12px' }}>
//       <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{train.name}</h4>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
//         <span style={{ 
//           fontSize: '10px', 
//           background: !activeState.isRunning ? '#555' : (activeState.mode === 'LIVE' ? '#ef4444' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#3b82f6')), 
//           padding: '2px 8px', 
//           borderRadius: '4px', 
//           fontWeight: 'bold',
//           textTransform: 'uppercase'
//         }}>
//           {!activeState.isRunning ? 'OFFLINE' : activeState.mode}
//         </span>
//         {activeState.isRunning && (
//           <span style={{ fontSize: '11px', opacity: 0.9 }}>
//             • {activeState.lastSeen === 0 || !activeState.lastSeen ? 'Just now' : `${activeState.lastSeen}m ago`}
//           </span>
//         )}
//       </div>
//     </div>
//   </div>
//   <div style={{ 
//     marginTop: '12px', 
//     fontSize: '12px', 
//     padding: '10px', 
//     borderRadius: '8px', 
//     background: 'rgba(255, 255, 255, 0.12)', 
//     lineHeight: '1.5',
//     borderLeft: `4px solid ${!activeState.isRunning ? '#94a3b8' : (activeState.mode === 'LIVE' ? '#ef4444' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#3b82f6'))}`,
//     backdropFilter: 'blur(5px)'
//   }}>
//     {!activeState.isRunning ? (
//       <div style={{ display: 'flex', gap: '8px' }}>
//         <span>🛑</span>
//         <span>এই ট্রেনটি বর্তমানে এই রুটে চলছে না। আজ ট্রেনের সাপ্তাহিক ছুটি হতে পারে অথবা এটি এখনো যাত্রা শুরু করেনি।</span>
//       </div>
//     ) : (
//       <>
//         {activeState.mode === 'LIVE' && (
//           <div style={{ display: 'flex', gap: '8px' }}>
//             <span>🛰️</span>
//             <span>এই ট্রেনটির <b>লাইভ লোকেশন</b> শেয়ার করা হয়েছে।</span>
//           </div>
//         )}
//         {activeState.mode === 'PREDICTED' && (
//           <div style={{ display: 'flex', gap: '8px' }}>
//             <span>⚠️</span>
//             <span>এই ট্রেনটির লাইভ লোকেশন অনেকক্ষণ আগে শেয়ার করা হয়েছিল, তাই <b>প্রেডিকশন</b> করে লোকেশন দেখানো হচ্ছে।</span>
//           </div>
//         )}
//         {activeState.mode === 'SCHEDULED' && (
//           <div style={{ display: 'flex', gap: '8px' }}>
//             <span>📅</span>
//             <span>এই ট্রেনটির লাইভ লোকেশন কেউ শেয়ার করেনি, তাই <b>শিডিউল</b> অনুযায়ী সম্ভাব্য অবস্থান দেখানো হচ্ছে।</span>
//           </div>
//         )}
//       </>
//     )}
//         </div>
//       </div>

//       <div style={{ height: '45vh', width: '100%' }}>
//         <MapContainer center={[activeState.lat, activeState.lng]} zoom={11} style={{ height: '100%' }}>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
//           {railData && railData.features && (
//             <GeoJSON 
//               data={railData} 
//               style={() => ({ color: '#006a4e', weight: 2, opacity: 0.8 })}
//             />
//           )}

//           <RecenterMap center={[activeState.lat, activeState.lng]} />
          
//           {train.stations.map((st, i) => {
//             const coords = stationCoords[st.name.trim()];
//             if (!coords) return null;
//             const [snapLat, snapLng] = getSnappedPoint(coords[0], coords[1], railData);
//             return (
//               <Marker 
//                 key={i} 
//                 position={[snapLat, snapLng]} 
//                 icon={L.divIcon({ 
//                   html: `<div style="width: 10px; height: 10px; background: white; border: 2.5px solid #006a4e; border-radius: 50%; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`, 
//                   iconSize: [10, 10], iconAnchor: [5, 5]
//                 })}
//               >
//                 <Tooltip permanent direction="top" className="station-tooltip" offset={[0, -8]}>{st.name.split('(')[0]}</Tooltip>
//               </Marker>
//             );
//           })}

//           <Marker 
//             position={[activeState.lat, activeState.lng]} 
//             icon={L.divIcon({ 
//               html: `
//                 <div class="pulse" style="background:${activeState.speed < 5 ? 'rgba(239,68,68,0.4)' : (activeState.mode === 'LIVE' ? 'rgba(0,106,78,0.3)' : 'rgba(245,158,11,0.3)')}"></div>
//                 <div class="live-dot" style="background:${activeState.speed < 5 ? '#ef4444' : (activeState.mode === 'LIVE' ? '#006a4e' : '#f59e0b')}"></div>
//               `,
//               iconSize: [20, 20], iconAnchor: [10, 10]
//             })} 
//           />
//         </MapContainer>
//       </div>

//       <div style={{ padding: '10px 16px', marginTop: '10px' }}>
//         {isTraveler === true ? (
//           <div style={{ background: isSharing ? '#ecfdf5' : '#fff7ed', padding: '12px', borderRadius: '12px', border: `1px solid ${isSharing ? '#10b981' : '#f97316'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1f2937' }}>{isSharing ? '📍 আপনি লোকেশন শেয়ার করছেন' : '⏸️ শেয়ারিং বন্ধ আছে'}</div>
//               <div style={{ fontSize: '11px', color: '#6b7280' }}>আপনার অবদান অন্যদের সাহায্য করছে</div>
//             </div>
//             <button onClick={() => setIsSharing(!isSharing)} style={{ background: isSharing ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{isSharing ? 'বন্ধ করুন' : 'চালু করুন'}</button>
//           </div>
//         ) : (
//           <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
//             <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>আপনি কি এই মুহূর্তে এই ট্রেনে ভ্রমণ করছেন?</p>
//             <button onClick={() => {setIsTraveler(true); setIsSharing(true); setShowModal(false);}} style={{ background: '#006a4e', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', marginRight: '10px', fontSize: '12px' }}>হ্যাঁ, আমি আছি</button>
//             <button onClick={() => {setIsTraveler(false); setShowModal(false);}} style={{ background: '#e2e8f0', color: '#475569', border: 'none', padding: '5px 15px', borderRadius: '6px', fontSize: '12px' }}>না</button>
//           </div>
//         )}
//       </div>

//       {activeState.isRunning ? (
//         <div style={{ padding: '0 16px', marginTop: '10px', position: 'relative', zIndex: 1001 }}>
//           <div style={{ background: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
//               <div style={{ textAlign: 'center', flex: 1 }}><div style={{ fontSize: '20px', fontWeight: '900', color: activeState.speed < 5 ? '#ef4444' : '#006a4e' }}>{activeState.speed}</div><div style={{ fontSize: '10px', color: '#888' }}>গতি (KM/H)</div></div>
//               <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid #eee' }}><div style={{ fontSize: '20px', fontWeight: '900', color: '#ef4444' }}>{activeState.delay}</div><div style={{ fontSize: '10px', color: '#888' }}>ট্রেনটি দেরিতে চলছে (MIN)</div></div>
//               <div style={{ textAlign: 'center', flex: 1, borderLeft: '1px solid #eee' }}><div style={{ fontSize: '20px', fontWeight: '900', color: '#3b82f6' }}>{stats?.distNext}</div><div style={{ fontSize: '10px', color: '#888' }}>পরবর্তী স্টেশনে যেতে বাকি (KM)</div></div>
//             </div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
//               <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '15px', border: '1px solid #dcfce7' }}><div style={{ fontSize: '10px', color: '#166534', fontWeight: 'bold' }}>{stats?.nextStName}</div><div style={{ fontWeight: '900', fontSize: '14px', color: '#14532d' }}><Clock size={12} style={{ marginRight: '4px' }} /> {stats?.etaNext}</div></div>
//               <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '15px', border: '1px solid #dbeafe' }}><div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 'bold' }}>{stats?.destName}</div><div style={{ fontWeight: '900', fontSize: '14px', color: '#1e3a8a' }}><Navigation size={12} style={{ marginRight: '4px' }} /> {stats?.etaDest}</div></div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div style={{ padding: '20px', textAlign: 'center' }}>
//           <AlertCircle size={40} color="#ef4444" style={{ marginBottom: '10px', margin: '0 auto' }} />
//           <h4 style={{ color: '#1f2937', margin: '10px 0 5px' }}>ট্রেনটি বর্তমানে এই রুটে চলছে না।</h4>
//           <p style={{ color: '#64748b', fontSize: '12px' }}>আজ ট্রেনের অফ-ডে হতে পারে অথবা এখন ট্রেনের চলাচলের সময় নয়।</p>
//         </div>
//       )}

//       <div style={{ padding: '20px 20px 50px' }}>
//         <div style={{ background: 'white', borderRadius: '24px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
//           <h4 style={{ marginBottom: '25px', fontWeight: 'bold', color: '#333' }}>ট্রেনটি নিচের স্টেশনগুলোতে থামবে</h4>
//           {train.stations.map((st, i) => {
//             const isPassed = activeState.isRunning ? (i < activeState.index) : false;
//             const isCurrent = activeState.isRunning ? (i === activeState.index) : false;
            
//             const schedMin = parseToMinutes(st.arrival === 'START' ? st.departure : st.arrival);
//             const expectedTime = schedMin !== null ? minutesToTime(schedMin + (activeState.delay || 0)) : '--';
            
//             let stayTime = 0;
//             if (st.arrival !== "START" && st.departure !== "END") {
//                 stayTime = parseToMinutes(st.departure) - parseToMinutes(st.arrival);
//             }

//             return (
//               <div key={i} style={{ display: 'flex', gap: '20px', opacity: isPassed ? 0.6 : 1 }}>
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                   <div style={{ 
//                     width: 14, height: 14, borderRadius: '50%', 
//                     background: isCurrent ? (activeState.speed < 5 ? '#ef4444' : '#3b82f6') : (isPassed ? '#006a4e' : '#e2e8f0'), 
//                     border: isCurrent ? '4px solid #bfdbfe' : 'none',
//                     zIndex: 2
//                   }}></div>
//                   {i < train.stations.length - 1 && <div style={{ width: 2, flex: 1, background: isPassed ? '#006a4e' : '#f1f5f9', minHeight: '60px' }}></div>}
//                 </div>
//                 <div style={{ flex: 1, paddingBottom: '25px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <div>
//                       <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#000' }}>
//                         {st.name}
//                         {isCurrent && activeState.speed < 5 && 
//                           <span style={{ marginLeft: '8px', fontSize: '10px', color: '#ef4444', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>At Station</span>
//                         }
//                       </div>
//                       <div style={{ fontSize: '11px', color: '#64748b' }}>শিডিউল: {st.arrival !== 'START' ? st.arrival : st.departure}</div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div style={{ fontWeight: 'bold', fontSize: '13px', color: (activeState.delay > 0 && !isPassed) ? '#ef4444' : '#006a4e' }}>
//                         {expectedTime}
//                       </div>
//                       {stayTime > 0 && !isPassed && (
//                         <div style={{ fontSize: '10px', color: '#64748b' }}>বিরতি: {stayTime} মিনিট</div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {showModal && (
//         <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
//           <div style={{ background: 'white', padding: '25px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
//             <div style={{ fontSize: '40px' }}>🚆</div>
//             <h3 style={{ margin: '15px 0 10px' }}>ভ্রমণ নিশ্চিত করুন</h3>
//             <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>সঠিক লোকেশন পেতে আপনার সাহায্য প্রয়োজন। আপনি কি এই মুহূর্তে <b>{train.name}</b> ট্রেনে আছেন?</p>
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <button onClick={() => {setIsTraveler(true); setIsSharing(true); setShowModal(false);}} style={{ flex: 1, background: '#006a4e', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>হ্যাঁ, শেয়ার করুন</button>
//               <button onClick={() => {setIsTraveler(false); setShowModal(false);}} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>না, শুধু দেখুন</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackingPage;


// // tesing

//  main code
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { ChevronLeft, AlertCircle, Clock, MapPin, Navigation } from 'lucide-react';
import { io } from 'socket.io-client';
import { trains } from '../data/trainData';
import { stationCoords } from '../data/stationCoords';
import railData from '../data/railway.json';

const SOCKET_URL = "https://train-koi.onrender.com"; 
const API_URL = "https://train-koi.onrender.com/api"; 
const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });

// --- Helpers ---
const parseToMinutes = (timeStr) => {
  if (!timeStr || ["START", "END", "---"].includes(timeStr)) return null;
  const match = timeStr.toLowerCase().match(/(\d+):(\d+)\s*(am|pm)/);
  if (!match) return null;
  let [ , hrs, mins, mod] = match;
  let h = parseInt(hrs);
  if (mod === 'pm' && h < 12) h += 12;
  if (mod === 'am' && h === 12) h = 0;
  return h * 60 + parseInt(mins);
};

const minutesToTime = (totalMinutes) => {
  let mins = Math.round(totalMinutes);
  mins = ((mins % 1440) + 1440) % 1440; 
  let h = Math.floor(mins / 60);
  let m = mins % 60;
  let mod = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${mod}`;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const getSnappedPoint = (lat, lng, geojson) => {
  if (!geojson || !geojson.features) return [lat, lng];
  let minDistance = Infinity;
  let snapped = [lat, lng];
  geojson.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      feature.geometry.coordinates.forEach(coord => {
        const d = calculateDistance(lat, lng, coord[1], coord[0]);
        if (d < minDistance) {
          minDistance = d;
          snapped = [coord[1], coord[0]];
        }
      });
    }
  });
  return snapped;
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => { 
    if (center && center[0] && center[1]) {
        map.setView(center, map.getZoom()); 
    }
  }, [center, map]);
  return null;
};

const TrackingPage = () => {
  const { trainId } = useParams();
  const [liveData, setLiveData] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isTraveler, setIsTraveler] = useState(null); 
  const [isSharing, setIsSharing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const train = useMemo(() => trains.find(t => t.id === parseInt(trainId)), [trainId]);

  // Page Title Update
  useEffect(() => {
    if (train) {
      document.title = `${train.name} Live Location & Tracking | TrainKoi`;
    }
    return () => {
      document.title = "Train Live Location | Train Tracking - TrainKoi";
    };
  }, [train]);

  // Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show Modal after 2 seconds if status unknown
  useEffect(() => {
    const timer = setTimeout(() => { 
      if (isTraveler === null) setShowModal(true); 
    }, 2000);
    return () => clearTimeout(timer);
  }, [isTraveler]);

  // Fetch Initial Data and Socket Setup
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch(`${API_URL}/train-location/${trainId}`);
        if (res.ok) {
          const data = await res.json();
          setLiveData(data);
        }
      } catch (err) { console.error("Fetch Error:", err); }
    };
    fetchInitialData();

    socket.on("receive_location", (data) => {
      if (Number(data.trainId) === Number(trainId)) {
        setLiveData(data);
      }
    });

    return () => {
      socket.off("receive_location");
    };
  }, [trainId]);

  const scheduleData = useMemo(() => {
    if (!train) return [];
    return train.stations.map((st, i) => ({
      ...st,
      absMin: parseToMinutes(st.arrival === "START" ? st.departure : st.arrival),
      idx: i
    })).filter(s => s.absMin !== null);
  }, [train]);

  // Geolocation Sharing Logic
  useEffect(() => {
    let watchId;
    if (isSharing && isTraveler && train && scheduleData.length > 0) {
      watchId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude, speed } = pos.coords;
        const currentSpeed = Math.round((speed || 0) * 3.6);
        
        const isMoving = currentSpeed >= 5;
        const now = new Date();
        const currentMin = now.getHours() * 60 + now.getMinutes();
        const startMin = scheduleData[0].absMin;
        const endMin = scheduleData[scheduleData.length - 1].absMin;
        const isCrossDay = endMin < startMin;

        let isWithinTime = false;
        if (isCrossDay) {
          isWithinTime = (currentMin >= (startMin - 60) || currentMin <= (endMin + 600));
        } else {
          isWithinTime = (currentMin >= (startMin - 60) && currentMin <= (endMin + 600));
        }

        if (isMoving && isWithinTime) {
          const locationData = { trainId: parseInt(trainId), lat: latitude, lng: longitude, speed: currentSpeed };
          socket.emit("send_location", locationData);

          fetch(`${API_URL}/train-location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(locationData)
          }).catch(err => console.error("Update Error:", err));
        }
      }, (err) => {
        console.error("GPS Error:", err);
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, [isSharing, isTraveler, trainId, train, scheduleData]);

  // Active State Logic (Live, Predicted, Scheduled)
  const activeState = useMemo(() => {
    if (!train || scheduleData.length === 0) return { lat: 23.81, lng: 90.41, speed: 0, mode: 'OFFLINE', isRunning: false };
    
    const nowObj = new Date(currentTime);
    const currentMinWithSec = nowObj.getHours() * 60 + nowObj.getMinutes() + (nowObj.getSeconds() / 60);

    const getScheduledState = () => {
      const startMin = scheduleData[0].absMin;
      const endMin = scheduleData[scheduleData.length - 1].absMin;
      const isCrossDay = endMin < startMin;
      const daysInBangla = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
      const todayName = daysInBangla[nowObj.getDay()];
      
      const yesterdayDate = new Date(currentTime);
      yesterdayDate.setDate(nowObj.getDate() - 1);
      const yesterdayName = daysInBangla[yesterdayDate.getDay()];

      const canStartToday = !train.offDay.includes(todayName);
      const startedYesterday = isCrossDay && !train.offDay.includes(yesterdayName);

      let inSchedule = false;
      if (isCrossDay) {
        inSchedule = (currentMinWithSec >= (startMin - 60) && canStartToday) || 
                     (currentMinWithSec <= (endMin + 600) && startedYesterday);
      } else {
        inSchedule = (currentMinWithSec >= (startMin - 60) && currentMinWithSec <= (endMin + 600) && canStartToday);
      }

      if (inSchedule) {
        let currentIndex = 0;
        let lat, lng;
        for (let i = 0; i < scheduleData.length - 1; i++) {
          let stMin = scheduleData[i].absMin;
          let nextStMin = scheduleData[i+1].absMin;
          let normalizedCurrent = currentMinWithSec;
          let currSt = stMin;
          let nextSt = nextStMin;
          
          if (isCrossDay) {
              if (currentMinWithSec < 600) normalizedCurrent += 1440;
              if (stMin < 600) currSt += 1440;
              if (nextStMin < 600) nextSt += 1440;
          }
          
          if (normalizedCurrent >= currSt && normalizedCurrent < nextSt) {
            currentIndex = scheduleData[i].idx;
            const c1 = stationCoords[train.stations[i].name.trim()];
            const c2 = stationCoords[train.stations[i+1].name.trim()];
            if (c1 && c2) {
              const timeDiff = nextSt - currSt;
              const progress = (normalizedCurrent - currSt) / timeDiff;
              lat = c1[0] + (c2[0] - c1[0]) * progress;
              lng = c1[1] + (c2[1] - c1[1]) * progress;
            }
            break;
          }
        }
        if (!lat) {
          const lastStIdx = scheduleData.length - 1;
          currentIndex = scheduleData[lastStIdx].idx;
          const coords = stationCoords[train.stations[currentIndex].name.trim()];
          lat = coords[0]; lng = coords[1];
        }
        const [sLat, sLng] = getSnappedPoint(lat, lng, railData);
        return { lat: sLat, lng: sLng, speed: 45, mode: 'SCHEDULED', isRunning: true, index: currentIndex, delay: 0 };
      }
      return { mode: 'OFFLINE', isRunning: false, index: 0, delay: 0, lat: 23.81, lng: 90.41 };
    };

    if (liveData && (liveData.lat || liveData.lastLocation?.lat)) {
      const rawLat = Number(liveData.lat || liveData.lastLocation?.lat);
      const rawLng = Number(liveData.lng || liveData.lastLocation?.lng);
      const updateTime = liveData.updatedAt || liveData.lastLocation?.updatedAt;
      const lastUpdateTs = new Date(updateTime).getTime();
      const diffInMin = (currentTime - lastUpdateTs) / 60000;
      
      let baseSpeed = liveData.speed || 0; 
      let currentSpeed = baseSpeed;
      let mode = 'LIVE';

      if (diffInMin <= 20) {
        mode = 'LIVE';
      } else if (diffInMin <= 120) {
        mode = 'PREDICTED';
        if (diffInMin > 60) {
          const reductionProgress = (diffInMin - 60) / 60; 
          currentSpeed = Math.max(15, baseSpeed - (baseSpeed - 15) * reductionProgress);
        }
      } else {
        return getScheduledState();
      }

      const delay = liveData.delay || 0;
      const distanceMoved = (currentSpeed / 60) * Math.max(0, diffInMin); 

      let matchedIdx = 0; let minD = Infinity;
      scheduleData.forEach((st) => {
        const coords = stationCoords[st.name.trim()];
        if (coords) {
          const d = calculateDistance(rawLat, rawLng, coords[0], coords[1]);
          if (d < minD) { minD = d; matchedIdx = st.idx; }
        }
      });

      const nextStation = train.stations[matchedIdx + 1] || train.stations[matchedIdx];
      const nextCoords = stationCoords[nextStation.name.trim()];
      let lat = rawLat, lng = rawLng;

      if (nextCoords && distanceMoved > 0) {
          const totalDistToNext = calculateDistance(rawLat, rawLng, nextCoords[0], nextCoords[1]);
          const ratio = Math.min(distanceMoved / totalDistToNext, 0.99); 
          lat = rawLat + (nextCoords[0] - rawLat) * ratio;
          lng = rawLng + (nextCoords[1] - rawLng) * ratio;
      }

      const [finalLat, finalLng] = getSnappedPoint(lat, lng, railData);
      return { 
        lat: finalLat, lng: finalLng, 
        speed: Math.round(currentSpeed), 
        mode, 
        lastSeen: Math.floor(diffInMin), 
        isRunning: true, index: matchedIdx, delay 
      };
    }
    return getScheduledState();
  }, [train, liveData, currentTime, scheduleData]);

  // Statistics Calculation
  const stats = useMemo(() => {
    if (!activeState || !activeState.isRunning) return null;
    const nextSt = train.stations[activeState.index + 1] || train.stations[activeState.index];
    const lastSt = train.stations[train.stations.length - 1];
    const nextCoords = stationCoords[nextSt.name.trim()];
    const destCoords = stationCoords[lastSt.name.trim()];
    
    const dNext = calculateDistance(activeState.lat, activeState.lng, nextCoords?.[0], nextCoords?.[1]);
    const dDest = calculateDistance(activeState.lat, activeState.lng, destCoords?.[0], destCoords?.[1]);
    
    const nextArrivalMin = parseToMinutes(nextSt.arrival === 'START' ? nextSt.departure : nextSt.arrival);

    return {
      nextStName: nextSt.name.split('(')[0],
      destName: lastSt.name.split('(')[0],
      distNext: dNext.toFixed(2), 
      distDest: dDest.toFixed(2),
      etaNext: minutesToTime(nextArrivalMin + activeState.delay),
      etaDest: minutesToTime(parseToMinutes(lastSt.arrival) + activeState.delay)
    };
  }, [activeState, train]);

  if (!train) return <div style={{ padding: '50px', textAlign: 'center' }}>ট্রেন তথ্য পাওয়া যায়নি</div>;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <style>{`
        .leaflet-marker-icon { transition: transform 1.5s linear !important; }
        .live-dot { width: 20px; height: 20px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(0,0,0,0.2); position: relative; } 
        .pulse { position: absolute; inset: -10px; border-radius: 50%; animation: p 2s infinite; } 
        @keyframes p { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } } 
        .station-tooltip { background: white !important; border: 1.5px solid #006a4e !important; color: #006a4e !important; border-radius: 6px !important; padding: 3px 8px !important; font-size: 11px !important; font-weight: 800 !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      `}</style>

      {/* Header */}
      <div style={{ background: '#006a4e', color: 'white', padding: '16px', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white' }}><ChevronLeft size={24} /></Link>
          <div style={{ flex: 1, marginLeft: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{train.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '10px', background: !activeState.isRunning ? '#555' : (activeState.mode === 'LIVE' ? '#ef4444' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#3b82f6')), padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                {!activeState.isRunning ? 'OFFLINE' : activeState.mode}
              </span>
              {activeState.isRunning && (
                <span style={{ fontSize: '11px', opacity: 0.9 }}>• {activeState.lastSeen === 0 ? 'Just now' : `${activeState.lastSeen}m ago`}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.12)', borderLeft: `4px solid ${!activeState.isRunning ? '#94a3b8' : (activeState.mode === 'LIVE' ? '#ef4444' : (activeState.mode === 'PREDICTED' ? '#f59e0b' : '#3b82f6'))}` }}>
           {!activeState.isRunning ? "🛑 ট্রেনটি বর্তমানে অফলাইন।" : activeState.mode === 'LIVE' ? "🛰️ লাইভ লোকেশন পাওয়া যাচ্ছে।" : activeState.mode === 'PREDICTED' ? "⚠️ লোকেশন প্রেডিক্ট করা হচ্ছে।" : "📅 শিডিউল অনুযায়ী দেখানো হচ্ছে।"}
        </div>
      </div>

      {/* Map */}
      <div style={{ height: '40vh', width: '100%' }}>
        <MapContainer center={[activeState.lat, activeState.lng]} zoom={12} style={{ height: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {railData && <GeoJSON data={railData} style={{ color: '#006a4e', weight: 2, opacity: 0.5 }} />}
          <RecenterMap center={[activeState.lat, activeState.lng]} />
          
          {train.stations.map((st, i) => {
            const coords = stationCoords[st.name.trim()];
            if (!coords) return null;
            return (
              <Marker key={i} position={[coords[0], coords[1]]} icon={L.divIcon({ html: `<div style="width: 8px; height: 8px; background: white; border: 2px solid #006a4e; border-radius: 50%;"></div>`, iconSize: [8, 8] })}>
                <Tooltip permanent direction="top" className="station-tooltip">{st.name.split('(')[0]}</Tooltip>
              </Marker>
            );
          })}

          <Marker position={[activeState.lat, activeState.lng]} icon={L.divIcon({ html: `<div class="pulse" style="background:${activeState.mode === 'LIVE' ? 'rgba(0,106,78,0.3)' : 'rgba(245,158,11,0.3)'}"></div><div class="live-dot" style="background:${activeState.mode === 'LIVE' ? '#006a4e' : '#f59e0b'}"></div>`, iconSize: [20, 20], iconAnchor: [10, 10] })} />
        </MapContainer>
      </div>

      {/* Stats Card */}
      <div style={{ padding: '16px' }}>
        {isTraveler === true ? (
            <div style={{ background: isSharing ? '#ecfdf5' : '#fff7ed', padding: '12px', borderRadius: '12px', border: `1px solid ${isSharing ? '#10b981' : '#f97316'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{isSharing ? '📍 লোকেশন শেয়ার হচ্ছে' : '⏸️ শেয়ারিং বন্ধ'}</span>
                <button onClick={() => setIsSharing(!isSharing)} style={{ background: isSharing ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>{isSharing ? 'বন্ধ করুন' : 'চালু করুন'}</button>
            </div>
        ) : (
            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '15px' }}>
                <p style={{ fontSize: '12px', margin: '0 0 8px' }}>আপনি কি এই ট্রেনে ভ্রমণ করছেন?</p>
                <button onClick={() => {setIsTraveler(true); setIsSharing(true); setShowModal(false);}} style={{ background: '#006a4e', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '6px', marginRight: '8px' }}>হ্যাঁ</button>
                <button onClick={() => {setIsTraveler(false); setShowModal(false);}} style={{ background: '#e2e8f0', border: 'none', padding: '5px 15px', borderRadius: '6px' }}>না</button>
            </div>
        )}

        {activeState.isRunning && (
            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', textAlign: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#006a4e' }}>{activeState.speed}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>কিমি/ঘণ্টা</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #eee' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>{activeState.delay}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>মিনিট দেরি</div>
                    </div>
                    <div style={{ flex: 1, borderLeft: '1px solid #eee' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>{stats?.distNext}</div>
                        <div style={{ fontSize: '10px', color: '#888' }}>পরবর্তী কিমি</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#166534' }}>{stats?.nextStName}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{stats?.etaNext}</div>
                    </div>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px' }}>
                        <div style={{ fontSize: '10px', color: '#1e40af' }}>{stats?.destName}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{stats?.etaDest}</div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Station List */}
      <div style={{ padding: '0 16px 50px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px' }}>
          <h4 style={{ marginBottom: '20px', fontSize: '15px', fontWeight: 'bold' }}>স্টেশন সমুহ</h4>
          {train.stations.map((st, i) => {
            const isPassed = activeState.isRunning && i < activeState.index;
            const isCurrent = activeState.isRunning && i === activeState.index;
            const schedMin = parseToMinutes(st.arrival === 'START' ? st.departure : st.arrival);
            const expectedTime = schedMin !== null ? minutesToTime(schedMin + (activeState.delay || 0)) : '--';

            return (
              <div key={i} style={{ display: 'flex', gap: '15px', opacity: isPassed ? 0.5 : 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: isCurrent ? '#3b82f6' : (isPassed ? '#006a4e' : '#cbd5e1'), border: isCurrent ? '3px solid #bfdbfe' : 'none' }}></div>
                  {i < train.stations.length - 1 && <div style={{ width: 2, flex: 1, background: isPassed ? '#006a4e' : '#f1f5f9', minHeight: '40px' }}></div>}
                </div>
                <div style={{ flex: 1, paddingBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{st.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>শিডিউল: {st.arrival === 'START' ? st.departure : st.arrival}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '13px', color: activeState.delay > 0 ? '#ef4444' : '#006a4e' }}>{expectedTime}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '20px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '40px' }}>🚆</div>
            <h3 style={{ margin: '15px 0 10px' }}>আপনি কি ট্রেনে আছেন?</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>আপনার লোকেশন শেয়ার করে অন্যদের সাহায্য করুন।</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => {setIsTraveler(true); setIsSharing(true); setShowModal(false);}} style={{ flex: 1, background: '#006a4e', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>হ্যাঁ, শেয়ার করি</button>
              <button onClick={() => {setIsTraveler(false); setShowModal(false);}} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>না, শুধু দেখি</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;