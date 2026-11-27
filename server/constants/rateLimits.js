// constants/rateLimits.js
// All rate-limiter windows and max-request values.
// Change numbers here — rateLimiter.js reads from these.

export const RATE_LIMIT_WINDOW_15_MIN = 15 * 60 * 1000; // 15 minutes in ms
export const RATE_LIMIT_WINDOW_1_HOUR = 60 * 60 * 1000; // 1 hour in ms

export const RATE_LIMIT = {
  API: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 100,
  },
  AUTH: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 5,
  },
  BOOKING: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 20,
  },
  PROPERTY_VIEW: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 200,
  },
  PASSWORD_RESET: {
    windowMs: RATE_LIMIT_WINDOW_1_HOUR,
    max: 3,
  },
  VERIFICATION_CODE: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 3,
  },
  CHAT: {
    windowMs: RATE_LIMIT_WINDOW_15_MIN,
    max: 30,
  },
};
