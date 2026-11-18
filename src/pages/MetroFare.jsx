import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Info, Train, Clock, MapPin, Sparkles, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import Navbar from './components/Navbar';

const MetroFare = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mrtPass, setMrtPass] = useState(false);

  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল ভাড়া তালিকা ২০২৬ - উত্তরা থেকে মতিঝিল | ট্রেনকই";
    window.scrollTo(0, 0);
  }, []);

  const fares = [
    { to: 'উত্তরা উত্তর (Uttara North)', price: 20, zone: 'উত্তরা' },
    { to: 'উত্তরা সেন্টার (Uttara Center)', price: 20, zone: 'উত্তরা' },
    { to: 'উত্তরা দক্ষিণ (Uttara South)', price: 20, zone: 'উত্তরা' },
    { to: 'পল্লবী (Pallabi)', price: 30, zone: 'মিরপুর' },
    { to: 'মিরপুর ১১ (Mirpur 11)', price: 40, zone: 'মিরপুর' },
    { to: 'মিরপুর ১০ (Mirpur 10)', price: 40, zone: 'মিরপুর' },
    { to: 'কাজীপাড়া (Kazipara)', price: 50, zone: 'মিরপুর' },
    { to: 'শেওড়াপাড়া (Sheowrapara)', price: 50, zone: 'মিরপুর' },
    { to: 'আগারগাঁও (Agargaon)', price: 60, zone: 'আগারগাঁও' },
    { to: 'বিজয় সরণি (Bijoy Sarani)', price: 70, zone: 'তেজগাঁও' },
    { to: 'ফার্মগেট (Farmgate)', price: 70, zone: 'ফার্মগেট' },
    { to: 'কারওয়ান বাজার (Karwan Bazar)', price: 80, zone: 'তেজগাঁও' },
    { to: 'শাহবাগ (Shahbagh)', price: 80, zone: 'শাহবাগ' },
    { to: 'ঢাকা বিশ্ববিদ্যালয় (DU)', price: 90, zone: 'টিএসসি' },
    { to: 'সচিবালয় (Secretariat)', price: 90, zone: 'প্রেস ক্লাব' },
    { to: 'মতিঝিল (Motijheel)', price: 100, zone: 'মতিঝিল' },
  ];

  const filteredFares = fares.filter(f => 
    f.to.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mf-root">
      <Navbar activePage="/metro-rail" />

      {/* Mobile Sticky Header */}
      <div className="mf-mobile-header">
        <div className="mf-mobile-header-in">
          <button 
            onClick={() => navigate('/metro-rail')} 
            className="mf-back-btn"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="mf-mobile-title">ভাড়া তালিকা (উত্তরা থেকে)</h1>
        </div>
      </div>

      <div className="mf-container">
        {/* Desktop Hero Banner */}
        <div className="mf-hero-banner">
          <div className="mf-hero-badge">
            <Sparkles size={16} />
            <span>ঢাকা এমআরটি লাইন-৬ (MRT Line-6) অফিসিয়াল ভাড়া তালিকা ২০২৬</span>
          </div>
          <h1 className="mf-hero-title">ঢাকা মেট্রো রেলের স্টেশনভিত্তিক ভাড়া চার্ট</h1>
          <p className="mf-hero-desc">
            উত্তরা উত্তর (দিয়াবাড়ি) হতে মতিঝিল পর্যন্ত প্রতিটি স্টেশনের একক যাত্রা ও এমআরটি পাস ডিসকাউন্টের পুর্ণাঙ্গ হিসাব।
          </p>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="mf-grid">
          {/* Left Column: Fare Table with Search & Pass Toggle */}
          <div className="mf-fare-col">
            <div className="mf-card">
              <div className="mf-card-head">
                <div className="mf-search-box">
                  <Search size={18} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="স্টেশনের নাম দিয়ে খুঁজুন (যেমন: মিরপুর, ফার্মগেট)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mf-search-input"
                  />
                </div>

                <div className="mf-pass-toggle" onClick={() => setMrtPass(!mrtPass)}>
                  <div className={`mf-toggle-switch ${mrtPass ? 'active' : ''}`} />
                  <span className="mf-pass-label">
                    {mrtPass ? 'এমআরটি পাস (১০% ছাড় সক্রিয়)' : 'এমআরটি পাস ছাড় দেখতে ট্যাপ করুন'}
                  </span>
                </div>
              </div>

              <div className="mf-table-wrap">
                <table className="mf-table">
                  <thead>
                    <tr>
                      <th>গন্তব্য স্টেশন</th>
                      <th>জোন</th>
                      <th style={{ textAlign: 'right' }}>একক যাত্রা</th>
                      {mrtPass && <th style={{ textAlign: 'right', color: '#059669' }}>এমআরটি পাস</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFares.map((item, i) => {
                      const discounted = Math.round(item.price * 0.9);
                      return (
                        <tr key={i}>
                          <td>
                            <strong className="mf-station-name">{item.to}</strong>
                          </td>
                          <td>
                            <span className="mf-zone-badge">{item.zone}</span>
                          </td>
                          <td style={{ textAlign: 'right' }} className="mf-fare-val">
                            ৳ {item.price}
                          </td>
                          {mrtPass && (
                            <td style={{ textAlign: 'right' }} className="mf-pass-val">
                              ৳ {discounted}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mf-note-box">
                <Info size={18} color="#ea580c" style={{ flexShrink: 0 }} />
                <p>
                  <strong>এমআরটি পাস সুবিধা:</strong> এমআরটি পাস বা র‍্যাপিড পাস ব্যবহার করলে প্রতি একক যাত্রায় স্বয়ংক্রিয়ভাবে ১০% ছাড় পাওয়া যায়। সর্বনিম্ন ভাড়া ২০ টাকা।
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ, Rules & Travel Advice */}
          <div className="mf-info-col">
            <div className="mf-card">
              <h3 className="mf-sec-title">
                <CreditCard size={20} color="#008352" />
                মেট্রো রেল টিকিট ও ভাড়ার গুরুত্বপূর্ণ নিয়মাবলী
              </h3>
              <ul className="mf-info-list">
                <li>
                  <CheckCircle2 size={16} color="#059669" />
                  <div>
                    <strong>সর্বনিম্ন ও সর্বোচ্চ ভাড়া:</strong>
                    <span>উত্তরা উত্তর হতে নিকটবর্তী স্টেশনের সর্বনিম্ন ভাড়া ২০ টাকা এবং মতিঝিল পর্যন্ত সর্বোচ্চ ভাড়া ১০০ টাকা।</span>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} color="#059669" />
                  <div>
                    <strong>টিকিট পাঞ্চ ও সময়সীমা:</strong>
                    <span>স্টেশনে প্রবেশের পর সর্বোচ্চ ১০০ মিনিটের মধ্যে বের হতে হবে। অতিরিক্ত সময় অবস্থান করলে জরিমানা প্রযোজ্য।</span>
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={16} color="#059669" />
                  <div>
                    <strong>কার্ড রিচার্জ:</strong>
                    <span>যেকোনো স্টেশনের টিকিট ভেন্ডিং মেশিন (TVM) বা ম্যানুয়াল কাউন্টারে ১০০ টাকা হতে ১০,০০০ টাকা পর্যন্ত রিচার্জ করা যায়।</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Metro FAQ */}
            <div className="mf-card" style={{ marginTop: 24 }}>
              <h3 className="mf-sec-title">
                <Info size={20} color="#008352" />
                সাধারণ জিজ্ঞাসা (Metro Rail FAQ)
              </h3>
              <div className="mf-faq-list">
                <div className="mf-faq-item">
                  <h4 className="mf-faq-q">১. উত্তরা থেকে আগারগাঁও মেট্রো রেল ভাড়া কত?</h4>
                  <p className="mf-faq-a">উত্তরা উত্তর স্টেশন থেকে আগারগাঁও পর্যন্ত একক যাত্রার ভাড়া ৬০ টাকা (এমআরটি পাসে ৫৪ টাকা)।</p>
                </div>
                <div className="mf-faq-item">
                  <h4 className="mf-faq-q">২. মতিঝিল থেকে ফার্মগেট মেট্রো রেল ভাড়া কত?</h4>
                  <p className="mf-faq-a">মতিঝিল থেকে ফার্মগেট পর্যন্ত ভাড়া মাত্র ৩০ টাকা, পৌঁছাতে সময় লাগে প্রায় ১২ মিনিট।</p>
                </div>
                <div className="mf-faq-item">
                  <h4 className="mf-faq-q">৩. শিক্ষার্থীদের জন্য কি কোনো হাফ ভাড়া আছে?</h4>
                  <p className="mf-faq-a">বর্তমানে সরকারি নিয়মানুযায়ী মেট্রো রেলে শিক্ষার্থীদের জন্য কোনো আলাদা হাফ ভাড়ার সুযোগ নেই। তবে এমআরটি পাসের ১০% ছাড় সবার জন্য প্রযোজ্য।</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mf-quick-row" style={{ marginTop: 20 }}>
              <button onClick={() => navigate('/metro/schedule')} className="mf-btn-outline">
                <Clock size={16} /> সময়সূচী দেখুন
              </button>
              <button onClick={() => navigate('/metro/map')} className="mf-btn-outline">
                <MapPin size={16} /> রুট ম্যাপ দেখুন
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .mf-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          padding-bottom: 70px;
        }

        .mf-mobile-header {
          display: none;
          background: linear-gradient(135deg, #008352 0%, #005a38 100%);
          padding: 16px 20px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        @media (max-width: 768px) {
          .mf-mobile-header {
            display: block;
          }
        }
        .mf-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .mf-back-btn {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 12px;
          padding: 6px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .mf-mobile-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
        }

        .mf-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .mf-hero-banner {
          background: linear-gradient(135deg, #005a40 0%, #003726 100%);
          border-radius: 24px;
          padding: 36px 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 10px 30px rgba(0, 55, 38, 0.15);
        }
        .mf-hero-badge {
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
        .mf-hero-title {
          margin: 0 0 10px;
          font-size: 28px;
          font-weight: 800;
        }
        .mf-hero-desc {
          margin: 0;
          font-size: 15px;
          color: #d1fae5;
          line-height: 1.6;
        }

        .mf-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .mf-grid {
            grid-template-columns: 1fr;
          }
        }

        .mf-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .mf-card-head {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .mf-search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 12px 16px;
        }
        .mf-search-input {
          border: none;
          background: transparent;
          font-size: 14.5px;
          font-family: inherit;
          width: 100%;
          outline: none;
          color: #1e293b;
        }
        .mf-pass-toggle {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          background: #f0fdf4;
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid #bbf7d0;
          user-select: none;
        }
        .mf-toggle-switch {
          width: 38px;
          height: 20px;
          background: #cbd5e1;
          border-radius: 999px;
          position: relative;
          transition: background 0.2s ease;
        }
        .mf-toggle-switch::after {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.2s ease;
        }
        .mf-toggle-switch.active {
          background: #059669;
        }
        .mf-toggle-switch.active::after {
          transform: translateX(18px);
        }
        .mf-pass-label {
          font-size: 13.5px;
          font-weight: 800;
          color: #065f46;
        }

        .mf-table-wrap {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid #edf2f7;
        }
        .mf-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14.5px;
        }
        .mf-table th {
          background: #f1f5f9;
          padding: 14px 16px;
          text-align: left;
          font-weight: 800;
          color: #475569;
          border-bottom: 1.5px solid #e2e8f0;
        }
        .mf-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f8fafc;
        }
        .mf-station-name {
          color: #1e293b;
          font-size: 15px;
        }
        .mf-zone-badge {
          background: #f1f5f9;
          color: #64748b;
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
        }
        .mf-fare-val {
          color: #008352;
          font-weight: 900;
          font-size: 16px;
        }
        .mf-pass-val {
          color: #059669;
          font-weight: 900;
          font-size: 16px;
        }

        .mf-note-box {
          margin-top: 20px;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .mf-note-box p {
          margin: 0;
          font-size: 13px;
          color: #9a3412;
          line-height: 1.5;
        }

        .mf-sec-title {
          margin: 0 0 16px;
          font-size: 18px;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mf-info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .mf-info-list li {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
        }
        .mf-info-list strong {
          display: block;
          color: #1e293b;
          font-size: 14.5px;
          margin-bottom: 2px;
        }

        .mf-faq-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mf-faq-item {
          background: #f8fafc;
          border-radius: 14px;
          padding: 14px 16px;
          border: 1px solid #e2e8f0;
        }
        .mf-faq-q {
          margin: 0 0 6px;
          font-size: 14.5px;
          font-weight: 800;
          color: #008352;
        }
        .mf-faq-a {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
        }

        .mf-quick-row {
          display: flex;
          gap: 12px;
        }
        .mf-btn-outline {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #ffffff;
          border: 1.5px solid #008352;
          color: #008352;
          padding: 12px 16px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mf-btn-outline:hover {
          background: #ecfdf5;
        }
      `}</style>
    </div>
  );
};

export default MetroFare;
