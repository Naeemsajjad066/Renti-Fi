import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  attachments: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    type: {
      type: String,
      enum: ['image', 'document'],
      default: 'image'
    }
  }],
  category: {
    type: String,
    enum: [
      'false_information',
      'safety_concerns',
      'inappropriate_content',
      'scam_fraud',
      'property_condition',
      'host_behavior',
      'other'
    ],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  resolution: {
    type: String,
    maxlength: 1000
  },
  resolvedAt: Date,
  // Property snapshot at time of complaint
  propertySnapshot: {
    title: String,
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    location: String,
    price: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
complaintSchema.index({ status: 1, createdAt: -1 });
complaintSchema.index({ property: 1 });
complaintSchema.index({ reporter: 1 });
complaintSchema.index({ status: 1, priority: -1 });

// Virtual for complaint age in days
complaintSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
