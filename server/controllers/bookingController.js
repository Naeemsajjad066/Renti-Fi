// controllers/bookingController.js
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { validateBookingDates } from '../utils/validation.js';

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, specialRequests } = req.body;
    
    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, dates, and guests information are required'
      });
    }
    
    // Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error
      });
    }
    
    // Get property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check availability
    const overlappingBookings = await Booking.findOverlappingBookings(
      propertyId,
      new Date(checkIn),
      new Date(checkOut)
    );
    
    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for the selected dates'
      });
    }
    
    // Check guest count
    if (guests.adults > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${property.maxGuests} guests allowed`
      });
    }
    
    // Calculate total price
    const nights = dateValidation.nights;
    const totalPrice = property.calculateTotalPrice(checkIn, checkOut, guests.adults);
    
    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      guest: req.user._id,
      host: property.host,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights,
      guests,
      specialRequests,
      basePrice: property.pricePerNight * nights,
      cleaningFee: property.cleaningFee,
      securityDeposit: property.securityDeposit,
      serviceFee: totalPrice * 0.1, // 10% service fee
      totalPrice,
      currency: property.currency,
      paymentMethod: 'credit_card' // Default, can be updated
    });
    
    // Populate booking details
    await booking.populate('property', 'title images location');
    await booking.populate('host', 'fullName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
    
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let filter = {};
    
    if (userRole === 'guest') {
      filter.guest = userId;
    } else if (userRole === 'host') {
      filter.host = userId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    const bookings = await Booking.find(filter)
      .populate('property', 'title images location pricePerNight')
      .populate('guest', 'fullName profileImage')
      .populate('host', 'fullName profileImage')
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
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property', 'title images location amenities houseRules')
      .populate('guest', 'fullName profileImage email phoneNumber')
      .populate('host', 'fullName profileImage email phoneNumber');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user is authorized to view this booking
    const isAuthorized = 
      booking.guest._id.toString() === req.user._id.toString() ||
      booking.host._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.json({
      success: true,
      data: { booking }
    });
    
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check authorization
    const isAuthorized = 
      booking.host._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }
    
    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      cancelled: [],
      completed: []
    };
    
    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }
    
    booking.status = status;
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
      booking.cancelledBy = req.user.role;
      booking.cancelledAt = new Date();
    }
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
    
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user can cancel this booking
    const canCancel = booking.canCancel();
    if (!canCancel) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }
    
    // Check authorization
    const isAuthorized = 
      booking.guest._id.toString() === req.user._id.toString() ||
      booking.host._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledBy = req.user.role;
    booking.cancelledAt = new Date();
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
    
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    
    let filter = {};
    if (userRole === 'guest') {
      filter.guest = userId;
    } else if (userRole === 'host') {
      filter.host = userId;
    }
    
    const stats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalBookings: 0,
      totalRevenue: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };
    
    res.json({
      success: true,
      data: { stats: result }
    });
    
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};