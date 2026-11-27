// constants/payment.js
// All payment-related numbers and strings. One place to change fees.

// ─── Platform economics ───────────────────────────────────────────────────────

/** RentiFi's commission on each Stripe transaction (5%) */
export const PLATFORM_FEE_PERCENT = 0.05;

// ─── Payment split (early payment mode) ──────────────────────────────────────

/** Fraction of total price charged upfront via Stripe (40%) */
export const UPFRONT_PAYMENT_RATIO = 0.4;

/** Fraction of total price due on arrival (60%) */
export const ARRIVAL_PAYMENT_RATIO = 0.6;

/** Human-readable labels used in emails and UI */
export const UPFRONT_LABEL = '40% upfront';
export const ARRIVAL_LABEL = '60% on arrival';

// ─── Refund thresholds (days before check-in) ────────────────────────────────

/** Full refund if cancelled at least this many days before check-in */
export const FLEXIBLE_FULL_REFUND_DAYS = 1;

/** Full refund (moderate policy) if cancelled at least this many days before */
export const MODERATE_FULL_REFUND_DAYS = 7;

/** Partial refund (moderate policy) if cancelled at least this many days before */
export const MODERATE_PARTIAL_REFUND_DAYS = 3;

/** Full refund (strict policy) if cancelled at least this many days before */
export const STRICT_FULL_REFUND_DAYS = 14;

/** Partial refund (strict policy) if cancelled at least this many days before */
export const STRICT_PARTIAL_REFUND_DAYS = 7;

/** Fraction of upfront amount returned on a partial refund (50%) */
export const PARTIAL_REFUND_RATIO = 0.5;

// ─── Cancellation window ─────────────────────────────────────────────────────

/** Minimum days before check-in that a booking can still be cancelled */
export const MIN_DAYS_BEFORE_CHECKIN_TO_CANCEL = 1;

// ─── Currency ─────────────────────────────────────────────────────────────────

/** ISO currency code used throughout the platform */
export const DEFAULT_CURRENCY = 'PKR';

/** Lowercase version required by Stripe API */
export const STRIPE_CURRENCY = 'pkr';

/** Currency prefix used in display strings */
export const CURRENCY_PREFIX = 'Rs ';

// ─── Misc ─────────────────────────────────────────────────────────────────────

/** Multiply amount by this to convert to Stripe's integer format (cents/paisa) */
export const STRIPE_AMOUNT_MULTIPLIER = 100;
