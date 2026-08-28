// controllers/bookingController.js
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { sendBookingConfirmationEmail } from '../lib/emailService.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, specialRequests } = req.body;
    const guestId = req.user._id;

    // Validate required fields
    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Parse dates - using UTC to avoid timezone issues
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Get today's date at start of day in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Normalize check-in date to start of day for comparison
    const checkInDateNormalized = new Date(checkInDate);
    checkInDateNormalized.setUTCHours(0, 0, 0, 0);

    // Validate dates
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking dates',
      });
    }

    if (checkInDateNormalized < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // Get property details
    const property = await Property.findById(propertyId).populate('host', 'fullName email');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (!property.isActive || property.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property is not available for booking',
      });
    }

    // Check if user is trying to book their own property
    if (property.host._id.toString() === guestId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property',
      });
    }

    // Normalize guests: allow clients to send either a number (adults) or an object {adults, children, infants, pets}
    let guestsObj;
    if (guests == null) {
      return res.status(400).json({ success: false, message: 'Guests information is required' });
    }

    if (typeof guests === 'number' || typeof guests === 'string') {
      // treat as adults count
      const adultsCount = Number(guests);
      if (isNaN(adultsCount) || adultsCount < 1) {
        return res.status(400).json({ success: false, message: 'Invalid guests value' });
      }
      guestsObj = { adults: adultsCount, children: 0, infants: 0, pets: 0 };
    } else if (typeof guests === 'object') {
      // copy and coerce numeric fields
      const adults = Number(guests.adults ?? guests.adult ?? 0);
      const children = Number(guests.children ?? guests.child ?? 0);
      const infants = Number(guests.infants ?? 0);
      const pets = Number(guests.pets ?? 0);

      if (isNaN(adults) || adults < 0) {
        return res.status(400).json({ success: false, message: 'Invalid adults count' });
      }

      guestsObj = {
        adults: adults || 0,
        children: isNaN(children) ? 0 : children,
        infants: isNaN(infants) ? 0 : infants,
        pets: isNaN(pets) ? 0 : pets,
      };

      // require at least one adult
      if (guestsObj.adults < 1) {
        return res.status(400).json({ success: false, message: 'At least one adult is required' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid guests format' });
    }

    // Check guest capacity (total people excluding pets)
    const totalPeople =
      (guestsObj.adults || 0) + (guestsObj.children || 0) + (guestsObj.infants || 0);
    if (totalPeople > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Property can accommodate maximum ${property.maxGuests} guests`,
      });
    }

    // Check for overlapping bookings (with race condition protection)
    // Note: For complete protection, consider using MongoDB transactions
    const overlappingBookings = await Booking.findOverlappingBookings(
      propertyId,
      checkInDate,
      checkOutDate
    );

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates. Please select different dates.',
      });
    }

    // Calculate pricing
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const basePrice = property.price * nights;
    const totalPrice = basePrice;

    // Create booking
    const booking = await Booking.create({
      property: propertyId,
      guest: guestId,
      host: property.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: {
        adults: guestsObj.adults,
        children: guestsObj.children,
        infants: guestsObj.infants,
        pets: guestsObj.pets,
      },
      basePrice,
      cleaningFee: 0,
      serviceFee: 0,
      taxes: 0,
      totalPrice,
      currency: 'PKR',
      specialRequests: specialRequests || '',
      paymentMethod: 'pending', // Will be updated when payment is processed
      paymentStatus: 'pending',
      status: 'confirmed', // Auto-confirm for now (will change to 'pending' when payment is required)
      verificationCode: Math.floor(100000 + Math.random() * 900000).toString(), // Generate 6-digit code
    });

    // Populate booking details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title images city address')
      .populate('guest', 'fullName email')
      .populate('host', 'fullName email');

    // Send confirmation email
    let emailSent = true;
    try {
      await sendBookingConfirmationEmail(
        populatedBooking,
        populatedBooking.property,
        populatedBooking.guest
      );
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError.message);
      emailSent = false;
      // Don't fail the booking if email fails, but notify user
    }

    res.status(201).json({
      success: true,
      message: emailSent
        ? 'Booking created successfully! Confirmation email sent.'
        : 'Booking created successfully, but confirmation email could not be sent. Please check your booking details.',
      booking: populatedBooking,
      emailSent,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);

    // Provide more specific error messages
    let errorMessage = 'Failed to create booking';
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      errorMessage = `Validation failed: ${validationErrors.join(', ')}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Get user bookings (both as guest and host)
export const getUserBookings = async (req, res) => {
  try {
    // Only admins may request another user's bookings.
    const requestedUserId = req.params.userId;
    const currentUserId = req.user._id.toString();
    if (requestedUserId && requestedUserId !== currentUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const userId = requestedUserId || currentUserId;
    const { type = 'guest' } = req.query; // 'guest' or 'host'

    let query = {};
    if (type === 'guest') {
      query.guest = userId;
    } else if (type === 'host') {
      query.host = userId;
    } else {
      // Both guest and host bookings
      query = {
        $or: [{ guest: userId }, { host: userId }],
      };
    }

    const bookings = await Booking.find(query)
      .populate('property', 'title images city address price')
      .populate('guest', 'fullName email profilePic')
      .populate('host', 'fullName email profilePic')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(id)
      .populate(
        'property',
        'title images city state address price amenities host latitude longitude propertyType bedrooms bathrooms'
      )
      .populate('guest', 'fullName email profilePic phoneNumber')
      .populate('host', 'fullName email profilePic phoneNumber');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized to view this booking
    if (
      booking.guest._id.toString() !== userId.toString() &&
      booking.host._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
    });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const validStatuses = ['confirmed', 'checked-in', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await Booking.findById(id).populate('host');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Only host can update booking status
    if (booking.host._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can update booking status',
      });
    }

    const allowedTransitions = {
      reserved: ['confirmed', 'cancelled'],
      confirmed: ['checked-in', 'cancelled'],
      'checked-in': ['completed'],
      completed: [],
      cancelled: [],
      expired: [],
    };
    if (!allowedTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change booking status from ${booking.status} to ${status}`,
      });
    }

    booking.status = status;
    booking.updatedAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is authorized to cancel
    const isGuest = booking.guest.toString() === userId.toString();
    const isHost = booking.host.toString() === userId.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking',
      });
    }

    // Check if booking can be cancelled
    if (!booking.canCancel()) {
      return res.status(400).json({
        success: false,
        message:
          'Booking cannot be cancelled (less than 24 hours to check-in or already completed)',
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = isGuest ? 'guest' : 'host';
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
    });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [guestStats, hostStats] = await Promise.all([
      Booking.aggregate([
        { $match: { guest: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalSpent: { $sum: '$totalPrice' },
          },
        },
      ]),
      Booking.aggregate([
        { $match: { host: userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalEarned: { $sum: '$totalPrice' },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        asGuest: guestStats,
        asHost: hostStats,
      },
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
    });
  }
};

// Check property availability
export const checkAvailability = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required',
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (!property.isActive || property.verificationStatus !== 'approved') {
      return res.json({
        success: true,
        available: false,
        conflictingBookings: 0,
        propertyId,
        dates: { checkIn, checkOut },
      });
    }

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      property: propertyId,
      status: { $in: ['reserved', 'confirmed', 'checked-in'] },
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
        { checkIn: { $gte: checkInDate, $lt: checkOutDate } },
      ],
    });

    const isAvailable = overlappingBookings.length === 0;

    res.json({
      success: true,
      available: isAvailable,
      conflictingBookings: overlappingBookings.length,
      propertyId,
      dates: { checkIn, checkOut },
    });
  } catch (error) {
    console.error('Error checking availability:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      available: false,
    });
  }
};

// Get booked date ranges for a property (public)
export const getBookedRanges = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }

    // Fetch bookings that are confirmed or pending (these block dates)
    const bookings = await Booking.find({
      property: propertyId,
      status: { $in: ['reserved', 'confirmed', 'checked-in'] },
    })
      .select('checkIn checkOut status')
      .sort({ checkIn: 1 });

    const ranges = bookings.map((b) => ({ from: b.checkIn, to: b.checkOut }));

    res.json({ success: true, ranges });
  } catch (error) {
    console.error('Error fetching booked ranges:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch booked ranges', ranges: [] });
  }
};
