// models/Property.js
import mongoose from "mongoose";


const propertySchema = new mongoose.Schema({
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

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

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

  propertyType: {
    type: String,
    required: true,
    enum: [
      "apartment",
      "house",
      "villa",
      "cabin",
      "cottage",
      "loft",
      "condo",
      "townhouse"
    ]
  },

  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  maxGuests: { type: Number, required: true },

  amenities: [String],

  price: { type: Number, required: true },

  images: [String],

  // Geolocation fields for property location verification
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },
  locationCapturedAt: { type: Date, required: false },
  isLocationVerified: { type: Boolean, default: false },
  locationAccuracy: { type: Number, required: false }, // GPS accuracy in meters

  // Verification documents
  hostIdCard: {
    url: { type: String, required: false },
    publicId: { type: String, required: false },
    uploadedAt: { type: Date, required: false }
  },
  propertyDocuments: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    name: { type: String, required: false },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Verification status and workflow
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'resubmitted'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  verifiedAt: { type: Date, required: false },
  rejectionReason: { type: String, required: false },
  adminNotes: { type: String, required: false },

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }, // Changed default to false

  // Payment Configuration (Required for listing)
  paymentOptions: {
    type: String,
    enum: ['arrival', 'early', 'both'],
    required: [true, 'Payment option is required to list property'],
    default: 'both'
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    required: [true, 'Cancellation policy is required'],
    default: 'moderate'
  },
  // Stripe Connect Account (for future direct payouts to hosts)
  stripeAccountId: {
    type: String,
    default: null
  }
},
{
  timestamps: true
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
