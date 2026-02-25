import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, ShieldCheck, FileText, 
  AlertTriangle, Moon, Bell, ChevronRight,
  Info, Share2, Star, X, MessageCircle, Heart
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  // বিস্তারিত কন্টেন্ট (যা অ্যাডসেন্স অ্যাপ্রুভালের জন্য সহায়ক)
  const policyContent = {
    privacy: {
      title: "গোপনীয়তা নীতি (Privacy Policy)",
      content: `ট্রেনকই (TrainKoi)-তে আপনার গোপনীয়তা রক্ষা করা আমাদের অঙ্গীকার।

      ১. তথ্য সংগ্রহ: আমরা সরাসরি আপনার নাম, মোবাইল নম্বর বা এনআইডি সংগ্রহ করি না। তবে অ্যাপের অভিজ্ঞতা উন্নত করতে ব্রাউজার টাইপ এবং আইপি অ্যাড্রেস লগ ফাইলে জমা হতে পারে।
      
      ২. গুগল অ্যাডসেন্স ও কুকিজ: আমরা আমাদের সাইটে বিজ্ঞাপন দেখানোর জন্য Google AdSense ব্যবহার করি। গুগল থার্ড-পার্টি ভেন্ডর হিসেবে আপনার ব্রাউজিং ডেটার ওপর ভিত্তি করে বিজ্ঞাপন দেখাতে 'DoubleClick DART Cookies' ব্যবহার করে। আপনি চাইলে গুগলের অ্যাড সেটিংস থেকে এটি বন্ধ করতে পারেন।
      
      ৩. থার্ড-পার্টি লিংক: আমাদের সাইটে বাংলাদেশ রেলওয়ের মতো তৃতীয় পক্ষের লিংক থাকতে পারে। ঐসব সাইটের নিজস্ব গোপনীয়তা নীতির জন্য ট্রেনকই দায়ী নয়।
      
      ৪. শিশুদের সুরক্ষা: আমরা ১৩ বছরের কম বয়সী শিশুদের কাছ থেকে জেনেশুনে কোনো তথ্য সংগ্রহ করি না।
      
      ৫. যোগাযোগ: আমাদের পলিসি নিয়ে প্রশ্ন থাকলে hello@trainkoi.com-এ যোগাযোগ করুন।`
    },
    terms: {
      title: "ব্যবহারের শর্তাবলী (Terms of Service)",
      content: `১. সাধারণ নিয়ম: ট্রেনকই একটি তথ্যসেবামূলক প্ল্যাটফর্ম। এখানে প্রদর্শিত তথ্য শুধুমাত্র ব্যক্তিগত ব্যবহারের জন্য।
      
      ২. তথ্যের উৎস: আমরা বাংলাদেশ রেলওয়ের পাবলিক ডাটা ব্যবহার করি। কারিগরি কারণে তথ্যের আপডেট হতে দেরি হতে পারে। তাই জরুরি প্রয়োজনে রেলওয়ের অফিশিয়াল সোর্স যাচাই করুন।
      
      ৩. বিধিনিষেধ: এই সাইটের কোনো কন্টেন্ট, লোগো বা কোড বাণিজ্যিক উদ্দেশ্যে পুনঃব্যবহার বা কপি করা সম্পূর্ণ নিষিদ্ধ।
      
      ৪. দায়বদ্ধতা সীমাবদ্ধতা: এই প্ল্যাটফর্মের তথ্যের ওপর ভিত্তি করে কোনো ট্রেন মিস করলে বা অন্য কোনো সমস্যা হলে ট্রেনকই কর্তৃপক্ষ আইনত দায়ী থাকবে না।
      
      ৫. শর্ত পরিবর্তন: আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি।`
    },
    disclaimer: {
      title: "দায়মুক্তি (Disclaimer)",
      content: `সতর্কীকরণ: ট্রেনকই (TrainKoi) বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অ্যাপ্লিকেশন বা ওয়েবসাইট নয়।
      
      আমরা কেবল রেলওয়ে যাত্রীদের যাতায়াত সহজ করতে পাবলিকলি এভেইলঅ্যাবল তথ্যগুলো গুছিয়ে উপস্থাপন করি। ট্রেনের রিয়েল-টাইম লোকেশন, ভাড়ার তালিকা বা স্টেশনের নাম যেকোনো সময় রেলওয়ে কর্তৃপক্ষ পরিবর্তন করতে পারে। নির্ভুল তথ্যের জন্য সর্বদা নিকটস্থ স্টেশন মাস্টার বা বাংলাদেশ রেলওয়ের অফিশিয়াল ওয়েবসাইট (eticket.railway.gov.bd) অনুসরণ করুন। আমরা কোনোভাবেই সরকারি প্রতিষ্ঠানের প্রতিনিধিত্ব করি না।`
    }
  };

  const renderModal = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000,
      padding: '20px', backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white', width: '100%', maxWidth: '550px',
        maxHeight: '85vh', borderRadius: '30px', overflowY: 'auto',
        position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
      }}>
        <div style={{ 
          position: 'sticky', top: 0, backgroundColor: 'white', 
          padding: '20px 25px', borderBottom: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#006a4e', fontWeight: '800' }}>{policyContent[activeModal]?.title}</h3>
          <div onClick={() => setActiveModal(null)} style={{ cursor: 'pointer', backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '50%' }}>
            <X size={20} color="#666" />
          </div>
        </div>
        <div style={{ padding: '25px', lineHeight: '1.8', color: '#444', fontSize: '15px', whiteSpace: 'pre-line' }}>
          {policyContent[activeModal]?.content}
          <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'center' }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{ backgroundColor: '#006a4e', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const settingsGroups = [
    {
      groupName: "একাউন্ট ও সাপোর্ট",
      options: [
        { id: 'login', icon: <User />, label: 'প্রোফাইল', desc: 'লগইন ছাড়াই ব্যবহারযোগ্য', color: '#006a4e' },
        { id: 'help', icon: <MessageCircle />, label: 'হেল্প সেন্টার', desc: 'সাধারণ জিজ্ঞাসা ও উত্তর', color: '#0288d1', path: '/faq' }
      ]
    },
    {
      groupName: "আইনি ও পলিসি (অ্যাডসেন্স রেডি)",
      options: [
        { id: 'privacy', icon: <ShieldCheck />, label: 'প্রাইভেসি পলিসি', desc: 'আপনার তথ্যের নিরাপত্তা', color: '#43a047' },
        { id: 'terms', icon: <FileText />, label: 'ব্যবহারের শর্তাবলী', desc: 'অ্যাপ ব্যবহারের নিয়মসমূহ', color: '#fb8c00' },
        { id: 'disclaimer', icon: <AlertTriangle />, label: 'দায়মুক্তি নোটিশ', desc: 'রেলওয়ের সাথে সম্পর্ক', color: '#e53935' }
      ]
    },
    {
      groupName: "অ্যাপ সেটিংস",
      options: [
        { id: 'notify', icon: <Bell />, label: 'নোটিফিকেশন', desc: 'অন করা আছে', color: '#8e24aa' },
        { id: 'theme', icon: <Moon />, label: 'ডার্ক মোড', desc: 'শীঘ্রই আসছে...', color: '#546e7a' }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {activeModal && renderModal()}

      {/* Header */}
      <div style={{ 
        backgroundColor: '#006a4e', 
        padding: '20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: '5px' }}>
            <ChevronLeft size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>Settings</h2>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* User Status Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
          padding: '25px', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          marginBottom: '30px',
          color: 'white',
          boxShadow: '0 10px 20px rgba(0,106,78,0.15)'
        }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <User size={35} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px' }}>স্বাগতম, গেস্ট ইউজার!</h3>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '13px' }}>ট্রেনকই এর সাথে থাকার জন্য ধন্যবাদ</p>
          </div>
        </div>

        {/* Dynamic Groups */}
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '14px', color: '#006a4e', fontWeight: 'bold', marginLeft: '15px', marginBottom: '10px', textTransform: 'uppercase' }}>{group.groupName}</p>
            <div style={{ backgroundColor: 'white', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              {group.options.map((option, oIdx) => (
                <div 
                  key={oIdx}
                  onClick={() => {
                    if (option.path) navigate(option.path);
                    else if (['privacy', 'terms', 'disclaimer'].includes(option.id)) setActiveModal(option.id);
                  }}
                  style={{ 
                    padding: '18px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderBottom: oIdx !== group.options.length - 1 ? '1px solid #f8f8f8' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      color: option.color, 
                      backgroundColor: `${option.color}10`, 
                      padding: '10px', 
                      borderRadius: '12px' 
                    }}>
                      {React.cloneElement(option.icon, { size: 22 })}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#333' }}>{option.label}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{option.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#ddd" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Info & Socials */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', color: '#006a4e', marginBottom: '10px', fontWeight: 'bold' }}>
            <Heart size={16} fill="#006a4e" /> Made for Bangladesh
          </div>
          <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>Version 2.0.4 (Stable Release)</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
             <Share2 size={20} color="#006a4e" />
             <Star size={20} color="#006a4e" />
             <Info size={20} color="#006a4e" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;