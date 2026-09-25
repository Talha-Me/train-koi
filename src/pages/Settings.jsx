import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, ShieldCheck, FileText, 
  AlertTriangle, Moon, Bell, ChevronRight,
  Info, Share2, Star, MessageCircle, Heart, Sun, Globe
} from 'lucide-react';

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
    settings: lang === 'bn' ? 'সেটিংস' : 'Settings',
    guestTitle: lang === 'bn' ? 'স্বাগতম, গেস্ট ইউজার!' : 'Welcome, Guest User!',
    guestSubtitle: lang === 'bn' ? 'ট্রেনকই এর সাথে থাকার জন্য ধন্যবাদ' : 'Thank you for staying with TrainKoi',
    accountGroup: lang === 'bn' ? 'একাউন্ট ও সাপোর্ট' : 'Account & Support',
    profile: lang === 'bn' ? 'প্রোফাইল' : 'Profile',
    profileDesc: lang === 'bn' ? 'লগইন ছাড়াই ব্যবহারযোগ্য' : 'Usable without login',
    helpCenter: lang === 'bn' ? 'হেল্প সেন্টার' : 'Help Center',
    helpDesc: lang === 'bn' ? 'সাধারণ জিজ্ঞাসা ও উত্তর' : 'Frequently Asked Questions',
    legalGroup: lang === 'bn' ? 'আইনি ও পলিসি (অ্যাডসেন্স রেডি)' : 'Legal & Policies',
    privacy: lang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy',
    privacyDesc: lang === 'bn' ? 'আপনার তথ্যের নিরাপত্তা' : 'Your data privacy & security',
    terms: lang === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions',
    termsDesc: lang === 'bn' ? 'অ্যাপ ব্যবহারের নিয়মসমূহ' : 'Rules and app guidelines',
    disclaimer: lang === 'bn' ? 'দায়মুক্তি নোটিশ' : 'Disclaimer',
    disclaimerDesc: lang === 'bn' ? 'রেলওয়ের সাথে সম্পর্ক' : 'Affiliation with BR',
    appSettingsGroup: lang === 'bn' ? 'অ্যাপ সেটিংস' : 'App Settings',
    notification: lang === 'bn' ? 'নোটিফিকেশন' : 'Notification',
    notifyDesc: lang === 'bn' ? 'অন করা আছে' : 'Enabled',
    langLabel: lang === 'bn' ? 'ভাষা / Language' : 'Language / ভাষা',
    langDesc: lang === 'bn' ? 'বাংলা (English করুন)' : 'English (বাংলায় দেখুন)',
    theme: lang === 'bn' ? 'ডার্ক মোড' : 'Dark Mode',
    themeDesc: isDarkMode ? (lang === 'bn' ? 'চালু আছে' : 'Enabled') : (lang === 'bn' ? 'বন্ধ আছে' : 'Disabled'),
    madeFor: lang === 'bn' ? 'Made for Bangladesh' : 'Made for Bangladesh',
    version: lang === 'bn' ? 'Version 2.0.4 (Stable Release)' : 'Version 2.0.4 (Stable Release)'
  };

  const settingsGroups = [
    {
      groupName: t.accountGroup,
      options: [
        { id: 'login', icon: <User />, label: t.profile, desc: t.profileDesc, color: '#006a4e' },
        { id: 'help', icon: <MessageCircle />, label: t.helpCenter, desc: t.helpDesc, color: '#0288d1', path: '/faq' }
      ]
    },
    {
      groupName: t.legalGroup,
      options: [
        { id: 'privacy', icon: <ShieldCheck />, label: t.privacy, desc: t.privacyDesc, color: '#43a047', path: '/privacy' },
        { id: 'terms', icon: <FileText />, label: t.terms, desc: t.termsDesc, color: '#fb8c00', path: '/terms' },
        { id: 'disclaimer', icon: <AlertTriangle />, label: t.disclaimer, desc: t.disclaimerDesc, color: '#e53935', path: '/disclaimer' }
      ]
    },
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
        { id: 'notify', icon: <Bell />, label: t.notification, desc: t.notifyDesc, color: '#8e24aa' },
        { 
          id: 'theme', 
          icon: isDarkMode ? <Sun /> : <Moon />, 
          label: t.theme, 
          desc: t.themeDesc, 
          color: '#546e7a',
          action: () => setIsDarkMode(!isDarkMode)
        }
      ]
    }
  ];

  return (
    <div style={{ 
      backgroundColor: isDarkMode ? '#121212' : '#f4f7f6', 
      minHeight: '100vh', 
      fontFamily: "'Hind Siliguri', sans-serif",
      transition: 'all 0.3s ease'
    }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: '#006a4e', 
        padding: '20px', 
        color: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '800px', margin: '0 auto' }}>
          <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', padding: '5px' }}>
            <ChevronLeft size={28} />
          </div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{t.settings}</h2>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        
        {/* User Status Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', 
          padding: '25px', 
          borderRadius: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          marginBottom: '30px',
          color: 'white',
          boxShadow: '0 10px 20px rgba(0,106,78,0.15)'
        }}>
          <div style={{ width: '65px', height: '65px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <User size={35} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '20px' }}>{t.guestTitle}</h3>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '13px' }}>{t.guestSubtitle}</p>
          </div>
        </div>

        {/* Dynamic Groups */}
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '14px', color: '#006a4e', fontWeight: 'bold', marginLeft: '15px', marginBottom: '10px', textTransform: 'uppercase' }}>{group.groupName}</p>
            <div style={{ 
              backgroundColor: isDarkMode ? '#1e1e1e' : 'white', 
              borderRadius: '25px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)' 
            }}>
              {group.options.map((option, oIdx) => (
                <div 
                  key={oIdx}
                  onClick={() => {
                    if (option.path) navigate(option.path);
                    if (option.action) option.action();
                  }}
                  style={{ 
                    padding: '18px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    cursor: (option.path || option.action) ? 'pointer' : 'default',
                    borderBottom: oIdx !== group.options.length - 1 ? (isDarkMode ? '1px solid #333' : '1px solid #f8f8f8') : 'none',
                    opacity: (option.path || option.action) ? 1 : 0.7
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      color: option.color, 
                      backgroundColor: `${option.color}15`, 
                      padding: '10px', 
                      borderRadius: '12px' 
                    }}>
                      {React.cloneElement(option.icon, { size: 22 })}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: isDarkMode ? '#eee' : '#333' }}>{option.label}</div>
                      <div style={{ fontSize: '12px', color: isDarkMode ? '#777' : '#999' }}>{option.desc}</div>
                    </div>
                  </div>
                  {(option.path || option.id === 'theme' || option.id === 'language') && (
                    <ChevronRight size={18} color={isDarkMode ? "#444" : "#ddd"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Info & Socials */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', color: '#006a4e', marginBottom: '10px', fontWeight: 'bold' }}>
            <Heart size={16} fill="#006a4e" /> {t.madeFor}
          </div>
          <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>{t.version}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
             <Share2 size={20} color="#006a4e" />
             <Star size={20} color="#006a4e" />
             <Info size={20} color="#006a4e" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;