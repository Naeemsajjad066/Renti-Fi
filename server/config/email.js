// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Only verify if credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email service unavailable:', error.message);
      if (error.code === 'EAUTH') {
        console.error('🔐 Check email credentials and app password');
      }
    } else {
      console.log('✅ Email service ready');
    }
  });
} else {
  console.warn('⚠️ Email credentials missing');
}

// Email templates
export const emailTemplates = {
  verification: (code, fullName) => ({
    subject: 'Verify Your Email - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName}!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for registering with Rentifi. To complete your account setup, please verify your email address using the code below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px dashed #A0937D; padding: 20px; border-radius: 8px; display: inline-block;">
              <h1 style="color: #A0937D; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px;">${code}</h1>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin: 20px 0;">
            This code will expire in <strong>10 minutes</strong>
          </p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> If you didn't request this verification, please ignore this email.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  }),
  welcome: (user) => ({
    subject: 'Welcome to Rentifi!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Rentifi, ${user.fullName}!</h2>
        <p>Thank you for joining our community of hosts and guests.</p>
        <p>Your account has been successfully created with ID: ${user.idCardNumber}</p>
        <p>Start exploring properties or list your own space to begin earning!</p>
        <br>
        <p>Best regards,<br>The Rentifi Team</p>
      </div>
    `
  }),
  bookingConfirmation: (booking, property, user) => ({
    subject: 'Booking Confirmation - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Booking Confirmed!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hello ${user.fullName}, your booking for <strong>${property.title}</strong> has been confirmed.
          </p>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #A0937D; margin-top: 0;">Booking Details</h3>
            <p><strong>Property:</strong> ${property.title}</p>
            <p><strong>Location:</strong> ${property.city || property.address}</p>
            <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${booking.guests?.adults || booking.guests}</p>
            <p><strong>Nights:</strong> ${booking.nights}</p>
            <p style="font-size: 18px; color: #A0937D;"><strong>Total Amount:</strong> Rs ${booking.totalPrice?.toLocaleString()}</p>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> Please save this confirmation email for your records. You may need to show it during check-in.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Thank you for choosing Rentifi!<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  }),
  passwordReset: (resetCode, fullName) => ({
    subject: 'Password Reset Request - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hello ${fullName}, you requested to reset your password. Use the code below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px dashed #A0937D; padding: 20px; border-radius: 8px; display: inline-block;">
              <h1 style="color: #A0937D; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px;">${resetCode}</h1>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin: 20px 0;">
            This code will expire in <strong>15 minutes</strong>
          </p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Security Note:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  }),
  propertyApproval: (data) => ({
    subject: '✅ Your Property Has Been Approved - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #d4edda; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 48px;">✅</span>
            </div>
          </div>
          
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">Property Approved!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hello ${data.hostName},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Great news! Your property listing "<strong>${data.propertyTitle}</strong>" has been verified and approved by our admin team.
          </p>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Your property is now <strong>live</strong> and visible to guests</li>
              <li>Start receiving booking requests</li>
              <li>Keep your calendar updated</li>
              <li>Respond promptly to inquiries</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/host/dashboard" 
               style="background-color: #A0937D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              View Your Dashboard
            </a>
          </div>
          
          <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
            <p style="color: #004085; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> High-quality photos and detailed descriptions help attract more bookings. Consider adding more amenity details to stand out!
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Congratulations on your approval!<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  }),
  propertyRejection: (data) => ({
    subject: '⚠️ Property Verification Update - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #fff3cd; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 48px;">⚠️</span>
            </div>
          </div>
          
          <h2 style="color: #856404; text-align: center; margin-bottom: 20px;">Property Verification Needed</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hello ${data.hostName},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for submitting your property listing "<strong>${data.propertyTitle}</strong>". After careful review, we need some additional information or corrections before we can approve your listing.
          </p>
          
          <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Reason for Review:</h3>
            <p style="color: #856404; font-size: 15px; line-height: 1.6; margin: 0;">
              ${data.rejectionReason}
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Next Steps:</h3>
            <ol style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Review the feedback above</li>
              <li>Update your property listing with the necessary corrections</li>
              <li>Resubmit your property for verification</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/host/dashboard" 
               style="background-color: #A0937D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Update Your Listing
            </a>
          </div>
          
          <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0;">
            <p style="color: #004085; margin: 0; font-size: 14px;">
              <strong>Need Help?</strong> If you have questions about the verification process or need assistance, please contact our support team.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We're here to help!<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  })
};

export default transporter;