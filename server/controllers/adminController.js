// controllers/adminController.js
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import AdminLog from '../models/AdminLog.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [
      userStats,
      propertyStats,
      bookingStats,
      revenueStats,
      recentActivities
    ] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            hosts: { $sum: { $cond: [{ $eq: ['$role', 'host'] }, 1, 0] } },
            guests: { $sum: { $cond: [{ $eq: ['$role', 'guest'] }, 1, 0] } }
          }
        }
      ]),
      
      // Property statistics
      Property.aggregate([
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            activeProperties: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            verifiedProperties: { $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] } },
            featuredProperties: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } }
          }
        }
      ]),
      
      // Booking statistics
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$totalPrice' }
          }
        }
      ]),
      
      // Revenue statistics (last 30 days)
      Booking.aggregate([
        {
          $match: {
            status: 'completed',
            paidAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$paidAt' }
            },
            dailyRevenue: { $sum: '$totalPrice' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Recent activities
      AdminLog.find()
        .populate('admin', 'fullName')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);
    
    const stats = {
      users: userStats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        hosts: 0,
        guests: 0
      },
      properties: propertyStats[0] || {
        totalProperties: 0,
        activeProperties: 0,
        verifiedProperties: 0,
        featuredProperties: 0
      },
      bookings: {},
      revenue: revenueStats,
      recentActivities
    };
    
    // Format booking stats
    bookingStats.forEach(stat => {
      stats.bookings[stat._id] = {
        count: stat.count,
        revenue: stat.revenue || 0
      };
    });
    
    res.json({
      success: true,
      data: { stats }
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { idCardNumber: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all properties with pagination and filters
export const getAllProperties = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, verified } = req.query;
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (verified !== undefined) filter.isVerified = verified === 'true';
    
    const properties = await Property.find(filter)
      .populate('host', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Property.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all bookings with pagination and filters
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, dateFrom, dateTo } = req.query;
    
    const filter = {};
    
    if (status) filter.status = status;
    
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    
    const bookings = await Booking.find(filter)
      .populate('property', 'title')
      .populate('guest', 'fullName email')
      .populate('host', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Booking.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user status (admin)
export const adminUpdateUser = async (req, res) => {
  try {
    const { isActive, role, isVerified } = req.body;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role) updates.role = role;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
    
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update property status (admin)
export const adminUpdateProperty = async (req, res) => {
  try {
    const { isActive, isVerified, isFeatured } = req.body;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (isVerified !== undefined) updates.isVerified = isVerified;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    
    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      updates,
      { new: true }
    ).populate('host', 'fullName email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
    
  } catch (error) {
    console.error('Admin update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get admin logs
export const getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, adminId, action } = req.query;
    
    const filter = {};
    if (adminId) filter.admin = adminId;
    if (action) filter.action = { $regex: action, $options: 'i' };
    
    const logs = await AdminLog.find(filter)
      .populate('admin', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await AdminLog.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify host documents
export const verifyHostDocuments = async (req, res) => {
  try {
    const { status, reason } = req.body;
    const { documentId } = req.params;
    
    const user = await User.findOne({
      'hostProfile.verificationDocuments._id': documentId
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    const document = user.hostProfile.verificationDocuments.id(documentId);
    document.status = status;
    if (reason) document.reviewNotes = reason;
    
    // If all documents are approved, mark user as verified
    const allApproved = user.hostProfile.verificationDocuments.every(
      doc => doc.status === 'approved'
    );
    
    if (allApproved) {
      user.isVerified = true;
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Document status updated successfully',
      data: { user: user.toObject() }
    });
    
  } catch (error) {
    console.error('Verify host documents error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};