import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { User, Mail, Lock, CreditCard, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/register', { name, prn, email, password });
      dispatch(setCredentials(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[85vh] px-4 my-8"
    >
      <div className="w-full max-w-md p-8 glass-card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join CampusEcho today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PRN (Permanent Registration Number)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <CreditCard size={18} />
              </div>
              <input
                type="text"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="Ex. 123B1D0002"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="name@student.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all font-medium shadow-md shadow-blue-200/50 mt-4"
          >
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-800 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
