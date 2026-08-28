// routes/payments.js
import express from 'express';
import {
  createCheckoutSession,
  confirmPayment,
  createReservation,
  processRefund,
  recordArrivalPayment,
  handleStripeWebhook,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Stripe webhook endpoint (must be before body parser middleware)
// Note: This needs raw body, configure in server.js
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.use(protect);

// Create checkout session for upfront payment
router.post('/create-checkout', createCheckoutSession);

// Confirm payment and create booking
router.post('/confirm', confirmPayment);

// Create reservation (no upfront payment)
router.post('/reserve', createReservation);

// Process refund on cancellation
router.post('/refund/:bookingId', processRefund);

// Record arrival payment (host only)
router.post('/arrival/:bookingId', recordArrivalPayment);

export default router;
