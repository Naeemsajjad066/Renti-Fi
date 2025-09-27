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

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true }
},
{
  timestamps: true
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
