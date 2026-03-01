import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, Scale } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '15px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: '5px' }}>
            <ChevronLeft size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Terms of Service</h2>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fb8c00', marginBottom: '20px' }}>
            <FileText size={30} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>ব্যবহারের শর্তাবলী</h1>
          </div>

          <div style={{ lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
            <h3 style={{ color: '#006a4e' }}>১. সাধারণ নিয়ম</h3>
            <p>ট্রেনকই একটি তথ্যসেবামূলক প্ল্যাটফর্ম। এখানে প্রদর্শিত তথ্য শুধুমাত্র ব্যক্তিগত এবং জনকল্যাণমূলক ব্যবহারের জন্য।</p>

            <h3 style={{ color: '#006a4e' }}>২. তথ্যের সীমাবদ্ধতা</h3>
            <p>আমরা বাংলাদেশ রেলওয়ের পাবলিক ডাটা ব্যবহার করি। কারিগরি কারণে তথ্যের আপডেট হতে কিছুটা দেরি হতে পারে। তাই জরুরি প্রয়োজনে রেলওয়ের অফিশিয়াল সোর্স যাচাই করুন।</p>

            <h3 style={{ color: '#006a4e' }}>৩. কপিরাইট</h3>
            <p>এই সাইটের কোনো কন্টেন্ট, লোগো বা কোড অনুমতি ছাড়া বাণিজ্যিক উদ্দেশ্যে কপি করা সম্পূর্ণ নিষিদ্ধ।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;