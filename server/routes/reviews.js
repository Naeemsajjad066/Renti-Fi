// routes/reviews.js
import express from 'express';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  updateReviewStatus
} from '../controllers/reviewController.js';
import { protect, adminProtect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', getPropertyReviews);
router.get('/user/:userId', getUserReviews);

// Protected routes
router.use(protect);
router.post('/', createReview);

// Admin routes
router.use(adminProtect);
router.put('/:id/status', updateReviewStatus);

export default router;