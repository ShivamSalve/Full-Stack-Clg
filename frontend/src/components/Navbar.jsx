import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, LogIn, UserPlus, Library } from 'lucide-react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-slate-800 tracking-tighter flex items-center gap-2">
              <span className="text-blue-600">Campus</span>Echo
            </Link>
          </div>
          
          <nav className="flex space-x-4 items-center">
            <Link to="/directory" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Library size={18} />
              Directory
            </Link>
            
            {userInfo ? (
               <>
                <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md flex items-center gap-2 glow-btn"
                >
                  <LogOut size={16} />
                  Logout
                </button>
               </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                  <LogIn size={18} />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="ml-4 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-blue-200/50 flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
