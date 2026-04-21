import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 50); // Speed of typewriter
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span className="inline-block">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-1 h-4 ml-1 bg-slate-400 translate-y-1"
      />
    </span>
  );
};

const Footer = () => {
  return (
    <footer className="relative bg-white/70 backdrop-blur-xl border-t border-white shadow-[0_-5px_25px_-10px_rgba(0,0,0,0.05)] mt-auto overflow-hidden">
      {/* Decorative gradient glowing orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-6 py-2 rounded-full bg-slate-50 border border-slate-200/60 shadow-sm"
          >
            <Sparkles size={16} className="text-yellow-500" />
            <p className="text-slate-700 font-medium tracking-tight">
              Designed & Developed by <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Adwait Kamble</span>
              <span className="text-slate-400 ml-1 text-sm bg-slate-200/50 px-2 py-0.5 rounded-full font-mono">(PRN: 123B1D0002)</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center max-w-2xl text-center space-y-2"
          >
             <div className="flex items-center justify-center text-slate-500 text-sm gap-2">
               <GraduationCap size={16} className="text-slate-400" />
               <span className="font-semibold text-slate-600">Pimpri Chinchwad College of Engineering (PCCOE)</span>
             </div>
             <p className="text-xs text-slate-400 flex items-center gap-1">
               <MapPin size={12} />
               Sector 26, Pradhikaran, Nigdi, Pune, Maharashtra.
             </p>
          </motion.div>

          <div className="w-24 h-px bg-slate-200 my-2"></div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center text-sm font-medium text-slate-500"
          >
             <span className="mr-1">Built with</span>
             <motion.div 
               animate={{ scale: [1, 1.2, 1] }} 
               transition={{ repeat: Infinity, duration: 1.5 }}
             >
               <Heart size={14} className="mx-1.5 text-rose-500 fill-rose-500" />
             </motion.div>
             <span className="ml-1 text-slate-600">
                <TypewriterText text="for academic excellence" />
             </span>
          </motion.div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
