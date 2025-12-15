// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Booking Information
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Dates
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  nights: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Guest Information
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    },
    pets: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: true
  },
  cleaningFee: {
    type: Number,
    default: 0
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'pending'],
    default: 'pending'
  },
  paymentId: String, // Payment gateway transaction ID
  paidAt: Date,
  
  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
    default: 'pending'
  },
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['guest', 'host', 'system']
  },
  cancelledAt: Date,
  
  // Communication
  specialRequests: String,
  hostMessage: String,
  
  // Review Status
  isReviewed: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

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
bookingSchema.virtual('duration').get(function() {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Method to check if booking can be cancelled
bookingSchema.methods.canCancel = function() {
  const now = new Date();
  const daysUntilCheckIn = Math.ceil((this.checkIn - now) / (1000 * 60 * 60 * 24));
  
  if (this.status !== 'confirmed') return false;
  
  // Allow cancellation up to 24 hours before check-in
  return daysUntilCheckIn > 1;
};

// Static method to find overlapping bookings
bookingSchema.statics.findOverlappingBookings = function(propertyId, checkIn, checkOut) {
  return this.find({
    property: propertyId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
      { checkIn: { $gte: checkIn, $lt: checkOut } }
    ]
  });
};

export default mongoose.model('Booking', bookingSchema);