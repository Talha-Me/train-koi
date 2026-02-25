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
      title: "টিকিট ও যাত্রী সাধারণের বৈধ অধিকার",
      desc: "বাংলাদেশ রেলওয়ে আইন ১৮৯০ এর ধারা ১১৩ অনুযায়ী, প্রতিটি যাত্রীর কাছে একটি বৈধ টিকিট (Physical or Digital) থাকতে হবে। অন্যের নামে কাটা টিকিট ব্যবহার করা আইনত অপরাধ।",
      points: ["বিনা টিকিটে ভ্রমণে ভাড়ার দ্বিগুণ জরিমানাসহ কারাদণ্ড", "অনলাইন টিকিটের ক্ষেত্রে এনআইডি (NID) সাথে রাখা বাধ্যতামূলক", "৫-১২ বছর বয়সীদের জন্য অর্ধেক মূল্যের টিকিট প্রযোজ্য"],
      icon: <Scale size={24} color="#006a4e" />
    },
    {
      id: 2,
      title: "রেলওয়ে নিরাপত্তা ও সম্পদ সুরক্ষা",
      desc: "রেলওয়ে আইনের ১২৬ ধারা মতে, অকারণে বিপদ সংকেত বা চেইন ব্যবহার করলে ১ বছর জেল বা জরিমানা হতে পারে। ট্রেনের জানালায় পাথর মারা একটি জামিন অযোগ্য অপরাধ।",
      points: ["পাথর নিক্ষেপ করলে ১০ হাজার টাকা জরিমানা ও ১০ বছর জেল", "ট্রেনের ইঞ্জিনে বা ছাদে ভ্রমণ সম্পূর্ণ নিষিদ্ধ", "রেললাইনের পাশে সেলফি তোলা বা ড্রোন ওড়ানো নিষিদ্ধ"],
      icon: <ShieldAlert size={24} color="#006a4e" />
    },
    {
      id: 3,
      title: "লাগেজ ও পার্সেল বুকিং নীতিমালা",
      desc: "যাত্রী তার সাথে নির্দিষ্ট সীমার অতিরিক্ত মালামাল বহন করলে তা 'ব্র্যাক ভ্যান' বা পার্সেল কোচে বুকিং দিতে হবে।",
      points: ["এসি ক্লাসে ৫০ কেজি ও শোভন চেয়ারে ৩৫ কেজি পর্যন্ত ফ্রি লাগেজ", "দাহ্য পদার্থ বা গ্যাস সিলিন্ডার বহন করলে ৫ বছরের জেল", "পোষা প্রাণী (যেমন বিড়াল/পাখি) বহনের জন্য আলাদা পারমিট প্রয়োজন"],
      icon: <Luggage size={24} color="#006a4e" />
    }
  ];

  const faqs = [
    { q: "টিকিট হারিয়ে গেলে বা নষ্ট হলে করণীয় কী?", a: "আপনার যদি অনলাইন কপি থাকে, তবে তা পুনরায় ডাউনলোড করে প্রিন্ট নিতে পারেন। টিকিট হারিয়ে গেলে অবিলম্বে নিকটস্থ স্টেশনের জিআরপি (GRP) থানায় জিডি করে দায়িত্বরত টিটিই-কে অবহিত করতে হবে।" },
    { q: "ট্রেন কত মিনিট দেরি হলে টিকিট রিফান্ড পাওয়া যায়?", a: "যদি ট্রেন নির্ধারিত সময়ের চেয়ে ৪ ঘণ্টা বা তার বেশি দেরি করে, তবে যাত্রী কোনো চার্জ ছাড়াই টিকিটের পুরো টাকা রিফান্ড দাবি করতে পারেন।" },
    { q: "ট্রেনে খাবারের অতিরিক্ত দাম নিলে কোথায় অভিযোগ দেব?", a: "প্রতিটি ট্রেনের ক্যাটারিং সার্ভিসে নির্ধারিত মূল্যের তালিকা থাকা বাধ্যতামূলক। অতিরিক্ত দাম নিলে ১৬১৩১ নাম্বারে কল করুন অথবা রেলওয়ের ফেসবুক পেজে ইনবক্স করুন।" },
    { q: "মহিলা ও শিশুদের জন্য সিট সংরক্ষণের নিয়ম কী?", a: "আন্তঃনগর ট্রেনে প্রতিটি বগিতে নির্দিষ্ট সংখ্যক সিট মহিলাদের জন্য সংরক্ষিত থাকে। এছাড়াও বড় স্টেশনে মহিলাদের জন্য আলাদা ওয়েটিং রুম বা বিশ্রামের জায়গা রয়েছে।" },
    { q: "ট্রেনে ব্ল্যাক টিকিট বা কালোবাজারি রুখতে আইন কী?", a: "রেলওয়ে আইন অনুযায়ী টিকিট কালোবাজারি করলে ৩ মাস থেকে ২ বছরের কারাদণ্ড হতে পারে। ট্রেনের ভেতরে টিটিই ব্যতীত অন্য কারো থেকে টিকিট কেনা দণ্ডনীয় অপরাধ।" }
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
            বাংলাদেশ রেলওয়ে নিরাপদ ভ্রমণ নীতিমালা ও যাত্রী অধিকারের পূর্ণাঙ্গ তালিকা
          </h1>
          <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.8', textAlign: 'justify' }}>
            আপনি কি <strong>Train Schedule</strong> বা <strong>Live Tracking</strong> সম্পর্কে জানতে আগ্রহী? কেবল সময় জানলেই ভ্রমণ নিরাপদ হয় না। <strong>ট্রেনকই (TrainKoi)</strong> আপনার জন্য নিয়ে এসেছে বাংলাদেশ রেলওয়ের ১৮৯০ সালের আইন থেকে শুরু করে বর্তমান সময়ের সকল ডিজিটাল নীতিমালা। ট্রেনের টিকিট রিফান্ড, লাগেজের নিয়ম এবং নিরাপত্তা বিধিনিষেধ সম্পর্কে বিস্তারিত জেনে আপনার যাত্রা নিশ্চিত করুন।
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '25px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
            <div style={{ textAlign: 'center' }}><Search size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>স্মার্ট সার্চ</p></div>
            <div style={{ textAlign: 'center' }}><Star size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>ভেরিফাইড তথ্য</p></div>
            <div style={{ textAlign: 'center' }}><Zap size={22} color="#006a4e"/><p style={{ fontSize: '11px', marginTop: '5px' }}>রিয়েল-টাইম</p></div>
          </div>
        </div>

        {/* Laws Grid */}
        <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gavel size={22} color="#006a4e" /> গুরুত্বপূর্ণ আইনি বিধিমালা
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {laws.map((law) => (
            <div key={law.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: '8px solid #006a4e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '18px' }}>{law.icon}</div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: 'bold' }}>{law.title}</h3>
              </div>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', marginBottom: '15px' }}>{law.desc}</p>
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

        {/* Pro-Tips SEO Article Section */}
        <div style={{ margin: '40px 0', background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '30px', borderRadius: '35px', color: 'white' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Info size={24} color="#2ecc71" /> প্রো-টিপস: ট্রেনের সিট ম্যাপ ও সুবিধা
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.8', opacity: 0.95 }}>
            আপনার কি জানেন? প্রতিটি আন্তঃনগর ট্রেনের 'খ' বা 'গ' বগিতে সাধারণত প্রতিবন্ধী ও বয়স্কদের জন্য অতিরিক্ত সুবিধা থাকে। এসি সিট বা স্নিগ্ধা কোচে মোবাইল চার্জিং পোর্ট এবং রিডিং লাইট ফ্রি ব্যবহারের সুবিধা পাওয়া যায়। এছাড়াও 'পাওয়ার কার' বগিতে নামাজের জন্য নির্দিষ্ট স্থান থাকে। এই ধরণের ক্ষুদ্র তথ্য আপনার দীর্ঘ ভ্রমণকে আরও আরামদায়ক করতে পারে।
          </p>
        </div>

        {/* Optimized FAQ Section */}
        <h2 style={{ fontSize: '20px', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <HelpCircle size={22} color="#006a4e" /> সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
        </h2>

        {faqs.map((faq, index) => (
          <div key={index} style={{ backgroundColor: 'white', borderRadius: '22px', marginBottom: '15px', overflow: 'hidden', border: '1px solid #edf2f7' }}>
            <div 
              onClick={() => toggleFaq(index)}
              style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: openFaq === index ? '#f8fafc' : 'white' }}
            >
              <span style={{ fontSize: '15px', fontWeight: '700', color: openFaq === index ? '#006a4e' : '#2d3748', flex: 1 }}>{faq.q}</span>
              {openFaq === index ? <ChevronUp size={20} color="#006a4e" /> : <ChevronDown size={20} color="#666" />}
            </div>
            {openFaq === index && (
              <div style={{ padding: '0 20px 20px 20px', fontSize: '14px', color: '#4a5568', lineHeight: '1.7', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ marginTop: '15px' }}>{faq.a}</div>
              </div>
            )}
          </div>
        ))}

        {/* Urgent Emergency SEO Box */}
        <div style={{ marginTop: '40px', background: '#1e293b', padding: '35px', borderRadius: '40px', color: 'white', textAlign: 'center', border: '2px solid #006a4e' }}>
          <div style={{ backgroundColor: '#006a4e', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <PhoneCall size={30} />
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>রেলওয়ে হেল্পলাইন ও সাপোর্ট</h3>
          <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '25px' }}>
            যাত্রাপথে কোনো অনিয়ম দেখলে বা জীবন বিপন্ন হলে দ্রুত এই নাম্বারে যোগাযোগ করুন। আপনার সচেতনতা অন্যের প্রাণ বাঁচাতে পারে।
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href="tel:16131" style={{ backgroundColor: 'white', color: '#006a4e', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>১৬১৩১ (রেলওয়ে)</a>
            <a href="tel:999" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '12px 25px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold' }}>৯৯৯ (জরুরী)</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TravelLaws;