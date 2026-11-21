import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, AlertTriangle, Info, ExternalLink, 
  ShieldAlert, Radio, Ticket, CheckCircle2, PhoneCall, ArrowRight, ShieldCheck
} from 'lucide-react';
import Navbar from './components/Navbar';

const Disclaimer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "আইনগত দায়মুক্তি নোটিশ (Disclaimer) | TrainKoi";
    window.scrollTo(0, 0);
  }, []);

  // Smart back navigation
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="disc-root">
      <Navbar />

      {/* Mobile Top Header */}
      <div className="disc-mobile-header">
        <div className="disc-mobile-header-in">
          <div onClick={handleBack} className="disc-back-btn">
            <ChevronLeft size={24} />
          </div>
          <h2 className="disc-mobile-title">
            আইনগত দায়মুক্তি নোটিশ (Legal Disclaimer)
          </h2>
        </div>
      </div>

      <div className="disc-container">
        {/* Desktop Hero Banner */}
        <div className="disc-hero-banner">
          <div className="disc-badge">
            <ShieldAlert size={16} />
            <span>স্বচ্ছতা ও আইনগত দায়মুক্তি ঘোষণা ২০২৬</span>
          </div>
          <h1 className="disc-main-heading">ট্রেনকই (TrainKoi) দায়মুক্তি ও ব্যবহারিক সতর্কবার্তা</h1>
          <p className="disc-sub-heading">
            ট্রেনকই সাধারণ ট্রেন যাত্রীদের সুবিধার্থে পরিচালিত একটি উন্মুক্ত তথ্যসেবা প্ল্যাটফর্ম। সেবা গ্রহণের পূর্বে এই নোটিশটি পড়ে নেওয়া জরুরি।
          </p>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="disc-grid">
          {/* Left Column: Official Sources & Helpline */}
          <aside className="disc-sidebar">
            <div className="disc-sidebar-card">
              <h3 className="disc-sidebar-title">সংক্ষিপ্ত দায়মুক্তি বিবরণ</h3>
              <div className="disc-point-list">
                <div className="disc-point-item">
                  <span className="disc-point-num">১</span>
                  <div>
                    <strong>অ-সরকারি সত্ত্বা</strong>
                    <p>ট্রেনকই কোনো সরকারি পরিবহন সংস্থা বা বাংলাদেশ রেলওয়ের অঙ্গপ্রতিষ্ঠান নয়।</p>
                  </div>
                </div>
                <div className="disc-point-item">
                  <span className="disc-point-num">২</span>
                  <div>
                    <strong>কোনো টিকিট বিক্রি নয়</strong>
                    <p>আমরা কোনো টিকিট বিক্রি করি না বা আর্থিক লেনদেন করি না।</p>
                  </div>
                </div>
                <div className="disc-point-item">
                  <span className="disc-point-num">৩</span>
                  <div>
                    <strong>ক্রাউডসোর্সড জিপিএস</strong>
                    <p>লাইভ ট্র্যাকিং যাত্রীদের শেয়ার করা নেটওয়ার্ক ও ওপেন ডেটার ওপর নির্ভরশীল।</p>
                  </div>
                </div>
              </div>

              {/* Official Helpline Card */}
              <div className="disc-helpline-card">
                <div className="disc-hl-head">
                  <PhoneCall size={20} color="#006a4e" />
                  <span>বাংলাদেশ রেলওয়ে অফিশিয়াল হেল্পলাইন</span>
                </div>
                <div className="disc-hl-number">১৬৪৫৯</div>
                <p className="disc-hl-desc">জরুরি শিডিউল ও সরাসরি সহযোগিতার জন্য কল করুন</p>
              </div>

              <div className="disc-ticket-portal">
                <ExternalLink size={18} color="#006a4e" />
                <div>
                  <div className="disc-tp-head">অনলাইন টিকিট পোর্টাল</div>
                  <a 
                    href="https://eticket.railway.gov.bd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="disc-tp-link"
                  >
                    eticket.railway.gov.bd
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Clauses */}
          <main className="disc-content">
            <div className="disc-card">
              {/* Clause 1: Non-Government Entity */}
              <div className="disc-alert-box disc-red-alert">
                <div className="disc-alert-icon">
                  <ShieldAlert size={28} color="#dc2626" />
                </div>
                <div>
                  <h3 className="disc-alert-title disc-red-title">
                    ১. সরকারি বা প্রাতিষ্ঠানিক সম্পৃক্ততাহীনতা (Non-Government Entity)
                  </h3>
                  <p className="disc-alert-p">
                    <strong>TrainKoi (ট্রেনকই)</strong> কোনো সরকারি প্রতিষ্ঠান, বাংলাদেশ সরকার বা বাংলাদেশ রেলওয়ের (Bangladesh Railway) অফিশিয়াল অঙ্গপ্রতিষ্ঠান কিংবা অনুমোদিত এজেন্ট নয়। এটি সাধারণ ট্রেন যাত্রীদের যাতায়াত সহজতর করার লক্ষ্যে সম্পূর্ণ স্বাধীন ও কমিউনিটি উদ্যোগে পরিচালিত একটি তথ্যভিত্তিক সহায়ক পোর্টাল।
                  </p>
                </div>
              </div>

              {/* Clause 2: Crowdsourced Location & Accuracy */}
              <section className="disc-section">
                <h3 className="disc-sec-title">
                  <Radio size={20} color="#006a4e" />
                  ২. লাইভ ট্রেন লোকেশনের নির্ভুলতা ও সীমাবদ্ধতা (Crowdsourced GPS)
                </h3>
                <p>
                  প্ল্যাটফর্মে প্রদর্শিত ট্রেনের লাইভ লোকেশন ও গতি মূলত ট্রেনে ভ্রমণরত সহযাত্রীদের স্বেচ্ছায় শেয়ার করা জিপিএস সিগন্যাল (Crowdsourcing) এবং ওপেন ডেটা অ্যালগরিদমের সমন্বয়ে তৈরি হয়।
                </p>
                <p>
                  ব্যবহারকারীর স্মার্টফোনের নেটওয়ার্ক কভারেজ, জিপিএস সিগন্যালের মান বা আবহাওয়াজনিত জটিলতার কারণে বাস্তব ট্রেনের অবস্থান ও প্রদর্শিত তথ্যের মাঝে কয়েক মিনিটের তারতম্য বা বিলম্ব (Delay) দেখা দিতে পারে।
                </p>
              </section>

              {/* Clause 3: Schedule, Fare & Notice Updates */}
              <section className="disc-section">
                <h3 className="disc-sec-title">
                  <Info size={20} color="#006a4e" />
                  ৩. সময়সূচী, ভাড়া ও স্টেশনের তথ্য (Timetable & Fares)
                </h3>
                <p>
                  রেলওয়ের শিডিউল, টিকেটের ভাড়া, হল্ট স্টেশন বা রুট সম্পর্কিত যে তথ্যগুলো এখানে প্রদর্শিত হয় তা বাংলাদেশ রেলওয়ের পাবলিক বিজ্ঞপ্তি অনুযায়ী নিয়মিত আপডেট করা হয়।
                </p>
                <p>
                  তবে রেলওয়ে কর্তৃপক্ষ যেকোনো সময় পূর্ব ঘোষণা ছাড়াই সময়সূচী বা ভাড়া পরিবর্তনের একক ক্ষমতা সংরক্ষণ করে। তাই প্ল্যাটফর্মের তথ্যের ওপর ভিত্তি করে কোনো ট্রেন মিস হওয়া বা ক্ষতির জন্য ট্রেনকই কর্তৃপক্ষ প্রত্যক্ষ বা পরোক্ষভাবে দায়ী থাকবে না।
                </p>
              </section>

              {/* Clause 4: No Financial Transaction */}
              <div className="disc-alert-box disc-amber-alert">
                <div className="disc-alert-icon">
                  <Ticket size={28} color="#d97706" />
                </div>
                <div>
                  <h3 className="disc-alert-title disc-amber-title">
                    ৪. কোনো আর্থিক লেনদেন বা টিকেট বিক্রয় নয় (No Financial Transactions)
                  </h3>
                  <p className="disc-alert-p">
                    ট্রেনকই কোনো প্রকার টিকেট বিক্রি বা বুকিং সেবা পরিচালনা করে না। প্ল্যাটফর্মে কোনো পেমেন্ট গেটওয়ে বা আর্থিক লেনদেন নেই। অনলাইন টিকেটের জন্য যাত্রীদের সবসময় বাংলাদেশ রেলওয়ের একমাত্র অনুমোদিত পোর্টাল (eticket.railway.gov.bd) ব্যবহার করার কঠোর পরামর্শ দেওয়া হচ্ছে।
                  </p>
                </div>
              </div>

              {/* Official Link Guidance */}
              <div className="disc-official-box">
                <CheckCircle2 size={24} color="#006a4e" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong className="disc-official-title">চূড়ান্ত তথ্য যাচাইয়ের পরামর্শ:</strong>
                  <p className="disc-official-desc">
                    ভ্রমণের চূড়ান্ত নিশ্চয়তা, টিকেট বুকিং কিংবা রিফান্ডের জন্য সর্বদা নিকটস্থ স্টেশনের অফিশিয়াল ঘোষণা অথবা বাংলাদেশ রেলওয়ের ওয়েবসাইট{' '}
                    <a 
                      href="https://eticket.railway.gov.bd" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="disc-official-link"
                    >
                      eticket.railway.gov.bd <ExternalLink size={13} />
                    </a>{' '}
                    অনুসরণ করুন।
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Navigation CTAs */}
            <div className="disc-cta-row">
              <button onClick={handleBack} className="disc-btn-back">
                বুঝেছি, মূল পেজে ফিরে যাই
              </button>
              <button onClick={() => navigate('/privacy')} className="disc-btn-privacy">
                গোপনীয়তা নীতি পড়ুন <ArrowRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .disc-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
        }

        .disc-mobile-header {
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
          .disc-mobile-header {
            display: block;
          }
        }
        .disc-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .disc-back-btn {
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .disc-mobile-title {
          margin: 0;
          font-size: 19px;
          font-weight: 700;
        }

        .disc-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .disc-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003726 100%);
          border-radius: 24px;
          padding: 36px 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(0, 55, 38, 0.15);
        }
        .disc-badge {
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
        .disc-main-heading {
          margin: 0 0 10px;
          font-size: 28px;
          font-weight: 800;
        }
        .disc-sub-heading {
          margin: 0;
          font-size: 15px;
          color: #d1fae5;
          line-height: 1.6;
        }

        .disc-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .disc-grid {
            grid-template-columns: 1fr;
          }
        }

        .disc-sidebar {
          position: sticky;
          top: 80px;
        }
        .disc-sidebar-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .disc-sidebar-title {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          color: #0f1f1a;
          border-bottom: 1.5px solid #e2ebe7;
          padding-bottom: 12px;
        }
        .disc-point-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .disc-point-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .disc-point-num {
          flex: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e6f4ef;
          color: #006a4e;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 800;
        }
        .disc-point-item strong {
          display: block;
          font-size: 14px;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .disc-point-item p {
          margin: 0;
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
        }

        .disc-helpline-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #e6f4ef 100%);
          border: 1px solid #b7e4d0;
          border-radius: 16px;
          padding: 18px;
          text-align: center;
        }
        .disc-hl-head {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: #065f46;
          margin-bottom: 6px;
        }
        .disc-hl-number {
          font-size: 32px;
          font-weight: 900;
          color: #006a4e;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .disc-hl-desc {
          margin: 0;
          font-size: 11.5px;
          color: #047857;
        }

        .disc-ticket-portal {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
        }
        .disc-tp-head {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }
        .disc-tp-link {
          font-size: 13.5px;
          font-weight: 800;
          color: #006a4e;
          text-decoration: none;
        }

        .disc-content {
          min-width: 0;
        }
        .disc-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 24px rgba(0,0,0,0.03);
          display: flex;
          flex-direction: column;
          gap: 26px;
        }
        @media (max-width: 640px) {
          .disc-card {
            padding: 24px 18px;
          }
        }

        .disc-alert-box {
          display: flex;
          gap: 16px;
          padding: 22px;
          border-radius: 18px;
        }
        .disc-alert-icon {
          flex: none;
        }
        .disc-red-alert {
          background: #fef2f2;
          border: 1.5px solid #fecaca;
        }
        .disc-red-title {
          color: #991b1b;
        }
        .disc-amber-alert {
          background: #fffbeb;
          border: 1.5px solid #fde68a;
        }
        .disc-amber-title {
          color: #92400e;
        }
        .disc-alert-title {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 800;
        }
        .disc-alert-p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.8;
          color: #334155;
          text-align: justify;
        }

        .disc-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .disc-sec-title {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #006a4e;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .disc-section p {
          margin: 0;
          font-size: 15px;
          line-height: 1.85;
          color: #475569;
          text-align: justify;
        }

        .disc-official-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #ecfdf5;
          border: 1.5px solid #a7f3d0;
          padding: 20px;
          border-radius: 16px;
        }
        .disc-official-title {
          font-size: 15px;
          color: #065f46;
          display: block;
          margin-bottom: 4px;
        }
        .disc-official-desc {
          margin: 0;
          font-size: 14px;
          color: #065f46;
          line-height: 1.6;
        }
        .disc-official-link {
          color: #006a4e;
          font-weight: 800;
          text-decoration: underline;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }

        .disc-cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 24px;
        }
        .disc-btn-back {
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
        .disc-btn-back:hover {
          background: #004d39;
          transform: translateY(-2px);
        }
        .disc-btn-privacy {
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
        .disc-btn-privacy:hover {
          background: #ecfdf5;
        }
      `}</style>
    </div>
  );
};

export default Disclaimer;
