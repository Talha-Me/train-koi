import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '15px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: '5px' }}>
            <ChevronLeft size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Privacy Policy</h2>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#43a047', marginBottom: '20px' }}>
            <ShieldCheck size={30} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>গোপনীয়তা নীতি</h1>
          </div>

          <div style={{ lineHeight: '1.8', color: '#444', fontSize: '15px' }}>
            <p>ট্রেনকই (TrainKoi)-তে আপনার গোপনীয়তা রক্ষা করা আমাদের অঙ্গীকার।</p>
            
            <h3 style={{ color: '#006a4e' }}>১. তথ্য সংগ্রহ</h3>
            <p>আমরা সরাসরি আপনার নাম বা মোবাইল নম্বর সংগ্রহ করি না। তবে অ্যাপের অভিজ্ঞতা উন্নত করতে আপনার ব্রাউজার টাইপ এবং আইপি অ্যাড্রেস লগ ফাইলে জমা হতে পারে।</p>

            <h3 style={{ color: '#006a4e' }}>২. গুগল অ্যাডসেন্স ও কুকিজ</h3>
            <p>আমরা বিজ্ঞাপন দেখানোর জন্য Google AdSense ব্যবহার করি। গুগল আপনার ব্রাউজিং ডেটার ওপর ভিত্তি করে বিজ্ঞাপন দেখাতে 'Cookies' ব্যবহার করে। আপনি চাইলে গুগলের অ্যাড সেটিংস থেকে এটি বন্ধ করতে পারেন।</p>

            <h3 style={{ color: '#006a4e' }}>৩. যোগাযোগ</h3>
            <p>আমাদের পলিসি নিয়ে কোনো প্রশ্ন থাকলে আমাদের ইমেইল করুন: <strong>support@trainkoi.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;