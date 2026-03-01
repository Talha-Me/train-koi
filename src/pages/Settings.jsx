import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, User, ShieldCheck, FileText, 
  AlertTriangle, Moon, Bell, ChevronRight,
  Info, Share2, Star, MessageCircle, Heart
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      groupName: "একাউন্ট ও সাপোর্ট",
      options: [
        { id: 'login', icon: <User />, label: 'প্রোফাইল', desc: 'লগইন ছাড়াই ব্যবহারযোগ্য', color: '#006a4e' },
        { id: 'help', icon: <MessageCircle />, label: 'হেল্প সেন্টার', desc: 'সাধারণ জিজ্ঞাসা ও উত্তর', color: '#0288d1', path: '/faq' }
      ]
    },
    {
      groupName: "আইনি ও পলিসি (অ্যাডসেন্স রেডি)",
      options: [
        { id: 'privacy', icon: <ShieldCheck />, label: 'প্রাইভেসি পলিসি', desc: 'আপনার তথ্যের নিরাপত্তা', color: '#43a047', path: '/privacy' },
        { id: 'terms', icon: <FileText />, label: 'ব্যবহারের শর্তাবলী', desc: 'অ্যাপ ব্যবহারের নিয়মসমূহ', color: '#fb8c00', path: '/terms' },
        { id: 'disclaimer', icon: <AlertTriangle />, label: 'দায়মুক্তি নোটিশ', desc: 'রেলওয়ের সাথে সম্পর্ক', color: '#e53935', path: '/disclaimer' }
      ]
    },
    {
      groupName: "অ্যাপ সেটিংস",
      options: [
        { id: 'notify', icon: <Bell />, label: 'নোটিফিকেশন', desc: 'অন করা আছে', color: '#8e24aa' },
        { id: 'theme', icon: <Moon />, label: 'ডার্ক মোড', desc: 'শীঘ্রই আসছে...', color: '#546e7a' }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
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
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>Settings</h2>
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
            <h3 style={{ margin: 0, fontSize: '20px' }}>স্বাগতম, গেস্ট ইউজার!</h3>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '13px' }}>ট্রেনকই এর সাথে থাকার জন্য ধন্যবাদ</p>
          </div>
        </div>

        {/* Dynamic Groups */}
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '14px', color: '#006a4e', fontWeight: 'bold', marginLeft: '15px', marginBottom: '10px', textTransform: 'uppercase' }}>{group.groupName}</p>
            <div style={{ backgroundColor: 'white', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              {group.options.map((option, oIdx) => (
                <div 
                  key={oIdx}
                  onClick={() => {
                    if (option.path) navigate(option.path);
                  }}
                  style={{ 
                    padding: '18px 20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: option.path ? 'pointer' : 'default',
                    borderBottom: oIdx !== group.options.length - 1 ? '1px solid #f8f8f8' : 'none',
                    opacity: option.path ? 1 : 0.7
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      color: option.color, 
                      backgroundColor: `${option.color}10`, 
                      padding: '10px', 
                      borderRadius: '12px' 
                    }}>
                      {React.cloneElement(option.icon, { size: 22 })}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#333' }}>{option.label}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{option.desc}</div>
                    </div>
                  </div>
                  {option.path && <ChevronRight size={18} color="#ddd" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* App Info & Socials */}
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', color: '#006a4e', marginBottom: '10px', fontWeight: 'bold' }}>
            <Heart size={16} fill="#006a4e" /> Made for Bangladesh
          </div>
          <p style={{ color: '#bbb', fontSize: '12px', margin: 0 }}>Version 2.0.4 (Stable Release)</p>
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