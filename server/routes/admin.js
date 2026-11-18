// routes/admin.js
import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllProperties,
  getAllBookings,
  adminUpdateUser,
  adminDeleteUser,
  adminUpdateProperty,
  adminDeleteProperty,
  getAdminLogs,
  verifyHostDocuments,
} from '../controllers/adminController.js';
import {
  getPendingProperties,
  approveProperty,
  rejectProperty,
} from '../controllers/propertyController.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(adminProtect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/bookings', getAllBookings);
router.get('/logs', getAdminLogs);

// Property verification routes — must be registered before :propertyId to avoid shadowing
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:propertyId/approve', approveProperty);
router.put('/properties/:propertyId/reject', rejectProperty);

router.put('/users/:userId', adminUpdateUser);
router.delete('/users/:userId', adminDeleteUser);
router.put('/properties/:propertyId', adminUpdateProperty);
router.delete('/properties/:propertyId', adminDeleteProperty);
router.put('/documents/:documentId/verify', verifyHostDocuments);

export default router;
