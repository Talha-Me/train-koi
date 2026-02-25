import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import TravelLaws from './pages/TravelLaws';
import TrainSchedule from './pages/TrainSchedule'; 
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import BookList from './pages/BookList'; 
import BookReader from './pages/BookReader'; 
import Footer from "./pages/components/Footer";// ফুটার ইমপোর্ট
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import { HelpCircle, BookOpen, Ticket, MessageSquare, ShieldAlert, Info, Mail, Clock } from 'lucide-react';


function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/track/:trainId" element={<TrackingPage />} />
            <Route path="/travel-laws" element={<TravelLaws />} />
            <Route path="/schedule" element={<TrainSchedule />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/book/:id" element={<BookReader />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        
        {/* ফুটারটি এখানে যোগ করা হয়েছে যাতে সব পেজের নিচে এটি থাকে */}
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;