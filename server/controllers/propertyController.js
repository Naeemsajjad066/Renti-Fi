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

    // Separate files by field name - uploadFields returns an object
    const imageFiles = req.files?.['images'] || [];
    const idCardFile = req.files?.['idCard']?.[0]; // Single file
    const docFiles = req.files?.['propertyDocuments'] || [];

    // Upload property images
    let uploadedImages = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "properties" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      );
      uploadedImages = await Promise.all(uploadPromises);
    }

    // Upload ID card
    let idCardData = null;
    if (idCardFile) {
      const idCardUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "verification/id-cards" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(idCardFile.buffer);
      });
      idCardData = {
        url: idCardUpload.secure_url,
        publicId: idCardUpload.public_id,
        uploadedAt: new Date()
      };
    }

    // Upload property documents
    let propertyDocumentsData = [];
    if (docFiles.length > 0) {
      const docUploadPromises = docFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "verification/property-docs" },
              (error, result) => {
                if (error) reject(error);
                else resolve({
                  url: result.secure_url,
                  publicId: result.public_id,
                  name: file.originalname,
                  uploadedAt: new Date()
                });
              }
            );
            stream.end(file.buffer);
          })
      );
      propertyDocumentsData = await Promise.all(docUploadPromises);
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
      hostIdCard: idCardData,
      propertyDocuments: propertyDocumentsData,
      verificationStatus: 'pending',
      isVerified: false,
      isActive: false // Property won't be shown until approved
    });

    return res.json({
      success: true,
      message: "Property submitted for verification. You'll receive an email once it's reviewed.",
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
    // Only show approved properties to regular users
    // Admins and hosts can see their own properties regardless of status
    const filter = { 
      isActive: true, 
      verificationStatus: 'approved' 
    };
    
    const properties = await Property.find(filter).populate("host", "fullName email profilePicture");
    
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
    const properties = await Property.find({ isActive: true, verificationStatus: 'approved' })
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

// GET pending properties for admin verification
export const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ 
      verificationStatus: { $in: ['pending', 'resubmitted'] } 
    })
      .populate("host", "fullName email profilePicture phone")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pending properties" });
  }
};

// APPROVE property (Admin only)
export const approveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { adminNotes } = req.body;

    const property = await Property.findById(propertyId).populate("host", "fullName email");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Update property status
    property.verificationStatus = 'approved';
    property.isVerified = true;
    property.isActive = true;
    property.verifiedBy = req.user._id;
    property.verifiedAt = new Date();
    property.adminNotes = adminNotes || '';
    property.rejectionReason = null; // Clear any previous rejection reason

    await property.save();

    // Send approval email to host
    try {
      const { sendPropertyApprovalEmail } = await import('../lib/emailService.js');
      await sendPropertyApprovalEmail(property.host.email, {
        hostName: property.host.fullName,
        propertyTitle: property.title,
        propertyId: property._id,
        verifiedAt: property.verifiedAt
      });
    } catch (emailError) {
      console.error("Error sending approval email:", emailError);
      // Continue even if email fails
    }

    res.json({ 
      success: true, 
      message: "Property approved successfully",
      property 
    });
  } catch (error) {
    console.error("Error approving property:", error);
    res.status(500).json({ success: false, message: "Error approving property" });
  }
};

// REJECT property (Admin only)
export const rejectProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rejectionReason, adminNotes } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }

    const property = await Property.findById(propertyId).populate("host", "fullName email");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Update property status
    property.verificationStatus = 'rejected';
    property.isVerified = false;
    property.isActive = false;
    property.verifiedBy = req.user._id;
    property.verifiedAt = new Date();
    property.rejectionReason = rejectionReason;
    property.adminNotes = adminNotes || '';

    await property.save();

    // Send rejection email to host
    try {
      const { sendPropertyRejectionEmail } = await import('../lib/emailService.js');
      await sendPropertyRejectionEmail(property.host.email, {
        hostName: property.host.fullName,
        propertyTitle: property.title,
        rejectionReason,
        propertyId: property._id
      });
    } catch (emailError) {
      console.error("Error sending rejection email:", emailError);
      // Continue even if email fails
    }

    res.json({ 
      success: true, 
      message: "Property rejected",
      property 
    });
  } catch (error) {
    console.error("Error rejecting property:", error);
    res.status(500).json({ success: false, message: "Error rejecting property" });
  }
};
