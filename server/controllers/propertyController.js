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
      minimumStay,
      instantBooking,
      availableDates,
    } = req.body;

    // Upload multiple images
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: "properties",
        })
      );
      const results = await Promise.all(uploadPromises);
      uploadedImages = results.map((result) => result.secure_url);
    }

    const newProperty = await Property.create({
      owner: req.user._id,
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
      selectedAmenities: selectedAmenities ? JSON.parse(selectedAmenities) : [],
      images: uploadedImages,
    });

    return res.json({
      success: true,
      message: "Property created successfully",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error creating property" });
  }
};

// GET all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "fullName email");
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching properties" });
  }
};

// GET single property by ID
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "fullName email");
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching property" });
  }
};

// UPDATE Property
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
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

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting property" });
  }
};

// CHECK Availability (basic)
export const checkAvailability = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.json({ success: true, availableDates: property.availableDates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error checking availability" });
  }
};

// GET properties of logged-in user
export const getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const properties = await Property.find({ owner: userId });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user properties" });
  }
};

// GET featured properties (latest 5 for example)
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching featured properties" });
  }
};
