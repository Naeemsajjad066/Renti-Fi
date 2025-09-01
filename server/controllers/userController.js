// controllers/userController.js
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../config/cloudinary.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's properties if they're a host
    let properties = [];
    if (user.role === 'host') {
      properties = await Property.find({ host: userId, isActive: true })
        .select('title images location pricePerNight rating')
        .limit(6);
    }
    
    // Get user's booking stats
    const bookingStats = await Booking.aggregate([
      {
        $match: { guest: user._id }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        user,
        properties,
        stats: bookingStats[0] || { totalBookings: 0, completed: 0 }
      }
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, location } = req.body;
    const userId = req.params.userId || req.user._id;
    
    // Check if user is updating their own profile or is admin
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (bio !== undefined) updates.bio = bio;
    if (location) updates.location = location;
    
    // Handle profile image upload
    if (req.file) {
      const user = await User.findById(userId);
      
      // Delete old image if exists
      if (user.profileImage) {
        const publicId = getPublicIdFromUrl(user.profileImage);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
      
      // Upload new image
      const result = await uploadToCloudinary(req.file.path, 'rentifi/profiles');
      updates.profileImage = result.secure_url;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
    
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Become a host
export const becomeHost = async (req, res) => {
  try {
    const { documents } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (user.role === 'host') {
      return res.status(400).json({
        success: false,
        message: 'User is already a host'
      });
    }
    
    // Handle document uploads
    const verificationDocuments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'rentifi/documents');
        verificationDocuments.push({
          documentType: file.fieldname || 'verification',
          documentUrl: result.secure_url,
          status: 'pending',
          uploadedAt: new Date()
        });
      }
    }
    
    // Update user role and documents
    user.role = 'host';
    user.hostProfile.verificationDocuments = verificationDocuments;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Host application submitted successfully',
      data: { user: user.toObject() }
    });
    
  } catch (error) {
    console.error('Become host error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get host statistics
export const getHostStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [propertyStats, bookingStats, revenueStats] = await Promise.all([
      // Property statistics
      Property.aggregate([
        { $match: { host: userId } },
        {
          $group: {
            _id: null,
            totalProperties: { $sum: 1 },
            activeProperties: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            featuredProperties: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
            averageRating: { $avg: '$rating' }
          }
        }
      ]),
      
      // Booking statistics
      Booking.aggregate([
        { $match: { host: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ]),
      
      // Monthly revenue
      Booking.aggregate([
        { 
          $match: { 
            host: userId,
            status: 'completed',
            paidAt: { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$paidAt' },
              month: { $month: '$paidAt' }
            },
            revenue: { $sum: '$totalPrice' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ])
    ]);
    
    const stats = {
      properties: propertyStats[0] || {
        totalProperties: 0,
        activeProperties: 0,
        featuredProperties: 0,
        averageRating: 0
      },
      bookings: {},
      monthlyRevenue: revenueStats
    };
    
    // Format booking stats
    bookingStats.forEach(stat => {
      stats.bookings[stat._id] = {
        count: stat.count,
        revenue: stat.totalRevenue || 0
      };
    });
    
    res.json({
      success: true,
      data: { stats }
    });
    
  } catch (error) {
    console.error('Get host stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search users (admin only)
export const searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 20, role } = req.query;
    
    const filter = {};
    
    if (query) {
      filter.$or = [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { idCardNumber: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (role) {
      filter.role = role;
    }
    
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
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const userId = req.params.userId;
    
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role) updates.role = role;
    
    const user = await User.findByIdAndUpdate(
      userId,
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
      message: 'User status updated successfully',
      data: { user }
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};