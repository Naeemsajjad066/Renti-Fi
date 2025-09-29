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
  })
};

export default transporter;