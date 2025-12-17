import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintStats,
  getUserComplaints,
  uploadComplaintFile
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// User routes
router.post('/upload', protect, uploadSingle('file'), uploadComplaintFile);
router.post('/', protect, submitComplaint);
router.get('/my-complaints', protect, getUserComplaints);

// Admin routes
router.get('/stats', protect, requireAdmin, getComplaintStats);
router.get('/', protect, requireAdmin, getAllComplaints);
router.get('/:id', protect, requireAdmin, getComplaintById);
router.put('/:id', protect, requireAdmin, updateComplaintStatus);

export default router;
