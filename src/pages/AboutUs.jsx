import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Train, ShieldCheck, Clock, Info, Search, Map, LocateFixed, Activity, Ticket, Anchor, AlertCircle, BookOpen, Navigation2, Users } from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  // --- Smart Back Logic ---
  const handleSmartBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Hidden Meta Keywords for Search Crawlers:
          Bangladesh Railway, BD Train Tracker, Train Schedule 2026, Crowdsourced Train Tracking,
          Suborno Express, Sonar Bangla Express, Cox's Bazar Express, Train Seat Map BD,
          Ticket Fare Bangladesh Railway, Train Location App, Live Status, TrainKoi Community.
      */}

      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 100 }}>
        <ChevronLeft onClick={handleSmartBack} style={{ cursor: 'pointer' }} size={28} />
        <h2 style={{ margin: 0, fontSize: '20px' }}>আমাদের সম্পর্কে (About TrainKoi) - কমিউনিটি ভিত্তিক রেল সেবা</h2>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Mega Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ backgroundColor: 'white', width: '90px', height: '90px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}>
            <Train size={50} color="#006a4e" />
          </div>
          <h1 style={{ color: '#006a4e', fontSize: '30px', margin: '0 0 15px', fontWeight: '900', lineHeight: '1.4' }}>
            ট্রেনকই: সহযাত্রীদের সহায়তায় লাইভ ট্রেন ট্র্যাকিং ও নির্ভরযোগ্য রেল তথ্য পোর্টাল
          </h1>
          <p style={{ color: '#444', lineHeight: '1.9', fontSize: '17px', textAlign: 'justify' }}>
            <strong>TrainKoi (ট্রেনকই)</strong> হলো বাংলাদেশের সাধারণ ট্রেন যাত্রীদের জন্য তৈরি একটি সমন্বিত ও কমিউনিটি-ভিত্তিক (Crowdsourced) স্মার্ট ডিজিটাল প্ল্যাটফর্ম। ট্রেনের ভেতর অবস্থানরত সহযাত্রীদের সরাসরি লাইভ লোকেশন শেয়ারিং, রেলওয়ের অফিশিয়াল সময়সূচী, ভাড়ার তালিকা, ব্রেক-ডাউন নোটিশ এবং ভ্রমণ ব্লগকে একটি ছাদের নিচে এনে যাত্রীদের ট্রেন ভ্রমণকে আরও নির্ভরযোগ্য ও নিশ্চিত করাই আমাদের প্রধান উদ্দেশ্য।
          </p>
        </div>

        <div style={{ display: 'grid', gap: '30px' }}>
          
          {/* Section: Live Tracking (Crowdsourced Focus) */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', borderTop: '8px solid #006a4e' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
              <LocateFixed color="#006a4e" size={30} />
              <h3 style={{ margin: 0, fontSize: '22px', color: '#006a4e' }}>কমিউনিটি লাইভ ট্র্যাকিং যেভাবে কাজ করে</h3>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', textAlign: 'justify', margin: 0 }}>
              ট্রেনকই মূলত একটি <strong>ব্যবহারকারী-নির্ভর (User-Driven) লাইভ ট্র্যাকিং প্ল্যাটফর্ম</strong>। যখন কোনো যাত্রী ট্রেনে চড়ে ভ্রমণ করেন এবং আমাদের অ্যাপ বা ওয়েবসাইটে তার জিপিএস সক্রিয় রাখেন, তখন তার শেয়ার করা অবস্থান রিয়েল-টাইমে প্রসেস হয়ে ম্যাপে ট্রেনের বর্তমান স্টেশন ও গতি হিসেবে প্রদর্শিত হয়। এর ফলে স্টেশনে অপেক্ষারত অন্যান্য হাজারো সহযাত্রী আগেভাগেই জানতে পারেন ট্রেনটি এখন কোথায় এবং কত সময় লেট হতে পারে।
            </p>
          </div>

          {/* Grid of Specialized Services */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '22px', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
              <Clock color="#006a4e" style={{ marginBottom: '10px' }} size={26} />
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', color: '#1e293b' }}>সময়সূচী ও বিলম্বের হিসাব</h4>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>
                বাংলাদেশ রেলওয়ের পূর্বাঞ্চল ও পশ্চিমাঞ্চলের সকল আন্তঃনগর, কমিউটার ও মেইল ট্রেনের প্রস্থান ও গন্তব্যে পৌঁছানোর অফিশিয়াল সময়সূচী।
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '22px', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
              <Ticket color="#e67e22" style={{ marginBottom: '10px' }} size={26} />
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', color: '#1e293b' }}>ভাড়া ও সিট প্ল্যানের ধারণা</h4>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>
                শোভন চেয়ার, এসি চেয়ার, স্লিপার বার্থ সহ সকল ক্লাসের সর্বশেষ ভাড়ার চার্ট এবং বিভিন্ন কোচের বসার সিট লেআউট সম্পর্কে সঠিক তথ্য।
              </p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '22px', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
              <BookOpen color="#4a90e2" style={{ marginBottom: '10px' }} size={26} />
              <h4 style={{ margin: '0 0 10px', fontSize: '17px', color: '#1e293b' }}>রেল সংবাদ ও ভ্রমণ ব্লগ</h4>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>
                টিকিট রিফান্ডের নতুন নিয়ম, সাপ্তাহিক ছুটির দিনের শিডিউল পরিবর্তন, খাবার পরিবেশনের মেনু এবং সুন্দর ট্রেন রুট নিয়ে নিয়মিত পরামর্শ।
              </p>
            </div>
          </div>

          {/* Deep Content: Why TrainKoi */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '20px', color: '#006a4e' }}>ট্রেনকই (TrainKoi) প্ল্যাটফর্মের মূল বৈশিষ্ট্যসমূহ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { q: "১. সহযাত্রীদের সম্মিলিত অবদান (Crowdsourcing):", a: "যাত্রীরা নিজেরাই অবস্থান আপডেট শেয়ার করে লাখো ট্রাভেলারকে সাহায্য করতে পারেন।" },
                { q: "২. ট্রেনের নিখুঁত বিবরণ ও রুট ম্যাপ:", a: "প্রতিটি ট্রেনের যাত্রাপথের সকল মধ্যবর্তী স্টেশনের তালিকা, হল্ট টাইম এবং জংশন বিবরণ।" },
                { q: "৩. লাইভ নোটিশ বোর্ড:", a: "রেলওয়ের রুট ডাইভারশন, টিকিট কাটার নিয়মাবলী এবং ট্রেনের সময় পরিবর্তন সংক্রান্ত তাৎক্ষণিক খবর।" },
                { q: "৪. ভ্রমণ নির্দেশিকা ও টিপস:", a: "প্রথমবার ট্রেন ভ্রমণকারীদের জন্য টিকিট বুকিং পদ্ধতি, লাগেজ নিয়ম ও নিরাপদ ভ্রমণের যাবতীয় টিপস।" },
                { q: "৫. সম্পূর্ণ ফ্রি ও সহজলভ্য:", a: "কোনো জটিল ইনস্টলেশন ছাড়াই যেকোনো সাধারণ স্মার্টফোন বা কম্পিউটার ব্রাউজার থেকে সরাসরি ব্যবহারযোগ্য।" }
              ].map((item, i) => (
                <div key={i} style={{ paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                  <strong style={{ color: '#333', fontSize: '15.5px' }}>{item.q}</strong>
                  <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px', lineHeight: '1.7' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer & Transparency (Crucial for AdSense) */}
          <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '20px', borderLeft: '6px solid #e67e22', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#d35400', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} /> তথ্যগত স্বচ্ছতা ও দায়মুক্তি (Transparency & Disclaimer)
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#555', lineHeight: '1.8', textAlign: 'justify' }}>
              <strong>TrainKoi</strong> কোনো সরকারি প্রতিষ্ঠান বা বাংলাদেশ রেলওয়ের অফিশিয়াল অঙ্গসংগঠন নয়। এটি সাধারণ নাগরিকদের স্বেচ্ছাসেবী ডেটা শেয়ারিং এবং ওপেন ইনফরমেশন সহায়তায় পরিচালিত একটি সহায়ক তথ্য সেবা পোর্টাল। যাত্রীদের ভ্রমণের পরিকল্পনা সহজ করার স্বার্থেই এই তথ্যগুলো প্রদর্শিত হয়।
            </p>
          </div>

          {/* Final Vision */}
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h4 style={{ color: '#006a4e', marginBottom: '10px', fontSize: '18px' }}>আমাদের লক্ষ্য (Our Mission)</h4>
            <p style={{ fontSize: '15px', color: '#555', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
              "সহযাত্রীদের পারস্পরিক তথ্য আদান-প্রদানের মাধ্যমে একটি প্রযুক্তিবান্ধব নেটওয়ার্ক তৈরি করা, যাতে বাংলাদেশের কোনো ট্রেন যাত্রীকে স্টেশনে দাঁড়িয়ে অনিশ্চয়তায় সময় নষ্ট করতে না হয়।"
            </p>
          </div>

        </div>

        {/* Dynamic SEO Footer */}
        <div style={{ marginTop: '50px', borderTop: '1px solid #e0e0e0', paddingTop: '20px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
            <Activity size={18} color="#006a4e" />
            <ShieldCheck size={18} color="#006a4e" />
            <BookOpen size={18} color="#006a4e" />
          </div>
          <span style={{ fontSize: '12px', color: '#888', lineHeight: '1.8', display: 'inline-block' }}>
            TrainKoi™ - Community Driven Bangladesh Railway Information Platform. <br/>
            This site is developed by{" "}
            <a 
              href="https://talhabyteit.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#888', textDecoration: 'underline' }}
            >
              Talhabyte IT
            </a>
            <br />
            All Rights Reserved © 2026 TrainKoi.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;