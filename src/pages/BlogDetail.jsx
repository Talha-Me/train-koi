import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { blogs } from '../data/blogData';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // আইডি অনুযায়ী নির্দিষ্ট ব্লগটি খুঁজে বের করা
  const blog = blogs.find(b => b.id === parseInt(id));

  // পেজের শুরুতে স্ক্রল নিয়ে যাওয়া
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // শেয়ার ফাংশনালিটি
  const handleShare = async () => {
    const shareData = {
      title: blog?.title,
      text: blog?.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // যদি ব্রাউজারে শেয়ার এপিআই না থাকে তবে লিঙ্ক কপি হবে
        await navigator.clipboard.writeText(window.location.href);
        alert('লিঙ্কটি কপি করা হয়েছে!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  if (!blog) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>ব্লগটি পাওয়া যায়নি!</div>;
  }

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '50px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>ফিরে যান</h3>
        </div>
        <Share2 size={20} style={{ cursor: 'pointer' }} onClick={handleShare} />
      </div>

      {/* Main Image */}
      <img src="/homeimg.png" alt={blog.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />

      <div style={{ padding: '25px', marginTop: '-30px', backgroundColor: 'white', borderRadius: '30px 30px 0 0', position: 'relative', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Category & Meta */}
        <span style={{ backgroundColor: '#e8f5e9', color: '#006a4e', padding: '5px 15px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px' }}>
          {blog.category}
        </span>

        <h1 style={{ fontSize: '24px', color: '#1e293b', lineHeight: '1.4', fontWeight: '800', margin: '0 0 15px 0' }}>
          {blog.title}
        </h1>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8' }}>
            <Calendar size={14} /> {blog.date}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8' }}>
            <Clock size={14} /> {blog.readTime}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8' }}>
            <User size={14} /> এডমিন
          </div>
        </div>

        {/* Blog Content */}
        <div style={{ fontSize: '16px', color: '#444', lineHeight: '1.8', textAlign: 'justify', whiteSpace: 'pre-line' }}>
          {blog.content}
        </div>

        {/* Interaction Box */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '20px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>এই গল্পটি আপনার কেমন লেগেছে?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
             <button style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #006a4e', background: 'white', color: '#006a4e', fontWeight: 'bold' }}>চমৎকার!</button>
             <button 
               onClick={handleShare}
               style={{ padding: '10px 20px', borderRadius: '10px', background: '#006a4e', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
             >
               শেয়ার করুন
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;