import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../constants/index.js';

export const apiLimiter = rateLimit({
  ...RATE_LIMIT.API,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  ...RATE_LIMIT.AUTH,
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const bookingLimiter = rateLimit({
  ...RATE_LIMIT.BOOKING,
  message: { success: false, message: 'Too many booking requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const propertyViewLimiter = rateLimit({
  ...RATE_LIMIT.PROPERTY_VIEW,
  message: { success: false, message: 'Too many requests, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetLimiter = rateLimit({
  ...RATE_LIMIT.PASSWORD_RESET,
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const verificationCodeLimiter = rateLimit({
  ...RATE_LIMIT.VERIFICATION_CODE,
  message: {
    success: false,
    message: 'Too many verification code requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Free OpenRouter tier is rate-limited upstream; this keeps costs predictable
// and prevents prompt-injection flooding.
export const chatLimiter = rateLimit({
  ...RATE_LIMIT.CHAT,
  message: {
    success: false,
    message: 'Too many chat messages. Please wait a moment before sending more.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
