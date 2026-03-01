import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, Info, ExternalLink } from 'lucide-react';

const Disclaimer = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header Area */}
      <div style={{ 
        backgroundColor: '#006a4e', 
        padding: '15px 20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Disclaimer</h2>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* Warning Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '25px', 
          padding: '25px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#e53935', marginBottom: '15px' }}>
            <AlertTriangle size={30} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>দায়মুক্তি নোটিশ</h1>
          </div>

          <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px' }}>
            <p style={{ marginBottom: '15px' }}>
              <strong>সতর্কীকরণ:</strong> ট্রেনকই (TrainKoi) বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অ্যাপ্লিকেশন বা ওয়েবসাইট নয়। আমরা কোনোভাবেই সরকারি প্রতিষ্ঠানের প্রতিনিধিত্ব করি না।
            </p>

            <div style={{ backgroundColor: '#fff8f1', borderLeft: '5px solid #fb8c00', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
              আমরা কেবল রেলওয়ে যাত্রীদের যাতায়াত সহজ করতে পাবলিকলি এভেইলঅ্যাবল (Publicly Available) তথ্যগুলো গুছিয়ে উপস্থাপন করি। 
            </div>

            <p style={{ marginBottom: '15px' }}>
              ট্রেনের রিয়েল-টাইম লোকেশন, ভাড়ার তালিকা বা স্টেশনের নাম যেকোনো সময় রেলওয়ে কর্তৃপক্ষ পরিবর্তন করতে পারে। ডাটা সোর্সের সীমাবদ্ধতার কারণে প্রদর্শিত তথ্যের সাথে বাস্তব সময়ের কিছুটা পার্থক্য হতে পারে।
            </p>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#e0f2f1', padding: '15px', borderRadius: '15px' }}>
              <Info size={20} color="#006a4e" style={{ marginTop: '4px', flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#004d40', fontSize: '14px' }}>
                নির্ভুল তথ্যের জন্য সর্বদা নিকটস্থ স্টেশন মাস্টার বা বাংলাদেশ রেলওয়ের অফিশিয়াল ওয়েবসাইট (eticket.railway.gov.bd) অনুসরণ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              backgroundColor: '#006a4e', 
              color: 'white', 
              border: 'none', 
              padding: '12px 40px', 
              borderRadius: '50px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,106,78,0.2)'
            }}
          >
            বুঝেছি, ফিরে যাই
          </button>
        </div>

      </div>
    </div>
  );
};

export default Disclaimer;