import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Info, Train, Clock, MapPin } from 'lucide-react';

const MetroFare = () => {
  const navigate = useNavigate();

  // SEO Optimization: Title and Meta update
  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল ভাড়া তালিকা ২০২৬ - উত্তরা থেকে মতিঝিল | ট্রেনকই (Trainkoi)";
    window.scrollTo(0, 0);
  }, []);

  const fares = [
    { to: 'উত্তরা উত্তর (Uttara North)', price: '২০' },
    { to: 'উত্তরা সেন্টার (Uttara Center)', price: '২০' },
    { to: 'উত্তরা দক্ষিণ (Uttara South)', price: '২০' },
    { to: 'পল্লবী (Pallabi)', price: '৩০' },
    { to: 'মিরপুর ১১ (Mirpur 11)', price: '৪০' },
    { to: 'মিরপুর ১০ (Mirpur 10)', price: '৪০' },
    { to: 'কাজীপাড়া (Kazipara)', price: '৫০' },
    { to: 'শেওড়াপাড়া (Sheowrapara)', price: '৫০' },
    { to: 'আগারগাঁও (Agargaon)', price: '৬০' },
    { to: 'বিজয় সরণি (Bijoy Sarani)', price: '৭০' },
    { to: 'ফার্মগেট (Farmgate)', price: '৭০' },
    { to: 'কারওয়ান বাজার (Karwan Bazar)', price: '৮০' },
    { to: 'শাহবাগ (Shahbagh)', price: '৮০' },
    { to: 'ঢাকা বিশ্ববিদ্যালয় (DU)', price: '৯০' },
    { to: 'সচিবালয় (Secretariat)', price: '৯০' },
    { to: 'মতিঝিল (Motijheel)', price: '১০০' },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header - আগের UI অনুযায়ী */}
      <div style={{ background: 'linear-gradient(135deg, #008352 0%, #005a38 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={() => navigate('/metro-rail')} 
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '8px', color: 'white', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>ভাড়া তালিকা (উত্তরা থেকে)</h1>
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Main Fare Table - আগের UI */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '15px', color: '#475569', fontSize: '14px' }}>গন্তব্য স্টেশন</th>
                <th style={{ padding: '15px', color: '#475569', fontSize: '14px', textAlign: 'right' }}>ভাড়া (টাকা)</th>
              </tr>
            </thead>
            <tbody>
              {fares.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', color: '#1e293b', fontWeight: '600' }}>{item.to}</td>
                  <td style={{ padding: '15px', color: '#008352', fontWeight: '800', textAlign: 'right' }}>৳ {item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Info Box - আগের UI */}
        <div style={{ marginTop: '20px', backgroundColor: '#fff7ed', padding: '15px', borderRadius: '16px', border: '1px solid #ffedd5', display: 'flex', gap: '10px' }}>
          <Info size={20} color="#ea580c" />
          <p style={{ margin: 0, fontSize: '12px', color: '#9a3412' }}>MRT Pass ব্যবহার করলে প্রতি ভ্রমণে ১০% ছাড় পাওয়া যায়। সর্বনিম্ন ভাড়া ২০ টাকা।</p>
        </div>

        {/* --- SEO & Extra Information Section (নতুন যুক্ত করা হয়েছে র‍্যাঙ্কিংয়ের জন্য) --- */}
        
        <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
          
          <h2 style={{ fontSize: '20px', color: '#1e293b', fontWeight: '800', marginBottom: '15px' }}>ঢাকা মেট্রো রেল (Dhaka Metro Rail) ২০২৬ আপডেট</h2>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8', textAlign: 'justify' }}>
            বাংলাদেশের প্রথম বিদ্যুৎচালিত দ্রুতগামী গণপরিবহন <b>ঢাকা মেট্রো রেল (MRT Line 6)</b> এখন উত্তরা উত্তর থেকে মতিঝিল পর্যন্ত পুরোদমে সচল। <b>ট্রেনকই (Trainkoi)</b> আপনাদের জন্য নিয়ে এসেছে মেট্রো রেলের লেটেস্ট ভাড়া তালিকা এবং সময়সূচী। উত্তরা থেকে মতিঝিল পর্যন্ত যাতায়াতের সময় এখন মাত্র ৩৫-৪০ মিনিট, যা আগে ঘণ্টার পর ঘণ্টা সময় নিত।
          </p>

          <h3 style={{ fontSize: '18px', color: '#1e293b', fontWeight: '800', marginTop: '30px' }}>মেট্রো রেল লাইভ ট্র্যাকিং ও স্টেশন লিস্ট</h3>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.8' }}>
            ট্রেনকই অ্যাপে আপনারা পাচ্ছেন লাইভ ট্র্যাকিং সুবিধা। উত্তরা উত্তর স্টেশন থেকে শুরু হয়ে মতিঝিল পর্যন্ত ১৬টি স্টেশন রয়েছে। প্রতিটি স্টেশনে ট্রেন নির্দিষ্ট সময় অন্তর বিরতি নেয়। 
          </p>
          
          <ul style={{ paddingLeft: '20px', fontSize: '14px', color: '#334155', lineHeight: '2' }}>
            <li><b>উত্তরা থেকে মতিঝিল ভাড়া:</b> ১০০ টাকা (একক যাত্রা)</li>
            <li><b>এমআরটি পাস ডিসকাউন্ট:</b> ১০% ছাড় পাওয়া যাবে</li>
            <li><b>সাপ্তাহিক ছুটি:</b> শুক্রবার মেট্রো রেল চলাচল বন্ধ থাকে</li>
            <li><b>প্রথম ট্রেন:</b> সকাল ৭:১০ মিনিট (উত্তরা থেকে)</li>
          </ul>

          <h3 style={{ fontSize: '18px', color: '#1e293b', fontWeight: '800', marginTop: '30px' }}>সাধারণ জিজ্ঞাসা (FAQ) - মেট্রো রেল ভাড়া ও সময়সূচী</h3>
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px', color: '#008352' }}>১. উত্তরা থেকে আগারগাঁও মেট্রো রেল ভাড়া কত?</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>উত্তরা উত্তর স্টেশন থেকে আগারগাঁও পর্যন্ত একক যাত্রার ভাড়া ৬০ টাকা।</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px', color: '#008352' }}>২. ট্রেনের সময়সূচী কি প্রতিদিন একই থাকে?</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>হ্যাঁ, সাধারণত শনি থেকে বৃহস্পতিবার একই সময়সূচী মেনে মেট্রো রেল চলাচল করে। তবে সরকারি ছুটির দিন বা বিশেষ প্রয়োজনে কর্তৃপক্ষ সময় পরিবর্তন করতে পারে।</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px', color: '#008352' }}>৩. কিভাবে ট্রেনকই (Trainkoi) অ্যাপ ব্যবহার করব?</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>আমাদের ওয়েবসাইটে আপনি রিয়েল-টাইম ট্রেন লোকেশন, স্টেশনের নাম এবং পূর্ণাঙ্গ সময়সূচী সহজেই দেখতে পারবেন যা আপনার যাত্রা সহজ করবে।</p>
            </div>
          </div>

          <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Keywords: Dhaka Metro Rail Fare Chart, Uttara to Motijheel Fare, Metro Rail Time Table 2026, Trainkoi BD, Live Train Tracking Bangladesh, ঢাকা মেট্রো রেল সময়সূচী ২০২৬।
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MetroFare;