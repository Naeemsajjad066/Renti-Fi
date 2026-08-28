// config/email.js
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend — it gracefully handles missing API keys
const resend = new Resend(process.env.RESEND_API_KEY);

// Check if Resend is configured
const emailEnabled = !!(
  process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here'
);

// Default from address — Resend requires a verified domain
const FROM_ADDRESS = process.env.FROM_EMAIL || 'noreply@yourdomain.com';

// Validate configuration on startup (non-blocking)
if (emailEnabled) {
  console.log('✅ Resend email service configured');
  console.log(`📧 From address: ${FROM_ADDRESS}`);

  // Optional: Test API key validity (doesn't delay startup)
  setImmediate(async () => {
    try {
      // Resend domains endpoint to verify API key without sending email
      await resend.domains.list();
      console.log('✅ Resend API key validated');
    } catch (error) {
      console.warn('⚠️  Resend API key validation failed:', error.message);
      console.warn('   Check RESEND_API_KEY in your environment variables.');
    }
  });
} else {
  console.warn('⚠️  RESEND_API_KEY not configured — email features disabled.');
  console.warn('   Get your API key at: https://resend.com/api-keys');
}

// Email templates (keeping existing structure)
export const emailTemplates = {
  verification: (code, fullName) => ({
    subject: 'Verify Your Email - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Rentifi</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Premium Rental Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${fullName || 'there'}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">Welcome to Rentifi! Please verify your email address to complete your account setup.</p>
          
          <div style="background: white; border: 2px dashed #A0937D; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;">Your verification code:</p>
            <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #A0937D; letter-spacing: 3px;">${code}</div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">This code will expire in 10 minutes. If you didn't create this account, you can safely ignore this email.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetCode, fullName) => ({
    subject: 'Reset Your Password - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Rentifi</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${fullName || 'there'}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">We received a request to reset your password. Use the code below to set a new password for your account.</p>
          
          <div style="background: white; border: 2px dashed #A0937D; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;">Your reset code:</p>
            <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #A0937D; letter-spacing: 3px;">${resetCode}</div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">This code will expire in 15 minutes. If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  welcome: (user) => ({
    subject: 'Welcome to Rentifi! 🏡',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Rentifi! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Journey Starts Here</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${user.fullName || user.name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">Thank you for joining Rentifi, Pakistan's premier rental platform. We're excited to help you find your perfect stay or share your space with travelers.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #A0937D; margin: 20px 0;">
            <h3 style="color: #A0937D; margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Browse thousands of verified properties</li>
              <li>Book instantly with secure payments</li>
              <li>List your own property to earn extra income</li>
              <li>Connect with hosts and travelers nationwide</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
          <p>Need help? Contact us at support@rentifi.com</p>
        </div>
      </div>
    `,
  }),

  bookingConfirmation: (booking, property, user) => ({
    subject: `Booking Confirmed - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! ✅</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Stay is All Set</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${user.fullName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">Great news! Your booking has been confirmed. Here are your reservation details:</p>
          
          <div style="background: white; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
            <h3 style="color: #A0937D; margin: 0 0 15px 0; font-size: 18px;">${property.title}</h3>
            <p style="color: #666; margin: 0 0 15px 0;">📍 ${property.city}, ${property.state || 'Pakistan'}</p>
            
            <div style="display: table; width: 100%; margin-top: 20px;">
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Check-in:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${new Date(booking.checkIn).toLocaleDateString()}</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Check-out:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${new Date(booking.checkOut).toLocaleDateString()}</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Guests:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${booking.guests?.adults || 1}</div>
              </div>
              <div style="display: table-row; border-top: 1px solid #e0e0e0;">
                <div style="display: table-cell; padding: 15px 0 8px 0; color: #333; font-weight: bold;">Total Amount:</div>
                <div style="display: table-cell; padding: 15px 0 8px 0; font-weight: bold; color: #A0937D; font-size: 18px;">Rs ${booking.totalPrice?.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Your host will contact you with check-in instructions. Have a wonderful stay!</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
          <p>Questions? Contact support@rentifi.com</p>
        </div>
      </div>
    `,
  }),

  hostBookingNotification: (booking, property, guest, host) => ({
    subject: `New Booking - ${property.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">New Booking! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You Have a Guest</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${host.fullName}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">You have a new booking for your property. Here are the details:</p>
          
          <div style="background: white; padding: 25px; border-radius: 10px; border: 1px solid #e0e0e0; margin: 20px 0;">
            <h3 style="color: #A0937D; margin: 0 0 15px 0; font-size: 18px;">${property.title}</h3>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h4 style="color: #333; margin: 0 0 10px 0;">Guest: ${guest.fullName}</h4>
              <p style="color: #666; margin: 0; font-size: 14px;">📧 ${guest.email}</p>
              ${guest.phone ? `<p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">📞 ${guest.phone}</p>` : ''}
            </div>
            
            <div style="display: table; width: 100%; margin-top: 20px;">
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Check-in:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${new Date(booking.checkIn).toLocaleDateString()}</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Check-out:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${new Date(booking.checkOut).toLocaleDateString()}</div>
              </div>
              <div style="display: table-row;">
                <div style="display: table-cell; padding: 8px 0; color: #666;">Guests:</div>
                <div style="display: table-cell; padding: 8px 0; font-weight: bold; color: #333;">${booking.guests?.adults || 1}</div>
              </div>
              <div style="display: table-row; border-top: 1px solid #e0e0e0;">
                <div style="display: table-cell; padding: 15px 0 8px 0; color: #333; font-weight: bold;">Total Earnings:</div>
                <div style="display: table-cell; padding: 15px 0 8px 0; font-weight: bold; color: #A0937D; font-size: 18px;">Rs ${booking.totalPrice?.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Please reach out to your guest with check-in instructions. We hope they have a great stay!</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
          <p>Host support: support@rentifi.com</p>
        </div>
      </div>
    `,
  }),

  propertyApproval: (data) => ({
    subject: 'Property Approved - Welcome to Rentifi!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Property Approved! ✅</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Listing is Now Live</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Congratulations!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">Your property <strong>${data.title || 'listing'}</strong> has been approved and is now visible to guests on Rentifi.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #A0937D; margin: 20px 0;">
            <h3 style="color: #A0937D; margin: 0 0 15px 0;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Your property is now searchable by potential guests</li>
              <li>You'll receive email notifications for new bookings</li>
              <li>Keep your calendar updated for accurate availability</li>
              <li>Respond to guest inquiries promptly</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Thank you for choosing Rentifi. We're excited to help you connect with travelers!</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
          <p>Host support: support@rentifi.com</p>
        </div>
      </div>
    `,
  }),

  propertyRejection: (data) => ({
    subject: 'Property Review - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #A0937D 0%, #E3CDC1 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Property Review</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Updates Needed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hi there!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">Thank you for submitting your property <strong>${data.title || 'listing'}</strong> to Rentifi. We've completed our review and need a few updates before we can approve your listing.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #e74c3c; margin: 20px 0;">
            <h3 style="color: #e74c3c; margin: 0 0 15px 0;">Required Updates:</h3>
            <p style="color: #666; line-height: 1.6;">${data.rejectionReason || 'Please ensure all property details are accurate and complete, including high-quality photos and detailed descriptions.'}</p>
          </div>
          
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Once you've made these updates, please resubmit your listing and we'll review it again promptly.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>© 2024 Rentifi. All rights reserved.</p>
          <p>Questions? Contact support@rentifi.com</p>
        </div>
      </div>
    `,
  }),
};

export { resend, emailEnabled, FROM_ADDRESS };
export default { resend, emailEnabled, FROM_ADDRESS, emailTemplates };
