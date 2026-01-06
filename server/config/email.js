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
  },
  // Add connection timeout settings for production
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,
  socketTimeout: 10000
});

// Only verify if credentials are available - don't block server startup
if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  // Use a timeout to prevent blocking server startup
  const verifyTimeout = setTimeout(() => {
    console.warn('⚠️ Email service verification timeout - continuing without verification');
  }, 10000);

  transporter.verify((error) => {
    clearTimeout(verifyTimeout);
    if (error) {
      console.error('❌ Email service unavailable:', error.message);
      if (error.code === 'EAUTH') {
        console.error('🔐 Check email credentials and app password');
      }
      // Don't throw error, just log and continue
    } else {
      console.log('✅ Email service ready');
    }
  });
} else {
  console.warn('⚠️ Email credentials missing - email features will be disabled');
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
    subject: `Booking Confirmed - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #d4edda; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 48px;">✓</span>
            </div>
          </div>
          
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">Booking Confirmed!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; text-align: center;">
            Hello ${user.fullName}, your booking has been confirmed.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #e3f2fd; border: 3px solid #2196f3; padding: 25px; border-radius: 12px; display: inline-block;">
              <p style="color: #1976d2; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">YOUR VERIFICATION CODE</p>
              <h1 style="color: #2196f3; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 12px;">${booking.verificationCode}</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 13px;">Show this code to your host at check-in</p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #A0937D; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;"><strong>Property:</strong></td><td style="padding: 8px 0; color: #333;">${property.title}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td><td style="padding: 8px 0; color: #333;">${property.city || property.address}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Check-in:</strong></td><td style="padding: 8px 0; color: #333;">${new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at 9:00 AM</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Check-out:</strong></td><td style="padding: 8px 0; color: #333;">${new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} before 9:00 AM</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Guests:</strong></td><td style="padding: 8px 0; color: #333;">${booking.guests?.adults || booking.guests} Adults</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Nights:</strong></td><td style="padding: 8px 0; color: #333;">${booking.nights}</td></tr>
              <tr><td style="padding: 16px 0 8px 0; color: #A0937D; font-size: 18px;"><strong>Total Amount:</strong></td><td style="padding: 16px 0 8px 0; color: #A0937D; font-size: 18px;"><strong>Rs ${booking.totalPrice?.toLocaleString()}</strong></td></tr>
            </table>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> Save this email and your verification code. You'll need to show it to your host during check-in.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/bookings" style="display: inline-block; background-color: #A0937D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Booking Details</a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
            Thank you for choosing Rentifi!<br>
            <strong>The Rentifi Team</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  hostBookingNotification: (booking, property, guest, host) => ({
    subject: `New Booking Received - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #A0937D; font-size: 32px; margin: 0;">Rentifi</h1>
            <p style="color: #666; margin: 5px 0;">Your trusted rental platform</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #d4edda; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 48px;">🏠</span>
            </div>
          </div>
          
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">New Booking Received!</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5; text-align: center;">
            Hello ${host.fullName}, you have a new booking for your property.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #e8f5e9; border: 3px solid #4caf50; padding: 25px; border-radius: 12px; display: inline-block;">
              <p style="color: #2e7d32; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">GUEST VERIFICATION CODE</p>
              <h1 style="color: #4caf50; font-size: 42px; font-weight: bold; margin: 0; letter-spacing: 12px;">${booking.verificationCode}</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 13px;">Ask guest to show this code at check-in</p>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #A0937D; margin-top: 0;">Guest Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;"><strong>Name:</strong></td><td style="padding: 8px 0; color: #333;">${guest.fullName}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td><td style="padding: 8px 0; color: #333;">${guest.email}</td></tr>
              ${guest.phoneNumber ? `<tr><td style="padding: 8px 0; color: #666;"><strong>Phone:</strong></td><td style="padding: 8px 0; color: #333;">${guest.phoneNumber}</td></tr>` : ''}
            </table>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #A0937D; margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;"><strong>Property:</strong></td><td style="padding: 8px 0; color: #333;">${property.title}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Check-in:</strong></td><td style="padding: 8px 0; color: #333;">${new Date(booking.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at 9:00 AM</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Check-out:</strong></td><td style="padding: 8px 0; color: #333;">${new Date(booking.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} before 9:00 AM</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Guests:</strong></td><td style="padding: 8px 0; color: #333;">${booking.guests?.adults || booking.guests} Adults${booking.guests?.children ? `, ${booking.guests.children} Children` : ''}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;"><strong>Nights:</strong></td><td style="padding: 8px 0; color: #333;">${booking.nights}</td></tr>
              <tr><td style="padding: 16px 0 8px 0; color: #A0937D; font-size: 18px;"><strong>Total Amount:</strong></td><td style="padding: 16px 0 8px 0; color: #A0937D; font-size: 18px;"><strong>Rs ${booking.totalPrice?.toLocaleString()}</strong></td></tr>
              ${booking.hostPayout ? `<tr><td style="padding: 8px 0; color: #4caf50; font-size: 16px;"><strong>Your Payout:</strong></td><td style="padding: 8px 0; color: #4caf50; font-size: 16px;"><strong>Rs ${booking.hostPayout?.toLocaleString()}</strong></td></tr>` : ''}
            </table>
          </div>
          
          ${booking.specialRequests ? `
          <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <p style="color: #1976d2; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Special Requests:</p>
            <p style="color: #666; margin: 0; font-size: 14px;">${booking.specialRequests}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Reminder:</strong> Please prepare your property for the guest's arrival and verify their code at check-in.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/host/bookings" style="display: inline-block; background-color: #A0937D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Booking Details</a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px; text-align: center;">
            Best regards,<br>
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