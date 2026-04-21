import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { motion } from 'framer-motion';
import { Star, ShieldAlert, CheckCircle, Send, ArrowLeft } from 'lucide-react';

const ReviewEngine = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setStatus({ type: 'error', message: 'Could not load course data.' });
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setStatus({ type: 'error', message: 'Please select a star rating.' });
      return;
    }
    
    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await axiosInstance.post('/reviews', {
        courseId: id,
        rating,
        comment,
        isAnonymous
      });
      
      setStatus({ type: 'success', message: 'Review successfully submitted!' });
      setTimeout(() => navigate('/directory'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to submit review' });
      setSubmitting(false);
    }
  };

  if (!course) return <div className="p-8 text-center">Loading Engine...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="h-48 relative overflow-hidden">
           <img 
              src={course.imageUrl} 
              alt={course.courseName} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 flex flex-col justify-end p-8">
               <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{course.courseName}</h1>
               <p className="text-slate-200 drop-shadow-sm">{course.professorName} • {course.courseCode}</p>
            </div>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            Leave Feedback
          </h2>

          {status.message && (
            <div className={`p-4 rounded-xl mb-6 flex items-center ${status.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {status.type === 'error' ? <ShieldAlert size={20} className="mr-3" /> : <CheckCircle size={20} className="mr-3" />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Star Rating Engine */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Overall Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    type="button"
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-colors"
                  >
                    <Star 
                      size={36} 
                      className={`${(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                    />
                  </motion.button>
                ))}
                <span className="ml-4 text-slate-500 font-medium text-lg">
                  {rating === 0 ? 'Select a rating' : `${rating} out of 5`}
                </span>
              </div>
            </div>

            {/* Premium Text Area */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Feedback</label>
              <textarea
                required
                rows="5"
                placeholder="Share your detailed experience with this course and professor..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50/50 resize-none font-medium text-slate-800 placeholder-slate-400"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div>
                 <h4 className="font-semibold text-slate-900">Post Anonymously</h4>
                 <p className="text-sm text-slate-500">Hide your PRN and Name from the public directory.</p>
               </div>
               
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                  />
                  <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-slate-900 shadow-inner"></div>
               </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200/50 hover:shadow-blue-300/50 hover:-translate-y-0.5'}`}
            >
              <Send size={20} />
              {submitting ? 'Submitting & Indexing...' : 'Publish Feedback'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewEngine;
