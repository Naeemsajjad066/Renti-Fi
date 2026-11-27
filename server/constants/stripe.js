// constants/stripe.js
// Stripe-specific configuration values.

/** Maximum payload size accepted by the Stripe webhook endpoint */
export const STRIPE_WEBHOOK_PAYLOAD_LIMIT = '10mb';

/** Stripe payment method types accepted at checkout */
export const STRIPE_PAYMENT_METHOD_TYPES = ['card'];

/** Locale passed to Stripe Checkout sessions */
export const STRIPE_CHECKOUT_LOCALE = 'en';

// ─── Stripe Connect ───────────────────────────────────────────────────────────

/** Country code used when creating Stripe Express accounts */
export const STRIPE_CONNECT_COUNTRY = 'US';

/** Stripe Connect account type */
export const STRIPE_ACCOUNT_TYPE = 'express';

/** Business type set on new Stripe Connect accounts */
export const STRIPE_BUSINESS_TYPE = 'individual';

/** Account link type used for onboarding */
export const STRIPE_ONBOARDING_TYPE = 'account_onboarding';
