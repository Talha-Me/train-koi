import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Mail, Phone, Send, MessageSquare, 
  Facebook, Twitter, Youtube, HelpCircle, ShieldAlert 
} from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  
  // ১. প্রয়োজনীয় স্টেটগুলো এখানে ডিক্লেয়ার করা হলো
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'সাধারণ জিজ্ঞাসা',
    message: ''
  });

  const handleSmartBack = () => {
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://train-koi.onrender.com/api/contact", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: 'সাধারণ জিজ্ঞাসা', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("দুঃখিত, মেসেজ পাঠানো যায়নি।");
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("সার্ভারের সাথে সংযোগ বিচ্ছিন্ন!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: "'Hind Siliguri', sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: '#006a4e', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 100 }}>
        <ChevronLeft onClick={handleSmartBack} style={{ cursor: 'pointer' }} size={28} />
        <h2 style={{ margin: 0, fontSize: '20px' }}>যোগাযোগ ও সাপোর্ট</h2>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '25px 15px' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ color: '#1a1d1c', fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: '800' }}>আমরা আপনার কথা শুনতে আগ্রহী</h1>
          <p style={{ color: '#666', fontSize: '15px' }}>যেকোনো জিজ্ঞাসা বা অভিযোগ আমাদের জানান</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {/* Contact Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', color: '#006a4e' }}>সরাসরি যোগাযোগ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <ContactItem icon={<Mail color="#006a4e" size={20} />} label="ইমেইল" value="support@trainkoi.com" />
                <ContactItem icon={<ShieldAlert color="#e67e22" size={20} />} label="অভিযোগ কেন্দ্র" value="support@trainkoi.com" />
                <ContactItem icon={<Phone color="#006a4e" size={20} />} label="হটলাইন" value="+৮৮০১৫১৬৫৭৯৭৬০" />
              </div>
            </div>

            <div style={{ backgroundColor: '#006a4e', padding: '20px', borderRadius: '20px', color: 'white' }}>
              <h4 style={{ margin: '0 0 15px' }}>সোশ্যাল মিডিয়ায় যুক্ত হন</h4>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Facebook style={{ cursor: 'pointer' }} size={24} />
                <Twitter style={{ cursor: 'pointer' }} size={24} />
                <Youtube style={{ cursor: 'pointer' }} size={24} />
                <MessageSquare style={{ cursor: 'pointer' }} size={24} />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ backgroundColor: 'white', padding: 'clamp(20px, 5vw, 30px)', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 20px', color: '#006a4e' }}>মেসেজ বা অভিযোগ ফরম</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>আপনার নাম</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="উদা: আবু তালহা আকাশ" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>ইমেইল এড্রেস</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>বিষয় (Subject)</label>
                <select name="subject" value={formData.subject} onChange={handleChange} style={inputStyle}>
                  <option>সাধারণ জিজ্ঞাসা</option>
                  <option>ট্রেন ট্র্যাকিং সমস্যা</option>
                  <option>ভুল তথ্য রিপোর্ট</option>
                  <option>বিজনেস পার্টনারশিপ</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>আপনার বার্তা</label>
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="বিস্তারিত এখানে লিখুন..." rows="4" required style={{ ...inputStyle, resize: 'none' }}></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  backgroundColor: submitted ? '#2ecc71' : '#006a4e', 
                  color: 'white', border: 'none', padding: '15px', 
                  borderRadius: '12px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                }}
              >
                <Send size={18} /> 
                {loading ? 'প্রসেসিং...' : (submitted ? 'পাঠানো হয়েছে!' : 'মেসেজ পাঠান')}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#333' }}>
            <HelpCircle color="#006a4e" /> সচরাচর জিজ্ঞাসিত প্রশ্ন
          </h3>
          <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
            <FAQItem q="ট্রেনকই কি সরকারি অ্যাপ?" a="না, এটি একটি ব্যক্তিগত উদ্যোগ যা ওপেন ডাটা ব্যবহার করে যাত্রীদের সাহায্য করে।" />
            <FAQItem q="টিকিট রিফান্ড করার নিয়ম কি?" a="টিকিট রিফান্ডের জন্য রেলওয়ের অফিসিয়াল কাউন্টার বা ওয়েবসাইটে যোগাযোগ করুন।" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ContactItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '11px', color: '#888' }}>{label}</div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{value}</div>
    </div>
  </div>
);

const FAQItem = ({ q, a }) => (
  <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '15px', border: '1px solid #edf2f1' }}>
    <div style={{ fontWeight: 'bold', color: '#006a4e', marginBottom: '5px', fontSize: '15px' }}>• {q}</div>
    <div style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{a}</div>
  </div>
);

const labelStyle = { fontSize: '13px', color: '#666', display: 'block', marginBottom: '5px' };
const inputStyle = { 
  width: '100%', padding: '12px 15px', borderRadius: '10px', 
  border: '1px solid #eee', outline: 'none', backgroundColor: '#f9f9f9',
  boxSizing: 'border-box', fontSize: '14px'
};

export default Contact;