import Complaint from '../models/Complaint.js';
import Property from '../models/Property.js';
import { sendEmail } from '../lib/emailService.js';
import { uploadToCloudinary } from '../lib/cloudinary.js';

// Upload complaint file
export const uploadComplaintFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Convert buffer to base64 data URI for Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(dataURI, 'complaints');

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload file'
    });
  }
};

// Submit a complaint
export const submitComplaint = async (req, res) => {
  try {
    const { propertyId, title, description, category, attachments } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId).populate('host', 'fullName email');
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Create property snapshot
    const propertySnapshot = {
      title: property.title,
      host: property.host._id,
      location: `${property.city}, ${property.state}`,
      price: property.price
    };

    // Create complaint
    const complaint = await Complaint.create({
      property: propertyId,
      reporter: req.user._id,
      title,
      description,
      category: category || 'other',
      attachments: attachments || [],
      propertySnapshot,
      status: 'pending',
      priority: 'medium'
    });

    // Populate complaint details
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('property', 'title images city state')
      .populate('reporter', 'fullName email')
      .populate('propertySnapshot.host', 'fullName email');

    // Send notification email to admin
    try {
      await sendComplaintNotificationToAdmin(populatedComplaint, property);
    } catch (emailError) {
      console.error('Failed to send complaint notification email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. Our team will review it shortly.',
      complaint: populatedComplaint
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint'
    });
  }
};

// Get all complaints (Admin only)
export const getAllComplaints = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const complaints = await Complaint.find(filter)
      .populate('property', 'title images city state price')
      .populate('reporter', 'fullName email profilePic')
      .populate('propertySnapshot.host', 'fullName email')
      .populate('reviewedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints'
    });
  }
};

// Get complaint by ID (Admin only)
export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate('property', 'title images city state price address host')
      .populate('reporter', 'fullName email phoneNumber profilePic')
      .populate('propertySnapshot.host', 'fullName email phoneNumber')
      .populate('reviewedBy', 'fullName email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaint'
    });
  }
};

// Update complaint status (Admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes, resolution } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update fields
    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;
    if (adminNotes) complaint.adminNotes = adminNotes;
    if (resolution) complaint.resolution = resolution;

    // Set reviewed info if status changed from pending
    if (status && complaint.status !== 'pending' && !complaint.reviewedBy) {
      complaint.reviewedBy = req.user._id;
      complaint.reviewedAt = new Date();
    }

    // Set resolved date if resolved
    if (status === 'resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(id)
      .populate('property', 'title images city state')
      .populate('reporter', 'fullName email')
      .populate('reviewedBy', 'fullName email');

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update complaint'
    });
  }
};

// Get complaints statistics (Admin only)
export const getComplaintStats = async (req, res) => {
  try {
    const [
      total,
      pending,
      underReview,
      resolved,
      dismissed,
      highPriority,
      urgent
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'under_review' }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: 'dismissed' }),
      Complaint.countDocuments({ priority: 'high' }),
      Complaint.countDocuments({ priority: 'urgent' })
    ]);

    // Get complaints by category
    const byCategory = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .populate('property', 'title')
      .populate('reporter', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: {
          pending,
          under_review: underReview,
          resolved,
          dismissed
        },
        byPriority: {
          high: highPriority,
          urgent
        },
        byCategory: byCategory.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentComplaints
      }
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaint statistics'
    });
  }
};

// Get user's complaints
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ reporter: req.user._id })
      .populate('property', 'title images city state')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints'
    });
  }
};

// Helper function to send email notification to admin
async function sendComplaintNotificationToAdmin(complaint, property) {
  try {
    const adminEmails = process.env.ADMIN_EMAIL || 'rentifi.project@gmail.com';
    
    const emailContent = {
      to: adminEmails,
      subject: `New Complaint: ${complaint.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc3545;">New Property Complaint Received</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Complaint Details</h3>
            <p><strong>Title:</strong> ${complaint.title}</p>
            <p><strong>Category:</strong> ${complaint.category.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Status:</strong> ${complaint.status}</p>
            <p><strong>Priority:</strong> ${complaint.priority}</p>
          </div>
          
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Description</h3>
            <p>${complaint.description}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Property Information</h3>
            <p><strong>Property:</strong> ${property.title}</p>
            <p><strong>Location:</strong> ${property.city}, ${property.state}</p>
            <p><strong>Host:</strong> ${property.host.fullName}</p>
            <p><strong>Price:</strong> Rs ${property.price}/night</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Reporter Information</h3>
            <p><strong>Name:</strong> ${complaint.reporter.fullName}</p>
            <p><strong>Email:</strong> ${complaint.reporter.email}</p>
          </div>
          
          ${complaint.attachments && complaint.attachments.length > 0 ? `
          <div style="margin: 20px 0;">
            <h3>Attachments</h3>
            <p>${complaint.attachments.length} file(s) attached</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:8080'}/admin/complaints/${complaint._id}" 
               style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 6px; font-weight: 600;">
              Review Complaint
            </a>
          </div>
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated notification from Rentifi complaint system.
          </p>
        </div>
      `
    };

    await sendEmail(emailContent.to, emailContent.subject, emailContent.html);
    console.log('Complaint notification email sent to admin');
  } catch (error) {
    console.error('Failed to send complaint notification email:', error);
    throw error;
  }
}
