// import React from 'react';
// import { 
//   Facebook, 
//   Instagram, 
//   Send, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Train, 
//   ExternalLink, 
//   MessageCircle 
// } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer style={{ backgroundColor: '#006a4e', color: 'white', paddingTop: '50px', paddingBottom: '20px', fontFamily: "'Hind Siliguri', sans-serif" }}>
//       <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
        
//         {/* কলাম ১: লোগো ও বর্ণনা */}
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
//             <Train size={30} color="#2ecc71" />
//             <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>ট্রেনকই</h2>
//           </div>

//           <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1', textAlign: 'justify' }}>
//             বাংলাদেশ রেলওয়ের সকল তথ্য ও সেবাকে সাধারণ মানুষের হাতের নাগালে পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য। 
//             সঠিক শিডিউল এবং লাইভ ট্র্যাকিং নিয়ে আমরা আছি আপনার পাশে।
//           </p>

//           <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
//             <a href="https://www.facebook.com/profile.php?id=61574560277512" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
//               <Facebook size={20} />
//             </a>
//             <a href="https://chat.whatsapp.com/LBEt1rOfQXIHZDhMbTZxD1" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
//               <MessageCircle size={20} />
//             </a>
//             <a href="https://t.me/trainkoi" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: '#006a4e', padding: '10px', borderRadius: '50%', display: 'flex' }}>
//               <Send size={20} />
//             </a>
//           </div>

//           {/* Developer Credit */}
//           <div style={{ marginTop: '25px', fontSize: '13px', color: '#94a3b8' }}>
//             This site is developed by{" "}
//             <a
//               href="https://talhabyteit.vercel.app/"
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: '#2ecc71', textDecoration: 'none', fontWeight: '600' }}
//             >
//               Talhabyte IT
//             </a>
//           </div>
//         </div>

//         {/* কলাম ২: লিঙ্কসমূহ */}
//         <div>
//           <h4 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '5px' }}>গুরুত্বপূর্ণ লিঙ্ক</h4>
//           {/* <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
//             <li style={{ marginBottom: '10px' }}><a href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>হোম পেজ</a></li>
//             <li style={{ marginBottom: '10px' }}><a href="/schedule" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ট্রেন শিডিউল</a></li>
//             <li style={{ marginBottom: '10px' }}><a href="/blogs" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ভ্রমণ ব্লগ</a></li>
//             <li style={{ marginBottom: '10px' }}><a href="https://eticket.railway.gov.bd/" target="_blank" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>টিকিট বুকিং <ExternalLink size={14} /></a></li>
//             <li style={{ marginBottom: '10px' }}><a href="/Contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>যোগাযোগ করুন</a></li>
//           </ul> */}
//           <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
//   {/* প্রধান লিংকসমূহ */}
//   <li style={{ marginBottom: '10px' }}>
//     <a href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>হোম পেজ</a>
//   </li>

//   <li style={{ marginBottom: '15px' }}>
//     <a href="/Contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>যোগাযোগ করুন</a>
//   </li>
//   {/* আইনি ও পলিসি লিংকসমূহ (AdSense পাসের জন্য অত্যন্ত জরুরি) */}
//   <li style={{ marginBottom: '10px' }}>
//     <a href="privacy" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>প্রাইভেসি পলিসি</a>
//   </li>
//   <li style={{ marginBottom: '10px' }}>
//     <a href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>ব্যবহারের শর্তাবলী</a>
//   </li>
//   <li style={{ marginBottom: '10px' }}>
//     <a href="/disclaimer" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '14px' }}>দায়মুক্তি নোটিশ</a>
//   </li>
// </ul>
//         </div>

//         {/* কলাম ৩: কন্টাক্ট */}
//         <div>
//           <h4 style={{ fontSize: '18px', marginBottom: '20px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '5px' }}>যোগাযোগ করুন</h4>
//           <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
//             <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', color: '#cbd5e1' }}>
//               <Mail size={18} color="#2ecc71" /> support@trainkoi.com
//             </li>
//             <li style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center', color: '#cbd5e1' }}>
//               <Phone size={18} color="#2ecc71" /> +8801516579760
//             </li>
//           </ul>
//         </div>
//       </div>

//       <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', padding: '20px 20px 0', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
//         <p>© ২০২৬ <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>ট্রেনকই</span>. সর্বস্বত্ব সংরক্ষিত।</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from 'react';
import { 
  Facebook, 
  Send, 
  Mail, 
  Phone, 
  Train, 
  MessageCircle 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#006a4e', color: 'white', paddingTop: '50px', paddingBottom: '25px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
        
        {/* কলাম ১: লোগো ও বর্ণনা */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <img 
              src="/trainkoi-icon.png" 
              alt="TrainKoi" 
              style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }} 
            />
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '1px' }}>ট্রেনকই</h2>
          </div>

          <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: '#cbd5e1', textAlign: 'justify', margin: '0 0 16px' }}>
            বাংলাদেশ রেলওয়ের সকল ট্রেনের লাইভ লোকেশন, সঠিক সময়সূচী, ভাড়ার তালিকা এবং নির্ভরযোগ্য ভ্রমণ গাইড সাধারণ মানুষের কাছে পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য।
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            <a href="https://www.facebook.com/profile.php?id=61574560277512" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.12)', padding: '9px', borderRadius: '50%', display: 'flex' }} aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://chat.whatsapp.com/LBEt1rOfQXIHZDhMbTZxD1" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.12)', padding: '9px', borderRadius: '50%', display: 'flex' }} aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href="https://t.me/trainkoi" target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.12)', padding: '9px', borderRadius: '50%', display: 'flex' }} aria-label="Telegram">
              <Send size={18} />
            </a>
          </div>

          {/* Developer Credit */}
          <div style={{ marginTop: '20px', fontSize: '12.5px', color: '#94a3b8' }}>
            Developed by{" "}
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

        {/* কলাম ২: ট্রেন সেবা ও ট্র্যাকিং */}
        <div>
          <h4 style={{ fontSize: '16.5px', marginBottom: '16px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '4px', fontWeight: '700' }}>ট্রেন সেবা ও ট্র্যাকিং</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13.5px', lineHeight: '2.1' }}>
            <li><a href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>হোম পেজ</a></li>
            <li><a href="/schedule" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ট্রেন সময়সূচী ও রুট</a></li>
            <li><a href="/live-trains" style={{ color: '#cbd5e1', textDecoration: 'none' }}>লাইভ রানিং ট্রেন</a></li>
            <li><a href="/metro-rail" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ঢাকা মেট্রোরেল গাইড</a></li>
            <li><a href="/travel-laws" style={{ color: '#cbd5e1', textDecoration: 'none' }}>রেল ভ্রমণ আইন ও বিধিমালা</a></li>
          </ul>
        </div>

        {/* কলাম ৩: ভ্রমণ ব্লগ ও রেল সংবাদ (AdSense এর জন্য অত্যন্ত জরুরি) */}
        <div>
          <h4 style={{ fontSize: '16.5px', marginBottom: '16px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '4px', fontWeight: '700' }}>ভ্রমণ গাইড ও সংবাদ</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13.5px', lineHeight: '2.1' }}>
            <li><a href="/blogs" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>ট্রেন ভ্রমণ ব্লগ (৪৫টি গাইড) ➔</a></li>
            <li><a href="/rail-news" style={{ color: '#cbd5e1', textDecoration: 'none', fontWeight: '600' }}>রেল বার্তা ও নোটিশ (৪৪টি নিউজ) ➔</a></li>
            <li><a href="/faq" style={{ color: '#cbd5e1', textDecoration: 'none' }}>সাধারণ জিজ্ঞাসা (FAQ)</a></li>
            <li><a href="https://eticket.railway.gov.bd/" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>রেলওয়ে টিকিট পোর্টাল ↗</a></li>
          </ul>
        </div>

        {/* কলাম ৪: আইনি নির্দেশিকা ও যোগাযোগ */}
        <div>
          <h4 style={{ fontSize: '16.5px', marginBottom: '16px', borderBottom: '2px solid #2ecc71', display: 'inline-block', paddingBottom: '4px', fontWeight: '700' }}>পলিসি ও যোগাযোগ</h4>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '13.5px', lineHeight: '2.1' }}>
            <li><a href="/about" style={{ color: '#cbd5e1', textDecoration: 'none' }}>আমাদের সম্পর্কে (About Us)</a></li>
            <li><a href="/Contact" style={{ color: '#cbd5e1', textDecoration: 'none' }}>যোগাযোগ করুন (Contact)</a></li>
            <li><a href="/privacy" style={{ color: '#cbd5e1', textDecoration: 'none' }}>গোপনীয়তা নীতি (Privacy Policy)</a></li>
            <li><a href="/terms" style={{ color: '#cbd5e1', textDecoration: 'none' }}>ব্যবহারের শর্তাবলী (Terms of Service)</a></li>
            <li><a href="/disclaimer" style={{ color: '#cbd5e1', textDecoration: 'none' }}>দায়মুক্তি নোটিশ (Disclaimer)</a></li>
          </ul>

          <div style={{ marginTop: '16px', fontSize: '12.5px', color: '#cbd5e1' }}>
            <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} color="#2ecc71" /> support@trainkoi.com
            </p>
            <p style={{ margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} color="#2ecc71" /> +8801516579760
            </p>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '35px', padding: '18px 20px 0', textAlign: 'center', fontSize: '12.5px', color: '#94a3b8' }}>
        <p style={{ margin: 0 }}>© ২০২৬ <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>ট্রেনকই (TrainKoi)</span>. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};

export default Footer;