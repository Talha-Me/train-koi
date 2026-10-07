// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ChevronLeft, Newspaper, Calendar, Globe, RefreshCw,
//   ChevronDown, ChevronUp, Share2, Clock, Radio, Check, WifiOff
// } from 'lucide-react';

// /* ---------- CSS Definition (হোয়েস্টিং বাগ ঠেকাতে উপরে রাখা হয়েছে) ---------- */
// const css = `
// .nw-page {
//   --ink: #0f1f1a;
//   --body: #34453f;
//   --muted: #5d6f68;
//   --faint: #8a9a94;
//   --green: #006a4e;
//   --green-deep: #003726;
//   --mint: #6ee7b7;
//   --line: #e2ebe7;
//   --bg: #f3f7f5;
//   --surface: #ffffff;
//   background: var(--bg);
//   min-height: 100vh;
//   padding-bottom: 60px;
//   font-family: 'Hind Siliguri', sans-serif;
//   color: var(--ink);
// }
// .nw-page *, .nw-page *::before, .nw-page *::after { box-sizing: border-box; }
// .nw-page button { font-family: inherit; }
// .nw-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }

// /* ---------- Top bar ---------- */
// .nw-bar {
//   position: sticky; top: 0; z-index: 50;
//   background:
//     radial-gradient(420px 160px at 90% -30%, rgba(110, 231, 183, .22), transparent 70%),
//     linear-gradient(135deg, #005a40 0%, #002a1d 100%);
//   color: #fff;
//   box-shadow: 0 8px 24px -14px rgba(0, 30, 21, .7);
// }
// .nw-bar-in {
//   max-width: 1080px; margin: 0 auto; padding: 12px 16px;
//   display: flex; align-items: center; gap: 12px;
// }
// .nw-icon-btn {
//   flex: none; width: 40px; height: 40px; display: grid; place-items: center;
//   color: #fff; background: rgba(255,255,255,.12);
//   border: 1px solid rgba(255,255,255,.18); border-radius: 14px; cursor: pointer;
//   transition: background .15s, transform .15s;
// }
// .nw-icon-btn:hover { background: rgba(255,255,255,.22); }
// .nw-icon-btn:active { transform: scale(.94); }
// .nw-bar-title { flex: 1; min-width: 0; }
// .nw-bar-title h1 {
//   margin: 0; font-size: 17px; font-weight: 800; line-height: 1.3; letter-spacing: -0.2px;
//   white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
// }
// .nw-bar-title p {
//   margin: 2px 0 0; display: flex; align-items: center; gap: 7px;
//   font-size: 12px; color: #a7f3d0;
//   white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
// }
// .nw-live-dot {
//   flex: none; width: 8px; height: 8px; border-radius: 50%; background: #34d399;
//   box-shadow: 0 0 0 0 rgba(52, 211, 153, .6); animation: nw-ping 1.8s ease-out infinite;
// }
// .nw-live-dot.is-dark { background: var(--green); box-shadow: 0 0 0 0 rgba(0, 106, 78, .5); }
// @keyframes nw-ping {
//   0% { box-shadow: 0 0 0 0 rgba(52, 211, 153, .55); }
//   70% { box-shadow: 0 0 0 7px rgba(52, 211, 153, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
// }
// .nw-spin { animation: nw-spin 1s linear infinite; }
// @keyframes nw-spin { to { transform: rotate(360deg); } }
// .nw-track {
//   height: 12px;
//   background:
//     linear-gradient(rgba(255,255,255,.36), rgba(255,255,255,.36)) 0 2px / 100% 2px no-repeat,
//     linear-gradient(rgba(255,255,255,.36), rgba(255,255,255,.36)) 0 8px / 100% 2px no-repeat,
//     repeating-linear-gradient(90deg, rgba(255,255,255,.15) 0 4px, transparent 4px 20px);
// }

// /* ---------- Main ---------- */
// .nw-main { max-width: 1080px; margin: 0 auto; padding: 18px 16px; }
// .nw-notice {
//   display: flex; align-items: flex-start; gap: 10px; padding: 13px 16px;
//   font-size: 13.5px; line-height: 1.65; color: #065f46;
//   background: #e3f5ec; border: 1px solid #b7e4d0; border-radius: 16px;
// }
// .nw-notice svg { flex: none; margin-top: 3px; color: var(--green); }
// .nw-notice-strip { margin-bottom: 22px; }
// .nw-layout { display: block; }

// /* ---------- Timeline group ---------- */
// .nw-group { position: relative; padding-left: 32px; margin-bottom: 26px; }
// .nw-group::before {
//   content: ''; position: absolute; left: 0; top: 0; bottom: -26px; width: 18px;
//   background:
//     linear-gradient(rgba(0,106,78,.42), rgba(0,106,78,.42)) 4px 0 / 2px 100% no-repeat,
//     linear-gradient(rgba(0,106,78,.42), rgba(0,106,78,.42)) 12px 0 / 2px 100% no-repeat,
//     repeating-linear-gradient(180deg, rgba(0,106,78,.2) 0 3px, transparent 3px 13px) 0 0 / 18px 100% no-repeat;
// }
// .nw-group:last-child::before { bottom: 0; }
// .nw-group-head {
//   position: relative; margin: 0 0 14px; display: flex; align-items: center; gap: 10px;
//   font-size: 16px; font-weight: 800; color: var(--ink);
// }
// .nw-station {
//   position: absolute; left: -32px; top: 50%; transform: translateY(-50%);
//   width: 18px; height: 18px; border-radius: 6px;
//   background: var(--green-deep); border: 3px solid var(--bg);
//   box-shadow: 0 0 0 2px var(--green-deep);
// }
// .nw-group-count {
//   font-size: 12px; font-weight: 700; color: var(--green);
//   background: #e3f3ec; padding: 2px 10px; border-radius: 999px;
// }

// /* ---------- News item ---------- */
// .nw-item { position: relative; margin-bottom: 14px; }
// .nw-dot {
//   position: absolute; left: -30px; top: 24px; width: 14px; height: 14px; border-radius: 50%;
//   background: var(--surface); border: 3px solid var(--green);
// }
// .nw-dot.is-new { background: var(--mint); animation: nw-ping-green 2s ease-out infinite; }
// @keyframes nw-ping-green {
//   0% { box-shadow: 0 0 0 0 rgba(0, 106, 78, .45); }
//   70% { box-shadow: 0 0 0 8px rgba(0, 106, 78, 0); }
//   100% { box-shadow: 0 0 0 0 rgba(0, 106, 78, 0); }
// }
// .nw-card {
//   padding: 18px; background: var(--surface);
//   border: 1px solid var(--line); border-radius: 22px;
//   transition: box-shadow .25s ease, border-color .25s ease;
// }
// .nw-card:hover { border-color: #c5ddd3; box-shadow: 0 16px 28px -20px rgba(0, 55, 38, .45); }
// .nw-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
// .nw-tags { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
// .nw-tag {
//   padding: 3px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 800;
//   color: #166534; background: #ecfdf3; border: 1px solid #bbf7d0;
// }
// .nw-tag.is-new { color: var(--green-deep); background: var(--mint); border-color: var(--mint); }
// .nw-source { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }
// .nw-source svg { color: var(--green); }
// .nw-share {
//   flex: none; min-width: 34px; height: 34px; padding: 0 8px;
//   display: flex; align-items: center; justify-content: center; gap: 4px;
//   font-size: 11.5px; color: var(--muted); background: var(--bg);
//   border: 1px solid var(--line); border-radius: 11px; cursor: pointer;
//   transition: background .15s, color .15s;
// }
// .nw-share:hover { background: var(--green); color: #fff; }
// .nw-share span { color: #16a34a; font-weight: 700; }
// .nw-title {
//   margin: 0 0 10px; font-size: 17.5px; font-weight: 800; line-height: 1.5;
//   letter-spacing: -0.2px; color: var(--ink);
// }
// .nw-meta {
//   display: flex; flex-wrap: wrap; gap: 6px 14px; margin-bottom: 14px;
//   font-size: 12px; color: var(--faint);
// }
// .nw-meta span { display: inline-flex; align-items: center; gap: 4px; }
// .nw-meta svg { color: var(--green); }
// .nw-body {
//   font-size: 14.5px; line-height: 1.85; color: var(--body); white-space: pre-line;
// }
// .nw-body.is-clamped {
//   display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
// }
// .nw-toggle {
//   margin-top: 14px; padding: 12px 0 0; width: 100%;
//   display: flex; align-items: center; justify-content: center; gap: 4px;
//   font-size: 13.5px; font-weight: 800; color: var(--green);
//   background: none; border: none; border-top: 1.5px dashed var(--line); cursor: pointer;
// }
// .nw-toggle:hover { color: var(--green-deep); }

// /* ---------- Side panel (desktop only) ---------- */
// .nw-aside { display: none; }
// .nw-panel {
//   padding: 20px; background: var(--surface);
//   border: 1px solid var(--line); border-radius: 24px;
// }
// .nw-panel-head {
//   display: flex; align-items: center; gap: 9px; margin-bottom: 8px;
//   font-size: 15px; font-weight: 800;
// }
// .nw-stat {
//   display: flex; align-items: center; justify-content: space-between; gap: 12px;
//   padding: 13px 0; border-bottom: 1.5px dashed var(--line);
//   font-size: 13px; color: var(--muted);
// }
// .nw-stat strong { font-size: 14px; font-weight: 800; color: var(--ink); text-align: right; }
// .nw-panel-btn { width: 100%; margin-top: 16px; }

// /* ---------- Buttons / states ---------- */
// .nw-btn {
//   display: inline-flex; align-items: center; justify-content: center; gap: 8px;
//   padding: 11px 22px; font-size: 14px; font-weight: 800; color: #fff;
//   background: var(--green); border: none; border-radius: 14px; cursor: pointer;
//   transition: background .15s, transform .15s;
// }
// .nw-btn:hover { background: var(--green-deep); }
// .nw-btn:active { transform: scale(.97); }
// .nw-state {
//   text-align: center; padding: 56px 24px;
//   background: var(--surface); border: 1px solid var(--line); border-radius: 24px;
// }
// .nw-state-icon {
//   width: 68px; height: 68px; margin: 0 auto 14px; display: grid; place-items: center;
//   color: var(--green); background: #e3f3ec; border-radius: 22px;
// }
// .nw-state-icon.is-error { color: #dc2626; background: #fee2e2; }
// .nw-state h3 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
// .nw-state p { margin: 0 0 18px; font-size: 14px; line-height: 1.7; color: var(--muted); }
// .nw-state p:last-child { margin-bottom: 0; }

// .nw-skel-card {
//   margin-bottom: 14px; padding: 20px; background: var(--surface);
//   border: 1px solid var(--line); border-radius: 22px;
// }
// .nw-skel {
//   border-radius: 8px;
//   background: linear-gradient(100deg, #e4ece8 30%, #f1f6f3 50%, #e4ece8 70%);
//   background-size: 200% 100%; animation: nw-shimmer 1.4s linear infinite;
// }
// @keyframes nw-shimmer { to { background-position: -200% 0; } }

// /* ---------- Tablet ---------- */
// @media (min-width: 640px) {
//   .nw-bar-in { padding: 14px 24px; }
//   .nw-bar-title h1 { font-size: 20px; }
//   .nw-bar-title p { font-size: 13px; }
//   .nw-main { padding: 26px 24px; }
//   .nw-card { padding: 22px; }
//   .nw-title { font-size: 19px; }
//   .nw-body { font-size: 15px; }
// }

// /* ---------- Desktop ---------- */
// @media (min-width: 1024px) {
//   .nw-bar-in { padding: 16px 32px; }
//   .nw-bar-title h1 { font-size: 24px; letter-spacing: -0.4px; }
//   .nw-main { padding: 34px 32px; }
//   .nw-notice-strip { display: none; }
//   .nw-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 36px; align-items: start; }
//   .nw-aside { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 112px; }
//   .nw-group { padding-left: 40px; }
//   .nw-station { left: -40px; }
//   .nw-dot { left: -38px; }
//   .nw-title { font-size: 20px; }
// }

// @media (prefers-reduced-motion: reduce) {
//   .nw-page *, .nw-page *::before, .nw-page *::after {
//     animation-duration: .01ms !important; animation-iteration-count: 1 !important;
//     transition-duration: .01ms !important;
//   }
// }
// `;

// /* ---------- helpers ---------- */
// const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// const dayLabel = (value) => {
//   if (!value) return 'আজ';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return 'আজ';
//   const now = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(now.getDate() - 1);
//   if (dayKey(d) === dayKey(now)) return 'আজ';
//   if (dayKey(d) === dayKey(yesterday)) return 'গতকাল';
//   return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
// };

// const timeLabel = (value) => {
//   if (!value) return '';
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return '';
//   return d.toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' });
// };

// const isFresh = (value) => {
//   if (!value) return false;
//   const t = new Date(value).getTime();
//   return !isNaN(t) && Date.now() - t < 24 * 60 * 60 * 1000;
// };

// const readMinutes = (text = '') => {
//   const words = text.split(/\s+/).filter(Boolean).length;
//   return Math.max(1, Math.ceil(words / 160)).toLocaleString('bn-BD');
// };

// const groupByDay = (items) => {
//   const groups = [];
//   items.forEach((item, index) => {
//     const label = dayLabel(item.createdAt);
//     const last = groups[groups.length - 1];
//     const entry = { item, index };
//     if (last && last.label === label) last.items.push(entry);
//     else groups.push({ label, items: [entry] });
//   });
//   return groups;
// };

// const NoticeText = ({ className }) => (
//   <div className={`nw-notice ${className || ''}`}>
//     <Radio size={18} />
//     <span>ট্রেন শিডিউল, টিকিট রিফান্ড ও জরুরি সতর্কবার্তা সবার আগে জানতে এখানে চোখ রাখুন।</span>
//   </div>
// );

// const NewsList = () => {
//   const navigate = useNavigate();
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [expandedId, setExpandedId] = useState(null);
//   const [copiedId, setCopiedId] = useState(null);

//   // Backend Host Logic (লাইভ রেন্ডার ও লোকালহোস্ট ফলব্যাক)
//   const isLocal = typeof window !== 'undefined' &&
//     (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
//   const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';

//   const handleBack = () => {
//     if (window.history.state && window.history.state.idx > 0) {
//       navigate(-1);
//     } else {
//       navigate('/');
//     }
//   };

//   const fetchNews = () => {
//     setLoading(true);
//     setError(false);
//     fetch(`${API_BASE_URL}/api/news`)
//       .then((res) => {
//         if (!res.ok) throw new Error('Network error');
//         return res.json();
//       })
//       .then((data) => {
//         setNews(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('News fetch error:', err);
//         setError(true);
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchNews();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

//   const handleShare = async (item, id) => {
//     const shareUrl = window.location.href;
//     try {
//       if (navigator.share) {
//         await navigator.share({ title: item.title, text: item.title, url: shareUrl });
//         return;
//       }
//     } catch (err) {
//       if (err && err.name === 'AbortError') return;
//     }
//     try {
//       await navigator.clipboard.writeText(`${item.title}\n${shareUrl}`);
//       setCopiedId(id);
//       setTimeout(() => setCopiedId(null), 2000);
//     } catch (err) {
//       console.error('Copy failed:', err);
//     }
//   };

//   const groups = groupByDay(news);
//   const latestTime = news[0] ? `${dayLabel(news[0].createdAt)}${timeLabel(news[0].createdAt) ? `, ${timeLabel(news[0].createdAt)}` : ''}` : '';

//   return (
//     <div className="nw-page">
//       <style>{css}</style>

//       {/* Sticky top bar with a railway track edge */}
//       <header className="nw-bar">
//         <div className="nw-bar-in">
//           <button className="nw-icon-btn" onClick={handleBack} aria-label="Back">
//             <ChevronLeft size={22} />
//           </button>

//           <div className="nw-bar-title">
//             <h1>রেল বার্তা ও লাইভ নোটিশ</h1>
//             <p><span className="nw-live-dot" /> বাংলাদেশ রেলওয়ে সর্বশেষ আপডেট</p>
//           </div>

//           <button className="nw-icon-btn" onClick={fetchNews} title="রিফ্রেশ করুন" aria-label="রিফ্রেশ করুন">
//             <RefreshCw size={17} className={loading ? 'nw-spin' : ''} />
//           </button>
//         </div>
//         <div className="nw-track" aria-hidden="true" />
//       </header>

//       <main className="nw-main">
//         <NoticeText className="nw-notice-strip" />

//         <div className="nw-layout">
//           {/* ---------- Feed ---------- */}
//           <div className="nw-feed">
//             {loading ? (
//               <div className="nw-group">
//                 {[1, 2, 3].map((n) => (
//                   <div key={n} className="nw-skel-card">
//                     <div className="nw-skel" style={{ height: 20, width: '70%' }} />
//                     <div className="nw-skel" style={{ height: 13, width: '38%', marginTop: 12 }} />
//                     <div className="nw-skel" style={{ height: 13, width: '100%', marginTop: 18 }} />
//                     <div className="nw-skel" style={{ height: 13, width: '84%', marginTop: 8 }} />
//                   </div>
//                 ))}
//               </div>
//             ) : error ? (
//               <div className="nw-state">
//                 <div className="nw-state-icon is-error"><WifiOff size={30} /></div>
//                 <h3>সংবাদ লোড করা যায়নি</h3>
//                 <p>সংবাদ লোড করতে সাময়িক বিঘ্ন ঘটছে।</p>
//                 <button className="nw-btn" onClick={fetchNews}>
//                   <RefreshCw size={15} /> পুনরায় চেষ্টা করুন
//                 </button>
//               </div>
//             ) : news.length > 0 ? (
//               groups.map((group) => (
//                 <section key={group.label} className="nw-group">
//                   <h3 className="nw-group-head">
//                     <span className="nw-station" />
//                     {group.label}
//                     <span className="nw-group-count">{group.items.length.toLocaleString('bn-BD')}টি</span>
//                   </h3>

//                   {group.items.map(({ item, index }) => {
//                     const id = item._id || item.slug || index;
//                     const isExpanded = expandedId === id;
//                     const isLong = item.content && item.content.length > 220;
//                     const fresh = isFresh(item.createdAt);
//                     const time = timeLabel(item.createdAt);

//                     return (
//                       <article key={id} className="nw-item">
//                         <span className={`nw-dot ${fresh ? 'is-new' : ''}`} />

//                         <div className="nw-card">
//                           <div className="nw-card-top">
//                             <div className="nw-tags">
//                               <span className="nw-tag">রেল বার্তা</span>
//                               {fresh && <span className="nw-tag is-new">নতুন</span>}
//                               {item.source && (
//                                 <span className="nw-source"><Globe size={13} /> {item.source}</span>
//                               )}
//                             </div>

//                             <button
//                               className="nw-share"
//                               onClick={() => handleShare(item, id)}
//                               title="শেয়ার করুন"
//                               aria-label="শেয়ার করুন"
//                             >
//                               {copiedId === id
//                                 ? <><Check size={15} color="#16a34a" /><span>কপি হয়েছে</span></>
//                                 : <Share2 size={16} />}
//                             </button>
//                           </div>

//                           <h2 className="nw-title">{item.title}</h2>

//                           <div className="nw-meta">
//                             <span><Calendar size={13} /> {group.label}</span>
//                             {time && <span><Clock size={13} /> {time}</span>}
//                             <span>{readMinutes(item.content)} মিনিট পাঠ</span>
//                           </div>

//                           <div className={`nw-body ${!isExpanded && isLong ? 'is-clamped' : ''}`}>
//                             {item.content}
//                           </div>

//                           {isLong && (
//                             <button
//                               className="nw-toggle"
//                               onClick={() => toggleExpand(id)}
//                               aria-expanded={isExpanded}
//                             >
//                               {isExpanded
//                                 ? <>সংক্ষিপ্ত করুন <ChevronUp size={16} /></>
//                                 : <>সম্পূর্ণ পড়ুন <ChevronDown size={16} /></>}
//                             </button>
//                           )}
//                         </div>
//                       </article>
//                     );
//                   })}
//                 </section>
//               ))
//             ) : (
//               <div className="nw-state">
//                 <div className="nw-state-icon"><Newspaper size={30} /></div>
//                 <h3>আপাতত নতুন কোনো নোটিশ নেই</h3>
//                 <p>রেলওয়ের পরবর্তী কোনো নোটিশ বা আপডেট এলে এখানে স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।</p>
//               </div>
//             )}
//           </div>

//           {/* ---------- Desktop side panel ---------- */}
//           {!loading && !error && news.length > 0 && (
//             <aside className="nw-aside">
//               <div className="nw-panel">
//                 <div className="nw-panel-head"><span className="nw-live-dot is-dark" /> লাইভ আপডেট</div>
//                 <div className="nw-stat">
//                   <span>মোট নোটিশ</span>
//                   <strong>{news.length.toLocaleString('bn-BD')}টি</strong>
//                 </div>
//                 <div className="nw-stat">
//                   <span>সর্বশেষ আপডেট</span>
//                   <strong>{latestTime || '—'}</strong>
//                 </div>
//                 <button className="nw-btn nw-panel-btn" onClick={fetchNews}>
//                   <RefreshCw size={15} className={loading ? 'nw-spin' : ''} /> নতুন আপডেট দেখুন
//                 </button>
//               </div>
//               <NoticeText />
//             </aside>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewsList;
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Newspaper, Calendar, Globe, RefreshCw, Share2, Clock,
  Radio, Check, WifiOff, Search, ArrowUpRight, X
} from 'lucide-react';

const PAGE_SIZE = 10;

/* ---------- helpers ---------- */

// HTML content hole sundor kore plain text e convert kore (heading/list o bujhe)
const htmlToText = (html = '') =>
  String(html)
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

// Excerpt er jonno markdown chinho soriye ekdom clean text
const plain = (text = '') =>
  htmlToText(text)
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^\s*[-•*]\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const excerpt = (text, len = 170) => {
  const clean = plain(text);
  return clean.length > len ? clean.slice(0, len).trim() + '...' : clean;
};

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const dayLabel = (value) => {
  if (!value) return 'আজ';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'আজ';
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (dayKey(d) === dayKey(now)) return 'আজ';
  if (dayKey(d) === dayKey(yesterday)) return 'গতকাল';
  return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
};

const timeLabel = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit' });
};

const isFresh = (value) => {
  if (!value) return false;
  const t = new Date(value).getTime();
  return !isNaN(t) && Date.now() - t < 24 * 60 * 60 * 1000;
};

const withinDays = (value, days) => {
  const t = new Date(value).getTime();
  return !isNaN(t) && Date.now() - t < days * 24 * 60 * 60 * 1000;
};

const readMinutes = (text = '') => {
  const words = plain(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 160)).toLocaleString('bn-BD');
};

const groupByDay = (items) => {
  const groups = [];
  items.forEach((item) => {
    const label = dayLabel(item.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  });
  return groups;
};

const PERIODS = [
  { id: 'all', label: 'সব' },
  { id: 'today', label: 'আজ' },
  { id: 'week', label: 'গত ৭ দিন' },
];

const NoticeText = ({ className }) => (
  <div className={`nl-notice ${className || ''}`}>
    <Radio size={18} />
    <span>ট্রেন শিডিউল, টিকিট রিফান্ড ও জরুরি সতর্কবার্তা সবার আগে জানতে এখানে চোখ রাখুন।</span>
  </div>
);

const NewsList = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/');
  };

  const fetchNews = () => {
    setLoading(true);
    setError(false);
    fetch(`${API_BASE_URL}/api/news`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('News fetch error:', err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    document.title = 'রেল বার্তা ও লাইভ নোটিশ | TrainKoi';
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // filter বদলালে আবার প্রথম থেকে দেখাবে
  useEffect(() => { setVisible(PAGE_SIZE); }, [query, period]);

  const openNews = (item) => navigate(`/news/${item.slug || item._id}`);

  const onKey = (e, item) => {
    if (e.target !== e.currentTarget) return; // share button e Enter dile card khulbe na
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openNews(item);
    }
  };

  const handleShare = async (e, item) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${item.slug || item._id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.title, url });
        return;
      }
    } catch (err) {
      if (err && err.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(`${item.title}\n${url}`);
      const id = item._id || item.slug;
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news.filter((n) => {
      if (period === 'today' && dayLabel(n.createdAt) !== 'আজ') return false;
      if (period === 'week' && !withinDays(n.createdAt, 7)) return false;
      if (!q) return true;
      return (
        (n.title || '').toLowerCase().includes(q) ||
        plain(n.content).toLowerCase().includes(q) ||
        (n.source || '').toLowerCase().includes(q)
      );
    });
  }, [news, query, period]);

  const shown = filtered.slice(0, visible);
  const groups = groupByDay(shown);
  const todayCount = news.filter((n) => dayLabel(n.createdAt) === 'আজ').length;
  const latest = news[0]
    ? `${dayLabel(news[0].createdAt)}${timeLabel(news[0].createdAt) ? `, ${timeLabel(news[0].createdAt)}` : ''}`
    : '';

  return (
    <div className="nl-page">
      <style>{css}</style>

      {/* Masthead */}
      <header className="nl-mast">
        <div className="nl-mast-inner">
          <div className="nl-mast-top">
            <button className="nl-icon-btn" onClick={handleBack} aria-label="ফিরে যান">
              <ChevronLeft size={22} />
            </button>
            <button className="nl-refresh" onClick={fetchNews} aria-label="রিফ্রেশ করুন">
              <RefreshCw size={15} className={loading ? 'nl-spin' : ''} />
              <span>রিফ্রেশ</span>
            </button>
          </div>
          <h1 className="nl-title">রেল বার্তা ও লাইভ নোটিশ</h1>
          <p className="nl-subtitle"><span className="nl-live-dot" /> বাংলাদেশ রেলওয়ের সর্বশেষ আপডেট</p>
        </div>
        <div className="nl-track" aria-hidden="true" />
      </header>

      {/* Sticky search + period filter */}
      <div className="nl-filterbar">
        <div className="nl-filter-in">
          <label className="nl-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="নোটিশ খুঁজুন..."
              aria-label="নোটিশ খুঁজুন"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="মুছে ফেলুন" className="nl-clear">
                <X size={14} />
              </button>
            )}
          </label>
          <div className="nl-periods" role="tablist" aria-label="সময়">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={period === p.id}
                className={`nl-pill ${period === p.id ? 'is-active' : ''}`}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="nl-main">
        <NoticeText className="nl-notice-strip" />

        <div className="nl-layout">
          {/* ---------- Feed ---------- */}
          <div className="nl-feed">
            {loading ? (
              <div className="nl-group">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="nl-skel-card">
                    <div className="nl-skel" style={{ height: 14, width: '30%' }} />
                    <div className="nl-skel" style={{ height: 20, width: '80%', marginTop: 14 }} />
                    <div className="nl-skel" style={{ height: 13, width: '100%', marginTop: 14 }} />
                    <div className="nl-skel" style={{ height: 13, width: '70%', marginTop: 8 }} />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="nl-state">
                <div className="nl-state-icon is-error"><WifiOff size={30} /></div>
                <h3>সংবাদ লোড করা যায়নি</h3>
                <p>ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>
                <button className="nl-btn" onClick={fetchNews}>
                  <RefreshCw size={15} /> পুনরায় চেষ্টা করুন
                </button>
              </div>
            ) : news.length === 0 ? (
              <div className="nl-state">
                <div className="nl-state-icon"><Newspaper size={30} /></div>
                <h3>আপাতত নতুন কোনো নোটিশ নেই</h3>
                <p>রেলওয়ের নতুন কোনো নোটিশ বা আপডেট এলে এখানে দেখা যাবে।</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="nl-state">
                <div className="nl-state-icon"><Search size={30} /></div>
                <h3>কোনো নোটিশ মেলেনি</h3>
                <p>অন্য শব্দ দিয়ে খুঁজুন অথবা সময়ের ফিল্টার বদলে দেখুন।</p>
                <button className="nl-btn" onClick={() => { setQuery(''); setPeriod('all'); }}>
                  ফিল্টার মুছুন
                </button>
              </div>
            ) : (
              <>
                {groups.map((group) => (
                  <section key={group.label} className="nl-group">
                    <h2 className="nl-group-head">
                      <span className="nl-station" />
                      {group.label}
                      <span className="nl-group-count">{group.items.length.toLocaleString('bn-BD')}টি</span>
                    </h2>

                    {group.items.map((item) => {
                      const id = item._id || item.slug;
                      const fresh = isFresh(item.createdAt);
                      const time = timeLabel(item.createdAt);
                      return (
                        <article
                          key={id}
                          className="nl-item"
                          role="link"
                          tabIndex={0}
                          onClick={() => openNews(item)}
                          onKeyDown={(e) => onKey(e, item)}
                        >
                          <span className={`nl-dot ${fresh ? 'is-new' : ''}`} />
                          <div className="nl-card">
                            <div className="nl-card-top">
                              <div className="nl-tags">
                                <span className="nl-tag">রেল বার্তা</span>
                                {fresh && <span className="nl-tag is-new">নতুন</span>}
                                {item.source && (
                                  <span className="nl-source"><Globe size={13} /> {item.source}</span>
                                )}
                              </div>
                              <button
                                className="nl-share"
                                onClick={(e) => handleShare(e, item)}
                                aria-label="শেয়ার করুন"
                                title="শেয়ার করুন"
                              >
                                {copiedId === id
                                  ? <><Check size={15} color="#16a34a" /><span>কপি হয়েছে</span></>
                                  : <Share2 size={16} />}
                              </button>
                            </div>

                            <h3 className="nl-card-title">{item.title}</h3>
                            <p className="nl-card-text">{excerpt(item.content)}</p>

                            <div className="nl-card-foot">
                              {time && <span className="nl-meta"><Clock size={13} /> {time}</span>}
                              <span className="nl-meta"><Calendar size={13} /> {readMinutes(item.content)} মিনিট পাঠ</span>
                              <span className="nl-card-cta">সম্পূর্ণ পড়ুন <ArrowUpRight size={15} /></span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </section>
                ))}

                {visible < filtered.length && (
                  <div className="nl-more">
                    <button className="nl-btn is-ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      আরও নোটিশ দেখুন ({(filtered.length - visible).toLocaleString('bn-BD')}টি বাকি)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ---------- Desktop side panel ---------- */}
          {!loading && !error && news.length > 0 && (
            <aside className="nl-aside">
              <div className="nl-panel">
                <div className="nl-panel-head"><span className="nl-live-dot is-dark" /> লাইভ আপডেট</div>
                <div className="nl-stat"><span>মোট নোটিশ</span><strong>{news.length.toLocaleString('bn-BD')}টি</strong></div>
                <div className="nl-stat"><span>আজকের নোটিশ</span><strong>{todayCount.toLocaleString('bn-BD')}টি</strong></div>
                <div className="nl-stat"><span>সর্বশেষ আপডেট</span><strong>{latest || '—'}</strong></div>
                <button className="nl-btn nl-panel-btn" onClick={fetchNews}>
                  <RefreshCw size={15} className={loading ? 'nl-spin' : ''} /> নতুন আপডেট দেখুন
                </button>
              </div>
              <NoticeText />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

const css = `
.nl-page {
  --ink: #0f1f1a; --body: #34453f; --muted: #5d6f68; --faint: #8a9a94;
  --green: #006a4e; --green-deep: #003726; --mint: #6ee7b7;
  --line: #e2ebe7; --bg: #f3f7f5; --surface: #ffffff;
  background: var(--bg); min-height: 100vh; padding-bottom: 70px;
  font-family: 'Hind Siliguri', sans-serif; color: var(--ink);
}
.nl-page *, .nl-page *::before, .nl-page *::after { box-sizing: border-box; }
.nl-page button, .nl-page input { font-family: inherit; }
.nl-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }
.nl-meta { display: inline-flex; align-items: center; gap: 5px; }

/* ---------- Masthead ---------- */
.nl-mast {
  background:
    radial-gradient(520px 220px at 88% -10%, rgba(110,231,183,.24), transparent 70%),
    linear-gradient(135deg, #005a40 0%, #002a1d 100%);
  color: #fff;
}
.nl-mast-inner { max-width: 1120px; margin: 0 auto; padding: 16px 18px 20px; }
.nl-mast-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.nl-icon-btn {
  width: 40px; height: 40px; display: grid; place-items: center; color: #fff;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
  border-radius: 14px; cursor: pointer; transition: background .15s, transform .15s;
}
.nl-icon-btn:hover { background: rgba(255,255,255,.22); }
.nl-icon-btn:active { transform: scale(.94); }
.nl-refresh {
  display: flex; align-items: center; gap: 6px; padding: 9px 13px;
  font-size: 12.5px; font-weight: 700; color: #fff;
  background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
  border-radius: 12px; cursor: pointer; transition: background .15s;
}
.nl-refresh:hover { background: rgba(255,255,255,.22); }
.nl-spin { animation: nl-spin 1s linear infinite; }
@keyframes nl-spin { to { transform: rotate(360deg); } }
.nl-title { margin: 0; font-size: 25px; font-weight: 800; line-height: 1.3; letter-spacing: -0.3px; }
.nl-subtitle { margin: 8px 0 0; display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: #a7f3d0; }
.nl-live-dot {
  flex: none; width: 8px; height: 8px; border-radius: 50%; background: #34d399;
  animation: nl-ping 1.8s ease-out infinite;
}
.nl-live-dot.is-dark { background: var(--green); animation-name: nl-ping-dark; }
@keyframes nl-ping {
  0% { box-shadow: 0 0 0 0 rgba(52,211,153,.55); }
  70% { box-shadow: 0 0 0 7px rgba(52,211,153,0); }
  100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
}
@keyframes nl-ping-dark {
  0% { box-shadow: 0 0 0 0 rgba(0,106,78,.45); }
  70% { box-shadow: 0 0 0 7px rgba(0,106,78,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,106,78,0); }
}
.nl-track {
  height: 14px;
  background:
    linear-gradient(rgba(255,255,255,.38), rgba(255,255,255,.38)) 0 3px / 100% 2px no-repeat,
    linear-gradient(rgba(255,255,255,.38), rgba(255,255,255,.38)) 0 9px / 100% 2px no-repeat,
    repeating-linear-gradient(90deg, rgba(255,255,255,.16) 0 4px, transparent 4px 20px);
}

/* ---------- Filter bar ---------- */
.nl-filterbar {
  position: sticky; top: 0; z-index: 50;
  background: rgba(243,247,245,.88);
  -webkit-backdrop-filter: saturate(160%) blur(16px); backdrop-filter: saturate(160%) blur(16px);
  border-bottom: 1px solid var(--line);
}
.nl-filter-in {
  max-width: 1120px; margin: 0 auto; padding: 11px 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.nl-search {
  display: flex; align-items: center; gap: 9px; height: 42px; padding: 0 14px;
  color: var(--faint); background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
  transition: border-color .15s;
}
.nl-search:focus-within { border-color: var(--green); }
.nl-search input {
  flex: 1; min-width: 0; border: none; outline: none; background: none;
  font-size: 14px; color: var(--ink);
}
.nl-search input::-webkit-search-cancel-button { display: none; }
.nl-clear {
  width: 24px; height: 24px; display: grid; place-items: center; color: var(--muted);
  background: var(--bg); border: none; border-radius: 50%; cursor: pointer;
}
.nl-periods { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
.nl-periods::-webkit-scrollbar { display: none; }
.nl-pill {
  flex: none; padding: 7px 17px; border-radius: 999px; font-size: 13px; font-weight: 700;
  white-space: nowrap; cursor: pointer; color: var(--muted);
  background: var(--surface); border: 1px solid var(--line);
  transition: background .18s, color .18s, border-color .18s;
}
.nl-pill:hover { border-color: var(--green); color: var(--green); }
.nl-pill.is-active { background: var(--green-deep); border-color: var(--green-deep); color: #fff; }

/* ---------- Main ---------- */
.nl-main { max-width: 1120px; margin: 0 auto; padding: 18px 16px; }
.nl-notice {
  display: flex; align-items: flex-start; gap: 10px; padding: 13px 16px;
  font-size: 13.5px; line-height: 1.65; color: #065f46;
  background: #e3f5ec; border: 1px solid #b7e4d0; border-radius: 16px;
}
.nl-notice svg { flex: none; margin-top: 3px; color: var(--green); }
.nl-notice-strip { margin-bottom: 22px; }
.nl-layout { display: block; }

/* ---------- Timeline ---------- */
.nl-group { position: relative; padding-left: 32px; margin-bottom: 26px; }
.nl-group::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: -26px; width: 18px;
  background:
    linear-gradient(rgba(0,106,78,.42), rgba(0,106,78,.42)) 4px 0 / 2px 100% no-repeat,
    linear-gradient(rgba(0,106,78,.42), rgba(0,106,78,.42)) 12px 0 / 2px 100% no-repeat,
    repeating-linear-gradient(180deg, rgba(0,106,78,.2) 0 3px, transparent 3px 13px) 0 0 / 18px 100% no-repeat;
}
.nl-group:last-child::before { bottom: 0; }
.nl-group-head {
  position: relative; margin: 0 0 14px; display: flex; align-items: center; gap: 10px;
  font-size: 16px; font-weight: 800;
}
.nl-station {
  position: absolute; left: -32px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; border-radius: 6px;
  background: var(--green-deep); border: 3px solid var(--bg); box-shadow: 0 0 0 2px var(--green-deep);
}
.nl-group-count {
  font-size: 12px; font-weight: 700; color: var(--green);
  background: #e3f3ec; padding: 2px 10px; border-radius: 999px;
}

/* ---------- Item ---------- */
.nl-item { position: relative; margin-bottom: 14px; cursor: pointer; border-radius: 22px; }
.nl-dot {
  position: absolute; left: -30px; top: 24px; width: 14px; height: 14px; border-radius: 50%;
  background: var(--surface); border: 3px solid var(--green);
}
.nl-dot.is-new { background: var(--mint); animation: nl-ping-dark 2s ease-out infinite; }
.nl-card {
  padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 22px;
  transition: box-shadow .25s ease, border-color .25s ease, transform .25s ease;
}
.nl-item:hover .nl-card { border-color: #c5ddd3; box-shadow: 0 16px 28px -20px rgba(0,55,38,.45); }
.nl-item:active .nl-card { transform: scale(.99); }
.nl-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
.nl-tags { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
.nl-tag {
  padding: 3px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 800;
  color: #166534; background: #ecfdf3; border: 1px solid #bbf7d0;
}
.nl-tag.is-new { color: var(--green-deep); background: var(--mint); border-color: var(--mint); }
.nl-source { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--muted); }
.nl-source svg { color: var(--green); }
.nl-share {
  flex: none; min-width: 34px; height: 34px; padding: 0 8px;
  display: flex; align-items: center; justify-content: center; gap: 4px;
  font-size: 11.5px; color: var(--muted); background: var(--bg);
  border: 1px solid var(--line); border-radius: 11px; cursor: pointer;
  transition: background .15s, color .15s;
}
.nl-share:hover { background: var(--green); color: #fff; }
.nl-share span { color: #16a34a; font-weight: 700; }
.nl-card-title {
  margin: 0 0 8px; font-size: 17.5px; font-weight: 800; line-height: 1.5; letter-spacing: -0.2px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.nl-card-text {
  margin: 0 0 14px; font-size: 14.5px; line-height: 1.8; color: var(--muted);
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
.nl-card-foot {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px;
  padding-top: 12px; border-top: 1.5px dashed var(--line); font-size: 12.5px; color: var(--faint);
}
.nl-card-foot svg { color: var(--green); }
.nl-card-cta {
  display: inline-flex; align-items: center; gap: 2px; margin-left: auto;
  font-weight: 800; font-size: 13px; color: var(--green); transition: gap .2s;
}
.nl-card-cta svg { color: currentColor; }
.nl-item:hover .nl-card-cta { gap: 6px; }

.nl-more { text-align: center; padding: 6px 0 0; }

/* ---------- Side panel ---------- */
.nl-aside { display: none; }
.nl-panel { padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: 24px; }
.nl-panel-head { display: flex; align-items: center; gap: 9px; margin-bottom: 8px; font-size: 15px; font-weight: 800; }
.nl-stat {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 13px 0; border-bottom: 1.5px dashed var(--line); font-size: 13px; color: var(--muted);
}
.nl-stat strong { font-size: 14px; font-weight: 800; color: var(--ink); text-align: right; }
.nl-panel-btn { width: 100%; margin-top: 16px; }

/* ---------- Buttons / states ---------- */
.nl-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 22px; font-size: 14px; font-weight: 800; color: #fff;
  background: var(--green); border: 1px solid var(--green); border-radius: 14px; cursor: pointer;
  transition: background .15s, transform .15s;
}
.nl-btn:hover { background: var(--green-deep); }
.nl-btn:active { transform: scale(.97); }
.nl-btn.is-ghost { color: var(--green-deep); background: var(--surface); border-color: var(--line); }
.nl-btn.is-ghost:hover { background: var(--bg); border-color: var(--green); }
.nl-state { text-align: center; padding: 56px 24px; background: var(--surface); border: 1px solid var(--line); border-radius: 24px; }
.nl-state-icon {
  width: 68px; height: 68px; margin: 0 auto 14px; display: grid; place-items: center;
  color: var(--green); background: #e3f3ec; border-radius: 22px;
}
.nl-state-icon.is-error { color: #dc2626; background: #fee2e2; }
.nl-state h3 { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
.nl-state p { margin: 0 0 18px; font-size: 14px; line-height: 1.7; color: var(--muted); }

.nl-skel-card { margin-bottom: 14px; padding: 20px; background: var(--surface); border: 1px solid var(--line); border-radius: 22px; }
.nl-skel {
  border-radius: 8px;
  background: linear-gradient(100deg, #e4ece8 30%, #f1f6f3 50%, #e4ece8 70%);
  background-size: 200% 100%; animation: nl-shimmer 1.4s linear infinite;
}
@keyframes nl-shimmer { to { background-position: -200% 0; } }

/* ---------- Phone ---------- */
@media (max-width: 639px) {
  .nl-refresh span { display: none; }
  .nl-refresh { padding: 10px; }
  .nl-card-cta { margin-left: 0; }
}

/* ---------- Tablet ---------- */
@media (min-width: 640px) {
  .nl-mast-inner { padding: 20px 24px 26px; }
  .nl-title { font-size: 32px; }
  .nl-subtitle { font-size: 15px; }
  .nl-filter-in { flex-direction: row; align-items: center; justify-content: space-between; padding: 12px 24px; }
  .nl-search { width: 320px; }
  .nl-main { padding: 26px 24px; }
  .nl-card { padding: 22px; }
  .nl-card-title { font-size: 19px; }
  .nl-card-text { font-size: 15px; }
}

/* ---------- Desktop ---------- */
@media (min-width: 1024px) {
  .nl-mast-inner { padding: 26px 32px 40px; }
  .nl-title { font-size: 44px; letter-spacing: -0.6px; }
  .nl-subtitle { margin-top: 12px; font-size: 16px; }
  .nl-filter-in { padding: 14px 32px; }
  .nl-main { padding: 34px 32px; }
  .nl-notice-strip { display: none; }
  .nl-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 36px; align-items: start; }
  .nl-aside { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 90px; }
  .nl-group { padding-left: 40px; }
  .nl-station { left: -40px; }
  .nl-dot { left: -38px; }
  .nl-card-title { font-size: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .nl-page *, .nl-page *::before, .nl-page *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

export default NewsList;
