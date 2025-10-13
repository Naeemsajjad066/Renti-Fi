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

const propertyRouter = express.Router();

// Public routes
propertyRouter.get('/', getProperties);
propertyRouter.get('/featured', getFeaturedProperties);
propertyRouter.get('/:id', getProperty);
// propertyRouter.get('/:id/availability', checkAvailability);

// Protected routes
propertyRouter.use(protect);
propertyRouter.get('/user/:userId?', getUserProperties);

// Host routes - Accept images, ID card, and property documents
// propertyRouter.use(hostProtect);
propertyRouter.post('/', uploadFields([
  { name: 'images', maxCount: 10 },
  { name: 'idCard', maxCount: 1 },
  { name: 'propertyDocuments', maxCount: 5 }
]), createProperty);
propertyRouter.put('/:id', uploadFields([
  { name: 'images', maxCount: 10 }
]), updateProperty);
propertyRouter.delete('/:id', deleteProperty);

export default propertyRouter;