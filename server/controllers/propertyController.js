// controllers/propertyController.js
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { validatePropertyData, validateBookingDates } from '../utils/validation.js';
import { geocodeAddress } from '../utils/geocoding.js';

// Create new property
export const createProperty = async (req, res) => {
  try {
    const propertyData = { ...req.body, host: req.user._id };
    
    // Validate property data
    const validation = validatePropertyData(propertyData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property data',
        errors: validation.errors
      });
    }
    
    // Geocode address if provided
    if (propertyData.location && propertyData.location.address) {
      try {
        const coordinates = await geocodeAddress(
          `${propertyData.location.address}, ${propertyData.location.city}, ${propertyData.location.country}`
        );
        propertyData.location.coordinates = {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        };
      } catch (error) {
        console.warn('Geocoding failed:', error.message);
      }
    }
    
    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      propertyData.images = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'rentifi/properties');
        propertyData.images.push({
          url: result.secure_url,
          caption: file.originalname,
          isPrimary: propertyData.images.length === 0 // First image is primary
        });
      }
    }
    
    const property = await Property.create(propertyData);
    
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
    
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all properties with filters
export const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      guests,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      location
    } = req.query;
    
    // Build filter object
    const filter = { isActive: true, isVerified: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (guests) filter.maxGuests = { $gte: Number(guests) };
    if (amenities) filter.amenities = { $in: amenities.split(',') };
    
    // Location-based filtering
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query
    const properties = await Property.find(filter)
      .populate('host', 'fullName profileImage rating totalReviews')
      .sort(sort)
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
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single property
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'fullName profileImage rating totalReviews responseRate responseTime isSuperhost joinDate');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Increment view count
    property.views += 1;
    await property.save();
    
    res.json({
      success: true,
      data: { property }
    });
    
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user owns the property or is admin
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }
    
    const updates = { ...req.body };
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'rentifi/properties');
        property.images.push({
          url: result.secure_url,
          caption: file.originalname
        });
      }
    }
    
    // Geocode address if updated
    if (updates.location && updates.location.address) {
      try {
        const coordinates = await geocodeAddress(
          `${updates.location.address}, ${updates.location.city}, ${updates.location.country}`
        );
        updates.location.coordinates = {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        };
      } catch (error) {
        console.warn('Geocoding failed:', error.message);
      }
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property: updatedProperty }
    });
    
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if user owns the property or is admin
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }
    
    // Delete images from Cloudinary
    for (const image of property.images) {
      const publicId = getPublicIdFromUrl(image.url);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }
    
    await Property.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check property availability
export const checkAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }
    
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.error
      });
    }
    
    // Find overlapping bookings
    const overlappingBookings = await Booking.findOverlappingBookings(
      req.params.id,
      new Date(checkIn),
      new Date(checkOut)
    );
    
    const isAvailable = overlappingBookings.length === 0;
    
    res.json({
      success: true,
      data: {
        isAvailable,
        conflictingBookings: overlappingBookings.length
      }
    });
    
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's properties
export const getUserProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId || req.user._id;
    
    const properties = await Property.find({ host: userId, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Property.countDocuments({ host: userId, isActive: true });
    
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
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get featured properties
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      isActive: true,
      isVerified: true,
      isFeatured: true
    })
    .populate('host', 'fullName profileImage rating')
    .sort({ rating: -1, bookingsCount: -1 })
    .limit(8);
    
    res.json({
      success: true,
      data: { properties }
    });
    
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};