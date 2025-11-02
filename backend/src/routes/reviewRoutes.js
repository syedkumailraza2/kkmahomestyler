const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviews,
  getReviewById,
  getStatistics,
  deleteReview
} = require('../controllers/reviewController');

const {
  validateCreateReview,
  validateGetReviews,
  validateReviewId
} = require('../validations/reviewValidation');

// Public routes
router.get('/statistics', getStatistics);
router.get('/', validateGetReviews, getReviews);
router.get('/:id', validateReviewId, getReviewById);

// Protected routes (would add authentication middleware here)
router.post('/', validateCreateReview, createReview);
router.delete('/:id', validateReviewId, deleteReview);

module.exports = router;