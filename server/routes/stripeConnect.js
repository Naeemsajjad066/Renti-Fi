// routes/stripeConnect.js
import express from 'express';
import {
  createConnectAccount,
  createAccountLink,
  getAccountStatus,
  createDashboardLink
} from '../controllers/stripeConnectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create Stripe Connect account
router.post('/create-account', createConnectAccount);

// Create onboarding link
router.post('/create-link', createAccountLink);

// Get account status
router.get('/status', getAccountStatus);

// Get dashboard link
router.get('/dashboard-link', createDashboardLink);

export default router;
