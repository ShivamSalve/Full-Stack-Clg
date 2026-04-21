import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';


const CourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/reviews/${course._id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setExpanded(true);
    }
  };

  // Calculate generic average for UI demonstration based on fetched reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="glass-card overflow-hidden mb-6">
      <div 
        onClick={fetchReviews}
        className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-center justify-between"
      >
        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
          <img 
            src={course.imageUrl} 
            alt={course.courseName} 
            className="w-20 h-20 rounded-xl object-cover shadow-sm"
          />
          <div>
             <h3 className="text-xl font-bold text-slate-900">{course.courseName}</h3>
             <p className="text-slate-500 font-medium">{course.professorName} • {course.courseCode}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-center md:items-end">
             {expanded && reviews.length > 0 && (
               <div className="flex items-center text-yellow-500 font-bold mb-1">
                 {averageRating} <Star size={16} className="ml-1 fill-yellow-500" />
               </div>
             )}
             <div className="text-sm font-medium text-slate-400 flex items-center">
               {expanded ? `${reviews.length} Reviews` : 'Click to view reviews'}
             </div>
          </div>
          
          <button className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-6">
              {loading ? (
                 <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>
              ) : reviews.length === 0 ? (
                 <div className="text-center py-8 text-slate-500">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                    No reviews yet. Be the first to review!
                 </div>
              ) : (
                 <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                               <UserCircle size={24} />
                             </div>
                             <div>
                               <p className="font-bold text-slate-900">
                                 {review.isAnonymous || !review.user ? 'Anonymous Student' : review.user.name}
                               </p>
                               <p className="text-xs text-slate-400 font-medium">
                                 {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                               </p>
                             </div>
                          </div>
                          <div className="flex gap-1 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                               <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-sm">"{review.comment}"</p>
                      </div>
                    ))}
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Directory = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Public <span className="text-blue-600">Directory</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Read genuine, unfiltered feedback from students. Select a course below to view its ratings.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {courses.map(course => <CourseCard key={course._id} course={course} />)}
        </div>
      )}
    </div>
  );
};

export default Directory;
