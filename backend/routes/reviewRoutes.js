const express = require('express');
const router = express.Router();
const { submitReview, getReviewsForCourse } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to allow anonymous, but still parse user if token exists
const allowAnonymous = (req, res, next) => {
  req.allowAnonymous = true;
  next();
};

router.post('/', allowAnonymous, protect, submitReview);
router.get('/:courseId', getReviewsForCourse);

module.exports = router;
