// middleware/admin.js
import AdminLog from '../models/AdminLog.js';

// Admin authentication middleware
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Enhanced admin action logger
export const logAdminAction = async (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    if (req.user && req.user.role === 'admin') {
      // Extract entity information from request
      let entityType = 'system';
      let entityId = null;
      let entityName = '';
      
      // Determine entity type from URL pattern
      const pathParts = req.originalUrl.split('/');
      if (pathParts.includes('users')) {
        entityType = 'user';
        entityId = req.params.userId;
      } else if (pathParts.includes('properties')) {
        entityType = 'property';
        entityId = req.params.propertyId;
      } else if (pathParts.includes('bookings')) {
        entityType = 'booking';
        entityId = req.params.bookingId;
      } else if (pathParts.includes('reviews')) {
        entityType = 'review';
        entityId = req.params.reviewId;
      }
      
      // Determine action type from HTTP method
      let actionType = 'other';
      switch (req.method) {
        case 'POST':
          actionType = 'create';
          break;
        case 'PUT':
        case 'PATCH':
          actionType = 'update';
          break;
        case 'DELETE':
          actionType = 'delete';
          break;
        case 'GET':
          actionType = 'view';
          break;
      }
      
      const logData = {
        admin: req.user._id,
        action: `${req.method} ${req.originalUrl}`,
        description: `Admin action performed by ${req.user.fullName}`,
        entityType,
        entityId: entityId || req.user._id,
        entityName: entityId ? `Entity ${entityId}` : 'System',
        actionType,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        method: req.method,
        endpoint: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined,
        statusCode: res.statusCode,
        responseTime,
        severity: res.statusCode >= 400 ? 'medium' : 'low',
        tags: ['admin-action', entityType, actionType]
      };
      
      // Add error information if applicable
      if (res.statusCode >= 400) {
        logData.error = {
          message: typeof data === 'object' ? data.message : 'Error occurred',
          stack: process.env.NODE_ENV === 'development' ? data.stack : undefined
        };
      }
      
      // Save log asynchronously (don't wait for it)
      AdminLog.create(logData).catch(error => {
        console.error('Failed to save admin log:', error);
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Rate limiting for admin endpoints
export const adminRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
};

// Permission validation middleware
export const validateAdminPermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    // In a real application, you'd check user permissions from database
    // For now, we'll assume all admins have full permissions
    
    if (requiredPermissions.length > 0) {
      // Here you would check if req.user has the required permissions
      const userPermissions = req.user.permissions || ['all']; // Default to all permissions
      
      const hasPermission = requiredPermissions.some(permission => 
        userPermissions.includes(permission) || userPermissions.includes('all')
      );
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions for this action'
        });
      }
    }
    
    next();
  };
};

// Audit trail middleware for sensitive operations
export const auditSensitiveOperations = (operations = []) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    const startTime = Date.now();
    
    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      
      // Check if this is a sensitive operation
      const isSensitive = operations.some(op => 
        req.originalUrl.includes(op.endpoint) && req.method === op.method
      );
      
      if (isSensitive && req.user && req.user.role === 'admin') {
        const operation = operations.find(op => 
          req.originalUrl.includes(op.endpoint) && req.method === op.method
        );
        
        const logData = {
          admin: req.user._id,
          action: `Sensitive operation: ${operation.name}`,
          description: operation.description,
          entityType: 'system',
          entityId: req.user._id,
          entityName: 'Sensitive Operation',
          actionType: 'execute',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          method: req.method,
          endpoint: req.originalUrl,
          params: req.params,
          query: req.query,
          body: req.body,
          statusCode: res.statusCode,
          responseTime,
          severity: 'high',
          tags: ['sensitive-operation', 'audit-trail', operation.name]
        };
        
        AdminLog.create(logData).catch(console.error);
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};