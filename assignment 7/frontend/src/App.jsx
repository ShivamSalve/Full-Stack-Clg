import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import ReviewEngine from './pages/ReviewEngine';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
      Empower Your <span className="text-blue-600">Academic Journey</span>
    </h1>
    <p className="text-xl text-slate-600 max-w-2xl mb-8 leading-relaxed">
      CampusEcho is a premium next-gen platform for student feedback. Discover top-rated courses or leave your anonymous reviews securely.
    </p>
  </div>
);

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!userInfo ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!userInfo ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={userInfo ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/review/:id" element={userInfo ? <ReviewEngine /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
