import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, ShieldCheck, Scale, AlertCircle, Info, Lock } from 'lucide-react';

const TermsOfService = () => {
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
      <div style={{ backgroundColor: '#006a4e', padding: '16px 20px', color: 'white', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '850px', margin: '0 auto' }}>
          <div onClick={handleBack} style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={26} />
          </div>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: '700' }}>
            ব্যবহারের শর্তাবলী (Terms of Service)
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
            <FileText size={32} />
            <div>
              <h1 style={{ margin: 0, fontSize: '23px', fontWeight: '800', color: '#0f172a' }}>
                ট্রেনকই (TrainKoi) ব্যবহারের নিয়ম ও শর্তাবলী
              </h1>
              <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                সর্বশেষ পরিমার্জন ও হালনাগাদ: ২০২৬
              </p>
            </div>
          </div>

          <p style={{ lineHeight: '1.85', color: '#475569', fontSize: '15px', textAlign: 'justify', marginBottom: '24px' }}>
            <strong>TrainKoi.com</strong> ওয়েবসাইট ও সেবা ব্যবহারে আপনাকে স্বাগতম। এই প্ল্যাটফর্মটি ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলী মেনে নিতে সম্মতি প্রকাশ করছেন। অনুগ্রহ করে সাইটটি ব্যবহারের পূর্বে এই শর্তসমূহ মনোযোগ সহকারে পড়ুন।
          </p>

          <div style={{ lineHeight: '1.85', color: '#334155', fontSize: '14.5px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Section 1 */}
            <div style={{ backgroundColor: '#f8fafc', padding: '18px', borderRadius: '16px', borderLeft: '4px solid #006a4e' }}>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} /> ১. সেবার প্রকৃতি ও প্ল্যাটফর্মের উদ্দেশ্য
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                ট্রেনকই একটি স্বাধীন, বেসরকারি ও কমিউনিটি-ভিত্তিক তথ্যসেবা প্ল্যাটফর্ম। এর মূল উদ্দেশ্য হলো বাংলাদেশ রেলওয়ের সাধারণ যাত্রীদের সুবিধার্থে ট্রেনের সময়সূচী, স্টেশন স্টপেজ, সম্ভাব্য বিলম্ব এবং লাইভ জিপিএস লোকেশন সহজভাবে উপস্থাপন করা। ট্রেনকই কোনো সরকারি পরিবহন সংস্থা, বাংলাদেশ রেলওয়ে বা সরকারের কোনো অফিশিয়াল অঙ্গপ্রতিষ্ঠান নয়।
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} /> ২. তথ্যের নির্ভুলতা ও দায়সীমা (Disclaimer of Warranties)
              </h3>
              <p style={{ margin: '0 0 8px 0', textAlign: 'justify' }}>
                প্ল্যাটফর্মে প্রদর্শিত তথ্যাবলী পাবলিক ডেটা এবং ট্রেনে অবস্থানরত যাত্রীদের ক্রাউডসোর্সড জিপিএস ফিডের মাধ্যমে সংগৃহীত হয়। আবহাওয়াজনিত কারণ, মোবাইল নেটওয়ার্কের ত্রুটি বা রেলওয়ের আকস্মিক শিডিউল পরিবর্তনের কারণে তথ্যে সাময়িক বিলম্ব বা অমিল দেখা দিতে পারে। 
              </p>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                ট্রেনকই প্ল্যাটফর্মে প্রদর্শিত তথ্যের ওপর ভিত্তি করে কোনো ট্রেন মিস করা, আর্থিক ক্ষতি বা অন্য কোনো অসুবিধার জন্য কর্তৃপক্ষ প্রত্যক্ষ বা পরোক্ষভাবে দায়ী থাকবে না। জরুরি ও গুরুত্বপূর্ণ সিদ্ধান্তের ক্ষেত্রে সর্বদা বাংলাদেশ রেলওয়ের অফিশিয়াল স্টেশন কাউন্টার বা ওয়েবসাইট অনুসরণ করুন।
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> ৩. ব্যবহারকারীর দায়িত্ব ও গ্রহণযোগ্য আচরণ (User Conduct)
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '6px' }}>আপনি সাইটের যেকোনো সেবা সম্পূর্ণ বৈধ ও ব্যক্তিগত কাজে ব্যবহার করবেন।</li>
                <li style={{ marginBottom: '6px' }}>প্ল্যাটফর্মে কোনো মিথ্যা, বিভ্রান্তিকর বা ভুয়া জিপিএস লোকেশন পুশ করার চেষ্টা করা সম্পূর্ণ নিষিদ্ধ।</li>
                <li style={{ marginBottom: '6px' }}>স্বয়ংক্রিয় বট, স্ক্র্যাপার বা অননুমোদিত কোড দিয়ে সার্ভারের স্বাভাবিক কার্যক্রমে ব্যাঘাত ঘটানো আইনত দণ্ডনীয়।</li>
              </ul>
            </div>

            {/* Section 4: Advertising & Google AdSense */}
            <div style={{ backgroundColor: '#f0fdf4', padding: '18px', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <h3 style={{ color: '#166534', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} /> ৪. তৃতীয় পক্ষের বিজ্ঞাপন ও গুগল অ্যাডসেন্স (Advertisements)
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                বিনামূল্যে সেবা সচল রাখতে ট্রেনকই প্ল্যাটফর্মে গুগল অ্যাডসেন্সসহ (Google AdSense) অনুমোদিত তৃতীয় পক্ষের বিজ্ঞাপন প্রদর্শন করা হতে পারে। এই বিজ্ঞাপনগুলোর বিষয়বস্তু ও লিঙ্কের নিয়ন্ত্রণ সংশ্লিষ্ট বিজ্ঞাপনদাতার। ব্যবহারকারী কোনো বিজ্ঞাপনী লিঙ্কে ক্লিক করলে তা সেই তৃতীয় পক্ষের নিজস্ব শর্তাবলী ও গোপনীয়তা নীতি দ্বারা পরিচালিত হবে।
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> ৫. বুদ্ধিবৃত্তিক সম্পত্তি ও কপিরাইট (Intellectual Property)
              </h3>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                ট্রেনকই প্ল্যাটফর্মের ডিজাইন, নিজস্ব টেক্সট কন্টেন্ট, লোগো এবং কোডবেস ট্রেনকই কর্তৃপক্ষের মেধাসম্পদ। পূর্বানুমতি ব্যতিরেকে বাণিজ্যিক উদ্দেশ্যে সাইটের কোনো অংশ পুনঃউৎপাদন, কপি বা বিক্রয় করা সম্পূর্ণ নিষিদ্ধ।
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 style={{ color: '#006a4e', margin: '0 0 8px 0', fontSize: '16.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} /> ৬. শর্তাবলী সংশোধন ও যোগাযোগ
              </h3>
              <p style={{ margin: '0 0 8px 0', textAlign: 'justify' }}>
                কর্তৃপক্ষ যেকোনো সময় পূর্বঘোষণা ছাড়াই এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। সংশোধিত শর্তাবলী সাইটে প্রকাশিত হওয়ার সাথে সাথে কার্যকর হবে।
              </p>
              <p style={{ margin: 0, textAlign: 'justify' }}>
                শর্তাবলী সম্পর্কে যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের অফিসিয়াল সাপোর্ট টিমের সাথে যোগাযোগ করতে পারেন: ইমেইল: <strong>support@trainkoi.com</strong> অথবা আমাদের <a href="/contact" style={{ color: '#006a4e', fontWeight: 'bold' }}>যোগাযোগ পেজ</a> পরিদর্শন করুন।
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
