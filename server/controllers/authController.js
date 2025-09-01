// controllers/authController.js
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { validateIdCardNumber } from '../utils/validation.js';

// Register new user with ID card
export const register = async (req, res) => {
  try {
    const { idCardNumber, fullName, email, phoneNumber, password, role } = req.body;

    // Validate required fields
    if (!idCardNumber || !fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate ID card number format
    if (!validateIdCardNumber(idCardNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID card number format'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ idCardNumber }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this ID card number or email'
      });
    }

    // Create new user
    const user = await User.create({
      idCardNumber,
      fullName,
      email,
      phoneNumber,
      password,
      role: role || 'guest'
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login with ID card number
export const login = async (req, res) => {
  try {
    const { idCardNumber, password } = req.body;

    // Validate required fields
    if (!idCardNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ID card number and password'
      });
    }

    // Find user with password field included
    const user = await User.findOne({ idCardNumber }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, bio, location } = req.body;
    const userId = req.user._id;

    // Build update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (location) updateData.location = location;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Find user with password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { idCardNumber, email } = req.body;

    if (!idCardNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide ID card number and email'
      });
    }

    const user = await User.findOne({ idCardNumber, email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with provided credentials'
      });
    }

    // Generate reset token (implementation depends on your email service)
    const resetToken = generateToken(user._id, '1h');
    
    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetToken);

    res.json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify ID card number availability
export const verifyIdCard = async (req, res) => {
  try {
    const { idCardNumber } = req.params;

    if (!idCardNumber) {
      return res.status(400).json({
        success: false,
        message: 'ID card number is required'
      });
    }

    const existingUser = await User.findOne({ idCardNumber });

    res.json({
      success: true,
      data: {
        isAvailable: !existingUser,
        exists: !!existingUser
      }
    });

  } catch (error) {
    console.error('ID card verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};