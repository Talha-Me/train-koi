import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Train, ShieldCheck, Clock, Info, Search, Map, 
  LocateFixed, Activity, Ticket, Anchor, AlertCircle, BookOpen, 
  Navigation2, Users, Heart, Globe, ExternalLink, Code2, Sparkles, CheckCircle2
} from 'lucide-react';

const AboutUs = () => {
  const navigate = useNavigate();

  // স্মার্ট ব্যাক বাটন লজিক
  const handleSmartBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // গুগল এসইও এবং ক্রলার ফ্রেন্ডলি মেটা টাইটেল সেট
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "About Us | TrainKoi - বাংলাদেশের একমাত্র ফ্রি লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#f0f4f2', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '60px' }}>
      
      {/* হেডার সেকশন */}
      <header style={{ 
        background: 'linear-gradient(135deg, #005a43 0%, #003d2d 100%)', 
        padding: '16px 20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ maxWidth: '950px', width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={handleSmartBack} 
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
            aria-label="Back"
          >
            <ChevronLeft size={28} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>আমাদের সম্পর্কে (About TrainKoi)</h1>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.85 }}>বাংলাদেশের একমাত্র ফ্রি ও কমিউনিটি-চালিত লাইভ ট্রেন ট্র্যাকার</p>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '950px', margin: '0 auto', padding: '30px 16px' }}>
        
        {/* মেগা হিরো ব্র্যান্ডিং সেকশন */}
        <section style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            width: '90px', 
            height: '90px', 
            borderRadius: '26px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 20px', 
            boxShadow: '0 12px 28px rgba(0,90,67,0.12)',
            border: '2px solid #e1eee7'
          }}>
            <Train size={48} color="#005a43" />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e2ece6', color: '#005a43', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '800', marginBottom: '14px' }}>
            <Sparkles size={16} /> শতভাগ উন্মুক্ত ও ফ্রি প্ল্যাটফর্ম
          </div>

          <h2 style={{ color: '#003d2d', fontSize: '28px', margin: '0 0 16px', fontWeight: '900', lineHeight: '1.4' }}>
            ট্রেনকই: বাংলাদেশের একমাত্র ডিজিটাল প্ল্যাটফর্ম যেখানে ট্রেনের লাইভ লোকেশন দেখা যায় সম্পূর্ণ ফ্রিতে!
          </h2>

          <p style={{ color: '#444', lineHeight: '1.9', fontSize: '16.5px', textAlign: 'justify', backgroundColor: 'white', padding: '24px', borderRadius: '22px', border: '1px solid #e5ece8', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <strong>ট্রেনকই (TrainKoi.com)</strong> হলো বাংলাদেশ রেলওয়ের সম্মানিত সাধারণ যাত্রী ও পর্যটকদের জন্য নির্মিত প্রথম পূর্ণাঙ্গ এবং আধুনিক <strong>কমিউনিটি-চালিত (Crowdsourced) লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্ম</strong>। প্রচলিত এসএমএস ট্র্যাকিংয়ের খরুচে ঝামেলা ও থার্ড-পার্টির পেইড সাবস্ক্রিপশন দূর করে সাধারণ মানুষের হাতের মুঠোয় ট্রেনের সঠিক শিডিউল, রিয়েল-টাইম জিপিএস লোকেশন, বর্তমান গতি ও প্ল্যাটফর্ম নোটিশ এক ক্লিকে সম্পূর্ণ ফ্রিতে পৌঁছে দেওয়াই ট্রেনকই-এর মূল লক্ষ্য।
          </p>
        </section>

        {/* কোর আর্কিটেকচার: কীভাবে কাজ করে লাইভ ট্র্যাকিং */}
        <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderTop: '6px solid #005a43', marginBottom: '30px', border: '1px solid #eef2f0' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#e6f4ee', padding: '10px', borderRadius: '12px' }}>
              <LocateFixed color="#005a43" size={28} />
            </div>
            <h3 style={{ margin: 0, fontSize: '21px', color: '#005a43', fontWeight: '800' }}>
              স্মার্ট লাইভ ট্র্যাকিং যেভাবে কাজ করে
            </h3>
          </div>
          <p style={{ color: '#555', lineHeight: '1.85', textAlign: 'justify', fontSize: '15.5px', margin: 0 }}>
            ট্রেনকই মূলত একটি <strong>সহযাত্রী-নির্ভর (Community-Powered) ওপেন ট্র্যাকিং নেটওয়ার্ক</strong>। ট্রেনে অবস্থানরত কোনো যাত্রী যখন অ্যাপে অবস্থান শেয়ার করেন, তখন তার ফোনের নির্ভুল জিপিএস সিগন্যাল ও স্যাটেলাইট কো-অর্ডিনেটস রিয়েল-টাইমে প্রসেস হয়ে ট্রেনকই-এর লাইভ ম্যাপে যুক্ত হয়। এর ফলে স্টেশনে অপেক্ষারত হাজার হাজার যাত্রী নিজ ঘরে বা প্ল্যাটফর্মে বসেই দেখতে পারেন ট্রেনটি এই মুহূর্তে ঠিক কোন স্টেশনে রয়েছে, কত কিমি গতিতে চলছে এবং আনুমানিক কয়টায় স্টেশনে প্রবেশ করবে।
          </p>
        </section>

        {/* স্পেশালাইজড ফিচার গ্রিড (এসইও কিওয়ার্ড বুস্টার) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Clock color="#005a43" size={24} />
              <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>১০০% নির্ভুল সময়সূচী ও রুট</h4>
            </div>
            <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
              বাংলাদেশ রেলওয়ের পূর্বাঞ্চল ও পশ্চিমাঞ্চল জোনের ঢাকা, চট্টগ্রাম, রাজশাহী, সিলেট ও পঞ্চগড়গামী সকল আন্তঃনগর, মেইল ও কমিউটার ট্রেনের হালনাগাদ শিডিউল।
            </p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Ticket color="#e67e22" size={24} />
              <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>ভাড়া ও সিট লেআউট গাইড</h4>
            </div>
            <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
              শোভন চেয়ার, স্নিগ্ধা ও এসি বার্থের দূরত্বভিত্তিক অফিসিয়াল ভাড়ার চার্ট এবং ট্রেনের বগিভিত্তিক সিট প্ল্যান সহজে যাচাইয়ের সুবিধা।
            </p>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', border: '1px solid #e2ede7', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Activity color="#e53935" size={24} />
              <h4 style={{ margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: '800' }}>লাইভ বিলম্ব ও গতি মনিটর</h4>
            </div>
            <p style={{ fontSize: '14.5px', color: '#666', lineHeight: '1.7', margin: 0 }}>
              ট্রেনের অপ্রত্যাশিত যাত্রা বিলম্ব, গতি পর্যবেক্ষণ ও পরবর্তী স্টেশনে পৌঁছানোর সম্ভাব্য সময় (ETA) সরাসরি স্ক্রিনে প্রদর্শন।
            </p>
          </div>

        </section>

        {/* কেন ট্রেনকই সবার চেয়ে আলাদা */}
        <section style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '35px', border: '1px solid #eef2f0' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#005a43', fontSize: '21px', fontWeight: '800' }}>
            ট্রেনকই প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { t: "সম্পূর্ণ বিনামূল্যে ব্যবহারযোগ্য:", d: "কোনো পেইড প্রিমিয়াম ফিচার নেই। দেশের প্রতিটি নাগরিকের জন্য সকল ট্র্যাকিং সার্ভিস আজীবন ফ্রি।" },
              { t: "কোনো ভারী অ্যাপ ইনস্টলের বাধ্যবাধকতা নেই:", d: "যেকোনো স্মার্টফোন বা কম্পিউটার ব্রাউজার থেকে সরাসরি উচ্চগতির সাথে লোড হয়।" },
              { t: "অফলাইন এসএমএস ট্র্যাকিং ব্যাকআপ:", d: "ইন্টারনেট না থাকলে সরাসরি ১৬৩১৮ নম্বরে নির্দিষ্ট ট্রেনের কোড পাঠিয়ে অবস্থান জানার পূর্ণাঙ্গ গাইডলাইন।" },
              { t: "বিজ্ঞাপনমুক্ত ও ক্লিন ইউজার এক্সপেরিয়েন্স:", d: "যাত্রীর মূল্যবান সময় ও ব্যাটারি বাঁচাতে কোনো বিরক্তিকর বা বিভ্রান্তিকর অ্যাড ছাড়াই দ্রুত ব্রাউজিং।" }
            ].map((f, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#005a43" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  <strong style={{ color: '#222', fontSize: '15.5px' }}>{f.t}</strong>
                  <p style={{ margin: '3px 0 0', color: '#666', fontSize: '14px', lineHeight: '1.7' }}>{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ডেভেলপার ও প্রতিষ্ঠান পরিচিতি: Talhabyte IT & Founder Profile */}
        <section style={{ 
          backgroundColor: '#ffffff', 
          padding: '30px', 
          borderRadius: '24px', 
          border: '1.5px solid #d0e5db', 
          boxShadow: '0 8px 24px rgba(0,90,67,0.06)',
          marginBottom: '35px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <div style={{ backgroundColor: '#005a43', padding: '10px', borderRadius: '12px', color: 'white' }}>
              <Code2 size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#003d2d', fontWeight: '900' }}>
                উদ্যোগ ও প্রযুক্তিগত অংশীদার: Talhabyte IT
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>মানবকল্যাণ ও উন্মুক্ত প্রযুক্তির সেবায় নিবেদিত সফটওয়্যার ল্যাব</p>
            </div>
          </div>

          <p style={{ color: '#444', fontSize: '15.5px', lineHeight: '1.85', textAlign: 'justify', marginBottom: '20px' }}>
            <strong>Talhabyte IT (তালহাবাইট আইটি)</strong> একটি আধুনিক প্রযুক্তি গবেষণা ও সফটওয়্যার উদ্ভাবনী প্রতিষ্ঠান, যা বিশেষ করে সাধারণ মানুষের জীবনযাত্রাকে সহজ ও গতিশীল করার মতো সামাজিক ও মানবসেবামূলক টেক-প্রজেক্ট নির্মাণে বিশ্বাসী। এই প্রতিষ্ঠানের প্রতিষ্ঠাতা ও প্রধান কারিগরি পরিচালক হলেন{" "}
            <a 
              href="https://abutalha.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#005a43', fontWeight: '900', textDecoration: 'none', borderBottom: '2px solid #005a43', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              মো. আবু তালহা আকাশ (Md. Abu Talha Akash) <ExternalLink size={14} />
            </a>
            । প্রযুক্তির শক্তিকে সাধারণ মানুষের উপকারে রূপান্তর করাই তালহাবাইট আইটির মূল দর্শন।
          </p>

          {/* মানবসেবামূলক প্রজেক্ট পোর্টফোলিও */}
          <div style={{ backgroundColor: '#f8faf9', padding: '20px', borderRadius: '18px', border: '1px solid #e1ece6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#005a43', fontWeight: '800', fontSize: '15px' }}>
              <Heart size={18} fill="#005a43" /> আমাদের উল্লেখযোগ্য মানবকল্যাণমূলক প্রজেক্টসমূহ:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '14.5px', lineHeight: '1.9' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#111' }}>TrainKoi (ট্রেনকই):</strong> বাংলাদেশের কোটি রেলযাত্রীকে সম্পূর্ণ বিনামূল্যে রিয়েল-টাইম লাইভ ট্রেন লোকেশন ও সময়সূচী দেওয়ার ডিজিটাল পোর্টাল।
              </li>
              <li>
                <strong style={{ color: '#111' }}>GreenRoute EU (গ্রিনরুট ইইউ):</strong> পরিবেশবান্ধব, টেকসই যোগাযোগ ও গ্লোবাল রুট সমাধান সংক্রান্ত আন্তর্জাতিক প্রজেক্ট —{" "}
                <a 
                  href="https://greenrouteeu.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  greenrouteeu.xyz
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* তথ্যগত স্বচ্ছতা ও দায়মুক্তি নোটিশ (অ্যাডসেন্স কমপ্লায়েন্স) */}
        <section style={{ backgroundColor: '#fffbf5', padding: '24px', borderRadius: '20px', borderLeft: '6px solid #e67e22', border: '1px solid #ffeedb', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#d35400', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800' }}>
            <Info size={19} /> তথ্যগত স্বচ্ছতা ও দায়মুক্তি (Disclaimer & Transparency)
          </h4>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#666', lineHeight: '1.8', textAlign: 'justify' }}>
            <strong>TrainKoi (ট্রেনকই)</strong> কোনো সরকারি সংস্থা বা বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অঙ্গপ্রতিষ্ঠান নয়। এটি নাগরিকদের স্বেচ্ছাসেবী ডেটা শেয়ারিং ও ওপেন প্ল্যাটফর্ম সহায়তায় পরিচালিত একটি সহায়ক পাবলিক ইনফরমেশন সিস্টেম। যাত্রীদের ভ্রমণের মানসিক প্রস্তুতি ও সময় সাশ্রয়ে সহায়তা করাই এই ওয়েবসাইটের একমাত্র উদ্দেশ্য।
          </p>
        </section>

        {/* আমাদের ভিশন */}
        <section style={{ textAlign: 'center', padding: '25px 20px', backgroundColor: 'white', borderRadius: '22px', border: '1px solid #eef2f0' }}>
          <h4 style={{ color: '#005a43', margin: '0 0 8px 0', fontSize: '18px', fontWeight: '800' }}>আমাদের দীর্ঘমেয়াদী লক্ষ্য</h4>
          <p style={{ fontSize: '15px', color: '#555', fontStyle: 'italic', maxWidth: '720px', margin: '0 auto', lineHeight: '1.8' }}>
            "আধুনিক প্রযুক্তির সহায়তায় বাংলাদেশের প্রতিটি নাগরিকের জন্য নিরাপদ, নিশ্চিত ও স্বচ্ছ ট্রেন ভ্রমণের পরিবেশ নিশ্চিত করা — যাতে কাউকে অনিশ্চয়তায় স্টেশনের প্ল্যাটফর্মে দাঁড়িয়ে থাকতে না হয়।"
          </p>
        </section>

        {/* এসইও ফুটার ও কপিরাইট */}
        <footer style={{ marginTop: '45px', borderTop: '1px solid #dbe5e0', paddingTop: '22px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '14px' }}>
            <Activity size={18} color="#005a43" />
            <ShieldCheck size={18} color="#005a43" />
            <Globe size={18} color="#005a43" />
          </div>
          <p style={{ fontSize: '12.5px', color: '#777', lineHeight: '1.8', margin: 0 }}>
            <strong>TrainKoi™</strong> - The Premier Free Crowdsourced Bangladesh Railway Information Platform. <br/>
            Engineered & Maintained with passion by{" "}
            <a 
              href="https://talhabyteit.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Talhabyte IT
            </a>
            {" "}(Founder:{" "}
            <a 
              href="https://abutalha.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#005a43', fontWeight: 'bold', textDecoration: 'none' }}
            >
              Md. Abu Talha Akash
            </a>
            )<br />
            All Rights Reserved © 2026 TrainKoi.com
          </p>
        </footer>

      </main>
    </div>
  );
};

export default AboutUs;