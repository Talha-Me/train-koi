import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, AlertTriangle, Info, ExternalLink, 
  ShieldAlert, Radio, Ticket, CheckCircle2 
} from 'lucide-react';

const Disclaimer = () => {
  const navigate = useNavigate();

  // Smart back navigation
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif", paddingBottom: '50px' }}>
      
      {/* Header Area */}
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
            আইনগত দায়মুক্তি নোটিশ (Legal Disclaimer)
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '25px 16px' }}>
        
        {/* Main Warning Card */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '28px 24px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          marginBottom: '20px',
          border: '1px solid #edf2f7'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#dc2626', marginBottom: '18px' }}>
            <ShieldAlert size={32} />
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
              TrainKoi ব্যবহারের সাধারণ শর্তাবলী ও দায়মুক্তি
            </h1>
          </div>

          <div style={{ lineHeight: '1.85', color: '#334155', fontSize: '15px' }}>
            
            {/* Clause 1: Non-Government Entity */}
            <div style={{ backgroundColor: '#fef2f2', borderLeft: '5px solid #ef4444', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <strong style={{ color: '#991b1b', display: 'block', marginBottom: '6px', fontSize: '15.5px' }}>
                ১. সরকারি বা প্রাতিষ্ঠানিক সম্পৃক্ততাহীনতা:
              </strong>
              <strong>TrainKoi (ট্রেনকই)</strong> কোনো সরকারি প্রতিষ্ঠান, বাংলাদেশ সরকার বা বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অঙ্গপ্রতিষ্ঠান কিংবা অনুমোদিত এজেন্ট নয়। এটি সাধারণ ট্রেন যাত্রীদের যাতায়াত সহজতর করার লক্ষ্যে সম্পূর্ণ স্বাধীন ও কমিউনিটি উদ্যোগে পরিচালিত একটি তথ্যভিত্তিক সহায়ক পোর্টাল।
            </div>

            {/* Clause 2: Crowdsourced Location & Accuracy */}
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: '#006a4e', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', marginBottom: '8px' }}>
                <Radio size={18} /> ২. লাইভ ট্রেন লোকেশনের নির্ভুলতা ও সীমাবদ্ধতা:
              </strong>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                প্ল্যাটফর্মে প্রদর্শিত ট্রেনের লাইভ লোকেশন ও গতি মূলত ট্রেনে ভ্রমণরত সহযাত্রীদের স্বেচ্ছায় শেয়ার করা জিপিএস সিগন্যাল (Crowdsourcing) এবং ওপেন ডেটা অ্যালগরিদমের সমন্বয়ে তৈরি হয়। ব্যবহারকারীর স্মার্টফোনের নেটওয়ার্ক কভারেজ, জিপিএস সিগন্যালের মান বা আবহাওয়াজনিত জটিলতার কারণে বাস্তব ট্রেনের অবস্থান ও প্রদর্শিত তথ্যের মাঝে কয়েক মিনিটের তারতম্য বা বিলম্ব (Delay) দেখা দিতে পারে।
              </p>
            </div>

            {/* Clause 3: Schedule, Fare & Notice Updates */}
            <div style={{ marginBottom: '20px' }}>
              <strong style={{ color: '#006a4e', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '16px', marginBottom: '8px' }}>
                <Info size={18} /> ৩. সময়সূচী, ভাড়া ও স্টেশনের তথ্য:
              </strong>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                রেলওয়ের শিডিউল, টিকেটের ভাড়া, হল্ট স্টেশন বা রুট সম্পর্কিত যে তথ্যগুলো এখানে প্রদর্শিত হয় তা বাংলাদেশ রেলওয়ের পাবলিক বিজ্ঞপ্তি অনুযায়ী নিয়মিত আপডেট করা হয়। তবে রেলওয়ে কর্তৃপক্ষ যেকোনো সময় পূর্ব ঘোষণা ছাড়াই সময়সূচী বা ভাড়া পরিবর্তনের একক ক্ষমতা সংরক্ষণ করে। তাই প্ল্যাটফর্মের তথ্যের ওপর ভিত্তি করে কোনো ট্রেন মিস হওয়া বা ক্ষতির জন্য ট্রেনকই কর্তৃপক্ষ দায়ী থাকবে না।
              </p>
            </div>

            {/* Clause 4: No Financial Transaction */}
            <div style={{ backgroundColor: '#fffbeb', borderLeft: '5px solid #f59e0b', padding: '16px', borderRadius: '12px', marginBottom: '22px' }}>
              <strong style={{ color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15.5px', marginBottom: '6px' }}>
                <Ticket size={18} /> ৪. কোনো আর্থিক লেনদেন বা টিকেট বিক্রয় নয়:
              </strong>
              ট্রেনকই কোনো প্রকার টিকেট বিক্রি বা বুকিং সেবা পরিচালনা করে না। প্ল্যাটফর্মে কোনো পেমেন্ট গেটওয়ে বা আর্থিক লেনদেন নেই। অনলাইন টিকেটের জন্য যাত্রীদের সবসময় বাংলাদেশ রেলওয়ের একমাত্র অনুমোদিত পোর্টাল ব্যবহার করার কঠোর পরামর্শ দেওয়া হচ্ছে।
            </div>

            {/* Official Link Guidance */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px', 
              backgroundColor: '#ecfdf5', 
              border: '1px solid #a7f3d0',
              padding: '16px', 
              borderRadius: '16px' 
            }}>
              <CheckCircle2 size={22} color="#006a4e" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '14px', color: '#065f46' }}>
                <strong>চূড়ান্ত তথ্য যাচাই:</strong> ভ্রমণের চূড়ান্ত নিশ্চয়তা, টিকেট বুকিং কিংবা রিফান্ডের জন্য সর্বদা নিকটস্থ স্টেশনের ঘোষণা অথবা বাংলাদেশ রেলওয়ের অফিশিয়াল ওয়েবসাইট{' '}
                <a 
                  href="https://eticket.railway.gov.bd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#006a4e', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                >
                  eticket.railway.gov.bd <ExternalLink size={13} />
                </a>{' '}
                অনুসরণ করুন।
              </div>
            </div>

          </div>
        </div>

        {/* Action Button */}
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
              boxShadow: '0 4px 15px rgba(0,106,78,0.25)',
              transition: 'background 0.2s'
            }}
          >
            বুঝেছি, মূল পেজে ফিরে যাই
          </button>
        </div>

      </div>
    </div>
  );
};

export default Disclaimer;