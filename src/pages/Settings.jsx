import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ShieldCheck, FileText, 
  AlertTriangle, Moon, ChevronRight,
  Info, MessageCircle, Heart, Sun, Globe
} from 'lucide-react';
import Navbar from './components/Navbar';

const Settings = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  // Language State: 'bn' or 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'bn';
  });

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Language toggle handler
  const handleLanguageToggle = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    localStorage.setItem('app_lang', nextLang);
    
    // Broadcast event for entire site to react immediately
    window.dispatchEvent(new Event('languageChange'));
  };

  // UI Translation dictionary
  const t = {
    settings: lang === 'bn' ? 'সেটিংস ও কন্ট্রোল' : 'Settings & Controls',
    guestTitle: lang === 'bn' ? 'স্বাগতম, গেস্ট ইউজার!' : 'Welcome, Guest User!',
    guestSubtitle: lang === 'bn' ? 'ট্রেনকই প্ল্যাটফর্ম ব্যবহারের জন্য ধন্যবাদ' : 'Thank you for using TrainKoi',
    supportGroup: lang === 'bn' ? 'সহায়তা ও তথ্য' : 'Support & Information',
    about: lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us',
    aboutDesc: lang === 'bn' ? 'ট্রেনকই প্ল্যাটফর্ম ও টিম পরিচিতি' : 'About TrainKoi platform & team',
    helpCenter: lang === 'bn' ? 'হেল্প সেন্টার ও সাধারণ জিজ্ঞাসা' : 'Help Center & FAQ',
    helpDesc: lang === 'bn' ? 'জরুরি প্রশ্নোত্তর ও সরাসরি যোগাযোগ' : 'Frequently Asked Questions & support',
    legalGroup: lang === 'bn' ? 'আইন ও নীতিমালা' : 'Legal & Policies',
    privacy: lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy',
    privacyDesc: lang === 'bn' ? 'আপনার তথ্যের শতভাগ নিরাপত্তা' : 'Your data privacy & security',
    terms: lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions',
    termsDesc: lang === 'bn' ? 'প্ল্যাটফর্ম ব্যবহারের নিয়ম ও গাইডলাইন' : 'Rules and platform guidelines',
    disclaimer: lang === 'bn' ? 'দায়মুক্তি নোটিশ' : 'Disclaimer',
    disclaimerDesc: lang === 'bn' ? 'বাংলাদেশ রেলওয়ের সাথে সম্পর্ক ও দায়সীমা' : 'Affiliation with Bangladesh Railway',
    appSettingsGroup: lang === 'bn' ? 'অ্যাপ ও পার্সোনালাইজেশন' : 'Preferences & Personalization',
    langLabel: lang === 'bn' ? 'ভাষা / Language' : 'Language / ভাষা',
    langDesc: lang === 'bn' ? 'বাংলা (English করুন)' : 'English (বাংলায় দেখুন)',
    theme: lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode',
    themeDesc: isDarkMode ? (lang === 'bn' ? 'চালু আছে' : 'Enabled') : (lang === 'bn' ? 'বন্ধ আছে' : 'Disabled'),
    madeFor: 'Made with passion for Bangladesh Railway Travelers',
    version: 'Version 2.0.4 (Stable Release • 2026)'
  };

  const settingsGroups = [
    {
      groupName: t.appSettingsGroup,
      options: [
        { 
          id: 'language', 
          icon: <Globe />, 
          label: t.langLabel, 
          desc: t.langDesc, 
          color: '#e91e63',
          action: handleLanguageToggle
        },
        { 
          id: 'theme', 
          icon: isDarkMode ? <Sun /> : <Moon />, 
          label: t.theme, 
          desc: t.themeDesc, 
          color: '#546e7a',
          action: () => setIsDarkMode(!isDarkMode)
        }
      ]
    },
    {
      groupName: t.supportGroup,
      options: [
        { 
          id: 'about', 
          icon: <Info />, 
          label: t.about, 
          desc: t.aboutDesc, 
          color: '#006a4e', 
          path: '/about' 
        },
        { 
          id: 'help', 
          icon: <MessageCircle />, 
          label: t.helpCenter, 
          desc: t.helpDesc, 
          color: '#0288d1', 
          path: '/faq' 
        }
      ]
    },
    {
      groupName: t.legalGroup,
      options: [
        { 
          id: 'privacy', 
          icon: <ShieldCheck />, 
          label: t.privacy, 
          desc: t.privacyDesc, 
          color: '#43a047', 
          path: '/privacy' 
        },
        { 
          id: 'terms', 
          icon: <FileText />, 
          label: t.terms, 
          desc: t.termsDesc, 
          color: '#fb8c00', 
          path: '/terms' 
        },
        { 
          id: 'disclaimer', 
          icon: <AlertTriangle />, 
          label: t.disclaimer, 
          desc: t.disclaimerDesc, 
          color: '#e53935', 
          path: '/disclaimer' 
        }
      ]
    }
  ];

  return (
    <div className={`st-root ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar />

      {/* Mobile Sticky Header */}
      <div className="st-mobile-header">
        <div className="st-mobile-header-in">
          <div onClick={() => navigate(-1)} className="st-back-btn">
            <ChevronLeft size={26} />
          </div>
          <h2 className="st-mobile-title">{t.settings}</h2>
        </div>
      </div>

      <div className="st-container">
        {/* User Status Card */}
        <div className="st-user-card">
          <div className="st-user-avatar">
            <Heart size={32} color="#fff" />
          </div>
          <div>
            <h3 className="st-user-title">{t.guestTitle}</h3>
            <p className="st-user-subtitle">{t.guestSubtitle}</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="st-grid">
          {settingsGroups.map((group, gIdx) => (
            <div key={gIdx} className="st-group-card">
              <h4 className="st-group-title">{group.groupName}</h4>
              <div className="st-options-list">
                {group.options.map((option, oIdx) => (
                  <div 
                    key={oIdx}
                    onClick={() => {
                      if (option.path) navigate(option.path);
                      if (option.action) option.action();
                    }}
                    className="st-option-row"
                  >
                    <div className="st-opt-left">
                      <div 
                        className="st-icon-box"
                        style={{ color: option.color, backgroundColor: `${option.color}15` }}
                      >
                        {React.cloneElement(option.icon, { size: 20 })}
                      </div>
                      <div>
                        <div className="st-opt-label">{option.label}</div>
                        <div className="st-opt-desc">{option.desc}</div>
                      </div>
                    </div>
                    
                    <ChevronRight size={18} className="st-chevron" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* App Info Footer */}
        <div className="st-footer">
          <div className="st-footer-brand">
            <Heart size={16} fill={isDarkMode ? '#2ecc71' : '#006a4e'} /> {t.madeFor}
          </div>
          <p className="st-footer-version">
            {t.version}
          </p>
        </div>
      </div>

      <style>{`
        .st-root {
          background-color: #f4f7f6;
          min-height: 100vh;
          font-family: 'Hind Siliguri', sans-serif;
          transition: all 0.3s ease;
          padding-bottom: 70px;
        }
        .st-root.dark-mode {
          background-color: #121212;
          color: #eee;
        }

        .st-mobile-header {
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
          .st-mobile-header {
            display: block;
          }
        }
        .st-mobile-header-in {
          display: flex;
          align-items: center;
          gap: 15px;
          max-width: 1440px;
          margin: 0 auto;
        }
        .st-back-btn {
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .st-mobile-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .st-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        .st-user-card {
          background: linear-gradient(135deg, #006a4e 0%, #004d39 100%);
          padding: 28px 32px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 28px;
          color: white;
          box-shadow: 0 10px 25px rgba(0, 106, 78, 0.18);
        }
        .st-user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          flex-shrink: 0;
        }
        .st-user-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
        }
        .st-user-subtitle {
          margin: 4px 0 0;
          opacity: 0.88;
          font-size: 14px;
        }

        .st-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
          gap: 24px;
        }

        .st-group-card {
          background: #ffffff;
          border-radius: 22px;
          padding: 22px;
          border: 1px solid #e2ebe7;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .st-root.dark-mode .st-group-card {
          background: #1e1e1e;
          border-color: #2a2a2a;
        }
        .st-group-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        }

        .st-group-title {
          margin: 0 0 14px;
          font-size: 14px;
          font-weight: 800;
          color: #006a4e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #edf2f7;
          padding-bottom: 8px;
        }
        .st-root.dark-mode .st-group-title {
          color: #2ecc71;
          border-color: #2a2a2a;
        }

        .st-options-list {
          display: flex;
          flex-direction: column;
        }
        .st-option-row {
          padding: 14px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .st-root.dark-mode .st-option-row {
          border-color: #282828;
        }
        .st-option-row:last-child {
          border-bottom: none;
        }
        .st-option-row:hover {
          background-color: #f8fafc;
          transform: translateX(4px);
        }
        .st-root.dark-mode .st-option-row:hover {
          background-color: #252525;
        }

        .st-opt-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .st-icon-box {
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .st-opt-label {
          font-weight: 700;
          font-size: 15px;
          color: #1e293b;
        }
        .st-root.dark-mode .st-opt-label {
          color: #eee;
        }
        .st-opt-desc {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }
        .st-root.dark-mode .st-opt-desc {
          color: #888;
        }
        .st-chevron {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }
        .st-option-row:hover .st-chevron {
          color: #006a4e;
          transform: translateX(3px);
        }

        .st-footer {
          text-align: center;
          margin-top: 40px;
          padding-bottom: 30px;
        }
        .st-footer-brand {
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
          color: #006a4e;
          margin-bottom: 6px;
          font-weight: 800;
          font-size: 14px;
        }
        .st-root.dark-mode .st-footer-brand {
          color: #2ecc71;
        }
        .st-footer-version {
          color: #94a3b8;
          font-size: 12px;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Settings;
