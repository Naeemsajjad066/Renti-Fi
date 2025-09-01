// models/AdminLog.js
import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  // Admin information
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Action details
  action: {
    type: String,
    required: true
  },
  description: String,
  
  // Request information
  ipAddress: String,
  userAgent: String,
  method: String,
  url: String,
  params: mongoose.Schema.Types.Mixed,
  query: mongoose.Schema.Types.Mixed,
  body: mongoose.Schema.Types.Mixed,
  
  // Response information
  statusCode: Number,
  response: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Indexes
adminLogSchema.index({ admin: 1 });
adminLogSchema.index({ action: 1 });
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ ipAddress: 1 });

export default mongoose.model('AdminLog', adminLogSchema);