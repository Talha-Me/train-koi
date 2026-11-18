import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldAlert, Gavel, Scale, AlertTriangle, 
  HelpCircle, ChevronDown, ChevronUp, Info, BookOpen, Clock, 
  Luggage, CigaretteOff, UserCheck, PhoneCall, HeartHandshake, 
  ShieldCheck, MapPin, Zap, Star, Search, Shield
} from 'lucide-react';
import Navbar from './components/Navbar';

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
      q: "ট্রেনে ভ্রমণের জন্য টিকিট ও পরিচয়পত্র সঙ্গে রাখা কেন বাধ্যতামূলক?",
      a: "রেলওয়ের নিয়ম অনুযায়ী টিকিটের সত্যতা নিশ্চিত করতে এবং টিকিট হস্তান্তর বা টিকিট সংক্রান্ত অনিয়ম রোধে যাত্রীকে তার টিকিট এবং প্রযোজ্য পরিচয়পত্র সঙ্গে রাখার নির্দেশনা দেওয়া হয়।"
    },
    {
      q: "অনলাইন টিকিট ও কাউন্টার টিকিটের মধ্যে কী কী পার্থক্য বিবেচনা করা উচিত?",
      a: "অনলাইন টিকিট সাধারণত ডিজিটাল মাধ্যমে কেনা হয় এবং এতে যাত্রীর নির্দিষ্ট তথ্য থাকে। অন্যদিকে কাউন্টার টিকিটের ক্ষেত্রে সরাসরি প্রিন্ট করা টিকিট ব্যবহার করা হয়। উভয় ক্ষেত্রেই যাত্রা শুরুর আগে ট্রেনের নাম, সময় ও আসন নম্বর যাচাই করে নেওয়া উচিত।"
    },
    {
      q: "ট্রেনে অতিরিক্ত লাগেজ বহন করলে কী করণীয়?",
      a: "ব্যক্তিগত মালামাল বহনের সীমা অতিক্রম করলে সংশ্লিষ্ট স্টেশনের পার্সেল বা লাগেজ কাউন্টারে যোগাযোগ করে নিয়ম ও প্রযোজ্য ফি সম্পর্কে জেনে বুকিং সম্পন্ন করা উচিত।"
    },
    {
      q: "ট্রেন নির্ধারিত সময়ের চেয়ে দেরি করলে যাত্রীর করণীয় কী?",
      a: "রেলপথে বিভিন্ন কারণে ট্রেন বিলম্বিত হতে পারে। ট্রেন বিলম্বের ক্ষেত্রে স্টেশনের ঘোষণা শোনা, ট্রেনকই-এর মতো ট্র্যাকিং প্ল্যাটফর্মে ট্রেনের বর্তমান অবস্থান যাচাই করা এবং প্রয়োজনবোধে স্টেশন কর্তৃপক্ষের সহায়তা নেওয়া নিরাপদ।"
    },
    {
      q: "ট্রেনকই কি কোনো অফিসিয়াল সরকারি বা আইনগত সিদ্ধান্ত দেয়?",
      a: "ট্রেনকই একটি স্বাধীন তথ্য ও ট্র্যাকিং প্ল্যাটফর্ম। এটি বাংলাদেশ রেলওয়ের কোনো সরকারি অঙ্গপ্রতিষ্ঠান নয়। তাই গুরুত্বপূর্ণ যাত্রা, টিকিট, রিফান্ড বা কোনো আইনি বিষয়ে সর্বশেষ অফিসিয়াল তথ্যের জন্য সংশ্লিষ্ট বাংলাদেশ রেলওয়ে কর্তৃপক্ষের নির্দেশনাকে অগ্রাধিকার দেওয়া উচিত।"
    }
  ];

  return (
    <div className="tl-page">
      <style>{`
        .tl-page {
          background-color: #f0f4f3;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 80px;
        }
        .tl-page *, .tl-page *::before, .tl-page *::after {
          box-sizing: border-box;
        }

        /* Mobile Header */
        .tl-mobile-header {
          background: #006a4e;
          padding: 16px 20px;
          color: white;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        @media (min-width: 769px) {
          .tl-mobile-header {
            display: none;
          }
        }

        /* Main Container */
        .tl-main-container {
          max-width: 1520px;
          width: 95%;
          margin: 0 auto;
          padding: 28px 16px;
        }

        /* Laws Grid */
        .tl-laws-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          margin-bottom: 35px;
        }
        @media (min-width: 860px) {
          .tl-laws-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1350px) {
          .tl-laws-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        /* Law Card */
        .tl-law-card {
          background-color: white;
          padding: 26px;
          border-radius: 24px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.03);
          border: 1px solid #eef2f0;
          border-left: 6px solid #006a4e;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .tl-law-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -10px rgba(0, 106, 78, 0.2);
        }

        /* Article Grid */
        .tl-articles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin: 35px 0;
        }
        @media (min-width: 992px) {
          .tl-articles-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      {/* Desktop Top Navbar */}
      <Navbar activePage="/travel-laws" />

      {/* Mobile Top Header */}
      <div className="tl-mobile-header">
        <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} size={26} />
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>রেলওয়ে ভ্রমণ নির্দেশিকা ও গাইড</h3>
      </div>

      <div className="tl-main-container">
        
        {/* Massive SEO Title & Summary Banner */}
        <div style={{ backgroundColor: 'white', padding: '36px 32px', borderRadius: '30px', marginBottom: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ backgroundColor: '#006a4e', color: 'white', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '800' }}>
              OFFICIAL GUIDE 2026
            </span>
            <span style={{ color: '#006a4e', fontSize: '13px', fontWeight: '700' }}>
              বাংলাদেশ রেলওয়ে ১৮৯০ আইন ও আধুনিক যাত্রী গাইডলাইন
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', color: '#006a4e', marginBottom: '18px', lineHeight: '1.35', fontWeight: '900', letterSpacing: '-0.3px' }}>
            বাংলাদেশ রেলওয়ে নিরাপদ ভ্রমণ নীতিমালা, ট্রেনের নিয়ম ও যাত্রী অধিকারের পূর্ণাঙ্গ গাইড
          </h1>

          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify' }}>
            বাংলাদেশে প্রতিদিন হাজার হাজার মানুষ আন্তঃনগর, মেইল, কমিউটার ও বিভিন্ন ধরনের ট্রেনে
            এক জেলা থেকে অন্য জেলায় যাতায়াত করেন। ট্রেনে ভ্রমণের আগে শুধু <strong>Train Schedule</strong>
            বা <strong>Live Train Tracking</strong> জানা যথেষ্ট নয়; টিকিট, লাগেজ, স্টেশন নিরাপত্তা,
            যাত্রীদের দায়িত্ব, ট্রেনের ভেতরের আচরণ এবং জরুরি পরিস্থিতিতে করণীয় সম্পর্কেও ধারণা থাকা
            গুরুত্বপূর্ণ। <strong>ট্রেনকই (TrainKoi)</strong> এই গাইডে বাংলাদেশ রেলওয়েতে নিরাপদ ও
            সচেতনভাবে ভ্রমণের জন্য প্রয়োজনীয় বিভিন্ন বিষয় সহজ ভাষায় তুলে ধরেছে।
          </p>

          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '14px' }}>
            এই পেজে আপনি ট্রেনের টিকিট ও যাত্রী অধিকার, বাংলাদেশ রেলওয়ে ভ্রমণ নিয়ম, ট্রেনের নিরাপত্তা,
            লাগেজ বহনের সাধারণ নির্দেশনা, রেলস্টেশনে নিরাপত্তা, নারী ও শিশুদের নিরাপত্তা, ট্রেন বিলম্ব,
            ট্রেন ট্র্যাকিং, জরুরি যোগাযোগ এবং যাত্রীদের সাধারণ প্রশ্নের উত্তর সম্পর্কে বিস্তারিত তথ্য
            পাবেন।
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '28px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <Search size={24} color="#006a4e"/>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>সহজ অনুসন্ধান</b>
                <span style={{ fontSize: '12px', color: '#64748b' }}>এক ক্লিকে সকল আইন</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <Star size={24} color="#006a4e"/>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>ভেরিফাইড তথ্য</b>
                <span style={{ fontSize: '12px', color: '#64748b' }}>রেলওয়ে বিধি মোতাবেক</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <Zap size={24} color="#006a4e"/>
              <div style={{ textAlign: 'left' }}>
                <b style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>দ্রুত আপডেট</b>
                <span style={{ fontSize: '12px', color: '#64748b' }}>২০২৬ সংস্করণ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Laws Grid */}
        <h2 style={{ fontSize: '22px', color: '#0f1f1a', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900' }}>
          <Gavel size={24} color="#006a4e" /> গুরুত্বপূর্ণ রেলওয়ে নিয়ম ও নিরাপত্তা নির্দেশনা
        </h2>

        <div className="tl-laws-grid">
          {laws.map((law) => (
            <div key={law.id} className="tl-law-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '16px' }}>
                  {law.icon}
                </div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#0f1f1a', fontWeight: '800' }}>
                  {law.title}
                </h3>
              </div>

              <p style={{ fontSize: '13.5px', color: '#555', lineHeight: '1.75', marginBottom: '16px', textAlign: 'justify' }}>
                {law.desc}
              </p>

              <div style={{ backgroundColor: '#f8faf9', padding: '14px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {law.points.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: '#334155', alignItems: 'flex-start', lineHeight: '1.6' }}>
                    <ShieldCheck size={15} color="#006a4e" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Articles Grid (Desktop 2-Col) */}
        <div className="tl-articles-grid">
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 18px rgba(0,0,0,0.03)', border: '1px solid #eef2f0' }}>
            <h2 style={{ fontSize: '19px', color: '#006a4e', marginBottom: '14px', fontWeight: '800' }}>
              ট্রেনে নিরাপদ ভ্রমণের জন্য যাত্রীর করণীয়
            </h2>

            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', margin: 0 }}>
              একটি নিরাপদ রেলভ্রমণের জন্য শুধু টিকিট কেনাই যথেষ্ট নয়। যাত্রার আগে ট্রেনের সময়সূচী,
              স্টেশনে পৌঁছানোর সময়, কোচ ও আসনের তথ্য এবং প্রয়োজনীয় পরিচয়পত্র সম্পর্কে নিশ্চিত হওয়া
              উচিত। স্টেশনে পৌঁছে নির্ধারিত প্ল্যাটফর্মে অবস্থান করুন এবং ট্রেন আসা ও যাওয়ার সময়
              নিরাপদ দূরত্ব বজায় রাখুন। ভিড়ের সময় শিশু, বয়স্ক ও পরিবারের সদস্যদের বিশেষভাবে
              নজরে রাখা গুরুত্বপূর্ণ।
            </p>

            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '14px', marginBottom: 0 }}>
              চলন্ত ট্রেনে দরজায় দাঁড়ানো, রেললাইনে হাঁটা, ট্রেনের ছাদে ওঠা বা ট্রেনের বাইরে শরীরের
              কোনো অংশ বের করে ছবি তোলা অত্যন্ত ঝুঁকিপূর্ণ। সামাজিক যোগাযোগমাধ্যমের জন্য ছবি বা ভিডিও
              তৈরি করার সময় নিজের এবং অন্য যাত্রীদের নিরাপত্তাকে কখনোই ঝুঁকির মধ্যে ফেলা উচিত নয়।
            </p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 18px rgba(0,0,0,0.03)', border: '1px solid #eef2f0' }}>
            <h2 style={{ fontSize: '19px', color: '#006a4e', marginBottom: '14px', fontWeight: '800' }}>
              ট্রেনের সময়সূচী ও লাইভ ট্র্যাকিং ব্যবহারের সঠিক উপায়
            </h2>

            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', margin: 0 }}>
              বাংলাদেশ রেলওয়ের ট্রেনের সময়সূচী যাত্রা পরিকল্পনার অন্যতম গুরুত্বপূর্ণ অংশ। কোনো ট্রেনের
              নির্ধারিত ছাড়ার সময় এবং পৌঁছানোর সময় জানা থাকলে যাত্রী সহজে তার দিনের পরিকল্পনা করতে
              পারেন। তবে নির্ধারিত সময়কে সবসময় বাস্তব পৌঁছানোর সময় হিসেবে ধরে নেওয়া উচিত নয়।
              রেলপথের পরিস্থিতি, সিগন্যাল, স্টেশন ব্যবস্থাপনা, আবহাওয়া বা অন্যান্য কারণে ট্রেন দেরি
              করতে পারে।
            </p>

            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.9', textAlign: 'justify', marginTop: '14px', marginBottom: 0 }}>
              এই কারণে <strong>লাইভ ট্রেন ট্র্যাকিং</strong> বা ট্রেনের বর্তমান অবস্থানের তথ্য যাত্রীদের
              জন্য সহায়ক হতে পারে। ট্রেনকই-এর মতো ট্র্যাকিং প্ল্যাটফর্ম ব্যবহার করার সময় মনে রাখতে হবে,
              অনলাইন ডেটা আপডেট হতে কিছুটা সময় লাগতে পারে। তাই গুরুত্বপূর্ণ যাত্রায় ট্র্যাকিং তথ্যের
              পাশাপাশি স্টেশন ঘোষণা এবং প্রাসঙ্গিক অফিসিয়াল তথ্যও বিবেচনা করা উচিত।
            </p>
          </div>
        </div>

        {/* Pro-Tips Section */}
        <div style={{ margin: '35px 0', background: 'linear-gradient(135deg, #005a40 0%, #003728 100%)', padding: '32px', borderRadius: '28px', color: 'white', boxShadow: '0 12px 30px rgba(0, 55, 38, 0.25)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
             <Info size={24} color="#6ee7b7" /> প্রো-টিপস: ট্রেনের সিট, কোচ ও যাত্রা পরিকল্পনা
          </h3>

          <p style={{ fontSize: '14.5px', lineHeight: '1.85', opacity: 0.95, margin: 0, textAlign: 'justify' }}>
            ট্রেনে দীর্ঘ ভ্রমণের ক্ষেত্রে যাত্রার আগে আপনার কোচ নম্বর, আসন নম্বর এবং ওঠার স্টেশন
            সম্পর্কে পরিষ্কার ধারণা রাখা ভালো। স্টেশনে পৌঁছে শেষ মুহূর্তে কোচ খুঁজতে গেলে ভিড়ের কারণে
            সমস্যা হতে পারে। তাই পর্যাপ্ত সময় হাতে নিয়ে স্টেশনে পৌঁছানো এবং প্ল্যাটফর্মের ডিসপ্লে,
            ঘোষণা ও সংশ্লিষ্ট কর্মীদের নির্দেশনা অনুসরণ করা নিরাপদ।
          </p>

          <p style={{ fontSize: '14.5px', lineHeight: '1.85', opacity: 0.95, marginTop: '14px', marginBottom: 0, textAlign: 'justify' }}>
            দীর্ঘ যাত্রায় পানি, প্রয়োজনীয় ওষুধ, চার্জার, পরিচয়পত্র এবং গুরুত্বপূর্ণ ব্যক্তিগত
            সামগ্রী সঙ্গে রাখুন। তবে অপরিচিত ব্যক্তির দেওয়া কোনো প্যাকেট বা খাবার গ্রহণ করবেন না এবং
            নিজের লাগেজও সবসময় নিজের নিয়ন্ত্রণে রাখুন।
          </p>
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: '22px', color: '#0f1f1a', margin: '35px 0 20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900' }}>
          <HelpCircle size={24} color="#006a4e" /> সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h2>

        <div style={{ display: 'grid', gap: '12px' }}>
          {faqs.map((faq, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #edf2f7', transition: 'border-color 0.2s' }}>
              <div 
                onClick={() => toggleFaq(index)}
                style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: openFaq === index ? '#f8fafc' : 'white' }}
              >
                <span style={{ fontSize: '15px', fontWeight: '800', color: openFaq === index ? '#006a4e' : '#1e293b', flex: 1, lineHeight: '1.4' }}>
                  {faq.q}
                </span>
                {openFaq === index ? <ChevronUp size={20} color="#006a4e" /> : <ChevronDown size={20} color="#94a3b8" />}
              </div>
              {openFaq === index && (
                <div style={{ padding: '0 20px 20px', fontSize: '14px', color: '#4a5568', lineHeight: '1.8', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Emergency Helpline Box */}
        <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '36px', borderRadius: '30px', color: 'white', textAlign: 'center', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
          <div style={{ backgroundColor: '#006a4e', width: '56px', height: '56px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
            <PhoneCall size={26} color="white" />
          </div>

          <h3 style={{ fontSize: '22px', margin: '0 0 10px', fontWeight: '900' }}>
            রেলওয়ে হেল্পলাইন ও জরুরি সহায়তা
          </h3>

          <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '24px', maxWidth: '600px', marginInline: 'auto', lineHeight: '1.7' }}>
            যাত্রাপথে কোনো অনিয়ম, নিরাপত্তা সমস্যা, অসুস্থতা বা জরুরি পরিস্থিতি দেখা দিলে
            দ্রুত সংশ্লিষ্ট কর্তৃপক্ষ বা জরুরি সেবার সঙ্গে যোগাযোগ করুন। নিজের পাশাপাশি
            অন্য যাত্রীদের নিরাপত্তার বিষয়টিও গুরুত্ব দিন।
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <a href="tel:16459" style={{ backgroundColor: '#006a4e', color: 'white', padding: '12px 24px', borderRadius: '14px', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>
              ১৬৪৫৯ (রেলওয়ে হটলাইন)
            </a>

            <a href="tel:999" style={{ backgroundColor: '#dc2626', color: 'white', padding: '12px 24px', borderRadius: '14px', textDecoration: 'none', fontWeight: '800', fontSize: '14px' }}>
              ৯৯৯ (জাতীয় জরুরি সেবা)
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
