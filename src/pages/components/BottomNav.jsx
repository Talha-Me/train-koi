import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Radio, Clock, BookOpen, Newspaper } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'হোম', path: '/', icon: <Home size={20} /> },
    { label: 'লাইভ ট্রেন', path: '/live-trains', icon: <Radio size={20} />, isLive: true },
    { label: 'সময়সূচী', path: '/schedule', icon: <Clock size={20} /> },
    { label: 'ভ্রমণ গাইড', path: '/blogs', icon: <BookOpen size={20} /> },
    { label: 'রেল সংবাদ', path: '/rail-news', icon: <Newspaper size={20} /> },
  ];

  return (
    <>
      <style>{`
        .trainkoi-bottom-nav {
          display: none;
        }
        @media (max-width: 768px) {
          .trainkoi-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 62px;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid #e2e8f0;
            box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.05);
            z-index: 999;
            align-items: center;
            justify-content: space-around;
            padding: 0 6px;
            box-sizing: border-box;
          }
        }
        @keyframes nav-pulse-dot {
          0% { transform: scale(0.9); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
          100% { transform: scale(0.9); opacity: 1; }
        }
        .nav-live-dot {
          position: absolute;
          top: 8px;
          right: 18px;
          width: 7px;
          height: 7px;
          background-color: #ef4444;
          border-radius: 50%;
          animation: nav-pulse-dot 1.5s infinite;
        }
      `}</style>

      <div className="trainkoi-bottom-nav">
        {navItems.map((item, idx) => {
          const isActive = 
            item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(item.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
                color: isActive ? '#006a4e' : '#64748b',
                transition: 'color 0.15s ease',
                position: 'relative'
              }}
            >
              {item.isLive && (
                <span className="nav-live-dot" />
              )}
              <div style={{
                color: isActive ? '#006a4e' : '#64748b',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.15s ease'
              }}>
                {item.icon}
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? '800' : '600',
                letterSpacing: '-0.2px'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
