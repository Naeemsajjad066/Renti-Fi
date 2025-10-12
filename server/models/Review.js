// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Property being reviewed
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  // User who wrote the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Associated booking
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Review content
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  
  // Detailed ratings
  cleanliness: {
    type: Number,
    min: 1,
    max: 5
  },
  accuracy: {
    type: Number,
    min: 1,
    max: 5
  },
  communication: {
    type: Number,
    min: 1,
    max: 5
  },
  location: {
    type: Number,
    min: 1,
    max: 5
  },
  checkIn: {
    type: Number,
    min: 1,
    max: 5
  },
  value: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Review status
  isVerified: {
    type: Boolean,
    default: true // Reviews from completed bookings are verified
  },
  
  // Host response
  hostResponse: {
    comment: String,
    respondedAt: Date
  },
  
  // Helpfulness tracking
  helpful: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  helpfulCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Indexes for efficient queries
reviewSchema.index({ property: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ rating: 1 });

// Prevent duplicate reviews for the same booking
reviewSchema.index({ booking: 1 }, { unique: true });

// Calculate average ratings for a property
reviewSchema.statics.calculatePropertyRating = async function(propertyId) {
  const stats = await this.aggregate([
    {
      $match: { property: propertyId }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        averageCleanliness: { $avg: '$cleanliness' },
        averageAccuracy: { $avg: '$accuracy' },
        averageCommunication: { $avg: '$communication' },
        averageLocation: { $avg: '$location' },
        averageCheckIn: { $avg: '$checkIn' },
        averageValue: { $avg: '$value' }
      }
    }
  ]);
  
  return stats[0] || {
    averageRating: 0,
    totalReviews: 0
  };
};

// Update property rating after review changes
reviewSchema.post('save', async function() {
  const Property = mongoose.model('Property');
  const stats = await this.constructor.calculatePropertyRating(this.property);
  
  await Property.findByIdAndUpdate(this.property, {
    rating: Math.round(stats.averageRating * 10) / 10,
    totalReviews: stats.totalReviews
  });
});

reviewSchema.post('remove', async function() {
  const Property = mongoose.model('Property');
  const stats = await this.constructor.calculatePropertyRating(this.property);
  
  await Property.findByIdAndUpdate(this.property, {
    rating: Math.round(stats.averageRating * 10) / 10,
    totalReviews: stats.totalReviews
  });
});

export default mongoose.model('Review', reviewSchema);