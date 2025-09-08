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

  pricePerNight: { type: Number, required: true },

  images: [
    {
      url: String,
      caption: String
    }
  ],

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
},
{
  timestamps: true
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
