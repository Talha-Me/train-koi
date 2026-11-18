import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, FileText, ShieldCheck, Scale, 
  AlertCircle, Info, Lock, CheckCircle2, ArrowRight, Mail
} from 'lucide-react';
import Navbar from './components/Navbar';

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
    <div className="tos-root">
      <Navbar />

      {/* Mobile Header */}
      <div className="tos-mobile-header">
        <div className="tos-mobile-header-in">
          <div onClick={handleBack} className="tos-back-btn">
            <ChevronLeft size={24} />
          </div>
          <h2 className="tos-mobile-title">
            ব্যবহারের শর্তাবলী (Terms of Service)
          </h2>
        </div>
      </div>

      <div className="tos-container">
        {/* Desktop Hero Banner */}
        <div className="tos-hero-banner">
          <div className="tos-badge">
            <Scale size={16} />
            <span>আইনগত ও স্বচ্ছ নীতিমালা ২০২৬</span>
          </div>
          <h1 className="tos-main-heading">ট্রেনকই (TrainKoi) ব্যবহারের নিয়ম ও শর্তাবলী</h1>
          <p className="tos-sub-heading">
            সর্বশেষ পরিমার্জন ও হালনাগাদ: ২০২৬ • ট্রেনকই প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তসমূহে সম্মতি প্রকাশ করছেন
          </p>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="tos-grid">
          {/* Left Column: Table of Contents & Quick Facts */}
          <aside className="tos-sidebar">
            <div className="tos-sidebar-card">
              <h3 className="tos-sidebar-title">শর্তাবলীর সূচিপত্র</h3>
              <nav className="tos-nav-links">
                <a href="#service-nature" className="tos-nav-link">
                  <Info size={16} /> ১. সেবার প্রকৃতি ও উদ্দেশ্য
                </a>
                <a href="#disclaimer-warranties" className="tos-nav-link">
                  <Scale size={16} /> ২. তথ্যের নির্ভুলতা ও দায়সীমা
                </a>
                <a href="#user-conduct" className="tos-nav-link">
                  <ShieldCheck size={16} /> ৩. ব্যবহারকারীর আচরণ
                </a>
                <a href="#adsense-terms" className="tos-nav-link">
                  <Lock size={16} /> ৪. বিজ্ঞাপন ও গুগল অ্যাডসেন্স
                </a>
                <a href="#intellectual-prop" className="tos-nav-link">
                  <AlertCircle size={16} /> ৫. বুদ্ধিবৃত্তিক সম্পত্তি
                </a>
                <a href="#amendments" className="tos-nav-link">
                  <FileText size={16} /> ৬. শর্তাবলী সংশোধন ও সহায়তা
                </a>
              </nav>

              <div className="tos-summary-box">
                <h4 className="tos-summary-title">সংক্ষিপ্ত মূলনীতি</h4>
                <ul className="tos-summary-list">
                  <li><CheckCircle2 size={16} color="#059669" /> ট্রেনকই একটি স্বাধীন কমিউনিটি পোর্টাল</li>
                  <li><CheckCircle2 size={16} color="#059669" /> এটি কোনো অফিশিয়াল সরকারি পরিবহন সংস্থা নয়</li>
                  <li><CheckCircle2 size={16} color="#059669" /> লাইভ ট্র্যাকিং ক্রাউডসোর্সড ডেটার ওপর নির্ভরশীল</li>
                  <li><CheckCircle2 size={16} color="#059669" /> সমস্ত তথ্য ১০০% বিনামূল্যে সর্বসাধারণের জন্য</li>
                </ul>
              </div>

              <div className="tos-contact-card">
                <Mail size={22} color="#006a4e" />
                <div>
                  <div className="tos-contact-head">সহায়তা বা আইনি জিজ্ঞাসা</div>
                  <a href="mailto:support@trainkoi.com" className="tos-contact-email">support@trainkoi.com</a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Clauses */}
          <main className="tos-content">
            <div className="tos-card">
              <div className="tos-intro">
                <p>
                  <strong>TrainKoi.com</strong> ওয়েবসাইট ও সেবা ব্যবহারে আপনাকে আন্তরিক স্বাগতম। এই প্ল্যাটফর্মটি ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলী সম্পূর্ণভাবে মেনে নিতে সম্মতি জ্ঞাপন করছেন। অনুগ্রহ করে সাইটটি ব্যবহারের পূর্বে এই শর্তসমূহ মনোযোগ সহকারে পর্যবেক্ষণ করুন।
                </p>
              </div>

              {/* Section 1 */}
              <section id="service-nature" className="tos-section tos-highlight-box">
                <h3 className="tos-sec-title">
                  <Info size={20} color="#006a4e" />
                  ১. সেবার প্রকৃতি ও প্ল্যাটফর্মের উদ্দেশ্য (Platform Purpose)
                </h3>
                <p>
                  ট্রেনকই একটি স্বাধীন, বেসরকারি ও কমিউনিটি-ভিত্তিক তথ্যসেবা প্ল্যাটফর্ম। এর মূল উদ্দেশ্য হলো বাংলাদেশ রেলওয়ের সাধারণ যাত্রী ও ভ্রমণকারীদের সুবিধার্থে ট্রেনের সময়সূচী, স্টেশন স্টপেজ, প্ল্যাটফর্ম তথ্য, সম্ভাব্য বিলম্ব এবং লাইভ জিপিএস লোকেশন সহজ ও আধুনিক উপায়ে উপস্থাপন করা।
                </p>
                <p>
                  ট্রেনকই কোনো সরকারি পরিবহন সংস্থা, বাংলাদেশ রেলওয়ে (Bangladesh Railway) বা সরকারের কোনো অফিশিয়াল অঙ্গপ্রতিষ্ঠান নয়। আমরা রেলওয়ের টিকিট বিক্রির সাথে জড়িত নই।
                </p>
              </section>

              {/* Section 2 */}
              <section id="disclaimer-warranties" className="tos-section">
                <h3 className="tos-sec-title">
                  <Scale size={20} color="#006a4e" />
                  ২. তথ্যের নির্ভুলতা ও দায়সীমা (Disclaimer of Warranties)
                </h3>
                <p>
                  প্ল্যাটফর্মে প্রদর্শিত তথ্যাবলী পাবলিক ডেটা এবং ট্রেনে অবস্থানরত যাত্রী ও ট্রেন মাস্টারদের ক্রাউডসোর্সড জিপিএস ফিডের মাধ্যমে সংগৃহীত হয়। আবহাওয়াজনিত কারণ, মোবাইল নেটওয়ার্কের সীমাবদ্ধতা বা রেলওয়ের আকস্মিক শিডিউল পরিবর্তনের কারণে তথ্যে সাময়িক বিলম্ব বা অমিল দেখা দিতে পারে।
                </p>
                <p>
                  ট্রেনকই প্ল্যাটফর্মে প্রদর্শিত তথ্যের ওপর একক ভিত্তি করে কোনো ট্রেন মিস করা, সময় নষ্ট বা আর্থিক ক্ষতির জন্য ট্রেনকই কর্তৃপক্ষ প্রত্যক্ষ বা পরোক্ষভাবে দায়ী থাকবে না। যেকোনো জরুরি ও গুরুত্বপূর্ণ সিদ্ধান্তের ক্ষেত্রে সর্বদা বাংলাদেশ রেলওয়ের অফিশিয়াল স্টেশন কাউন্টার অথবা <strong>১৬৪৫৯</strong> রেলওয়ে হেল্পলাইন অনুসরণ করুন।
                </p>
              </section>

              {/* Section 3 */}
              <section id="user-conduct" className="tos-section">
                <h3 className="tos-sec-title">
                  <ShieldCheck size={20} color="#006a4e" />
                  ৩. ব্যবহারকারীর দায়িত্ব ও গ্রহণযোগ্য আচরণ (User Conduct)
                </h3>
                <ul className="tos-bullet-list">
                  <li>আপনি সাইটের যেকোনো সেবা সম্পূর্ণ বৈধ, ব্যক্তিগত ও জনহিতকর কাজে ব্যবহার করবেন।</li>
                  <li>প্ল্যাটফর্মে কোনো মিথ্যা, বিভ্রান্তিকর বা ভুয়া জিপিএস লোকেশন পুশ করার অপচেষ্টা কঠোরভাবে নিষিদ্ধ এবং ট্র্যাকযোগ্য।</li>
                  <li>স্বয়ংক্রিয় বট, ক্রলার, স্ক্র্যাপার বা অননুমোদিত কোড দিয়ে সার্ভারের স্বাভাবিক কার্যক্রমে ব্যাঘাত ঘটানো আইনত দণ্ডনীয়।</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="adsense-terms" className="tos-section tos-adsense-box">
                <h3 className="tos-sec-title tos-ads-green">
                  <Lock size={20} color="#166534" />
                  ৪. তৃতীয় পক্ষের বিজ্ঞাপন ও গুগল অ্যাডসেন্স (Advertisements)
                </h3>
                <p>
                  বিনামূল্যে সেবা নিরবচ্ছিন্নভাবে সচল রাখতে ট্রেনকই প্ল্যাটফর্মে গুগল অ্যাডসেন্সসহ (Google AdSense) অনুমোদিত তৃতীয় পক্ষের বিজ্ঞাপন প্রদর্শন করা হতে পারে। এই বিজ্ঞাপনগুলোর বিষয়বস্তু ও লিঙ্কের নিয়ন্ত্রণ সংশ্লিষ্ট বিজ্ঞাপনদাতার। ব্যবহারকারী কোনো বিজ্ঞাপনী লিঙ্কে ক্লিক করলে তা সেই তৃতীয় পক্ষের নিজস্ব শর্তাবলী ও গোপনীয়তা নীতি দ্বারা পরিচালিত হবে।
                </p>
              </section>

              {/* Section 5 */}
              <section id="intellectual-prop" className="tos-section">
                <h3 className="tos-sec-title">
                  <AlertCircle size={20} color="#006a4e" />
                  ৫. বুদ্ধিবৃত্তিক সম্পত্তি ও কপিরাইট (Intellectual Property)
                </h3>
                <p>
                  ট্রেনকই প্ল্যাটফর্মের ডিজাইন, নিজস্ব টেক্সট কন্টেন্ট, ব্র্যান্ডিং লোগো এবং কোডবেস ট্রেনকই কর্তৃপক্ষের মেধাসম্পদ। পূর্বানুমতি ব্যতিরেকে বাণিজ্যিক উদ্দেশ্যে সাইটের কোনো অংশ পুনঃউৎপাদন, পাইরেসি বা অনুলিপি করা সম্পূর্ণ নিষিদ্ধ।
                </p>
              </section>

              {/* Section 6 */}
              <section id="amendments" className="tos-section tos-amend-section">
                <h3 className="tos-sec-title">
                  <FileText size={20} color="#006a4e" />
                  ৬. শর্তাবলী সংশোধন ও যোগাযোগ
                </h3>
                <p>
                  কর্তৃপক্ষ যেকোনো সময় পূর্বঘোষণা ছাড়াই এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার পূর্ণ অধিকার সংরক্ষণ করে। সংশোধিত শর্তাবলী সাইটে প্রকাশিত হওয়ার সাথে সাথে কার্যকর বলে বিবেচিত হবে।
                </p>
                <div className="tos-contact-row">
                  <span>যেকোনো প্রশ্ন বা সহায়তার জন্য যোগাযোগ করুন:</span>
                  <a href="mailto:support@trainkoi.com" className="tos-email-link">support@trainkoi.com</a>
                </div>
              </section>
            </div>

            {/* Bottom Navigation CTAs */}
            <div className="tos-cta-row">
              <button onClick={handleBack} className="tos-btn-back">
                মূল পাতায় ফিরে যান
              </button>
              <button onClick={() => navigate('/disclaimer')} className="tos-btn-disc">
                দায়মুক্তি নোটিশ দেখুন <ArrowRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .tos-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
        }

        .tos-mobile-header {
          display: none;
          background-color: #006a4e;
          padding: 16px 20px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
          .tos-mobile-header {
            display: block;
          }
        }
        .tos-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .tos-back-btn {
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .tos-mobile-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
        }

        .tos-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .tos-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003726 100%);
          border-radius: 24px;
          padding: 36px 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(0, 55, 38, 0.15);
        }
        .tos-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(110, 231, 183, 0.18);
          border: 1px solid rgba(110, 231, 183, 0.35);
          color: #6ee7b7;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .tos-main-heading {
          margin: 0 0 10px;
          font-size: 28px;
          font-weight: 800;
        }
        .tos-sub-heading {
          margin: 0;
          font-size: 15px;
          color: #d1fae5;
          line-height: 1.6;
        }

        .tos-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .tos-grid {
            grid-template-columns: 1fr;
          }
        }

        .tos-sidebar {
          position: sticky;
          top: 80px;
        }
        .tos-sidebar-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .tos-sidebar-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #0f1f1a;
          border-bottom: 1.5px solid #e2ebe7;
          padding-bottom: 12px;
        }
        .tos-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tos-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #475569;
          text-decoration: none;
          padding: 10px 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .tos-nav-link:hover {
          background: #e6f4ef;
          color: #006a4e;
          transform: translateX(4px);
        }

        .tos-summary-box {
          background: #f8fafc;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid #e2e8f0;
        }
        .tos-summary-title {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
        }
        .tos-summary-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tos-summary-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }

        .tos-contact-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 14px;
          padding: 14px;
        }
        .tos-contact-head {
          font-size: 12px;
          font-weight: 700;
          color: #065f46;
        }
        .tos-contact-email {
          font-size: 14px;
          font-weight: 800;
          color: #006a4e;
          text-decoration: none;
        }

        .tos-content {
          min-width: 0;
        }
        .tos-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 24px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        @media (max-width: 640px) {
          .tos-card {
            padding: 24px 18px;
          }
        }

        .tos-intro p {
          margin: 0;
          font-size: 16px;
          line-height: 1.85;
          color: #334155;
          text-align: justify;
        }
        .tos-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tos-sec-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #006a4e;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tos-section p {
          margin: 0;
          font-size: 15px;
          line-height: 1.85;
          color: #475569;
          text-align: justify;
        }
        .tos-highlight-box {
          background: #f8fafc;
          border-left: 4px solid #006a4e;
          padding: 20px;
          border-radius: 14px;
        }
        .tos-adsense-box {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          padding: 22px;
          border-radius: 16px;
        }
        .tos-sec-title.tos-ads-green {
          color: #166534;
        }
        .tos-bullet-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #334155;
          font-size: 14.5px;
          line-height: 1.7;
        }
        .tos-amend-section {
          border-top: 1.5px dashed #e2ebe7;
          padding-top: 24px;
        }
        .tos-contact-row {
          background: #f1f5f9;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 14.5px;
        }
        .tos-email-link {
          color: #006a4e;
          font-weight: 800;
          text-decoration: none;
        }

        .tos-cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 24px;
        }
        .tos-btn-back {
          background: #006a4e;
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tos-btn-back:hover {
          background: #004d39;
          transform: translateY(-2px);
        }
        .tos-btn-disc {
          background: #ffffff;
          color: #006a4e;
          border: 1.5px solid #006a4e;
          padding: 12px 24px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .tos-btn-disc:hover {
          background: #ecfdf5;
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
