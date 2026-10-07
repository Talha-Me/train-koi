// import React, { useState, useEffect } from 'react';
// import { 
//   Send, Lock, User, FileText, Tag, CheckCircle2, 
//   AlertCircle, LogOut, Trash2, ListFilter, PlusCircle, 
//   Calendar, RefreshCw 
// } from 'lucide-react';

// const ContentUpload = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   // Tabs: 'create' অথবা 'manage'
//   const [activeTab, setActiveTab] = useState('create');

//   // Form State
//   const [type, setType] = useState('news');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [category, setCategory] = useState('ভ্রমণ গাইড');
//   const [author, setAuthor] = useState('TrainKoi Team');
//   const [thumbnail, setThumbnail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState({ type: '', text: '' });

//   // Manage Data List State
//   const [manageType, setManageType] = useState('news');
//   const [contentList, setContentList] = useState([]);
//   const [listLoading, setListLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   // Backend Host Logic (লোকালহোস্ট ও লাইভ রেন্ডার ব্যাকএন্ড)
//   const isLocal = typeof window !== 'undefined' && 
//     (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
//   const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';

//   useEffect(() => {
//     const savedToken = localStorage.getItem('trainkoi_admin_token');
//     if (savedToken) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const fetchManageList = async () => {
//     setListLoading(true);
//     try {
//       const endpoint = manageType === 'news' ? '/api/news' : '/api/blogs';
//       const res = await fetch(`${API_BASE_URL}${endpoint}`);
//       if (!res.ok) throw new Error('Data load failed');
//       const data = await res.json();
//       setContentList(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('List fetch error:', err);
//       setContentList([]);
//     } finally {
//       setListLoading(false);
//     }
//   };

//   // Manage Tab সক্রিয় থাকলে ডেটা ফেচ হবে
//   useEffect(() => {
//     if (isLoggedIn && activeTab === 'manage') {
//       fetchManageList();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn, activeTab, manageType]);

//   // Login Handler
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus({ type: '', text: '' });

//     try {
//       const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         localStorage.setItem('trainkoi_admin_token', data.token);
//         setIsLoggedIn(true);
//         setStatus({ type: 'success', text: 'স্বাগতম! অ্যাডমিন হিসেবে লগইন সফল হয়েছে।' });
//         setUsername('');
//         setPassword('');
//       } else {
//         setStatus({ type: 'error', text: data.error || 'লগইন ব্যর্থ হয়েছে!' });
//       }
//     } catch (err) {
//       setStatus({ type: 'error', text: 'সার্ভারে কানেক্ট করা যাচ্ছে না! ব্যাকএন্ড সচল আছে কি না দেখুন।' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout Handler
//   const handleLogout = () => {
//     localStorage.removeItem('trainkoi_admin_token');
//     setIsLoggedIn(false);
//     setStatus({ type: 'info', text: 'আপনি লগআউট করেছেন।' });
//   };

//   // Create Post Handler
//   const handlePost = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus({ type: 'info', text: 'কন্টেন্ট আপলোড হচ্ছে...' });

//     const token = localStorage.getItem('trainkoi_admin_token');
//     if (!token) {
//       setIsLoggedIn(false);
//       setLoading(false);
//       return;
//     }

//     try {
//       const endpoint = type === 'news' ? '/api/news/create' : '/api/blogs/create';
//       const payload = type === 'news' 
//         ? { title, content, thumbnail, source: author }
//         : { title, content, thumbnail, category, author };

//       const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus({ type: 'success', text: 'সফলভাবে ডাটাবেসে সেভ হয়েছে!' });
//         setTitle('');
//         setContent('');
//         setThumbnail('');
//       } else {
//         if (res.status === 403 || res.status === 401) {
//           localStorage.removeItem('trainkoi_admin_token');
//           setIsLoggedIn(false);
//         }
//         setStatus({ type: 'error', text: data.error || 'পোস্ট প্রকাশ করা যায়নি।' });
//       }
//     } catch (err) {
//       setStatus({ type: 'error', text: 'সার্ভার এরর! ব্যাকএন্ড সংযোগ পরীক্ষা করুন।' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Safe Delete Handler
//   const handleDelete = async (targetItem) => {
//     const targetId = targetItem._id || targetItem.id;
//     if (!targetId) {
//       alert("পোস্টটির ডেটাবেস ID পাওয়া যায়নি!");
//       return;
//     }

//     const confirmDelete = window.confirm(`আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?\n\n"${targetItem.title}"`);
//     if (!confirmDelete) return;

//     setDeletingId(targetId);
//     setStatus({ type: '', text: '' });
//     const token = localStorage.getItem('trainkoi_admin_token');

//     try {
//       const endpoint = manageType === 'news' ? `/api/news/${targetId}` : `/api/blogs/${targetId}`;
//       const url = `${API_BASE_URL}${endpoint}`;

//       const res = await fetch(url, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const data = await res.json().catch(() => ({}));

//       if (res.ok && data.success) {
//         setContentList(prev => prev.filter(item => (item._id || item.id) !== targetId));
//         setStatus({ type: 'success', text: 'আইটেমটি সফলভাবে ডাটাবেস থেকে মুছে ফেলা হয়েছে!' });
//       } else {
//         if (res.status === 403 || res.status === 401) {
//           localStorage.removeItem('trainkoi_admin_token');
//           setIsLoggedIn(false);
//           setStatus({ type: 'error', text: 'সেশন শেষ হয়ে গেছে! অনুগ্রহ করে পুনরায় লগইন করুন।' });
//         } else if (res.status === 404) {
//           setStatus({ type: 'error', text: 'পোস্টটি সার্ভারে খুঁজে পাওয়া যায়নি (404)!' });
//         } else {
//           setStatus({ type: 'error', text: data.error || 'মুছে ফেলা সম্ভব হয়নি!' });
//         }
//       }
//     } catch (err) {
//       console.error("Delete request error:", err);
//       setStatus({ type: 'error', text: 'ডিলিট করতে সমস্যা হয়েছে! সার্ভার সংযোগ পরীক্ষা করুন।' });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '30px 15px', fontFamily: "'Hind Siliguri', sans-serif" }}>
//       <div style={{ maxWidth: '750px', margin: '0 auto', background: '#ffffff', borderRadius: '24px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
//         {/* Top Header */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
//           <div>
//             <h2 style={{ color: '#006a4e', margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}>
//               <FileText size={24} color="#006a4e" /> TrainKoi Admin Hub
//             </h2>
//             <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
//               {isLoggedIn ? 'রেল সংবাদ ও ব্লগ প্রকাশ ও ব্যবস্থাপনা কন্ট্রোল' : 'অ্যাডমিন নিরাপত্তা পোর্টাল'}
//             </p>
//           </div>
//           {isLoggedIn && (
//             <button 
//               type="button"
//               onClick={handleLogout}
//               style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
//             >
//               <LogOut size={16} /> লগআউট
//             </button>
//           )}
//         </div>

//         {/* Status Box */}
//         {status.text && (
//           <div style={{
//             padding: '12px 16px',
//             borderRadius: '12px',
//             marginBottom: '20px',
//             fontSize: '14px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             backgroundColor: status.type === 'success' ? '#ecfdf5' : status.type === 'error' ? '#fef2f2' : '#f0f9ff',
//             color: status.type === 'success' ? '#065f46' : status.type === 'error' ? '#b91c1c' : '#0369a1',
//             border: `1px solid ${status.type === 'success' ? '#a7f3d0' : status.type === 'error' ? '#fecaca' : '#bae6fd'}`
//           }}>
//             {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//             <span>{status.text}</span>
//           </div>
//         )}

//         {/* Login Form */}
//         {!isLoggedIn ? (
//           <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
//             <div>
//               <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                 <User size={16} color="#006a4e" /> ইউজারনেম:
//               </label>
//               <input 
//                 type="text" 
//                 required
//                 placeholder="অ্যাডমিন ইউজারনেম দিন..."
//                 value={username} 
//                 onChange={(e) => setUsername(e.target.value)} 
//                 style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
//               />
//             </div>

//             <div>
//               <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                 <Lock size={16} color="#006a4e" /> পাসওয়ার্ড:
//               </label>
//               <input 
//                 type="password" 
//                 required
//                 placeholder="অ্যাডমিন পাসওয়ার্ড দিন..."
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
//               />
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading}
//               style={{ 
//                 padding: '14px', 
//                 background: loading ? '#94a3b8' : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
//                 color: '#ffffff', 
//                 border: 'none', 
//                 borderRadius: '12px', 
//                 cursor: loading ? 'not-allowed' : 'pointer', 
//                 fontWeight: 'bold',
//                 fontSize: '15px'
//               }}
//             >
//               {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
//             </button>
//           </form>
//         ) : (
//           <div>
//             {/* Action Tabs */}
//             <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
//               <button
//                 type="button"
//                 onClick={() => { setActiveTab('create'); setStatus({ type: '', text: '' }); }}
//                 style={{
//                   flex: 1,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '8px',
//                   padding: '10px',
//                   borderRadius: '12px',
//                   border: 'none',
//                   backgroundColor: activeTab === 'create' ? '#006a4e' : '#f8fafc',
//                   color: activeTab === 'create' ? '#ffffff' : '#64748b',
//                   fontWeight: '700',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 <PlusCircle size={17} /> নতুন পোস্ট তৈরি
//               </button>

//               <button
//                 type="button"
//                 onClick={() => { setActiveTab('manage'); setStatus({ type: '', text: '' }); }}
//                 style={{
//                   flex: 1,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '8px',
//                   padding: '10px',
//                   borderRadius: '12px',
//                   border: 'none',
//                   backgroundColor: activeTab === 'manage' ? '#006a4e' : '#f8fafc',
//                   color: activeTab === 'manage' ? '#ffffff' : '#64748b',
//                   fontWeight: '700',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 <ListFilter size={17} /> পোস্ট তালিকা ও ডিলিট
//               </button>
//             </div>

//             {/* TAB 1: CREATE POST */}
//             {activeTab === 'create' && (
//               <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
//                 <div>
//                   <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
//                     <Tag size={16} color="#006a4e" /> কন্টেন্টের ধরণ নির্বাচন:
//                   </label>
//                   <select 
//                     value={type} 
//                     onChange={(e) => setType(e.target.value)}
//                     style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', backgroundColor: '#f8fafc', cursor: 'pointer' }}
//                   >
//                     <option value="news">Rail News (রেল সংবাদ ও লাইভ নোটিশ)</option>
//                     <option value="blogs">Train Blog (ভ্রমণ গাইড ও আর্টিকেল)</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
//                     শিরোনাম (Headline):
//                   </label>
//                   <input 
//                     type="text" 
//                     required
//                     placeholder="পোস্টের আকর্ষণীয় শিরোনাম লিখুন..."
//                     value={title} 
//                     onChange={(e) => setTitle(e.target.value)} 
//                     style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
//                   />
//                 </div>

//                 {type === 'blogs' && (
//                   <div>
//                     <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
//                       ক্যাটাগরি:
//                     </label>
//                     <input 
//                       type="text" 
//                       placeholder="যেমন: ভ্রমণ গাইড, টিপস, টিকিট নিয়ম"
//                       value={category} 
//                       onChange={(e) => setCategory(e.target.value)} 
//                       style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
//                     />
//                   </div>
//                 )}

//                 <div>
//                   <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
//                     থাম্বনেইল ইমেজ লিঙ্ক (Optional):
//                   </label>
//                   <input 
//                     type="url" 
//                     placeholder="ছবির সরাসরি লিঙ্ক (https://...)"
//                     value={thumbnail} 
//                     onChange={(e) => setThumbnail(e.target.value)} 
//                     style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
//                   />
//                 </div>

//                 <div>
//                   <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', marginBottom: '6px', display: 'block' }}>
//                     বিস্তারিত বিষয়বস্তু (Content):
//                   </label>
//                   <textarea 
//                     rows="9" 
//                     required
//                     placeholder="এখানে বিস্তারিত তথ্য বা সংবাদ লিখুন..."
//                     value={content} 
//                     onChange={(e) => setContent(e.target.value)} 
//                     style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '14px', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
//                   />
//                 </div>

//                 <button 
//                   type="submit" 
//                   disabled={loading}
//                   style={{ 
//                     padding: '14px', 
//                     background: loading ? '#94a3b8' : 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
//                     color: '#ffffff', 
//                     border: 'none', 
//                     borderRadius: '12px', 
//                     cursor: loading ? 'not-allowed' : 'pointer', 
//                     fontWeight: 'bold',
//                     fontSize: '15px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px'
//                   }}
//                 >
//                   <Send size={18} /> {loading ? 'আপলোড হচ্ছে...' : 'পাবলিশ করুন'}
//                 </button>
//               </form>
//             )}

//             {/* TAB 2: MANAGE & DELETE POSTS */}
//             {activeTab === 'manage' && (
//               <div>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                   <div style={{ display: 'flex', gap: '8px' }}>
//                     <button
//                       type="button"
//                       onClick={() => setManageType('news')}
//                       style={{
//                         padding: '6px 14px',
//                         borderRadius: '20px',
//                         border: '1px solid #cbd5e1',
//                         backgroundColor: manageType === 'news' ? '#006a4e' : '#fff',
//                         color: manageType === 'news' ? '#fff' : '#475569',
//                         fontSize: '12.5px',
//                         fontWeight: '700',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       রেল সংবাদ
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setManageType('blogs')}
//                       style={{
//                         padding: '6px 14px',
//                         borderRadius: '20px',
//                         border: '1px solid #cbd5e1',
//                         backgroundColor: manageType === 'blogs' ? '#006a4e' : '#fff',
//                         color: manageType === 'blogs' ? '#fff' : '#475569',
//                         fontSize: '12.5px',
//                         fontWeight: '700',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       ট্রেন ব্লগ
//                     </button>
//                   </div>

//                   <button
//                     type="button"
//                     onClick={fetchManageList}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: '#006a4e',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '4px',
//                       fontSize: '12.5px',
//                       fontWeight: '700'
//                     }}
//                   >
//                     <RefreshCw size={14} style={{ animation: listLoading ? 'spin 1s linear infinite' : 'none' }} /> রিফ্রেশ
//                   </button>
//                 </div>

//                 {listLoading ? (
//                   <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
//                     <p style={{ margin: 0, fontSize: '14px' }}>তালিকা লোড হচ্ছে...</p>
//                   </div>
//                 ) : contentList.length > 0 ? (
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                     {contentList.map((item) => {
//                       const itemId = item._id || item.id;
//                       return (
//                         <div
//                           key={itemId}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'space-between',
//                             padding: '14px 16px',
//                             borderRadius: '14px',
//                             backgroundColor: '#f8fafc',
//                             border: '1px solid #e2e8f0',
//                             gap: '12px'
//                           }}
//                         >
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <h4 style={{ margin: '0 0 4px 0', fontSize: '14.5px', color: '#0f172a', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                               {item.title}
//                             </h4>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px', color: '#94a3b8' }}>
//                               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                                 <Calendar size={12} />
//                                 {new Date(item.createdAt || Date.now()).toLocaleDateString('bn-BD')}
//                               </span>
//                               <span>ID: {itemId ? String(itemId).slice(-6) : 'N/A'}</span>
//                             </div>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => handleDelete(item)}
//                             disabled={deletingId === itemId}
//                             title="পোস্টটি ডিলিট করুন"
//                             style={{
//                               background: '#fef2f2',
//                               border: '1px solid #fecaca',
//                               borderRadius: '10px',
//                               padding: '8px 12px',
//                               color: '#dc2626',
//                               cursor: deletingId === itemId ? 'not-allowed' : 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '4px',
//                               fontSize: '12.5px',
//                               fontWeight: '700',
//                               flexShrink: 0
//                             }}
//                           >
//                             <Trash2 size={15} />
//                             {deletingId === itemId ? 'মুছছে...' : 'ডিলিট'}
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div style={{ textAlign: 'center', padding: '40px 10px', backgroundColor: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
//                     <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b' }}>ডাটাবেসে কোনো {manageType === 'news' ? 'সংবাদ' : 'ব্লগ'} পাওয়া যায়নি।</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//       </div>
//       <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default ContentUpload;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Send, Lock, User, FileText, Tag, CheckCircle2, AlertCircle, LogOut, Trash2,
  ListFilter, PlusCircle, Calendar, RefreshCw, Bold, List, ListOrdered, Quote,
  Eye, Pencil, Search, Sparkles, Check, X, ExternalLink
} from 'lucide-react';

const DRAFT_KEY = 'trainkoi_draft_v2';

const EMPTY = {
  type: 'news',
  title: '',
  slug: '',
  category: 'ভ্রমণ গাইড',
  author: 'TrainKoi Team',
  thumbnail: '',
  metaDesc: '',
  focus: '',
  keywords: '',
  content: '',
};

const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

/* ---------- content helpers (NewsDetail / BlogDetail er parser er sathe mil rekhe) ---------- */
const plain = (text = '') =>
  String(text)
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^\s*[-•*]\s+/gm, '')
    .replace(/^\s*[\d০-৯]+[.)।]\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const wordCount = (t) => plain(t).split(/\s+/).filter(Boolean).length;

const parseBlocks = (raw = '') => {
  const blocks = [];
  let para = [];
  let list = null;
  let quote = [];
  const flush = () => {
    if (para.length) { blocks.push({ type: 'p', text: para.join('\n') }); para = []; }
    if (list) { blocks.push(list); list = null; }
    if (quote.length) { blocks.push({ type: 'quote', text: quote.join('\n') }); quote = []; }
  };
  String(raw).replace(/\r\n/g, '\n').split('\n').forEach((line) => {
    const t = line.trim();
    if (!t) { flush(); return; }
    const h = t.match(/^(#{1,4})\s+(.+)$/);
    if (h) { flush(); blocks.push({ type: 'h', level: h[1].length <= 2 ? 2 : 3, text: h[2] }); return; }
    const ul = t.match(/^[-•*]\s+(.+)$/);
    if (ul) {
      if (para.length || quote.length || (list && list.type !== 'ul')) flush();
      if (!list) list = { type: 'ul', items: [] };
      list.items.push(ul[1]);
      return;
    }
    const ol = t.match(/^[\d০-৯]+[.)।]\s+(.+)$/);
    if (ol) {
      if (para.length || quote.length || (list && list.type !== 'ol')) flush();
      if (!list) list = { type: 'ol', items: [] };
      list.items.push(ol[1]);
      return;
    }
    const q = t.match(/^>\s?(.*)$/);
    if (q) {
      if (para.length || list) flush();
      quote.push(q[1]);
      return;
    }
    if (list || quote.length) flush();
    para.push(t);
  });
  flush();
  return blocks;
};

const inline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );

const slugify = (v) =>
  v.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');

/* ---------- SEO analysis ---------- */
const analyze = (f) => {
  const blocks = parseBlocks(f.content);
  const words = wordCount(f.content);
  const text = plain(f.content).toLowerCase();
  const kw = f.focus.trim().toLowerCase();
  const isBlog = f.type === 'blogs';
  const minWords = isBlog ? 500 : 150;
  const minH2 = isBlog ? 3 : 1;
  const h2 = blocks.filter((b) => b.type === 'h' && b.level === 2).length;
  const headingsText = blocks.filter((b) => b.type === 'h').map((b) => b.text.toLowerCase()).join(' ');
  const first100 = text.split(/\s+/).slice(0, 100).join(' ');
  const longPara = blocks.some((b) => b.type === 'p' && b.text.split(/\s+/).length > 120);
  const occurrences = kw ? text.split(kw).length - 1 : 0;
  const density = words ? (occurrences * kw.split(/\s+/).length / words) * 100 : 0;
  const tLen = f.title.trim().length;
  const mLen = f.metaDesc.trim().length;
  const extraKw = f.keywords.split(',').map((k) => k.trim()).filter(Boolean).length;

  const checks = [
    { ok: tLen >= 30 && tLen <= 65, label: 'শিরোনামের দৈর্ঘ্য', hint: `এখন ${tLen} অক্ষর। ৩০–৬৫ অক্ষরের মধ্যে রাখুন।` },
    { ok: mLen >= 100 && mLen <= 160, label: 'মেটা ডেসক্রিপশন', hint: `এখন ${mLen} অক্ষর। ১০০–১৬০ অক্ষর দিন।` },
    { ok: words >= minWords, label: `লেখার দৈর্ঘ্য (${minWords}+ শব্দ)`, hint: `এখন ${words} শব্দ। আরও ${Math.max(0, minWords - words)} শব্দ লিখুন।` },
    { ok: h2 >= minH2, label: `H2 হেডিং (${minH2}টি+)`, hint: `এখন ${h2}টি। টুলবারের H2 বাটন দিয়ে হেডিং যোগ করুন।` },
    { ok: !longPara && words > 0, label: 'ছোট অনুচ্ছেদ', hint: 'কোনো অনুচ্ছেদ ১২০ শব্দের বেশি হলে ভেঙে দিন।' },
    { ok: !!kw, label: 'ফোকাস কিওয়ার্ড দেওয়া আছে', hint: 'যে শব্দ লিখে মানুষ গুগলে খুঁজবে সেটা দিন।' },
    { ok: !!kw && f.title.toLowerCase().includes(kw), label: 'শিরোনামে কিওয়ার্ড আছে', hint: 'শিরোনামের শুরুর দিকে কিওয়ার্ড রাখুন।' },
    { ok: !!kw && f.metaDesc.toLowerCase().includes(kw), label: 'মেটা ডেসক্রিপশনে কিওয়ার্ড আছে', hint: 'ডেসক্রিপশনে একবার কিওয়ার্ড বসান।' },
    { ok: !!kw && first100.includes(kw), label: 'প্রথম ১০০ শব্দে কিওয়ার্ড আছে', hint: 'ভূমিকার অনুচ্ছেদেই কিওয়ার্ড আনুন।' },
    { ok: !!kw && headingsText.includes(kw), label: 'কোনো হেডিংয়ে কিওয়ার্ড আছে', hint: 'অন্তত একটি H2 বা H3-তে কিওয়ার্ড রাখুন।' },
    { ok: !!kw && density >= 0.3 && density <= 3, label: 'কিওয়ার্ড ঘনত্ব ঠিক আছে', hint: `এখন ${density.toFixed(1)}%। ০.৩–৩% এর মধ্যে রাখুন, জোর করে বেশি বসাবেন না।` },
    { ok: extraKw >= 3, label: 'সম্পর্কিত কিওয়ার্ড (৩টি+)', hint: `এখন ${extraKw}টি। কমা দিয়ে আরও লিখুন।` },
  ];
  const passed = checks.filter((c) => c.ok).length;
  return { checks, passed, score: Math.round((passed / checks.length) * 100), words, h2, tLen, mLen };
};

const TEMPLATE = `এখানে ১–২ লাইনে মূল কথা লিখুন। এটাই লেখার ভূমিকা, আপনার ফোকাস কিওয়ার্ড এখানে রাখুন।

## প্রথম মূল শিরোনাম

এই অংশে বিস্তারিত তথ্য লিখুন।

### উপ-শিরোনাম

- পয়েন্ট ১
- পয়েন্ট ২
- পয়েন্ট ৩

## দ্বিতীয় মূল শিরোনাম

এই অংশে আরেকটি বিষয় নিয়ে লিখুন।

## সচরাচর জিজ্ঞাসা

### প্রশ্ন ১?

উত্তর লিখুন।

### প্রশ্ন ২?

উত্তর লিখুন।
`;

const PLACEHOLDER = { h2: 'নতুন শিরোনাম', h3: 'উপ-শিরোনাম', ul: 'পয়েন্ট', ol: 'পয়েন্ট', quote: 'উদ্ধৃতি বা গুরুত্বপূর্ণ নোট' };
const LINE_PREFIX_RE = /^(#{1,4}\s+|[-•*]\s+|[\d০-৯]+[.)।]\s+|>\s?)/;

const ContentUpload = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('create');

  const [form, setForm] = useState(loadDraft);
  const [editorMode, setEditorMode] = useState('write'); // write | preview
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [draftSaved, setDraftSaved] = useState(false);

  const [manageType, setManageType] = useState('news');
  const [contentList, setContentList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const taRef = useRef(null);

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const API_BASE_URL = isLocal ? 'http://localhost:5001' : 'https://train-koi.onrender.com';

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const isBlog = form.type === 'blogs';
  const seo = useMemo(() => analyze(form), [form]);
  const blocks = useMemo(() => parseBlocks(form.content), [form.content]);

  useEffect(() => {
    if (localStorage.getItem('trainkoi_admin_token')) setIsLoggedIn(true);
  }, []);

  // Auto-save draft
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (form.title || form.content) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
          setDraftSaved(true);
        }
      } catch { /* ignore */ }
    }, 700);
    return () => clearTimeout(t);
  }, [form]);

  const fetchManageList = async () => {
    setListLoading(true);
    try {
      const endpoint = manageType === 'news' ? '/api/news' : '/api/blogs';
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error('Data load failed');
      const data = await res.json();
      setContentList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('List fetch error:', err);
      setContentList([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === 'manage') fetchManageList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, activeTab, manageType]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('trainkoi_admin_token', data.token);
        setIsLoggedIn(true);
        setStatus({ type: 'success', text: 'স্বাগতম! অ্যাডমিন হিসেবে লগইন সফল হয়েছে।' });
        setUsername('');
        setPassword('');
      } else {
        setStatus({ type: 'error', text: data.error || 'লগইন ব্যর্থ হয়েছে!' });
      }
    } catch {
      setStatus({ type: 'error', text: 'সার্ভারে কানেক্ট করা যাচ্ছে না! ব্যাকএন্ড সচল আছে কি না দেখুন।' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('trainkoi_admin_token');
    setIsLoggedIn(false);
    setStatus({ type: 'info', text: 'আপনি লগআউট করেছেন।' });
  };

  /* ---------- Toolbar ---------- */
  const setContentAndSelect = (next, a, b) => {
    setForm((f) => ({ ...f, content: next }));
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(a, b); }
    });
  };

  const applyFormat = (kind) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;

    if (kind === 'bold') {
      const inner = value.slice(s, e) || 'গুরুত্বপূর্ণ কথা';
      const next = value.slice(0, s) + `**${inner}**` + value.slice(e);
      setContentAndSelect(next, s + 2, s + 2 + inner.length);
      return;
    }

    const prefixFor = (i) => ({ h2: '## ', h3: '### ', ul: '- ', ol: `${i + 1}. `, quote: '> ' }[kind]);
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    let lineEnd = value.indexOf('\n', e);
    if (lineEnd === -1) lineEnd = value.length;
    const lines = value.slice(lineStart, lineEnd).split('\n');
    const same = lines.every((l, i) => l.startsWith(prefixFor(i)));
    const out = lines.map((l, i) => {
      const base = l.replace(LINE_PREFIX_RE, '');
      if (same) return base;
      return prefixFor(i) + (base || (lines.length === 1 ? PLACEHOLDER[kind] : ''));
    }).join('\n');
    const next = value.slice(0, lineStart) + out + value.slice(lineEnd);
    setContentAndSelect(next, lineStart, lineStart + out.length);
  };

  const insertTemplate = () => {
    if (form.content.trim() && !window.confirm('আগের লেখার শেষে টেমপ্লেট যোগ হবে। চালিয়ে যাবেন?')) return;
    setForm((f) => ({ ...f, content: f.content.trim() ? `${f.content.trim()}\n\n${TEMPLATE}` : TEMPLATE }));
  };

  const autoMeta = () => {
    const first = blocks.find((b) => b.type === 'p');
    const base = first ? plain(first.text) : plain(form.content);
    if (!base) return;
    const cut = base.length > 155 ? base.slice(0, 155).replace(/\s+\S*$/, '') + '...' : base;
    setForm((f) => ({ ...f, metaDesc: cut }));
  };

  /* ---------- Publish ---------- */
  const handlePost = async (e) => {
    e.preventDefault();

    if (seo.score < 60 && !window.confirm(`SEO স্কোর মাত্র ${seo.score}%। তবুও পাবলিশ করবেন?`)) return;

    setLoading(true);
    setStatus({ type: 'info', text: 'কন্টেন্ট আপলোড হচ্ছে...' });

    const token = localStorage.getItem('trainkoi_admin_token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    const kwList = form.keywords.split(',').map((k) => k.trim()).filter(Boolean);
    const focus = form.focus.trim();
    if (focus && !kwList.some((k) => k.toLowerCase() === focus.toLowerCase())) kwList.unshift(focus);

    const base = {
      title: form.title.trim(),
      content: form.content.trim(),
      thumbnail: form.thumbnail.trim(),
      metaDescription: form.metaDesc.trim(),
      focusKeyword: focus,
      keywords: kwList.slice(0, 12),
    };
    if (form.slug) base.slug = form.slug;

    const payload = isBlog
      ? { ...base, category: form.category, author: form.author }
      : { ...base, source: form.author };

    try {
      const endpoint = isBlog ? '/api/blogs/create' : '/api/news/create';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: 'success', text: 'সফলভাবে ডাটাবেসে সেভ হয়েছে!' });
        setForm((f) => ({ ...EMPTY, type: f.type, author: f.author, category: f.category }));
        localStorage.removeItem(DRAFT_KEY);
        setDraftSaved(false);
        setEditorMode('write');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        if (res.status === 403 || res.status === 401) {
          localStorage.removeItem('trainkoi_admin_token');
          setIsLoggedIn(false);
        }
        setStatus({ type: 'error', text: data.error || 'পোস্ট প্রকাশ করা যায়নি।' });
      }
    } catch {
      setStatus({ type: 'error', text: 'সার্ভার এরর! ব্যাকএন্ড সংযোগ পরীক্ষা করুন।' });
    } finally {
      setLoading(false);
    }
  };

  const clearDraft = () => {
    if (!window.confirm('বর্তমান ড্রাফট পুরোপুরি মুছে ফেলবেন?')) return;
    setForm(EMPTY);
    localStorage.removeItem(DRAFT_KEY);
    setDraftSaved(false);
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (targetItem) => {
    const targetId = targetItem._id || targetItem.id;
    if (!targetId) {
      alert('পোস্টটির ডেটাবেস ID পাওয়া যায়নি!');
      return;
    }
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?\n\n"${targetItem.title}"`)) return;

    setDeletingId(targetId);
    setStatus({ type: '', text: '' });
    const token = localStorage.getItem('trainkoi_admin_token');

    try {
      const endpoint = manageType === 'news' ? `/api/news/${targetId}` : `/api/blogs/${targetId}`;
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setContentList((prev) => prev.filter((item) => (item._id || item.id) !== targetId));
        setStatus({ type: 'success', text: 'আইটেমটি সফলভাবে ডাটাবেস থেকে মুছে ফেলা হয়েছে!' });
      } else if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('trainkoi_admin_token');
        setIsLoggedIn(false);
        setStatus({ type: 'error', text: 'সেশন শেষ হয়ে গেছে! অনুগ্রহ করে পুনরায় লগইন করুন।' });
      } else if (res.status === 404) {
        setStatus({ type: 'error', text: 'পোস্টটি সার্ভারে খুঁজে পাওয়া যায়নি (404)!' });
      } else {
        setStatus({ type: 'error', text: data.error || 'মুছে ফেলা সম্ভব হয়নি!' });
      }
    } catch (err) {
      console.error('Delete request error:', err);
      setStatus({ type: 'error', text: 'ডিলিট করতে সমস্যা হয়েছে! সার্ভার সংযোগ পরীক্ষা করুন।' });
    } finally {
      setDeletingId(null);
    }
  };

  const scoreTone = seo.score >= 80 ? 'good' : seo.score >= 50 ? 'mid' : 'low';
  const publicPath = (item) => `${manageType === 'news' ? '/news' : '/blog'}/${item.slug || item._id}`;
  const serpTitle = (form.title || 'আপনার শিরোনাম এখানে দেখাবে').slice(0, 65);
  const serpDesc = form.metaDesc || plain(form.content).slice(0, 155) || 'মেটা ডেসক্রিপশন এখানে দেখাবে...';

  return (
    <div className="cu-page">
      <style>{css}</style>

      <div className={`cu-shell ${isLoggedIn && activeTab === 'create' ? 'is-wide' : ''}`}>
        {/* Header */}
        <div className="cu-head">
          <div>
            <h1><FileText size={24} /> TrainKoi Admin Hub</h1>
            <p>{isLoggedIn ? 'রেল সংবাদ ও ব্লগ প্রকাশ ও ব্যবস্থাপনা' : 'অ্যাডমিন নিরাপত্তা পোর্টাল'}</p>
          </div>
          {isLoggedIn && (
            <button type="button" className="cu-logout" onClick={handleLogout}>
              <LogOut size={16} /> লগআউট
            </button>
          )}
        </div>

        {status.text && (
          <div className={`cu-status is-${status.type || 'info'}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.text}</span>
          </div>
        )}

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="cu-login">
            <label className="cu-label"><User size={16} /> ইউজারনেম</label>
            <input className="cu-input" type="text" required placeholder="অ্যাডমিন ইউজারনেম দিন..."
              value={username} onChange={(e) => setUsername(e.target.value)} />
            <label className="cu-label"><Lock size={16} /> পাসওয়ার্ড</label>
            <input className="cu-input" type="password" required placeholder="অ্যাডমিন পাসওয়ার্ড দিন..."
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="cu-primary" disabled={loading}>
              {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>
        ) : (
          <div>
            <div className="cu-tabs">
              <button type="button" className={activeTab === 'create' ? 'is-on' : ''}
                onClick={() => { setActiveTab('create'); setStatus({ type: '', text: '' }); }}>
                <PlusCircle size={17} /> নতুন পোস্ট তৈরি
              </button>
              <button type="button" className={activeTab === 'manage' ? 'is-on' : ''}
                onClick={() => { setActiveTab('manage'); setStatus({ type: '', text: '' }); }}>
                <ListFilter size={17} /> পোস্ট তালিকা ও ডিলিট
              </button>
            </div>

            {/* ================= CREATE ================= */}
            {activeTab === 'create' && (
              <form onSubmit={handlePost} className="cu-grid">
                <div className="cu-col">
                  <div className="cu-field">
                    <label className="cu-label"><Tag size={16} /> কন্টেন্টের ধরণ</label>
                    <select className="cu-input" value={form.type} onChange={set('type')}>
                      <option value="news">Rail News (রেল সংবাদ ও লাইভ নোটিশ)</option>
                      <option value="blogs">Train Blog (ভ্রমণ গাইড ও আর্টিকেল)</option>
                    </select>
                  </div>

                  <div className="cu-field">
                    <label className="cu-label">
                      শিরোনাম (H1)
                      <span className={`cu-count ${form.title.length >= 30 && form.title.length <= 65 ? 'is-ok' : ''}`}>
                        {form.title.length}/65
                      </span>
                    </label>
                    <input className="cu-input" type="text" required value={form.title} onChange={set('title')}
                      placeholder="কিওয়ার্ডসহ আকর্ষণীয় শিরোনাম লিখুন..." />
                    <small className="cu-help">শিরোনাম নিজে থেকেই পেজের H1 হয়। লেখার ভেতরে আর H1 লাগবে না, H2 ও H3 ব্যবহার করুন।</small>
                  </div>

                  <div className="cu-row">
                    {isBlog && (
                      <div className="cu-field">
                        <label className="cu-label">ক্যাটাগরি</label>
                        <input className="cu-input" type="text" value={form.category} onChange={set('category')}
                          placeholder="যেমন: ভ্রমণ গাইড, টিকিট নিয়ম" />
                      </div>
                    )}
                    <div className="cu-field">
                      <label className="cu-label">{isBlog ? 'লেখকের নাম' : 'সূত্র (Source)'}</label>
                      <input className="cu-input" type="text" value={form.author} onChange={set('author')}
                        placeholder={isBlog ? 'TrainKoi Team' : 'যেমন: বাংলাদেশ রেলওয়ে'} />
                    </div>
                  </div>

                  <div className="cu-field">
                    <label className="cu-label">থাম্বনেইল ইমেজ লিঙ্ক (ঐচ্ছিক)</label>
                    <input className="cu-input" type="url" value={form.thumbnail} onChange={set('thumbnail')}
                      placeholder="https://... (অনলাইন ছবির সরাসরি লিঙ্ক)" />
                    {form.thumbnail && (
                      <img className="cu-thumb" src={form.thumbnail} alt="প্রিভিউ"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }} />
                    )}
                  </div>

                  {/* Editor */}
                  <div className="cu-field">
                    <div className="cu-editor-top">
                      <label className="cu-label" style={{ margin: 0 }}>
                        বিস্তারিত লেখা <span className="cu-count">{seo.words} শব্দ</span>
                      </label>
                      <div className="cu-modes">
                        <button type="button" className={editorMode === 'write' ? 'is-on' : ''} onClick={() => setEditorMode('write')}>
                          <Pencil size={14} /> লিখুন
                        </button>
                        <button type="button" className={editorMode === 'preview' ? 'is-on' : ''} onClick={() => setEditorMode('preview')}>
                          <Eye size={14} /> প্রিভিউ
                        </button>
                      </div>
                    </div>

                    {editorMode === 'write' ? (
                      <>
                        <div className="cu-toolbar" role="toolbar" aria-label="ফরম্যাটিং">
                          <button type="button" onClick={() => applyFormat('h2')} title="মূল হেডিং (H2)"><b>H2</b></button>
                          <button type="button" onClick={() => applyFormat('h3')} title="উপ-হেডিং (H3)"><b>H3</b></button>
                          <span className="cu-sep" />
                          <button type="button" onClick={() => applyFormat('bold')} title="বোল্ড"><Bold size={16} /></button>
                          <button type="button" onClick={() => applyFormat('ul')} title="বুলেট লিস্ট"><List size={16} /></button>
                          <button type="button" onClick={() => applyFormat('ol')} title="নম্বর লিস্ট"><ListOrdered size={16} /></button>
                          <button type="button" onClick={() => applyFormat('quote')} title="কোট / নোট"><Quote size={16} /></button>
                          <span className="cu-sep" />
                          <button type="button" className="cu-tpl" onClick={insertTemplate} title="SEO-বান্ধব কাঠামো বসান">
                            <Sparkles size={15} /> কাঠামো বসান
                          </button>
                        </div>
                        <textarea
                          ref={taRef}
                          className="cu-input cu-textarea"
                          required
                          rows={18}
                          value={form.content}
                          onChange={set('content')}
                          placeholder={'লেখা শুরু করুন। হেডিং বানাতে লাইনে কার্সর রেখে H2 বা H3 বাটন চাপুন।\nফাঁকা লাইন দিলে নতুন অনুচ্ছেদ হবে।'}
                        />
                        <small className="cu-help">
                          ## = H2 &nbsp;|&nbsp; ### = H3 &nbsp;|&nbsp; - = বুলেট &nbsp;|&nbsp; 1. = নম্বর &nbsp;|&nbsp; &gt; = কোট &nbsp;|&nbsp; **বোল্ড**
                        </small>
                      </>
                    ) : (
                      <div className="cu-preview">
                        {form.thumbnail && <img className="cu-prev-cover" src={form.thumbnail} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                        <h1>{form.title || 'শিরোনাম এখানে দেখাবে'}</h1>
                        {blocks.length === 0 && <p className="cu-empty">এখনও কিছু লেখা হয়নি।</p>}
                        {blocks.map((b, i) => {
                          if (b.type === 'h') return b.level === 3 ? <h3 key={i}>{inline(b.text)}</h3> : <h2 key={i}>{inline(b.text)}</h2>;
                          if (b.type === 'ul') return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
                          if (b.type === 'ol') return <ol key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ol>;
                          if (b.type === 'quote') return <blockquote key={i}>{inline(b.text)}</blockquote>;
                          return <p key={i}>{inline(b.text)}</p>;
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* ---------- SEO sidebar ---------- */}
                <aside className="cu-side">
                  <div className="cu-box">
                    <div className="cu-box-head"><Search size={17} /> SEO সেটিংস</div>

                    <div className="cu-field">
                      <label className="cu-label">ফোকাস কিওয়ার্ড</label>
                      <input className="cu-input" type="text" value={form.focus} onChange={set('focus')}
                        placeholder="যেমন: ট্রেনের টিকিট ফেরত" />
                    </div>

                    <div className="cu-field">
                      <label className="cu-label">সম্পর্কিত কিওয়ার্ড (কমা দিয়ে)</label>
                      <input className="cu-input" type="text" value={form.keywords} onChange={set('keywords')}
                        placeholder="টিকিট রিফান্ড, রেলওয়ে নিয়ম, ..." />
                    </div>

                    <div className="cu-field">
                      <label className="cu-label">
                        মেটা ডেসক্রিপশন
                        <span className={`cu-count ${seo.mLen >= 100 && seo.mLen <= 160 ? 'is-ok' : ''}`}>{seo.mLen}/160</span>
                      </label>
                      <textarea className="cu-input" rows={3} maxLength={200} value={form.metaDesc} onChange={set('metaDesc')}
                        placeholder="গুগল সার্চে শিরোনামের নিচে যে সংক্ষিপ্ত বিবরণ দেখায়..." />
                      <button type="button" className="cu-link" onClick={autoMeta}>লেখা থেকে নিজে নিজে বানান</button>
                    </div>

                    <div className="cu-field">
                      <label className="cu-label">URL স্লাগ (ঐচ্ছিক, ইংরেজিতে)</label>
                      <input className="cu-input" type="text" value={form.slug}
                        onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                        placeholder="train-ticket-refund-rules" />
                      <small className="cu-help">খালি রাখলে সার্ভার নিজে বানাবে।</small>
                    </div>

                    <div className="cu-serp">
                      <span className="cu-serp-url">trainkoi.com › {isBlog ? 'blog' : 'news'} › {form.slug || '...'}</span>
                      <span className="cu-serp-title">{serpTitle}</span>
                      <span className="cu-serp-desc">{serpDesc.slice(0, 160)}</span>
                    </div>
                  </div>

                  <div className="cu-box">
                    <div className="cu-score-row">
                      <div className="cu-box-head" style={{ margin: 0 }}>SEO স্কোর</div>
                      <div className={`cu-score is-${scoreTone}`}>{seo.score}%</div>
                    </div>
                    <div className="cu-meter"><span className={`is-${scoreTone}`} style={{ width: `${seo.score}%` }} /></div>
                    <ul className="cu-checks">
                      {seo.checks.map((c) => (
                        <li key={c.label} className={c.ok ? 'is-ok' : ''}>
                          <span className="cu-ic">{c.ok ? <Check size={13} /> : <X size={13} />}</span>
                          <div>
                            <strong>{c.label}</strong>
                            {!c.ok && <small>{c.hint}</small>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="cu-box cu-tips">
                    <div className="cu-box-head">AdSense অনুমোদনের টিপস</div>
                    <ul>
                      <li>নিজের ভাষায় মৌলিক লেখা লিখুন, অন্য সাইট থেকে কপি করবেন না।</li>
                      <li>ব্লগে ৫০০+ শব্দ ও কমপক্ষে ৩টি H2 রাখুন।</li>
                      <li>প্রতিটি পোস্টে পাঠকের কাজে লাগে এমন নির্দিষ্ট তথ্য দিন।</li>
                      <li>কিওয়ার্ড জোর করে বারবার বসাবেন না।</li>
                      <li>ছোট ছোট অনুচ্ছেদ ও বুলেট লিস্ট ব্যবহার করুন।</li>
                    </ul>
                  </div>
                </aside>

                {/* Submit bar */}
                <div className="cu-submit">
                  <span className="cu-draft">
                    {draftSaved ? 'ড্রাফট অটো-সেভ হয়েছে' : 'অটো-সেভ চালু'}
                    {(form.title || form.content) && (
                      <button type="button" className="cu-link" onClick={clearDraft}>ড্রাফট মুছুন</button>
                    )}
                  </span>
                  <button type="submit" className="cu-primary" disabled={loading}>
                    <Send size={18} /> {loading ? 'আপলোড হচ্ছে...' : 'পাবলিশ করুন'}
                  </button>
                </div>
              </form>
            )}

            {/* ================= MANAGE ================= */}
            {activeTab === 'manage' && (
              <div>
                <div className="cu-manage-top">
                  <div className="cu-modes">
                    <button type="button" className={manageType === 'news' ? 'is-on' : ''} onClick={() => setManageType('news')}>রেল সংবাদ</button>
                    <button type="button" className={manageType === 'blogs' ? 'is-on' : ''} onClick={() => setManageType('blogs')}>ট্রেন ব্লগ</button>
                  </div>
                  <button type="button" className="cu-link" onClick={fetchManageList}>
                    <RefreshCw size={14} className={listLoading ? 'cu-spin' : ''} /> রিফ্রেশ
                  </button>
                </div>

                {listLoading ? (
                  <p className="cu-empty">তালিকা লোড হচ্ছে...</p>
                ) : contentList.length > 0 ? (
                  <div className="cu-list">
                    {contentList.map((item) => {
                      const itemId = item._id || item.id;
                      return (
                        <div key={itemId} className="cu-item">
                          <div className="cu-item-main">
                            <h4>{item.title}</h4>
                            <div className="cu-item-meta">
                              <span><Calendar size={12} /> {new Date(item.createdAt || Date.now()).toLocaleDateString('bn-BD')}</span>
                              <span>ID: {itemId ? String(itemId).slice(-6) : 'N/A'}</span>
                            </div>
                          </div>
                          <a className="cu-view" href={publicPath(item)} target="_blank" rel="noreferrer" title="পেজটি দেখুন">
                            <ExternalLink size={15} />
                          </a>
                          <button type="button" className="cu-del" onClick={() => handleDelete(item)}
                            disabled={deletingId === itemId} title="পোস্টটি ডিলিট করুন">
                            <Trash2 size={15} /> {deletingId === itemId ? 'মুছছে...' : 'ডিলিট'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="cu-empty">ডাটাবেসে কোনো {manageType === 'news' ? 'সংবাদ' : 'ব্লগ'} পাওয়া যায়নি।</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const css = `
.cu-page {
  --ink: #0f1f1a; --body: #25332e; --muted: #5d6f68; --faint: #8a9a94;
  --green: #006a4e; --green-deep: #003726; --mint: #6ee7b7;
  --line: #e2ebe7; --bg: #f3f7f5; --surface: #ffffff;
  background: var(--bg); min-height: 100vh; padding: 28px 14px 60px;
  font-family: 'Hind Siliguri', sans-serif; color: var(--ink);
}
.cu-page *, .cu-page *::before, .cu-page *::after { box-sizing: border-box; }
.cu-page button, .cu-page input, .cu-page select, .cu-page textarea { font-family: inherit; }
.cu-page :focus-visible { outline: 3px solid var(--mint); outline-offset: 2px; }

.cu-shell {
  max-width: 760px; margin: 0 auto; padding: 26px; background: var(--surface);
  border: 1px solid var(--line); border-radius: 26px; box-shadow: 0 18px 40px -26px rgba(0,55,38,.35);
}
.cu-shell.is-wide { max-width: 1180px; }
.cu-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-bottom: 16px; margin-bottom: 20px; border-bottom: 1.5px dashed var(--line); }
.cu-head h1 { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 22px; font-weight: 800; color: var(--green); }
.cu-head p { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
.cu-logout {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 13px; font-weight: 700;
  color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; cursor: pointer;
}
.cu-status { display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; border-radius: 14px; border: 1px solid #bae6fd; background: #f0f9ff; color: #0369a1; }
.cu-status.is-success { background: #ecfdf5; color: #065f46; border-color: #a7f3d0; }
.cu-status.is-error { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }

.cu-label { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 14px; font-weight: 800; color: #334155; }
.cu-label svg { color: var(--green); }
.cu-count { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--faint); }
.cu-count.is-ok { color: var(--green); }
.cu-input {
  width: 100%; padding: 12px 14px; font-size: 14px; color: var(--ink); background: #fff;
  border: 1px solid #cbd5e1; border-radius: 12px; outline: none; transition: border-color .15s;
}
.cu-input:focus { border-color: var(--green); }
.cu-help { display: block; margin-top: 6px; font-size: 12px; line-height: 1.6; color: var(--faint); }
.cu-field { margin-bottom: 18px; }
.cu-row { display: grid; gap: 14px; grid-template-columns: 1fr; }
.cu-login { display: flex; flex-direction: column; gap: 10px; max-width: 480px; margin: 0 auto; }
.cu-login .cu-label { margin-top: 8px; }

.cu-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 26px;
  font-size: 15px; font-weight: 800; color: #fff; border: none; border-radius: 14px; cursor: pointer;
  background: linear-gradient(135deg, #006a4e 0%, #004d39 100%); transition: transform .15s, opacity .15s;
}
.cu-primary:active { transform: scale(.98); }
.cu-primary:disabled { background: #94a3b8; cursor: not-allowed; }
.cu-link {
  display: inline-flex; align-items: center; gap: 4px; padding: 0; margin-top: 6px;
  font-size: 12.5px; font-weight: 700; color: var(--green); background: none; border: none; cursor: pointer;
}
.cu-link:hover { text-decoration: underline; }

.cu-tabs { display: flex; gap: 10px; margin-bottom: 22px; padding-bottom: 14px; border-bottom: 2px solid #f1f5f9; }
.cu-tabs button {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 11px;
  font-size: 14px; font-weight: 700; color: var(--muted); background: #f8fafc; border: none; border-radius: 13px; cursor: pointer;
}
.cu-tabs button.is-on { color: #fff; background: var(--green); }

/* grid */
.cu-grid { display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
.cu-col { min-width: 0; }
.cu-side { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.cu-thumb { display: none; width: 100%; max-height: 190px; margin-top: 10px; object-fit: cover; border-radius: 14px; background: var(--bg); }

/* editor */
.cu-editor-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.cu-modes { display: inline-flex; gap: 6px; }
.cu-modes button {
  display: inline-flex; align-items: center; gap: 5px; padding: 6px 13px; font-size: 12.5px; font-weight: 700;
  color: var(--muted); background: #fff; border: 1px solid #cbd5e1; border-radius: 999px; cursor: pointer;
}
.cu-modes button.is-on { color: #fff; background: var(--green); border-color: var(--green); }
.cu-toolbar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 8px;
  background: var(--bg); border: 1px solid var(--line); border-bottom: none; border-radius: 14px 14px 0 0;
}
.cu-toolbar button {
  min-width: 36px; height: 34px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  font-size: 13px; color: var(--green-deep); background: #fff; border: 1px solid var(--line); border-radius: 10px; cursor: pointer;
  transition: background .15s, color .15s;
}
.cu-toolbar button:hover { background: var(--green); color: #fff; }
.cu-toolbar .cu-tpl { margin-left: auto; font-weight: 700; }
.cu-sep { width: 1px; height: 22px; background: var(--line); }
.cu-textarea { min-height: 380px; line-height: 1.85; resize: vertical; border-radius: 0 0 14px 14px; font-size: 15px; }

/* preview */
.cu-preview { padding: 22px; min-height: 380px; background: #fff; border: 1px solid var(--line); border-radius: 14px; font-size: 16.5px; line-height: 1.95; color: var(--body); }
.cu-preview h1 { margin: 0 0 18px; font-size: 26px; font-weight: 800; line-height: 1.4; color: var(--ink); }
.cu-preview h2 { margin: 1.7em 0 .6em; padding-left: 12px; font-size: 1.3em; font-weight: 800; line-height: 1.45; color: var(--ink); border-left: 4px solid var(--green); }
.cu-preview h3 { margin: 1.5em 0 .5em; font-size: 1.15em; font-weight: 800; color: var(--green-deep); }
.cu-preview p { margin: 0 0 1.2em; white-space: pre-line; }
.cu-preview ul, .cu-preview ol { margin: 0 0 1.2em; padding-left: 24px; }
.cu-preview li { margin-bottom: .4em; }
.cu-preview li::marker { color: var(--green); font-weight: 800; }
.cu-preview blockquote { margin: 1.4em 0; padding: 14px 18px; font-weight: 600; color: var(--green-deep); background: #eaf6f0; border-radius: 14px; white-space: pre-line; }
.cu-prev-cover { display: block; width: 100%; max-height: 240px; margin-bottom: 18px; object-fit: cover; border-radius: 14px; }
.cu-empty { margin: 0; padding: 34px 10px; text-align: center; font-size: 13.5px; color: var(--muted); background: var(--bg); border: 1px dashed #cbd5e1; border-radius: 14px; }

/* SEO boxes */
.cu-box { padding: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 20px; }
.cu-box-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; font-size: 15px; font-weight: 800; }
.cu-box-head svg { color: var(--green); }
.cu-box .cu-field:last-of-type { margin-bottom: 0; }
.cu-serp { margin-top: 16px; padding: 14px; background: var(--bg); border-radius: 14px; display: flex; flex-direction: column; gap: 3px; }
.cu-serp-url { font-size: 12px; color: #4d5156; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cu-serp-title { font-size: 17px; line-height: 1.4; color: #1a0dab; }
.cu-serp-desc { font-size: 13px; line-height: 1.6; color: #4d5156; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

.cu-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.cu-score { padding: 3px 14px; font-size: 18px; font-weight: 800; border-radius: 999px; }
.cu-score.is-good { color: #065f46; background: #d1fae5; }
.cu-score.is-mid { color: #92400e; background: #fef3c7; }
.cu-score.is-low { color: #b91c1c; background: #fee2e2; }
.cu-meter { height: 8px; margin-bottom: 14px; overflow: hidden; background: var(--bg); border-radius: 999px; }
.cu-meter span { display: block; height: 100%; border-radius: 999px; transition: width .3s ease; }
.cu-meter .is-good { background: #10b981; }
.cu-meter .is-mid { background: #f59e0b; }
.cu-meter .is-low { background: #ef4444; }
.cu-checks { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.cu-checks li { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; line-height: 1.5; }
.cu-checks strong { display: block; font-weight: 700; color: var(--ink); }
.cu-checks small { display: block; margin-top: 1px; font-size: 12px; color: var(--muted); }
.cu-ic { flex: none; width: 20px; height: 20px; display: grid; place-items: center; margin-top: 1px; color: #b91c1c; background: #fee2e2; border-radius: 50%; }
.cu-checks li.is-ok .cu-ic { color: #065f46; background: #d1fae5; }
.cu-tips ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.75; color: var(--muted); }

.cu-submit {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
  padding-top: 18px; border-top: 1.5px dashed var(--line);
}
.cu-draft { display: inline-flex; align-items: center; gap: 12px; font-size: 12.5px; color: var(--faint); }
.cu-draft .cu-link { margin: 0; color: #dc2626; }

/* manage */
.cu-manage-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.cu-manage-top .cu-link { margin: 0; }
.cu-list { display: flex; flex-direction: column; gap: 10px; }
.cu-item { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; }
.cu-item-main { flex: 1; min-width: 0; }
.cu-item h4 { margin: 0 0 4px; font-size: 14.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cu-item-meta { display: flex; align-items: center; gap: 10px; font-size: 11.5px; color: #94a3b8; }
.cu-item-meta span { display: inline-flex; align-items: center; gap: 4px; }
.cu-view { flex: none; width: 36px; height: 36px; display: grid; place-items: center; color: var(--green); background: #ecfdf3; border: 1px solid #bbf7d0; border-radius: 10px; }
.cu-del {
  flex: none; display: flex; align-items: center; gap: 4px; padding: 8px 12px; font-size: 12.5px; font-weight: 700;
  color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; cursor: pointer;
}
.cu-del:disabled { cursor: not-allowed; opacity: .6; }
.cu-spin { animation: cu-spin 1s linear infinite; }
@keyframes cu-spin { to { transform: rotate(360deg); } }

@media (min-width: 640px) {
  .cu-row { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .cu-grid { grid-template-columns: minmax(0, 1fr) 360px; align-items: start; }
  .cu-side { position: sticky; top: 20px; max-height: calc(100vh - 40px); overflow-y: auto; padding-right: 2px; }
  .cu-submit { grid-column: 1 / -1; }
}
@media (max-width: 639px) {
  .cu-shell { padding: 18px; border-radius: 22px; }
  .cu-toolbar .cu-tpl { margin-left: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .cu-page *, .cu-page *::before, .cu-page *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
`;

export default ContentUpload;
