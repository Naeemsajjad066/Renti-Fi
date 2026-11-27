// middleware/validation.js
import { validationResult } from 'express-validator';
import { PROPERTY_TYPES, BOOKING_STATUS } from '../constants/index.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

export const validateIdCard = (value) => {
  const idCardRegex = /^[A-Z0-9]{5,20}$/;
  return idCardRegex.test(value);
};

export const validatePhone = (value) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value);
};

export const validatePropertyType = (value) => PROPERTY_TYPES.includes(value);

export const validateBookingStatus = (value) => Object.values(BOOKING_STATUS).includes(value);

export const validatePriceRange = (min, max) => {
  if (min && max && min > max) {
    throw new Error('Minimum price cannot be greater than maximum price');
  }
  return true;
};

export const validateDateRange = (checkIn, checkOut) => {
  if (new Date(checkIn) >= new Date(checkOut)) {
    throw new Error('Check-out date must be after check-in date');
  }
  return true;
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script.*?>.*?<\/script>/gi, '');
  }
  return input;
};

export const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};
