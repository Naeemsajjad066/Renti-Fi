import { generateToken } from "../lib/utils.js"
import User from "../models/User.js"
import VerificationCode from "../models/VerificationCode.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"
import { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } from "../lib/emailService.js"

export const Signup = async (req, res) => {
    const { fullName, phoneNumber, idCard, email, password } = req.body;
    
    try {
        // Validate required fields
        if (!fullName || !idCard || !email || !password || !phoneNumber) {
            return res.json({ success: false, message: "Missing required details" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        // Check if ID card is already used
        const existingIdCard = await User.findOne({ idCard });
        if (existingIdCard) {
            return res.json({ success: false, message: "ID card number already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Delete any existing verification codes for this email
        await VerificationCode.deleteMany({ email });

        // Create new verification code record
        await VerificationCode.create({
            email,
            code: verificationCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode, fullName);

        // Store user data temporarily (without creating the user yet)
        // We'll create the user after email verification
        res.json({
            success: true,
            message: "Verification code sent to your email. Please check your inbox.",
            email,
            requiresVerification: true
        });

    } catch (error) {
        console.log("Signup error:", error.message);
        if (error.message.includes('Failed to send verification email')) {
            res.json({ success: false, message: "Failed to send verification email. Please try again." });
        } else {
            res.json({ success: false, message: error.message });
        }
    }
};


//Login User


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
      }
  
      const userData = await User.findOne({ email });
      if (!userData) {
        return res.json({ success: false, message: "User not found" });
      }

      // Check if email is verified
      if (!userData.isEmailVerified) {
        return res.json({ 
          success: false, 
          message: "Please verify your email before logging in",
          requiresVerification: true,
          email: userData.email
        });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, userData.password);
      if (!isPasswordCorrect) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
  
      const token = generateToken(userData._id);
      return res.json({
        success: true,
        userData,
        token,
        message: "Login Successful",
      });
    } catch (error) {
      console.log("Login error:", error.message);
      return res.json({ success: false, message: error.message });
    }
  };
  

// COntroller to check if user is authenticated

export const checkAuth=(req,res)=>{
    try {
        res.json({success:true,user:req.user})
    } catch (error) {
        res.json({success:false, message:"User is not authenticated"})
    }
}

// Verify email with 6-digit code
export const verifyEmail = async (req, res) => {
    const { email, code, userData } = req.body;
    
    try {
        if (!email || !code || !userData) {
            return res.json({ success: false, message: "Email, verification code, and user data are required" });
        }

        // Find verification code
        const verificationRecord = await VerificationCode.findOne({ 
            email, 
            code,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!verificationRecord) {
            return res.json({ success: false, message: "Invalid or expired verification code" });
        }

        // Check attempt limit
        if (verificationRecord.attempts >= 5) {
            return res.json({ success: false, message: "Too many failed attempts. Please request a new code." });
        }

        // Increment attempts
        verificationRecord.attempts += 1;
        await verificationRecord.save();

        // Mark code as used
        verificationRecord.isUsed = true;
        await verificationRecord.save();

        // Create the user account
        const { fullName, phoneNumber, idCard, password } = userData;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            idCard,
            isEmailVerified: true
        });

        // Send welcome email
        await sendWelcomeEmail(email, newUser);

        // Clean up verification codes for this email
        await VerificationCode.deleteMany({ email });

        res.json({
            success: true,
            message: "Email verified successfully! Your account has been created.",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                isEmailVerified: newUser.isEmailVerified
            }
        });

    } catch (error) {
        console.log("Email verification error:", error.message);
        
        if (error.code === 11000) {
            // Handle duplicate key error
            if (error.keyPattern?.email) {
                return res.json({ success: false, message: "Email already registered" });
            }
            if (error.keyPattern?.idCard) {
                return res.json({ success: false, message: "ID card already registered" });
            }
        }
        
        res.json({ success: false, message: "Verification failed. Please try again." });
    }
};

// Resend verification code
export const resendVerificationCode = async (req, res) => {
    const { email, fullName } = req.body;
    
    try {
        if (!email || !fullName) {
            return res.json({ success: false, message: "Email and full name are required" });
        }

        // Check if user already exists and is verified
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.isEmailVerified) {
            return res.json({ success: false, message: "Email already verified. Please login." });
        }

        // Delete existing codes
        await VerificationCode.deleteMany({ email });

        // Generate new code
        const verificationCode = generateVerificationCode();

        // Create new verification record
        await VerificationCode.create({
            email,
            code: verificationCode,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });

        // Send email
        await sendVerificationEmail(email, verificationCode, fullName);

        res.json({
            success: true,
            message: "New verification code sent to your email"
        });

    } catch (error) {
        console.log("Resend verification error:", error.message);
        res.json({ success: false, message: "Failed to resend verification code" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName, phoneNumber } = req.body;
        const userId = req.user._id;

        // Validate image size if provided (4MB limit to match server limit)
        if (profilePic) {
            const base64Data = profilePic.replace(/^data:image\/[a-z]+;base64,/, '');
            const imageSize = (base64Data.length * 3) / 4; // Calculate size in bytes
            const maxSize = 4 * 1024 * 1024; // 4MB in bytes (matching server limit)

            if (imageSize > maxSize) {
                return res.json({
                    success: false,
                    message: 'Image size too large. Please choose an image smaller than 4MB.',
                });
            }

            // Validate image format
            const imageFormat = profilePic.match(/^data:image\/([a-zA-Z]*);base64,/);
            if (!imageFormat) {
                return res.json({
                    success: false,
                    message: 'Invalid image format. Please upload a valid image file.',
                });
            }

            const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
            if (!allowedFormats.includes(imageFormat[1].toLowerCase())) {
                return res.json({
                    success: false,
                    message: 'Unsupported image format. Please use JPEG, PNG, or WEBP.',
                });
            }
        }

        // Find user first to check if exists
        const user = await User.findById(userId);
        if (!user) {
            return res.json({
                success: false,
                message: 'User not found',
            });
        }

        // Prepare update object
        const updateData = {};
        if (fullName) updateData.fullName = fullName.trim();
        if (bio) updateData.bio = bio.trim();
        if (phoneNumber) updateData.phoneNumber = phoneNumber.trim();

        // Handle profile picture upload to Cloudinary
        if (profilePic) {
            try {
                // Delete old image from Cloudinary if exists
                if (user.profilePic) {
                    const publicIdMatch = user.profilePic.match(/\/([^\/]+)\.[^.]+$/);
                    if (publicIdMatch) {
                        const publicId = `rentifi/profiles/${publicIdMatch[1]}`;
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Upload new image to Cloudinary with optimization
                const uploadResult = await cloudinary.uploader.upload(profilePic, {
                    folder: 'rentifi/profiles',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                        { quality: 'auto:good' }
                    ],
                });

                updateData.profilePic = uploadResult.secure_url;
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                return res.json({
                    success: false,
                    message: 'Failed to upload image. Please try again.',
                });
            }
        }

        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.json({
                success: false,
                message: 'Failed to update profile',
            });
        }

        console.log('Profile updated successfully for user:', userId);
        console.log('Updated data:', updateData);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });

    } catch (error) {
        console.error('Update profile error:', error);
        
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.json({
                success: false,
                message: 'Invalid data provided',
            });
        }
        
        if (error.message.includes('PayloadTooLargeError')) {
            return res.json({
                success: false,
                message: 'Image size too large. Please choose an image smaller than 4MB.',
            });
        }

        res.json({
            success: false,
            message: 'Failed to update profile. Please try again.',
        });
    }
}