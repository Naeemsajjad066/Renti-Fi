// controllers/propertyController.js
import Property from "../models/Property.js";
import cloudinary from "../lib/cloudinary.js";

// CREATE Property
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      state,
      zipCode,
      country,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      price,
      selectedAmenities,
      latitude,
      longitude,
      locationAccuracy,
    } = req.body;

    // Upload multiple images from memory
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "properties" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer); // 👈 use buffer, not path
          })
      );

      uploadedImages = await Promise.all(uploadPromises);
    }

    const newProperty = await Property.create({
      host: req.user._id,
      title,
      description,
      address,
      city,
      state,
      zipCode,
      country,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      price,
      amenities: selectedAmenities ? JSON.parse(selectedAmenities) : [],
      images: uploadedImages,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      locationAccuracy: locationAccuracy ? parseFloat(locationAccuracy) : null,
      locationCapturedAt: latitude && longitude ? new Date() : null,
      isLocationVerified: !!(latitude && longitude),
    });

    return res.json({
      success: true,
      message: "Property created successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("host", "fullName email profilePicture");
    
    // Add caching headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'ETag': `"properties-${Date.now()}"`
    });
    
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching properties" });
  }
};

// GET single property by ID
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("host", "fullName email profilePicture createdAt");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    
    // Add caching headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=600', // Cache for 10 minutes
      'ETag': `"property-${property._id}-${property.updatedAt}"`
    });
    
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching property", error: error.message });
  }
};

// UPDATE Property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Handle new images
    let uploadedImages = property.images;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, { folder: "properties" })
      );
      const results = await Promise.all(uploadPromises);
      uploadedImages = [...uploadedImages, ...results.map((r) => r.secure_url)];
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: uploadedImages },
      { new: true }
    );

    res.json({ success: true, property: updatedProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating property" });
  }
};

// DELETE Property
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting property" });
  }
};

// CHECK Availability (basic)
// export const checkAvailability = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property) {
//       return res.status(404).json({ success: false, message: "Property not found" });
//     }

//     res.json({ success: true, availableDates: property.availableDates });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error checking availability" });
//   }
// };

// GET properties of logged-in user
export const getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const properties = await Property.find({ host: userId });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user properties" });
  }
};

// GET featured properties (latest 5 for example)
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isActive: true })
      .populate("host", "fullName email profilePicture")
      .sort({ createdAt: -1 })
      .limit(6);
    
    // Add caching headers
    res.set({
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'ETag': `"featured-${Date.now()}"`
    });
    
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching featured properties" });
  }
};
