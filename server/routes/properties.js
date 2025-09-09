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
import { uploadMultiple } from '../middleware/upload.js';

const propertyRouter = express.Router();

// Public routes
propertyRouter.get('/', getProperties);
propertyRouter.get('/featured', getFeaturedProperties);
propertyRouter.get('/:id', getProperty);
// propertyRouter.get('/:id/availability', checkAvailability);

// Protected routes
propertyRouter.use(protect);
propertyRouter.get('/user/:userId?', getUserProperties);

// Host routes
// propertyRouter.use(hostProtect);
propertyRouter.post('/', uploadMultiple('images', 10), createProperty);
propertyRouter.put('/:id', uploadMultiple('images', 10), updateProperty);
propertyRouter.delete('/:id', deleteProperty);

export default propertyRouter;