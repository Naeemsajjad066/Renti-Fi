// routes/users.js
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  becomeHost,
  getHostStats,
  searchUsers,
  updateUserStatus
} from '../controllers/userController.js';
import { protect, adminProtect } from '../middleware/auth.js';
import { uploadSingle,uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/:userId', getUserProfile);

// Protected routes
router.use(protect);
router.put('/profile', uploadSingle('profileImage'), updateUserProfile);
router.post('/become-host', uploadMultiple('documents', 5), becomeHost);
router.get('/host/stats', getHostStats);

// Admin routes
router.use(adminProtect);
router.get('/', searchUsers);
router.put('/:userId/status', updateUserStatus);

export default router;