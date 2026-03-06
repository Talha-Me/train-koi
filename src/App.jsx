
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

import { HelpCircle, BookOpen, Ticket, MessageSquare, ShieldAlert, Info, Mail, Clock } from 'lucide-react';

function App() {
  return (
    <Router>
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
            // Routes এর ভেতরে এগুলো সেট করুন
            <Route path="/metro/schedule" element={<MetroSchedule />} />
            <Route path="/metro/fare" element={<MetroFare />} />
            <Route path="/metro/map" element={<MetroMap />} />
            <Route path="/metro/rules" element={<MetroRules />} />
          </Routes>
        </div>
        
        <Footer /> 
        <Analytics /> 
      </div>
    </Router>
  );
}

export default App;