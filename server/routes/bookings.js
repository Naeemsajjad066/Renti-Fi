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

const router = express.Router();

// Public endpoints
router.get('/availability/:propertyId', checkAvailability);
router.get('/property/:propertyId/booked', getBookedRanges);

// Protected endpoints
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/stats', protect, getBookingStats);
router.get('/user/:userId', protect, getUserBookings); // Route for getting bookings by user ID
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/cancel', protect, cancelBooking);

export default router;