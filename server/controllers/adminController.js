// controllers/adminController.js
import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import AdminLog from '../models/AdminLog.js';

// GET Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingProperties = await Property.countDocuments({ verificationStatus: 'pending' });

    // Calculate revenue
    const bookings = await Booking.find({ status: 'completed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    // Get recent activity
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.find({ createdAt: { $gte: thirtyDaysAgo } })
      .select('fullName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentBookingsData = await Booking.find({ createdAt: { $gte: thirtyDaysAgo } })
      .populate('guest', 'fullName')
      .populate('property', 'title')
      .select('guest property totalPrice createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const activeUsers = await User.countDocuments({ isActive: true });
    const activeProperties = await Property.countDocuments({ verificationStatus: 'approved', isActive: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalProperties,
        activeProperties,
        totalBookings,
        totalRevenue,
        pendingProperties,
        recentUsers,
        recentBookings: recentBookingsData
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard statistics' });
  }
};

// GET All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Get booking counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ guest: user._id });
        const propertyCount = user.role === 'host' 
          ? await Property.countDocuments({ host: user._id })
          : 0;

        return {
          ...user.toObject(),
          bookingCount,
          propertyCount
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      count: usersWithStats.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// GET All Properties (Admin view - includes all statuses)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('host', 'fullName email profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, message: 'Error fetching properties' });
  }
};

// GET All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('guest', 'fullName email profilePicture')
      .populate('property', 'title city images price')
      .populate('host', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

// UPDATE User (Admin)
export const adminUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow updating password through this endpoint
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log admin action
    if (AdminLog) {
      await AdminLog.create({
        admin: req.user._id,
        action: 'UPDATE_USER',
        targetType: 'User',
        targetId: userId,
        details: `Updated user: ${user.fullName}`,
        changes: updates
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

// UPDATE Property (Admin)
export const adminUpdateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const updates = req.body;

    const property = await Property.findByIdAndUpdate(
      propertyId,
      updates,
      { new: true, runValidators: true }
    ).populate('host', 'fullName email');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Log admin action
    if (AdminLog) {
      await AdminLog.create({
        admin: req.user._id,
        action: 'UPDATE_PROPERTY',
        targetType: 'Property',
        targetId: propertyId,
        details: `Updated property: ${property.title}`,
        changes: updates
      });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, message: 'Error updating property' });
  }
};

// DELETE Property (Admin)
export const adminDeleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Delete all bookings associated with this property
    await Booking.deleteMany({ property: propertyId });

    // Delete the property
    await Property.findByIdAndDelete(propertyId);

    // Log admin action
    if (AdminLog) {
      await AdminLog.create({
        admin: req.user._id,
        action: 'DELETE_PROPERTY',
        targetType: 'Property',
        targetId: propertyId,
        details: `Deleted property: ${property.title}`,
      });
    }

    res.json({
      success: true,
      message: 'Property and associated bookings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: 'Error deleting property' });
  }
};

// DELETE User (Admin)
export const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }

    // Delete user's properties if they are a host
    if (user.isHost || user.role === 'host') {
      await Property.deleteMany({ host: userId });
    }

    // Delete user's bookings
    await Booking.deleteMany({ guest: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Log admin action
    if (AdminLog) {
      await AdminLog.create({
        admin: req.user._id,
        action: 'DELETE_USER',
        targetType: 'User',
        targetId: userId,
        details: `Deleted user: ${user.fullName}`,
      });
    }

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// GET Admin Logs
export const getAdminLogs = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    let logs = [];
    
    // Check if AdminLog model exists
    if (AdminLog) {
      logs = await AdminLog.find()
        .populate('admin', 'fullName email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));
    }

    res.json({
      success: true,
      logs,
      count: logs.length
    });
  } catch (error) {
    console.error('Error fetching admin logs:', error);
    res.status(500).json({ success: false, message: 'Error fetching admin logs' });
  }
};

// Verify Host Documents (placeholder)
export const verifyHostDocuments = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { status, notes } = req.body;

    // This is a placeholder - implement based on your document verification needs
    res.json({
      success: true,
      message: 'Document verification updated',
      documentId,
      status
    });
  } catch (error) {
    console.error('Error verifying documents:', error);
    res.status(500).json({ success: false, message: 'Error verifying documents' });
  }
};
