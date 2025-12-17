// config/stripe.js
import Stripe from 'stripe';

// Lazy initialization to ensure env vars are loaded
let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: false
    });
  }
  return stripeInstance;
};

export const stripe = new Proxy({}, {
  get: (target, prop) => {
    return getStripe()[prop];
  }
});

// Payment calculation helpers
export const calculatePaymentBreakdown = (totalPrice, paymentOption) => {
  if (paymentOption === 'early') {
    const upfrontAmount = Math.round(totalPrice * 0.4); // 40%
    const arrivalAmount = totalPrice - upfrontAmount;   // 60%
    
    return {
      upfrontAmount,
      arrivalAmount,
      totalAmount: totalPrice
    };
  } else {
    // Payment on arrival - 100% due on arrival
    return {
      upfrontAmount: 0,
      arrivalAmount: totalPrice,
      totalAmount: totalPrice
    };
  }
};

// Cancellation refund calculator
export const calculateRefundAmount = (booking, cancellationPolicy) => {
  const now = new Date();
  const checkIn = new Date(booking.checkIn);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));
  
  // Only refund if upfront payment was made
  if (!booking.paymentBreakdown?.upfrontPaid) {
    return 0;
  }

  const upfrontAmount = booking.paymentBreakdown.upfrontAmount;

  switch (cancellationPolicy) {
    case 'flexible':
      if (daysUntilCheckIn >= 1) {
        return upfrontAmount; // Full refund
      } else {
        return Math.round(upfrontAmount * 0.5); // 50% refund
      }

    case 'moderate':
      if (daysUntilCheckIn >= 7) {
        return upfrontAmount; // Full refund
      } else if (daysUntilCheckIn >= 3) {
        return Math.round(upfrontAmount * 0.5); // 50% refund
      } else {
        return 0; // No refund
      }

    case 'strict':
      if (daysUntilCheckIn >= 14) {
        return upfrontAmount; // Full refund
      } else if (daysUntilCheckIn >= 7) {
        return Math.round(upfrontAmount * 0.5); // 50% refund
      } else {
        return 0; // No refund
      }

    default:
      return 0;
  }
};

export default stripe;
