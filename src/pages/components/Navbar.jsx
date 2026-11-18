import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Train, Radio, Phone, Sparkles, Search, Compass, Calendar, Newspaper, Map, Shield } from 'lucide-react';

const Navbar = ({ activePage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = activePage || location.pathname;

  const navItems = [
    { label: 'হোম', path: '/' },
    { label: 'লাইভ ট্রেন', path: '/live-trains', badge: 'LIVE' },
    { label: 'সময়সূচী', path: '/schedule' },
    { label: 'ভ্রমণ গাইড', path: '/blogs' },
    { label: 'রেল সংবাদ', path: '/rail-news' },
    { label: 'মেট্রোরেল', path: '/metro-rail' },
    { label: 'ভ্রমণ নির্দেশিকা', path: '/travel-laws' },
    { label: 'আমাদের সম্পর্কে', path: '/about' },
  ];

  return (
    <>
      <style>{`
        .tk-navbar-desktop {
          display: none;
          background: linear-gradient(135deg, #004d39 0%, #003728 50%, #00261c 100%);
          border-bottom: 1px solid rgba(16, 185, 129, 0.25);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        @media (min-width: 769px) {
          .tk-navbar-desktop {
            display: block;
          }
        }
        .tk-nav-container {
          max-width: 1520px;
          width: 95%;
          margin: 0 auto;
          padding: 0 16px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .tk-nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          cursor: pointer;
        }
        .tk-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.4);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tk-nav-brand:hover .tk-brand-icon {
          transform: scale(1.08) rotate(-4deg);
        }
        .tk-brand-text {
          display: flex;
          flex-direction: column;
        }
        .tk-brand-title {
          font-size: 21px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: -0.4px;
          line-height: 1.1;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tk-brand-sub {
          font-size: 10.5px;
          color: #a7f3d0;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .tk-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tk-nav-link {
          position: relative;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 10px;
          transition: all 0.22s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tk-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }
        .tk-nav-link.is-active {
          color: #ffffff;
          background: rgba(16, 185, 129, 0.22);
          border: 1px solid rgba(52, 211, 153, 0.35);
        }
        .tk-nav-link.is-active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: #34d399;
          border-radius: 2px;
          box-shadow: 0 0 8px #34d399;
        }
        .tk-nav-badge {
          font-size: 9px;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 999px;
          background: #ef4444;
          color: white;
          animation: tk-badge-pulse 1.8s infinite;
        }
        @keyframes tk-badge-pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .tk-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .tk-helpline-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 7px 14px;
          border-radius: 999px;
          color: #fef08a;
          font-size: 12px;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .tk-helpline-pill:hover {
          background: rgba(254, 240, 138, 0.18);
          border-color: #fef08a;
          transform: translateY(-1px);
        }
        .tk-support-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
        }
        .tk-support-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
        }
      `}</style>

      <header className="tk-navbar-desktop">
        <div className="tk-nav-container">
          {/* Logo */}
          <Link to="/" className="tk-nav-brand">
            <div className="tk-brand-icon">
              <Train size={22} />
            </div>
            <div className="tk-brand-text">
              <span className="tk-brand-title">
                TrainKoi
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              </span>
              <span className="tk-brand-sub">ফ্রি লাইভ ট্রেন ট্র্যাকিং</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="tk-nav-links">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`tk-nav-link ${isActive ? 'is-active' : ''}`}
                >
                  {item.label}
                  {item.badge && <span className="tk-nav-badge">{item.badge}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Right Action */}
          <div className="tk-nav-right">
            <a href="tel:16459" className="tk-helpline-pill" title="বাংলাদেশ রেলওয়ে হটলাইন">
              <Phone size={13} />
              <span>হেল্পলাইন: ১৬৪৫৯</span>
            </a>
            <button className="tk-support-btn" onClick={() => navigate('/faq')}>
              <Sparkles size={14} />
              <span>প্রশ্নোত্তর</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
