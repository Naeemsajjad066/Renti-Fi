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
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  
  // Affected entity information
  entityType: {
    type: String,
    enum: ['user', 'property', 'booking', 'review', 'system'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  entityName: {
    type: String,
    trim: true
  },
  
  // Action type
  actionType: {
    type: String,
    enum: [
      'create', 'update', 'delete', 'approve', 'reject', 
      'verify', 'suspend', 'activate', 'login', 'logout'
    ],
    required: true
  },
  
  // Changes made (for update actions)
  changes: {
    oldData: mongoose.Schema.Types.Mixed,
    newData: mongoose.Schema.Types.Mixed,
    changedFields: [String]
  },
  
  // Request information
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  params: mongoose.Schema.Types.Mixed,
  query: mongoose.Schema.Types.Mixed,
  body: mongoose.Schema.Types.Mixed,
  
  // Response information
  statusCode: {
    type: Number,
    required: true
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true
  },
  error: {
    message: String,
    stack: String
  },
  
  // Additional metadata
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  tags: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Indexes for better query performance
adminLogSchema.index({ admin: 1 });
adminLogSchema.index({ actionType: 1 });
adminLogSchema.index({ entityType: 1, entityId: 1 });
adminLogSchema.index({ severity: 1 });
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ ipAddress: 1 });
adminLogSchema.index({ 'tags': 1 });

// Compound indexes
adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ entityType: 1, createdAt: -1 });
adminLogSchema.index({ actionType: 1, createdAt: -1 });

// Virtual for formatted date
adminLogSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for duration (human readable)
adminLogSchema.virtual('duration').get(function() {
  if (this.responseTime < 1000) {
    return `${this.responseTime}ms`;
  }
  return `${(this.responseTime / 1000).toFixed(2)}s`;
});

// Static method to get admin activity summary
adminLogSchema.statics.getAdminActivity = async function(adminId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        admin: new mongoose.Types.ObjectId(adminId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          actionType: '$actionType',
          entityType: '$entityType'
        },
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$responseTime' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Static method to get system-wide admin stats
adminLogSchema.statics.getSystemStats = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalActions: { $sum: 1 },
        uniqueAdmins: { $addToSet: '$admin' },
        avgResponseTime: { $avg: '$responseTime' },
        errorCount: {
          $sum: {
            $cond: [{ $ne: ['$error', null] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        totalActions: 1,
        adminCount: { $size: '$uniqueAdmins' },
        avgResponseTime: 1,
        errorCount: 1,
        successRate: {
          $subtract: [
            1,
            { $divide: ['$errorCount', '$totalActions'] }
          ]
        }
      }
    }
  ]);
};

// Method to get action details
adminLogSchema.methods.getActionDetails = function() {
  const details = {
    action: this.action,
    type: this.actionType,
    entity: `${this.entityType}: ${this.entityName || this.entityId}`,
    timestamp: this.formattedDate,
    duration: this.duration,
    status: this.statusCode
  };
  
  if (this.changes && Object.keys(this.changes).length > 0) {
    details.changes = this.changes;
  }
  
  if (this.error) {
    details.error = this.error.message;
  }
  
  return details;
};

// Pre-save middleware to calculate response time
adminLogSchema.pre('save', function(next) {
  if (this.isNew) {
    this.responseTime = Date.now() - this.createdAt.getTime();
  }
  next();
});

export default mongoose.models.AdminLog || mongoose.model('AdminLog', adminLogSchema);
