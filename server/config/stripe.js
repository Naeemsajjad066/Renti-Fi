// config/stripe.js
import Stripe from 'stripe';
import {
  UPFRONT_PAYMENT_RATIO,
  PARTIAL_REFUND_RATIO,
  FLEXIBLE_FULL_REFUND_DAYS,
  MODERATE_FULL_REFUND_DAYS,
  MODERATE_PARTIAL_REFUND_DAYS,
  STRICT_FULL_REFUND_DAYS,
  STRICT_PARTIAL_REFUND_DAYS,
  MS_PER_DAY,
  CANCELLATION_POLICY,
  PAYMENT_OPTION,
} from '../constants/index.js';

// Lazy initialization to ensure env vars are loaded
let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: false,
    });
  }
  return stripeInstance;
};

export const stripe = new Proxy(
  {},
  {
    get: (target, prop) => {
      return getStripe()[prop];
    },
  }
);

// ─── Payment calculation helpers ──────────────────────────────────────────────

export const calculatePaymentBreakdown = (totalPrice, paymentOption) => {
  if (paymentOption === PAYMENT_OPTION.EARLY) {
    const upfrontAmount = Math.round(totalPrice * UPFRONT_PAYMENT_RATIO);
    const arrivalAmount = totalPrice - upfrontAmount;
    return { upfrontAmount, arrivalAmount, totalAmount: totalPrice };
  }

  // PAYMENT_OPTION.ARRIVAL — 100% due on arrival
  return { upfrontAmount: 0, arrivalAmount: totalPrice, totalAmount: totalPrice };
};

// ─── Cancellation refund calculator ──────────────────────────────────────────

export const calculateRefundAmount = (booking, cancellationPolicy) => {
  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / MS_PER_DAY);

  // Only refund if the upfront Stripe payment was made
  if (!booking.paymentBreakdown?.upfrontPaid) return 0;

  const upfrontAmount = booking.paymentBreakdown.upfrontAmount;

  switch (cancellationPolicy) {
    case CANCELLATION_POLICY.FLEXIBLE:
      return daysUntilCheckIn >= FLEXIBLE_FULL_REFUND_DAYS
        ? upfrontAmount
        : Math.round(upfrontAmount * PARTIAL_REFUND_RATIO);

    case CANCELLATION_POLICY.MODERATE:
      if (daysUntilCheckIn >= MODERATE_FULL_REFUND_DAYS) return upfrontAmount;
      if (daysUntilCheckIn >= MODERATE_PARTIAL_REFUND_DAYS)
        return Math.round(upfrontAmount * PARTIAL_REFUND_RATIO);
      return 0;

    case CANCELLATION_POLICY.STRICT:
      if (daysUntilCheckIn >= STRICT_FULL_REFUND_DAYS) return upfrontAmount;
      if (daysUntilCheckIn >= STRICT_PARTIAL_REFUND_DAYS)
        return Math.round(upfrontAmount * PARTIAL_REFUND_RATIO);
      return 0;

    default:
      return 0;
  }
};

export default stripe;
