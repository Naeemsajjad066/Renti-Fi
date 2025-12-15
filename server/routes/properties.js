// routes/properties.js
import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  // checkAvailability,
  getUserProperties,
  getFeaturedProperties
} from '../controllers/propertyController.js';
import { protect } from '../middleware/auth.js';
import { uploadFields } from '../middleware/upload.js';
import { propertyViewLimiter, apiLimiter } from '../middleware/rateLimiter.js';

const propertyRouter = express.Router();

// Public routes (with lenient rate limiting for browsing)
propertyRouter.get('/', propertyViewLimiter, getProperties);
propertyRouter.get('/featured', propertyViewLimiter, getFeaturedProperties);
propertyRouter.get('/:id', propertyViewLimiter, getProperty);
// propertyRouter.get('/:id/availability', checkAvailability);

// Protected routes
propertyRouter.use(protect);
propertyRouter.get('/user/:userId?', getUserProperties);

// Host routes - Accept images, ID card, and property documents (with API rate limiting)
// propertyRouter.use(hostProtect);
propertyRouter.post('/', apiLimiter, uploadFields([
  { name: 'images', maxCount: 10 },
  { name: 'idCard', maxCount: 1 },
  { name: 'propertyDocuments', maxCount: 5 }
]), createProperty);
propertyRouter.put('/:id', apiLimiter, uploadFields([
  { name: 'images', maxCount: 10 }
]), updateProperty);
propertyRouter.delete('/:id', apiLimiter, deleteProperty);

export default propertyRouter;