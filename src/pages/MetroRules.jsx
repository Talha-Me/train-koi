import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Gavel, Ban, CheckCircle2, AlertTriangle, 
  Info, ShieldAlert, PhoneCall, Trash2, CameraOff, 
  VolumeX, Star, Zap, ExternalLink 
} from 'lucide-react';

const MetroRules = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল ভ্রমণ নির্দেশিকা ২০২৬ | Trainkoi";
    window.scrollTo(0, 0);
  }, []);

  const generalRules = [
    { icon: <Ban size={20} color="#ef4444" />, title: "ধূমপান ও খাবার", text: "মেট্রো রেলের স্টেশন এবং ট্রেনের ভেতরে ধূমপান বা যেকোনো কিছু খাওয়া সম্পূর্ণ নিষিদ্ধ।" },
    { icon: <CheckCircle2 size={20} color="#22c55e" />, title: "টিকিট পাঞ্চ", text: "স্টেশনে প্রবেশ ও বের হওয়ার সময় আপনার স্মার্ট কার্ড বা টিকিট গেটে সঠিক স্থানে পাঞ্চ করুন।" },
    { icon: <Trash2 size={20} color="#ef4444" />, title: "পরিচ্ছন্নতা", text: "মেট্রো রেল চত্বরে থুথু বা পান ফেলা দণ্ডনীয় অপরাধ। ময়লা নির্দিষ্ট স্থানে ফেলুন।" },
    { icon: <AlertTriangle size={20} color="#f59e0b" />, title: "বোর্ডিং নিয়ম", text: "ট্রেনে ওঠার সময় লাইনে দাঁড়ান এবং যাত্রী নামার জন্য পর্যাপ্ত জায়গা ছেড়ে দিন।" },
    { icon: <CameraOff size={20} color="#64748b" />, title: "ছবি তোলা", text: "নিরাপত্তার স্বার্থে মেট্রো রেলের কন্ট্রোল রুম বা সংরক্ষিত এলাকার ছবি তোলা থেকে বিরত থাকুন।" },
    { icon: <VolumeX size={20} color="#64748b" />, title: "উচ্চশব্দ", text: "ট্রেনের ভেতর উচ্চস্বরে কথা বলা বা লাউড স্পিকারে গান শোনা নিষিদ্ধ।" },
  ];

  const penalties = [
    { crime: "অনুমতিহীন প্রবেশ", fine: "৳৫০০ - ৳১০০০" },
    { crime: "টিকিট বিহীন ভ্রমণ", fine: "ভাড়ার ১০ গুণ" },
    { crime: "আবর্জনা ফেলা", fine: "৳১০০০" },
    { crime: "নিরাপত্তা বিঘ্নিত করা", fine: "কারাদণ্ড বা বড় জরিমানা" },
  ];

  return (
    <div className="rules-page-root">
      {/* Top Navbar */}
      <nav className="rules-nav">
        <div className="nav-container">
          <button onClick={() => navigate('/metro-rail')} className="back-btn-circle">
            <ChevronLeft size={24} />
          </button>
          <div className="nav-brand-group">
            <Gavel size={22} color="#fbbf24" />
            <span>ভ্রমণ নির্দেশিকা ও নিয়মাবলী</span>
          </div>
          <div className="live-tag">TRAINKOI GUIDE</div>
        </div>
      </nav>

      <main className="rules-main-content">
        <div className="content-wrapper-wide">
          
          {/* Header Banner */}
          <section className="rules-hero">
            <div className="hero-info">
              <h1>নিরাপদ ভ্রমণের সঠিক নিয়ম</h1>
              <p>আপনার যাত্রা আরামদায়ক ও নিরাপদ করতে ঢাকা মেট্রো রেলের সকল আইন ও নির্দেশনা মেনে চলুন।</p>
            </div>
            <div className="hero-icon-bg"><ShieldAlert size={100} opacity={0.1} /></div>
          </section>

          <div className="rules-grid-layout">
            
            {/* Left Column: General Rules */}
            <div className="rules-left-column">
              <div className="section-title">
                <Info size={18} color="#008352" />
                <h3>সাধারণ নির্দেশনাবলী</h3>
              </div>
              
              <div className="rules-card-list">
                {generalRules.map((rule, i) => (
                  <div key={i} className="rule-box-item">
                    <div className="rule-icon-circle">{rule.icon}</div>
                    <div className="rule-text-content">
                      <h4>{rule.title}</h4>
                      <p>{rule.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Penalties & Emergency */}
            <div className="rules-right-column">
              
              {/* Penalty Table */}
              <div className="penalty-card">
                <div className="card-head">
                  <Gavel size={18} />
                  <h3>জরিমানা ও দণ্ড</h3>
                </div>
                <div className="penalty-table">
                  {penalties.map((p, i) => (
                    <div key={i} className="p-row">
                      <span>{p.crime}</span>
                      <strong>{p.fine}</strong>
                    </div>
                  ))}
                </div>
                <p className="p-note">*মেট্রো রেল আইন ২০১৫ অনুযায়ী সকল দণ্ড কার্যকর হবে।</p>
              </div>

              {/* Trainkoi Special Advice */}
              <div className="trainkoi-advice-box">
                <div className="advice-badge">
                  <Star size={12} fill="white" /> TRAINKOI TIPS
                </div>
                <h3>কিভাবে দ্রুত ভ্রমণ করবেন?</h3>
                <ul>
                  <li>যেকোনো ট্রেনের লাইভ আপডেট পেতে <b>trainkoi.com</b> ব্যবহার করুন।</li>
                  <li>ভিড় এড়াতে সকাল ১০টা থেকে দুপুর ৩টা এবং রাত ৮টার পর ভ্রমণের পরিকল্পনা করুন।</li>
                  <li>আপনার MRT Pass-এ কমপক্ষে ২০০ টাকা ব্যালেন্স রাখার চেষ্টা করুন।</li>
                </ul>
                <button className="track-link-btn" onClick={() => window.open('https://trainkoi.com', '_blank')}>
                  লাইভ ট্র্যাকিং দেখুন <ExternalLink size={14} />
                </button>
              </div>

              {/* Emergency Contact */}
              <div className="emergency-call-card">
                <div className="call-info">
                  <PhoneCall size={24} color="#008352" />
                  <div>
                    <small>জরুরি প্রয়োজনে যোগাযোগ</small>
                    <h4>১৬১৩৪</h4>
                  </div>
                </div>
                <a href="tel:16134" className="dial-btn">কল করুন</a>
              </div>

              {/* Red Warning Box */}
              <div className="critical-warning">
                <AlertTriangle size={24} />
                <div className="warn-text">
                  <h4>প্লাটফর্ম সতর্কতা</h4>
                  <p>হলুদ দাগের বাইরে দাঁড়াবেন না। ট্রেনের দরজা খোলার সময় ধাক্কাধাক্কি করবেন না।</p>
                </div>
              </div>

            </div>
          </div>

          {/* SEO Marketing Footer */}
          <footer className="rules-marketing-footer">
            <div className="footer-logo">
              <Zap size={20} fill="#008352" color="#008352" />
              <span>Trainkoi (ট্রেনকই)</span>
            </div>
            <p>
              মেট্রো রেল একটি আধুনিক ও রাষ্ট্রীয় সম্পদ। এর পরিচ্ছন্নতা বজায় রাখা আমাদের নাগরিক দায়িত্ব। নিয়মিত ট্রেনের লোকেশন আপডেট এবং শিডিউল জানতে ব্রাউজ করুন <b>trainkoi.com</b>। আমরা আপনাকে রাখি সবসময় এক ধাপ এগিয়ে।
            </p>
          </footer>
        </div>
      </main>

      <style>{`
        .rules-page-root { background-color: #f1f5f9; min-height: 100vh; font-family: 'Hind Siliguri', sans-serif; }
        
        /* Navbar */
        .rules-nav { background: linear-gradient(135deg, #008352 0%, #005a38 100%); padding: 15px 0; color: white; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .nav-brand-group { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 19px; }
        .back-btn-circle { background: rgba(255,255,255,0.2); border: none; padding: 8px; border-radius: 50%; color: white; cursor: pointer; transition: 0.3s; }
        .live-tag { font-size: 10px; background: rgba(0,0,0,0.2); padding: 5px 12px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); }

        /* Hero */
        .rules-main-content { padding: 30px 20px; }
        .content-wrapper-wide { max-width: 1100px; margin: 0 auto; }
        .rules-hero { background: white; border-radius: 30px; padding: 40px; margin-bottom: 30px; position: relative; overflow: hidden; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .hero-info h1 { margin: 0; font-size: 32px; color: #1e293b; font-weight: 900; }
        .hero-info p { margin: 10px 0 0; color: #64748b; font-size: 16px; max-width: 500px; }

        /* Grid System */
        .rules-grid-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 30px; }
        .section-title { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .section-title h3 { margin: 0; font-size: 18px; color: #1e293b; font-weight: 800; }

        /* Rules Cards */
        .rules-card-list { display: flex; flex-direction: column; gap: 15px; }
        .rule-box-item { background: white; padding: 20px; border-radius: 24px; display: flex; gap: 18px; border: 1px solid #edf2f7; transition: 0.3s; }
        .rule-box-item:hover { transform: translateY(-3px); border-color: #008352; box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
        .rule-icon-circle { background: #f8fafc; padding: 12px; border-radius: 16px; height: fit-content; }
        .rule-text-content h4 { margin: 0 0 5px; font-size: 16px; color: #1e293b; font-weight: 800; }
        .rule-text-content p { margin: 0; font-size: 14px; color: #64748b; line-height: 1.6; }

        /* Right Column Styles */
        .rules-right-column { display: flex; flex-direction: column; gap: 20px; }
        
        .penalty-card { background: #1e293b; color: white; padding: 25px; border-radius: 28px; }
        .card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; }
        .card-head h3 { margin: 0; font-size: 17px; font-weight: 800; }
        .penalty-table { display: flex; flex-direction: column; gap: 12px; }
        .p-row { display: flex; justify-content: space-between; font-size: 14px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 8px; }
        .p-row strong { color: #f87171; }
        .p-note { font-size: 11px; opacity: 0.6; margin-top: 15px; }

        .trainkoi-advice-box { background: white; border-radius: 28px; padding: 25px; border: 2px solid #008352; position: relative; }
        .advice-badge { position: absolute; top: -12px; right: 20px; background: #008352; color: white; font-size: 10px; padding: 4px 12px; border-radius: 10px; font-weight: 900; display: flex; align-items: center; gap: 5px; }
        .trainkoi-advice-box h3 { font-size: 18px; margin: 0 0 15px; font-weight: 800; color: #008352; }
        .trainkoi-advice-box ul { padding-left: 18px; margin: 0; }
        .trainkoi-advice-box li { font-size: 13px; color: #475569; margin-bottom: 8px; line-height: 1.5; }
        .track-link-btn { width: 100%; margin-top: 15px; background: #f0fdf4; border: 1px solid #dcfce7; color: #166534; padding: 12px; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

        .emergency-call-card { background: white; padding: 20px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; }
        .call-info { display: flex; align-items: center; gap: 12px; }
        .call-info small { display: block; font-size: 10px; color: #64748b; font-weight: 700; }
        .call-info h4 { margin: 0; font-size: 20px; color: #1e293b; font-weight: 900; }
        .dial-btn { background: #008352; color: white; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-weight: 800; font-size: 14px; }

        .critical-warning { background: #fff1f2; border: 1px solid #fecdd3; padding: 20px; border-radius: 24px; display: flex; gap: 15px; color: #991b1b; }
        .warn-text h4 { margin: 0 0 5px; font-size: 16px; font-weight: 800; }
        .warn-text p { margin: 0; font-size: 13px; font-weight: 600; line-height: 1.5; }

        /* Footer */
        .rules-marketing-footer { margin-top: 40px; background: white; padding: 40px; border-radius: 35px; border: 1px solid #e2e8f0; text-align: center; }
        .footer-logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 15px; font-weight: 900; font-size: 20px; color: #008352; }
        .rules-marketing-footer p { font-size: 14px; color: #64748b; line-height: 1.8; max-width: 800px; margin: 0 auto; }

        /* Responsive */
        @media (max-width: 900px) {
          .rules-grid-layout { grid-template-columns: 1fr; }
          .rules-hero { padding: 30px; text-align: center; justify-content: center; }
          .hero-icon-bg { display: none; }
          .hero-info h1 { font-size: 24px; }
        }
      `}</style>
    </div>
  );
};

export default MetroRules;