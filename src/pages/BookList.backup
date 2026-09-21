import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, BookOpen, Clock, ChevronRight, 
  Library, Star
} from 'lucide-react';
import { books } from '../data/bookData';

const BookList = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('সব');

  // ইউনিক ক্যাটাগরি লিস্ট (যেমন: গল্প, উপন্যাস, ভ্রমণ কাহিনী)
  const categories = ['সব', ...new Set(books.map(book => book.category || 'গল্প'))];

  // ক্যাটাগরি অনুযায়ী বই ফিল্টার করা
  const filteredBooks = selectedCategory === 'সব' 
    ? books 
    : books.filter(book => (book.category || 'গল্প') === selectedCategory);

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '60px', fontFamily: "'Hind Siliguri', sans-serif" }}>
      
      {/* Header - BlogList এর মতো */}
      <div style={{ background: 'linear-gradient(135deg, #006a4e 0%, #004d39 100%)', padding: '20px', color: 'white', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <ChevronLeft onClick={() => navigate('/')} style={{ cursor: 'pointer', marginRight: '15px' }} />
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>ট্রেন লাইব্রেরি</h3>
      </div>

      {/* Category Filter - ব্লগ লিস্টের মতো স্ক্রলিং */}
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
              চলন্ত ট্রেনে বই পড়ার আনন্দ
            </h1>
            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.8', margin: 0 }}>
              আপনার ট্রেন যাত্রার একঘেয়েমি কাটাতে <strong>Trainkoi Library</strong> নিয়ে এলো চমৎকার সব গল্প ও উপন্যাসের সংগ্রহ।
            </p>
          </div>
        )}

        {/* Featured Book - (সবচেয়ে নতুন বা প্রথম বইটি বড় কার্ডে) */}
        {filteredBooks.length > 0 && (
          <div 
            onClick={() => navigate(`/book/${filteredBooks[0].id}`)} 
            style={{ backgroundColor: 'white', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '25px', cursor: 'pointer', border: '1px solid #eee' }}
          >
            <div style={{ position: 'relative' }}>
              <img src={filteredBooks[0].cover || "/book-bg.jpg"} alt={filteredBooks[0].title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#006a4e', color: 'white', padding: '5px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold' }}>
                {filteredBooks[0].category || 'জনপ্রিয়'}
              </div>
            </div>
            <div style={{ padding: '22px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e293b', lineHeight: '1.4', fontWeight: '800' }}>{filteredBooks[0].title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '18px' }}>{filteredBooks[0].author} এর একটি অসাধারণ সৃষ্টি। আজই পড়া শুরু করুন...</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#006a4e', fontSize: '12px', fontWeight: 'bold' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={14}/> ১০ মিনিট পাঠ</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={14}/> ৪.৮ রেটিং</span>
              </div>
            </div>
          </div>
        )}

        {/* Section Title */}
        <h2 style={{ fontSize: '17px', color: '#333', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '5px', fontWeight: 'bold' }}>
          <Library size={20} color="#006a4e" /> 
          {selectedCategory === 'সব' ? 'লাইব্রেরির বইসমূহ' : `${selectedCategory} সংগ্রহ`}
        </h2>

        {/* Main List - Horizontal Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredBooks.slice(1).map(book => (
            <div 
              key={book.id} 
              onClick={() => navigate(`/book/${book.id}`)} 
              style={{ backgroundColor: 'white', borderRadius: '25px', padding: '15px', display: 'flex', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', cursor: 'pointer', borderLeft: '6px solid #006a4e', border: '1px solid #f0f0f0' }}
            >
              <div style={{ width: '85px', height: '110px', borderRadius: '15px', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {book.cover ? 
                  <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                  <BookOpen size={30} color="#006a4e" opacity={0.5} />
                }
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: '#006a4e', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>{book.category || 'গল্প'}</span>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#1e293b', lineHeight: '1.2', fontWeight: 'bold' }}>{book.title}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>{book.author}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                     <Clock size={12} /> ৮ মিনিট
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', color: '#006a4e', fontWeight: 'bold', fontSize: '12px' }}>
                     বইটি পড়ুন <ChevronRight size={14} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBooks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            এই ক্যাটাগরিতে বর্তমানে কোনো বই নেই।
          </div>
        )}

        {/* Contribution Banner */}
        <div style={{ marginTop: '40px', padding: '25px', backgroundColor: '#e8f5e9', borderRadius: '30px', border: '1px dashed #006a4e', textAlign: 'center' }}>
          <Star size={30} color="#006a4e" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 5px 0', color: '#006a4e' }}>আপনার লেখা প্রকাশ করতে চান?</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#444' }}>আপনার গল্প বা ভ্রমণ কাহিনী আমাদের ইমেইল করুন।</p>
        </div>

      </div>
    </div>
  );
};

export default BookList;