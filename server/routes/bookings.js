// routes/bookings.js
import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBooking);
router.put('/:id/status', updateBookingStatus);
router.post('/:id/cancel', cancelBooking);

export default router;