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
import { protect, adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminProtect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/bookings', getAllBookings);
router.get('/logs', getAdminLogs);
router.put('/users/:userId', adminUpdateUser);
router.put('/properties/:propertyId', adminUpdateProperty);
router.put('/documents/:documentId/verify', verifyHostDocuments);

export default router;