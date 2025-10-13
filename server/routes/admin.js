// routes/admin.js
import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllProperties,
  getAllBookings,
  adminUpdateUser,
  adminUpdateProperty,
  getAdminLogs,
  verifyHostDocuments
} from '../controllers/adminController.js';
import { 
  getPendingProperties,
  approveProperty,
  rejectProperty
} from '../controllers/propertyController.js';
import { protect, adminProtect } from '../middleware/auth.js';

const router = express.Router();

// TEMPORARY: Only require authentication, not admin role
// TODO: Re-enable adminProtect after setting up admin users
router.use(protect);
// router.use(adminProtect); // Temporarily disabled for testing

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/bookings', getAllBookings);
router.get('/logs', getAdminLogs);
router.put('/users/:userId', adminUpdateUser);
router.put('/properties/:propertyId', adminUpdateProperty);
router.put('/documents/:documentId/verify', verifyHostDocuments);

// Property verification routes
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:propertyId/approve', approveProperty);
router.put('/properties/:propertyId/reject', rejectProperty);

export default router;