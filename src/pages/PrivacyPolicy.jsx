import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldCheck, Lock, Eye, 
  MapPin, Cookie, ExternalLink, Mail, FileText, CheckCircle2, ArrowRight
} from 'lucide-react';
import Navbar from './components/Navbar';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "গোপনীয়তা নীতি (Privacy Policy) | TrainKoi";
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pp-root">
      <Navbar />

      {/* Mobile Sticky Header */}
      <div className="pp-mobile-header">
        <div className="pp-mobile-header-in">
          <div onClick={handleBack} className="pp-back-btn">
            <ChevronLeft size={24} />
          </div>
          <h2 className="pp-mobile-title">
            গোপনীয়তা নীতি (Privacy Policy)
          </h2>
        </div>
      </div>

      <div className="pp-container">
        {/* Desktop Breadcrumb & Hero */}
        <div className="pp-hero-banner">
          <div className="pp-badge">
            <ShieldCheck size={16} />
            <span>গুগল অ্যাডসেন্স ও ডাটা সুরক্ষা স্ট্যান্ডার্ড মেনে তৈরি</span>
          </div>
          <h1 className="pp-main-heading">ট্রেনকই (TrainKoi) গোপনীয়তা নীতি</h1>
          <p className="pp-sub-heading">
            সর্বশেষ পরিমার্জন ও কার্যকারিতা: ২০২৬ সংস্করণ • আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা আমাদের দায়িত্ব
          </p>
        </div>

        {/* 2-Column Desktop Layout */}
        <div className="pp-grid">
          {/* Left Column: Quick Navigation & Security Badges */}
          <aside className="pp-sidebar">
            <div className="pp-sidebar-card">
              <h3 className="pp-sidebar-title">নীতিমালার সূচিপত্র</h3>
              <nav className="pp-nav-links">
                <a href="#location-data" className="pp-nav-link">
                  <MapPin size={16} /> ১. লোকেশন ও ক্রাউডসোর্সিং
                </a>
                <a href="#log-files" className="pp-nav-link">
                  <FileText size={16} /> ২. লগ ফাইল ও অ্যানালিটিক্স
                </a>
                <a href="#adsense-cookies" className="pp-nav-link">
                  <Cookie size={16} /> ৩. গুগল অ্যাডসেন্স ও কুকিজ
                </a>
                <a href="#third-party" className="pp-nav-link">
                  <ExternalLink size={16} /> ৪. থার্ড-পার্টি ও বাহ্যিক লিংক
                </a>
                <a href="#children-privacy" className="pp-nav-link">
                  <Lock size={16} /> ৫. শিশু সুরক্ষা ও তথ্য নিরাপত্তা
                </a>
                <a href="#contact" className="pp-nav-link">
                  <Mail size={16} /> ৬. যোগাযোগ ও মতামত
                </a>
              </nav>

              <div className="pp-trust-box">
                <h4 className="pp-trust-title">আমাদের প্রতিশ্রুতি</h4>
                <ul className="pp-trust-list">
                  <li><CheckCircle2 size={16} color="#059669" /> কোনো ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করা হয় না</li>
                  <li><CheckCircle2 size={16} color="#059669" /> জিপিএস লোকেশন হিস্ট্রি সার্ভারে স্থায়ী সংরক্ষিত থাকে না</li>
                  <li><CheckCircle2 size={16} color="#059669" /> গুগল অ্যাডসেন্স ও DART কুকি নীতিমালা সম্পূর্ণ প্রযোজ্য</li>
                  <li><CheckCircle2 size={16} color="#059669" /> SSL 256-bit এনক্রিপ্ট সিকিউর ট্রান্সমিশন</li>
                </ul>
              </div>

              <div className="pp-contact-card">
                <Mail size={24} color="#006a4e" />
                <div>
                  <div className="pp-contact-head">সরাসরি সহায়তা</div>
                  <a href="mailto:support@trainkoi.com" className="pp-contact-email">support@trainkoi.com</a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Clauses */}
          <main className="pp-content">
            <div className="pp-card">
              <div className="pp-intro">
                <p>
                  <strong>TrainKoi.com</strong>-এ আপনার ব্যক্তিগত তথ্যের সুরক্ষা নিশ্চিত করা আমাদের সর্বোচ্চ অগ্রাধিকার। এই নীতিমালায় সুস্পষ্টভাবে ব্যাখ্যা করা হয়েছে যে, বাংলাদেশ রেলওয়ের লাইভ ট্রেন ট্র্যাকিং, ট্রেনের শিডিউল অনুসন্ধান এবং প্ল্যাটফর্ম সেবা ব্যবহারের সময় আমরা কীভাবে আপনার ডেটা সংগ্রহ, ব্যবহার ও নিরাপদ রাখি এবং গুগলের মতো থার্ড-পার্টি বিজ্ঞাপন পার্টনারদের সাথে কী কী শর্তে কাজ করি।
                </p>
              </div>

              {/* Section 1 */}
              <section id="location-data" className="pp-section pp-highlight-box">
                <h3 className="pp-sec-title">
                  <MapPin size={20} color="#006a4e" />
                  ১. লোকেশন ডেটা ও ক্রাউডসোর্সড ট্র্যাকিং (Location Data)
                </h3>
                <p>
                  আমাদের লাইভ ট্রেন ট্র্যাকিং প্ল্যাটফর্মটি কমিউনিটি ও ক্রাউডসোর্স ভিত্তিক। আপনি যখন স্বেচ্ছায় ট্রেনে বসে অবস্থান শেয়ার করতে সম্মতি দেন, তখন আপনার ডিভাইসের জিপিএস কো-অর্ডিনেটস (Latitude & Longitude) সাময়িকভাবে প্রসেস করা হয় কেবল ট্রেনের বর্তমান গতি ও স্টেশন দূরত্ব নির্ধারণের জন্য।
                </p>
                <p>
                  আমরা আপনার নাম, ফোন নম্বর, জাতীয় পরিচয়পত্র বা কোনো স্থায়ী ব্যক্তিগত প্রোফাইলের সাথে এই অবস্থান যুক্ত করি না এবং আপনার লোকেশন হিস্ট্রি কারও কাছে বাণিজ্যিকভাবে বিক্রি বা বিতরণ করি না।
                </p>
              </section>

              {/* Section 2 */}
              <section id="log-files" className="pp-section">
                <h3 className="pp-sec-title">
                  <FileText size={20} color="#006a4e" />
                  ২. লগ ফাইল ও সাইট অ্যানালিটিক্স (Log Files & Performance)
                </h3>
                <p>
                  অন্যান্য আধুনিক ওয়েবসাইটের মতো ট্রেনকই স্ট্যান্ডার্ড লগ ফাইল এবং ক্লাউড মনিটরিং ব্যবস্থা ব্যবহার করে। এর মধ্যে রয়েছে ইন্টারনেট প্রোটোকল (IP) অ্যাড্রেস, ব্রাউজারের ধরন, ইন্টারনেট সার্ভিস প্রোভাইডার (ISP), রেফারেল ও এক্সিট পেজ এবং তারিখ/সময়ের স্ট্যাম্প।
                </p>
                <p>
                  এই তথ্যগুলো কোনোভাবেই আপনার ব্যক্তিগত পরিচয়ের সাথে যুক্ত নয়; এগুলো কেবল সার্ভার ট্রাফিক মনিটরিং, সাইটের স্পিড বাড়ানো, নিরাপত্তা বৃদ্ধি এবং কারিগরি বাগ ফিক্স করার কাজে ব্যবহৃত হয়।
                </p>
              </section>

              {/* Section 3 */}
              <section id="adsense-cookies" className="pp-section pp-adsense-box">
                <h3 className="pp-sec-title pp-ads-green">
                  <Cookie size={20} color="#166534" />
                  ৩. গুগল অ্যাডসেন্স ও ডাবলক্লিক ডার্ট কুকিজ (Google AdSense & Cookies)
                </h3>
                <p>
                  গুগল (Google) একজন বিশ্বস্ত থার্ড-পার্টি ভেন্ডর হিসেবে আমাদের ওয়েবসাইটে বিজ্ঞাপন প্রদর্শনের জন্য কুকিজ (Cookies) ব্যবহার করে থাকে।
                </p>
                <ul className="pp-bullet-list">
                  <li>
                    গুগলের <strong>DART Cookie</strong> ব্যবহারের মাধ্যমে ব্যবহারকারী এই সাইট ও ইন্টারনেটের অন্যান্য সাইট পরিদর্শনের অতীত পছন্দের ওপর ভিত্তি করে প্রাসঙ্গিক বিজ্ঞাপন দেখতে পান।
                  </li>
                  <li>
                    ব্যবহারকারীরা চাইলে গুগলের নিজস্ব বিজ্ঞাপন পলিসি পাতা পরিদর্শন করে পার্সোনালাইজড কুকিজ ব্যবহার নিয়ন্ত্রণ বা বন্ধ করতে পারেন:{' '}
                    <a 
                      href="https://policies.google.com/technologies/ads" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="pp-link"
                    >
                      Google Ads Settings <ExternalLink size={13} />
                    </a>
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="third-party" className="pp-section">
                <h3 className="pp-sec-title">
                  <ExternalLink size={20} color="#006a4e" />
                  ৪. থার্ড-পার্টি ও বাহ্যিক লিংক (Third-Party Portals)
                </h3>
                <p>
                  যাত্রীদের সুবিধার্থে আমাদের প্ল্যাটফর্মে বাংলাদেশ রেলওয়ের অফিসিয়াল টিকিট ক্রয় পোর্টাল (eticket.railway.gov.bd) বা প্রয়োজনীয় সরকারি সেবার লিংক থাকতে পারে। বাহ্যিক সাইটগুলোর নিজস্ব স্বতন্ত্র গোপনীয়তা নীতি থাকে, যার ওপর ট্রেনকই-এর কোনো প্রশাসনিক নিয়ন্ত্রণ বা দায়ভার নেই।
                </p>
              </section>

              {/* Section 5 */}
              <section id="children-privacy" className="pp-section">
                <h3 className="pp-sec-title">
                  <Lock size={20} color="#006a4e" />
                  ৫. শিশু সুরক্ষা ও তথ্য নিরাপত্তা (Children's Privacy Protection)
                </h3>
                <p>
                  ইন্টারনেট ব্যবহারে শিশুদের গোপনীয়তা ও নিরাপত্তা নিশ্চিত করা আমাদের নৈতিক দায়িত্ব। আমরা জেনেশুনে ১৩ বছরের কম বয়সী অপ্রাপ্তবয়স্কদের কোনো ব্যক্তিগত তথ্য সংগ্রহ করি না। আমাদের সিস্টেমে সমস্ত ডেটা আন্তর্জাতিক মানসম্পন্ন ক্লাউড আর্কিটেকচারে সর্বোচ্চ এনক্রিপশনের মাধ্যমে সংরক্ষিত থাকে।
                </p>
              </section>

              {/* Section 6 */}
              <section id="contact" className="pp-section pp-contact-section">
                <h3 className="pp-sec-title">
                  <Mail size={20} color="#006a4e" />
                  ৬. যোগাযোগ ও মতামত
                </h3>
                <p>
                  আমাদের গোপনীয়তা নীতি নিয়ে আপনার কোনো জিজ্ঞাসা, অভিযোগ বা পরামর্শ থাকলে নির্দ্বিধায় যোগাযোগ করুন:
                </p>
                <div className="pp-email-box">
                  <strong>অফিসিয়াল সাপোর্ট ইমেইল:</strong>{' '}
                  <a href="mailto:support@trainkoi.com" className="pp-email-link">support@trainkoi.com</a>
                </div>
              </section>
            </div>

            {/* Back to Home CTA */}
            <div className="pp-cta-row">
              <button onClick={handleBack} className="pp-btn-back">
                মূল পাতায় ফিরে যান
              </button>
              <button onClick={() => navigate('/terms')} className="pp-btn-terms">
                ব্যবহারের শর্তাবলী দেখুন <ArrowRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .pp-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
        }

        .pp-mobile-header {
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
          .pp-mobile-header {
            display: block;
          }
        }
        .pp-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .pp-back-btn {
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .pp-mobile-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
        }

        .pp-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .pp-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003726 100%);
          border-radius: 24px;
          padding: 36px 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(0, 55, 38, 0.15);
          position: relative;
          overflow: hidden;
        }
        .pp-badge {
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
        .pp-main-heading {
          margin: 0 0 10px;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }
        .pp-sub-heading {
          margin: 0;
          font-size: 15px;
          color: #d1fae5;
          line-height: 1.6;
        }

        .pp-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .pp-grid {
            grid-template-columns: 1fr;
          }
        }

        .pp-sidebar {
          position: sticky;
          top: 80px;
        }
        .pp-sidebar-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .pp-sidebar-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #0f1f1a;
          border-bottom: 1.5px solid #e2ebe7;
          padding-bottom: 12px;
        }
        .pp-nav-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-nav-link {
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
        .pp-nav-link:hover {
          background: #e6f4ef;
          color: #006a4e;
          transform: translateX(4px);
        }
        .pp-trust-box {
          background: #f8fafc;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid #e2e8f0;
        }
        .pp-trust-title {
          margin: 0 0 10px;
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
        }
        .pp-trust-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-trust-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }
        .pp-contact-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 14px;
          padding: 14px;
        }
        .pp-contact-head {
          font-size: 12px;
          font-weight: 700;
          color: #065f46;
        }
        .pp-contact-email {
          font-size: 14px;
          font-weight: 800;
          color: #006a4e;
          text-decoration: none;
        }

        .pp-content {
          min-width: 0;
        }
        .pp-card {
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
          .pp-card {
            padding: 24px 18px;
          }
        }
        .pp-intro p {
          margin: 0;
          font-size: 16px;
          line-height: 1.85;
          color: #334155;
          text-align: justify;
        }
        .pp-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pp-sec-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #006a4e;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pp-section p {
          margin: 0;
          font-size: 15px;
          line-height: 1.85;
          color: #475569;
          text-align: justify;
        }
        .pp-highlight-box {
          background: #f8fafc;
          border-left: 4px solid #006a4e;
          padding: 20px;
          border-radius: 14px;
        }
        .pp-adsense-box {
          background: #f0fdf4;
          border: 1.5px solid #86efac;
          padding: 22px;
          border-radius: 16px;
        }
        .pp-sec-title.pp-ads-green {
          color: #166534;
        }
        .pp-bullet-list {
          margin: 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #334155;
          font-size: 14.5px;
          line-height: 1.7;
        }
        .pp-link {
          color: #006a4e;
          font-weight: 800;
          text-decoration: underline;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .pp-contact-section {
          border-top: 1.5px dashed #e2ebe7;
          padding-top: 24px;
        }
        .pp-email-box {
          background: #f1f5f9;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 15px;
          color: #1e293b;
        }
        .pp-email-link {
          color: #006a4e;
          font-weight: 800;
          text-decoration: none;
        }

        .pp-cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 24px;
        }
        .pp-btn-back {
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
        .pp-btn-back:hover {
          background: #004d39;
          transform: translateY(-2px);
        }
        .pp-btn-terms {
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
        .pp-btn-terms:hover {
          background: #ecfdf5;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
