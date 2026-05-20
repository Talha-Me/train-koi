// app ar jonno change

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react'; 
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import TravelLaws from './pages/TravelLaws';
import TrainSchedule from './pages/TrainSchedule'; 
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import BookList from './pages/BookList'; 
import BookReader from './pages/BookReader'; 
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

// নিচের ৩টি লাইন আমি নতুন যোগ করেছি। নিশ্চিত করুন আপনার ফাইলগুলো pages ফোল্ডারে আছে।
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Disclaimer from './pages/Disclaimer';
// app ar jonno change
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // যদি react-router-dom ব্যবহার করেন


import { HelpCircle, BookOpen, Ticket, MessageSquare, ShieldAlert, Info, Mail, Clock } from 'lucide-react';

// রাউটার এবং ব্যাক বাটন লজিক হ্যান্ডেল করার জন্য এই সাব-কম্পোনেন্টটি তৈরি করা হলো
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = async (data) => {
      // যদি ইউজার হোম পেজে থাকে অথবা আর পেছনে যাওয়ার ইতিহাস না থাকে তবে অ্যাপ বন্ধ হবে
      if (location.pathname === '/' || !data.canGoBack) {
        CapacitorApp.exitApp();
      } else {
        navigate(-1); // এক ধাপ ব্যাক
      }
    };

    const listener = CapacitorApp.addListener('backButton', handleBackButton);

    return () => {
      listener.then(l => l.remove());
    };
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Tracking Routes */}
          <Route path="/track/:trainId" element={<TrackingPage />} />
          
          {/* Schedule Routes */}
          <Route path="/schedule" element={<TrainSchedule />} />
          <Route path="/schedule/:trainSlug" element={<TrainSchedule />} />
          
          <Route path="/travel-laws" element={<TravelLaws />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/book/:id" element={<BookReader />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/settings" element={<Settings />} />

          {/* আইনি পেজগুলোর রাউট */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/" element={<HomePage />} />

          {/* মেট্রো রেল মেইন সেকশন */}
          <Route path="/metro-rail" element={<MetroPage />} />  
          {/* মেট্রো রেল সাব-সেকশনস (SEO এর জন্য আলাদা URL) */}
          {/* Routes এর ভেতরে এগুলো সেট করুন */}
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