// constants/booking.js
// Numbers and config specific to booking creation and management.

/** Milliseconds in one day — used in date diff calculations */
export const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Generates a random 6-digit verification code (string).
 * Centralised here so the formula is changed in one place only.
 */
export const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/** Fields to populate when returning a booking to the client */
export const BOOKING_POPULATE_FIELDS = {
  property: 'title images city address',
  guest: 'fullName email phoneNumber',
  host: 'fullName email phoneNumber',
};
