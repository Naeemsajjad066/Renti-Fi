// routes/properties.js
import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  checkAvailability,
  getUserProperties,
  getFeaturedProperties
} from '../controllers/propertyController.js';
import { protect, hostProtect } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:id', getProperty);
router.get('/:id/availability', checkAvailability);

// Protected routes
router.use(protect);
router.get('/user/:userId?', getUserProperties);

// Host routes
router.use(hostProtect);
router.post('/', uploadMultiple('images', 10), createProperty);
router.put('/:id', uploadMultiple('images', 10), updateProperty);
router.delete('/:id', deleteProperty);

export default router;