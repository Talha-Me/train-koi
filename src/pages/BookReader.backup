import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Type, Moon, Sun } from 'lucide-react';
import { books } from '../data/bookData';

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const book = books.find((b) => b.id === parseInt(id));

  if (!book) return <div style={{ padding: '50px', textAlign: 'center' }}>বইটি পাওয়া যায়নি!</div>;

  const theme = {
    bg: darkMode ? '#1a1a1a' : '#fff',
    text: darkMode ? '#e0e0e0' : '#2c3e50',
    // হেডার এখন সব সময় সবুজ থাকবে (বুকলিস্টের মতো)
    header: '#006a4e', 
    headerText: '#ffffff',
    headerSubText: '#e0e0e0'
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', transition: '0.3s' }}>
      {/* Reader Header - Green Theme Applied */}
      <div style={{ 
        padding: '15px 20px', 
        backgroundColor: theme.header, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <ChevronLeft 
            onClick={() => navigate(-1)} 
            style={{ cursor: 'pointer', color: theme.headerText }} 
            size={28} 
          />
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: theme.headerText, fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {book.title}
            </h4>
            <span style={{ fontSize: '11px', color: theme.headerSubText }}>{book.author}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', color: theme.headerText }}>
          <Type 
            onClick={() => setFontSize(f => f >= 30 ? 16 : f + 2)} 
            style={{ cursor: 'pointer' }} 
            size={22} 
          />
          {darkMode ? 
            <Sun onClick={() => setDarkMode(false)} style={{ cursor: 'pointer' }} size={22} /> : 
            <Moon onClick={() => setDarkMode(true)} style={{ cursor: 'pointer' }} size={22} />
          }
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '30px 25px', 
        lineHeight: '1.8', 
        fontSize: `${fontSize}px`, 
        color: theme.text, 
        textAlign: 'justify', 
        whiteSpace: 'pre-line',
        animation: 'fadeIn 0.8s ease-in',
        fontFamily: "'Hind Siliguri', sans-serif"
      }}>
        {book.content}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BookReader;