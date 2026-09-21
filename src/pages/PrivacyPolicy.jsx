import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldCheck, Lock, Eye, 
  MapPin, Cookie, ExternalLink, Mail, FileText 
} from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '60px' }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: '#006a4e', 
        padding: '16px 20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '850px', margin: '0 auto' }}>
          <div onClick={handleBack} style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={26} />
          </div>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '700' }}>
            গোপনীয়তা নীতি (Privacy Policy)
          </h2>
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '30px 24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #edf2f7'
        }}>
          
          {/* Header Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#006a4e', marginBottom: '16px' }}>
            <ShieldCheck size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '23px', fontWeight: '800', color: '#0f172a' }}>
                ট্রেনকই (TrainKoi) গোপনীয়তা নীতি
              </h1>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                সর্বশেষ পরিমার্জন ও কার্যকারিতা: ২০২৬
              </p>
            </div>
          </div>

          <p style={{ lineHeight: '1.85', color: '#475569', fontSize: '15px', textAlign: 'justify', marginBottom: '24px' }}>
            <strong>TrainKoi.com</strong>-এ আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করা আমাদের সর্বোচ্চ অগ্রাধিকার। এই নীতিমালায় ব্যাখ্যা করা হয়েছে আমরা কীভাবে আপনার ডেটা সংগ্রহ, ব্যবহার ও নিরাপদ রাখি এবং গুগলের মতো থার্ড-পার্টি বিজ্ঞাপন পার্টনারদের সাথে কী কী শর্তে কাজ করি।
          </p>

          <div style={{ lineHeight: '1.85', color: '#334155', fontSize: '14.5px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Section 1: Location & Crowdsourcing */}
            <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '16px', borderLeft: '4px solid #006a4e' }}>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> ১. লোকেশন ডেটা ও ক্রাউডসোর্সড ট্র্যাকিং
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                আমাদের লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্মটি কমিউনিটি-ভিত্তিক। আপনি যখন স্বেচ্ছায় ট্রেনে বসে অবস্থান শেয়ার করতে সম্মতি দেন, তখন আপনার ডিভাইসের জিপিএস কো-অর্ডিনেটস (Latitude & Longitude) অস্থায়ীভাবে প্রসেস করা হয় কেবল ট্রেনের বর্তমান গতি ও স্টেশন দূরত্ব নির্ধারণের জন্য। আমরা আপনার নাম, ফোন নম্বর বা স্থায়ী ব্যক্তিগত প্রোফাইলের সাথে এই অবস্থান যুক্ত করি না এবং লোকেশন হিস্ট্রি কারও কাছে বিক্রি করি না।
              </p>
            </div>

            {/* Section 2: Log Files & Analytics */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> ২. লগ ফাইল ও অ্যানালিটিক্স (Log Files)
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                অন্যান্য সাধারণ ওয়েবসাইটের মতো ট্রেনকই স্ট্যান্ডার্ড লগ ফাইল ব্যবহার করে। এর মধ্যে রয়েছে ইন্টারনেট প্রোটোকল (IP) অ্যাড্রেস, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), রেফারেল পেজ এবং তারিখ/সময়ের স্ট্যাম্প। এই তথ্যগুলো কোনোভাবেই ব্যক্তিগত পরিচয়ের সাথে যুক্ত নয়; এগুলো কেবল সার্ভার ট্রাফিক মনিটরিং, সাইটের স্পিড বাড়ানো এবং বাগ ফিক্স করার কাজে ব্যবহৃত হয়।
              </p>
            </div>

            {/* Section 3: Google AdSense & Cookies (Crucial for AdSense approval) */}
            <div style={{ backgroundColor: '#f0fdf4', padding: '18px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <h3 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cookie size={18} /> ৩. গুগল অ্যাডসেন্স ও ডাবলক্লিক ডার্ট কুকিজ (AdSense & Cookies)
              </h3>
              <p style={{ margin: '0 0 10px 0', textAlign: 'justify' }}>
                গুগল (Google) একজন নির্ভরযোগ্য থার্ড-পার্টি ভেন্ডর হিসেবে আমাদের ওয়েবসাইটে বিজ্ঞাপন প্রদর্শনের জন্য কুকিজ (Cookies) ব্যবহার করে।
              </p>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '6px' }}>
                  গুগলের <strong>DART Cookie</strong> ব্যবহারের মাধ্যমে ব্যবহারকারী এই সাইট ও ইন্টারনেটের অন্যান্য সাইট পরিদর্শনের ওপর ভিত্তি করে প্রাসঙ্গিক ও পছন্দসই বিজ্ঞাপন দেখতে পান।
                </li>
                <li>
                  ব্যবহারকারীরা চাইলে গুগলের নিজস্ব বিজ্ঞাপন পলিসি পাতা পরিদর্শন করে পার্সোনালাইজড কুকিজ ব্যবহার নিয়ন্ত্রণ বা বন্ধ করতে পারেন:{' '}
                  <a 
                    href="https://policies.google.com/technologies/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#006a4e', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                  >
                    Google Ads Settings <ExternalLink size={12} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Section 4: Third Party Links */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={18} /> ৪. থার্ড-পার্টি ও বাহ্যিক লিংক
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                আমাদের প্ল্যাটফর্মে বাংলাদেশ রেলওয়ের অফিসিয়াল টিকিট পোর্টাল (eticket.railway.gov.bd) বা অন্যান্য প্রয়োজনীয় বাহ্যিক লিংক থাকতে পারে। বাহ্যিক সাইটগুলোর নিজস্ব গোপনীয়তা নীতি থাকে, যার ওপর ট্রেনকই-এর কোনো নিয়ন্ত্রণ বা দায়িত্ব নেই।
              </p>
            </div>

            {/* Section 5: Children's Information Protection */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} /> ৫. শিশু সুরক্ষা ও তথ্য নিরাপত্তা (Children's Privacy)
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                ইন্টারনেট ব্যবহারে শিশুদের নিরাপত্তা রক্ষা করা আমাদের দায়িত্বের অংশ। আমরা জেনেশুনে ১৩ বছরের কম বয়সী শিশুদের কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। আমাদের সিস্টেমে সংগৃহীত কারিগরি ডেটা সুরক্ষিত সার্ভারে সংরক্ষিত থাকে।
              </p>
            </div>

            {/* Section 6: Contact Us */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px', marginTop: '10px' }}>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={18} /> ৬. যোগাযোগ ও মতামত
              </h3>
              <p style={{ margin: 0 }}>
                আমাদের গোপনীয়তা নীতি নিয়ে আপনার কোনো জিজ্ঞাসা, অভিযোগ বা পরামর্শ থাকলে নির্দ্বিধায় যোগাযোগ করুন:<br />
                ইমেইল: <a href="mailto:support@trainkoi.com" style={{ color: '#006a4e', fontWeight: 'bold' }}>support@trainkoi.com</a>
              </p>
            </div>

          </div>

        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '25px' }}>
          <button 
            onClick={handleBack}
            style={{ 
              backgroundColor: '#006a4e', 
              color: 'white', 
              border: 'none', 
              padding: '12px 36px', 
              borderRadius: '50px', 
              fontWeight: '700', 
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,106,78,0.25)'
            }}
          >
            মূল পাতায় ফিরে যান
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;