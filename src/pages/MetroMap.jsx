import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MapPin, Navigation, Info, 
  TrainFront, Share2, Star, Zap, Search,
  ArrowRightLeft, ExternalLink, ShieldCheck, Clock 
} from 'lucide-react';

const MetroMap = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ঢাকা মেট্রো রেল ম্যাপ ২০২৬ | Trainkoi - সঠিক ট্র্যাকিং";
    window.scrollTo(0, 0);
  }, []);

  const stations = [
    { name: "উত্তরা উত্তর", status: "টার্মিনাল", zone: "উত্তরা ডিয়াবাড়ি", time: "০ মি." },
    { name: "উত্তরা সেন্টার", status: "চলমান", zone: "উত্তরা", time: "২ মি." },
    { name: "উত্তরা দক্ষিণ", status: "চলমান", zone: "উত্তরা", time: "৪ মি." },
    { name: "পল্লবী", status: "চলমান", zone: "মিরপুর", time: "৭ মি." },
    { name: "মিরপুর ১১", status: "চলমান", zone: "মিরপুর", time: "১০ মি." },
    { name: "মিরপুর ১০", status: "ইন্টারচেঞ্জ", zone: "মিরপুর", time: "১২ মি." },
    { name: "কাজীপাড়া", status: "চলমান", zone: "মিরপুর", time: "১৫ মি." },
    { name: "শেওড়াপাড়া", status: "চলমান", zone: "মিরপুর", time: "১৭ মি." },
    { name: "আগারগাঁও", status: "চলমান", zone: "আগারগাঁও", time: "২০ মি." },
    { name: "বিজয় সরণি", status: "চলমান", zone: "তেজগাঁও", time: "২৩ মি." },
    { name: "ফার্মগেট", status: "ব্যস্ততম", zone: "ফার্মগেট", time: "২৬ মি." },
    { name: "কারওয়ান বাজার", status: "চলমান", zone: "তেজগাঁও", time: "২৮ মি." },
    { name: "শাহবাগ", status: "চলমান", zone: "শাহবাগ", time: "৩০ মি." },
    { name: "ঢাকা বিশ্ববিদ্যালয়", status: "চলমান", zone: "টিএসসি", time: "৩২ মি." },
    { name: "সচিবালয়", status: "চলমান", zone: "প্রেস ক্লাব", time: "৩৫ মি." },
    { name: "মতিঝিল", status: "টার্মিনাল", zone: "মতিঝিল", time: "৩৮ মি." }
  ];

  return (
    <div className="metro-map-root">
      {/* Top Navbar */}
      <nav className="m-top-nav">
        <div className="n-container">
          <button onClick={() => navigate('/metro-rail')} className="n-back">
            <ChevronLeft size={24} />
          </button>
          <div className="n-logo-text">
            <MapPin size={22} color="#10b981" />
            <span>ঢাকা মেট্রো রুট ম্যাপ ২০২৬</span>
          </div>
          <button className="n-back" onClick={() => alert("লিংক কপি করা হয়েছে!")}><Share2 size={20}/></button>
        </div>
      </nav>

      <div className="m-main-wrapper">
        <div className="m-container-wide">
          
          {/* Trainkoi Branding & Promo */}
          <div className="trainkoi-super-banner">
            <div className="b-content">
              <div className="b-icon-box"><Zap size={24} fill="#FFD700" color="#FFD700" /></div>
              <div className="b-text">
                <h3>ট্রেন এখন কোথায়? সঠিক তথ্য জানুন</h3>
                <p>মেট্রো রেলসহ বাংলাদেশের যেকোনো ট্রেনের লাইভ লোকেশন এবং রিয়েল টাইম শিডিউল জানতে ভিজিট করুন <b>trainkoi.com</b></p>
              </div>
            </div>
            <a href="https://trainkoi.com" target="_blank" rel="noreferrer" className="b-action-btn">
              লোকেশন দেখুন <ExternalLink size={16} />
            </a>
          </div>

          <div className="m-grid-system">
            
            {/* Left: Map Card */}
            <section className="m-map-card">
              <div className="c-head">
                <ArrowRightLeft size={20} color="#008352" />
                <h3>লাইন-৬ (উত্তরা থেকে মতিঝিল)</h3>
              </div>
              
              <div className="st-scroll-area">
                {stations.map((st, i) => (
                  <div key={i} className="st-item">
                    <div className="st-line-art">
                      <div className={`st-circle ${st.status === 'টার্মিনাল' ? 'st-large' : ''}`}>
                        <div className="st-dot-inner"></div>
                      </div>
                      {i !== stations.length - 1 && <div className="st-connect"></div>}
                    </div>
                    <div className="st-info-box">
                      <div className="st-top-row">
                        <h4>{st.name}</h4>
                        {st.status !== "চলমান" && <span className={`st-tag ${st.status}`}>{st.status}</span>}
                      </div>
                      <div className="st-bottom-row">
                        <span className="st-loc">{st.zone}</span>
                        <span className="st-time-est"><Clock size={12} style={{marginRight: '4px'}}/> {st.time}</span>
                      </div>
                    </div>
                    <button className="st-view-btn"><Search size={16} /></button>
                  </div>
                ))}
              </div>
            </section>

            {/* Right: Sidebar & Branding */}
            <aside className="m-sidebar">
              <div className="tk-brand-card">
                <div className="tk-badge">ট্রেনকই স্পেশাল</div>
                <h3>কেন Trainkoi সেরা?</h3>
                <div className="tk-feature">
                  <ShieldCheck size={18} color="#10b981" />
                  <p><b>১০০% সঠিক তথ্য:</b> আমাদের ডেটা সরাসরি সার্ভার থেকে আপডেট হয়।</p>
                </div>
                <div className="tk-feature">
                  <Star size={18} color="#fbbf24" />
                  <p><b>২০২৬ আপডেট:</b> নতুন সকল স্টেশন এবং ভাড়ার তালিকা এখানে পাবেন।</p>
                </div>
                <div className="tk-feature">
                  <Navigation size={18} color="#3b82f6" />
                  <p><b>লাইভ ট্র্যাকিং:</b> ট্রেনের বর্তমান অবস্থান দেখার সুবিধা।</p>
                </div>
                <button className="tk-cta-full" onClick={() => window.open('https://trainkoi.com', '_blank')}>
                  ট্রেনের লাইভ লোকেশন দেখুন
                </button>
              </div>

              <div className="m-info-grid">
                <div className="info-mini-card">
                  <h4>২০ কি.মি.</h4>
                  <p>মোট দৈর্ঘ্য</p>
                </div>
                <div className="info-mini-card">
                  <h4>৩১ মিনিট</h4>
                  <p>ভ্রমণ সময়</p>
                </div>
              </div>

              <div className="m-notice-box">
                <div className="n-head"><Info size={18} /> ভ্রমণ গাইড</div>
                <p>মেট্রো রেলের টিকেট বা পাস কার্ড সংগ্রহের জন্য প্রতিটি স্টেশনে অটোমেটিক ভেন্ডিং মেশিন রয়েছে। MRT Pass ব্যবহার করলে ১০% ভাড়া সাশ্রয় হয়।</p>
              </div>

              <div className="m-seo-tags">
                <span>#Trainkoi</span> <span>#MetroRailBD</span> <span>#DhakaMetroMap</span>
              </div>
            </aside>

          </div>
        </div>
      </div>

      <style>{`
        .metro-map-root { background-color: #f6f9fc; min-height: 100vh; font-family: 'Hind Siliguri', sans-serif; color: #1e293b; }
        
        .m-top-nav { background: linear-gradient(135deg, #008352 0%, #006b43 100%); padding: 15px 0; color: white; position: sticky; top: 0; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .n-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .n-logo-text { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 19px; }
        .n-back { background: rgba(255,255,255,0.15); border: none; padding: 10px; border-radius: 12px; color: white; cursor: pointer; transition: 0.3s; }

        .m-main-wrapper { padding: 30px 20px; }
        .m-container-wide { max-width: 1100px; margin: 0 auto; }

        .trainkoi-super-banner {
          background: #ffffff; border-radius: 24px; padding: 25px; margin-bottom: 30px;
          display: flex; justify-content: space-between; align-items: center;
          border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.02);
        }
        .b-content { display: flex; align-items: center; gap: 20px; }
        .b-icon-box { background: #f0fdf4; padding: 15px; border-radius: 20px; }
        .b-text h3 { margin: 0; font-size: 20px; font-weight: 800; color: #008352; }
        .b-text p { margin: 5px 0 0; color: #64748b; font-size: 15px; line-height: 1.5; }
        .b-action-btn { background: #1e293b; color: white; text-decoration: none; padding: 12px 25px; border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; transition: 0.3s; flex-shrink: 0; }
        .b-action-btn:hover { background: #000; transform: translateY(-2px); }

        .m-grid-system { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 30px; }

        .m-map-card { background: white; border-radius: 30px; padding: 30px; border: 1px solid #edf2f7; box-shadow: 0 4px 6px rgba(0,0,0,0.01); }
        .c-head { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; border-bottom: 1.5px solid #f8fafc; padding-bottom: 15px; }
        .c-head h3 { margin: 0; font-size: 19px; font-weight: 800; }

        .st-item { display: flex; gap: 20px; position: relative; }
        .st-line-art { display: flex; flex-direction: column; align-items: center; width: 24px; }
        .st-circle { width: 18px; height: 18px; background: white; border: 3px solid #008352; border-radius: 50%; z-index: 2; display: flex; align-items: center; justify-content: center; }
        .st-large { width: 22px; height: 22px; border-width: 4px; border-color: #059669; }
        .st-dot-inner { width: 6px; height: 6px; background: #008352; border-radius: 50%; }
        .st-connect { width: 4px; height: 100%; background: #f1f5f9; position: absolute; top: 18px; }
        
        .st-info-box { flex: 1; padding-bottom: 35px; }
        .st-top-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
        .st-top-row h4 { margin: 0; font-size: 17px; font-weight: 800; color: #1e293b; }
        .st-tag { font-size: 10px; padding: 3px 10px; border-radius: 8px; font-weight: 800; text-transform: uppercase; }
        .টার্মিনাল { background: #fef2f2; color: #dc2626; }
        .ইন্টারচেঞ্জ { background: #eff6ff; color: #2563eb; }
        .ব্যস্ততম { background: #fffbeb; color: #d97706; }
        
        .st-bottom-row { display: flex; gap: 15px; }
        .st-loc { font-size: 13px; color: #64748b; font-weight: 600; }
        .st-time-est { font-size: 12px; color: #10b981; font-weight: 700; display: flex; align-items: center; }
        .st-view-btn { background: #f8fafc; border: 1px solid #e2e8f0; color: #94a3b8; padding: 8px; border-radius: 12px; height: fit-content; cursor: pointer; }

        .m-sidebar { display: flex; flex-direction: column; gap: 25px; }
        .tk-brand-card { background: #1e293b; color: white; padding: 30px; border-radius: 30px; }
        .tk-badge { background: #008352; font-size: 10px; font-weight: 900; padding: 5px 12px; border-radius: 8px; width: fit-content; margin-bottom: 15px; }
        .tk-brand-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 20px; }
        .tk-feature { display: flex; gap: 12px; margin-bottom: 15px; align-items: flex-start; }
        .tk-feature p { margin: 0; font-size: 14px; line-height: 1.5; opacity: 0.9; }
        .tk-cta-full { width: 100%; background: #008352; border: none; padding: 15px; border-radius: 15px; color: white; font-weight: 800; margin-top: 15px; cursor: pointer; transition: 0.3s; }
        .tk-cta-full:hover { background: #059669; }

        .m-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .info-mini-card { background: white; padding: 20px; border-radius: 20px; text-align: center; border: 1px solid #edf2f7; }
        .info-mini-card h4 { margin: 0; font-size: 18px; color: #008352; font-weight: 900; }
        .info-mini-card p { margin: 5px 0 0; font-size: 12px; color: #64748b; font-weight: 700; }

        .m-notice-box { background: #fff7ed; padding: 20px; border-radius: 20px; border: 1px solid #ffedd5; }
        .n-head { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #c2410c; margin-bottom: 10px; }
        .m-notice-box p { margin: 0; font-size: 13px; color: #9a3412; line-height: 1.6; font-weight: 600; }

        .m-seo-tags { display: flex; flex-wrap: wrap; gap: 10px; }
        .m-seo-tags span { background: #e2e8f0; font-size: 11px; padding: 6px 12px; border-radius: 10px; color: #475569; font-weight: 700; }

        @media (max-width: 900px) {
          .m-grid-system { grid-template-columns: 1fr; }
          .trainkoi-super-banner { flex-direction: column; text-align: center; gap: 20px; }
          .b-content { flex-direction: column; }
          .m-map-card { border-radius: 25px; padding: 20px; }
        }
      `}</style>
    </div>
  );
};

export default MetroMap;