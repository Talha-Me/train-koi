import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Train, 
  ExternalLink, 
  MessageCircle 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#006a4e', color: 'white', paddingTop: '50px', paddingBottom: '20px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
        {/* কলাম ১: লোগো ও বর্ণনা */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Train size={30} color="#2ecc71" />
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>ট্রেনকই</h2>
          </div>

          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1', textAlign: 'justify' }}>
            বাংলাদেশ রেলওয়ের সকল তথ্য ও সেবাকে সাধারণ মানুষের হাতের নাগালে পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য। 
            সঠিক শিডিউল এবং লাইভ ট্র্যাকিং নিয়ে আমরা আছি আপনার পাশে।
          </p>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <a href="https://www.facebook.com/profile.php?id=61574560277512" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <Facebook size={20} />
            </a>
            <a href="https://chat.whatsapp.com/LBEt1rOfQXIHZDhMbTZxD1" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <MessageCircle size={20} />
            </a>
            <a href="https://t.me/trainkoi" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <Send size={20} />
            </a>
          </div>

          {/* Developer Credit */}
          <div style={{ marginTop: '25px', fontSize: '13px', color: '#94a3b8' }}>
            This site is developed by{" "}
            <a
              href="https://talhabyteit.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2ecc71', textDecoration: 'none', fontWeight: '600' }}
            >
              Talhabyte IT
            </a>
          </div>
        </div>

        {/* কলাম ২: লিঙ্কসমূহ */}
        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '5px' }}>গুরুত্বপূর্ণ লিঙ্ক</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
            <li style={{ marginBottom: '10px' }}><a href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>হোম পেজ</a></li>
            <li style={{ marginBottom: '10px' }}><a href="/schedule" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ট্রেন শিডিউল</a></li>
            <li style={{ marginBottom: '10px' }}><a href="/blogs" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ভ্রমণ ব্লগ</a></li>
            <li style={{ marginBottom: '10px' }}><a href="https://eticket.railway.gov.bd/" target="_blank" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>টিকিট বুকিং <ExternalLink size={14} /></a></li>
            <li style={{ marginBottom: '10px' }}><a href="/Contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>যোগাযোগ করুন</a></li>
          </ul>
        </div>

        {/* কলাম ৩: কন্টাক্ট */}
        <div>
          <h4 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '5px' }}>যোগাযোগ করুন</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
            <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', color: '#cbd5e1' }}>
              <Mail size={18} color="#2ecc71" /> support@trainkoi.com
            </li>
            <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', color: '#cbd5e1' }}>
              <Phone size={18} color="#2ecc71" /> +8801516579760
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', padding: '20px 20px 0', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
        <p>© ২০২৬ <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>ট্রেনকই</span>. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};

export default Footer;