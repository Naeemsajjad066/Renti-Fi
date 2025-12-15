// routes/bookings.js
import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
  checkAvailability,
  getBookedRanges
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { bookingLimiter, propertyViewLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public endpoints (with lenient rate limiting)
router.get('/availability/:propertyId', propertyViewLimiter, checkAvailability);
router.get('/property/:propertyId/booked', propertyViewLimiter, getBookedRanges);

// Protected endpoints (with booking rate limiting)
router.post('/', protect, bookingLimiter, createBooking);
router.get('/', protect, getUserBookings);
router.get('/stats', protect, getBookingStats);
router.get('/user/:userId', protect, getUserBookings); // Route for getting bookings by user ID
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, bookingLimiter, updateBookingStatus);
router.post('/:id/cancel', protect, bookingLimiter, cancelBooking);

export default router;