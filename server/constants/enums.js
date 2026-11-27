// constants/enums.js
// All string enums shared across models, controllers, and middleware.
// Single source of truth — models and validation MUST reference these.

// ─── User roles ──────────────────────────────────────────────────────────────

export const USER_ROLES = {
  GUEST: 'user',
  HOST: 'host',
  ADMIN: 'admin',
};

// ─── Booking status ──────────────────────────────────────────────────────────

export const BOOKING_STATUS = {
  RESERVED: 'reserved',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked-in',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
};

// Statuses that block a property's dates (active/occupying bookings)
export const ACTIVE_BOOKING_STATUSES = [
  BOOKING_STATUS.RESERVED,
  BOOKING_STATUS.CONFIRMED,
  BOOKING_STATUS.CHECKED_IN,
];

// Allowed transitions between booking statuses
export const BOOKING_STATUS_TRANSITIONS = {
  [BOOKING_STATUS.RESERVED]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.CHECKED_IN, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CHECKED_IN]: [BOOKING_STATUS.COMPLETED],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.EXPIRED]: [],
};

// ─── Payment status ─────────────────────────────────────────────────────────

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const PAYMENT_METHOD = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  CASH: 'cash',
  PENDING: 'pending',
};

// ─── Payment options (how a guest pays for a booking) ───────────────────────

export const PAYMENT_OPTION = {
  ARRIVAL: 'arrival', // 100% cash on arrival
  EARLY: 'early', // 40% upfront (Stripe) + 60% on arrival
  BOTH: 'both', // property allows either
};

// ─── Property ─────────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  'apartment',
  'house',
  'villa',
  'cabin',
  'cottage',
  'loft',
  'condo',
  'townhouse',
];

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMITTED: 'resubmitted',
};

export const CANCELLATION_POLICY = {
  FLEXIBLE: 'flexible',
  MODERATE: 'moderate',
  STRICT: 'strict',
};

// ─── Stripe Connect account status (on User) ─────────────────────────────────

export const STRIPE_ACCOUNT_STATUS = {
  NONE: '',
  PENDING: 'pending',
  ACTIVE: 'active',
  RESTRICTED: 'restricted',
};
