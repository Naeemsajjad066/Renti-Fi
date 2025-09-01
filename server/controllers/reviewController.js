// controllers/reviewController.js
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, type = 'property' } = req.body;
    
    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if booking exists and user is the guest
    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('host');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }
    
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }
    
    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId, type });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this booking'
      });
    }
    
    // Create review
    const reviewData = {
      booking: bookingId,
      reviewer: req.user._id,
      rating,
      comment,
      type
    };
    
    if (type === 'property') {
      reviewData.property = booking.property._id;
      reviewData.reviewee = booking.property.host;
    } else if (type === 'guest') {
      reviewData.reviewee = booking.guest;
    }
    
    const review = await Review.create(reviewData);
    
    // Update booking review status
    if (type === 'property') {
      booking.isReviewed = true;
      await booking.save();
    }
    
    // Update property rating if it's a property review
    if (type === 'property') {
      await updatePropertyRating(booking.property._id);
    }
    
    // Update user rating if it's a guest review
    if (type === 'guest') {
      await updateUserRating(booking.guest);
    }
    
    await review.populate('reviewer', 'fullName profileImage');
    await review.populate('reviewee', 'fullName profileImage');
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
    
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get reviews for property
export const getPropertyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({
      property: req.params.propertyId,
      type: 'property',
      status: 'approved'
    })
    .populate('reviewer', 'fullName profileImage')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Review.countDocuments({
      property: req.params.propertyId,
      type: 'property',
      status: 'approved'
    });
    
    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get property reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get reviews for user
export const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'received' } = req.query;
    const userId = req.params.userId;
    
    let filter = {};
    
    if (type === 'received') {
      filter.reviewee = userId;
    } else if (type === 'given') {
      filter.reviewer = userId;
    }
    
    const reviews = await Review.find(filter)
      .populate('reviewer', 'fullName profileImage')
      .populate('reviewee', 'fullName profileImage')
      .populate('property', 'title images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Review.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update review (admin only)
export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('reviewer', 'fullName profileImage')
    .populate('reviewee', 'fullName profileImage');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Update ratings if approved
    if (status === 'approved') {
      if (review.type === 'property') {
        await updatePropertyRating(review.property);
      } else if (review.type === 'guest') {
        await updateUserRating(review.reviewee);
      }
    }
    
    res.json({
      success: true,
      message: 'Review status updated successfully',
      data: { review }
    });
    
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update property rating
const updatePropertyRating = async (propertyId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        property: propertyId,
        type: 'property',
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
};

// Helper function to update user rating
const updateUserRating = async (userId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        reviewee: userId,
        type: 'guest',
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$reviewee',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      'hostProfile.rating': Math.round(stats[0].averageRating * 10) / 10,
      'hostProfile.totalReviews': stats[0].totalReviews
    });
  }
};