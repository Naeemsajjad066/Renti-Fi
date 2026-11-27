/**
 * Chat routes — /api/chat
 *
 * Authentication is OPTIONAL on purpose: guests who are not logged in should
 * still be able to ask general platform questions.
 * The controller never returns or accepts personal user data, so there is
 * nothing sensitive to protect at the route level.
 *
 * Rate limiting is applied via chatLimiter (30 req / 15 min per IP).
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendChatMessage } from '../controllers/chatController.js';
import { chatLimiter } from '../middleware/rateLimiter.js';

const chatRouter = express.Router();

// Input validation rules
const chatValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message cannot be empty.')
    .isLength({ max: 500 })
    .withMessage('Message must be 500 characters or fewer.')
    .escape(), // HTML-encode special characters

  body('history')
    .optional()
    .isArray({ max: 12 }) // at most 6 turns × 2 messages
    .withMessage('History must be an array of at most 12 messages.'),

  body('history.*.role')
    .optional()
    .isIn(['user', 'assistant'])
    .withMessage('Each history entry must have role "user" or "assistant".'),

  body('history.*.content')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Each history message must be 500 characters or fewer.')
    .escape(),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

/**
 * POST /api/chat
 *
 * Body:
 *   { message: string, history?: Array<{ role: 'user'|'assistant', content: string }> }
 *
 * Response:
 *   { success: true, reply: string }
 */
chatRouter.post('/', chatLimiter, chatValidation, handleValidationErrors, sendChatMessage);

export default chatRouter;
