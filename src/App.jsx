import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'; 
import ReactGA from 'react-ga4';

// Pages Import
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import TravelLaws from './pages/TravelLaws';
import TrainSchedule from './pages/TrainSchedule'; 
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';

import Footer from "./pages/components/Footer";
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import MetroPage from './pages/MetroPage';
import MetroSchedule from './pages/MetroSchedule';
import MetroFare from './pages/MetroFare';
import MetroMap from './pages/MetroMap';
import MetroRules from './pages/MetroRules';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Disclaimer from './pages/Disclaimer';
import NewsList from './pages/NewsList';
import ContentUpload from './pages/ContentUpload';
import LiveTrainsPage from './pages/LiveTrainsPage';

// Capacitor for App (Safe import for Web & Native)
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

// Google Analytics Initialize
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  try {
    ReactGA.initialize(GA_ID);
  } catch (e) {
    console.warn("GA init failed:", e);
  }
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Google Analytics Page Tracking
  useEffect(() => {
    if (GA_ID) {
      try {
        ReactGA.send({ 
          hitType: 'pageview', 
          page: location.pathname + location.search 
        });
      } catch (e) {
        console.error("GA track error:", e);
      }
    }
  }, [location]);

  // Capacitor Back Button Handler (Native App Check)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let backHandler;
    try {
      backHandler = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || !canGoBack) {
          CapacitorApp.exitApp();
        } else {
          navigate(-1);
        }
      });
    } catch (err) {
      console.warn("Capacitor back listener failed:", err);
    }

    return () => {
      if (backHandler && typeof backHandler.then === 'function') {
        backHandler.then(h => h.remove()).catch(() => {});
      }
    };
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Tracking Routes */}
          <Route path="/track/:trainId" element={<TrackingPage />} />
          <Route path="/live-trains" element={<LiveTrainsPage />} />
          
          {/* Schedule Routes */}
          <Route path="/schedule" element={<TrainSchedule />} />
          <Route path="/schedule/:trainSlug" element={<TrainSchedule />} />
          
          <Route path="/travel-laws" element={<TravelLaws />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/rail-news" element={<NewsList />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin-upload" element={<ContentUpload />} />

          {/* পলিসি পেজসমূহ */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* মেট্রো রেল সেকশন */}
          <Route path="/metro-rail" element={<MetroPage />} />  
          <Route path="/metro/schedule" element={<MetroSchedule />} />
          <Route path="/metro/fare" element={<MetroFare />} />
          <Route path="/metro/map" element={<MetroMap />} />
          <Route path="/metro/rules" element={<MetroRules />} />
        </Routes>
      </div>
      
      <Footer /> 
      <Analytics /> 
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;