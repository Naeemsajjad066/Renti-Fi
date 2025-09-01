// config/email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

// Email templates
export const emailTemplates = {
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