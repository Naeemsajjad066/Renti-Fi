// routes/reviews.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createReview,
  getPropertyReviews,
  getPropertyStats,
  getUserReviews,
  getReviewsByUser,
  updateReview,
  deleteReview,
  addHostResponse,
  markReviewHelpful,
  canUserReview,
} from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', getPropertyReviews);
router.get('/property/:propertyId/stats', getPropertyStats);
router.get('/user/:userId', getReviewsByUser);

// Protected routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getUserReviews);
router.get('/can-review/:propertyId', protect, canUserReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/response', protect, addHostResponse);
router.post('/:id/helpful', protect, markReviewHelpful);

export default router;
