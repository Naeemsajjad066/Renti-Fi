// controllers/reviewController.js
import Review from '../models/Review.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const {
      property,
      booking,
      rating,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      checkIn,
      value
    } = req.body;

    // Validate required fields
    if (!property || !booking || !rating || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Property, booking, rating, and comment are required' 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify booking exists and belongs to user
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if bookingDoc.guest exists (Booking model uses 'guest' field, not 'user')
    if (!bookingDoc.guest) {
      return res.status(400).json({ success: false, message: 'Booking guest information missing' });
    }

    // Verify the booking belongs to the requesting user
    if (bookingDoc.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Check if booking is completed or checkout date has passed
    const now = new Date();
    const checkoutDate = new Date(bookingDoc.checkOut);
    const isCheckoutPassed = checkoutDate < now;
    
    if (bookingDoc.status !== 'completed' && !isCheckoutPassed) {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only review bookings after checkout date or when marked as completed' 
      });
    }
    
    // Auto-update booking status to completed if checkout has passed
    if (bookingDoc.status === 'confirmed' && isCheckoutPassed) {
      bookingDoc.status = 'completed';
      await bookingDoc.save();
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this booking' });
    }

    // Create review
    const review = await Review.create({
      property,
      user: req.user._id,
      booking,
      rating,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      checkIn,
      value
    });

    // Populate user details
    await review.populate('user', 'fullName profilePic email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating review'
    });
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'fullName profilePic email')
      .populate('property', 'title host')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get property reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

// @desc    Get property review statistics
// @route   GET /api/reviews/property/:propertyId/stats
// @access  Public
export const getPropertyStats = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const stats = await Review.calculatePropertyRating(propertyId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get property stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('property', 'title images host')
      .populate('booking', 'checkIn checkOut')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews'
    });
  }
};

// @desc    Get reviews by a specific user (public)
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .populate('property', 'title images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Get reviews by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      comment,
      cleanliness,
      accuracy,
      communication,
      location,
      checkIn,
      value
    } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    // Update fields
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.cleanliness = cleanliness || review.cleanliness;
    review.accuracy = accuracy || review.accuracy;
    review.communication = communication || review.communication;
    review.location = location || review.location;
    review.checkIn = checkIn || review.checkIn;
    review.value = value || review.value;

    await review.save();
    await review.populate('user', 'fullName profilePic email');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
};

// @desc    Add host response to a review
// @route   POST /api/reviews/:id/response
// @access  Private (Host only)
export const addHostResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const review = await Review.findById(id).populate('property');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user is the property host
    if (review.property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the property host can respond' });
    }

    // Check if response already exists
    if (review.hostResponse?.comment) {
      return res.status(400).json({ success: false, message: 'Host response already exists' });
    }

    review.hostResponse = {
      comment,
      respondedAt: new Date()
    };

    await review.save();
    await review.populate('user', 'fullName profilePic email');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: review
    });
  } catch (error) {
    console.error('Add host response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response'
    });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpful.some(
      userId => userId.toString() === req.user._id.toString()
    );

    if (alreadyMarked) {
      // Remove helpful mark
      review.helpful = review.helpful.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
      review.helpfulCount = review.helpful.length;
    } else {
      // Add helpful mark
      review.helpful.push(req.user._id);
      review.helpfulCount = review.helpful.length;
    }

    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful'
    });
  }
};

// @desc    Check if user can review a property
// @route   GET /api/reviews/can-review/:propertyId
// @access  Private
export const canUserReview = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find completed bookings or confirmed bookings past checkout date
    const now = new Date();
    const bookings = await Booking.find({
      guest: req.user._id,
      property: propertyId,
      status: { $in: ['completed', 'confirmed'] }
    });
    
    // Filter bookings that are completed or past checkout date
    const completedBookings = bookings.filter(booking => {
      return booking.status === 'completed' || new Date(booking.checkOut) < now;
    });

    if (completedBookings.length === 0) {
      return res.json({
        success: true,
        canReview: false,
        message: 'No completed bookings found'
      });
    }

    // Check if user has already reviewed any of these bookings
    const reviewedBookings = await Review.find({
      user: req.user._id,
      booking: { $in: completedBookings.map(b => b._id) }
    });

    const unreviewedBookings = completedBookings.filter(
      booking => !reviewedBookings.some(review => review.booking.toString() === booking._id.toString())
    );

    res.json({
      success: true,
      canReview: unreviewedBookings.length > 0,
      bookings: unreviewedBookings
    });
  } catch (error) {
    console.error('Can review check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking review eligibility'
    });
  }
};
