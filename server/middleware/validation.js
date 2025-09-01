// middleware/validation.js
import { validationResult } from 'express-validator';

// Custom validation middleware
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

// Validate ID card number
export const validateIdCard = (value) => {
  const idCardRegex = /^[A-Z0-9]{5,20}$/;
  return idCardRegex.test(value);
};

// Validate phone number
export const validatePhone = (value) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value);
};

// Validate property type
export const validatePropertyType = (value) => {
  const validTypes = [
    'apartment', 'house', 'villa', 'cabin', 'cottage', 
    'loft', 'condo', 'townhouse'
  ];
  return validTypes.includes(value);
};

// Validate booking status
export const validateBookingStatus = (value) => {
  const validStatuses = [
    'pending', 'confirmed', 'cancelled', 'completed', 'expired'
  ];
  return validStatuses.includes(value);
};

// Validate price range
export const validatePriceRange = (min, max) => {
  if (min && max && min > max) {
    throw new Error('Minimum price cannot be greater than maximum price');
  }
  return true;
};

// Validate date range
export const validateDateRange = (checkIn, checkOut) => {
  if (new Date(checkIn) >= new Date(checkOut)) {
    throw new Error('Check-out date must be after check-in date');
  }
  return true;
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script.*?>.*?<\/script>/gi, '');
  }
  return input;
};

// Middleware to sanitize all request body fields
export const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};