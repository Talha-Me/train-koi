import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Map, CreditCard, Gavel, 
  ChevronRight, PhoneCall, ShieldCheck, Zap, Share2,
  Navigation, Star, TrainFront, LayoutGrid, Info
} from 'lucide-react';

const MetroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল গাইড ২০২৬ - Trainkoi";
    window.scrollTo(0, 0);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ট্রেনকই - ঢাকা মেট্রো রেল গাইড',
          url: window.location.href,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("লিংকটি কপি করা হয়েছে!");
    }
  };

  const metroFeatures = [
    { id: 'schedule', title: 'সময়সূচী', en: 'Schedule', desc: 'উত্তরা-মতিঝিল ট্রেনের সময়', icon: <Clock size={24} />, color: '#008352', path: '/metro/schedule' },
    { id: 'fare', title: 'ভাড়া তালিকা', en: 'Fare Chart', desc: 'স্টেশন ভিত্তিক ভাড়ার চার্ট', icon: <CreditCard size={24} />, color: '#e67e22', path: '/metro/fare' },
    { id: 'map', title: 'রুট ম্যাপ', en: 'Route Map', desc: 'সকল স্টেশন ও ইন্টারচেঞ্জ', icon: <Map size={24} />, color: '#2980b9', path: '/metro/map' },
    { id: 'rules', title: 'নির্দেশিকা', en: 'Rules', desc: 'নিরাপত্তা ও ভ্রমণের নিয়ম', icon: <Gavel size={24} />, color: '#c0392b', path: '/metro/rules' }
  ];

  return (
    <div className="metro-full-container">
      {/* Header Section */}
      <nav className="metro-header-nav">
        <div className="nav-wrapper">
          <button onClick={() => navigate('/')} className="circle-btn">
            <ChevronLeft size={24} />
          </button>
          <div className="main-logo">
            <TrainFront size={24} />
            <span>TRAINKOI™</span>
          </div>
          <button onClick={handleShare} className="circle-btn">
            <Share2 size={20}/>
          </button>
        </div>
      </nav>

      <main className="main-layout-wrapper">
        <div className="content-inner">
          
          {/* Hero Banner */}
          <section className="hero-banner">
            <div className="hero-text-area">
              <div className="official-badge">OFFICIAL GUIDE 2026</div>
              <h1>ঢাকা মেট্রো রেল গাইড</h1>
              <p>সময়সূচী, ভাড়া এবং স্টেশন সম্পর্কিত সকল তথ্য এখন এক জায়গায়।</p>
              
              <div className="quick-stats-grid">
                <div className="q-stat"><span>১৬টি</span> স্টেশন</div>
                <div className="q-stat"><span>৳২০</span> সর্বনিম্ন</div>
                <div className="q-stat"><span>১০%</span> ছাড় (Pass)</div>
              </div>
            </div>
            <div className="hero-pattern">
              <LayoutGrid size={150} />
            </div>
          </section>

          {/* Desktop/Mobile Split Grid */}
          <div className="responsive-dashboard">
            
            {/* Left Side: Services */}
            <div className="dashboard-left">
              <div className="live-status-card">
                <div className="status-anim">
                  <div className="ripple-effect"></div>
                  <Zap size={22} fill="#008352" color="#008352" />
                </div>
                <div className="status-info-text">
                  <small>সার্ভিস স্ট্যাটাস</small>
                  <h3>মেট্রো চলাচল স্বাভাবিক আছে</h3>
                </div>
                <div className="live-pill">LIVE</div>
              </div>

              <div className="features-main-grid">
                {metroFeatures.map((item) => (
                  <div key={item.id} onClick={() => navigate(item.path)} className="metro-card-item">
                    <div className="card-icon-box" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="card-titles">
                      <h4>{item.title}</h4>
                      <span>{item.en}</span>
                    </div>
                    <ChevronRight size={20} className="right-arrow" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Extras */}
            <div className="dashboard-right">
              <div className="promo-mrt-pass">
                <div className="p-header"><ShieldCheck size={16}/> MRT PASS</div>
                <h3>ভাড়ায় ১০% সাশ্রয় করুন</h3>
                <p>MRT Pass বা Rapid Pass ব্যবহার করে প্রতিটি ভ্রমণে ১০% ডিসকাউন্ট পান।</p>
                <button className="p-btn">পাস করার নিয়ম</button>
                <CreditCard className="p-icon-bg" size={120} />
              </div>

              <div className="contact-pills-row">
                <a href="tel:16134" className="c-pill">
                  <div className="c-icon amber"><PhoneCall size={20} /></div>
                  <div className="c-label"><small>হেল্পলাইন</small> ১৬১৩৪</div>
                </a>
                <div className="c-pill" onClick={() => navigate('/metro/nearest')}>
                  <div className="c-icon emerald"><Navigation size={20} /></div>
                  <div className="c-label"><small>নিকটস্থ</small> স্টেশন</div>
                </div>
              </div>

              <div className="info-alert-box">
                <Info size={18} color="#9a3412" />
                <p>মেট্রো রেল প্রতিদিন সকাল ৭:১০ থেকে রাত ৯:৪০ পর্যন্ত চলাচল করে। শুক্রবার সাপ্তাহিক বন্ধ।</p>
              </div>
            </div>
          </div>

          {/* SEO Footer Text */}
          <footer className="footer-seo">
            <div className="footer-title">
              <Star size={20} fill="#008352" color="#008352" />
              <h4>ঢাকা মেট্রো রেল গাইড ২০২৬ - Trainkoi</h4>
            </div>
            <p>
              বাংলাদেশ রেলওয়ের মেট্রো ট্রেনের সকল তথ্য ও সেবা সাধারণ মানুষের হাতের নাগালে পৌঁছে দেওয়াই আমাদের লক্ষ্য। উত্তরা উত্তর থেকে মতিঝিল যাতায়াতের সঠিক শিডিউল এবং লাইভ লোকেশন জানতে নিয়মিত <b>Trainkoi (ট্রেনকই)</b> ভিজিট করুন। 
            </p>
          </footer>
        </div>
      </main>

      <style>{`
        .metro-full-container {
          background-color: #f1f5f9;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
        }

        /* Nav */
        .metro-header-nav {
          background: white;
          padding: 0 20px;
          height: 75px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid #e2e8f0;
        }
        .nav-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .main-logo { display: flex; align-items: center; gap: 8px; font-weight: 900; color: #008352; font-size: 20px; }
        .circle-btn { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 14px; cursor: pointer; color: #475569; }

        /* Hero */
        .main-layout-wrapper { padding: 30px 20px; }
        .content-inner { max-width: 1100px; margin: 0 auto; }
        .hero-banner {
          background: linear-gradient(135deg, #008352 0%, #005a38 100%);
          border-radius: 35px;
          padding: 60px 50px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
          overflow: hidden;
        }
        .official-badge { background: rgba(255,255,255,0.2); width: fit-content; padding: 6px 15px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 15px; }
        .hero-text-area h1 { font-size: 42px; font-weight: 900; margin: 0 0 10px; }
        .hero-text-area p { font-size: 18px; opacity: 0.8; margin-bottom: 35px; max-width: 450px; }
        .quick-stats-grid { display: flex; gap: 15px; }
        .q-stat { background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.1); text-align: center; }
        .q-stat span { display: block; font-size: 20px; font-weight: 800; color: #facc15; }
        .hero-pattern { opacity: 0.1; }

        /* Dashboard Grid */
        .responsive-dashboard {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 25px;
        }

        .dashboard-left, .dashboard-right { display: flex; flex-direction: column; gap: 20px; }

        /* Left Side Status/Cards */
        .live-status-card {
          background: white;
          padding: 22px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #edf2f7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .status-anim { position: relative; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; }
        .ripple-effect { position: absolute; width: 100%; height: 100%; background: #008352; border-radius: 50%; animation: ripple 2s infinite; opacity: 0.1; }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.3; } 100% { transform: scale(2.5); opacity: 0; } }
        .status-info-text small { color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 10px; }
        .status-info-text h3 { margin: 0; font-size: 18px; font-weight: 800; }
        .live-pill { margin-left: auto; background: #fff1f2; color: #e11d48; padding: 5px 14px; border-radius: 10px; font-weight: 900; font-size: 11px; }

        .features-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .metro-card-item {
          background: white; padding: 22px; border-radius: 24px; display: flex; align-items: center; gap: 15px;
          cursor: pointer; transition: 0.3s; border: 1px solid #edf2f7;
        }
        .metro-card-item:hover { transform: translateY(-5px); border-color: #008352; box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .card-icon-box { padding: 14px; border-radius: 18px; }
        .card-titles h4 { margin: 0; font-size: 17px; font-weight: 800; }
        .card-titles span { font-size: 12px; color: #94a3b8; font-weight: 600; }
        .right-arrow { margin-left: auto; color: #cbd5e1; }

        /* Right Side Promo */
        .promo-mrt-pass {
          background: #0f172a; border-radius: 30px; padding: 30px; color: white; position: relative; overflow: hidden;
        }
        .p-header { display: flex; align-items: center; gap: 8px; color: #10b981; font-weight: 900; font-size: 12px; margin-bottom: 12px; }
        .promo-mrt-pass h3 { font-size: 22px; margin: 0; font-weight: 800; }
        .promo-mrt-pass p { font-size: 14px; opacity: 0.7; margin: 15px 0 25px; line-height: 1.6; }
        .p-btn { background: white; border: none; padding: 12px 25px; border-radius: 14px; font-weight: 800; cursor: pointer; position: relative; z-index: 2; }
        .p-icon-bg { position: absolute; right: -20px; bottom: -20px; opacity: 0.1; transform: rotate(-15deg); }

        .contact-pills-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .c-pill { background: white; padding: 15px; border-radius: 22px; display: flex; align-items: center; gap: 12px; border: 1px solid #edf2f7; text-decoration: none; color: inherit; }
        .c-icon { padding: 10px; border-radius: 12px; color: white; }
        .amber { background: #f59e0b; }
        .emerald { background: #10b981; }
        .c-label small { display: block; font-size: 9px; color: #64748b; font-weight: 800; text-transform: uppercase; }
        .c-label { font-size: 15px; font-weight: 800; }

        .info-alert-box { background: #fff7ed; padding: 18px; border-radius: 20px; border: 1px solid #ffedd5; display: flex; gap: 12px; }
        .info-alert-box p { margin: 0; font-size: 13px; color: #9a3412; font-weight: 600; line-height: 1.5; }

        /* Footer */
        .footer-seo { margin-top: 40px; padding: 40px; background: white; border-radius: 35px; }
        .footer-title { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .footer-title h4 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; }
        .footer-seo p { font-size: 14px; color: #64748b; line-height: 1.8; text-align: justify; }

        /* Responsive Mobile */
        @media (max-width: 900px) {
          .responsive-dashboard { grid-template-columns: 1fr; }
          .hero-banner { padding: 40px; text-align: center; flex-direction: column; }
          .hero-text-area h1 { font-size: 32px; }
          .hero-text-area p { margin: 15px auto 30px; }
          .quick-stats-grid { justify-content: center; }
          .hero-pattern { display: none; }
        }

        @media (max-width: 600px) {
          .features-main-grid { grid-template-columns: 1fr; }
          .main-layout-wrapper { padding: 15px; }
          .hero-banner { border-radius: 25px; padding: 30px 20px; }
          .hero-text-area h1 { font-size: 28px; }
          .footer-seo { border-radius: 25px; padding: 25px; }
        }
      `}</style>
    </div>
  );
};

export default MetroPage;