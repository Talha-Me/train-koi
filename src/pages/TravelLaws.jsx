// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   ChevronLeft, ShieldAlert, Gavel, Scale, AlertTriangle, 
//   HelpCircle, ChevronDown, ChevronUp, Info, BookOpen, Clock, 
//   Luggage, CigaretteOff, UserCheck, PhoneCall, HeartHandshake, 
//   ShieldCheck, MapPin, Zap, Star, Search
// } from 'lucide-react';

// const TravelLaws = () => {
//   const navigate = useNavigate();
//   const [openFaq, setOpenFaq] = useState(null);

//   const toggleFaq = (index) => {
//     setOpenFaq(openFaq === index ? null : index);
//   };

//   const laws = [
//     {
//       id: 1,
//       title: "টিকিট ও যাত্রী সাধারণের বৈধ অধিকার",
//       desc: "বাংলাদেশ রেলওয়ে আইন ১৮৯০ এর ধারা ১১৩ অনুযায়ী, প্রতিটি যাত্রীর কাছে একটি বৈধ টিকিট (Physical or Digital) থাকতে হবে। অন্যের নামে কাটা টিকিট ব্যবহার করা আইনত অপরাধ।",
//       points: ["বিনা টিকিটে ভ্রমণে ভাড়ার দ্বিগুণ জরিমানাসহ কারাদণ্ড", "অনলাইন টিকিটের ক্ষেত্রে এনআইডি (NID) সাথে রাখা বাধ্যতামূলক", "৫-১২ বছর বয়সীদের জন্য অর্ধেক মূল্যের টিকিট প্রযোজ্য"],
//       icon: <Scale size={24} color="#006a4e" />
//     },
//     {
//       id: 2,
//       title: "রেলওয়ে নিরাপত্তা ও সম্পদ সুরক্ষা",
//       desc: "রেলওয়ে আইনের ১২৬ ধারা মতে, অকারণে বিপদ সংকেত বা চেইন ব্যবহার করলে ১ বছর জেল বা জরিমানা হতে পারে। ট্রেনের জানালায় পাথর মারা একটি জামিন অযোগ্য অপরাধ।",
//       points: ["পাথর নিক্ষেপ করলে ১০ হাজার টাকা জরিমানা ও ১০ বছর জেল", "ট্রেনের ইঞ্জিনে বা ছাদে ভ্রমণ সম্পূর্ণ নিষিদ্ধ", "রেললাইনের পাশে সেলফি তোলা বা ড্রোন ওড়ানো নিষিদ্ধ"],
//       icon: <ShieldAlert size={24} color="#006a4e" />
//     },
//     {
//       id: 3,
//       title: "লাগেজ ও পার্সেল বুকিং নীতিমালা",
//       desc: "যাত্রী তার সাথে নির্দিষ্ট সীমার অতিরিক্ত মালামাল বহন করলে তা 'ব্র্যাক ভ্যান' বা পার্সেল কোচে বুকিং দিতে হবে।",
//       points: ["এসি ক্লাসে ৫০ কেজি ও শোভন চেয়ারে ৩৫ কেজি পর্যন্ত ফ্রি লাগেজ", "দাহ্য পদার্থ বা গ্যাস সিলিন্ডার বহন করলে ৫ বছরের জেল", "পোষা প্রাণী (যেমন বিড়াল/পাখি) বহনের জন্য আলাদা পারমিট প্রয়োজন"],
//       icon: <Luggage size={24} color="#006a4e" />
//     }
//   ];

//   const faqs = [
//     { q: "টিকিট হারিয়ে গেলে বা নষ্ট হলে করণীয় কী?", a: "আপনার যদি অনলাইন কপি থাকে, তবে তা পুনরায় ডাউনলোড করে প্রিন্ট নিতে পারেন। টিকিট হারিয়ে গেলে অবিলম্বে নিকটস্থ স্টেশনের জিআরপি (GRP) থানায় জিডি করে দায়িত্বরত টিটিই-কে অবহিত করতে হবে।" },
//     { q: "ট্রেন কত মিনিট দেরি হলে টিকিট রিফান্ড পাওয়া যায়?", a: "যদি ট্রেন নির্ধারিত সময়ের চেয়ে ৪ ঘণ্টা বা তার বেশি দেরি করে, তবে যাত্রী কোনো চার্জ ছাড়াই টিকিটের পুরো টাকা রিফান্ড দাবি করতে পারেন।" },
//     { q: "ট্রেনে খাবারের অতিরিক্ত দাম নিলে কোথায় অভিযোগ দেব?", a: "প্রতিটি ট্রেনের ক্যাটারিং সার্ভিসে নির্ধারিত মূল্যের তালিকা থাকা বাধ্যতামূলক। অতিরিক্ত দাম নিলে ১৬১৩১ নাম্বারে কল করুন অথবা রেলওয়ের ফেসবুক পেজে ইনবক্স করুন।" },
//     { q: "মহিলা ও শিশুদের জন্য সিট সংরক্ষণের নিয়ম কী?", a: "আন্তঃনগর ট্রেনে প্রতিটি বগিতে নির্দিষ্ট সংখ্যক সিট মহিলাদের জন্য সংরক্ষিত থাকে। এছাড়াও বড় স্টেশনে মহিলাদের জন্য আলাদা ওয়েটিং রুম বা বিশ্রামের জায়গা রয়েছে।" },
//     { q: "ট্রেনে ব্ল্যাক টিকিট বা কালোবাজারি রুখতে আইন কী?", a: "রেলওয়ে আইন অনুযায়ী টিকিট কালোবাজারি করলে ৩ মাস থেকে ২ বছরের কারাদণ্ড হতে পারে। ট্রেনের ভেতরে টিটিই ব্যতীত অন্য কারো থেকে টিকিট কেনা দণ্ডনীয় অপরাধ।" }
//   ];

//   return (
//     <div style={{ backgroundColor: '#f0f4f3', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '80px' }}>
      
//       {/* Header with Glassmorphism Effect */}
//       <div style={{ background: '#006a4e', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
//         <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
//         <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>রেলওয়ে ভ্রমণ নির্দেশিকা ও গাইড</h3>
//       </div>

//       <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
        
//         {/* Massive SEO Title & Summary */}
//         <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '35px', marginBottom: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
//             <span style={{ backgroundColor: '#006a4e', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '12px' }}>PRO GUIDE 2026</span>
//           </div>
//           <h1 style={{ fontSize: '28px', color: '#006a4e', marginBottom: '20px', lineHeight: '1.3', fontWeight: '900' }}>
//             বাংলাদেশ রেলওয়ে নিরাপদ ভ্রমণ নীতিমালা ও যাত্রী অধিকারের পূর্ণাঙ্গ তালিকা
//           </h1>
//           <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8', textAlign: 'justify' }}>
//             আপনি কি <strong>Train Schedule</strong> বা <strong>Live Tracking</strong> সম্পর্কে জানতে আগ্রহী? কেবল সময় জানলেই ভ্রমণ নিরাপদ হয় না। <strong>ট্রেনকই (TrainKoi)</strong> আপনার জন্য নিয়ে এসেছে বাংলাদেশ রেলওয়ের ১৮৯০ সালের আইন থেকে শুরু করে বর্তমান সময়ের সকল ডিজিটাল নীতিমালা। ট্রেনের টিকিট রিফান্ড, লাগেজের নিয়ম এবং নিরাপত্তা বিধিনিষেধ সম্পর্কে বিস্তারিত জেনে আপনার যাত্রা নিশ্চিত করুন।
//           </p>
          
//           <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '25px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
//             <div style={{ textAlign: 'center' }}><Search size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>স্মার্ট সার্চ</p></div>
//             <div style={{ textAlign: 'center' }}><Star size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>ভেরিফাইড তথ্য</p></div>
//             <div style={{ textAlign: 'center' }}><Zap size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>রিয়েল-টাইম</p></div>
//           </div>
//         </div>

//         {/* Laws Grid */}
//         <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <Gavel size={22} color="#006a4e" /> গুরুত্বপূর্ণ আইনি বিধিমালা
//         </h2>

//         <div style={{ display: 'grid', gap: '20px' }}>
//           {laws.map((law) => (
//             <div key={law.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: '8px solid #006a4e' }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
//                 <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '18px' }}>{law.icon}</div>
//                 <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: 'bold' }}>{law.title}</h3>
//               </div>
//               <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '15px' }}>{law.desc}</p>
//               <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '15px' }}>
//                 {law.points.map((p, i) => (
//                   <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#2d3748', marginBottom: '8px', alignItems: 'flex-start' }}>
//                     <ShieldCheck size={16} color="#006a4e" style={{ marginTop: '2px', flexShrink: 0 }} />
//                     <span>{p}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pro-Tips SEO Article Section */}
//         <div style={{ margin: '40px 0', background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '30px', borderRadius: '35px', color: 'white' }}>
//           <h3 style={{ fontSize: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//              <Info size={24} color="#2ecc71" /> প্রো-টিপস: ট্রেনের সিট ম্যাপ ও সুবিধা
//           </h3>
//           <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.95 }}>
//             আপনার কি জানেন? প্রতিটি আন্তঃনগর ট্রেনের 'খ' বা 'গ' বগিতে সাধারণত প্রতিবন্ধী ও বয়স্কদের জন্য অতিরিক্ত সুবিধা থাকে। এসি সিট বা স্নিগ্ধা কোচে মোবাইল চার্জিং পোর্ট এবং রিডিং লাইট ফ্রি ব্যবহারের সুবিধা পাওয়া যায়। এছাড়াও 'পাওয়ার কার' বগিতে নামাজের জন্য নির্দিষ্ট স্থান থাকে। এই ধরণের ক্ষুদ্র তথ্য আপনার দীর্ঘ ভ্রমণকে আরও আরামদায়ক করতে পারে।
//           </p>
//         </div>

//         {/* Optimized FAQ Section */}
//         <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
//           <HelpCircle size={22} color="#006a4e" /> সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
//         </h2>

//         {faqs.map((faq, index) => (
//           <div key={index} style={{ backgroundColor: 'white', borderRadius: '22px', marginBottom: '15px', overflow: 'hidden', border: '1px solid #edf2f7' }}>
//             <div 
//               onClick={() => toggleFaq(index)}
//               style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: openFaq === index ? '#f8fafc' : 'white' }}
//             >
//               <span style={{ fontSize: '15px', fontWeight: '700', color: openFaq === index ? '#006a4e' : '#2d3748', flex: 1 }}>{faq.q}</span>
//               {openFaq === index ? <ChevronUp size={20} color="#006a4e" /> : <ChevronDown size={20} color="#666" />}
//             </div>
//             {openFaq === index && (
//               <div style={{ padding: '0 20px 20px 20px', fontSize: '14px', color: '#4a5568', lineHeight: '1.7', borderTop: '1px solid #f1f5f9' }}>
//                 <div style={{ marginTop: '15px' }}>{faq.a}</div>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Urgent Emergency SEO Box */}
//         <div style={{ marginTop: '40px', background: '#1e293b', padding: '35px', borderRadius: '40px', color: 'white', textAlign: 'center', border: '2px solid #006a4e' }}>
//           <div style={{ backgroundColor: '#006a4e', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
//             <PhoneCall size={30} />
//           </div>
//           <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>রেলওয়ে হেল্পলাইন ও সাপোর্ট</h3>
//           <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '25px' }}>
//             যাত্রাপথে কোনো অনিয়ম দেখলে বা জীবন বিপন্ন হলে দ্রুত এই নাম্বারে যোগাযোগ করুন। আপনার সচেতনতা অন্যের প্রাণ বাঁচাতে পারে।
//           </p>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
//             <a href="tel:16131" style={{ backgroundColor: 'white', color: '#006a4e', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>১৬১৩১ (রেলওয়ে)</a>
//             <a href="tel:999" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>৯৯৯ (জরুরী)</a>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default TravelLaws;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldAlert, Gavel, Scale, AlertTriangle, 
  HelpCircle, ChevronDown, ChevronUp, Info, BookOpen, Clock, 
  Luggage, CigaretteOff, UserCheck, PhoneCall, HeartHandshake, 
  ShieldCheck, MapPin, Zap, Star, Search
} from 'lucide-react';

const TravelLaws = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const laws = [
    {
      id: 1,
      title: "টিকিট, ভাড়া ও যাত্রীর বৈধ অধিকার",
      desc: "বাংলাদেশ রেলওয়েতে ভ্রমণের সময় যাত্রীর কাছে বৈধ টিকিট বা প্রযোজ্য ভ্রমণ অনুমতিপত্র থাকা অত্যন্ত গুরুত্বপূর্ণ। অনলাইন ও কাউন্টার থেকে কেনা টিকিটের ক্ষেত্রে টিকিটের তথ্য, যাত্রীর পরিচয় এবং নির্ধারিত ট্রেন ও শ্রেণির তথ্য সঠিকভাবে যাচাই করে নেওয়া উচিত।",
      points: [
        "ভ্রমণের আগে টিকিটের তারিখ, ট্রেনের নাম, যাত্রার স্টেশন ও গন্তব্য যাচাই করুন",
        "অনলাইন টিকিটের ক্ষেত্রে প্রয়োজনীয় পরিচয়পত্র ও টিকিটের তথ্য সঙ্গে রাখুন",
        "অন্য ব্যক্তির নামে ইস্যু করা টিকিট ব্যবহার করার আগে প্রযোজ্য নিয়ম যাচাই করুন",
        "বিনা টিকিটে বা অনিয়মিতভাবে ভ্রমণ করলে রেলওয়ের প্রচলিত আইন ও বিধি অনুযায়ী ব্যবস্থা নেওয়া হতে পারে"
      ],
      icon: <Scale size={24} color="#006a4e" />
    },
    {
      id: 2,
      title: "রেলওয়ে নিরাপত্তা ও সম্পদ সুরক্ষা",
      desc: "রেললাইন, সিগন্যাল, ট্রেন, স্টেশন এবং রেলওয়ের অবকাঠামো যাত্রী ও জনসাধারণের নিরাপত্তার সঙ্গে সরাসরি সম্পর্কিত। রেললাইনে ওঠা, চলন্ত ট্রেন থেকে ঝুঁকিপূর্ণভাবে নামা বা ট্রেনের নিরাপত্তা ব্যবস্থা নিয়ে খেলাধুলা করা অত্যন্ত বিপজ্জনক।",
      points: [
        "চলন্ত ট্রেনের দরজায় দাঁড়ানো বা ঝুঁকিপূর্ণভাবে যাতায়াত করা থেকে বিরত থাকুন",
        "রেললাইন পার হওয়ার সময় নির্ধারিত ফুটওভার ব্রিজ, আন্ডারপাস বা বৈধ পথ ব্যবহার করুন",
        "ট্রেনে বা রেললাইনের দিকে পাথর, বোতল বা কোনো বস্তু নিক্ষেপ করবেন না",
        "রেলওয়ের সিগন্যাল, বৈদ্যুতিক ব্যবস্থা বা অন্যান্য অবকাঠামো ক্ষতিগ্রস্ত করা থেকে বিরত থাকুন"
      ],
      icon: <ShieldAlert size={24} color="#006a4e" />
    },
    {
      id: 3,
      title: "লাগেজ, ব্যাগ ও পার্সেল বহনের নিয়ম",
      desc: "ট্রেনে ভ্রমণের সময় ব্যক্তিগত ব্যাগ ও লাগেজ বহনের ক্ষেত্রে নির্ধারিত নিয়ম মেনে চলা উচিত। অতিরিক্ত, ভারী বা বিশেষ ধরনের পণ্য বহনের ক্ষেত্রে সংশ্লিষ্ট রেলওয়ে কর্তৃপক্ষের নিয়ম এবং পার্সেল বুকিং ব্যবস্থা সম্পর্কে আগে থেকে জেনে নেওয়া নিরাপদ।",
      points: [
        "ভ্রমণের আগে আপনার লাগেজের পরিমাণ ও ওজন সম্পর্কে সংশ্লিষ্ট শ্রেণির নিয়ম যাচাই করুন",
        "অতিরিক্ত মালামালের ক্ষেত্রে প্রযোজ্য চার্জ বা পার্সেল বুকিংয়ের নিয়ম অনুসরণ করুন",
        "দাহ্য, বিস্ফোরক বা ঝুঁকিপূর্ণ বস্তু ট্রেনে বহনের আগে অবশ্যই সংশ্লিষ্ট নিয়ম যাচাই করুন",
        "অন্য যাত্রীর অজানা কোনো ব্যাগ বা পার্সেল নিজের নামে বহন করবেন না"
      ],
      icon: <Luggage size={24} color="#006a4e" />
    },
    {
      id: 4,
      title: "ধূমপান ও জনসাধারণের নিরাপত্তা",
      desc: "রেলভ্রমণে নিজের পাশাপাশি অন্যান্য যাত্রীদের নিরাপত্তা ও স্বাচ্ছন্দ্যের বিষয়টিও গুরুত্বপূর্ণ। ট্রেনের নির্ধারিত নিষিদ্ধ এলাকায় ধূমপান বা এমন কোনো কাজ করা উচিত নয় যা অন্য যাত্রীর স্বাস্থ্য ও নিরাপত্তাকে ঝুঁকিতে ফেলে।",
      points: [
        "ট্রেনের নিষিদ্ধ এলাকায় ধূমপান থেকে বিরত থাকুন",
        "শিশু, বয়স্ক ও অসুস্থ যাত্রীদের কথা বিবেচনা করুন",
        "ট্রেনের ভেতরে আগুন বা আগুনের উৎস ব্যবহার করবেন না",
        "ধূমপান সংক্রান্ত অভিযোগ থাকলে ট্রেনের দায়িত্বরত কর্মীকে জানান"
      ],
      icon: <CigaretteOff size={24} color="#006a4e" />
    },
    {
      id: 5,
      title: "নারী, শিশু, বয়স্ক ও বিশেষ চাহিদাসম্পন্ন যাত্রী",
      desc: "রেলভ্রমণে নারী, শিশু, বয়স্ক ব্যক্তি এবং বিশেষ চাহিদাসম্পন্ন যাত্রীদের নিরাপত্তা ও সুবিধাকে গুরুত্ব দেওয়া উচিত। নির্ধারিত আসন বা বিশেষ সুবিধা থাকলে সংশ্লিষ্ট কোচ ও স্টেশন নির্দেশনা অনুসরণ করা প্রয়োজন।",
      points: [
        "সংরক্ষিত আসনের ক্ষেত্রে সংশ্লিষ্ট যাত্রীর অধিকারকে সম্মান করুন",
        "বয়স্ক ও বিশেষ চাহিদাসম্পন্ন যাত্রীকে প্রয়োজনে ওঠানামায় সহায়তা করুন",
        "শিশুদের চলন্ত ট্রেনে একা বা ঝুঁকিপূর্ণ অবস্থায় রাখবেন না",
        "কোনো হয়রানি বা নিরাপত্তা সমস্যা হলে দ্রুত দায়িত্বরত কর্মীকে জানান"
      ],
      icon: <UserCheck size={24} color="#006a4e" />
    },
    {
      id: 6,
      title: "স্টেশন ও রেললাইনে নিরাপত্তা",
      desc: "রেলস্টেশন শুধুমাত্র ট্রেনে ওঠার জায়গা নয়; এখানে প্ল্যাটফর্ম, রেললাইন, সিগন্যাল এবং চলন্ত ট্রেনের কারণে বিশেষ সতর্কতা প্রয়োজন। প্ল্যাটফর্মে অপেক্ষা করার সময় নিরাপদ দূরত্ব বজায় রাখা জরুরি।",
      points: [
        "ট্রেন আসা বা যাওয়ার সময় প্ল্যাটফর্মের নিরাপদ অংশে অবস্থান করুন",
        "রেললাইনের ওপর দিয়ে হাঁটবেন না",
        "ট্রেন আসার সময় ছবি বা ভিডিও করতে গিয়ে ঝুঁকিপূর্ণ অবস্থানে যাবেন না",
        "স্টেশনের নিরাপত্তা নির্দেশনা ও ঘোষণা অনুসরণ করুন"
      ],
      icon: <MapPin size={24} color="#006a4e" />
    }
  ];

  const faqs = [
    {
      q: "ট্রেনে ভ্রমণের আগে কোন বিষয়গুলো যাচাই করা উচিত?",
      a: "ভ্রমণের আগে টিকিটের তারিখ, ট্রেনের নাম ও নম্বর, যাত্রার স্টেশন, গন্তব্য, কোচ ও আসনের তথ্য যাচাই করুন। প্রয়োজনে ট্রেনের সর্বশেষ সময়সূচী ও চলাচলের অবস্থা দেখে পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছানো ভালো।"
    },
    {
      q: "টিকিট হারিয়ে গেলে বা নষ্ট হলে কী করণীয়?",
      a: "টিকিট হারিয়ে গেলে বা ক্ষতিগ্রস্ত হলে দ্রুত সংশ্লিষ্ট স্টেশন বা রেলওয়ে কর্তৃপক্ষের সঙ্গে যোগাযোগ করুন। অনলাইন টিকিট হলে আপনার অ্যাকাউন্ট, ই-মেইল বা সংশ্লিষ্ট টিকিটিং সিস্টেম থেকে তথ্য পুনরুদ্ধারের সুযোগ আছে কি না যাচাই করুন। নিজের সিদ্ধান্তে একই টিকিটের পরিবর্তে নতুন টিকিট বা অন্য কোনো ব্যবস্থা নেওয়ার আগে কর্তৃপক্ষের নির্দেশনা নিন।"
    },
    {
      q: "অনলাইন ট্রেন টিকিটের সঙ্গে পরিচয়পত্র রাখা কি জরুরি?",
      a: "অনলাইন টিকিট ব্যবহারের ক্ষেত্রে টিকিটে দেওয়া যাত্রীর তথ্যের সঙ্গে পরিচয়পত্রের তথ্য মিলিয়ে দেখা হতে পারে। তাই নিরাপদ থাকার জন্য টিকিট বুকিংয়ের সময় ব্যবহৃত বৈধ পরিচয়পত্র সঙ্গে রাখা এবং টিকিটের তথ্য সঠিক রাখা উচিত।"
    },
    {
      q: "ট্রেন দেরি করলে কী করা উচিত?",
      a: "ট্রেন দেরি হলে স্টেশনের ঘোষণা, সংশ্লিষ্ট রেলওয়ে কর্তৃপক্ষের তথ্য এবং উপলব্ধ ট্রেন ট্র্যাকিং তথ্য যাচাই করুন। ট্রেনের বিলম্বের কারণে যাত্রার পরিকল্পনা পরিবর্তন করতে হলে সংশ্লিষ্ট কর্তৃপক্ষের কাছ থেকে প্রযোজ্য নিয়ম জেনে নিন।"
    },
    {
      q: "ট্রেনের লাইভ লোকেশন কি সবসময় ১০০% নির্ভুল?",
      a: "কোনো অনলাইন ট্র্যাকিং তথ্যকে সব পরিস্থিতিতে শতভাগ নির্ভুল ধরে নেওয়া উচিত নয়। নেটওয়ার্ক, ডেটা আপডেট, সিগন্যাল, রেলওয়ে অপারেশন এবং অন্যান্য কারণে অবস্থানের তথ্য কিছুটা দেরিতে আপডেট হতে পারে। তাই গুরুত্বপূর্ণ যাত্রায় অফিসিয়াল ঘোষণা ও স্টেশন তথ্যও বিবেচনা করুন।"
    },
    {
      q: "ট্রেনের সময়সূচী পরিবর্তন হতে পারে কি?",
      a: "হ্যাঁ। রেলওয়ে পরিচালনাগত কারণ, আবহাওয়া, সিগন্যালিং সমস্যা, দুর্ঘটনা, রক্ষণাবেক্ষণ বা অন্যান্য পরিস্থিতির কারণে বাস্তব যাত্রার সময় নির্ধারিত সময়সূচী থেকে পরিবর্তিত হতে পারে। তাই দীর্ঘ যাত্রার আগে সর্বশেষ তথ্য যাচাই করা ভালো।"
    },
    {
      q: "ট্রেনে অতিরিক্ত লাগেজ নিয়ে ভ্রমণ করা যাবে?",
      a: "লাগেজ বহনের ক্ষেত্রে ট্রেনের শ্রেণি ও সংশ্লিষ্ট রেলওয়ে নিয়ম প্রযোজ্য হতে পারে। অতিরিক্ত বা বড় আকারের মালামাল থাকলে আগে থেকেই পার্সেল বা লাগেজ সংক্রান্ত নিয়ম এবং প্রযোজ্য চার্জ সম্পর্কে স্টেশন কর্তৃপক্ষের কাছ থেকে তথ্য নেওয়া উচিত।"
    },
    {
      q: "ট্রেনে দাহ্য বা বিপজ্জনক বস্তু বহন করা যাবে?",
      a: "দাহ্য, বিস্ফোরক, বিষাক্ত বা অন্য কোনো ঝুঁকিপূর্ণ বস্তু বহনের ওপর কঠোর বিধিনিষেধ থাকতে পারে। নিরাপত্তার স্বার্থে এ ধরনের কোনো বস্তু ট্রেনে নেওয়ার আগে অবশ্যই সংশ্লিষ্ট রেলওয়ে কর্তৃপক্ষের অনুমোদিত নিয়ম যাচাই করুন। সন্দেহ থাকলে বস্তুটি সঙ্গে না নেওয়াই নিরাপদ।"
    },
    {
      q: "ট্রেনে ধূমপান করা যায়?",
      a: "যেখানে ধূমপান নিষিদ্ধ সেখানে ধূমপান করা উচিত নয়। ট্রেনে শিশু, বয়স্ক ও অসুস্থ যাত্রী থাকতে পারেন। তাই অন্য যাত্রীদের স্বাস্থ্য ও নিরাপত্তার কথা বিবেচনা করে রেলওয়ের ধূমপান সংক্রান্ত নির্দেশনা মেনে চলুন।"
    },
    {
      q: "রেললাইনের ওপর দিয়ে হাঁটা কি নিরাপদ?",
      a: "না। রেললাইন দিয়ে হাঁটা অত্যন্ত ঝুঁকিপূর্ণ। ট্রেনের গতি, শব্দ ও দৃষ্টিসীমার কারণে দুর্ঘটনার সম্ভাবনা থাকে। রেললাইন পার হওয়ার প্রয়োজনে নির্ধারিত ফুটওভার ব্রিজ, আন্ডারপাস বা অনুমোদিত পারাপারের পথ ব্যবহার করুন।"
    },
    {
      q: "চলন্ত ট্রেনের দরজায় দাঁড়ানো উচিত কি?",
      a: "না। চলন্ত ট্রেনের দরজায় দাঁড়ানো বা শরীরের কোনো অংশ বাইরে রাখা অত্যন্ত ঝুঁকিপূর্ণ। দরজা দিয়ে ওঠানামার সময় ট্রেন সম্পূর্ণভাবে থামা পর্যন্ত অপেক্ষা করুন এবং নিরাপদভাবে কোচে অবস্থান করুন।"
    },
    {
      q: "ট্রেনে কোনো সমস্যা হলে কাকে জানাব?",
      a: "ট্রেনে কোনো নিরাপত্তা সমস্যা, অসুস্থতা, হয়রানি, সন্দেহজনক বস্তু বা অন্য কোনো জরুরি পরিস্থিতি দেখা দিলে কাছাকাছি থাকা ট্রেনের কর্মী বা দায়িত্বরত কর্মকর্তাকে জানান। গুরুতর জরুরি অবস্থায় জাতীয় জরুরি সেবা ৯৯৯-এ যোগাযোগ করা যেতে পারে।"
    },
    {
      q: "ট্রেনে কোনো যাত্রীর মালামাল চুরি হলে কী করবেন?",
      a: "চুরি বা হারিয়ে যাওয়ার ঘটনা ঘটলে যত দ্রুত সম্ভব ট্রেনের দায়িত্বরত কর্মী এবং সংশ্লিষ্ট স্টেশন কর্তৃপক্ষকে জানান। প্রয়োজন হলে আইনশৃঙ্খলা রক্ষাকারী বাহিনীর সহায়তা নিন এবং গুরুত্বপূর্ণ কাগজপত্র বা পরিচয়পত্র হারিয়ে গেলে দ্রুত প্রয়োজনীয় ব্যবস্থা গ্রহণ করুন।"
    },
    {
      q: "ট্রেনে কোনো সন্দেহজনক ব্যাগ দেখলে কী করা উচিত?",
      a: "সন্দেহজনক কোনো ব্যাগ বা বস্তু দেখলে নিজে সেটি খোলা, সরানো বা পরীক্ষা করার চেষ্টা করবেন না। আশপাশের যাত্রীদের নিরাপদ দূরত্বে রাখুন এবং দ্রুত ট্রেনের কর্মী বা নিরাপত্তা সংশ্লিষ্ট ব্যক্তিকে বিষয়টি জানান। জরুরি পরিস্থিতিতে ৯৯৯-এ যোগাযোগ করা যেতে পারে।"
    },
    {
      q: "ট্রেনে নারী বা কোনো যাত্রী হয়রানির শিকার হলে কী করা উচিত?",
      a: "হয়রানি বা অনিরাপদ পরিস্থিতি দেখা দিলে নীরব না থেকে ট্রেনের দায়িত্বরত কর্মীকে জানান। পরিস্থিতি গুরুতর হলে আইনশৃঙ্খলা রক্ষাকারী বাহিনীর সহায়তা নেওয়া উচিত। সম্ভব হলে নিরাপদ স্থানে অবস্থান করুন এবং নিজের নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দিন।"
    },
    {
      q: "ট্রেনের ভেতরে খাবার কিনলে কী কী খেয়াল রাখা উচিত?",
      a: "খাবার কেনার সময় মূল্য, খাবারের মান এবং বিক্রেতার পরিচয় সম্পর্কে সচেতন থাকুন। নির্ধারিত মূল্যের তুলনায় অতিরিক্ত মূল্য দাবি করা হলে মূল্য তালিকা বা রসিদ সম্পর্কে জিজ্ঞাসা করুন এবং প্রয়োজনে সংশ্লিষ্ট ট্রেন বা স্টেশন কর্তৃপক্ষের কাছে অভিযোগ জানান।"
    },
    {
      q: "ট্রেনের টিকিট কালোবাজারি সম্পর্কে কী করা উচিত?",
      a: "টিকিট কালোবাজারি বা প্রতারণামূলক বিক্রয় দেখতে পেলে নিজে ঝুঁকিপূর্ণভাবে জড়িয়ে না পড়ে সংশ্লিষ্ট স্টেশন কর্তৃপক্ষ বা আইনশৃঙ্খলা রক্ষাকারী বাহিনীকে তথ্য দিন। অপরিচিত ব্যক্তির কাছ থেকে অনানুষ্ঠানিকভাবে টিকিট কেনার ক্ষেত্রে প্রতারণার ঝুঁকি থাকতে পারে।"
    },
    {
      q: "শিশুদের নিয়ে ট্রেনে ভ্রমণের সময় কীভাবে সতর্ক থাকব?",
      a: "শিশুকে সবসময় অভিভাবকের কাছাকাছি রাখুন। প্ল্যাটফর্মের কিনারা, দরজা, সিঁড়ি ও ভিড়ের জায়গায় বিশেষ সতর্ক থাকুন। শিশুর ব্যাগ বা পোশাকে অভিভাবকের যোগাযোগের তথ্য রাখলে জরুরি পরিস্থিতিতে সহায়তা পাওয়া সহজ হতে পারে।"
    },
    {
      q: "বয়স্ক যাত্রীর জন্য ট্রেন ভ্রমণে কী প্রস্তুতি নেওয়া উচিত?",
      a: "যাত্রার আগে ট্রেনের সময়সূচী, স্টেশন এবং কোচের অবস্থান সম্পর্কে ধারণা নিন। পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছান এবং ওঠানামার সময় প্রয়োজনীয় সহায়তা নিশ্চিত করুন। দীর্ঘ যাত্রায় ওষুধ বা জরুরি প্রয়োজনীয় সামগ্রী সঙ্গে রাখুন।"
    },
    {
      q: "ট্রেনকই-এর তথ্য কি বাংলাদেশ রেলওয়ের অফিসিয়াল তথ্য?",
      a: "ট্রেনকই একটি স্বাধীন তথ্য ও ট্র্যাকিং প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ের কোনো সরকারি অঙ্গপ্রতিষ্ঠান নয়। তাই গুরুত্বপূর্ণ যাত্রা, টিকিট, রিফান্ড বা কোনো আইনি বিষয়ে সর্বশেষ অফিসিয়াল তথ্যের জন্য সংশ্লিষ্ট বাংলাদেশ রেলওয়ে কর্তৃপক্ষের নির্দেশনাকে অগ্রাধিকার দেওয়া উচিত।"
    }
  ];

  return (
    <div style={{ backgroundColor: '#f0f4f3', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '80px' }}>
      
      {/* Header with Glassmorphism Effect */}
      <div style={{ background: '#006a4e', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>রেলওয়ে ভ্রমণ নির্দেশিকা ও গাইড</h3>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
        
        {/* Massive SEO Title & Summary */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '35px', marginBottom: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <span style={{ backgroundColor: '#006a4e', color: 'white', padding: '5px 12px', borderRadius: '50px', fontSize: '12px' }}>PRO GUIDE 2026</span>
          </div>

          <h1 style={{ fontSize: '28px', color: '#006a4e', marginBottom: '20px', lineHeight: '1.3', fontWeight: '900' }}>
            বাংলাদেশ রেলওয়ে নিরাপদ ভ্রমণ নীতিমালা, ট্রেনের নিয়ম ও যাত্রী অধিকারের পূর্ণাঙ্গ গাইড
          </h1>

          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8', textAlign: 'justify' }}>
            বাংলাদেশে প্রতিদিন হাজার হাজার মানুষ আন্তঃনগর, মেইল, কমিউটার ও বিভিন্ন ধরনের ট্রেনে
            এক জেলা থেকে অন্য জেলায় যাতায়াত করেন। ট্রেনে ভ্রমণের আগে শুধু <strong>Train Schedule</strong>
            বা <strong>Live Train Tracking</strong> জানা যথেষ্ট নয়; টিকিট, লাগেজ, স্টেশন নিরাপত্তা,
            যাত্রীদের দায়িত্ব, ট্রেনের ভেতরের আচরণ এবং জরুরি পরিস্থিতিতে করণীয় সম্পর্কেও ধারণা থাকা
            গুরুত্বপূর্ণ। <strong>ট্রেনকই (TrainKoi)</strong> এই গাইডে বাংলাদেশ রেলওয়েতে নিরাপদ ও
            সচেতনভাবে ভ্রমণের জন্য প্রয়োজনীয় বিভিন্ন বিষয় সহজ ভাষায় তুলে ধরেছে।
          </p>

          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8', textAlign: 'justify', marginTop: '15px' }}>
            এই পেজে আপনি ট্রেনের টিকিট ও যাত্রী অধিকার, বাংলাদেশ রেলওয়ে ভ্রমণ নিয়ম, ট্রেনের নিরাপত্তা,
            লাগেজ বহনের সাধারণ নির্দেশনা, রেলস্টেশনে নিরাপত্তা, নারী ও শিশুদের নিরাপত্তা, ট্রেন বিলম্ব,
            ট্রেন ট্র্যাকিং, জরুরি যোগাযোগ এবং যাত্রীদের সাধারণ প্রশ্নের উত্তর সম্পর্কে বিস্তারিত তথ্য
            পাবেন। যেকোনো গুরুত্বপূর্ণ বা আইনসংক্রান্ত সিদ্ধান্ত নেওয়ার আগে সর্বশেষ সরকারি নির্দেশনা
            যাচাই করা উচিত।
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '25px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <Search size={22} color="#006a4e"/>
              <p style={{ fontSize: '11px', marginTop: '5px' }}>সহজ তথ্য অনুসন্ধান</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Star size={22} color="#006a4e"/>
              <p style={{ fontSize: '11px', marginTop: '5px' }}>তথ্যভিত্তিক গাইড</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Zap size={22} color="#006a4e"/>
              <p style={{ fontSize: '11px', marginTop: '5px' }}>দ্রুত আপডেট</p>
            </div>
          </div>
        </div>

        {/* Laws Grid */}
        <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gavel size={22} color="#006a4e" /> গুরুত্বপূর্ণ রেলওয়ে নিয়ম ও নিরাপত্তা নির্দেশনা
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {laws.map((law) => (
            <div key={law.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: '8px solid #006a4e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '18px' }}>
                  {law.icon}
                </div>

                <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: 'bold' }}>
                  {law.title}
                </h3>
              </div>

              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '15px' }}>
                {law.desc}
              </p>

              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '15px' }}>
                {law.points.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#2d3748', marginBottom: '8px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={16} color="#006a4e" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Article Section 1 */}
        <div style={{ margin: '40px 0', backgroundColor: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '20px', color: '#006a4e', marginBottom: '15px' }}>
            ট্রেনে নিরাপদ ভ্রমণের জন্য যাত্রীর করণীয়
          </h2>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify' }}>
            একটি নিরাপদ রেলভ্রমণের জন্য শুধু টিকিট কেনাই যথেষ্ট নয়। যাত্রার আগে ট্রেনের সময়সূচী,
            স্টেশনে পৌঁছানোর সময়, কোচ ও আসনের তথ্য এবং প্রয়োজনীয় পরিচয়পত্র সম্পর্কে নিশ্চিত হওয়া
            উচিত। স্টেশনে পৌঁছে নির্ধারিত প্ল্যাটফর্মে অবস্থান করুন এবং ট্রেন আসা ও যাওয়ার সময়
            নিরাপদ দূরত্ব বজায় রাখুন। ভিড়ের সময় শিশু, বয়স্ক ও পরিবারের সদস্যদের বিশেষভাবে
            নজরে রাখা গুরুত্বপূর্ণ।
          </p>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '15px' }}>
            চলন্ত ট্রেনে দরজায় দাঁড়ানো, রেললাইনে হাঁটা, ট্রেনের ছাদে ওঠা বা ট্রেনের বাইরে শরীরের
            কোনো অংশ বের করে ছবি তোলা অত্যন্ত ঝুঁকিপূর্ণ। সামাজিক যোগাযোগমাধ্যমের জন্য ছবি বা ভিডিও
            তৈরি করার সময় নিজের এবং অন্য যাত্রীদের নিরাপত্তাকে কখনোই ঝুঁকির মধ্যে ফেলা উচিত নয়।
          </p>
        </div>

        {/* Pro-Tips SEO Article Section */}
        <div style={{ margin: '40px 0', background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '30px', borderRadius: '35px', color: 'white' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Info size={24} color="#2ecc71" /> প্রো-টিপস: ট্রেনের সিট, কোচ ও যাত্রা পরিকল্পনা
          </h3>

          <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.95 }}>
            ট্রেনে দীর্ঘ ভ্রমণের ক্ষেত্রে যাত্রার আগে আপনার কোচ নম্বর, আসন নম্বর এবং ওঠার স্টেশন
            সম্পর্কে পরিষ্কার ধারণা রাখা ভালো। স্টেশনে পৌঁছে শেষ মুহূর্তে কোচ খুঁজতে গেলে ভিড়ের কারণে
            সমস্যা হতে পারে। তাই পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছানো এবং প্ল্যাটফর্মের ডিসপ্লে,
            ঘোষণা ও সংশ্লিষ্ট কর্মীদের নির্দেশনা অনুসরণ করা নিরাপদ।
          </p>

          <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.95, marginTop: '15px' }}>
            দীর্ঘ যাত্রায় পানি, প্রয়োজনীয় ওষুধ, চার্জার, পরিচয়পত্র এবং গুরুত্বপূর্ণ ব্যক্তিগত
            সামগ্রী সঙ্গে রাখুন। তবে অপরিচিত ব্যক্তির দেওয়া কোনো প্যাকেট বা ব্যাগ বহন করবেন না এবং
            নিজের লাগেজও সবসময় নিজের নিয়ন্ত্রণে রাখুন।
          </p>
        </div>

        {/* SEO Article Section 2 */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '30px', marginBottom: '40px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '20px', color: '#006a4e', marginBottom: '15px' }}>
            ট্রেনের সময়সূচী ও লাইভ ট্র্যাকিং ব্যবহারের সঠিক উপায়
          </h2>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify' }}>
            বাংলাদেশ রেলওয়ের ট্রেনের সময়সূচী যাত্রা পরিকল্পনার অন্যতম গুরুত্বপূর্ণ অংশ। কোনো ট্রেনের
            নির্ধারিত ছাড়ার সময় এবং পৌঁছানোর সময় জানা থাকলে যাত্রী সহজে তার দিনের পরিকল্পনা করতে
            পারেন। তবে নির্ধারিত সময়কে সবসময় বাস্তব পৌঁছানোর সময় হিসেবে ধরে নেওয়া উচিত নয়।
            রেলপথের পরিস্থিতি, সিগন্যাল, স্টেশন ব্যবস্থাপনা, আবহাওয়া বা অন্যান্য কারণে ট্রেন দেরি
            করতে পারে।
          </p>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '15px' }}>
            এই কারণে <strong>লাইভ ট্রেন ট্র্যাকিং</strong> বা ট্রেনের বর্তমান অবস্থানের তথ্য যাত্রীদের
            জন্য সহায়ক হতে পারে। ট্রেনকই-এর মতো ট্র্যাকিং প্ল্যাটফর্ম ব্যবহার করার সময় মনে রাখতে হবে,
            অনলাইন ডেটা আপডেট হতে কিছুটা সময় লাগতে পারে। তাই গুরুত্বপূর্ণ যাত্রায় ট্র্যাকিং তথ্যের
            পাশাপাশি স্টেশন ঘোষণা এবং প্রাসঙ্গিক অফিসিয়াল তথ্যও বিবেচনা করা উচিত।
          </p>
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HelpCircle size={22} color="#006a4e" /> সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h2>

        {faqs.map((faq, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '22px', marginBottom: '15px', overflow: 'hidden', border: '1px solid #edf2f7' }}>
            <div 
              onClick={() => toggleFaq(index)}
              style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: openFaq === index ? '#f8fafc' : 'white' }}
            >
              <span style={{ fontSize: '15px', fontWeight: '700', color: openFaq === index ? '#006a4e' : '#2d3748', flex: 1 }}>
                {faq.q}
              </span>

              {openFaq === index 
                ? <ChevronUp size={20} color="#006a4e" /> 
                : <ChevronDown size={20} color="#666" />
              }
            </div>

            {openFaq === index && (
              <div style={{ padding: '0 20px 20px 20px', fontSize: '14px', color: '#4a5568', lineHeight: '1.7', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ marginTop: '15px' }}>{faq.a}</div>
              </div>
            )}
          </div>
        ))}

        {/* Final SEO Information */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '30px', marginTop: '40px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '20px', color: '#006a4e', marginBottom: '15px' }}>
            রেলভ্রমণে সচেতনতা কেন গুরুত্বপূর্ণ?
          </h2>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify' }}>
            রেলভ্রমণ সাধারণত দীর্ঘ সময়ের যাত্রা হওয়ায় যাত্রীদের নিজেদের নিরাপত্তার পাশাপাশি
            আশপাশের মানুষের নিরাপত্তার বিষয়টিও বিবেচনা করতে হয়। একটি ছোট অসতর্কতা প্ল্যাটফর্ম,
            রেললাইন বা চলন্ত ট্রেনে বড় দুর্ঘটনার কারণ হতে পারে। তাই রেলওয়ের নির্দেশনা মেনে চলা,
            নির্ধারিত পথে চলাচল করা এবং জরুরি পরিস্থিতিতে দায়িত্বরত কর্মীদের সহযোগিতা করা প্রত্যেক
            যাত্রীর দায়িত্ব।
          </p>

          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '15px' }}>
            একইভাবে ট্রেনের সময়সূচী, লাইভ ট্রেন লোকেশন, স্টেশন তথ্য বা যাত্রার সময় সম্পর্কে
            অনলাইনে পাওয়া তথ্য ব্যবহার করার সময় তথ্যের উৎস ও সর্বশেষ আপডেটের বিষয়টি বিবেচনা করা
            উচিত। ট্রেনকই যাত্রীদের জন্য এসব তথ্য সহজে খুঁজে পাওয়ার একটি সহায়ক প্ল্যাটফর্ম হিসেবে
            কাজ করে।
          </p>
        </div>

        {/* Urgent Emergency SEO Box */}
        <div style={{ marginTop: '40px', background: '#1e293b', padding: '35px', borderRadius: '40px', color: 'white', textAlign: 'center', border: '2px solid #006a4e' }}>
          <div style={{ backgroundColor: '#006a4e', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <PhoneCall size={30} />
          </div>

          <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>
            রেলওয়ে হেল্পলাইন ও জরুরি সহায়তা
          </h3>

          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '25px' }}>
            যাত্রাপথে কোনো অনিয়ম, নিরাপত্তা সমস্যা, অসুস্থতা বা জরুরি পরিস্থিতি দেখা দিলে
            দ্রুত সংশ্লিষ্ট কর্তৃপক্ষ বা জরুরি সেবার সঙ্গে যোগাযোগ করুন। নিজের পাশাপাশি
            অন্য যাত্রীদের নিরাপত্তার বিষয়টিও গুরুত্ব দিন।
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href="tel:16131" style={{ backgroundColor: 'white', color: '#006a4e', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>
              ১৬১৩১ (রেলওয়ে)
            </a>

            <a href="tel:999" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>
              ৯৯৯ (জরুরি)
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.8', textAlign: 'justify' }}>
            <strong style={{ color: '#334155' }}>গুরুত্বপূর্ণ ঘোষণা:</strong> এই পেজের তথ্য সাধারণ
            যাত্রী সচেতনতা ও রেলভ্রমণ সংক্রান্ত তথ্য প্রদানের উদ্দেশ্যে প্রকাশ করা হয়েছে।
            এটি কোনো সরকারি বা আইনি পরামর্শ নয়। বাংলাদেশ রেলওয়ের আইন, টিকিটিং নীতি,
            ভাড়া, রিফান্ড, ট্রেনের সময়সূচী বা অন্যান্য বিধিমালা সময়ের সঙ্গে পরিবর্তিত হতে পারে।
            তাই কোনো গুরুত্বপূর্ণ সিদ্ধান্ত নেওয়ার আগে সংশ্লিষ্ট বাংলাদেশ রেলওয়ে কর্তৃপক্ষের
            সর্বশেষ অফিসিয়াল তথ্য যাচাই করুন। ট্রেনকই বাংলাদেশ রেলওয়ের কোনো সরকারি
            অঙ্গপ্রতিষ্ঠান নয়।
          </p>
        </div>

      </div>
    </div>
  );
};

export default TravelLaws;