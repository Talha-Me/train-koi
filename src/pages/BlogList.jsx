import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, Clock, ChevronRight, 
  MessageSquare, Newspaper 
} from 'lucide-react';
import { blogs } from '../data/blogData';

const BlogList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('সব');

  // ইউনিক ক্যাটাগরি লিস্ট তৈরি করা
  const categories = ['সব', ...new Set(blogs.map(blog => blog.category))];

  // ক্যাটাগরি অনুযায়ী ব্লগ ফিল্টার করা
  const filteredBlogs = selectedCategory === 'সব' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '60px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <ChevronLeft onClick={() => navigate(-1)} style={{ cursor: 'pointer', marginRight: '15px' }} />
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>রেলওয়ে ব্লগ ও নিউজ</h3>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #eee', position: 'sticky', top: '65px', zIndex: 99 }}>
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '50px',
              border: 'none',
              backgroundColor: selectedCategory === cat ? '#006a4e' : '#f0f0f0',
              color: selectedCategory === cat ? 'white' : '#555',
              fontSize: '13px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px' }}>
        
        {/* Intro SEO Card */}
        {selectedCategory === 'সব' && (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '30px', marginBottom: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e0e0e0' }}>
            <h1 style={{ fontSize: '22px', color: '#006a4e', marginBottom: '12px', lineHeight: '1.4', fontWeight: '800' }}>
              ট্রেন ভ্রমণ হোক আনন্দদায়ক ও তথ্যবহুল
            </h1>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.8', margin: 0 }}>
              আপনার ট্রেন যাত্রাকে আরও সহজ করতে <strong>Trainkoi</strong> নিয়মিত শেয়ার করে প্রয়োজনীয় টিপস, খবর এবং ভ্রমণের গল্প।
            </p>
          </div>
        )}

        {/* Featured Blog */}
        {filteredBlogs.length > 0 && (
          <div 
            onClick={() => navigate(`/blog/${filteredBlogs[0].id}`)} 
            style={{ backgroundColor: 'white', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '25px', cursor: 'pointer', border: '1px solid #eee' }}
          >
            <div style={{ position: 'relative' }}>
              <img src="/homeimg.png" alt={filteredBlogs[0].title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#006a4e', color: 'white', padding: '5px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>
                {filteredBlogs[0].category}
              </div>
            </div>
            <div style={{ padding: '22px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b', lineHeight: '1.4', fontWeight: '800' }}>{filteredBlogs[0].title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '18px' }}>{filteredBlogs[0].excerpt}</p>
            </div>
          </div>
        )}

        {/* Section Title */}
        <h2 style={{ fontSize: '17px', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '5px', fontWeight: 'bold' }}>
          <Newspaper size={20} color="#006a4e" /> 
          {selectedCategory === 'সব' ? 'সাম্প্রতিক পোস্টসমূহ' : `${selectedCategory} ক্যাটাগরি`}
        </h2>

        {/* Main List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredBlogs.slice(1).map(blog => (
            <div 
              key={blog.id} 
              onClick={() => navigate(`/blog/${blog.id}`)} 
              style={{ backgroundColor: 'white', borderRadius: '25px', padding: '15px', display: 'flex', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', cursor: 'pointer', borderLeft: '6px solid #006a4e', borderTop: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}
            >
              <img src="/homeimg.png" alt={blog.title} style={{ width: '85px', height: '85px', borderRadius: '18px', objectFit: 'cover' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>{blog.category}</span>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1e293b', lineHeight: '1.4', fontWeight: 'bold' }}>{blog.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <span style={{ fontSize: '11px', color: '#94a3b8' }}>{blog.date}</span>
                   <div style={{ display: 'flex', alignItems: 'center', color: '#006a4e', fontWeight: 'bold', fontSize: '12px' }}>
                     পড়ুন <ChevronRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Banner */}
        <div style={{ marginTop: '40px', padding: '25px', backgroundColor: '#e8f5e9', borderRadius: '30px', border: '1px dashed #006a4e', textAlign: 'center' }}>
          <MessageSquare size={30} color="#006a4e" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 5px 0', color: '#006a4e' }}>আপনার কোনো গল্প আছে?</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>আমাদের সাথে শেয়ার করুন, আমরা প্রকাশ করবো।</p>
        </div>

      </div>
    </div>
  );
};

export default BlogList;