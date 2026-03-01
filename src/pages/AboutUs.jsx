import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Train, ShieldCheck, Clock, Info, Search, Map, LocateFixed, Activity, Ticket, Anchor, AlertCircle, BookOpen, Navigation2 } from 'lucide-react';

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
          Bangladesh Railway, BD Train Tracker, Train Schedule 2026, Online Ticket BD, 
          Suborno Express, Sonar Bangla Express, Cox's Bazar Express, Train Seat Map BD,
          Ticket Fare Bangladesh Railway, Train Location App, Live Status.
      */}

      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 100 }}>
        <ChevronLeft onClick={handleSmartBack} style={{ cursor: 'pointer' }} size={28} />
        <h2 style={{ margin: 0, fontSize: '20px' }}>আমাদের সম্পর্কে (About TrainKoi) - BD Railway Live Info</h2>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* Mega Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ backgroundColor: 'white', width: '90px', height: '90px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }}>
            <Train size={50} color="#006a4e" />
          </div>
          <h1 style={{ color: '#006a4e', fontSize: '32px', margin: '0 0 15px', fontWeight: '900' }}>
            ট্রেনকই: বাংলাদেশ রেলওয়ে লাইভ ট্র্যাকিং ও অনলাইন তথ্য সেবা
          </h1>
          <p style={{ color: '#444', lineHeight: '1.9', fontSize: '18px', textAlign: 'justify' }}>
            <strong>TrainKoi (ট্রেনকই)</strong> হলো একটি আধুনিক প্রযুক্তিগত প্ল্যাটফর্ম যা বাংলাদেশ রেলওয়ের (Bangladesh Railway) যাত্রীদের রিয়েল-টাইম তথ্য প্রদানের জন্য নিবেদিত। আপনি যদি খুঁজছেন <strong>"Train kothay?"</strong> অথবা <strong>"Live Train Status BD"</strong>, তবে আপনি সঠিক জায়গায় এসেছেন। আমরা ইন্টারসিটি, মেইল এবং লোকাল ট্রেনের নিখুঁত তথ্য প্রদান করি।
          </p>
        </div>

        <div style={{ display: 'grid', gap: '30px' }}>
          
          {/* Section: Live Tracking (Crucial for SEO) */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)', borderTop: '8px solid #006a4e' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <LocateFixed color="#006a4e" size={30} />
                 <h3 style={{ margin: 0, fontSize: '22px' }}>লাইভ ট্রেন ট্র্যাকিং (Real-time Train Tracker)</h3>
              </div>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8' }}>
              আমাদের সিস্টেমে <strong>Suborno Express, Sonar Bangla, Cox's Bazar Express</strong> সহ সকল জনপ্রিয় ট্রেনের লাইভ অবস্থান ট্র্যাক করা সম্ভব। এটি যাত্রীদের স্টেশনে দীর্ঘক্ষণ অপেক্ষা করার ক্লান্তি থেকে মুক্তি দেয়। ট্রেনের বর্তমান স্টেশন, পরবর্তী স্টপেজ এবং বিলম্ব (Delay) সম্পর্কে আমরা সবচেয়ে দ্রুত আপডেট দিই।
            </p>
          </div>

          {/* Grid of Specialized Services */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
              <Ticket color="#e67e22" style={{ marginBottom: '10px' }} />
              <h4 style={{ margin: '0 0 10px' }}>টিকিট ও ভাড়ার তথ্য</h4>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>ঢাকা থেকে চট্টগ্রাম, সিলেট বা রাজশাহী—সকল রুটের ট্রেনের ভাড়ার তালিকা ও সিট প্ল্যান সম্পর্কে ধারণা নিন।</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #e0e0e0' }}>
              <Navigation2 color="#4a90e2" style={{ marginBottom: '10px' }} />
              <h4 style={{ margin: '0 0 10px' }}>রুট ম্যাপ ও জংশন</h4>
              <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>কমলাপুর, বিমানবন্দর, এবং জয়দেবপুর জংশন সহ সারা দেশের রেলওয়ে নেটওয়ার্কের বিস্তারিত রুট ম্যাপ।</p>
            </div>
          </div>

          {/* Deep Content: Railway Stations & Categories (SEO Goldmine) */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 5px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ marginBottom: '20px', color: '#006a4e' }}>কেন ট্রেনকই (TrainKoi) আপনার জন্য সেরা?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[
                { q: "ট্রেন অনুসন্ধান (Smart Search):", a: "ট্রেনের নাম বা কোড দিয়ে মুহূর্তেই তথ্য খুঁজে বের করার ক্ষমতা।" },
                { q: "অফলাইন শিডিউল (Offline Access):", a: "ইন্টারনেট না থাকলেও সেভ করা ট্রেনের সময়সূচী দেখার সুবিধা।" },
                { q: "ভ্রমণ গাইড (Blog):", a: "ট্রেনের খাবারের দাম, ব্যাগ রাখার নিয়ম এবং এসি/নন-এসি সিটের বিস্তারিত গাইড।" },
                { q: "নিরাপদ ভ্রমণ (Laws):", a: "বাংলাদেশ রেলওয়ে আইন ও যাত্রী অধিকার সম্পর্কে সচেতনতা।" }
              ].map((item, i) => (
                <div key={i} style={{ paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                  <strong style={{ color: '#333', fontSize: '16px' }}>{item.q}</strong>
                  <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Info for Indexing */}
          <div style={{ backgroundColor: '#006a4e', color: 'white', padding: '30px', borderRadius: '25px', backgroundImage: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)' }}>
            <h3 style={{ margin: '0 0 15px' }}>Important Tags (অনুসন্ধান সহায়িকা)</h3>
            <p style={{ fontSize: '14px', lineHeight: '2', opacity: 0.9 }}>
              Bangladesh Railway Intercity Train Schedule • Train Ticket Online • Live Train Location Tracker • 
              Dhaka to Chittagong Train Fare • Train Seat Map BD • Suborno Express Live Status • 
              Railway Complaint Number • Rail Sheba App Alternative • Train Time Table Bangladesh 2026.
            </p>
          </div>

          {/* Final Message */}
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h4 style={{ color: '#006a4e', marginBottom: '10px' }}>আমাদের লক্ষ্য (Our Vision)</h4>
            <p style={{ fontSize: '15px', color: '#555', fontStyle: 'italic' }}>
              "বাংলাদেশ রেলওয়ের সকল সেবাকে স্মার্টফোনের মাধ্যমে সাধারণ মানুষের কাছে আরও সহজলভ্য করে তোলা।"
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
          <span style={{ fontSize: '12px', color: '#888' }}>
  TrainKoi™ - The Most Trusted Bangladesh Railway Information Portal. <br/>
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