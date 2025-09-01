// models/Property.js
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Host Information
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Location
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  
  // Property Details
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'villa', 'cabin', 'cottage', 'loft', 'condo', 'townhouse']
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1
  },
  size: {
    value: Number,
    unit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    }
  },
  
  // Amenities
  amenities: [{
    type: String,
    enum: [
      'wifi', 'tv', 'kitchen', 'parking', 'ac', 'heating', 'washer', 'dryer',
      'pool', 'gym', 'hot_tub', 'garden', 'balcony', 'fireplace', 'pet_friendly',
      'breakfast', 'security', 'concierge', 'elevator'
    ]
  }],
  
  // Pricing
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  cleaningFee: {
    type: Number,
    default: 0,
    min: 0
  },
  securityDeposit: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Availability
  minimumStay: {
    type: Number,
    default: 1,
    min: 1
  },
  maximumStay: {
    type: Number,
    default: 30,
    min: 1
  },
  instantBooking: {
    type: Boolean,
    default: false
  },
  availability: [{
    startDate: Date,
    endDate: Date,
    isAvailable: Boolean,
    price: Number // Optional custom pricing for specific dates
  }],
  
  // Images
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Ratings and Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Rules and Policies
  checkInTime: String,
  checkOutTime: String,
  houseRules: [String],
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict', 'super_strict'],
    default: 'moderate'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  bookingsCount: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
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

// Geospatial index for location-based queries
propertySchema.index({ 'location.coordinates': '2dsphere' });
propertySchema.index({ host: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ pricePerNight: 1 });
propertySchema.index({ isActive: 1, isVerified: 1 });

// Virtual for average rating (if needed)
propertySchema.virtual('averageRating').get(function() {
  return this.rating;
});

// Method to check availability
propertySchema.methods.isAvailable = function(checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check against availability calendar
  for (const period of this.availability) {
    const periodStart = new Date(period.startDate);
    const periodEnd = new Date(period.endDate);
    
    if (checkInDate >= periodStart && checkOutDate <= periodEnd && !period.isAvailable) {
      return false;
    }
  }
  
  return true;
};

// Method to calculate total price
propertySchema.methods.calculateTotalPrice = function(checkIn, checkOut, guests) {
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  let total = this.pricePerNight * nights;
  
  // Add cleaning fee
  total += this.cleaningFee;
  
  // Add security deposit
  total += this.securityDeposit;
  
  return total;
};

export default mongoose.model('Property', propertySchema);