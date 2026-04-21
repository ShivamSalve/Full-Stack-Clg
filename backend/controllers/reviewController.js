const Review = require('../models/Review');
const Course = require('../models/Course');
const { logReview } = require('../utils/excelSync');

const submitReview = async (req, res) => {
  const { courseId, rating, comment, isAnonymous } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const review = new Review({
      course: courseId,
      user: isAnonymous ? undefined : req.user?._id,
      rating,
      comment,
      isAnonymous: isAnonymous || false
    });

    const savedReview = await review.save();

    // Dual-Sync: Save to MS Excel Log
    await logReview(course.courseCode, rating, comment);

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsForCourse = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
                                .populate('user', 'name prn')
                                .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitReview, getReviewsForCourse };
