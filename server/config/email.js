// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Debug: Check if environment variables are loaded
console.log('Environment check:', {
  EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
  EMAIL_APP_PASSWORD: process.env.EMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing',
  NODE_ENV: process.env.NODE_ENV
});

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development'
});

// Only verify if credentials are available
if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  console.log('🔍 Verifying email transporter with credentials:', {
    user: process.env.EMAIL_USER,
    passwordLength: process.env.EMAIL_APP_PASSWORD?.length || 0
  });
  
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email transporter verification failed:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      
      // Specific error messages for common issues
      if (error.code === 'EAUTH') {
        console.error('🔐 Authentication failed. Check your email and app password.');
        console.error('💡 Make sure you have:');
        console.error('   - Enabled 2-factor authentication on Gmail');
        console.error('   - Generated an app-specific password (not your regular password)');
        console.error('   - Used the correct email address');
      }
    } else {
      console.log('✅ Email transporter is ready to send messages');
    }
  });
} else {
  console.warn('⚠️ Email credentials not found. Email functionality will be disabled.');
  console.warn('Missing:', {
    EMAIL_USER: !process.env.EMAIL_USER,
    EMAIL_APP_PASSWORD: !process.env.EMAIL_APP_PASSWORD
  });
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Booking Confirmed!</h2>
        <p>Hello ${user.fullName},</p>
        <p>Your booking for <strong>${property.title}</strong> has been confirmed.</p>
        <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${booking.totalPrice}</p>
        <br>
        <p>Thank you for choosing Rentifi!</p>
      </div>
    `
  }),
  passwordReset: (user, resetToken) => ({
    subject: 'Password Reset Request - Rentifi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${user.fullName},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
             style="background-color: #A0937D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a></p>
        <p>This link will expire in 1 hour.</p>
        <br>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  })
};

export default transporter;