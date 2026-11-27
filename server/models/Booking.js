// models/Booking.js
import mongoose from 'mongoose';
import {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  PAYMENT_OPTION,
  ACTIVE_BOOKING_STATUSES,
  MIN_DAYS_BEFORE_CHECKIN_TO_CANCEL,
  MS_PER_DAY,
} from '../constants/index.js';

const bookingSchema = new mongoose.Schema(
  {
    // Booking Information
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Dates
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    // Guest Information
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
      infants: {
        type: Number,
        default: 0,
        min: 0,
      },
      pets: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Pricing
    basePrice: {
      type: Number,
      required: true,
    },
    cleaningFee: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },

    // Payment Option Selected
    paymentOption: {
      type: String,
      enum: Object.values(PAYMENT_OPTION).filter((v) => v !== 'both'), // guests pick 'arrival' or 'early'
      required: true,
    },

    // Payment Breakdown for Early Payment
    paymentBreakdown: {
      upfrontAmount: { type: Number, default: 0 }, // 40% of total
      upfrontPaid: { type: Boolean, default: false },
      upfrontPaidAt: { type: Date },
      upfrontPaymentIntentId: { type: String }, // Stripe Payment Intent ID

      arrivalAmount: { type: Number, required: true }, // 60% or 100% depending on option
      arrivalPaid: { type: Boolean, default: false },
      arrivalPaidAt: { type: Date },
      arrivalPaymentIntentId: { type: String }, // For future online arrival payment
    },

    // Stripe Payment Information
    stripePaymentIntentId: { type: String }, // Main payment intent
    stripeChargeId: { type: String }, // Charge ID after capture
    stripeCheckoutSessionId: { type: String }, // Checkout session ID
    stripeTransferId: { type: String }, // Transfer ID to host's account
    stripeRefundId: { type: String }, // Refund ID if cancelled
    refundAmount: { type: Number, default: 0 },
    refundedAt: { type: Date },

    // Platform Fee & Host Payout
    platformFee: { type: Number, default: 0 }, // Platform's 5% commission
    hostPayout: { type: Number, default: 0 }, // Amount transferred to host

    // Payment Information
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.PENDING,
    },
    paymentId: String, // Legacy field
    paidAt: Date,

    // Booking Status
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.RESERVED,
    },
    cancellationReason: String,
    cancelledBy: {
      type: String,
      enum: ['guest', 'host', 'system'],
    },
    cancelledAt: Date,

    // Communication
    specialRequests: String,
    hostMessage: String,

    // Verification Code
    verificationCode: {
      type: String,
      required: true,
      unique: true,
    },

    // Review Status
    isReviewed: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookings for the same Stripe payment (webhook + client
// redirect can race; the unique index makes the second insert fail atomically)
bookingSchema.index({ stripePaymentIntentId: 1 }, { unique: true, sparse: true });
bookingSchema.index({ stripeCheckoutSessionId: 1 }, { unique: true, sparse: true });

// Indexes for better query performance
bookingSchema.index({ guest: 1 });
bookingSchema.index({ host: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ checkIn: 1 });
bookingSchema.index({ checkOut: 1 });
bookingSchema.index({ createdAt: 1 });

// Compound indexes for common queries
bookingSchema.index({ guest: 1, status: 1, createdAt: -1 });
bookingSchema.index({ host: 1, status: 1, createdAt: -1 });
bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1, status: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function () {
  return Math.ceil((this.checkOut - this.checkIn) / MS_PER_DAY);
});

// Method to check if booking can be cancelled
bookingSchema.methods.canCancel = function () {
  const now = new Date();
  const daysUntilCheckIn = Math.ceil((this.checkIn - now) / MS_PER_DAY);

  if (
    [BOOKING_STATUS.CANCELLED, BOOKING_STATUS.COMPLETED, BOOKING_STATUS.EXPIRED].includes(
      this.status
    )
  )
    return false;

  return daysUntilCheckIn > MIN_DAYS_BEFORE_CHECKIN_TO_CANCEL;
};

// Static method to find overlapping bookings
bookingSchema.statics.findOverlappingBookings = function (propertyId, checkIn, checkOut) {
  return this.find({
    property: propertyId,
    status: { $in: ACTIVE_BOOKING_STATUSES },
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
      { checkIn: { $gte: checkIn, $lt: checkOut } },
    ],
  });
};

export default mongoose.model('Booking', bookingSchema);
