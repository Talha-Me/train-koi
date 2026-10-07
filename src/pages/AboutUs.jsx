// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   ChevronLeft, Train, ShieldCheck, Clock, Info, Search, Map, 
//   LocateFixed, Activity, Ticket, Anchor, AlertCircle, BookOpen, 
//   Navigation2, Users, Heart, Globe, ExternalLink, Code2, Sparkles, CheckCircle2
// } from 'lucide-react';

// const AboutUs = () => {
//   const navigate = useNavigate();

//   // স্মার্ট ব্যাক বাটন লজিক
//   const handleSmartBack = () => {
//     if (window.history.state && window.history.state.idx > 0) {
//       navigate(-1);
//     } else {
//       navigate('/');
//     }
//   };

//   // গুগল এসইও এবং ক্রলার ফ্রেন্ডলি মেটা টাইটেল সেট
//   useEffect(() => {
//     const originalTitle = document.title;
//     document.title = "About Us | TrainKoi - বাংলাদেশের একমাত্র ফ্রি লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম";
//     return () => {
//       document.title = originalTitle;
//     };
//   }, []);

//   return (
//     <div style={{ backgroundColor: '#f0f4f2', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '60px' }}>
      
//       {/* হেডার সেকশন */}
//       <header style={{ 
//         background: 'linear-gradient(135deg, #005a43 0%, #003d2d 100%)', 
//         padding: '16px 20px', 
//         color: 'white', 
//         position: 'sticky', 
//         top: 0, 
//         zIndex: 100, 
//         boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
//       }}>
//         <div style={{ maxWidth: '950px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
//           <button 
//             onClick={handleSmartBack} 
//             style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
//             aria-label="Back"
//           >
//             <ChevronLeft size={28} />
//           </button>
//           <div>
//             <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>আমাদের সম্পর্কে (About TrainKoi)</h1>
//             <p style={{ margin: 0, fontSize: '11px', opacity: 0.85 }}>বাংলাদেশের একমাত্র ফ্রি ও কমিউনিটি-চালিত লাইভ ট্রেন ট্র্যাকার</p>
//           </div>
//         </div>
//       </header>

//       <main style={{ maxWidth: '950px', margin: '0 auto', padding: '30px 16px' }}>
        
//         {/* মেগা হিরো ব্র্যান্ডিং সেকশন */}
//         <section style={{ textAlign: 'center', marginBottom: '45px' }}>
//           <div style={{ 
//             backgroundColor: 'white', 
//             width: '90px', 
//             height: '90px', 
//             borderRadius: '26px', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center', 
//             margin: '0 auto 20px', 
//             boxShadow: '0 12px 28px rgba(0,90,67,0.12)',
//             border: '2px solid #e1eee7'
//           }}>
//             <Train size={48} color="#005a43" />
//           </div>

//           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e2ece6', color: '#005a43', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '800', marginBottom: '14px' }}>
//             <Sparkles size={16} /> শতভাগ উন্মুক্ত ও ফ্রি প্ল্যাটফর্ম
//           </div>

//           <h2 style={{ color: '#003d2d', fontSize: '28px', margin: '0 0 16px', fontWeight: '900', lineHeight: '1.4' }}>
//             ট্রেনকই: বাংলাদেশের একমাত্র ডিজিটাল প্ল্যাটফর্ম যেখানে ট্রেনের লাইভ লোকেশন দেখা যায় সম্পূর্ণ ফ্রিতে!
//           </h2>

//           <p style={{ color: '#444', lineHeight: '1.9', fontSize: '16.5px', textAlign: 'justify', backgroundColor: 'white', padding: '24px', borderRadius: '22px', border: '1px solid #e5ece8', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
//             <strong>ট্রেনকই (TrainKoi.com)</strong> হলো বাংলাদেশ রেলওয়ের সম্মানিত সাধারণ যাত্রী ও পর্যটকদের জন্য নির্মিত প্রথম পূর্ণাঙ্গ এবং আধুনিক <strong>কমিউনিটি-চালিত (Crowdsourced) লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম</strong>। প্রচলিত এসএমএস ট্র্যাকিংয়ের খরুচে ঝামেলা ও থার্ড-পার্টির পেইড সাবস্ক্রিপশন দূর করে সাধারণ মানুষের হাতের মুঠোয় ট্রেনের সঠিক শিডিউল, রিয়েল-টাইম জিপিএস লোকেশন, বর্তমান গতি ও প্ল্যাটফর্ম নোটিশ এক ক্লিকে সম্পূর্ণ ফ্রিতে পৌঁছে দেওয়াই ট্রেনকই-এর মূল লক্ষ্য।
//           </p>
//         </section>

//         {/* কোর আর্কিটেকচার: কীভাবে কাজ করে লাইভ ট্র্যাকিং */}
//         <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderTop: '6px solid #005a43', marginBottom: '30px', border: '1px solid #eef2f0' }}>
//           <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
//             <div style={{ backgroundColor: '#e6f4ee', padding: '10px', borderRadius: '12px' }}>
//               <LocateFixed color="#005a43" size={28} />
//             </div>
//             <h3 style={{ margin: 0, fontSize: '21px', color: '#005a43', fontWeight: '800' }}>
//               স্মার্ট লাইভ ট্র্যাকিং যেভাবে কাজ করে
//             </h3>
//           </div>
//           <p style={{ color: '#555', lineHeight: '1.85', textAlign: 'justify', fontSize: '15.5px', margin: 0 }}>
//             ট্রেনকই মূলত একটি <strong>সহযাত্রী-নির্ভর (Community-Powered) ওপেন ট্র্যাকিং নেটওয়ার্ক</strong>। ট্রেনে অবস্থানরত কোনো যাত্রী যখন অ্যাপে অবস্থান শেয়ার করেন, তখন তার ফোনের নির্ভুল জিপিএস সিগন্যাল ও স্যাটেলাইট কো-অর্ডিনেটস রিয়েল-টাইমে প্রসেস হয়ে ট্রেনকই-এর লাইভ ম্যাপে যুক্ত হয়। এর ফলে স্টেশনে অপেক্ষারত হাজার হাজার যাত্রী নিজ ঘরে বা প্ল্যাটফর্মে বসেই দেখতে পারেন ট্রেনটি এই মুহূর্তে ঠিক কোন স্টেশনে রয়েছে, কত কিমি গতিতে চলছে এবং আনুমানিক কয়টায় স্টেশনে প্রবেশ করবে।
//           </p>
//         </section>

//         {/* স্পেশালাইজড ফিচার গ্রিড (এসইও কিওয়ার্ড বুস্টার) */}
//         <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          
//           <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//               <Clock color="#005a43" size={24} />
//               <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>১০০% নির্ভুল সময়সূচী ও রুট</h4>
//             </div>
//             <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
//               বাংলাদেশ রেলওয়ের পূর্বাঞ্চল ও পশ্চিমাঞ্চল জোনের ঢাকা, চট্টগ্রাম, রাজশাহী, সিলেট ও পঞ্চগড়গামী সকল আন্তঃনগর, মেইল ও কমিউটার ট্রেনের হালনাগাদ শিডিউল।
//             </p>
//           </div>

//           <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//               <Ticket color="#e67e22" size={24} />
//               <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>ভাড়া ও সিট লেআউট গাইড</h4>
//             </div>
//             <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
//               শোভন চেয়ার, স্নিগ্ধা ও এসি বার্থের দূরত্বভিত্তিক অফিসিয়াল ভাড়ার চার্ট এবং ট্রেনের বগিভিত্তিক সিট প্ল্যান সহজে যাচাইয়ের সুবিধা।
//             </p>
//           </div>

//           <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
//               <Activity color="#e53935" size={24} />
//               <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>লাইভ বিলম্ব ও গতি মনিটর</h4>
//             </div>
//             <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
//               ট্রেনের অপ্রত্যাশিত যাত্রা বিলম্ব, গতি পর্যবেক্ষণ ও পরবর্তী স্টেশনে পৌঁছানোর সম্ভাব্য সময় (ETA) সরাসরি স্ক্রিনে প্রদর্শন।
//             </p>
//           </div>

//         </section>

//         {/* কেন ট্রেনকই সবার চেয়ে আলাদা */}
//         <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '35px', border: '1px solid #eef2f0' }}>
//           <h3 style={{ margin: '0 0 20px 0', color: '#005a43', fontSize: '21px', fontWeight: '800' }}>
//             ট্রেনকই প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ
//           </h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             {[
//               { t: "সম্পূর্ণ বিনামূল্যে ব্যবহারযোগ্য:", d: "কোনো পেইড প্রিমিয়াম ফিচার নেই। দেশের প্রতিটি নাগরিকের জন্য সকল ট্র্যাকিং সার্ভিস আজীবন ফ্রি।" },
//               { t: "কোনো ভারী অ্যাপ ইনস্টলের বাধ্যবাধকতা নেই:", d: "যেকোনো স্মার্টফোন বা কম্পিউটার ব্রাউজার থেকে সরাসরি উচ্চগতির সাথে লোড হয়।" },
//               { t: "অফলাইন এসএমএস ট্র্যাকিং ব্যাকআপ:", d: "ইন্টারনেট না থাকলে সরাসরি ১৬৩১৮ নম্বরে নির্দিষ্ট ট্রেনের কোড পাঠিয়ে অবস্থান জানার পূর্ণাঙ্গ গাইডলাইন।" },
//               { t: "বিজ্ঞাপনমুক্ত ও ক্লিন ইউজার এক্সপেরিয়েন্স:", d: "যাত্রীর মূল্যবান সময় ও ব্যাটারি বাঁচাতে কোনো বিরক্তিকর বা বিভ্রান্তিকর অ্যাড ছাড়াই দ্রুত ব্রাউজিং।" }
//             ].map((f, idx) => (
//               <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
//                 <CheckCircle2 size={20} color="#005a43" style={{ flexShrink: 0, marginTop: '3px' }} />
//                 <div>
//                   <strong style={{ color: '#222', fontSize: '15.5px' }}>{f.t}</strong>
//                   <p style={{ margin: '3px 0 0', color: '#666', fontSize: '14px', lineHeight: '1.7' }}>{f.d}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ডেভেলপার ও প্রতিষ্ঠান পরিচিতি: Talhabyte IT & Founder Profile */}
//         <section style={{ 
//           backgroundColor: '#ffffff', 
//           padding: '30px', 
//           borderRadius: '24px', 
//           border: '1.5px solid #d0e5db', 
//           boxShadow: '0 8px 24px rgba(0,90,67,0.06)',
//           marginBottom: '35px'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
//             <div style={{ backgroundColor: '#005a43', padding: '10px', borderRadius: '12px', color: 'white' }}>
//               <Code2 size={24} />
//             </div>
//             <div>
//               <h3 style={{ margin: 0, fontSize: '20px', color: '#003d2d', fontWeight: '900' }}>
//                 উদ্যোগ ও প্রযুক্তিগত অংশীদার: Talhabyte IT
//               </h3>
//               <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>মানবকল্যাণ ও উন্মুক্ত প্রযুক্তির সেবায় নিবেদিত সফটওয়্যার ল্যাব</p>
//             </div>
//           </div>

//           <p style={{ color: '#444', fontSize: '15.5px', lineHeight: '1.85', textAlign: 'justify', marginBottom: '20px' }}>
//             <strong>Talhabyte IT (তালহাবাইট আইটি)</strong> একটি আধুনিক প্রযুক্তি গবেষণা ও সফটওয়্যার উদ্ভাবনী প্রতিষ্ঠান, যা বিশেষ করে সাধারণ মানুষের জীবনযাত্রাকে সহজ ও গতিশীল করার মতো সামাজিক ও মানবসেবামূলক টেক-প্রজেক্ট নির্মাণে বিশ্বাসী। এই প্রতিষ্ঠানের প্রতিষ্ঠাতা ও প্রধান কারিগরি পরিচালক হলেন{" "}
//             <a 
//               href="https://abutalha.xyz/" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               style={{ color: '#005a43', fontWeight: '900', textDecoration: 'none', borderBottom: '2px solid #005a43', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
//             >
//               মো. আবু তালহা আকাশ (Md. Abu Talha Akash) <ExternalLink size={14} />
//             </a>
//             । প্রযুক্তির শক্তিকে সাধারণ মানুষের উপকারে রূপান্তর করাই তালহাবাইট আইটির মূল দর্শন।
//           </p>

//           {/* মানবসেবামূলক প্রজেক্ট পোর্টফোলিও */}
//           <div style={{ backgroundColor: '#f8faf9', padding: '20px', borderRadius: '18px', border: '1px solid #e1ece6' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#005a43', fontWeight: '800', fontSize: '15px' }}>
//               <Heart size={18} fill="#005a43" /> আমাদের উল্লেখযোগ্য মানবকল্যাণমূলক প্রজেক্টসমূহ:
//             </div>
//             <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '14.5px', lineHeight: '1.9' }}>
//               <li style={{ marginBottom: '8px' }}>
//                 <strong style={{ color: '#111' }}>TrainKoi (ট্রেনকই):</strong> বাংলাদেশের কোটি রেলযাত্রীকে সম্পূর্ণ বিনামূল্যে রিয়েল-টাইম লাইভ ট্রেন লোকেশন ও সময়সূচী দেওয়ার ডিজিটাল পোর্টাল।
//               </li>
//               <li>
//                 <strong style={{ color: '#111' }}>GreenRoute EU (গ্রিনরুট ইইউ):</strong> পরিবেশবান্ধব, টেকসই যোগাযোগ ও গ্লোবাল রুট সমাধান সংক্রান্ত আন্তর্জাতিক প্রজেক্ট —{" "}
//                 <a 
//                   href="https://greenrouteeu.xyz/" 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'underline' }}
//                 >
//                   greenrouteeu.xyz
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </section>

//         {/* তথ্যগত স্বচ্ছতা ও দায়মুক্তি নোটিশ (অ্যাডসেন্স কমপ্লায়েন্স) */}
//         <section style={{ backgroundColor: '#fffbf5', padding: '24px', borderRadius: '20px', borderLeft: '6px solid #e67e22', border: '1px solid #ffeedb', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
//           <h4 style={{ margin: '0 0 10px 0', color: '#d35400', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800' }}>
//             <Info size={19} /> তথ্যগত স্বচ্ছতা ও দায়মুক্তি (Disclaimer & Transparency)
//           </h4>
//           <p style={{ margin: 0, fontSize: '13.5px', color: '#666', lineHeight: '1.8', textAlign: 'justify' }}>
//             <strong>TrainKoi (ট্রেনকই)</strong> কোনো সরকারি সংস্থা বা বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অঙ্গপ্রতিষ্ঠান নয়। এটি নাগরিকদের স্বেচ্ছাসেবী ডেটা শেয়ারিং ও ওপেন প্ল্যাটফর্ম সহায়তায় পরিচালিত একটি সহায়ক পাবলিক ইনফরমেশন সিস্টেম। যাত্রীদের ভ্রমণের মানসিক প্রস্তুতি ও সময় সাশ্রয়ে সহায়তা করাই এই ওয়েবসাইটের একমাত্র উদ্দেশ্য।
//           </p>
//         </section>

//         {/* আমাদের ভিশন */}
//         <section style={{ textAlign: 'center', padding: '25px 20px', backgroundColor: 'white', borderRadius: '22px', border: '1px solid #eef2f0' }}>
//           <h4 style={{ color: '#005a43', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>আমাদের দীর্ঘমেয়াদী লক্ষ্য</h4>
//           <p style={{ fontSize: '15px', color: '#555', fontStyle: 'italic', maxWidth: '720px', margin: '0 auto', lineHeight: '1.8' }}>
//             "আধুনিক প্রযুক্তির সহায়তায় বাংলাদেশের প্রতিটি নাগরিকের জন্য নিরাপদ, নিশ্চিত ও স্বচ্ছ ট্রেন ভ্রমণের পরিবেশ নিশ্চিত করা — যাতে কাউকে অনিশ্চয়তায় স্টেশনের প্ল্যাটফর্মে দাঁড়িয়ে থাকতে না হয়।"
//           </p>
//         </section>

//         {/* এসইও ফুটার ও কপিরাইট */}
//         <footer style={{ marginTop: '45px', borderTop: '1px solid #dbe5e0', paddingTop: '22px', textAlign: 'center' }}>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '14px' }}>
//             <Activity size={18} color="#005a43" />
//             <ShieldCheck size={18} color="#005a43" />
//             <Globe size={18} color="#005a43" />
//           </div>
//           <p style={{ fontSize: '12.5px', color: '#777', lineHeight: '1.8', margin: 0 }}>
//             <strong>TrainKoi™</strong> - The Premier Free Crowdsourced Bangladesh Railway Information Platform. <br/>
//             Engineered & Maintained with passion by{" "}
//             <a 
//               href="https://talhabyteit.vercel.app/" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'none' }}
//             >
//               Talhabyte IT
//             </a>
//             {" "}(Founder:{" "}
//             <a 
//               href="https://abutalha.xyz/" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'none' }}
//             >
//               Md. Abu Talha Akash
//             </a>
//             )<br />
//             All Rights Reserved © 2026 TrainKoi.com
//           </p>
//         </footer>

//       </main>
//     </div>
//   );
// };

// export default AboutUs;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ChevronLeft,
  Train,
  ShieldCheck,
  Clock,
  Info,
  Search,
  LocateFixed,
  Activity,
  BookOpen,
  Navigation2,
  Heart,
  Globe,
  ExternalLink,
  Code2,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Route,
  Target,
  Server,
  Newspaper,
  MapPin,
  CalendarDays,
  Zap
} from 'lucide-react';

/* ============================================================
   RESPONSIVE STYLES
   Breakpoints:
   - Desktop  : default
   - Laptop   : max-width 1024px
   - Tablet   : max-width 768px
   - Mobile   : max-width 480px
   ============================================================ */
const styles = `
.tk-page {
  background-color: #f0f4f2;
  min-height: 100vh;
  font-family: 'Hind Siliguri', sans-serif;
  padding-bottom: 70px;
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}
.tk-page *, .tk-page *::before, .tk-page *::after { box-sizing: border-box; }
.tk-page p, .tk-page h1, .tk-page h2, .tk-page h3, .tk-page span, .tk-page strong {
  overflow-wrap: anywhere;
  word-break: normal;
}
.tk-page svg { flex-shrink: 0; }

/* ---------- Header ---------- */
.tk-header {
  background: linear-gradient(135deg, #005a43 0%, #003d2d 100%);
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top, 0px));
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.tk-header-inner {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 15px;
}
.tk-back-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}
.tk-header-text { min-width: 0; }
.tk-header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}
.tk-header-sub {
  margin: 0;
  font-size: 11px;
  opacity: 0.85;
  line-height: 1.4;
}

/* ---------- Main ---------- */
.tk-main {
  width: 100%;
  max-width: 1450px;
  margin: 0 auto;
  padding: 35px 25px;
}

/* ---------- Generic card ---------- */
.tk-card {
  background-color: white;
  padding: 32px;
  border-radius: 25px;
  border: 1px solid #e5ece8;
  margin-bottom: 30px;
}
.tk-card-shadow { box-shadow: 0 5px 20px rgba(0,0,0,0.03); }
.tk-card-top {
  border-top: 6px solid #005a43;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}
.tk-card-head {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;
}
.tk-icon-box {
  background-color: #e6f4ee;
  padding: 10px;
  border-radius: 12px;
  display: flex;
  flex-shrink: 0;
}
.tk-h2 {
  margin: 0;
  font-size: 22px;
  color: #005a43;
  font-weight: 800;
  line-height: 1.4;
}
.tk-p {
  color: #555;
  line-height: 1.9;
  text-align: justify;
  font-size: 15px;
  margin: 0 0 15px;
}
.tk-p:last-child { margin-bottom: 0; }

/* ---------- Hero ---------- */
.tk-hero {
  background: linear-gradient(135deg, #ffffff 0%, #f7fbf9 100%);
  border-radius: 30px;
  padding: 45px 35px;
  margin-bottom: 30px;
  border: 1px solid #dfeae4;
  box-shadow: 0 8px 30px rgba(0,90,67,0.06);
}
.tk-hero-grid {
  display: grid;
  grid-template-columns: minmax(240px, 0.7fr) minmax(0, 2fr);
  gap: 40px;
  align-items: center;
}
.tk-hero-brand { text-align: center; }
.tk-hero-logo {
  background-color: white;
  width: 105px;
  height: 105px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 15px 35px rgba(0,90,67,0.13);
  border: 2px solid #e1eee7;
}
.tk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #e2ece6;
  color: #005a43;
  padding: 7px 17px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 800;
  max-width: 100%;
}
.tk-eyebrow {
  color: #005a43;
  font-size: 13px;
  font-weight: 800;
  display: block;
}
.tk-eyebrow-sm { font-size: 12px; font-weight: 900; }
.tk-hero-title {
  color: #003d2d;
  font-size: 34px;
  margin: 8px 0 18px;
  font-weight: 900;
  line-height: 1.35;
}
.tk-hero-p1 {
  color: #4a5568;
  line-height: 1.9;
  font-size: 16px;
  text-align: justify;
  margin: 0;
}
.tk-hero-p2 {
  color: #4a5568;
  line-height: 1.9;
  font-size: 15px;
  text-align: justify;
  margin: 15px 0 0;
}

/* ---------- Quick stats ---------- */
.tk-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 30px;
}
.tk-stat {
  background-color: white;
  padding: 22px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid #e2ede7;
  box-shadow: 0 3px 12px rgba(0,0,0,0.025);
  min-width: 0;
}
.tk-stat-icon {
  background-color: #e6f4ee;
  color: #005a43;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  flex-shrink: 0;
}
.tk-stat-body { min-width: 0; }
.tk-stat-title { display: block; color: #1e293b; font-size: 15px; }
.tk-stat-text { color: #777; font-size: 12.5px; line-height: 1.5; }

/* ---------- Section titles ---------- */
.tk-sec-head { margin-bottom: 20px; }
.tk-sec-title {
  margin: 5px 0 0;
  color: #1e293b;
  font-size: 25px;
  font-weight: 900;
  line-height: 1.4;
}

/* ---------- Feature grid ---------- */
.tk-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}
.tk-feature {
  background-color: #fff;
  padding: 25px;
  border-radius: 22px;
  border: 1px solid #e2ede7;
  box-shadow: 0 3px 12px rgba(0,0,0,0.025);
}
.tk-feature-icon {
  background-color: #e6f4ee;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}
.tk-feature-title {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1e293b;
  font-weight: 800;
}
.tk-feature-text {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.75;
}

/* ---------- Reasons ---------- */
.tk-reasons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.tk-reason {
  padding: 20px;
  background-color: #f8faf9;
  border-radius: 18px;
  border: 1px solid #e1ece6;
}
.tk-reason-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 9px;
}
.tk-reason-title { color: #1e293b; font-size: 15px; }
.tk-reason-text {
  margin: 0;
  color: #666;
  font-size: 13.5px;
  line-height: 1.75;
}

/* ---------- Travel two-col ---------- */
.tk-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}
.tk-two .tk-card { margin-bottom: 0; padding: 30px; }
.tk-two .tk-h2 { font-size: 20px; }
.tk-two .tk-card-head { gap: 12px; margin-bottom: 15px; }
.tk-two-text {
  color: #555;
  font-size: 14.5px;
  line-height: 1.85;
  margin: 0;
}

/* ---------- Development points ---------- */
.tk-points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 30px;
  row-gap: 0;
  margin-top: 6px;
}
.tk-point {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 11px 0;
  border-bottom: 1px solid #eef2f0;
}
.tk-point:nth-last-child(-n+2) { border-bottom: none; }
.tk-point span { color: #555; font-size: 14px; line-height: 1.65; }

/* ---------- Technology ---------- */
.tk-tech {
  background: linear-gradient(135deg, #005a43 0%, #003d2d 100%);
  padding: 35px;
  border-radius: 28px;
  color: white;
  margin-bottom: 30px;
}
.tk-tech-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.tk-tech-title { margin: 0; font-size: 23px; line-height: 1.4; }
.tk-tech-p1 {
  font-size: 15px;
  line-height: 1.9;
  opacity: 0.92;
  text-align: justify;
  margin: 0 0 18px;
}
.tk-tech-p2 {
  font-size: 14px;
  line-height: 1.85;
  opacity: 0.85;
  margin: 0;
}

/* ---------- Talhabyte ---------- */
.tk-org {
  background-color: #ffffff;
  padding: 32px;
  border-radius: 25px;
  border: 1.5px solid #d0e5db;
  box-shadow: 0 8px 24px rgba(0,90,67,0.06);
  margin-bottom: 30px;
}
.tk-org-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.tk-org-icon {
  background-color: #005a43;
  padding: 10px;
  border-radius: 12px;
  color: white;
  display: flex;
  flex-shrink: 0;
}
.tk-org-title {
  margin: 0;
  font-size: 21px;
  color: #003d2d;
  font-weight: 900;
  line-height: 1.4;
}
.tk-org-sub { margin: 0; font-size: 13px; color: #666; }
.tk-org-p {
  color: #444;
  font-size: 15px;
  line-height: 1.9;
  text-align: justify;
  margin: 0 0 18px;
}
.tk-founder {
  background-color: #f8faf9;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid #e1ece6;
}
.tk-founder-p {
  margin: 0 0 12px;
  font-size: 14px;
  color: #555;
  line-height: 1.75;
}
.tk-links { display: flex; flex-wrap: wrap; gap: 10px 18px; }
.tk-link {
  color: #005a43;
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0;
}

/* ---------- Disclaimer ---------- */
.tk-note {
  background-color: #fffbf5;
  padding: 28px;
  border-radius: 22px;
  border: 1px solid #ffeedb;
  border-left: 6px solid #e67e22;
  margin-bottom: 30px;
}
.tk-note-title {
  margin: 0 0 12px;
  color: #d35400;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  line-height: 1.4;
}
.tk-note-p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.85;
  text-align: justify;
}
.tk-note-p + .tk-note-p { margin-top: 14px; }

/* ---------- Safety ---------- */
.tk-safety-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}
.tk-safety-title { margin: 0; color: #005a43; font-size: 21px; line-height: 1.4; }
.tk-safety-text {
  color: #555;
  font-size: 14.5px;
  line-height: 1.85;
  text-align: justify;
  margin: 0;
}

/* ---------- Vision ---------- */
.tk-vision {
  background: linear-gradient(135deg, #f7fbf9 0%, #ffffff 100%);
  text-align: center;
  padding: 38px 25px;
  border-radius: 25px;
  border: 1px solid #dfeae4;
}
.tk-vision-icon {
  background-color: #e6f4ee;
  width: 55px;
  height: 55px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}
.tk-vision-title {
  color: #005a43;
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.4;
}
.tk-vision-text {
  font-size: 15px;
  color: #555;
  max-width: 850px;
  margin: 0 auto;
  line-height: 1.9;
}

/* ---------- Footer ---------- */
.tk-footer {
  margin-top: 45px;
  border-top: 1px solid #dbe5e0;
  padding-top: 25px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  text-align: center;
}
.tk-footer-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 14px;
}
.tk-footer-text {
  font-size: 12.5px;
  color: #777;
  line-height: 1.8;
  margin: 0;
}
.tk-footer-link {
  color: #005a43;
  font-weight: bold;
  text-decoration: none;
}

/* Keyboard focus */
.tk-page a:focus-visible,
.tk-page button:focus-visible {
  outline: 3px solid #e67e22;
  outline-offset: 2px;
  border-radius: 6px;
}

/* ============================================================
   LAPTOP / SMALL DESKTOP  (<= 1024px)
   ============================================================ */
@media (max-width: 1024px) {
  .tk-main { padding: 28px 20px; }
  .tk-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tk-features { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tk-reasons { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .tk-hero { padding: 38px 28px; }
  .tk-hero-grid { gap: 30px; grid-template-columns: minmax(200px, 0.8fr) minmax(0, 2fr); }
  .tk-hero-title { font-size: 30px; }
}

/* ============================================================
   TABLET  (<= 768px)
   ============================================================ */
@media (max-width: 768px) {
  .tk-header { padding: 12px 16px; padding-top: calc(12px + env(safe-area-inset-top, 0px)); }
  .tk-header-title { font-size: 16.5px; }
  .tk-main { padding: 22px 16px; }

  .tk-hero { padding: 30px 20px; border-radius: 24px; }
  .tk-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 24px; }
  .tk-hero-text { text-align: left; }
  .tk-hero-title { font-size: 26px; margin-bottom: 14px; }
  .tk-hero-p1 { font-size: 15px; }
  .tk-hero-p2 { font-size: 14.5px; }

  .tk-card { padding: 24px 20px; border-radius: 20px; margin-bottom: 22px; }
  .tk-two { grid-template-columns: minmax(0, 1fr); gap: 18px; margin-bottom: 22px; }
  .tk-two .tk-card { padding: 24px 20px; }
  .tk-points { grid-template-columns: minmax(0, 1fr); }
  .tk-point:nth-last-child(2) { border-bottom: 1px solid #eef2f0; }

  .tk-tech { padding: 26px 20px; border-radius: 22px; }
  .tk-org { padding: 24px 20px; border-radius: 20px; }
  .tk-note { padding: 22px 18px; }
  .tk-vision { padding: 30px 18px; }

  .tk-sec-title { font-size: 22px; }
  .tk-h2 { font-size: 20px; }
  .tk-tech-title { font-size: 21px; }

  /* Justified Bangla text looks gappy on narrow screens */
  .tk-p, .tk-tech-p1, .tk-org-p, .tk-note-p, .tk-safety-text { text-align: left; }
}

/* ============================================================
   MOBILE  (<= 480px)
   ============================================================ */
@media (max-width: 480px) {
  .tk-header-inner { gap: 8px; }
  .tk-header-title { font-size: 15px; }
  .tk-header-sub { font-size: 10.5px; }
  .tk-main { padding: 16px 12px; }

  .tk-hero { padding: 24px 16px; border-radius: 20px; margin-bottom: 18px; }
  .tk-hero-logo { width: 84px; height: 84px; border-radius: 24px; margin-bottom: 14px; }
  .tk-hero-logo svg { width: 44px; height: 44px; }
  .tk-badge { font-size: 12px; padding: 6px 13px; }
  .tk-eyebrow { font-size: 11.5px; line-height: 1.5; }
  .tk-hero-title { font-size: 22px; line-height: 1.45; }
  .tk-hero-p1 { font-size: 14.5px; line-height: 1.85; }
  .tk-hero-p2 { font-size: 14px; }

  .tk-stats { gap: 10px; margin-bottom: 20px; }
  .tk-stat { flex-direction: column; align-items: flex-start; text-align: left; padding: 14px; gap: 10px; border-radius: 16px; }
  .tk-stat-icon { padding: 9px; border-radius: 11px; }
  .tk-stat-icon svg { width: 20px; height: 20px; }
  .tk-stat-title { font-size: 14px; }
  .tk-stat-text { font-size: 11.5px; }

  .tk-card { padding: 20px 16px; border-radius: 18px; margin-bottom: 18px; }
  .tk-card-head { gap: 10px; }
  .tk-icon-box { padding: 8px; }
  .tk-icon-box svg { width: 22px; height: 22px; }
  .tk-h2 { font-size: 18px; }
  .tk-p { font-size: 14.5px; line-height: 1.85; }

  .tk-sec-title { font-size: 20px; }
  .tk-features { grid-template-columns: minmax(0, 1fr); gap: 14px; margin-bottom: 24px; }
  .tk-feature { padding: 20px 18px; border-radius: 18px; }
  .tk-feature-title { font-size: 16px; }

  .tk-reasons { grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .tk-reason { padding: 16px; }

  .tk-two { gap: 14px; margin-bottom: 18px; }
  .tk-two .tk-card { padding: 20px 16px; }
  .tk-two .tk-h2 { font-size: 17.5px; }
  .tk-two-text { font-size: 14px; }

  .tk-point span { font-size: 13.5px; }

  .tk-tech { padding: 22px 16px; border-radius: 20px; margin-bottom: 18px; }
  .tk-tech-title { font-size: 19px; }
  .tk-tech-p1 { font-size: 14px; }
  .tk-tech-p2 { font-size: 13.5px; }

  .tk-org { padding: 20px 16px; margin-bottom: 18px; }
  .tk-org-title { font-size: 18px; }
  .tk-org-p { font-size: 14px; }
  .tk-founder { padding: 16px; }
  .tk-links { flex-direction: column; gap: 8px; }

  .tk-note { padding: 18px 14px; border-radius: 18px; margin-bottom: 18px; }
  .tk-note-title { font-size: 16px; }
  .tk-note-p { font-size: 13.5px; }

  .tk-safety-title { font-size: 18px; }
  .tk-safety-text { font-size: 14px; }

  .tk-vision { padding: 26px 16px; border-radius: 20px; }
  .tk-vision-title { font-size: 19px; }
  .tk-vision-text { font-size: 14px; }

  .tk-footer { margin-top: 30px; }
}

/* Very small phones */
@media (max-width: 360px) {
  .tk-stats { grid-template-columns: minmax(0, 1fr); }
  .tk-hero-title { font-size: 20px; }
}

/* Large screens */
@media (min-width: 1600px) {
  .tk-main { max-width: 1550px; }
}

@media (prefers-reduced-motion: reduce) {
  .tk-page * { transition: none !important; animation: none !important; }
}
`;

const AboutUs = () => {
  const navigate = useNavigate();

  const handleSmartBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const originalTitle = document.title;

    document.title =
      'About Us | TrainKoi - বাংলাদেশ রেলওয়ে ট্রেন ট্র্যাকিং ও সময়সূচী';

    return () => {
      document.title = originalTitle;
    };
  }, []);

  const features = [
    {
      icon: <LocateFixed size={25} color="#005a43" />,
      title: 'ট্রেন ট্র্যাকিং',
      text: 'উপলব্ধ ট্র্যাকিং ডেটার মাধ্যমে চলমান ট্রেনের অবস্থান সম্পর্কে ধারণা পাওয়ার সুযোগ।'
    },
    {
      icon: <Clock size={25} color="#005a43" />,
      title: 'ট্রেনের সময়সূচী',
      text: 'বিভিন্ন ট্রেনের ছাড়ার সময়, পৌঁছানোর সময়, রুট ও স্টেশন সম্পর্কিত তথ্য সহজে খুঁজে দেখা যায়।'
    },
    {
      icon: <Route size={25} color="#005a43" />,
      title: 'রুট ও স্টেশন তথ্য',
      text: 'একটি ট্রেন কোন কোন স্টেশনের মধ্য দিয়ে চলাচল করে এবং কোন রুটে যায় তা জানার সুবিধা।'
    },
    {
      icon: <Search size={25} color="#005a43" />,
      title: 'সহজ ট্রেন অনুসন্ধান',
      text: 'ট্রেনের নাম বা নম্বর ব্যবহার করে প্রয়োজনীয় ট্রেনের তথ্য দ্রুত খুঁজে পাওয়ার ব্যবস্থা।'
    },
    {
      icon: <Smartphone size={25} color="#005a43" />,
      title: 'মোবাইল ফ্রেন্ডলি',
      text: 'স্মার্টফোন, ট্যাবলেট ও কম্পিউটার থেকে সহজে ব্যবহার করার জন্য responsive interface।'
    },
    {
      icon: <Newspaper size={25} color="#005a43" />,
      title: 'রেলওয়ে তথ্য ও ব্লগ',
      text: 'ট্রেন, রেলভ্রমণ, স্টেশন ও বাংলাদেশ রেলওয়ে সম্পর্কিত দরকারি তথ্য ও কনটেন্ট।'
    }
  ];

  const reasons = [
    {
      icon: <Heart size={23} color="#005a43" />,
      title: 'যাত্রীকেন্দ্রিক উদ্যোগ',
      text: 'ট্রেনে যাতায়াতকারী সাধারণ মানুষের দৈনন্দিন তথ্যের প্রয়োজনকে সামনে রেখে TrainKoi তৈরি করা হয়েছে।'
    },
    {
      icon: <Globe size={23} color="#005a43" />,
      title: 'সবার জন্য উন্মুক্ত',
      text: 'ইন্টারনেট সংযোগ থাকা যেকোনো ব্যবহারকারী ব্রাউজারের মাধ্যমে প্ল্যাটফর্মটি ব্যবহার করতে পারেন।'
    },
    {
      icon: <Zap size={23} color="#005a43" />,
      title: 'দ্রুত তথ্য খোঁজা',
      text: 'ট্রেনের নাম, নম্বর, রুট ও সময়সূচী সম্পর্কিত তথ্য সহজে খুঁজে পাওয়ার জন্য interface তৈরি করা হয়েছে।'
    },
    {
      icon: <ShieldCheck size={23} color="#005a43" />,
      title: 'তথ্যগত স্বচ্ছতা',
      text: 'TrainKoi সরকারি রেলওয়ে সংস্থা নয়—ব্যবহারকারীদের এই বিষয়টি পরিষ্কারভাবে জানানো হয়।'
    }
  ];

  const developmentPoints = [
    'বাংলাদেশের রেলপথ ও ট্রেনভ্রমণ সম্পর্কিত তথ্যকে সহজভাবে উপস্থাপন করা',
    'একাধিক তথ্যের উৎসের পরিবর্তে প্রয়োজনীয় তথ্যকে একটি ব্যবহারবান্ধব প্ল্যাটফর্মে আনার চেষ্টা',
    'মোবাইল ব্যবহারকারীদের জন্য দ্রুত ও সহজ navigation তৈরি করা',
    'ট্রেনের সময়সূচী ও রুট সম্পর্কিত তথ্য খুঁজে পাওয়ার প্রক্রিয়া সহজ করা',
    'ট্রেনের বর্তমান অবস্থান সম্পর্কিত উপলব্ধ ডেটা ব্যবহারকারীর সামনে সহজভাবে উপস্থাপন করা',
    'ভবিষ্যতে আরও স্টেশন, রুট ও রেলভ্রমণ সম্পর্কিত তথ্য যুক্ত করার সুযোগ তৈরি করা'
  ];

  const quickStats = [
    { icon: <Train size={25} />, title: 'ট্রেন তথ্য', text: 'নাম, নম্বর ও রুট' },
    { icon: <Clock size={25} />, title: 'সময়সূচী', text: 'ছাড়ার ও পৌঁছানোর তথ্য' },
    { icon: <LocateFixed size={25} />, title: 'ট্র্যাকিং', text: 'উপলব্ধ লাইভ অবস্থান' },
    { icon: <MapPin size={25} />, title: 'স্টেশন', text: 'রুট ও স্টেশন তথ্য' }
  ];

  return (
    <div className="tk-page">
      <style>{styles}</style>

      {/* ================= HEADER ================= */}
      <header className="tk-header">
        <div className="tk-header-inner">
          <button
            onClick={handleSmartBack}
            className="tk-back-btn"
            aria-label="Back"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="tk-header-text">
            <h1 className="tk-header-title">আমাদের সম্পর্কে (About TrainKoi)</h1>
            <p className="tk-header-sub">
              বাংলাদেশ রেলওয়ে ট্রেন তথ্য, সময়সূচী ও ট্র্যাকিং প্ল্যাটফর্ম
            </p>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="tk-main">
        {/* ================= HERO ================= */}
        <section className="tk-hero">
          <div className="tk-hero-grid">
            <div className="tk-hero-brand">
              <div className="tk-hero-logo">
                <Train size={55} color="#005a43" />
              </div>

              <div className="tk-badge">
                <Sparkles size={16} />
                Free Railway Information Platform
              </div>
            </div>

            <div className="tk-hero-text">
              <span className="tk-eyebrow">
                TRAIN INFORMATION • TRACKING • SCHEDULE
              </span>

              <h2 className="tk-hero-title">
                ট্রেনকই — বাংলাদেশ রেলওয়ের ট্রেন তথ্য ও ট্র্যাকিংয়ের সহজ
                ডিজিটাল প্ল্যাটফর্ম
              </h2>

              <p className="tk-hero-p1">
                <strong>TrainKoi.com</strong> হলো বাংলাদেশে রেলভ্রমণকারী সাধারণ
                মানুষের জন্য তৈরি একটি স্বাধীন ও তথ্যভিত্তিক অনলাইন প্ল্যাটফর্ম।
                ট্রেনের সময়সূচী, রুট, স্টেশন এবং উপলব্ধ ট্র্যাকিং তথ্য সহজভাবে
                খুঁজে পাওয়া এবং ভ্রমণের পরিকল্পনাকে আরও সুবিধাজনক করা
                TrainKoi-এর অন্যতম প্রধান উদ্দেশ্য।
              </p>

              <p className="tk-hero-p2">
                আমরা বিশ্বাস করি, রেলভ্রমণ সম্পর্কিত তথ্য যত সহজে মানুষের কাছে
                পৌঁছানো যায়, যাত্রীরা তত ভালোভাবে তাদের সময় ও ভ্রমণ পরিকল্পনা
                করতে পারবেন। এই ধারণা থেকেই TrainKoi-এর যাত্রা শুরু।
              </p>
            </div>
          </div>
        </section>

        {/* ================= QUICK STATS ================= */}
        <section className="tk-stats">
          {quickStats.map((item, index) => (
            <div key={index} className="tk-stat">
              <div className="tk-stat-icon">{item.icon}</div>
              <div className="tk-stat-body">
                <strong className="tk-stat-title">{item.title}</strong>
                <span className="tk-stat-text">{item.text}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ================= WHAT IS TRAINKOI ================= */}
        <section className="tk-card tk-card-shadow">
          <div className="tk-card-head">
            <div className="tk-icon-box">
              <BookOpen color="#005a43" size={27} />
            </div>
            <h2 className="tk-h2">TrainKoi কী?</h2>
          </div>

          <p className="tk-p">
            TrainKoi হলো একটি independent railway information platform, যার
            মাধ্যমে ব্যবহারকারীরা বাংলাদেশ রেলওয়ের বিভিন্ন ট্রেনের সময়সূচী,
            রুট, স্টেশন এবং উপলব্ধ ট্র্যাকিং সম্পর্কিত তথ্য দেখতে পারেন।
            প্ল্যাটফর্মটির interface এমনভাবে তৈরি করা হয়েছে যাতে প্রযুক্তিতে খুব
            বেশি অভিজ্ঞ না হলেও একজন সাধারণ যাত্রী সহজে তার প্রয়োজনীয় ট্রেন খুঁজে
            নিতে পারেন।
          </p>

          <p className="tk-p">
            TrainKoi কোনো টিকিট বিক্রয়কারী প্রতিষ্ঠান নয় এবং এটি বাংলাদেশ
            রেলওয়ের সরকারি ওয়েবসাইটের বিকল্প হিসেবেও দাবি করে না। এর উদ্দেশ্য
            হলো বিভিন্ন রেলভ্রমণ-সংক্রান্ত তথ্যকে ব্যবহারকারীদের জন্য আরও সহজ,
            দ্রুত এবং mobile-friendly উপায়ে উপস্থাপন করা।
          </p>
        </section>

        {/* ================= HOW TRACKING WORKS ================= */}
        <section className="tk-card tk-card-top">
          <div className="tk-card-head">
            <div className="tk-icon-box">
              <LocateFixed color="#005a43" size={28} />
            </div>
            <h2 className="tk-h2">TrainKoi-এর ট্রেন ট্র্যাকিং কীভাবে কাজ করে?</h2>
          </div>

          <p className="tk-p">
            TrainKoi-এর ট্র্যাকিং সুবিধা উপলব্ধ অবস্থান-সংক্রান্ত ডেটা ব্যবহার
            করে একটি ট্রেনের সম্ভাব্য বর্তমান অবস্থান ব্যবহারকারীর সামনে উপস্থাপন
            করে। যখন কোনো ট্রেনের জন্য পর্যাপ্ত tracking data পাওয়া যায়, তখন সেই
            তথ্যকে map-based interface-এর মাধ্যমে দেখানো হয়।
          </p>

          <p className="tk-p">
            তবে লাইভ ট্র্যাকিংকে সব পরিস্থিতিতে শতভাগ নির্ভুল ধরে নেওয়া উচিত নয়।
            GPS availability, network connectivity, data update delay এবং অন্যান্য
            প্রযুক্তিগত কারণে কোনো কোনো সময় অবস্থানের তথ্য আপডেট হতে দেরি হতে
            পারে। তাই গুরুত্বপূর্ণ যাত্রার ক্ষেত্রে TrainKoi-এর তথ্যের পাশাপাশি
            স্টেশন ঘোষণা ও প্রাসঙ্গিক অফিসিয়াল তথ্যও বিবেচনা করা উচিত।
          </p>
        </section>

        {/* ================= FEATURES ================= */}
        <div className="tk-sec-head">
          <span className="tk-eyebrow tk-eyebrow-sm">WHAT WE OFFER</span>
          <h2 className="tk-sec-title">TrainKoi-এর প্রধান সুবিধা ও ফিচার</h2>
        </div>

        <section className="tk-features">
          {features.map((feature, index) => (
            <div key={index} className="tk-feature">
              <div className="tk-feature-icon">{feature.icon}</div>
              <h3 className="tk-feature-title">{feature.title}</h3>
              <p className="tk-feature-text">{feature.text}</p>
            </div>
          ))}
        </section>

        {/* ================= WHY TRAINKOI ================= */}
        <section className="tk-card">
          <div className="tk-sec-head" style={{ marginBottom: 22 }}>
            <span className="tk-eyebrow tk-eyebrow-sm">OUR APPROACH</span>
            <h2 className="tk-sec-title" style={{ fontSize: 'inherit' }}>
              <span style={{ fontSize: 'clamp(20px, 3vw, 23px)' }}>
                কেন TrainKoi তৈরি করা হয়েছে?
              </span>
            </h2>
          </div>

          <div className="tk-reasons">
            {reasons.map((item, index) => (
              <div key={index} className="tk-reason">
                <div className="tk-reason-head">
                  {item.icon}
                  <strong className="tk-reason-title">{item.title}</strong>
                </div>
                <p className="tk-reason-text">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TRAVEL PLANNING ================= */}
        <section className="tk-two">
          <div className="tk-card">
            <div className="tk-card-head">
              <CalendarDays color="#005a43" size={26} />
              <h2 className="tk-h2">ভ্রমণের আগে কী দেখবেন?</h2>
            </div>
            <p className="tk-two-text">
              ট্রেনে যাত্রার আগে ট্রেনের নাম, নম্বর, নির্ধারিত সময়সূচী, যাত্রার
              স্টেশন, গন্তব্য এবং রুট দেখে নেওয়া ভালো। দীর্ঘ দূরত্বের যাত্রায়
              পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছানো এবং প্রয়োজনে সর্বশেষ
              রেলওয়ে ঘোষণা যাচাই করা উচিত।
            </p>
          </div>

          <div className="tk-card">
            <div className="tk-card-head">
              <Navigation2 color="#005a43" size={26} />
              <h2 className="tk-h2">ট্র্যাকিং তথ্য কীভাবে ব্যবহার করবেন?</h2>
            </div>
            <p className="tk-two-text">
              ট্রেনের বর্তমান অবস্থান সম্পর্কে ধারণা পেতে tracking information
              ব্যবহার করা যায়। তবে কোনো জরুরি সিদ্ধান্তের ক্ষেত্রে শুধু একটি online
              source-এর ওপর নির্ভর না করে স্টেশন, রেলওয়ে কর্মী এবং অফিসিয়াল
              ঘোষণার তথ্যও বিবেচনা করুন।
            </p>
          </div>
        </section>

        {/* ================= DEVELOPMENT ================= */}
        <section className="tk-card">
          <div className="tk-card-head" style={{ marginBottom: 18 }}>
            <div className="tk-icon-box">
              <Target color="#005a43" size={26} />
            </div>
            <h2 className="tk-h2">আমাদের লক্ষ্য ও ভবিষ্যৎ পরিকল্পনা</h2>
          </div>

          <p className="tk-p">
            TrainKoi একটি চলমান প্রযুক্তি প্রকল্প। ব্যবহারকারীদের প্রয়োজন এবং
            রেলভ্রমণের পরিবর্তিত তথ্যের সঙ্গে সামঞ্জস্য রেখে প্ল্যাটফর্মটিকে আরও
            উন্নত করার লক্ষ্য রয়েছে। ভবিষ্যতে আরও রুট, স্টেশন, ট্রেন তথ্য, রেলওয়ে
            সংবাদ এবং ব্যবহারকারী সহায়ক ফিচার যুক্ত করার সুযোগ তৈরি করা হবে।
          </p>

          <div className="tk-points">
            {developmentPoints.map((point, index) => (
              <div key={index} className="tk-point">
                <CheckCircle2
                  size={18}
                  color="#005a43"
                  style={{ flexShrink: 0, marginTop: 3 }}
                />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TECHNOLOGY ================= */}
        <section className="tk-tech">
          <div className="tk-tech-head">
            <Server size={27} />
            <h2 className="tk-tech-title">প্রযুক্তি ও প্ল্যাটফর্ম উন্নয়ন</h2>
          </div>

          <p className="tk-tech-p1">
            TrainKoi একটি web-based technology platform হিসেবে তৈরি করা হয়েছে,
            যাতে ব্যবহারকারীরা আলাদা কোনো application install না করেই browser
            থেকে রেলওয়ে-সংক্রান্ত তথ্য ব্যবহার করতে পারেন। Frontend, backend,
            database, map-based visualization এবং real-time data processing-এর মতো
            বিভিন্ন প্রযুক্তিগত উপাদান ব্যবহার করে প্ল্যাটফর্মের বিভিন্ন সুবিধা তৈরি
            ও পরিচালনা করা হয়।
          </p>

          <p className="tk-tech-p2">
            প্রযুক্তিগত অবকাঠামো ধীরে ধীরে উন্নত করা হচ্ছে যাতে ব্যবহারকারীরা দ্রুত
            পেজ লোড, সহজ navigation এবং পরিষ্কার তথ্য উপস্থাপন উপভোগ করতে পারেন।
          </p>
        </section>

        {/* ================= TALHABYTE ================= */}
        <section className="tk-org">
          <div className="tk-org-head">
            <div className="tk-org-icon">
              <Code2 size={24} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 className="tk-org-title">TrainKoi-এর প্রযুক্তিগত উদ্যোগ</h2>
              <p className="tk-org-sub">Talhabyte IT</p>
            </div>
          </div>

          <p className="tk-org-p">
            TrainKoi-এর development ও প্রযুক্তিগত ব্যবস্থাপনার সঙ্গে
            <strong> Talhabyte IT</strong> যুক্ত। সাধারণ মানুষের জন্য বাস্তব
            সমস্যার প্রযুক্তিনির্ভর সমাধান তৈরি করার লক্ষ্যেই বিভিন্ন web
            application ও digital service development-এর মাধ্যমে এই উদ্যোগ
            পরিচালিত হচ্ছে।
          </p>

          <div className="tk-founder">
            <p className="tk-founder-p">
              <strong style={{ color: '#005a43' }}>Founder &amp; Developer:</strong>{' '}
              মো. আবু তালহা আকাশ (Md. Abu Talha Akash)
            </p>

            <div className="tk-links">
              <a
                href="https://abutalha.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="tk-link"
              >
                abutalha.xyz <ExternalLink size={13} />
              </a>

              <a
                href="https://talhabyteit.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="tk-link"
              >
                Talhabyte IT <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* ================= TRANSPARENCY ================= */}
        <section className="tk-note">
          <h3 className="tk-note-title">
            <Info size={20} />
            তথ্যের উৎস, নির্ভুলতা ও দায়মুক্তি
          </h3>

          <p className="tk-note-p">
            TrainKoi একটি স্বাধীন তথ্য ও ট্র্যাকিং প্ল্যাটফর্ম এবং বাংলাদেশ
            রেলওয়ে, রেলপথ মন্ত্রণালয় বা অন্য কোনো সরকারি প্রতিষ্ঠানের অফিসিয়াল
            website নয়। প্ল্যাটফর্মে প্রকাশিত সময়সূচী, রুট, স্টেশন বা tracking
            information পরিবর্তিত হতে পারে। প্রযুক্তিগত সমস্যা, data update delay,
            railway operation বা অন্যান্য কারণে কোনো তথ্য সাময়িকভাবে অসম্পূর্ণ বা
            পুরোনো হতে পারে।
          </p>

          <p className="tk-note-p">
            তাই টিকিট, ভাড়া, refund, ট্রেন বাতিল, গুরুত্বপূর্ণ যাত্রা বা অন্য কোনো
            সিদ্ধান্তের ক্ষেত্রে সংশ্লিষ্ট বাংলাদেশ রেলওয়ে কর্তৃপক্ষের সর্বশেষ
            অফিসিয়াল তথ্যকে অগ্রাধিকার দেওয়া উচিত।
          </p>
        </section>

        {/* ================= USER SAFETY ================= */}
        <section className="tk-card">
          <div className="tk-safety-head">
            <ShieldCheck color="#005a43" size={27} />
            <h2 className="tk-safety-title">যাত্রীদের জন্য আমাদের পরামর্শ</h2>
          </div>

          <p className="tk-safety-text">
            TrainKoi ব্যবহার করার সময় ব্যবহারকারীদের নিজেদের ভ্রমণের জন্য পর্যাপ্ত
            প্রস্তুতি নেওয়ার পরামর্শ দেওয়া হচ্ছে। ট্রেনের নির্ধারিত সময়, টিকিটের
            তথ্য, প্ল্যাটফর্ম, আবহাওয়া এবং সংশ্লিষ্ট স্টেশনের সর্বশেষ ঘোষণা যাচাই
            করুন। লাইভ ট্র্যাকিং থাকলেও সেটিকে সহায়ক তথ্য হিসেবে বিবেচনা করুন এবং
            জরুরি পরিস্থিতিতে রেলওয়ে কর্মী বা সংশ্লিষ্ট কর্তৃপক্ষের নির্দেশনা
            অনুসরণ করুন।
          </p>
        </section>

        {/* ================= VISION ================= */}
        <section className="tk-vision">
          <div className="tk-vision-icon">
            <Target size={27} color="#005a43" />
          </div>

          <h2 className="tk-vision-title">আমাদের দীর্ঘমেয়াদী লক্ষ্য</h2>

          <p className="tk-vision-text">
            প্রযুক্তির মাধ্যমে বাংলাদেশে রেলভ্রমণ সম্পর্কিত তথ্যকে আরও সহজলভ্য,
            বোধগম্য ও ব্যবহারবান্ধব করে তোলা। TrainKoi এমন একটি digital railway
            information ecosystem তৈরি করতে চায় যেখানে একজন যাত্রী ট্রেনের
            সময়সূচী, রুট, স্টেশন, tracking এবং রেলভ্রমণ সম্পর্কিত দরকারি তথ্য সহজে
            খুঁজে পেতে পারেন।
          </p>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="tk-footer">
          <div className="tk-footer-icons">
            <Activity size={18} color="#005a43" />
            <ShieldCheck size={18} color="#005a43" />
            <Globe size={18} color="#005a43" />
          </div>

          <p className="tk-footer-text">
            <strong>TrainKoi™</strong> — Bangladesh Railway information, train
            schedule and tracking platform.
            <br />
            Developed and maintained by{' '}
            <a
              href="https://talhabyteit.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="tk-footer-link"
            >
              Talhabyte IT
            </a>{' '}
            — Founder:{' '}
            <a
              href="https://abutalha.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="tk-footer-link"
            >
              Md. Abu Talha Akash
            </a>
            <br />
            All Rights Reserved © 2026 TrainKoi.com
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutUs;
